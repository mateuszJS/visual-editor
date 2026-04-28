import { act, renderHook } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import useProjectsList, { initializeProjectsList } from './useProjectsList'
import { server } from 'test/server'

const waitForever = () => new Promise<never>(() => {})

// TODO: update tests to match new features of refreshing data after an hour
describe('useProjectsList', () => {
  it('return list of projects', async () => {
    await act(async () => {
      initializeProjectsList()
    })

    const { result } = renderHook(() => useProjectsList())

    expect(result.current).toMatchObject({
      loading: false,
      error: null,
    })
    expect([...result.current.projectsList.entries()]).toEqual([
      ['1', { id: '1' }],
      ['2', { id: '2' }],
    ])
  })

  it('set loading to true while requesting', async () => {
    server.use(
      http.get('/api/projects', async () => {
        await waitForever()
        return HttpResponse.json({ id: '1' }, { status: 200 })
      })
    )

    await act(async () => {
      initializeProjectsList()
    })
    const { result } = renderHook(() => useProjectsList())

    expect(result.current).toMatchObject({
      loading: true,
      error: null,
    })
    expect([...result.current.projectsList.entries()]).toEqual([])
  })

  it('propagates fetcher errors further', async () => {
    server.use(
      http.get('/api/projects', () =>
        HttpResponse.json({ error: 'No project found.' }, { status: 404 })
      )
    )

    await act(async () => {
      initializeProjectsList()
    })
    const { result } = renderHook(() => useProjectsList())

    expect(result.current).toMatchObject({
      loading: false,
      error: 'No project found.',
    })
    expect([...result.current.projectsList.entries()]).toEqual([])
  })
})
