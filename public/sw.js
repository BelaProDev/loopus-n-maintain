importScripts('./sw/cache-strategies.ts');
importScripts('./sw/cache-manager.ts');
importScripts('../src/lib/db-sync.ts');

const dbSync = new DBSync();

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      initializeCache(),
      dbSync.initializeDB()
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
  if (event.tag === SYNC_TAG) {
    event.waitUntil(dbSync.triggerSync());
  }
});

self.addEventListener('fetch', (event) => {
  event.respondWith(handleFetchRequest(event));
});