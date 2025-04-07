import { renderHook, act } from '@testing-library/react'
import useUserStore, { initUserStore } from '.'
import { mockUser } from 'test/server-handlers'
import { HttpResponse } from 'msw'

describe('useUserStore', () => {
  it('updates user data once successful fetch with user details is completed', async () => {
    const { result } = renderHook(() => useUserStore())

    expect(result.current.user).toBeUndefined()

    await act(async () => {
      initUserStore()
    })

    expect(result.current.user).toEqual({ firstName: 'John', lastName: 'Smith' })
  })

  it('updates user data once failed fetch with no user details is completed', async () => {
    const { result } = renderHook(() => useUserStore())

    expect(result.current.user).toBeUndefined()

    // normally API returns 400 without json, but here we won't to make sure it's gonna work even if JSON ir returned
    mockUser.mockImplementationOnce(() => HttpResponse.json({ name: 'Judas' }, { status: 400 }))

    await act(async () => {
      initUserStore()
    })

    expect(result.current.user).toBeNull()
  })

  it('sets user data correctly', async () => {
    const { result } = renderHook(() => useUserStore())

    const mockUser = { firstName: 'Alice', lastName: 'Lee' }
    await act(() => {
      result.current.set(mockUser)
    })

    expect(result.current.user).toEqual(mockUser)
  })
})
