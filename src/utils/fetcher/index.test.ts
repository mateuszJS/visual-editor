import { HttpResponse, http } from 'msw'
import fetcher from './index'
import { interceptRequest, server } from 'test/server'
import { act } from '@testing-library/react'

describe('fetcher', () => {
  it('should make a GET request and return the response', async () => {
    const reqPromise = interceptRequest('/api/me', 'GET')

    const response = await fetcher('/api/me')

    if ('err' in response) {
      return fail('Expected success response, but got an error object.')
    }

    expect(response.headers).toBeInstanceOf(Headers)
    expect(response.json).toEqual({ id: '1', email: 'alice@test.com' })

    const req = await reqPromise
    expect(req.method).toBe('GET')
    expect(req.url).toBe('http://localhost/api/me')
    expect(req.headers.get('x-csrf-token')).toBeNull()
    expect(req.headers.get('Content-Type')).toBeNull()
    expect(req.body).toBeNull()
  })

  it('should include JSON body and Content-Type header for POST requests', async () => {
    server.use(http.post('/api/me', () => new HttpResponse()))
    const reqPromise = interceptRequest('/api/me', 'POST')

    const jsonBody = { key: 'value' }
    const response = await fetcher('/api/me', {
      method: 'POST',
      json: jsonBody,
    })

    if ('err' in response) {
      return fail('Expected success response, but got an error object.')
    }

    const req = await reqPromise
    expect(req.method).toBe('POST')
    expect(req.url).toBe('http://localhost/api/me')
    expect(req.headers.get('Content-Type')).toBe('application/json')
    expect(req.body).not.toBeNull()
  })

  it('should include CSRF token in headers if provided', async () => {
    server.use(http.post('/api/me', () => new HttpResponse()))
    const reqPromise = interceptRequest('/api/me', 'POST')

    const response = await fetcher('/api/me', {
      method: 'POST',
      csrfToken: 'test-csrf-token',
    })

    if ('err' in response) {
      return fail('Expected success response, but got an error object.')
    }

    const req = await reqPromise
    expect(req.headers.get('x-csrf-token')).toBe('test-csrf-token')
  })

  it('should send CLEAR_PROJECT message and redirect to /login on 401 status if withRedirect is true(default)', async () => {
    const implSymbol = Reflect.ownKeys(window.location).find((i) => typeof i === 'symbol')!
    const windowReplace = jest
      .spyOn(
        (window.location as unknown as { [key: symbol]: { replace: VoidFunction } })[implSymbol],
        'replace'
      )
      .mockImplementation(() => {})

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

    const response = await fetcher('/api/me')

    if (!('err' in response)) {
      return fail('Expected failed object, but got an success response.')
    }

    expect(response.status).toBe(401)
    expect(response.err).toBe('You need to firstly log in.')

    await act(() => messagesReceivedPromise)

    expect(windowReplace).toHaveBeenCalledWith(
      '/login?err_msg=You%20need%20to%20firstly%20log%20in.'
    )
    windowReplace.mockRestore()
    broadcast.close()
  })

  it('should not redirect on 401 status if disableAuth401Redirect is true', async () => {
    server.use(
      http.get('/api/me', () => {
        return HttpResponse.json(null, { status: 401 })
      })
    )

    const implSymbol = Reflect.ownKeys(window.location).find((i) => typeof i === 'symbol')!
    const windowReplace = jest
      .spyOn(
        (window.location as unknown as { [key: symbol]: { replace: VoidFunction } })[implSymbol],
        'replace'
      )
      .mockImplementation(() => {})

    await fetcher('/api/me', { disableAuth401Redirect: true })

    await act(async () => {})

    expect(windowReplace).not.toHaveBeenCalled()
  })

  it('should NOT throw an error if fetch fails', async () => {
    server.use(http.get('/api/me', () => HttpResponse.error()))
    await expect(fetcher('/api/me')).resolves.toEqual({ err: undefined })
  })
})
