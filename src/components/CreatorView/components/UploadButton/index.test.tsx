import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import UploadButton from '.'
import useCreator from '../../useCreator'

describe('UploadButton', () => {
  beforeEach(() => {
    const { result } = renderHook(useCreator)
    result.current.init(document.createElement('canvas'), 'project-id')
  })

  it('should upload image button', () => {
    const { container } = render(<UploadButton />)
    expect(container).toMatchSnapshot()
  })

  it('renders upload modal when clicked', () => {
    render(<UploadButton />)
    const uploadBtn = screen.getByRole('button', {
      name: /image/i,
    })
    fireEvent.click(uploadBtn)

    expect(
      screen.findByRole('dialog', {
        name: /upload image/i,
      })
    ).toBeInTheDocument()
  })

  it('uploads file when file is selected', () => {
    render(<UploadButton />)
    const uploadBtn = screen.getByRole('button', {
      name: /image/i,
    })
    fireEvent.click(uploadBtn)

    const blob = new Blob(['image-blob'], { type: 'image/png' })
    const file = new File([blob], 'image-blob.png')

    const fileInputTrigger = screen.getByText(/Upload an image/i)
    fireEvent.change(fileInputTrigger, {
      target: {
        files: [file],
      },
    })

    const { result } = renderHook(useCreator)
    expect(result.current.creator.addImage).toHaveBeenCalledTimes(1)
  })
})
