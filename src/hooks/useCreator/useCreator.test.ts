import { act, renderHook } from '@testing-library/react'
import useCreator from './useCreator'
import { __triggerPreviewUpdate } from '@mateuszjs/magic-render'
import useProject from '@/hooks/useProject/useProject'
import { getRequest, server } from 'test/server'
import { http } from 'msw'
import { getSanitizedProject } from '@/test/getSanitizedProject'

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
        result.current.creator.setSnapshot(
          { width: 100, height: 100, assets: [{ url: '1' }] },
          true
        )
        result.current.creator.setSnapshot(
          { width: 100, height: 100, assets: [{ url: '1' }, { url: '2' }] },
          true
        )
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
        result.current.creator.setSnapshot(
          { width: 100, height: 100, assets: [{ url: '1' }] },
          true
        )

        result.current.creator.setSnapshot(
          { width: 100, height: 100, assets: [{ url: '1' }, { url: '2' }] },
          true
        )
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

    it('breaking chain of undos(by introducing a new snapshot) cuts the history', async () => {
      // PATCH requests won't be sent if proejct doesn't exists in local storage already
      const { result: projectHookResult } = renderHook(() => useProject())
      await act(() => {
        projectHookResult.current.createProject(100, 100, () => {})
      })

      const { result } = renderHook(useCreator)

      expect(result.current.redo).toBeNull()

      // provide some history samplea
      await act(async () => {
        result.current.creator.setSnapshot(
          { width: 100, height: 100, assets: [{ url: '1' }] },
          true
        )
        result.current.creator.setSnapshot(
          { width: 100, height: 100, assets: [{ url: '1' }, { url: '2' }] },
          true
        )
        result.current.creator.setSnapshot(
          { width: 100, height: 100, assets: [{ url: '1' }, { url: '2' }, { url: '3' }] },
          true
        )
      })

      await act(async () => {
        result.current.undo?.()
      })

      let updateProjectReq = getRequest('/api/projects/1', 'PATCH')

      // do first change to cut history
      await act(async () => {
        result.current.creator.setSnapshot(
          { width: 100, height: 100, assets: [{ url: '1' }, { url: '2' }, { url: '4' }] },
          true
        )
      })
      // verify the cut
      await expect((await updateProjectReq).json()).resolves.toMatchObject({
        assets: [{ url: '1' }, { url: '2' }, { url: '4' }],
      })

      updateProjectReq = getRequest('/api/projects/1', 'PATCH')

      await act(async () => {
        result.current.undo?.()
      })

      await expect((await updateProjectReq).json()).resolves.toMatchObject({
        assets: [{ url: '1' }, { url: '2' }],
      })

      updateProjectReq = getRequest('/api/projects/1', 'PATCH')

      await act(async () => {
        result.current.undo?.()
      })

      await expect((await updateProjectReq).json()).resolves.toMatchObject({
        assets: [{ url: '1' }],
      })
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
    it('if different project id is provided, then initial assets will be dismissed', async () => {
      const { result } = renderHook(useCreator)

      const assets = ['blob:http://localhost/image-1', 'blob:http://localhost/image-2']
      await act(async () => {
        result.current.setInitialAssets('2', assets)
        await result.current.init(window.creatorCanvas, project)
      })

      expect(result.current.creator.setSnapshot).toHaveBeenNthCalledWith(
        1,
        { assets: [], height: 500, width: 500 },
        true
      )
    })

    it('initial assets are used only once, and request is sent only when are used', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01'))

      const { result: projectHookResult } = renderHook(() => useProject())
      await act(() => {
        projectHookResult.current.createProject(100, 100, () => {})
      })

      const { result } = renderHook(useCreator)

      const updateProjectRequest = getRequest('/api/projects/1', 'PATCH')

      const assets = ['blob:http://localhost/image-1', 'blob:http://localhost/image-2']
      await act(async () => {
        result.current.setInitialAssets(project.id, assets)
        await result.current.init(window.creatorCanvas, project)
      })

      expect(result.current.creator.setSnapshot).toHaveBeenNthCalledWith(
        1,
        {
          assets: [
            { url: 'blob:http://localhost/image-1' },
            { url: 'blob:http://localhost/image-2' },
          ],
          height: 500,
          width: 500,
        },
        true
      )

      await expect((await updateProjectRequest).json()).resolves.toEqual({
        width: 500,
        height: 500,
        assets: [
          { url: 'blob:http://localhost/image-1' },
          { url: 'blob:http://localhost/image-2' },
        ],
        updatedAt: '2020-01-01T00:00:00.000Z',
      })

      server.use(
        http.patch('/api/projects/:id', async () => {
          throw new Error('Should not be called again')
        })
      )

      const canvas = document.createElement('canvas')
      await act(async () => {
        window.document.body.appendChild(canvas)
        await result.current.init(canvas, project)
      })

      expect(result.current.creator.setSnapshot).toHaveBeenNthCalledWith(
        1,
        { assets: [], height: 500, width: 500 },
        true
      )

      canvas.remove()
    })
  })

  it('request with miniature is sent on miniature update', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'))

    const { result } = renderHook(useCreator)
    await act(async () => result.current.init(window.creatorCanvas, project))

    const putRequest = getRequest('/api/project-uploads/1/miniature', 'PUT')

    await act(async () => {
      __triggerPreviewUpdate({
        toBlob: (cb: (blob: Blob | null) => void) => {
          cb(new Blob(['canvas-blob'], { type: 'image/png' }))
        },
      })
    })

    const req = await putRequest
    expect(req.headers.get('x-amz-meta-updated-at')).toBe('2020-01-01T00:00:00.000Z')
    expect(await req.blob()).toEqual(new Blob(['canvas-blob'], { type: 'image/png' }))
  })

  it('whole history is updated when texture url updates after upload', async () => {
    /*
    1. Create Project
    2. Add texture
    3. Trigger like 3 snapshots
    4. Get url update for the texture
    5. Assest that all hsitory entries got updated, you can use "undo" button for it
    */
  })
})
