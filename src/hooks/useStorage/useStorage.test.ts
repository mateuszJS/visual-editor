import { act, renderHook } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import useStorage from './useStorage'
import { server } from 'test/server'

const waitForever = () => new Promise<never>(() => {})

describe('useStorage', () => {
  it('return list of storage items', async () => {
    const { result } = renderHook(() => useStorage())

    await act(() => {
      // allow the micro-tasks
    })

    expect(result.current).toMatchObject({
      loading: false,
      error: null,
    })
    expect([...result.current.items.entries()]).toEqual([
      ['1', { id: '1' }],
      ['2', { id: '2' }],
    ])
  })

  it('set loading to true while requesting', async () => {
    server.use(
      http.get('/api/storage', async () => {
        await waitForever()
        return HttpResponse.json({ id: '1' }, { status: 200 })
      })
    )

    const { result } = renderHook(() => useStorage())

    await act(() => {
      // allow to compelte micro-tasks
    })

    expect(result.current).toMatchObject({
      loading: true,
      error: null,
    })
    expect([...result.current.items.entries()]).toEqual([])
  })

  it('propagates fetcher errors further', async () => {
    server.use(
      http.get('/api/storage', () =>
        HttpResponse.json({ error: 'No project found.' }, { status: 404 })
      )
    )

    const { result } = renderHook(() => useStorage())

    await act(() => {
      // allow the micro-tasks to complete
    })

    expect(result.current).toMatchObject({
      loading: false,
      error: 'No project found.',
    })
    expect([...result.current.items.entries()]).toEqual([])
  })
})
