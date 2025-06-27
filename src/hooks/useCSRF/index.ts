import errorStore from '@/stores/error'
import fetcher from '@/utils/fetcher'
import { getErrorMessage } from '@/utils/fetcher/getErrorMessage'
import { useEffect } from 'react'

let token = ''
let tokenPromise: Promise<void> | null = null

async function getCSRFToken() {
  try {
    const response = await fetcher('/api/csrf')
    const { csrfToken } = await response.json()
    token = csrfToken
  } catch (error) {
    errorStore.message = 'Error fetching CSRF token' + getErrorMessage(error)
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
