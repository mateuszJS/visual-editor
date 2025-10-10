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
    setWindowWidth(400)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  // Restore original window width after all tests
  afterAll(() => {
    setWindowWidth(originalInnerWidth)
  })

  it('should update the isMobile when the window is resized and throttled time has passed', async () => {
    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)

    // Simulate another resize event
    act(() => {
      setWindowWidth(800)
    })

    // still true until throttled time has passed
    expect(result.current).toBe(true)

    await act(async () => {
      jest.advanceTimersByTime(1)
    })

    expect(result.current).toBe(false)

    jest.runOnlyPendingTimers()

    // Simulate a resize event
    act(() => {
      setWindowWidth(799)
    })

    expect(result.current).toBe(true)
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
