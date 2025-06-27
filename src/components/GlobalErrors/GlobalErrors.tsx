'use client'

import { useSnapshot } from 'valtio'
import ErrorToast from '@/components/ErrorToast/ErrorToast'
import errorStore from '@/stores/error'

export default function GlobalErros() {
  const { message } = useSnapshot(errorStore)

  if (message) {
    return (
      <ErrorToast
        error="Something went wrong. Please try again. If the issue still persist, please contact support."
        close={() => (errorStore.message = null)}
      />
    )
  }

  return null
}
