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

// Store for tokens
let dropboxTokens = null;

// Helper function to check if a request requires authentication
const requiresAuth = (url) => {
  const protectedPaths = ['/koalax'];
  return protectedPaths.some(path => url.includes(path));
};

// Install event - cache initial resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Message event - handle token storage
self.addEventListener('message', (event) => {
  if (event.data.type === 'STORE_DROPBOX_TOKENS') {
    dropboxTokens = event.data.tokens;
    // Respond to confirm storage
    event.ports[0].postMessage({ stored: true });
  } else if (event.data.type === 'GET_DROPBOX_TOKENS') {
    event.ports[0].postMessage({ tokens: dropboxTokens });
  }
});

// Fetch event - network-first strategy with auth handling
self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      try {
        // Check if request requires authentication
        if (requiresAuth(event.request.url)) {
          const session = await clients.matchAll().then(clients => 
            clients.some(client => 
              client.url.includes('craft_coordination_session=true')
            )
          );

          if (!session) {
            return Response.redirect('/login', 302);
          }
        }

        // Try network first
        const response = await fetch(event.request);
        
        // Cache successful responses
        if (response.ok && response.type === 'basic') {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }
        
        return response;
      } catch (error) {
        // Fallback to cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // For navigation requests, return index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        
        return new Response('Network error happened', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});