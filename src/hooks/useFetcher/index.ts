import fetcher, { FetcherOptions } from '@/utils/fetcher'
import { getErrorMessage } from '@/utils/fetcher/getErrorMessage'
import { useRef, useState } from 'react'

type Success<T> = [T] extends [never] ? Record<string, never> : { json: T }

// Conditional return type based on whether T is provided
type FetcherReturn<T> = [T] extends [never] ? void : T

export default function useFetcher<T = never>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<Success<T> | null>(null)
  const requestId = useRef(0) /* to make sure we honor only a response to the latest request */

  async function enhancedFetcher(
    url: string,
    fetcherOptions: FetcherOptions = {}
  ): Promise<FetcherReturn<T>> {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const newRequestId = requestId.current + 1
    requestId.current = newRequestId

    try {
      const response = await fetcher(url, fetcherOptions)

      if (requestId.current !== newRequestId) return undefined as FetcherReturn<T> // this is not the latest request

      const contentType = response.headers.get('Content-Type')
      const json = contentType === 'application/json' ? await response.json() : null

      if (!response.ok) {
        setError(json?.error || 'Something went wrong')
      } else {
        if (json) {
          setSuccess({ json } as Success<T>)
          return json as FetcherReturn<T>
        } else {
          setSuccess({} as Success<T>)
        }
      }
      return undefined as FetcherReturn<T>
    } catch (err) {
      setError(getErrorMessage(err))
      return undefined as FetcherReturn<T>
      // would be nice to return some error code from BE, so component na read that code and assign it to the correct error msg
    } finally {
      if (requestId.current === newRequestId) {
        setLoading(false)
      }
    }
  }

  return {
    loading,
    success,
    error,
    fetcher: enhancedFetcher,
  }
}
