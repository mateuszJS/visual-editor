import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import UploadButton from '.'
import useCreator from '../../useCreator/useCreator'
import { getSanitizedProject } from '@/app/api/test/getSanitizedProject'

const project = getSanitizedProject()

describe('UploadButton', () => {
  beforeEach(async () => {
    const { result } = renderHook(useCreator)
    await act(() => {
      const canvas = document.createElement('canvas')
      document.body.appendChild(canvas)
      result.current.init(canvas, project)
    })
  })

  it('should upload image button', () => {
    const { container } = render(<UploadButton />)
    expect(container).toMatchSnapshot()
  })

  it('renders upload modal when clicked', async () => {
    render(<UploadButton />)

    const uploadBtn = screen.getByRole('button', {
      name: /image/i,
    })
    fireEvent.click(uploadBtn)

    expect(
      await screen.findByRole('dialog', {
        name: /upload image/i,
      })
    ).toBeInTheDocument()
  })

  it('uploads a file when the file is selected', async () => {
    render(<UploadButton />)
    const uploadBtn = screen.getByRole('button', {
      name: /image/i,
    })
    fireEvent.click(uploadBtn)

    const blob = new Blob(['image-blob'], { type: 'image/png' })
    const file = new File([blob], 'image-blob.png')

    const fileInputTrigger = screen.getByLabelText(/Upload an image/i)

    global.Image = class {
      // we have to mock new Image().onload to execuse the callback
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
