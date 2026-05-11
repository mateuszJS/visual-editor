import { captureError } from '../captureError'
import { ERR_MSG_PARAM } from '@/components/GlobalErrors/GlobalErrors'

export interface FetcherOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'
  json?: object | null
  options?: RequestInit
  disableAuth401Redirect?: boolean
  csrfToken?: string
  body?: FormData | Blob | File
}

type EnrichedResponse<Json> = Pick<Response, 'status' | 'headers' | 'blob'> & {
  json: Json
}

/**
 * A simple fetch wrapper that improves developer experience
 * Can throw errors in case of network error or unauthorized user 401
 */
export default async function nativeFetcher<Json extends Record<string, unknown> | Array<unknown>>(
  url: string,
  {
    method = 'GET',
    json = null,
    options,
    disableAuth401Redirect = false,
    csrfToken,
    body,
  }: FetcherOptions = {}
): Promise<EnrichedResponse<Json> | { err: string | undefined; status?: number }> {
  try {
    // This should be the only one place in the codebase where we use native fetch!
    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch(url, {
      ...options,
      method,
      headers: {
        ...(json ? { 'Content-Type': 'application/json' } : {}),
        ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        ...options?.headers,
      },
      body: json ? JSON.stringify(json) : body,
    })

    if (response.status === 401) {
      const broadcast = new BroadcastChannel('sync-data')
      broadcast.postMessage('CLEAR_PROJECT')
      broadcast.close()
      if (!disableAuth401Redirect && window.location.pathname !== '/login') {
        window.location.replace(
          `/login?${ERR_MSG_PARAM}=${encodeURIComponent('You need to firstly log in.')}`
        )
        return {
          status: 401,
          err: 'You need to firstly log in.',
        }
      }
    }

    const jsonRes = (
      response.headers.get('content-type') === 'application/json' ? await response.json() : null
    ) as Json

    if (!response.ok) {
      return {
        status: response.status,
        err: getApiErrorMessage(jsonRes),
      }
    }

    return {
      status: response.status,
      headers: response.headers,
      json: jsonRes,
      blob: response.blob, // TODO: consider handling it liek json
    }
  } catch (err) {
    captureError(err)
    return {
      err: undefined,
    }
  }
}

function getApiErrorMessage(resJson: unknown) {
  if (
    typeof resJson === 'object' &&
    resJson !== null &&
    'error' in resJson &&
    typeof resJson.error === 'string'
  ) {
    return resJson.error
  }
}
