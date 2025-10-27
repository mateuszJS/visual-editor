import errorStore from '@/stores/error'
import nativeFetcher, { FetcherOptions } from '@/utils/nativeFetcher'
import { getErrorMessage } from '@/utils/nativeFetcher/getErrorMessage'
import { useEffect, useRef, useState } from 'react'

type Success<T> = T extends never ? Record<never, never> : { json: T }

// Conditional return type based on whether T is provided
// type FetcherReturn<T> = T extends never ? void : T

const DEFAULT_ERROR_MESSAGE =
  'Something went wrong. Please try again. If the issue still persist, please contact support.'

/**
 * Custom hook to fetch data with enhanced error handling and loading state management.
 * Returned response body can be retrived in two ways:
 * 1. read "success" property from the hook - best if not future actions needed except rerendering
 * 2. pass a callback as the last argument to the fetcher function - best if you need to perform an action(redirect, call function) on success only, and leaves error handling for the hook
 * fetcher() doesn't return data with response body in promise on purpose, callbacks are preferred since those won't need error handing(Promise.reject needs a catch block)
 */
export default function useFetcher<T extends Record<string, unknown> | Array<unknown> = never>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<Success<T> | null>(null)
  const requestId = useRef(0) /* to make sure we honor only a response to the latest request */

  async function enhancedFetcher(
    url: string,
    secondArg?: FetcherOptions | ((data: T) => void),
    successCallback?: (data: T) => void
  ): Promise<void> {
    const fetcherOptions = typeof secondArg === 'object' ? secondArg : {}

    if (typeof secondArg === 'function') {
      successCallback = secondArg
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    const newRequestId = requestId.current + 1
    requestId.current = newRequestId

    try {
      const response = await nativeFetcher<T>(url, fetcherOptions)

      if (requestId.current !== newRequestId) return undefined // this is not the latest request

      const contentType = response.headers.get('Content-Type')

      if (!response.ok) {
        const json = contentType === 'application/json' ? await response.json() : null
        setError(json?.error || DEFAULT_ERROR_MESSAGE)
      } else {
        const json = contentType === 'application/json' ? await response.json() : null
        if (json !== null) {
          setSuccess({ json } as Success<T>) // should be infered by TS without "as"
          successCallback?.(json)
          return undefined
        } else {
          setSuccess({} as Success<T>) // should be infered by TS without "as"
          successCallback?.(undefined as never)
        }
      }
      return undefined
    } catch (err) {
      setError(getErrorMessage(err))
      return undefined
      // would be nice to return some error code from BE, so component na read that code and assign it to the correct error msg
    } finally {
      if (requestId.current === newRequestId) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    errorStore.message = error
    return () => {
      if (errorStore.message === error) {
        errorStore.message = null
      }
    }
  }, [error])

  return {
    loading,
    success,
    error,
    fetcher: enhancedFetcher,
  }
}
