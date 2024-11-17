const CACHE_NAME = 'loopus-maintain-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/masked-icon.svg',
  '/forest-lidar.png'
];

let dropboxTokens = null;

// Enhanced cache management
const cacheFiles = async () => {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll(urlsToCache);
};

// Improved message handler with structured responses
self.addEventListener('message', (event) => {
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then(cacheNames => Promise.all(cacheNames.map(cacheName => caches.delete(cacheName))))
        .then(() => event.ports[0].postMessage({ 
          status: 'success',
          message: 'Cache cleared successfully' 
        }))
        .catch(error => event.ports[0].postMessage({ 
          status: 'error',
          message: error.message 
        }))
    );
  } else if (event.data.type === 'STORE_DROPBOX_TOKENS') {
    dropboxTokens = event.data.tokens;
    if (dropboxTokens) {
      caches.open(CACHE_NAME).then(cache => {
        cache.put('/_dropbox_tokens', new Response(JSON.stringify(dropboxTokens)));
      });
    }
  } else if (event.data.type === 'GET_DROPBOX_TOKENS') {
    event.ports[0].postMessage({ tokens: dropboxTokens });
  }
});

// Enhanced fetch handler with better error handling
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('api.dropboxapi.com')) {
    event.respondWith((async () => {
      try {
        if (!dropboxTokens) {
          const cache = await caches.open(CACHE_NAME);
          const tokenResponse = await cache.match('/_dropbox_tokens');
          if (tokenResponse) {
            dropboxTokens = await tokenResponse.json();
          }
        }

        if (!dropboxTokens?.access_token) {
          return new Response('Unauthorized', { 
            status: 401,
            statusText: 'No valid access token found'
          });
        }

        const modifiedRequest = new Request(event.request, {
          headers: {
            ...Object.fromEntries(event.request.headers.entries()),
            'Authorization': `Bearer ${dropboxTokens.access_token}`
          }
        });

        const response = await fetch(modifiedRequest);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response;
      } catch (error) {
        return new Response(error.message, { 
          status: 503,
          statusText: 'Service Unavailable'
        });
      }
    })());
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
        .catch(() => new Response('Network error', { status: 503 }))
    );
  }
});

// Improved activation handler
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

// Add install handler
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      cacheFiles(),
      self.skipWaiting()
    ])
  );
});