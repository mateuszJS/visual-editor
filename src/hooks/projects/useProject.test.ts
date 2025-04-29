import { act, renderHook } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import useProject from './useProject'
import { server } from 'test/server'

describe('userProject', () => {
  // it('returns project if created succesfully', async () => {
  //   const { result } = renderHook(() => useProject(1))

  //   await act(() => {})

  //   expect(result.current).toEqual({
  //     loading: false,
  //     error: null,
  //     project: { id: 1 },
  //   })
  // })

  it('does not make a request if project is already in the storage', async () => {
    const { result, rerender } = renderHook(() => useProject(1))

    await act(() => {})
    // make sure project is already fetched
    expect(result.current).toEqual({
      loading: false,
      error: null,
      project: { id: 1 },
    })

    let madeRequest = false
    server.use(
      http.get('/api/projects/1', () => {
        madeRequest = true
        return HttpResponse.error()
      })
    )

    rerender(2)
    // rerender with same project id
    await act(() => {})

    expect(madeRequest).toBe(false)
    expect(result.current).toEqual({
      loading: false,
      error: null,
      project: { id: 1 },
    })
  })

  it('set loading to true while requesting', async () => {
    server.use(
      http.get('/api/projects/1', async () => {
        await delay()
        return HttpResponse.json({ id: 1 }, { status: 201 })
      })
    )

    const { result } = renderHook(() => useProject(1))

    await act(() => {})

    expect(result.current).toEqual({
      loading: true,
      error: null,
      project: null,
    })
  })

  it('propagates fetcher errors further', async () => {
    server.use(
      http.get('/api/projects/1', () =>
        HttpResponse.json({ error: 'No project found.' }, { status: 404 })
      )
    )

    const { result } = renderHook(() => useProject(1))

    await act(() => {})

    expect(result.current).toEqual({
      loading: false,
      error: 'No project found.',
      project: null,
    })
  })
})
