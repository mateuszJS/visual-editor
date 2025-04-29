import { act, renderHook } from '@testing-library/react'
import useCreateProject from './useCreateProject'
import { delay, http, HttpResponse } from 'msw'
import { server } from 'test/server'

describe('userCreateProject', () => {
  it('does not make a request on the start', () => {
    const { result } = renderHook(() => useCreateProject())

    expect(result.current).toEqual({
      loading: false,
      error: null,
      project: null,
      createProject: expect.any(Function),
    })
  })

  it('set loading to true while requesting', async () => {
    const { result } = renderHook(() => useCreateProject())

    server.use(
      http.post('/api/projects', async () => {
        await delay()
        return HttpResponse.json({ id: 1 }, { status: 201 })
      })
    )

    await act(() => {
      result.current.createProject(100, 100, [])
    })

    expect(result.current).toEqual({
      loading: true,
      error: null,
      project: null,
      createProject: expect.any(Function),
    })
  })

  it('propagates fetcher errors further', async () => {
    const { result } = renderHook(() => useCreateProject())

    server.use(
      http.post('/api/projects', async () =>
        HttpResponse.json({ error: 'Invalid width' }, { status: 400 })
      )
    )

    await act(() => {
      result.current.createProject(0, 100, [])
    })

    expect(result.current).toEqual({
      loading: false,
      error: 'Invalid width',
      project: null,
      createProject: expect.any(Function),
    })
  })

  it('returns project if created succesfully', async () => {
    const { result } = renderHook(() => useCreateProject())

    await act(() => {
      result.current.createProject(0, 100, [])
    })

    expect(result.current).toEqual({
      loading: false,
      error: null,
      project: { id: 1 },
      createProject: expect.any(Function),
    })
  })
})
