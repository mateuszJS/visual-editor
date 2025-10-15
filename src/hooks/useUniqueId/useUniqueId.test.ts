import { renderHook } from '@testing-library/react'
import useUniqueId from './useUniqueId'

describe('useUniqueId', () => {
  it('id is returned instantly, before first render', () => {
    const { result } = renderHook(() => useUniqueId())

    expect(result.current).toBe('id-0')
  })

  it('same id value is maintained even if component re-renders', () => {
    const { result, rerender } = renderHook(() => useUniqueId())

    expect(result.current).toBe('id-0')

    rerender()

    expect(result.current).toBe('id-0')
  })
})
