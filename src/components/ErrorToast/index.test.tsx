import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorToast from './ErrorToast'

describe('<ErrorToast>', () => {
  it('should render icon and text and close button', () => {
    const { container } = render(<ErrorToast error="An error occurred" close={() => {}} />)
    expect(container).toMatchSnapshot()
  })

  it('close callback should be called on click on close icon & wait until transition ends', async () => {
    const user = userEvent.setup()
    const close = jest.fn()

    render(<ErrorToast error="An error occurred" close={close} />)

    await user.click(screen.getByRole('button', { name: /close/i }))

    const transitionEvent = new Event('transitionend', { bubbles: true })
    Object.defineProperty(transitionEvent, 'propertyName', {
      value: 'opacity',
    })
    await act(async () => {
      fireEvent(screen.getByRole('alert'), transitionEvent)
    })

    expect(close).toHaveBeenCalledTimes(1)
  })
})
