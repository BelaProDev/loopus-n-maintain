import { networkFirst, cacheFirst, staleWhileRevalidate } from './cache-strategies';

const CACHE_VERSION = '1';
const CACHE_NAME = `loopusandmaintain-v${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/forest-lidar.png',
  '/masked-icon.svg',
  '/vite.svg'
];

export async function initializeCache() {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll(STATIC_ASSETS);
}

export async function clearOldCaches() {
  const keys = await caches.keys();
  return Promise.all(
    keys.map((key) => {
      if (key !== CACHE_NAME) {
        return caches.delete(key);
      }
    })
  );
}

export async function handleFetchRequest(event: FetchEvent) {
  const url = new URL(event.request.url);
  
  // API requests
  if (url.pathname.startsWith('/api/')) {
    return staleWhileRevalidate(event.request);
  }
  
  // Static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    return cacheFirst(event.request);
  }
  
  // Navigation requests
  if (event.request.mode === 'navigate') {
    return networkFirst(event.request);
  }
  
  // Default to network-first for other requests
  return networkFirst(event.request);
}