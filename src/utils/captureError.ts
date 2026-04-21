import posthog from 'posthog-js'

export function captureError(error: unknown) {
  posthog.captureException(error)
  console.error(error)
}
