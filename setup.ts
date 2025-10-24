/**
 * @vitest-environment jsdom
 */

import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
// import { server } from './test/server'
// import { _resetUniqueIdCounter } from '@/hooks/useUniqueId/useUniqueId'

beforeAll(() => {
  // server.listen({
  //   onUnhandledRequest: 'error',
  // })
  // global.Image = class {
  //   // we have to mock new Image().onload to execute the callback
  //   set onload(cb: VoidFunction) {
  //     cb()
  //   }
  // } as unknown as typeof Image
  // global.URL.createObjectURL = vi.fn(() => 'blob://image-blob') // jsdom does not support File as argument, only blob
})

beforeEach(() => {
  // _resetUniqueIdCounter()
})

afterEach(() => {
  cleanup()
  // server.resetHandlers()
})

// afterAll(() => server.close())
