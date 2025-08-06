import { act, render, renderHook } from '@testing-library/react'
import TextTool from './TextTool'
import useCreator from '@/hooks/useCreator/useCreator'
import { getSanitizedProject } from '@/app/api/test/getSanitizedProject'

const project = getSanitizedProject()

describe('TextTool', () => {
  beforeEach(async () => {
    const { result } = renderHook(useCreator)
    await act(() => {
      const canvas = document.createElement('canvas')
      document.body.appendChild(canvas)
      result.current.init(canvas, project)
    })
  })

  it('should render text icon with label', () => {
    const { container } = render(<TextTool />)
    expect(container).toMatchSnapshot()
  })
})
