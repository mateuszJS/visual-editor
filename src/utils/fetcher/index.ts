interface FetcherOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  json?: object | null
  options?: RequestInit
  withRedirect?: boolean
  csrfToken?: string
}

export default async function fetcher(
  url: string,
  { method = 'GET', json = null, options, withRedirect = true, csrfToken }: FetcherOptions = {}
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
      body: json ? JSON.stringify(json) : undefined,
    })

    if (withRedirect && response.status === 401) {
      window.history.replaceState(null, '', '/login')
      return Promise.reject(new Error('Unauthorized'))
    }

    return response
  } catch (err) {
    console.error('Error fetching data:', err)
    throw err
  }
}
