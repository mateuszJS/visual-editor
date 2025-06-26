import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import ErrorToast from './ErrorToast'

describe('<NavLink>', () => {
  it('should render icon and text and close button', () => {
    const { container } = render(<ErrorToast error="An error occurred" close={() => {}} />)
    expect(container).toMatchSnapshot()
  })

  it('close callback should be called on click on close icon', () => {
    const close = jest.fn()

    render(<ErrorToast error="An error occurred" close={close} />)

    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(close).toHaveBeenCalledTimes(1)
  })
})
