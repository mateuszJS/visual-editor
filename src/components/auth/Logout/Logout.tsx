'use client'

import userStore from '@/hooks/userStore/userStore'
import Button from '@/components/Button/Button'
import useFetcher from '@/hooks/useFetcher/useFetcher'
// import useServiceWorker from '@/hooks/useServiceWorker/useServiceWorker'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function Logout() {
  const { fetcher } = useFetcher()
  // const registration = useServiceWorker()

  const onClick = async () => {
    const broadcast = new BroadcastChannel('sync-data')

    const isSyncCompleted = new Promise<void>((resolve) => {
      broadcast.onmessage = (event) => {
        if (event.data === 'SYNC_DATA_END') {
          resolve()
        }
      }
    })

    broadcast.postMessage('SYNC_DATA_START')

    await Promise.any([
      isSyncCompleted,
      delay(5 * 1000), // 5 seconds timeout
    ])

    fetcher(
      '/api/auth/logout',
      {
        method: 'DELETE',
      },
      () => {
        userStore.user = null
        window.location.reload()
      }
    )
  }

  return <Button onClick={onClick}>Logout</Button>
}
