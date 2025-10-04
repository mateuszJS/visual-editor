import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import ShapeTool from './ShapeTool'
import useCreator from '@/hooks/useCreator/useCreator'
import { getSanitizedProject } from '@/app/api/test/getSanitizedProject'
import { CreatorTool } from '@mateuszjs/magic-render'

const project = getSanitizedProject()

describe('ShapeTool', () => {
  beforeEach(async () => {
    const { result } = renderHook(useCreator)
    await act(() => {
      const canvas = document.createElement('canvas')
      document.body.appendChild(canvas)
      result.current.init(canvas, project)
    })
  })

  it('should render pen icon with label', () => {
    const { container } = render(<ShapeTool />)
    expect(container).toMatchSnapshot()
  })

  it('should set tool to DrawShape when clicked', async () => {
    render(<ShapeTool />)
    const shapeToolBtn = screen.getByRole('button', {
      name: /shape/i,
    })
    fireEvent.click(shapeToolBtn)

    const { result } = renderHook(useCreator)

    expect(result.current.creator.setTool).toHaveBeenCalledWith(CreatorTool.DrawShape)
  })
})
