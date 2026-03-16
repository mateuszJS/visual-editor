import InitializeData from './InitializeData'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import userStore from '@/hooks/userStore/userStore'
import registerServiceWorker from './hooks/useServiceWorker/registerServiceWorker'

jest.mock('./hooks/useServiceWorker/registerServiceWorker')
const registerServiceWorkerMock = registerServiceWorker as jest.Mock

describe('<InitializeData />', () => {
  beforeEach(() => {
    // Reset the mock before each test and set its default implementation
    registerServiceWorkerMock.mockClear()
    registerServiceWorkerMock.mockResolvedValue(undefined)
  })

  it('service worker was registered', async () => {
    await act(async () => {
      render(<InitializeData />)
    })

    expect(registerServiceWorkerMock).toHaveBeenCalledTimes(1)
  })

  it('sends a message to the service worker when the page is hidden', async () => {
    const broadcast = new BroadcastChannel('sync-data')
    let receivedDataSync = false
    let receivedMiniatureSync = false

    const messagesReceivedPromise = new Promise<void>((resolve) => {
      broadcast.onmessage = (event) => {
        if (event.data === 'SYNC_PROJECT_DATA_START') {
          receivedDataSync = true
        }
        if (event.data === 'SYNC_PROJECT_MINIATURE_START') {
          receivedMiniatureSync = true
        }
        if (receivedDataSync && receivedMiniatureSync) {
          resolve()
        }
      }
    })

    render(<InitializeData />)

    fireEvent(window, new Event('pagehide', { bubbles: true }))

    await act(() => messagesReceivedPromise)

    expect(receivedDataSync).toBe(true)
    expect(receivedMiniatureSync).toBe(true)
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
