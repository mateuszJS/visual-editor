import { act, render, renderHook } from '@testing-library/react'
import CreatorToolbox from './CreatorToolbox'
import useCreator from '@/hooks/useCreator/useCreator'
import { __triggerSelectAsset } from '@mateuszjs/magic-render'
import { getSanitizedProject } from '@/app/api/test/getSanitizedProject'

const project = getSanitizedProject()

describe('CreatorToolbox - creator not initilized yet', () => {
  it('if reator is not initialized, it should not render toolbox content', () => {
    const { container } = render(<CreatorToolbox />)
    expect(container).toMatchSnapshot()
  })
})

describe('CreatorToolbox', () => {
  beforeEach(async () => {
    const { result } = renderHook(useCreator)
    await act(async () => {
      const canvas = document.createElement('canvas')
      document.body.appendChild(canvas)
      result.current.init(canvas, project)
    })
  })

  it('by default displays general toolbox items', () => {
    const { container } = render(<CreatorToolbox />)
    expect(container).toMatchSnapshot()
  })

  it('by default displays general toolbox items', async () => {
    const { container } = render(<CreatorToolbox />)
    await act(async () => {
      __triggerSelectAsset([1, 0, 0, 0])
    })

    expect(container).toMatchSnapshot()
  })
})
