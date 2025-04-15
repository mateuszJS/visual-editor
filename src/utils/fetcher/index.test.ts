import { mockUser } from 'test/server-handlers'
import { HttpResponse } from 'msw'
import fetcher from './index'

describe('fetcher', () => {
  it('should make a GET request and return the response', async () => {
    const response = await fetcher('/api/me')

    expect(response).toBeInstanceOf(Response)

    const receivedRequest = mockUser.mock.lastCall![0].request

    expect(receivedRequest.method).toBe('GET')
    expect(receivedRequest.url).toBe('http://localhost/api/me')
    expect(receivedRequest.headers.get('x-csrf-token')).toBeNull()
    expect(receivedRequest.headers.get('Content-Type')).toBeNull()
    expect(receivedRequest.body).toBeNull()
  })

  it('should include JSON body and Content-Type header for POST requests', async () => {
    const jsonBody = { key: 'value' }
    const response = await fetcher('/api/auth/login/google', {
      method: 'POST',
      json: jsonBody,
    })

    expect(response).toBeInstanceOf(Response)

    const receivedRequest = mockUser.mock.lastCall![0].request

    expect(receivedRequest.method).toBe('POST')
    expect(receivedRequest.url).toBe('http://localhost/api/auth/login/google')
    expect(receivedRequest.headers.get('Content-Type')).toBe('application/json')
    expect(receivedRequest.body).not.toBeNull()
  })

  it('should include CSRF token in headers if provided', async () => {
    const response = await fetcher('/api/auth/login/google', {
      method: 'POST',
      csrfToken: 'test-csrf-token',
    })

    expect(response).toBeInstanceOf(Response)

    const receivedRequest = mockUser.mock.lastCall![0].request

    expect(receivedRequest.headers.get('x-csrf-token')).toBe('test-csrf-token')
  })

  it('should redirect to /login on 401 status if withRedirect is true(default)', async () => {
    mockUser.mockImplementationOnce(() => HttpResponse.json(null, { status: 401 }))

    expect(window.location.href).toBe('http://localhost/')

    await expect(fetcher('/api/me')).rejects.toThrow('User is not autohrized.')

    expect(window.location.href).toBe('http://localhost/login')
  })

  it('should not redirect on 401 status if withRedirect is false', async () => {
    expect(window.location.href).toBe('http://localhost/')
    const requestPromise = fetcher('/api/me', { withRedirect: false })
    await expect(requestPromise).resolves.toBeInstanceOf(Response)
    expect(window.location.href).toBe('http://localhost/')
  })

  it('should throw an error if fetch fails', async () => {
    mockUser.mockImplementationOnce(() => HttpResponse.error())
    await expect(fetcher('/api/me')).rejects.toThrow('Failed to fetch')
  })
})
