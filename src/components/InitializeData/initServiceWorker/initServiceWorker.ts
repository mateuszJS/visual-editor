import posthog from 'posthog-js'
import registerServiceWorker from './registerServiceWorker'
import { captureError } from '@/utils/captureError'

export async function initServiceWorker() {
  try {
    await registerServiceWorker()
    posthog.capture('service_worker_registration', {
      status: navigator.serviceWorker.controller ? ' success' : 'fail',
    })
  } catch (error) {
    captureError(error)
    posthog.capture('service_worker_registration', {
      status: 'fail',
    })
  }
}
