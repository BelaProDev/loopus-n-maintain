const CACHE_NAME = 'loopus-maintain-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/forest-lidar.png',
  '/masked-icon.svg',
  '/vite.svg',
  '/electrics',
  '/plumbing',
  '/ironwork',
  '/woodwork',
  '/architecture',
  '/login',
  '/documents',
  '/diagrams',
  '/analytics',
  '/audio',
  '/invoicing',
  '/chat',
  '/photo-gallery'
];

// State management for offline data
let dropboxTokens = null;
let offlineData = {
  documents: [],
  settings: {},
  userPreferences: {}
};

// Enhanced auth check
const requiresAuth = (url) => {
  return ['/koalax', '/documents', '/analytics'].some(path => url.includes(path));
};

// Improved installation handling
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Enhanced message handling
self.addEventListener('message', (event) => {
  if (event.data.type === 'STORE_DROPBOX_TOKENS') {
    dropboxTokens = event.data.tokens;
    caches.open(CACHE_NAME).then(cache => {
      cache.put('/_dropbox_tokens', new Response(JSON.stringify(dropboxTokens)));
    });
  } else if (event.data.type === 'STORE_OFFLINE_DATA') {
    offlineData = { ...offlineData, ...event.data.data };
  } else if (event.data.type === 'GET_OFFLINE_DATA') {
    event.ports[0].postMessage({ data: offlineData });
  }
});

// Improved fetch handling with offline support
self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    try {
      // Check authentication
      if (requiresAuth(event.request.url)) {
        const session = await clients.matchAll()
          .then(clients => clients.some(client => 
            client.url.includes('craft_coordination_session=true')
          ));
        if (!session) return Response.redirect('/login', 302);
      }

      // Network first, then cache strategy
      try {
        const response = await fetch(event.request);
        if (response.ok && response.type === 'basic') {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }
        return response;
      } catch (networkError) {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          const cache = await caches.open(CACHE_NAME);
          return cache.match('/index.html');
        }
        
        return new Response('Network error', { 
          status: 408, 
          headers: { 'Content-Type': 'text/plain' } 
        });
      }
    } catch (error) {
      console.error('Service Worker fetch error:', error);
      return new Response('Service unavailable', { status: 503 });
    }
  })());
});

// Improved activation with cache cleanup
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => 
        Promise.all(cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        }))
      ),
      self.clients.claim()
    ])
  );
});

// Handle sync events for offline operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-documents') {
    event.waitUntil(syncDocuments());
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/forest-lidar.png',
    badge: '/masked-icon.svg'
  };

  event.waitUntil(
    self.registration.showNotification('Loopus & Maintain', options)
  );
});