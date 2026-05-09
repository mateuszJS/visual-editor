import { act, renderHook } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { useTemplatesList, initializeTemplatesList } from './useTemplatesList'
import { server } from 'test/server'

const waitForever = () => new Promise<never>(() => {})

// TODO: update tests to match new features of refreshing data after an hour

describe('useTemplatesList', () => {
  it('return list of templates stored by creation date', async () => {
    await act(async () => {
      initializeTemplatesList()
    })

    const { result } = renderHook(() => useTemplatesList())

    expect(result.current).toMatchObject({
      loading: false,
      error: null,
    })
    expect([...result.current.templatesList.entries()]).toEqual([
      ['1', { id: '1' }],
      ['2', { id: '2' }],
    ])
  })

  it('set loading to true while requesting', async () => {
    server.use(
      http.get('/api/templates', async () => {
        await waitForever()
        return HttpResponse.json({ id: '1' }, { status: 200 })
      })
    )

    await act(async () => {
      initializeTemplatesList()
    })
    const { result } = renderHook(() => useTemplatesList())

    expect(result.current).toMatchObject({
      loading: true,
      error: null,
    })
    expect([...result.current.templatesList.entries()]).toEqual([])
  })

  it('propagates fetcher errors further', async () => {
    server.use(
      http.get('/api/templates', () =>
        HttpResponse.json({ error: 'No template found.' }, { status: 404 })
      )
    )

    await act(async () => {
      initializeTemplatesList()
    })
    const { result } = renderHook(() => useTemplatesList())

    expect(result.current).toMatchObject({
      loading: false,
      error: 'No template found.',
    })
    expect([...result.current.templatesList.entries()]).toEqual([])
  })
})
