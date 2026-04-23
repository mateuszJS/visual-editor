import posthog, { Properties } from 'posthog-js'

export function captureError(error: unknown, props?: Properties) {
  posthog.captureException(error, props)
  console.error(error)
}
