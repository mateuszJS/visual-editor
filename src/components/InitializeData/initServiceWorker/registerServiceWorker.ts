function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default async function registerServiceWorker(tryOnlyOnce = false) {
  if (!('serviceWorker' in navigator)) {
    throw new Error('serviceWorker not supported')
  }

  await navigator.serviceWorker.register('/sw.js')

  // Waiting for ready worker

  let serviceReg: ServiceWorkerRegistration | undefined = await navigator.serviceWorker.ready
  // Ready registration

  if (!navigator.serviceWorker.controller) {
    // Worker isn't controlling, re-register

    if (tryOnlyOnce) {
      throw new Error('service worker controller not found after re-register')
    }

    try {
      const reg = await navigator.serviceWorker.getRegistration()
      // Unregistering worker
      await reg?.unregister()
      // Successfully unregistered, trying registration again
      return registerServiceWorker(true)
    } catch (err) {
      console.error(
        `ServiceWorker failed to re-register after hard-refresh, reloading the page!`,
        err
      )
      throw new Error('Failed to unregister service worker')
    }
  }

  let serviceWorker: ServiceWorker | null | undefined =
    serviceReg.active || serviceReg.waiting || serviceReg.installing
  if (!serviceWorker) {
    // No worker on registration, getting registration again
    serviceReg = await navigator.serviceWorker.getRegistration()
    serviceWorker = serviceReg?.active || serviceReg?.waiting || serviceReg?.installing
  }

  if (!serviceWorker) {
    // No worker on registration, waiting 50ms
    await delay(50) // adjustable or skippable, have a play around
  }

  serviceWorker = serviceReg?.active || serviceReg?.waiting || serviceReg?.installing
  if (!serviceWorker) throw new Error('after waiting on .ready, still no worker')

  if (serviceWorker.state == 'redundant') {
    // Worker is redundant, trying again
    if (tryOnlyOnce) {
      throw new Error('service worker became redundant during activation')
    }

    return registerServiceWorker(true)
  }

  if (serviceWorker.state != 'activated') {
    // Worker IS controlling, but not active yet, waiting on event
    try {
      // timeout is adjustable, but you do want one in case the statechange
      // doesn't fire / with the wrong state because it gets queued,
      // see ServiceWorker.onstatechange MDN docs.
      await timeout(
        100,
        new Promise((resolve) => {
          serviceWorker.addEventListener('statechange', (e) => {
            if (e.target && 'state' in e.target && e.target.state == 'activated') {
              resolve()
            }
          })
        })
      )
    } catch (err) {
      if (err instanceof TimeoutError) {
        if (serviceWorker.state != 'activating') {
          if (tryOnlyOnce) {
            // Worker is still not active.
            throw new Error('failed to activate service worker')
          } else {
            // Worker is still not active, retrying once
            return registerServiceWorker(true)
          }
        }
      } else {
        // should be unreachable
        throw err
      }
    }
  }

  // Worker is controlling and active, we’re good folks!
  return serviceWorker
}

export class TimeoutError extends Error {}

/**
 * Run promise but reject after some timeout.
 *
 * @template T
 * @param {number} ms Milliseconds until timing out
 * @param {Promise<T>} promise Promise to run until timeout (note that it will keep running after timeout)
 * @returns {Promise<T, Error>}
 */
export function timeout(ms: number, promise: Promise<void>) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError())
    }, ms)

    promise.then(
      (result) => {
        clearTimeout(timer)
        resolve(result)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      }
    )
  })
}
