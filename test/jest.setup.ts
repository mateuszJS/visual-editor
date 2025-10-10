import '@testing-library/jest-dom'
import { server } from './server'
import { _resetUniqueIdCounter } from '@/hooks/useUniqueId/useUniqueId'

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  })
)

beforeEach(() => {
  _resetUniqueIdCounter()

  const testElement = document.createElement('div')
  testElement.id = 'non-modal-content'
  document.body.append(testElement)
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => server.close())
