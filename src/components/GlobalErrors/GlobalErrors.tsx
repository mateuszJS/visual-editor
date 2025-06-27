'use client'

import { useSnapshot } from 'valtio'
import ErrorToast from '@/components/ErrorToast/ErrorToast'
import errorStore from '@/stores/error'

export default function GlobalErrors() {
  const { message } = useSnapshot(errorStore)

  if (message) {
    return <ErrorToast error={message} close={() => (errorStore.message = null)} />
  }

  return null
}
