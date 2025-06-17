import { act, renderHook } from '@testing-library/react'
import useGuestOnly from './index'
import { initUserStore } from '../userStore'
import { http, HttpResponse } from 'msw'
import mockRouter from 'next-router-mock'
import { server } from 'test/server'

describe('useGuestOnly', () => {
  beforeEach(() => {
    mockRouter.push('/login')
  })

  it('redirects to /profile if user exists', async () => {
    renderHook(() => useGuestOnly())

    expect(mockRouter.asPath).toBe('/login')

    await act(async () => {
      initUserStore()
    })

    expect(mockRouter.asPath).toBe('/profile')
  })

  describe('does NOT redirect if', () => {
    it('user does not exist (is null)', async () => {
      renderHook(() => useGuestOnly())

      expect(mockRouter.asPath).toBe('/login')

      await act(async () => {
        server.use(http.get('/api/me', () => HttpResponse.json(null, { status: 401 })))
        initUserStore()
      })

      expect(mockRouter.asPath).toBe('/login')
    })

    it('user state is unknown since response was not yet received (is pending)', async () => {
      renderHook(() => useGuestOnly())

      expect(mockRouter.asPath).toBe('/login')
    })
  })
})
