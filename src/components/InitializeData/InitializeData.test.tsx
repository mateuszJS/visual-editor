import InitializeData from './InitializeData'
import { act, render, waitFor } from '@testing-library/react'
import userStore from '@/hooks/userStore/userStore'
import registerServiceWorker from './initServiceWorker/registerServiceWorker'

jest.mock('./initServiceWorker/registerServiceWorker')
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

  it('should initialize user store on mount', async () => {
    expect(userStore.user).toBeUndefined()
    render(<InitializeData />)

    await waitFor(() => expect(userStore.user).toEqual({ id: '1', email: 'alice@test.com' }))
  })
})
