import errorStore from '@/stores/error'
import { captureError } from '@/utils/captureError'
import fetcher from '@/utils/fetcher'
import { useEffect } from 'react'

let token = ''
let tokenPromise: Promise<void> | null = null

async function getCSRFToken() {
  const response = await fetcher<{ csrfToken: string }>('/api/csrf')
  tokenPromise = null

  if ('err' in response) {
    captureError(Error)
    errorStore.message = 'Something went wrong. Please enter this view again.'
    return
  }

  token = response.json.csrfToken
}

export default function useCSRF() {
  useEffect(() => {
    if (!token && !tokenPromise) {
      tokenPromise = getCSRFToken()
    }
  }, [])

  return async function csrfToken() {
    if (tokenPromise) {
      await tokenPromise
    }

    if (!token && !tokenPromise) {
      // Initial request might fail
      tokenPromise = getCSRFToken()
      await tokenPromise
    }

    return token
  }
}
