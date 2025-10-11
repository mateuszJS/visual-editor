import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import SelectNodeTool from './SelectNodeTool'
import useCreator from '@/hooks/useCreator/useCreator'
import { CreatorTool } from '@mateuszjs/magic-render'
import { getSanitizedProject } from '@/app/api/test/getSanitizedProject'

const project = getSanitizedProject()

describe('SelectNodeTool', () => {
  beforeEach(async () => {
    const { result } = renderHook(useCreator)
    await act(() => {
      result.current.init(window.creatorCanvas, project)
    })
  })

  it('should render select node icon with tooltip saying: Select Node', () => {
    const { container } = render(<SelectNodeTool />)
    expect(container).toMatchSnapshot()
  })

  it('should call creator.setTool with SelectNode', () => {
    const { result } = renderHook(useCreator)

    render(<SelectNodeTool />)

    fireEvent.click(screen.getByRole('button'))

    expect(result.current.creator.setTool).toHaveBeenCalledWith(CreatorTool.SelectNode)
  })
})
