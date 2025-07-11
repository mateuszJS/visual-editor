import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import RemoveAsset from './RemoveAsset'
import useCreator from '@/hooks/useCreator/useCreator'
import { getSanitizedProject } from '@/app/api/test/getSanitizedProject'

const project = getSanitizedProject()

describe('RemoveAsset', () => {
  beforeEach(async () => {
    const { result } = renderHook(useCreator)
    await act(() => {
      const canvas = document.createElement('canvas')
      document.body.appendChild(canvas)
      result.current.init(canvas, project)
    })
  })

  it('should upload image button', () => {
    const { container } = render(<RemoveAsset />)
    expect(container).toMatchSnapshot()
  })

  it('calls removeAsset from creator when clicked', async () => {
    render(<RemoveAsset />)

    const removeBtn = screen.getByRole('button', {
      name: /remove/i,
    })
    fireEvent.click(removeBtn)

    const { result } = renderHook(useCreator)
    expect(result.current.creator.removeAsset).toHaveBeenCalledTimes(1)
  })
})
