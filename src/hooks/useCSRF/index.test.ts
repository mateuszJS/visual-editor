import { renderHook } from '@testing-library/react'
import useCSRF from './index'
import { mockCsrf } from 'test/server-handlers'
import { HttpResponse } from 'msw'

describe('useCSRF', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches and returns the CSRF token', async () => {
    const { result } = renderHook(() => useCSRF())

    expect(await result.current()).toBe('csrf-token')
  })

  it('if initial request failes, it retries when token is requested', async () => {
    mockCsrf.mockImplementationOnce(() => HttpResponse.error())
    const { result } = renderHook(() => useCSRF())

    expect(await result.current()).toBe('csrf-token')
  })

  it('reuses the token if already fetched', async () => {
    const { result } = renderHook(() => useCSRF())

    mockCsrf.mockImplementationOnce(() => HttpResponse.error())
    expect(await result.current()).toBe('csrf-token')

    mockCsrf.mockImplementationOnce(() => HttpResponse.error())
    expect(await result.current()).toBe('csrf-token')
  })
})
