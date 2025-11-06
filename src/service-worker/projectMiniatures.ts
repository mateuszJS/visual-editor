/* eslint-disable no-restricted-syntax */
import { cacheFirst, deleteCachedItem, getCachedKeys, putUniqueInCache } from './cacheUtils'

export async function syncProjectMiniatures() {
  const cachedKeys = await getCachedKeys()

  const tasks = cachedKeys.map(async (req) => {
    const { pathname } = new URL(req.url)

    if (pathname.startsWith('/api/project-uploads/') && pathname.includes('/miniature')) {
      const cachedRes = await caches.match(req)
      if (!cachedRes) throw new Error('No cached response found')

      const generatedAt = cachedRes.headers.get('x-sw-generated-at')
      if (!generatedAt) throw new Error('No x-sw-generated-at header found in cached response')

      const body = await cachedRes.blob()

      await fetch(req.url, {
        method: 'PUT',
        body,
        headers: {
          'Content-Type': cachedRes.headers.get('Content-Type') || 'image/png',
          'x-amz-meta-updated-at': generatedAt,
        },
      })

      // fetch above might fail(because of network for example), then data will not be removed
      await deleteCachedItem(req)
    }
  })

  return Promise.allSettled(tasks)
}

export function projectMiniatureRoute(request: Request, event: FetchEvent) {
  const cacheKey = new Request(request.url, { method: 'GET' })

  if (request.method === 'PUT') {
    const fakeResponse = new Response(request.clone().body, {
      status: 200,
      headers: {
        'x-sw-generated-at': new Date().toISOString(),
        'Content-Type': request.headers.get('Content-Type') || 'image/png',
      },
    })
    event.waitUntil(putUniqueInCache(cacheKey, fakeResponse))
    return new Response(null, { status: 204 })
  } else if (request.method === 'GET') {
    return cacheFirst(cacheKey, event)
  }

  return fetch(request)
}
