import { act, renderHook } from '@testing-library/react'
import useFetcher from '.'
import { mockUser } from 'test/server-handlers'
import { delay, HttpResponse } from 'msw'

describe('useFetcher', () => {
  it('no error, loading or success by default', async () => {
    const { result } = renderHook(() => useFetcher())

    expect(result.current).toEqual({
      loading: false,
      error: null,
      success: null,
      fetcher: expect.any(Function),
    })
  })

  it('sets loading to true when fetcher is called', async () => {
    const { result } = renderHook(() => useFetcher())
    const { fetcher } = result.current

    mockUser.mockImplementationOnce(async () => {
      await delay()
      return HttpResponse.json({ userId: 0 }, { status: 200 })
    })

    await act(() => {
      fetcher('/api/me')
    })

    expect(result.current).toEqual({
      loading: true,
      error: null,
      success: null,
      fetcher: expect.any(Function),
    })
  })

  it('sets error when fetcher fails', async () => {
    const { result } = renderHook(() => useFetcher())
    const { fetcher } = result.current

    mockUser.mockImplementationOnce(async () => {
      return HttpResponse.json({ error: 'Error has occured' }, { status: 400 })
    })

    await act(() => {
      fetcher('/api/me')
    })

    expect(result.current).toEqual({
      loading: false,
      error: 'Error has occured',
      success: null,
      fetcher: expect.any(Function),
    })
  })

  it('sets default error when fetcher fails without a reason sent back in the response', async () => {
    const { result } = renderHook(() => useFetcher())
    const { fetcher } = result.current

    mockUser.mockImplementationOnce(() => new HttpResponse(null, { status: 400 }))

    await act(() => {
      fetcher('/api/me')
    })

    expect(result.current).toEqual({
      loading: false,
      error: 'Something went wrong',
      success: null,
      fetcher: expect.any(Function),
    })
  })

  it('provides success with json property if request was resovled', async () => {
    const { result } = renderHook(() => useFetcher())
    const { fetcher } = result.current

    await act(() => {
      fetcher('/api/me')
    })

    expect(result.current).toEqual({
      loading: false,
      error: null,
      success: {
        json: {
          firstName: 'John',
          lastName: 'Smith',
        },
      },
      fetcher: expect.any(Function),
    })
  })

  it('returns empty success object if no json was send back', async () => {
    const { result } = renderHook(() => useFetcher())
    const { fetcher } = result.current

    mockUser.mockImplementationOnce(async () => {
      return new HttpResponse()
    })

    await act(() => {
      fetcher('/api/me')
    })

    expect(result.current).toEqual({
      loading: false,
      error: null,
      success: {},
      fetcher: expect.any(Function),
    })
  })
})
