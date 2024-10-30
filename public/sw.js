const CACHE_VERSION = '1';
const CACHE_NAME = `loopusandmaintain-v${CACHE_VERSION}`;
const DB_VERSION = '1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/forest-lidar.png',
  '/masked-icon.svg',
  '/vite.svg'
];

const DB_TABLES = ['emails', 'content', 'clients', 'providers', 'invoices', 'whatsapp-numbers'];

// Background sync registration
const SYNC_TAG = 'db-sync';

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
      // Cache initial fallback DB data with version
      ...DB_TABLES.map(table => 
        caches.open(CACHE_NAME).then(cache => 
          cache.put(`/api/${table}`, new Response(JSON.stringify({
            version: DB_VERSION,
            data: []
          }), {
            headers: { 'Content-Type': 'application/json' }
          }))
        )
      )
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => {
      // Register for background sync if supported
      if ('sync' in self.registration) {
        return self.registration.sync.register(SYNC_TAG);
      }
    })
  );
  return self.clients.claim();
});

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(syncDatabase());
  }
});

async function syncDatabase() {
  const pendingChanges = await getPendingChanges();
  if (pendingChanges.length === 0) return;

  try {
    for (const change of pendingChanges) {
      await syncChange(change);
    }
    await clearPendingChanges();
  } catch (error) {
    console.error('Sync failed:', error);
    // Retry will be automatic due to sync event
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    // For non-GET requests, try to sync immediately if online
    if (navigator.onLine) {
      event.respondWith(
        fetch(event.request)
          .catch(error => {
            // Store failed requests for later sync
            return storeForSync(event.request.clone())
              .then(() => new Response(JSON.stringify({ 
                error: 'Offline, changes will sync when online' 
              })));
          })
      );
      return;
    }
    // If offline, store for later sync
    event.respondWith(
      storeForSync(event.request.clone())
        .then(() => new Response(JSON.stringify({ 
          error: 'Offline, changes will sync when online' 
        })))
    );
    return;
  }

  // Handle API/DB requests with versioning
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.match(event.request)
        .then(async (response) => {
          const networkPromise = fetch(event.request).then(response => {
            const clone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, clone));
            return response;
          });

          // Return cached response immediately if available
          if (response) {
            // Check version and update in background if needed
            networkPromise.then(async newResponse => {
              const cachedData = await response.clone().json();
              const newData = await newResponse.clone().json();
              if (newData.version !== cachedData.version) {
                const cache = await caches.open(CACHE_NAME);
                await cache.put(event.request, newResponse);
              }
            }).catch(() => {});
            return response;
          }

          return networkPromise.catch(() => {
            return caches.match(event.request);
          });
        })
    );
    return;
  }

  // Network-first strategy for dynamic routes
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        }))
  );
});

// Utility functions for sync
async function getPendingChanges() {
  const db = await openDB();
  return db.getAll('pendingChanges');
}

async function clearPendingChanges() {
  const db = await openDB();
  return db.clear('pendingChanges');
}

async function storeForSync(request) {
  const db = await openDB();
  return db.add('pendingChanges', {
    url: request.url,
    method: request.method,
    body: await request.clone().text(),
    timestamp: Date.now()
  });
}

async function syncChange(change) {
  return fetch(change.url, {
    method: change.method,
    body: change.body,
    headers: { 'Content-Type': 'application/json' }
  });
}

// IndexedDB setup for sync
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SyncDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingChanges')) {
        db.createObjectStore('pendingChanges', { keyPath: 'timestamp' });
      }
    };
  });
}