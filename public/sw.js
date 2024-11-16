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

// Enhanced token management
let dropboxTokens = null;

// Token refresh function
const refreshDropboxToken = async (refresh_token) => {
  try {
    const response = await fetch('/.netlify/functions/get-dropbox-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token })
    });

    if (!response.ok) throw new Error('Token refresh failed');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

// Enhanced message handling for token management
self.addEventListener('message', (event) => {
  if (event.data.type === 'STORE_DROPBOX_TOKENS') {
    dropboxTokens = event.data.tokens;
    // Store tokens in cache for persistence
    caches.open(CACHE_NAME).then(cache => {
      cache.put('/_dropbox_tokens', new Response(JSON.stringify(dropboxTokens)));
    });
  } else if (event.data.type === 'GET_DROPBOX_TOKENS') {
    event.ports[0].postMessage({ tokens: dropboxTokens });
  }
});

// Token validation middleware
const validateToken = async (request) => {
  if (!dropboxTokens) {
    const cache = await caches.open(CACHE_NAME);
    const tokenResponse = await cache.match('/_dropbox_tokens');
    if (tokenResponse) {
      dropboxTokens = await tokenResponse.json();
    }
  }

  if (dropboxTokens && dropboxTokens.expiry < Date.now()) {
    const newTokens = await refreshDropboxToken(dropboxTokens.refresh_token);
    if (newTokens) {
      dropboxTokens = newTokens;
      caches.open(CACHE_NAME).then(cache => {
        cache.put('/_dropbox_tokens', new Response(JSON.stringify(dropboxTokens)));
      });
    }
  }

  return dropboxTokens?.access_token;
};

// Enhanced fetch handling with token validation
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('api.dropboxapi.com')) {
    event.respondWith((async () => {
      const token = await validateToken(event.request);
      if (!token) {
        return new Response('Unauthorized', { status: 401 });
      }

      const modifiedRequest = new Request(event.request, {
        headers: {
          ...Object.fromEntries(event.request.headers.entries()),
          'Authorization': `Bearer ${token}`
        }
      });

      try {
        return await fetch(modifiedRequest);
      } catch (error) {
        return new Response('Network error', { status: 503 });
      }
    })());
  } else {
    event.respondWith((async () => {
      try {
        const response = await fetch(event.request);
        if (response.ok && response.type === 'basic') {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }
        return response;
      } catch (error) {
        const cachedResponse = await caches.match(event.request);
        return cachedResponse || new Response('Network error', { status: 408 });
      }
    })());
  }
});

// Keep other service worker event handlers
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
