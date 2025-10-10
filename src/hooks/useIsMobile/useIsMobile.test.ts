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
    setWindowWidth(800)
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

    // 800 by default
    expect(result.current).toBe(false)

    await act(async () => {
      setWindowWidth(799)
    })

    // throttled function is called on first useEffect,
    // so the second should wait 300ms to be called again
    expect(result.current).toBe(false)

    // hook is called once on the beggining
    await act(async () => {
      jest.advanceTimersByTime(299)
    })

    // 299ms has passed, not 300 yet!
    expect(result.current).toBe(false)

    // and here we are, 300ms in total!
    await act(async () => {
      jest.advanceTimersByTime(1)
    })

    // 299ms has passed, not 300 yet!
    expect(result.current).toBe(true)

    // wait 300ms to reset throttled state
    await act(async () => {
      jest.advanceTimersByTime(300)
    })

    await act(async () => {
      setWindowWidth(800)
    })

    // should be updated with no waiting time, because last call was >= 300ms ago
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
