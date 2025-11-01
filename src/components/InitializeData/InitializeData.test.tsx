import InitializeData from './InitializeData'
import { render, waitFor } from '@testing-library/react'
import userStore from '@/hooks/userStore/userStore'

describe('<InitializeData />', () => {
  it('service worker was registered', () => {
    render(<InitializeData />)

    expect(global.navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js')
  })

  it('send message to service worker when page is hidden', async () => {
    render(<InitializeData />)

    window.dispatchEvent(new Event('pagehide'))

    const registrationMock = await global.navigator.serviceWorker.register('')
    expect(registrationMock.active?.postMessage).toHaveBeenCalledWith('CLIENT_CLOSED')
  })

  it('should initialize user store on mount', async () => {
    expect(userStore.user).toBeUndefined()
    render(<InitializeData />)

    await waitFor(() =>
      expect(userStore.user).toEqual({
        firstName: 'John',
        lastName: 'Smith',
      })
    )
  })
})
