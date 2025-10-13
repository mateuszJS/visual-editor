import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import TextTool from './TextTool'
import useCreator from '@/hooks/useCreator/useCreator'
import { getSanitizedProject } from '@/app/api/test/getSanitizedProject'
import { CreatorTool } from '@mateuszjs/magic-render'

const project = getSanitizedProject()

describe('TextTool', () => {
  beforeEach(async () => {
    const { result } = renderHook(useCreator)
    await act(() => {
      result.current.init(window.creatorCanvas, project)
    })
  })

  it('should render text icon with label', () => {
    const { container } = render(<TextTool />)
    expect(container).toMatchSnapshot()
  })

  it('clicks causes creator to update the tool to Text', async () => {
    render(<TextTool />)
    fireEvent.click(screen.getByRole('button'))

    const { result } = renderHook(useCreator)

    expect(result.current.creator.setTool).toHaveBeenCalledWith(CreatorTool.Text)
  })
})
