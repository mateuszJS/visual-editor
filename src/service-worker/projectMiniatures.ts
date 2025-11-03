/* eslint-disable no-restricted-syntax */
import { cacheFirst, deleteCachedItem, getCachedKeys, putUniqueInCache } from './cacheUtils'

export async function syncProjectMiniatures() {
  try {
    const cachedKeys = await getCachedKeys()

    const tasks = cachedKeys.map(async (req) => {
      const { pathname } = new URL(req.url)

      if (pathname.startsWith('/api/project-uploads/') && pathname.includes('/miniature')) {
        console.log('start sync: ', req.url)
        const cachedRes = await caches.match(req)
        if (!cachedRes) throw new Error('No cached response found')

        const generatedAt = cachedRes.headers.get('x-sw-generated-at')
        if (!generatedAt) throw new Error('No x-sw-generated-at header found in cached response')

        const body = await cachedRes.blob()

        const res = await fetch(req.url, {
          method: 'PUT',
          body,
          headers: {
            'Content-Type': cachedRes.headers.get('Content-Type') || 'image/png',
            'x-amz-meta-updated-at': generatedAt,
          },
        })
        console.log('sync response: ', res)

        if (res.ok || res.status === 403 || res.status === 404) {
          // in any other case we are not sure what happen,
          // so better to do not remove local copy
          await deleteCachedItem(req)
        }
      }
    })

    return Promise.allSettled(tasks)
  } catch (error) {
    console.error('Error while syncing project miniatures: ', error)
  }
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
