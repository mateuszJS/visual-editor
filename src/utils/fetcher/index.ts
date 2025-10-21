export interface FetcherOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'
  json?: object | null
  options?: RequestInit
  disableAuth401Redirect?: boolean
  csrfToken?: string
  formData?: FormData
}

/**
 * A simple fetch wrapper that imrpoves developer experience
 * Can throw errors in case of network error or unauthorized user 401
 */
export default async function fetcher(
  url: string,
  {
    method = 'GET',
    json = null,
    options,
    disableAuth401Redirect = false,
    csrfToken,
    formData = undefined,
  }: FetcherOptions = {}
): Promise<Response> {
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
      body: json ? JSON.stringify(json) : formData,
    })

    if (!disableAuth401Redirect && response.status === 401) {
      window.location.replace('/login')
      /* app reload is used to clear all JS memory data, hide all modals(like new project modal) */
      throw new Error('User is not authorized.')
    }

    return response
  } catch (err) {
    throw err
  }
}
