import { act, renderHook } from '@testing-library/react'
import useCreator from '.'
import { getSanitizedProject } from '@/app/api/test/getSanitizedProject'

const project = getSanitizedProject()

describe('useCreator', () => {
  it('creator is ready only after initalization', async () => {
    const { result } = renderHook(useCreator)

    await act(async () => {
      const canvas = document.createElement('canvas')
      window.document.body.appendChild(canvas)
      result.current.init(canvas, project)
      expect(result.current.isReady).toBe(false)
    })

    expect(result.current.isReady).toBe(true)
  })

  it('creator is imidiately destroyed if requested canvas is still not connected after producing a creator', async () => {
    const { result } = renderHook(useCreator)

    await act(async () => {
      const canvas = document.createElement('canvas')
      result.current.init(canvas, project)
    })

    expect(result.current.isReady).toBe(false)
  })

  it('canvas is marked as conntected once initialized', async () => {
    const { result } = renderHook(useCreator)

    const canvas = document.createElement('canvas')
    window.document.body.appendChild(canvas)

    await act(async () => {
      result.current.init(canvas, project)
    })

    expect(canvas.hasAttribute('data-connected')).toBe(true)
  })

  it('reading creator before initialization throws error', async () => {
    const { result } = renderHook(useCreator)

    expect(() => result.current.creator).toThrow('Creator is not initialized')

    await act(async () => {
      const canvas = document.createElement('canvas')
      window.document.body.appendChild(canvas)
      result.current.init(canvas, project)
    })

    expect(() => result.current.creator).not.toThrow('Creator is not initialized')
  })

  it('reading project id before initialization throws error', async () => {
    const { result } = renderHook(useCreator)

    expect(() => result.current.projectId).toThrow('Project id is not initialized')

    await act(async () => {
      const canvas = document.createElement('canvas')
      window.document.body.appendChild(canvas)
      result.current.init(canvas, project)
    })

    expect(result.current.projectId).toEqual(0)
  })

  it("initializing creator with same canvas element twice doesn't produce a new creator", async () => {
    const { result } = renderHook(useCreator)

    const canvas = document.createElement('canvas')
    window.document.body.appendChild(canvas)

    await act(async () => {
      result.current.init(canvas, project)
    })
    const creatorFirstInit = result.current.creator

    await act(async () => {
      result.current.init(canvas, project)
    })
    const creatorSecondInit = result.current.creator

    expect(creatorFirstInit).toBe(creatorSecondInit)
  })

  it('destroying destroys connection between creator and canvas', async () => {
    // currently this test case tests the mock rather then real implementation,
    // but once WebGPU is supproted in github acitons we can remvoe the mock and start testign real implementation
    const { result } = renderHook(useCreator)

    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    await act(async () => {
      result.current.init(canvas, project)
    })

    expect(canvas.hasAttribute('data-magic-render-linked')).toBe(true)

    document.body.removeChild(canvas)

    await act(async () => {
      result.current.destroy(canvas)
    })

    expect(canvas.hasAttribute('data-magic-render-linked')).toBe(false)
  })

  it('destroying destroys connection between creator and canvas even when destroy is called before initialization is done', async () => {
    // currently this test case tests the mock rather then real implementation,
    // but once WebGPU is supproted in github acitons we can remvoe the mock and start testign real implementation

    const { result } = renderHook(useCreator)

    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    await act(async () => {
      result.current.init(canvas, project)
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
})
