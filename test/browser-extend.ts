import { test as testBase } from 'vitest'
import worker from './msw-worker'

// to override values per test
// https://vitest.dev/guide/test-context.html#scoping-values-to-suite

interface MyFixtures {
  worker: typeof worker
  creatorCanvas: HTMLCanvasElement
}

const test = testBase.extend<MyFixtures>({
  worker: [
    async ({}, use) => {
      // Start the worker before the test.
      await worker.start()

      // Expose the worker object on the test's context.
      await use(worker)

      // Remove any request handlers added in individual test cases.
      // This prevents them from affecting unrelated tests.
      worker.resetHandlers()

      // Stop the worker after the test.
      worker.stop()
    },
    {
      auto: true,
    },
  ],
  creatorCanvas: async ({}, use) => {
    const canvas = document.createElement('canvas')
    window.document.body.appendChild(canvas)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(canvas)

    canvas.remove()
  },
})

export default test
