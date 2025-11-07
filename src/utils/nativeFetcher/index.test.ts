import { HttpResponse, http } from 'msw'
import nativeFetcher from './index'
import { server } from 'test/server'
import { act } from '@testing-library/react'

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

describe('nativeFetcher', () => {
  it('should make a GET request and return the response', async () => {
    const spy = spyRequest('get')

    const response = await nativeFetcher('/api/me')

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
    const response = await nativeFetcher('/api/me', {
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

    const response = await nativeFetcher('/api/me', {
      method: 'POST',
      csrfToken: 'test-csrf-token',
    })

    expect(response).toBeInstanceOf(Response)
    expect(spy.receivedRequest.headers.get('x-csrf-token')).toBe('test-csrf-token')
  })

  it('should send CLEAR_PROJECT message and redirect to /login on 401 status if withRedirect is true(default)', async () => {
    const { replace } = window.location

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, replace: jest.fn() },
    })

    const broadcast = new BroadcastChannel('sync-data')
    const messagesReceivedPromise = new Promise<void>((resolve) => {
      broadcast.onmessage = (event) => {
        if (event.data === 'CLEAR_PROJECT') {
          resolve()
        }
      }
    })

    server.use(
      http.get('/api/me', () => {
        return HttpResponse.json(null, { status: 401 })
      })
    )
    await expect(nativeFetcher('/api/me')).rejects.toThrow('User is not authorized.')

    await act(() => messagesReceivedPromise)

    expect(window.location.replace).toHaveBeenCalledWith('/login')

    window.location.replace = replace
  })

  it('should not redirect on 401 status if disableAuth401Redirect is true', async () => {
    const requestPromise = nativeFetcher('/api/me', { disableAuth401Redirect: true })
    await expect(requestPromise).resolves.toBeInstanceOf(Response)
  })

  it('should throw an error if fetch fails', async () => {
    server.use(http.get('/api/me', () => HttpResponse.error()))
    await expect(nativeFetcher('/api/me')).rejects.toThrow('Failed to fetch')
  })
})
