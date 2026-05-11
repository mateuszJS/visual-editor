'use client'

import { useSnapshot } from 'valtio'
import ErrorToast from '@/components/ErrorToast/ErrorToast'
import errorStore from '@/stores/error'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export const ERR_MSG_PARAM = 'err_msg'

export default function GlobalErrors() {
  const router = useRouter()
  const pathname = usePathname()
  const { message } = useSnapshot(errorStore)

  useEffect(() => {
    const broadcast = new BroadcastChannel('sync-data')

    broadcast.onmessage = (event) => {
      if (typeof event.data === 'object' && event.data.type === 'SYNC_PROJECT_DATA_ERROR') {
        errorStore.message =
          'An error occurred while syncing project data. Check your internet connection.'
      }
    }

    const searchParams = new URLSearchParams(window.location.search)
    errorStore.message = searchParams.get(ERR_MSG_PARAM)

    if (errorStore.message) {
      router.replace(pathname)
    }

    return () => {
      broadcast.close()
    }
  }, [])

  if (message) {
    return <ErrorToast error={message} close={() => (errorStore.message = null)} />
  }

  return null
}
