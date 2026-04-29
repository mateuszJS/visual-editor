import { act, renderHook } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import useStorage, { initializeStorage } from './useStorage'
import { server } from 'test/server'

const waitForever = () => new Promise<never>(() => {})

describe('useStorage', () => {
  it('return list of storage items', async () => {
    await act(async () => {
      initializeStorage()
    })
    const { result } = renderHook(() => useStorage())

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

    await act(async () => {
      initializeStorage()
    })
    const { result } = renderHook(() => useStorage())

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

    await act(async () => {
      initializeStorage()
    })
    const { result } = renderHook(() => useStorage())

    expect(result.current).toMatchObject({
      loading: false,
      error: "We couldn't fetch items from your storage.",
    })
    expect([...result.current.items.entries()]).toEqual([])
  })
})
