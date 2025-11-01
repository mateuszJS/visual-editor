import '@testing-library/jest-dom'
import { server } from './server'
import { _resetUniqueIdCounter } from '@/hooks/useUniqueId/useUniqueId'

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error',
  })

  global.Image = class {
    // we have to mock new Image().onload to execute the callback
    set onload(cb: VoidFunction) {
      cb()
    }
  } as unknown as typeof Image

  global.URL.createObjectURL = jest.fn(() => 'blob://image-blob') // jsdom does not support File as argument, only blob

  const registration = {
    active: {
      postMessage: jest.fn(),
    },
  }

  Object.defineProperty(global.navigator, 'serviceWorker', {
    value: {
      register: jest.fn(() => {
        return Promise.resolve(registration)
      }),
    },
  })
})

beforeEach(() => {
  _resetUniqueIdCounter()

  const testElement = document.createElement('div')
  testElement.id = 'non-modal-content'
  document.body.append(testElement)

  // creator is used in almost half of all tests, because of that
  // we add canvas element before each test by default
  const canvas = document.createElement('canvas')
  canvas.id = 'creatorCanvas'
  document.body.appendChild(canvas)
})

afterEach(() => {
  server.resetHandlers()
  document.getElementById('non-modal-content')!.remove()
  window.creatorCanvas.remove()
})

afterAll(() => {
  server.close()
})
