import { setupServer } from 'msw/node'
import handlers from './server-handlers'

export const server = setupServer(...handlers)

export function getRequest(url: string, method: string) {
  return new Promise<Request>((resolve) => {
    server.events.on('request:start', async ({ request }) => {
      if (request.url === `http://localhost${url}` && request.method === method) {
        resolve(request.clone())
      }
    })
  })
}
