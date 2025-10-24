import { act, screen, render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SelectAssetTool from './SelectAssetTool'
import useCreator from '@/hooks/useCreator/useCreator'
import { CreatorTool } from '@mateuszjs/magic-render'
import { getSanitizedProject } from '@/test/getSanitizedProject'
import { describe, expect } from 'vitest'
import it from 'test/browser-extend'

const project = getSanitizedProject()

describe('SelectAssetTool', () => {
  it.beforeEach(async ({ creatorCanvas }) => {
    const { result } = renderHook(useCreator)
    await act(async () => {
      await result.current.init(creatorCanvas, project)
    })
  })

  it('should render select object icon with label', () => {
    const { container } = render(<SelectAssetTool />)
    expect(container).toMatchSnapshot()
  })

  it('should call creator.setTool with SelectAsset', async ({ creatorCanvas, skip }) => {
    skip()
    const user = userEvent.setup()
    const { result } = renderHook(useCreator)

    await act(async () => {
      await result.current.init(creatorCanvas, project)
    })

    await act(async () => {
      // SelectAsset is default selection, so we have to switch to any other tool to test click action
      result.current.creator.setTool(CreatorTool.DrawBezierCurve)
    })

    render(<SelectAssetTool />)

    await user.click(
      screen.getByRole('button', {
        description: /select object/i,
      })
    )

    expect(
      await screen.findByRole('button', {
        description: /select object/i,
        pressed: true,
      })
    ).toBeInTheDocument()
  })
})
