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
  if (event.request.method !== 'GET') {
    return handleNonGetRequest(event);
  }

  if (event.request.url.includes('/api/')) {
    return handleApiRequest(event);
  }

  if (event.request.mode === 'navigate') {
    return handleNavigationRequest(event);
  }

  return handleStaticAssetRequest(event);
}

async function handleNonGetRequest(event: FetchEvent) {
  if (navigator.onLine) {
    try {
      return await fetch(event.request);
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Offline, changes will sync when online' 
      }));
    }
  }
  return new Response(JSON.stringify({ 
    error: 'Offline, changes will sync when online' 
  }));
}

async function handleApiRequest(event: FetchEvent) {
  const cachedResponse = await caches.match(event.request);
  const networkPromise = fetch(event.request).then(response => {
    const clone = response.clone();
    caches.open(CACHE_NAME)
      .then(cache => cache.put(event.request, clone));
    return response;
  });

  if (cachedResponse) {
    networkPromise.catch(() => {});
    return cachedResponse;
  }

  return networkPromise.catch(() => caches.match(event.request));
}

async function handleNavigationRequest(event: FetchEvent) {
  try {
    const response = await fetch(event.request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(event.request, response.clone());
    return response;
  } catch (error) {
    return caches.match(event.request);
  }
}

async function handleStaticAssetRequest(event: FetchEvent) {
  const cachedResponse = await caches.match(event.request);
  if (cachedResponse) return cachedResponse;

  const response = await fetch(event.request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(event.request, response.clone());
  return response;
}