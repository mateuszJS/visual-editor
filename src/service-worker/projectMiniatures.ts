/* eslint-disable no-restricted-syntax */
import { cacheFirst, deleteCachedItem, getCachedKeys, putInCache } from './cacheUtils'

export async function syncProjectMiniatures() {
  const cachedKeys = await getCachedKeys()

  const tasks = cachedKeys.map(async (req) => {
    const { pathname } = new URL(req.url)
    if (pathname.startsWith('/api/project-uploads/') && pathname.includes('/miniature')) {
      const cachedRes = await caches.match(req)
      if (!cachedRes) throw new Error('No cached response found')

      const res = await fetch(req.url, { method: 'PUT', body: cachedRes.body })

      if (res.ok || res.status === 403 || res.status === 404) {
        // in any other case we are not sure what happen,
        // so better to do not remove local copy
        await deleteCachedItem(req)
      }
    }
  })

  return Promise.allSettled(tasks)
}

export function projectMiniatureRoute(request: Request, pathname: string, event: FetchEvent) {
  const cacheKey = new Request(pathname, { method: 'GET' })

  if (request.method === 'PUT') {
    const fakeResponse = new Response(request.clone().body, {
      status: 200,
      headers: { 'Content-Type': request.headers.get('Content-Type') || 'image/png' },
    })
    event.waitUntil(putInCache(cacheKey, fakeResponse))
    return new Response(null, { status: 204 })
  } else if (request.method === 'GET') {
    return cacheFirst(cacheKey, event)
  }

  return fetch(request)
}
