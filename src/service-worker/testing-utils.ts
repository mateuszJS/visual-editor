/**
 * Polls a condition function until it returns true or times out.
 * Useful for waiting for async state changes in tests.
 */
export async function waitFor(condition: () => boolean | Promise<boolean>): Promise<void> {
  const startTime = Date.now()

  while (!(await condition())) {
    if (Date.now() - startTime > 5000) {
      throw new Error(`Timeout waiting for condition after 5000ms`)
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
}
