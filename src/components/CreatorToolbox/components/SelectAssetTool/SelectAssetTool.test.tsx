import { act, screen, fireEvent, render, renderHook } from '@testing-library/react'
import SelectAssetTool from './SelectAssetTool'
import useCreator from '@/hooks/useCreator/useCreator'
import { getSanitizedProject } from '@/app/api/test/getSanitizedProject'
import { CreatorTool } from '@mateuszjs/magic-render'

const project = getSanitizedProject()

describe('SelectAssetTool', () => {
  beforeEach(async () => {
    const { result } = renderHook(useCreator)
    await act(() => {
      const canvas = document.createElement('canvas')
      document.body.appendChild(canvas)
      result.current.init(canvas, project)
    })
  })

  it('should render select object icon with label', () => {
    const { container } = render(<SelectAssetTool />)
    expect(container).toMatchSnapshot()
  })

  it('should call creator.setTool with SelectAsset', () => {
    const { result } = renderHook(useCreator)

    render(<SelectAssetTool />)

    fireEvent.click(screen.getByRole('button'))

    expect(result.current.creator.setTool).toHaveBeenCalledWith(CreatorTool.SelectAsset)
  })
})
