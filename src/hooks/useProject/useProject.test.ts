import { act, renderHook } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import useProject from './useProject'
import { server } from 'test/server'

describe('useProject', () => {
  describe('fetching project', () => {
    it('that is already in the the storage does not trigger a request', async () => {
      const { result, rerender } = renderHook(() => useProject('1'))

      await act(() => {
        // allow the micro-tasks / timers to run
      })

      // make sure project is already fetched
      expect(result.current).toMatchObject({
        loading: false,
        error: null,
        project: { id: '1' },
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
      expect(result.current).toMatchObject({
        loading: false,
        error: null,
        project: { id: '1' },
      })
    })

    it('set loading to true while requesting', async () => {
      server.use(
        http.get('/api/projects/1', async () => {
          await delay('infinite')
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
          await delay('infinite')
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
          expect(project).toMatchObject({ id: '1' })
        })
      })

      expect(result.current).toMatchObject({
        loading: false,
        error: null,
        project: { id: '1' },
      })
    })
  })

  describe('updating project', () => {
    it('throws an error if the project is not yet in the store', async () => {
      const { result } = renderHook(() => useProject())
      await act(async () => {
        await expect(result.current.updateProject('1', { width: 200 })).rejects.toThrow(
          'Project with id 1 does not exist in the store'
        )
      })
    })

    it('updating project does NOT set loading to true', async () => {
      const { result } = renderHook(() => useProject())

      await act(() => {
        result.current.createProject(100, 100, () => {})
      })

      server.use(
        http.patch('/api/projects/:id', async () => {
          await delay('infinite')
          return HttpResponse.json(null, { status: 204 })
        })
      )

      await act(() => {
        result.current.updateProject('1', { width: 200 })
      })

      expect(result.current).toMatchObject({
        loading: false,
        error: null,
        project: { id: '1' },
      })
    })

    it('successfully returns updated proejct from the hook', async () => {
      const { result } = renderHook(() => useProject())

      await act(() => {
        result.current.createProject(100, 100, () => {})
      })

      await act(() => {
        result.current.updateProject('1', { width: 200 })
      })

      expect(result.current).toMatchObject({
        loading: false,
        error: null,
        project: { id: '1', width: 200 },
      })
    })
  })
})
