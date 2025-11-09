import userEvent from '@testing-library/user-event'
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react'
import GlobalErrors from './GlobalErrors'
import errorStore from '@/stores/error'

describe('<GlobalError />', () => {
  it('should render error message when there is one', async () => {
    const user = userEvent.setup()
    const { container } = render(<GlobalErrors />)
    // no error message initially
    expect(container).toBeEmptyDOMElement()

    await act(async () => {
      // adds error message
      errorStore.message = 'Test error message'
    })

    expect(container).toMatchSnapshot()
    await user.click(screen.getByRole('button', { name: /close/i }))

    const transitionEvent = new Event('transitionend', { bubbles: true })
    Object.defineProperty(transitionEvent, 'propertyName', {
      value: 'opacity',
    })

    await act(async () => {
      fireEvent(screen.getByRole('alert'), transitionEvent)
    })

    expect(container).toBeEmptyDOMElement()
  })

  it('renders error when SW reports one', async () => {
    const { container } = render(<GlobalErrors />)

    expect(container).toBeEmptyDOMElement()

    const broadcast = new BroadcastChannel('sync-data')
    await act(async () => {
      broadcast.postMessage({
        type: 'SYNC_PROJECT_DATA_ERROR',
      })
    })

    await waitFor(() =>
      expect(errorStore.message).toBe(
        'An error occurred while syncing project data. Check your internet connection.'
      )
    )

    broadcast.close()
  })
})
