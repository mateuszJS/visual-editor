import { act, renderHook } from '@testing-library/react'
import useCreator from './useCreator'
import { __triggerUpdateAssets } from '@mateuszjs/magic-render'
import useProject from '@/hooks/useProject/useProject'
import { server } from 'test/server'
import { http, HttpResponse } from 'msw'
import { getSanitizedProject } from '@/test/getSanitizedProject'
import { SanitizedProject } from '@/types'

const project = getSanitizedProject()

describe('useCreator', () => {
  it('creator is ready only after initialization', async () => {
    const { result } = renderHook(useCreator)

    expect(result.current.isReady).toBe(false)

    await act(async () => result.current.init(window.creatorCanvas, project))

    expect(result.current.isReady).toBe(true)
  })

  it('creator is imidiately destroyed if requested canvas is still not connected after producing a creator', async () => {
    const { result } = renderHook(useCreator)

    await act(async () => {
      const canvas = document.createElement('canvas')
      await result.current.init(canvas, project)
    })

    expect(result.current.isReady).toBe(false)
  })

  it('canvas is marked as connected once initialized', async () => {
    const { result } = renderHook(useCreator)

    await act(async () => result.current.init(window.creatorCanvas, project))

    expect(window.creatorCanvas.hasAttribute('data-connected')).toBe(true)
  })

  it('reading creator before initialization throws error', async () => {
    const { result } = renderHook(useCreator)

    expect(() => result.current.creator).toThrow('Creator is not initialized')

    await act(async () => result.current.init(window.creatorCanvas, project))

    expect(() => result.current.creator).not.toThrow('Creator is not initialized')
  })

  it('reading project id before initialization throws error', async () => {
    const { result } = renderHook(useCreator)

    expect(() => result.current.projectId).toThrow('Project id is not initialized')

    await act(async () => result.current.init(window.creatorCanvas, project))

    expect(result.current.projectId).toEqual('1')
  })

  it("initializing creator with same canvas element twice doesn't produce a new creator", async () => {
    const { result } = renderHook(useCreator)

    await act(async () => result.current.init(window.creatorCanvas, project))
    const creatorFirstInit = result.current.creator

    await act(async () => result.current.init(window.creatorCanvas, project))
    const creatorSecondInit = result.current.creator

    expect(creatorFirstInit).toBe(creatorSecondInit)
  })

  it('destroying destroys connection between creator and canvas and resets all data to initial state', async () => {
    // currently this test case tests the mock rather then real implementation,
    // but once WebGPU is supproted in github acitons we can remvoe the mock and start testign real implementation
    const { result } = renderHook(useCreator)

    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    await act(async () => result.current.init(canvas, project))

    expect(canvas.hasAttribute('data-magic-render-linked')).toBe(true)

    document.body.removeChild(canvas)

    await act(async () => {
      result.current.destroy(canvas)
    })

    expect(canvas.hasAttribute('data-magic-render-linked')).toBe(false)
    expect(() => result.current.creator).toThrow(Error('Creator is not initialized'))
    expect(() => result.current.projectId).toThrow(Error('Project id is not initialized'))
    expect(result.current.selectedAssetId).toBeNull()
    expect(result.current.undo).toBeNull()
    expect(result.current.redo).toBeNull()
  })

  describe('undo/redo', () => {
    beforeEach(async () => {
      const { result: useProjectRef } = renderHook(useProject)

      await act(
        async () =>
          new Promise((resolve) => {
            useProjectRef.current.createProject(100, 100, () => {
              resolve()
            })
          })
      )

      const { result: useCreatorRef } = renderHook(useCreator)

      await act(async () => useCreatorRef.current.init(window.creatorCanvas, project))
    })

    it('undo is null when there is no more snapshots to go back in time', async () => {
      const { result } = renderHook(useCreator)

      expect(result.current.undo).toBeNull()

      await act(async () => {
        __triggerUpdateAssets([])
        __triggerUpdateAssets([{ id: 1 }])
        __triggerUpdateAssets([{ id: 1 }, { id: 2 }])
      })

      expect(result.current.undo).toEqual(expect.any(Function))

      await act(async () => {
        result.current.undo?.()
      })

      expect(result.current.undo).toEqual(expect.any(Function))

      await act(async () => {
        result.current.undo?.()
      })

      expect(result.current.undo).toBeNull()
    })

    it('redo is null when there is no history', async () => {
      const { result } = renderHook(useCreator)

      expect(result.current.redo).toBeNull()

      await act(async () => {
        __triggerUpdateAssets([{ id: 1 }])
        __triggerUpdateAssets([{ id: 1 }, { id: 2 }])
      })

      await act(async () => {
        result.current.undo!()
      })

      expect(result.current.redo).toEqual(expect.any(Function))

      await act(async () => {
        result.current.redo!()
      })

      expect(result.current.redo).toBeNull()
    })

    it('breaking chain of undos(by any new snapshot) correctly cuts the history', async () => {
      const { result } = renderHook(useCreator)

      expect(result.current.redo).toBeNull()

      await act(async () => {
        __triggerUpdateAssets([{ url: '1' }])
        __triggerUpdateAssets([{ url: '1' }, { url: '2' }])
        __triggerUpdateAssets([{ url: '1' }, { url: '2' }, { url: '3' }])
      })

      await act(async () => {
        result.current.undo?.()
      })

      let receivedPayload = null
      server.use(
        http.patch('/api/projects/:id', async ({ request }) => {
          const data = (await request.json()) as SanitizedProject
          receivedPayload = data?.assets
          return new HttpResponse(null, { status: 204 })
        })
      )

      await act(async () => {
        __triggerUpdateAssets([{ url: '1' }, { url: '2' }, { url: '4' }])
      })

      expect(receivedPayload).toEqual([{ url: '1' }, { url: '2' }, { url: '4' }])

      await act(async () => {
        result.current.undo?.()
      })

      server.use(
        http.patch('/api/projects/:id', async ({ request }) => {
          const data = (await request.json()) as SanitizedProject
          receivedPayload = data?.assets
          return new HttpResponse(null, { status: 204 })
        })
      )

      expect(receivedPayload).toEqual([{ url: '1' }, { url: '2' }])

      await act(async () => {
        result.current.undo?.()
      })

      server.use(
        http.patch('/api/projects/:id', async ({ request }) => {
          const data = (await request.json()) as SanitizedProject
          receivedPayload = data?.assets
          return new HttpResponse(null, { status: 204 })
        })
      )

      expect(receivedPayload).toEqual([{ url: '1' }])
    })
  })

  it('destroying destroys connection between creator and canvas even when destroy is called before initialization is done', async () => {
    // currently this test case tests the mock rather then real implementation,
    // but once WebGPU is supported in github actions we can remove the mock and start testing real implementation

    const { result } = renderHook(useCreator)

    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    await act(async () => {
      await result.current.init(canvas, project)
      document.body.removeChild(canvas)
      result.current.destroy(canvas)
    })

    expect(canvas.hasAttribute('data-magic-render-linked')).toBe(false)
  })

  it('first creator will NOT be destroyed when another creator with different canvas is requested', async () => {
    const { result } = renderHook(useCreator)

    const firstCanvas = document.createElement('canvas')
    document.body.appendChild(firstCanvas)

    const secondCanvas = document.createElement('canvas')
    document.body.appendChild(secondCanvas)

    await act(async () => {
      result.current.init(firstCanvas, project) // without 'act' wrapper on purpose
      // to do not await for the promsies to resolve(promise which spawns creator)
      expect(result.current.isReady).toBe(false)

      result.current.init(secondCanvas, project) // without 'act' wrapper on purpose
      // do not await for the promsies to resolve(promise which spawns creator)
      expect(result.current.isReady).toBe(false)
    })

    expect(firstCanvas.hasAttribute('data-magic-render-linked')).toBe(true)
    expect(secondCanvas.hasAttribute('data-magic-render-linked')).toBe(true)
  })

  describe('providing initial assets to creator', () => {
    it('with matching project id assets will be used right after creator initialization', async () => {
      const { result } = renderHook(useCreator)

      const assets = ['blob:http://localhost/image-1', 'blob:http://localhost/image-2']
      await act(async () => {
        result.current.setInitialAssets(project.id, assets)
        await result.current.init(window.creatorCanvas, project)
      })

      expect(result.current.creator.resetAssets).toHaveBeenNthCalledWith(
        1,
        [{ url: expect.any(String) }, { url: expect.any(String) }],
        true
      )
    })

    it('if different project id assets will be dismissed', async () => {
      const { result } = renderHook(useCreator)

      const assets = ['blob:http://localhost/image-1', 'blob:http://localhost/image-2']
      await act(async () => {
        result.current.setInitialAssets('2', assets)
        await result.current.init(window.creatorCanvas, project)
      })

      expect(result.current.creator.resetAssets).toHaveBeenNthCalledWith(1, [], true)
    })

    it('initial assets are used only once', async () => {
      const { result } = renderHook(useCreator)

      const assets = ['blob:http://localhost/image-1', 'blob:http://localhost/image-2']
      await act(async () => {
        result.current.setInitialAssets(project.id, assets)
        await result.current.init(window.creatorCanvas, project)
      })

      const canvas = document.createElement('canvas')
      await act(async () => {
        window.document.body.appendChild(canvas)
        await result.current.init(canvas, project)
      })

      // remember that with init(canvas, project) we return a new creator instance
      // with a new resetAssets jest spy function, so thats why it should be 0 called, not 2
      expect(result.current.creator.resetAssets).toHaveBeenNthCalledWith(1, [], true)
      canvas.remove()
    })
  })
})
