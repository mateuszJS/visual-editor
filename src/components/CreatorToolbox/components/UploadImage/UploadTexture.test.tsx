import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UploadTexture from './UploadTexture'
import useCreator from '@/hooks/useCreator/useCreator'
import { getSanitizedProject } from '@/test/getSanitizedProject'

const project = getSanitizedProject()

describe('UploadTexture', () => {
  beforeEach(async () => {
    const { result } = renderHook(useCreator)
    await act(() => {
      result.current.init(window.creatorCanvas, project)
    })
  })

  it('should render the image icon with label', async () => {
    const { container } = render(<UploadTexture />)
    await act(async () => {
      /* wait for lazy loading */
    })
    expect(container).toMatchSnapshot()
  })

  it('renders upload modal when clicked', async () => {
    render(<UploadTexture />)
    await act(async () => {}) /* wait for lazy loading */

    const uploadBtn = screen.getByRole('button', { description: 'Upload Image' })
    fireEvent.click(uploadBtn)

    expect(
      await screen.findByRole('dialog', {
        name: /upload image/i,
      })
    ).toBeInTheDocument()
  })

  it('uploads files and adds to the project', async () => {
    const user = userEvent.setup()
    render(<UploadTexture />)

    await user.click(
      await screen.findByRole('button', {
        description: 'Upload Image',
      })
    )

    const fileInputTrigger = await screen.findByLabelText(/Upload an image/i)
    const files = [new File(['image'], 'image.png', { type: 'image/png' })]
    await user.upload(fileInputTrigger, files)

    const { result } = renderHook(useCreator)
    expect(result.current.creator.addImage).toHaveBeenCalledTimes(1)
  })
})
