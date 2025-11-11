// DOCS: https://github.com/zackargyle/service-workers/blob/master/packages/service-worker-mock/README.md
// EXAMPLE USAGE: https://github.com/zackargyle/service-workers/blob/master/packages/service-worker-mock/__tests__/basic.js
import { waitFor } from './testing-utils'
import { getDB } from './db'

describe('Service worker', () => {
  async function getAllProjectsFromIDB() {
    const db = await getDB()
    return new Promise<null | unknown[]>((resolve) => {
      const dbReq = db.transaction(['projects'], 'readonly').objectStore('projects').getAll()
      dbReq.onsuccess = () => resolve(dbReq.result)
      dbReq.onerror = () => resolve(null)
    })
  }

  describe('miniatures - PUT /api/project-uploads/1/miniature', () => {
    it('throws error if content-type header is missing', async () => {
      const blob = new Blob(['local-image-data'], { type: 'image/png' })
      await import('./sw')
      const putRequest = new Request('x:/api/project-uploads/1/miniature', {
        method: 'PUT',
        body: blob,
        headers: {
          'x-amz-meta-updated-at': '2023-10-10T10:00:00.000Z',
        },
      })

      await expect(self.trigger('fetch', putRequest)).rejects.toThrow('Missing Content-Type header')
    })

    it('throws error if x-amz-meta-updated-at header is missing', async () => {
      const blob = new Blob(['local-image-data'], { type: 'image/png' })
      await import('./sw')
      const putRequest = new Request('x:/api/project-uploads/1/miniature', {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': 'image/png',
        },
      })

      await expect(self.trigger('fetch', putRequest)).rejects.toThrow(
        'Missing x-amz-meta-updated-at header'
      )
    })

    it('caches response', async () => {
      await import('./sw')
      const blob = new Blob(['local-image-data'], { type: 'image/png' })
      const putRequest = new Request('x:/api/project-uploads/1/miniature', {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': 'image/png',
          'x-amz-meta-updated-at': '2023-10-10T10:00:00.000Z',
        },
      })

      const response = await self.trigger('fetch', putRequest)
      expect(response.status).toBe(204)

      await self.caches.open('v0')
      const cache = self.snapshot().caches.v0

      expect(cache['x:/api/project-uploads/1/miniature']).toMatchObject({
        bodyUsed: false,
        body: blob,
        status: 200,
        statusText: 'OK',
        headers: {
          _map: new Map([
            ['x-amz-meta-updated-at', expect.any(String)],
            ['content-type', 'image/png'],
          ]),
        },
        method: 'GET',
      })
    })
  })

  describe('miniatures - GET /api/project-uploads/1/miniature', () => {
    it('receives cached blob if there is any', async () => {
      const blob = new Blob(['local-image-data'], { type: 'image/png' })
      await import('./sw')
      const putRequest = new Request('x:/api/project-uploads/1/miniature', {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': 'image/png',
          'x-amz-meta-updated-at': '2023-10-10T10:00:00.000Z',
        },
      })
      await self.trigger('fetch', putRequest)

      await self.caches.open('v0') // otherwise cache is not being used

      const getRequest = new Request('x:/api/project-uploads/1/miniature', {
        method: 'GET',
      })
      const response = await self.trigger('fetch', getRequest)
      expect(response).toMatchObject({
        bodyUsed: false,
        body: blob,
        status: 200,
      })
    })

    it('makes request if there is nothing in cache', async () => {
      const blob = new Blob(['network-image-data'], { type: 'image/png' })
      global.fetch = () => Promise.resolve(new Response(blob))
      await import('./sw')
      await self.caches.open('v0') // otherwise cache is not being used

      const getRequest = new Request('x:/api/project-uploads/1/miniature', {
        method: 'GET',
      })
      const response = await self.trigger('fetch', getRequest)
      expect(response).toMatchObject({
        bodyUsed: false,
        body: blob,
        status: 200,
      })
    })
  })

  describe('sync project miniatures', () => {
    it('send exactly one request when there is one or more miniatures in cache and clears out the cache', async () => {
      const blobA = new Blob(['local-image-data'], { type: 'image/png' })
      await import('./sw')
      await self.trigger(
        'fetch',
        new Request('x:/api/project-uploads/1/miniature', {
          method: 'PUT',
          body: blobA,
          headers: {
            'Content-Type': 'image/png',
            'x-amz-meta-updated-at': '2023-10-10T10:00:00.000Z',
          },
        })
      )

      const blobB = new Blob(['local-image-data'], { type: 'image/png' })
      await self.trigger(
        'fetch',
        new Request('x:/api/project-uploads/1/miniature', {
          method: 'PUT',
          body: blobB,
          headers: {
            'Content-Type': 'image/png',
            'x-amz-meta-updated-at': '2023-10-10T10:00:00.000Z',
          },
        })
      )

      await self.caches.open('v0') // otherwise cache is not being used

      const broadcast = new BroadcastChannel('sync-data')

      const networkRequest = new Promise<Request>((resolve) => {
        global.fetch = async (reqInput, reqOptions) => {
          resolve(new Request(reqInput, reqOptions))
          return new Response(null, { status: 204 })
        }
      })

      broadcast.postMessage('SYNC_PROJECT_MINIATURE_START')
      expect(await networkRequest).toMatchObject({
        url: 'x:/api/project-uploads/1/miniature',
        method: 'PUT',
        body: blobB,
      })

      await self.caches.open('v0')
      // Wait for the cache to be cleared after sync
      await waitFor(() => Object.keys(self.snapshot().caches.v0).length === 0)
    })

    it('does not clear out the cache when sync fails', async () => {
      const blob = new Blob(['local-image-data'], { type: 'image/png' })
      await import('./sw')
      const putRequest = new Request('x:/api/project-uploads/1/miniature', {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': 'image/png',
          'x-amz-meta-updated-at': '2023-10-10T10:00:00.000Z',
        },
      })
      await self.trigger('fetch', putRequest)
      await self.caches.open('v0') // otherwise cache is not being used

      const broadcast = new BroadcastChannel('sync-data')

      const networkRequest = new Promise<void>((resolve) => {
        global.fetch = async () => {
          resolve()
          throw Error('Network error')
        }
      })

      broadcast.postMessage('SYNC_PROJECT_MINIATURE_START')
      await networkRequest
      expect(Object.keys(self.snapshot().caches.v0).length).toBe(1)
    })
  })

  describe('project data', () => {
    beforeEach(async () => {
      await import('./sw')
      const patchRequest = new Request('x:/api/projects/1', {
        method: 'PATCH',
        body: JSON.stringify({ id: '1', assets: [], updatedAt: '2023-10-10T10:00:00.000Z' }),
      })
      await self.trigger('fetch', patchRequest)

      // promise below is only to ensure data is written before tests run
      await waitFor(async () => {
        const projects = await getAllProjectsFromIDB()
        return projects?.length === 1
      })
    })

    it('when PATCH /api/project/1 is sent, no request reaches network', async () => {
      // Patch is already sent in beforeEach
      const db = await getDB()
      const project = new Promise((resolve) => {
        const dbReq = db.transaction(['projects'], 'readonly').objectStore('projects').get('1')
        dbReq.onsuccess = () => resolve(dbReq.result)
        dbReq.onerror = () => resolve(null)
      })

      expect(await project).toEqual({
        id: '1',
        assets: [],
        updatedAt: '2023-10-10T10:00:00.000Z',
      })
    })

    it('when GET /api/project/1 is sent while data is in the IndexedDB, network request is made anyway to get the most recent version (IDB or network)', async () => {
      const networkRequestOldVersion = new Promise<void>((resolve) => {
        global.fetch = async () => {
          resolve()
          return Response.json({
            assets: [],
            updatedAt: '2022-10-10T10:00:00.000Z', // Network has older data
          })
        }
      })

      const responseCache = await self.trigger('fetch', new Request('x:/api/projects/1'))

      await networkRequestOldVersion
      // IndexedDB data should be returned, is more recent
      expect(await responseCache.json()).toEqual({
        id: '1',
        assets: [],
        updatedAt: '2023-10-10T10:00:00.000Z',
      })

      const networkRequestNewVersion = new Promise<void>((resolve) => {
        global.fetch = async () => {
          resolve()
          return Response.json({
            assets: [],
            updatedAt: '2024-10-10T10:00:00.000Z', // Network has newer data
          })
        }
      })

      const responseNetwork = await self.trigger('fetch', new Request('x:/api/projects/1'))

      await networkRequestNewVersion
      // Network data should be returned, is more recent
      expect(await responseNetwork.json()).toEqual({
        assets: [],
        updatedAt: '2024-10-10T10:00:00.000Z',
      })
    })

    describe('sync project data', () => {
      it('sends PATCH request when there is data in IndexedDB and clears out the IDB', async () => {
        const broadcast = new BroadcastChannel('sync-data')
        const patchRequest = new Promise<Request>((resolve) => {
          global.fetch = async (reqInput, reqOptions) => {
            resolve(new Request(reqInput, reqOptions))
            return new Response(null, { status: 204 })
          }
        })

        broadcast.postMessage('SYNC_PROJECT_DATA_START')

        expect(await patchRequest).toMatchObject({
          url: 'https://www.test.com/api/projects/1',
          method: 'PATCH',
          body: new Blob([
            JSON.stringify({ id: '1', assets: [], updatedAt: '2023-10-10T10:00:00.000Z' }),
          ]),
        })

        await waitFor(async () => (await getAllProjectsFromIDB())?.length === 0)
      })

      it('does not erase records from IndexedDB when sync fails', async () => {
        const broadcast = new BroadcastChannel('sync-data')
        const networkRequest = new Promise<void>((resolve) => {
          global.fetch = async () => {
            resolve()
            throw Error('Network error')
          }
        })

        const syncCompletedMessage = new Promise<void>((resolve) => {
          broadcast.onmessage = (event) => {
            if (event.data.type === 'SYNC_PROJECT_DATA_ERROR') {
              resolve()
            }
          }
        })

        broadcast.postMessage('SYNC_PROJECT_DATA_START')

        await networkRequest
        await syncCompletedMessage
        await waitFor(async () => {
          const projects = await getAllProjectsFromIDB()
          return projects?.length === 1
        })
      })
    })
  })

  it('clear project clears both IndexedDB and miniatures cache', async () => {
    await import('./sw')

    // Add miniature to cache
    await self.trigger(
      'fetch',
      new Request('x:/api/project-uploads/1/miniature', {
        method: 'PUT',
        body: new Blob(['local-image-data'], { type: 'image/png' }),
        headers: {
          'Content-Type': 'image/png',
          'x-amz-meta-updated-at': '2023-10-10T10:00:00.000Z',
        },
      })
    )

    // Add project to IndexedDB
    await self.trigger(
      'fetch',
      new Request('x:/api/projects/1', {
        method: 'PATCH',
        body: JSON.stringify({ id: '1', assets: [], updatedAt: '2023-10-10T10:00:00.000Z' }),
      })
    )

    const broadcast = new BroadcastChannel('sync-data')
    broadcast.postMessage('CLEAR_PROJECT')

    // Check IndexedDB is cleared
    await waitFor(async () => {
      const projects = await getAllProjectsFromIDB()
      return projects?.length === 0
    })

    // Check cache is cleared
    await self.caches.open('v0')
    expect(Object.keys(self.snapshot().caches.v0).length).toBe(0)
  })
})
