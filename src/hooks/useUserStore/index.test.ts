import { renderHook, act } from '@testing-library/react'
import useUserStore, { initUserStore } from '.'

describe('useUserStore', () => {
  it('updates user data once fetch with user details is completed', async () => {
    const { result } = renderHook(() => useUserStore())

    expect(result.current.user).toBeNull()

    await act(async () => {
      initUserStore()
    })

    expect(result.current.user).toEqual({ firstName: 'John', lastName: 'Smith' })
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
