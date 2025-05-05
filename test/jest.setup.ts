import '@testing-library/jest-dom'
import { server } from './server'

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  })
)
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())

beforeEach(() => {
  window.history.replaceState(null, '', 'http://localhost/') // not sure if we need this anymore
})

// server.events.on('request:start', ({ request }) => {
//   console.log('MSW intercepted:', request.method, request.url)
// })
