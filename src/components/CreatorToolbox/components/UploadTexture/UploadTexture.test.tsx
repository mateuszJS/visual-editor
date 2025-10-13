import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import UploadTexture from './UploadTexture'
import useCreator from '@/hooks/useCreator/useCreator'
import { getSanitizedProject } from '@/app/api/test/getSanitizedProject'

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
    render(<UploadTexture />)
    await act(async () => {}) /* wait for lazy loading */

    const uploadBtn = screen.getByRole('button', { description: 'Upload Image' })
    fireEvent.click(uploadBtn)

    const file = new Blob(['image-blob'], { type: 'image/png' })
    // not sure why in Jest DOM allows only blob for URL.createObjectURL and not files

    const fileInputTrigger = screen.getByLabelText(/Upload an image/i)

    global.Image = class {
      // we have to mock new Image().onload to execute the callback
      set onload(cb: VoidFunction) {
        cb()
      }
    } as unknown as typeof Image

    fireEvent.change(fileInputTrigger, {
      target: {
        files: [file],
      },
    })

    await act(async () => {})

    const { result } = renderHook(useCreator)
    expect(result.current.creator.addImage).toHaveBeenCalledTimes(1)
  })
})
