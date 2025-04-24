import fetcher, { FetcherOptions } from '@/utils/fetcher'
import { getErrorMessage } from '@/utils/fetcher/getErrorMessage'
import { useState } from 'react'

type Success<T> = [T] extends [never] ? Record<string, never> : { json: T }

export default function useFetcher<T = never>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<Success<T>>()

  async function enhancedFetcher(url: string, fetcherOptions: FetcherOptions) {
    setLoading(true)
    setError(null)

    try {
      const response = await fetcher(url, fetcherOptions)
      const contentType = response.headers.get('Content-Type')

      const json = contentType === 'application/json' ? await response.json() : null

      if (!response.ok) {
        setError(json?.error || 'Something went wrong')
      } else {
        if (json) {
          setSuccess({ json } as Success<T>)
        } else {
          setSuccess({} as Success<T>)
        }
      }
    } catch (err) {
      setError(getErrorMessage(err))
      // would be nice to return some code from BE, so component na read that code and assign it to the correct error msg
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    success,
    error,
    fetcher: enhancedFetcher,
  }
}
