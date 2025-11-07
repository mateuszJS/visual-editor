import { useEffect, useState } from 'react'
import registerServiceWorker from './registerServiceWorker'

const setupServiceWorker = async () => {
  try {
    await registerServiceWorker()
    window.addEventListener('pagehide', () => {
      const broadcast = new BroadcastChannel('sync-data')
      broadcast.postMessage('SYNC_PROJECT_DATA_START')
      broadcast.postMessage('SYNC_PROJECT_MINIATURE_START')
    })
  } catch (error) {
    console.error(`Registration failed with ${error}`)
  }
}

export default function useServiceWorker() {
  const [startedSetup, setStartedSetup] = useState(false)

  useEffect(() => {
    if (!startedSetup && 'serviceWorker' in navigator) {
      setupServiceWorker().then(() => {
        setStartedSetup(true)
      })
    }
  }, [startedSetup])
}
