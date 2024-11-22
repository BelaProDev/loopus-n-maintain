const CACHE_NAME = 'loopus-maintain-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/masked-icon.svg',
  '/forest-lidar.png'
];

let dropboxTokens = null;

self.addEventListener('message', (event) => {
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then(cacheNames => Promise.all(cacheNames.map(cacheName => caches.delete(cacheName))))
        .then(() => event.ports[0].postMessage({ status: 'success' }))
        .catch(error => event.ports[0].postMessage({ status: 'error', message: error.message }))
    );
  } else if (event.data.type === 'STORE_DROPBOX_TOKENS') {
    dropboxTokens = event.data.tokens;
    if (dropboxTokens) {
      caches.open(CACHE_NAME).then(cache => {
        cache.put('/_dropbox_tokens', new Response(JSON.stringify(dropboxTokens)));
      });
    }
  }
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      // Try to get the response from cache first
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        // For Dropbox API requests, handle token authentication
        if (event.request.url.includes('api.dropboxapi.com')) {
          if (!dropboxTokens?.access_token) {
            return new Response('Unauthorized', { status: 401 });
          }

          const modifiedRequest = new Request(event.request, {
            headers: {
              ...Object.fromEntries(event.request.headers.entries()),
              'Authorization': `Bearer ${dropboxTokens.access_token}`
            }
          });

          return fetch(modifiedRequest);
        }

        // For all other requests, try network first
        const response = await fetch(event.request);
        
        // Cache successful GET requests
        if (event.request.method === 'GET' && response.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }
        
        return response;
      } catch (error) {
        return new Response('Network error', { status: 503 });
      }
    })()
  );
});

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

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)),
      self.skipWaiting()
    ])
  );
});