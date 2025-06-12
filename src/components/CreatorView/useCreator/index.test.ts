import { act, renderHook } from '@testing-library/react'
import useCreator from '.'

describe('useCreator', () => {
  it('creator is ready only after initalization', async () => {
    const { result } = renderHook(useCreator)

    await act(async () => {
      const canvas = document.createElement('canvas')
      result.current.init(canvas, 'project-id')
      expect(result.current.isReady).toBe(false)
    })

    expect(result.current.isReady).toBe(true)
  })

  it('reading creator before initialization throws error', async () => {
    const { result } = renderHook(useCreator)

    expect(() => result.current.creator).toThrow('Creator is not initialized')

    await act(async () => {
      const canvas = document.createElement('canvas')
      result.current.init(canvas, 'project-id')
    })

    expect(() => result.current.creator).not.toThrow('Creator is not initialized')
  })

  it('reading project id before initialization throws error', async () => {
    const { result } = renderHook(useCreator)

    expect(() => result.current.projectId).toThrow('Project id is not initialized')

    await act(async () => {
      const canvas = document.createElement('canvas')
      result.current.init(canvas, 'project-id')
    })

    expect(result.current.projectId).toEqual('project-id')
  })

  it("initializing creator with same canvas element again doesn't change anything", async () => {
    const { result } = renderHook(useCreator)
    const canvas = document.createElement('canvas')

    await act(async () => {
      result.current.init(canvas, 'project-id')
    })

    const creatorFirstInit = result.current.creator
    expect(canvas.hasAttribute('data-magic-render-linked')).toBe(true)

    await act(async () => {
      result.current.init(canvas, 'project-id')
    })

    expect(canvas.hasAttribute('data-magic-render-linked')).toBe(true)

    const creatorSecondInit = result.current.creator
    expect(creatorFirstInit).toBe(creatorSecondInit)
  })

  it('destroying destroys connection between creator and canvas', async () => {
    const { result } = renderHook(useCreator)
    const canvas = document.createElement('canvas')

    await act(async () => {
      result.current.init(canvas, 'project-id')
    })

    expect(canvas.hasAttribute('data-magic-render-linked')).toBe(true)

    await act(async () => {
      result.current.destroy(canvas)
    })

    expect(canvas.hasAttribute('data-magic-render-linked')).toBe(false)
  })

  it('destroying destroys connection between creator and canvas even when destroy is called before initialization is done', async () => {
    const { result } = renderHook(useCreator)
    const canvas = document.createElement('canvas')

    await act(async () => {
      result.current.init(canvas, 'project-id')
      result.current.destroy(canvas)
    })

    expect(canvas.hasAttribute('data-magic-render-linked')).toBe(false)
  })

  it("first creator will be destroyed(even if initialization hasn't completed yet) when another creator with different canvas is requested", async () => {
    const { result } = renderHook(useCreator)
    const firstCanvas = document.createElement('canvas')

    result.current.init(firstCanvas, 'project-id') // without 'act' wrapper on purpose
    // do not await foe the promsies to resolve(promise which spawns creator)

    expect(result.current.isReady).toBe(false)

    const secondCanvas = document.createElement('canvas')
    result.current.init(secondCanvas, 'project-id') // without 'act' wrapper on purpose
    // do not await foe the promsies to resolve(promise which spawns creator)

    expect(result.current.isReady).toBe(false)

    await act(async () => {})

    expect(firstCanvas.hasAttribute('data-magic-render-linked')).toBe(false)
    expect(secondCanvas.hasAttribute('data-magic-render-linked')).toBe(true)
  })
})
