import { HttpResponse, http } from 'msw'
import nativeFetcher from './index'
import { getRequest, server } from 'test/server'
import { act } from '@testing-library/react'

describe('nativeFetcher', () => {
  it('should make a GET request and return the response', async () => {
    const reqPromise = getRequest('/api/me', 'GET')

    const response = await nativeFetcher('/api/me')

    expect(response).toBeInstanceOf(Response)
    const req = await reqPromise
    expect(req.method).toBe('GET')
    expect(req.url).toBe('http://localhost/api/me')
    expect(req.headers.get('x-csrf-token')).toBeNull()
    expect(req.headers.get('Content-Type')).toBeNull()
    expect(req.body).toBeNull()
  })

  it('should include JSON body and Content-Type header for POST requests', async () => {
    server.use(http.post('/api/me', () => new HttpResponse()))
    const reqPromise = getRequest('/api/me', 'POST')

    const jsonBody = { key: 'value' }
    const response = await nativeFetcher('/api/me', {
      method: 'POST',
      json: jsonBody,
    })

    expect(response).toBeInstanceOf(Response)
    const req = await reqPromise
    expect(req.method).toBe('POST')
    expect(req.url).toBe('http://localhost/api/me')
    expect(req.headers.get('Content-Type')).toBe('application/json')
    expect(req.body).not.toBeNull()
  })

  it('should include CSRF token in headers if provided', async () => {
    server.use(http.post('/api/me', () => new HttpResponse()))
    const reqPromise = getRequest('/api/me', 'POST')

    const response = await nativeFetcher('/api/me', {
      method: 'POST',
      csrfToken: 'test-csrf-token',
    })

    expect(response).toBeInstanceOf(Response)
    const req = await reqPromise
    expect(req.headers.get('x-csrf-token')).toBe('test-csrf-token')
  })

  it('should send CLEAR_PROJECT message and redirect to /login on 401 status if withRedirect is true(default)', async () => {
    const implSymbol = Reflect.ownKeys(window.location).find((i) => typeof i === 'symbol')!
    const windowReplace = jest.spyOn(
      (window.location as unknown as { [key: symbol]: { replace: VoidFunction } })[implSymbol],
      'replace'
    )

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

    expect(windowReplace).toHaveBeenCalledWith('/login')
    windowReplace.mockRestore()
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
