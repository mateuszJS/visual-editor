import { act, renderHook } from '@testing-library/react'
import useAuthOnly from './useAuthOnly'
import { initUserStore } from '../userStore/userStore'
import { http, HttpResponse } from 'msw'
import mockRouter from 'next-router-mock'
import { server } from 'test/server'

describe('useAuthOnly', () => {
  beforeEach(() => {
    mockRouter.push('/profile')
  })

  it('redirects to root if user doesn\t exist(is null)', async () => {
    renderHook(() => useAuthOnly())

    expect(mockRouter.asPath).toBe('/profile')

    server.use(http.get('/api/me', () => HttpResponse.json(null, { status: 401 })))

    await act(() => initUserStore())

    expect(mockRouter.asPath).toBe('/')
  })

  describe('doest NOT redirect if', () => {
    it('user exists', async () => {
      renderHook(() => useAuthOnly())

      expect(mockRouter.asPath).toBe('/profile')

      await act(() => initUserStore())

      expect(mockRouter.asPath).toBe('/profile')
    })

    it('user state is unknown since response was not yet recieved(is pending)', async () => {
      renderHook(() => useAuthOnly())

      expect(mockRouter.asPath).toBe('/profile')
    })
  })
})
