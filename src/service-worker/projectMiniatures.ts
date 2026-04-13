/* eslint-disable no-restricted-syntax */
import { cacheFirst, deleteCachedItem, getCachedKeys, putUniqueInCache } from './cacheUtils'
import { getIsMiniature } from './utils'

async function getMiniatureCachedKeys() {
  const cachedKeys = await getCachedKeys()
  return cachedKeys.filter((req) => {
    const { pathname } = new URL(req.url)
    return getIsMiniature(pathname)
  })
}

function getHeaders(source: Request | Response): HeadersInit {
  const updatedAt = source.headers.get('x-amz-meta-updated-at')
  if (!updatedAt) throw new Error('Missing x-amz-meta-updated-at header')

  const contentType = source.headers.get('Content-Type')
  if (!contentType) throw new Error('Missing Content-Type header')

  return {
    'x-amz-meta-updated-at': updatedAt,
    'Content-Type': contentType,
  }
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

    const body = await cachedRes.blob()

    const res = await fetch(req.url, {
      method: 'PUT',
      body,
      headers: getHeaders(cachedRes),
    })

    // fetch above might throw error (because of network for example), then data will not be removed
    if (res.ok || res.status === 403 || res.status === 404) {
      await deleteCachedItem(req)
    } else {
      throw Error(`Failed to sync miniature: ${res.status} ${res.statusText}`)
    }
  })

  return Promise.allSettled(tasks)
}

export function projectMiniatureRoute(request: Request, event: FetchEvent) {
  const cacheKey = new Request(request.url, { method: 'GET' })

  if (request.method === 'PUT') {
    const fakeResponse = new Response(request.clone().body, {
      status: 200,
      headers: getHeaders(request),
    })
    event.waitUntil(putUniqueInCache(cacheKey, fakeResponse))
    return new Response(null, { status: 204 })
  } else if (request.method === 'GET') {
    return cacheFirst(cacheKey, event)
  }

  return fetch(request)
}
