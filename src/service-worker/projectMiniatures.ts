/* eslint-disable no-restricted-syntax */
import { cacheFirst, deleteCachedItem, getCachedKeys, putUniqueInCache } from './cacheUtils'

async function getMiniatureCachedKeys() {
  const cachedKeys = await getCachedKeys()
  return cachedKeys.filter((req) => {
    const { pathname } = new URL(req.url)
    return pathname.startsWith('/api/project-uploads/') && pathname.includes('/miniature')
  })
}

export async function clearProjectMiniatures() {
  const miniaturesCachedKeys = await getMiniatureCachedKeys()
  const tasks = miniaturesCachedKeys.map((req) => deleteCachedItem(req))
  return Promise.allSettled(tasks)
}

export async function syncProjectMiniatures() {
  const miniaturesCachedKeys = await getMiniatureCachedKeys()

  const tasks = miniaturesCachedKeys.map(async (req) => {
    const cachedRes = await caches.match(req)
    if (!cachedRes) throw new Error('No cached response found')

    const updatedAtHeader = cachedRes.headers.get('x-amz-meta-updated-at')
    if (!updatedAtHeader)
      throw new Error('No x-amz-meta-updated-at header found in cached response')

    const body = await cachedRes.blob()

    await fetch(req.url, {
      method: 'PUT',
      body,
      headers: {
        'Content-Type': cachedRes.headers.get('Content-Type') || 'image/png',
        'x-amz-meta-updated-at': updatedAtHeader,
      },
    })

    // fetch above might fail(because of network for example), then data will not be removed
    await deleteCachedItem(req)
  })

  return Promise.allSettled(tasks)
}

export function projectMiniatureRoute(request: Request, event: FetchEvent) {
  const cacheKey = new Request(request.url, { method: 'GET' })

  if (request.method === 'PUT') {
    const fakeResponse = new Response(request.clone().body, {
      status: 200,
      headers: {
        'x-amz-meta-updated-at':
          request.headers.get('x-amz-meta-updated-at') || new Date().toISOString(),
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
