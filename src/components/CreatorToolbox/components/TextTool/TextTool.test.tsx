import { act, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TextTool from './TextTool'
import useCreator from '@/hooks/useCreator/useCreator'
import { getSanitizedProject } from '@/test/getSanitizedProject'

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
    const user = userEvent.setup()
    render(<TextTool />)

    await user.click(
      screen.getByRole('button', {
        description: /add text/i,
      })
    )

    expect(
      await screen.findByRole('button', {
        description: /add text/i,
        pressed: true,
      })
    ).toBeInTheDocument()
  })
})
