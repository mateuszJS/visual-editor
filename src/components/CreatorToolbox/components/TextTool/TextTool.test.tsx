import { act, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TextTool from './TextTool'
import useCreator from '@/hooks/useCreator/useCreator'
import { getSanitizedProject } from '@/test/getSanitizedProject'
import { describe, expect } from 'vitest'
import it from 'test/browser-extend'
import { page } from '@vitest/browser/context'

const project = getSanitizedProject()

describe('TextTool', () => {
  it.beforeEach(async ({ creatorCanvas }) => {
    const { result } = renderHook(useCreator)
    await act(() => {
      result.current.init(creatorCanvas, project)
    })
  })

  it('should render text icon with label', () => {
    const { container } = render(<TextTool />)
    expect(container).toMatchSnapshot()
  })

  it('clicks causes creator to update the tool to Text', async () => {
    await page.viewport(900, 800)
    const user = userEvent.setup()
    render(<TextTool />)

    await user.click(
      await screen.findByRole('button', {
        description: /add text/i,
      })
    )

    // expect(
    //   await screen.findByRole('button', {
    //     description: /add text/i,
    //     pressed: true,
    //   })
    // ).toBeInTheDocument()
  })
})
