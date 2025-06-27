import { act, fireEvent, render, screen } from '@testing-library/react'
import GlobalErrors from './GlobalErrors'
import errorStore from '@/stores/error'

describe('<GlobalError />', () => {
  it('should render error message when there is one', async () => {
    const { container } = render(<GlobalErrors />)
    // no error message initially
    expect(container).toBeEmptyDOMElement()

    await act(async () => {
      // adds error message
      errorStore.message = 'Test error message'
    })

    expect(container).toMatchSnapshot()
    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    const transitionEvent = new Event('transitionend', { bubbles: true })
    Object.defineProperty(transitionEvent, 'propertyName', {
      value: 'opacity',
    })
    await act(async () => {
      fireEvent(screen.getByRole('alert'), transitionEvent)
    })

    expect(container).toBeEmptyDOMElement()
  })
})
