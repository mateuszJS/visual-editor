import { act, renderHook } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import useProject from './useProject'
import { server } from 'test/server'

const waitForever = () => new Promise<never>(() => {})

describe('useProject', () => {
  describe('fetching project', () => {
    it('that is already in the the storage does not trigger a request', async () => {
      const { result, rerender } = renderHook(useProject, { initialProps: '1' })

      await act(() => {
        // allow the micro-tasks / timers to run
      })

      // make sure project is already fetched
      expect(result.current).toMatchObject({
        loading: false,
        error: null,
        project: { id: '1' },
      })

      rerender('2')

      await act(() => {
        // allow the micro-tasks / timers to run
      })

      server.use(
        http.get('/api/projects/1', () => {
          throw Error('Request should not be made')
        })
      )

      rerender('1')

      await act(() => {
        // allow the micro-tasks / timers to run
      })

      expect(result.current).toMatchObject({
        loading: false,
        error: null,
        project: { id: '1' },
      })
    })

    it('set loading to true while requesting', async () => {
      server.use(
        http.get('/api/projects/1', async () => {
          await waitForever()
          return HttpResponse.json({ id: '1' }, { status: 200 })
        })
      )

      const { result } = renderHook(() => useProject('1'))

      expect(result.current).toMatchObject({
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

      const { result } = renderHook(() => useProject('1'))

      await act(() => {})

      expect(result.current).toMatchObject({
        loading: false,
        error: 'No project found.',
        project: null,
      })
    })
  })

  describe('creating project', () => {
    it('does not make a request on the start', () => {
      const { result } = renderHook(() => useProject())

      expect(result.current).toMatchObject({
        loading: false,
        error: null,
        project: null,
      })
    })

    it('set loading to true while requesting', async () => {
      const { result } = renderHook(() => useProject())

      server.use(
        http.post('/api/projects', async () => {
          await waitForever()
          return HttpResponse.json({ id: '1' }, { status: 201 })
        })
      )

      await act(() => {
        result.current.createProject(100, 100, () => {})
      })

      expect(result.current).toMatchObject({
        loading: true,
        error: null,
        project: null,
      })
    })

    it('propagates fetcher errors further', async () => {
      const { result } = renderHook(() => useProject())

      server.use(
        http.post('/api/projects', async () =>
          HttpResponse.json({ error: 'Invalid width' }, { status: 400 })
        )
      )

      await act(() => {
        result.current.createProject(100, 100, () => {})
      })

      expect(result.current).toMatchObject({
        loading: false,
        error: 'Invalid width',
        project: null,
      })
    })

    it('returns project if created succesfully', async () => {
      const { result } = renderHook(() => useProject())

      await act(() => {
        result.current.createProject(100, 100, (project) => {
          expect(project).toEqual({ id: '1' })
        })
      })

      expect(result.current).toMatchObject({
        loading: false,
        error: null,
        project: { id: '1' },
      })
    })
  })
})
