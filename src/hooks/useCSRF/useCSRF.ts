import errorStore from '@/stores/error'
import { captureError } from '@/utils/captureError'
import nativeFetcher from '@/utils/nativeFetcher'
import { useEffect } from 'react'

let token = ''
let tokenPromise: Promise<void> | null = null

async function getCSRFToken() {
  try {
    const response = await nativeFetcher<{ csrfToken: string }>('/api/csrf')

    if (!response.ok) {
      console.error('Error fetching CSRF token', response.json?.error)
      errorStore.message = 'Something went wrong. Please enter this view again.'
      return
    }

    token = response.json.csrfToken
  } catch (error) {
    captureError(error)
    errorStore.message = 'Something went wrong. Please enter this view again.'
  } finally {
    tokenPromise = null
  }
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
