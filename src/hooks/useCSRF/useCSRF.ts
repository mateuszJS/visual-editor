import errorStore from '@/stores/error'
import nativeFetcher from '@/utils/nativeFetcher'
import { getErrorMessage } from '@/utils/nativeFetcher/getErrorMessage'
import { useEffect } from 'react'

let token = ''
let tokenPromise: Promise<void> | null = null

async function getCSRFToken() {
  try {
    const response = await nativeFetcher<{ csrfToken: string }>('/api/csrf')

    if (!response.ok) {
      const { error } = await response.json()
      console.error('Error fetching CSRF token', error)
      errorStore.message = 'Something went wrong. Please enter this view again.'
      return
    }

    const { csrfToken } = await response.json()
    token = csrfToken
  } catch (error) {
    console.error('Error fetching CSRF token' + getErrorMessage(error))
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
