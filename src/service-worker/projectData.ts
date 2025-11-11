/* eslint-disable no-restricted-syntax */
import type { ApiProjectAssetsData } from '../../apiTypes'
import { getDB } from './db'

async function getProject(
  db: IDBDatabase,
  projectId: string
): Promise<ApiProjectAssetsData | null> {
  const dbReq = db.transaction(['projects'], 'readonly').objectStore('projects').get(projectId)

  return new Promise((resolve) => {
    dbReq.onsuccess = () => resolve(dbReq.result)
    dbReq.onerror = () => resolve(null)
  })
}

export async function projectRoute(
  request: Request,
  projectId: string,
  event: FetchEvent
): Promise<Response> {
  const db = await getDB()

  if (request.method === 'GET') {
    // verify if we have a more recent version in IndexedDB
    // it's rare because normally once a browser/page/tab is closed, the update is sent to server
    // if we detect that local change is more recent, we send it to server in the background and return it to client
    const [networkRes, localRes] = await Promise.all([
      fetch(event.request).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch project from server')
        }
        return res.json() as Promise<ApiProjectAssetsData>
      }),
      getProject(db, projectId),
    ])

    if (localRes) {
      db.transaction(['projects'], 'readwrite').objectStore('projects').delete(projectId)
      if (localRes.updatedAt > networkRes.updatedAt) {
        const updateServerRequest = new Request(`/api/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(localRes),
        })
        event.waitUntil(fetch(updateServerRequest))
        return Response.json(localRes, { status: 200 })
      }
    }

    return Response.json(networkRes, { status: 200 })
  }

  if (request.method === 'PATCH') {
    const json = (await request.json()) as object
    db.transaction(['projects'], 'readwrite')
      .objectStore('projects')
      .put({
        id: projectId,
        ...json,
      })

    return new Response(null, { status: 204 })
  }

  return fetch(event.request)
}

function getAllKeys(db: IDBDatabase): Promise<string[]> {
  const dbReq = db.transaction(['projects'], 'readonly').objectStore('projects').getAllKeys()

  return new Promise((resolve) => {
    dbReq.onsuccess = () => resolve(dbReq.result as string[])
    dbReq.onerror = () => resolve([])
  })
}

/**
 * @returns true means no network error has occured,
 * false means one or more network errors happened
 */
export async function syncProjectData() {
  const db = await getDB()
  const keys = await getAllKeys(db)

  const tasks = keys.map(async (key) => {
    const project = await getProject(db, key)
    if (project) {
      // Sync the project with the server
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      })

      if (res.ok || res.status === 403 || res.status === 404) {
        // in any other case we are not sure what happen, so better to do not remove local copy
        db.transaction(['projects'], 'readwrite').objectStore('projects').delete(key)
      }
    }
  })

  const results = await Promise.allSettled(tasks)
  return results.filter((r) => r.status === 'rejected' && r.reason instanceof Error).length === 0
}

export async function clearProjectData() {
  const db = await getDB()
  db.transaction(['projects'], 'readwrite').objectStore('projects').clear()
}
