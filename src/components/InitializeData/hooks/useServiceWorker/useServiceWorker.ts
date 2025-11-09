import { useEffect } from 'react'
import registerServiceWorker from './registerServiceWorker'

const setupServiceWorker = async () => {
  try {
    await registerServiceWorker()
    const broadcast = new BroadcastChannel('sync-data')

    window.addEventListener('pagehide', () => {
      broadcast.postMessage('SYNC_PROJECT_DATA_START')
      broadcast.postMessage('SYNC_PROJECT_MINIATURE_START')
    })
  } catch (error) {
    console.error(`Registration failed with ${error}`)
  }
}

export default function useServiceWorker() {
  useEffect(() => {
    setupServiceWorker()
  }, [])
}
