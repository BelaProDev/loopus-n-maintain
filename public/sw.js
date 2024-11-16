const CACHE_NAME = 'loopus-maintain-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

let dropboxTokens = null;

self.addEventListener('message', (event) => {
  if (event.data.type === 'STORE_DROPBOX_TOKENS') {
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

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('api.dropboxapi.com')) {
    event.respondWith((async () => {
      if (!dropboxTokens) {
        const cache = await caches.open(CACHE_NAME);
        const tokenResponse = await cache.match('/_dropbox_tokens');
        if (tokenResponse) {
          dropboxTokens = await tokenResponse.json();
        }
      }

      if (!dropboxTokens?.access_token) {
        return new Response('Unauthorized', { status: 401 });
      }

      const modifiedRequest = new Request(event.request, {
        headers: {
          ...Object.fromEntries(event.request.headers.entries()),
          'Authorization': `Bearer ${dropboxTokens.access_token}`
        }
      });

      try {
        return await fetch(modifiedRequest);
      } catch (error) {
        return new Response('Network error', { status: 503 });
      }
    })());
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
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