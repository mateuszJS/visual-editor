import { renderHook, act } from '@testing-library/react'
import useIsMobile from './useIsMobile'

describe('useIsMobile', () => {
  const originalInnerWidth = window.innerWidth

  // Helper to set window width and dispatch resize event
  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    })
    window.dispatchEvent(new Event('resize'))
  }

  beforeEach(() => {
    jest.useFakeTimers()
    setWindowWidth(800)
  })

  // Restore original window width after all tests
  afterAll(() => {
    setWindowWidth(originalInnerWidth)
  })

  it('should update the isMobile when the window is resized and throttled time has passed', async () => {
    const { result } = renderHook(() => useIsMobile())

    // 800 by default
    expect(result.current).toBe(false)

    await act(async () => {
      setWindowWidth(799)
    })

    // 299ms has passed, not 300 yet!
    expect(result.current).toBe(true)

    await act(async () => {
      setWindowWidth(800)
    })

    expect(result.current).toBe(false)
  })

  it('should remove the event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useIsMobile())

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))

    // Clean up the spy
    removeEventListenerSpy.mockRestore()
  })
})
