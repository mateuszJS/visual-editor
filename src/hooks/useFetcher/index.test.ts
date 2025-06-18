import { act, renderHook } from '@testing-library/react'
import useFetcher from '.'
import { delay, http, HttpResponse } from 'msw'
import { server } from 'test/server'

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

    server.use(
      http.get('/api/me', async () => {
        await delay('infinite')
        return HttpResponse.json({ userId: 0 }, { status: 200 })
      })
    )

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

    server.use(
      http.get('/api/me', () => HttpResponse.json({ error: 'Error has occured' }, { status: 400 }))
    )

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

    server.use(http.get('/api/me', () => new HttpResponse(null, { status: 400 })))

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

    server.use(http.get('/api/me', () => new HttpResponse()))

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

  describe('resets everything to initial state when fetcher is called again', () => {
    it('and initial request has succeeded', async () => {
      const { result } = renderHook(() => useFetcher())
      const { fetcher } = result.current

      await act(() => {
        fetcher('/api/me')
      })

      // test if first request was handled correctly
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

      // make request pending
      server.use(
        http.get('/api/me', async () => {
          await delay('infinite')
          return HttpResponse.json({ userId: 0 }, { status: 200 })
        })
      )

      // call fetcher again
      await act(() => {
        fetcher('/api/me')
      })

      // test if all properties were reset
      expect(result.current).toEqual({
        loading: true,
        error: null,
        success: null,
        fetcher: expect.any(Function),
      })
    })

    it('and initial fetched failed', async () => {
      const { result } = renderHook(() => useFetcher())
      const { fetcher } = result.current

      // make request pending
      server.use(http.get('/api/me', () => HttpResponse.error()))

      await act(() => {
        fetcher('/api/me')
      })

      // test if first request was handled correctly
      expect(result.current).toEqual({
        loading: false,
        error: 'Failed to fetch',
        success: null,
        fetcher: expect.any(Function),
      })

      // make request pending
      server.use(
        http.get('/api/me', async () => {
          await delay('infinite')
          return HttpResponse.json({ userId: 0 }, { status: 200 })
        })
      )

      // call fetcher again
      await act(() => {
        fetcher('/api/me')
      })

      // test if all properties were reset
      expect(result.current).toEqual({
        loading: true,
        error: null,
        success: null,
        fetcher: expect.any(Function),
      })
    })
  })

  describe('returns latest sent request related output', () => {
    it('if previous request completed with success', async () => {
      const { result } = renderHook(() => useFetcher())
      const { fetcher } = result.current

      await act(() => {
        fetcher('/api/me')
      })

      // just to make sure we test if first request was handled correctly
      expect(result.current.success).toEqual({
        json: {
          firstName: 'John',
          lastName: 'Smith',
        },
      })

      // set different response
      server.use(http.get('/api/me', () => HttpResponse.json({ userId: 0 }, { status: 200 })))

      // requests again
      await act(() => {
        fetcher('/api/me')
      })

      // test if first request was handled correctly
      expect(result.current).toEqual({
        loading: false,
        error: null,
        success: {
          json: {
            userId: 0,
          },
        },
        fetcher: expect.any(Function),
      })
    })

    it('if previous request completed with error', async () => {
      const { result } = renderHook(() => useFetcher())
      const { fetcher } = result.current

      server.use(http.get('/api/me', () => HttpResponse.error()))

      await act(() => {
        fetcher('/api/me')
      })

      // make sure first request ended with error
      expect(result.current.error).toEqual('Failed to fetch')

      server.use(
        http.get('/api/me', () =>
          HttpResponse.json({ firstName: 'John', lastName: 'Smith' }, { status: 200 })
        )
      )

      await act(() => {
        fetcher('/api/me')
      })

      // test if first request was handled correctly
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

    describe("if previous request hasn't completed yet but will complete", () => {
      beforeEach(() => {
        jest.useFakeTimers()
      })

      afterEach(() => {
        jest.useRealTimers()
      })

      it('before current one completes', async () => {
        /*
          1. fetcher('api/me')
          2. fetcher('api/projects/1')
          3. Receives response for api/me
          4. Receives response for api/projects/1
        */

        server.use(
          http.get('/api/me', async () => {
            await delay(1)
            return HttpResponse.json({ me: true }, { status: 200 })
          })
        )

        server.use(
          http.get('/api/projects/1', async () => {
            await delay(2)
            return HttpResponse.json({ projects: true }, { status: 200 })
          })
        )

        const { result } = renderHook(() => useFetcher())
        const { fetcher } = result.current

        await act(() => {
          fetcher('/api/me')
        })

        expect(result.current.loading).toEqual(true)

        await act(() => {
          fetcher('/api/projects/1')
        })

        await act(async () => {
          jest.advanceTimersByTime(1) // api/me response arrives
        })

        // should not react to prior requested response
        expect(result.current).toEqual({
          loading: true,
          error: null,
          success: null,
          fetcher: expect.any(Function),
        })

        await act(async () => {
          jest.advanceTimersByTime(1) // api/projects/1 response arrives
        })

        // should only honor lastest requested response
        expect(result.current).toEqual({
          loading: false,
          error: null,
          success: { json: { projects: true } },
          fetcher: expect.any(Function),
        })
      })

      it('after current one completes', async () => {
        /*
          1. fetcher('api/me')
          2. fetcher('api/projects/1')
          3. Receives response for api/projects/1
          4. Receives response for api/me
        */

        server.use(
          http.get('/api/projects/1', async () => {
            await delay(1)
            return HttpResponse.json({ projects: true }, { status: 200 })
          })
        )

        server.use(
          http.get('/api/me', async () => {
            await delay(2)
            return HttpResponse.json({ me: true }, { status: 200 })
          })
        )

        const { result } = renderHook(() => useFetcher())
        const { fetcher } = result.current

        await act(() => {
          fetcher('/api/me')
        })

        expect(result.current.loading).toEqual(true)

        await act(() => {
          fetcher('/api/projects/1')
        })

        await act(async () => {
          jest.advanceTimersByTime(1) // api/projects/1 response arrives
        })

        // honors latest request
        expect(result.current).toEqual({
          loading: false,
          error: null,
          success: { json: { projects: true } },
          fetcher: expect.any(Function),
        })

        await act(async () => {
          jest.advanceTimersByTime(1) // api/me response arrives
        })

        /* keeps honoring only latest request,
          ignoring prior requests even if response arrived as last one */
        expect(result.current).toEqual({
          loading: false,
          error: null,
          success: { json: { projects: true } },
          fetcher: expect.any(Function),
        })
      })
    })
  })
})
