'use client'

import { useSnapshot } from 'valtio'
import ErrorToast from '@/components/ErrorToast/ErrorToast'
import errorStore from '@/stores/error'
import { useEffect } from 'react'

export default function GlobalErrors() {
  const { message } = useSnapshot(errorStore)

  useEffect(() => {
    const broadcast = new BroadcastChannel('sync-data')

    broadcast.addEventListener('message', (event) => {
      if (typeof event.data === 'object' && event.data.type === 'SYNC_PROJECT_DATA_ERROR') {
        errorStore.message =
          'An error occurred while syncing project data. Check your internet connection.'
      }
    })
  }, [])

  if (message) {
    return <ErrorToast error={message} close={() => (errorStore.message = null)} />
  }

  return null
}
