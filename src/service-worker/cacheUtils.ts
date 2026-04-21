/* eslint-disable no-restricted-syntax */

export const getCachedKeys = async () => {
  const cache = await caches.open('v0')
  return cache.keys()
}

// Puts request/response in cache by pathname!
// Removes any other existing entries with same pathname!!!
export const putUniqueInCache = async (request: Request, response: Response) => {
  try {
    const cache = await caches.open('v0')
    await cache.delete(request)
    await cache.put(request, response)
  } catch (error) {
    console.error('Error while putting in cache: ', error)
  }
}

export const deleteCachedItem = async (key: Request) => {
  const cache = await caches.open('v0')
  await cache.delete(key)
}

export const cacheFirst = async (cacheKey: Request, event: FetchEvent) => {
  const request = event.request
  // First try to get the resource from the cache
  const urlNoQueryParam = new URL(cacheKey.url)
  urlNoQueryParam.search = ''
  // passing URL should be enough but JSDOM again have problems so throws an error
  const responseFromCache = await caches.match(new Request(urlNoQueryParam))
  if (responseFromCache) {
    return responseFromCache
  }

  try {
    const responseFromNetwork = await fetch(request)
    // for now not caching network responses needed
    // event.waitUntil(putInCache(cacheKey, responseFromNetwork.clone()))
    return responseFromNetwork
  } catch (error) {
    console.log(error)
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}
