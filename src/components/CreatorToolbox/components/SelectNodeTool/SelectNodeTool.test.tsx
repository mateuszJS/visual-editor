import { act, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SelectNodeTool from './SelectNodeTool'
import useCreator from '@/hooks/useCreator/useCreator'
import { getSanitizedProject } from '@/test/getSanitizedProject'

const project = getSanitizedProject()

describe('SelectNodeTool', () => {
  beforeEach(async () => {
    const { result } = renderHook(useCreator)
    await act(() => result.current.init(window.creatorCanvas, project))
  })

  it('should render select node icon with tooltip saying: Select Node', () => {
    const { container } = render(<SelectNodeTool />)
    expect(container).toMatchSnapshot()
  })

  it('should call creator.setTool with SelectNode', async () => {
    const user = userEvent.setup()
    render(<SelectNodeTool />)

    await user.click(
      screen.getByRole('button', {
        description: /select node/i,
      })
    )

    expect(
      await screen.findByRole('button', {
        description: /select node/i,
        pressed: true,
      })
    ).toBeInTheDocument()
  })
})
