export async function networkFirst(request: Request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open('dynamic-cache');
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    throw error;
  }
}

export async function cacheFirst(request: Request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;
  
  const response = await fetch(request);
  const cache = await caches.open('static-cache');
  cache.put(request, response.clone());
  return response;
}

export async function staleWhileRevalidate(request: Request) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request).then(response => {
    const cache = await caches.open('dynamic-cache');
    cache.put(request, response.clone());
    return response;
  });

  return cachedResponse || networkResponsePromise;
}