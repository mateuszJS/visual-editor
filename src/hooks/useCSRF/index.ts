import fetcher from '@/utils/fetcher'
import { useEffect } from 'react'

let token = ''
let tokenPromise: Promise<void> | null = null

async function getCSRFToken() {
  try {
    const response = await fetcher('/api/csrf')
    const { csrfToken } = await response.json()
    token = csrfToken
  } catch (error) {
    console.error('Error fetching CSRF token', error)
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
    if (typeof window === 'undefined') {
      throw new Error('CSRF token can only be used in the browser.')
    }

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
