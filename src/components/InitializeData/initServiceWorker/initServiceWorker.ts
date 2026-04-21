import registerServiceWorker from './registerServiceWorker'

export async function initServiceWorker() {
  try {
    await registerServiceWorker()
  } catch (error) {
    console.error(`Registration failed with ${error}`)
  }
}
