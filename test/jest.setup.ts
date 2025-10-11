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

  if (!('non-modal-content' in window)) {
    const testElement = document.createElement('div')
    testElement.id = 'non-modal-content'
    document.body.append(testElement)
  }

  // creator is used in almost half of all tests, because of that
  // we add canvas element before each test by default
  const canvas = document.createElement('canvas')
  canvas.id = 'creatorCanvas'
  document.body.appendChild(canvas)
})

afterEach(() => {
  server.resetHandlers()
  server.resetHandlers()
  window.creatorCanvas.remove()
})

afterAll(() => server.close())
