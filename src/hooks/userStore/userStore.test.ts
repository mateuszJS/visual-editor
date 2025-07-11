import { renderHook, act } from '@testing-library/react'
import userStore, { initUserStore } from './userStore'
import { http, HttpResponse } from 'msw'
import { server } from 'test/server'
import { useSnapshot } from 'valtio'

describe('userStore', () => {
  it('updates user data once successful fetch with user details is completed', async () => {
    const { result } = renderHook(() => useSnapshot(userStore))

    expect(result.current.user).toBeUndefined()

    await act(async () => {
      initUserStore()
    })

    expect(result.current.user).toEqual({ firstName: 'John', lastName: 'Smith' })
  })

  it('updates user data once failed fetch with no user details is completed', async () => {
    const { result } = renderHook(() => useSnapshot(userStore))

    expect(result.current.user).toBeUndefined()

    // normally API returns 400 without json, but here we won't to make sure it's gonna work even if JSON ir returned
    server.use(http.get('/api/me', () => HttpResponse.json({ name: 'Judas' }, { status: 400 })))

    await act(async () => {
      initUserStore()
    })

    expect(result.current.user).toBeNull()
  })

  it('sets user data correctly', async () => {
    const { result } = renderHook(() => useSnapshot(userStore))

    const mockUser = {
      id: 1,
      email: 'alice@google.com',
      name: 'Alice',
      avatar: 'http://alice.jpg',
      projects: [],
    }
    await act(async () => {
      userStore.user = mockUser
    })

    expect(result.current.user).toEqual(mockUser)
  })
})
