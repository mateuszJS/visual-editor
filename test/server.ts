import { setupServer } from 'msw/node'
import handlers from './server-handlers'

export const server = setupServer(...handlers)

/**
 * Intersepcts the requests so you can assest passed headers/body during test
 * @example
 * const requestPromise = interceptRequest('/api/projects/1/miniature', 'PUT')
 * const req = await requestPromise
 * expect(req.headers.get('x-amz-meta-captured-at')).toBe('2020-01-01T00:00:00.000Z')
 * expect(await req.blob()).toEqual(new Blob(['canvas-blob'], { type: 'image/png' }))
 * @param url which we listen to
 * @param method which we listen to
 * @returns request object which was send on provided url and method
 */
export function interceptRequest(url: string, method: string, nth = 1) {
  let currNth = 1
  return new Promise<Request>((resolve) => {
    server.events.on('request:start', async ({ request }) => {
      console.log(request.url, request.method, currNth, nth)
      if (request.url === `http://localhost${url}` && request.method === method) {
        if (currNth === nth) {
          resolve(request.clone())
        } else {
          currNth++
        }
      }
    })
  })
}
