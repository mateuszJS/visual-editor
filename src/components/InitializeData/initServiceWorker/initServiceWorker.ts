import registerServiceWorker from './registerServiceWorker'

export async function initServiceWorker() {
  try {
    await registerServiceWorker()

    window.addEventListener('pagehide', () => {
      const broadcast = new BroadcastChannel('sync-data')

      broadcast.postMessage('SYNC_PROJECT_DATA_START')
      broadcast.postMessage('SYNC_PROJECT_MINIATURE_START')
      console.log('SYNC_PROJECT_MINIATURE_START pagehide useServiceWorker')
    })
  } catch (error) {
    console.error(`Registration failed with ${error}`)
  }
}
