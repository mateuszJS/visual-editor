export interface FetcherOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  json?: object | null
  options?: RequestInit
  disableAuth401Redirect?: boolean
  csrfToken?: string
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
      body: json ? JSON.stringify(json) : undefined,
    })

    if (!disableAuth401Redirect && response.status === 401) {
      /* The number of issues that window.location is causign durign tests is sky rocketing:
      - we cannot mock winding.location.replace because its read only
      - we cannot mock whole window.location because msw stops respecting our handlers
      - if you try to call window.location.repalce u will get an errror "Error: Not implemented: navigation (except hash changes)"
      Because of that I've decided to not test this one redirect until we find a solution */
      window.location.replace('/login') // TODO: Add a redirect to the login page
      /* app reload is used to clear all JS memory data, hide all modals(like new project modal) */
      throw new Error('User is not autohrized.')
    }

    return response
  } catch (err) {
    throw err
  }
}
