import { HttpResponse, http } from 'msw'
import fetcher from './index'
import { server } from 'test/server'

function spyRequest(method: 'get' | 'post') {
  const output = {
    receivedRequest: new Request('http://domain'),
  }

  server.use(
    http[method]('/api/me', ({ request }) => {
      output.receivedRequest = request
      return HttpResponse.json(null, { status: 200 })
    })
  )

  return output
}

describe('fetcher', () => {
  it('should make a GET request and return the response', async () => {
    const spy = spyRequest('get')

    const response = await fetcher('/api/me')

    expect(response).toBeInstanceOf(Response)
    expect(spy.receivedRequest.method).toBe('GET')
    expect(spy.receivedRequest.url).toBe('http://localhost/api/me')
    expect(spy.receivedRequest.headers.get('x-csrf-token')).toBeNull()
    expect(spy.receivedRequest.headers.get('Content-Type')).toBeNull()
    expect(spy.receivedRequest.body).toBeNull()
  })

  it('should include JSON body and Content-Type header for POST requests', async () => {
    const spy = spyRequest('post')

    const jsonBody = { key: 'value' }
    const response = await fetcher('/api/me', {
      method: 'POST',
      json: jsonBody,
    })

    expect(response).toBeInstanceOf(Response)
    expect(spy.receivedRequest.method).toBe('POST')
    expect(spy.receivedRequest.url).toBe('http://localhost/api/me')
    expect(spy.receivedRequest.headers.get('Content-Type')).toBe('application/json')
    expect(spy.receivedRequest.body).not.toBeNull()
  })

  it('should include CSRF token in headers if provided', async () => {
    const spy = spyRequest('post')

    const response = await fetcher('/api/me', {
      method: 'POST',
      csrfToken: 'test-csrf-token',
    })

    expect(response).toBeInstanceOf(Response)
    expect(spy.receivedRequest.headers.get('x-csrf-token')).toBe('test-csrf-token')
  })

  // it('should redirect to /login on 401 status if withRedirect is true(default)', async () => {
  //   mockUser.mockImplementationOnce(() => HttpResponse.json(null, { status: 401 }))
  //   await expect(fetcher('/api/me')).rejects.toThrow('User is not autohrized.')
  // })
  // Testcase above is commented out on purpose, read the reasons in index.ts file of fetcher

  it('should not redirect on 401 status if disableAuth401Redirect is true', async () => {
    const requestPromise = fetcher('/api/me', { disableAuth401Redirect: true })
    await expect(requestPromise).resolves.toBeInstanceOf(Response)
  })

  it('should throw an error if fetch fails', async () => {
    server.use(http.get('/api/me', () => HttpResponse.error()))
    await expect(fetcher('/api/me')).rejects.toThrow('Failed to fetch')
  })
})
