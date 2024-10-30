importScripts('./sw/cache-manager.ts');
importScripts('./sw/db-sync.ts');

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      initializeCache(),
      initializeDB()
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    clearOldCaches().then(() => {
      if ('sync' in self.registration) {
        return self.registration.sync.register(SYNC_TAG);
      }
    })
  );
  return self.clients.claim();
});

self.addEventListener('sync', (event) => {
  event.waitUntil(handleSync(event));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(handleFetchRequest(event));
});