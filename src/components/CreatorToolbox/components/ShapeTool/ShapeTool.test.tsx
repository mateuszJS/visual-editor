import { act, render, renderHook, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import ShapeTool from './ShapeTool'
import useCreator from '@/hooks/useCreator/useCreator'
import { getSanitizedProject } from '@/app/api/test/getSanitizedProject'

const project = getSanitizedProject()

describe('ShapeTool', () => {
  beforeEach(async () => {
    const { result } = renderHook(useCreator)
    await act(() => {
      result.current.init(window.creatorCanvas, project)
    })
  })

  it('should render pen icon with label', () => {
    const { container } = render(<ShapeTool />)
    expect(container).toMatchSnapshot()
  })

  it('clicks causes creator to update the tool to DrawBezierCurve', async () => {
    render(<ShapeTool />)

    await user.click(
      screen.getByRole('button', {
        description: /draw shape/i,
      })
    )

    expect(
      await screen.findByRole('button', {
        description: /draw shape/i,
        pressed: true,
      })
    ).toBeInTheDocument()
  })
})
