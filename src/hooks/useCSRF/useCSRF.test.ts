import { renderHook } from '@testing-library/react'
import useCSRF from './useCSRF'
import { http, HttpResponse } from 'msw'
import { server } from 'test/server'

describe('useCSRF', () => {
  it('fetches and returns the CSRF token', async () => {
    const { result } = renderHook(() => useCSRF())

    expect(await result.current()).toBe('csrf-token')
  })

  it('if initial request failes, it retries when token is requested', async () => {
    server.use(http.get('/api/csrf', () => HttpResponse.error()))
    const { result } = renderHook(() => useCSRF())

    server.use(
      http.get('/api/csrf', () => HttpResponse.json({ csrfToken: 'csrf-token' }, { status: 200 }))
    )

    expect(await result.current()).toBe('csrf-token')
  })

  it('reuses the token if already fetched', async () => {
    const { result } = renderHook(() => useCSRF())

    server.use(http.get('/api/csrf', () => HttpResponse.error()))
    expect(await result.current()).toBe('csrf-token')
  })
})
