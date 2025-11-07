export interface FetcherOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'
  json?: object | null
  options?: RequestInit
  disableAuth401Redirect?: boolean
  csrfToken?: string
  body?: FormData | Blob | File
}

type EnrichedResponse<Json, Error> = Omit<Response, 'json'> &
  (
    | {
        ok: false
        json: () => Promise<Error>
      }
    | {
        ok: true
        json: () => Promise<Json>
      }
  )

/**
 * A simple fetch wrapper that improves developer experience
 * Can throw errors in case of network error or unauthorized user 401
 */
export default async function nativeFetcher<
  Json extends Record<string, unknown> | Array<unknown> = never,
  Error = { error: string }
>(
  url: string,
  {
    method = 'GET',
    json = null,
    options,
    disableAuth401Redirect = false,
    csrfToken,
    body,
  }: FetcherOptions = {}
): Promise<EnrichedResponse<Json, Error>> {
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

    if (!disableAuth401Redirect && response.status === 401) {
      const broadcast = new BroadcastChannel('sync-data')
      broadcast.postMessage('CLEAR_PROJECT')
      window.location.replace('/login')
      /* app reload is used to clear all JS memory data, hide all modals(like new project modal) */
      throw new Error('User is not authorized.')
    }

    return response
  } catch (err) {
    throw err
  }
}
