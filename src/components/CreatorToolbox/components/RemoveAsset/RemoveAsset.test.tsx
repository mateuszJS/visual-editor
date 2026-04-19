import { act, render, renderHook, screen } from '@testing-library/react'
import RemoveAsset from './RemoveAsset'
import useCreator from '@/hooks/useCreator/useCreator'
import { getSanitizedProject } from '@/test/getSanitizedProject'
import userEvent from '@testing-library/user-event'
import { projectsStore } from '@/hooks/useProject/useProject'

const project = getSanitizedProject()

describe('RemoveAsset', () => {
  beforeEach(async () => {
    const { result } = renderHook(useCreator)
    projectsStore.set(project.id, project)
    await act(() => result.current.init(window.creatorCanvas, project))
  })

  it('should upload image button', () => {
    const { container } = render(<RemoveAsset />)
    expect(container).toMatchSnapshot()
  })

  it('calls removeAsset from creator when clicked', async () => {
    const user = userEvent.setup()
    render(<RemoveAsset />)

    const removeBtn = screen.getByRole('button', {
      name: /remove/i,
    })
    await user.click(removeBtn)

    const { result } = renderHook(useCreator)
    expect(result.current.creator.removeAsset).toHaveBeenCalledTimes(1)
  })
})
