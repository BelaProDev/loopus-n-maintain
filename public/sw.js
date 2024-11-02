const CACHE_NAME = 'craft-coordination-v1';
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
  '/login'
];

let dropboxTokens = null;

const requiresAuth = (url) => {
  return ['/koalax'].some(path => url.includes(path));
};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'STORE_DROPBOX_TOKENS') {
    dropboxTokens = event.data.tokens;
    caches.open(CACHE_NAME).then(cache => {
      cache.put('/_dropbox_tokens', new Response(JSON.stringify(dropboxTokens)));
    });
  } else if (event.data.type === 'GET_DROPBOX_TOKENS') {
    event.ports[0].postMessage({ tokens: dropboxTokens });
  } else if (event.data.type === 'REMOVE_DROPBOX_TOKENS') {
    dropboxTokens = null;
    caches.open(CACHE_NAME).then(cache => cache.delete('/_dropbox_tokens'));
  }
});

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    try {
      if (requiresAuth(event.request.url)) {
        const session = await clients.matchAll()
          .then(clients => clients.some(client => 
            client.url.includes('craft_coordination_session=true')
          ));
        if (!session) return Response.redirect('/login', 302);
      }
      const response = await fetch(event.request);
      if (response.ok && response.type === 'basic') {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch (error) {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) return cachedResponse;
      if (event.request.mode === 'navigate') return caches.match('/index.html');
      return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
    }
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(cacheNames.map(cacheName => {
        if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
      }))
    )
  );
  return self.clients.claim();
});