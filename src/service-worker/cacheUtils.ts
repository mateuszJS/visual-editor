/* eslint-disable no-restricted-syntax */

export const getCachedKeys = async () => {
  const cache = await caches.open('v0')
  return cache.keys()
}

export const putInCache = async (request: Request, response: Response) => {
  const cache = await caches.open('v0')
  await cache.put(request, response)
}

export const deleteCachedItem = async (key: Request) => {
  const cache = await caches.open('v0')
  await cache.delete(key)
}

export const cacheFirst = async (cacheKey: Request, event: FetchEvent) => {
  const request = event.request
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(cacheKey)
  if (responseFromCache) {
    return responseFromCache
  }

  try {
    const responseFromNetwork = await fetch(request)
    event.waitUntil(putInCache(cacheKey, responseFromNetwork.clone()))
    return responseFromNetwork
  } catch (error) {
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}
