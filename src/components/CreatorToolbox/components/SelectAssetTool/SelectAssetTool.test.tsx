import { act, screen, render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SelectAssetTool from './SelectAssetTool'
import useCreator from '@/hooks/useCreator/useCreator'
import { CreatorTool } from '@mateuszjs/magic-render'
import { getSanitizedProject } from '@/test/getSanitizedProject'

const project = getSanitizedProject()

describe('SelectAssetTool', () => {
  beforeEach(async () => {
    const { result } = renderHook(useCreator)
    await act(() => result.current.init(window.creatorCanvas, project))
  })

  it('should render select object icon with label', async () => {
    const { container } = render(<SelectAssetTool />)
    expect(container).toMatchSnapshot()
  })

  it('should call creator.setTool with SelectAsset', async () => {
    const user = userEvent.setup()
    const { result } = renderHook(useCreator)

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
