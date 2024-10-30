// Cache strategies and managers are now imported as modules
import { networkFirst, cacheFirst, staleWhileRevalidate } from './sw/cache-strategies.ts';
import { initializeCache, clearOldCaches, handleFetchRequest } from './sw/cache-manager.ts';
import { DBSync } from '../src/lib/db-sync';

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
        return self.registration.sync.register('db-sync');
      }
    })
  );
  return self.clients.claim();
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'db-sync') {
    event.waitUntil(dbSync.triggerSync());
  }
});

self.addEventListener('fetch', (event) => {
  event.respondWith(handleFetchRequest(event));
});