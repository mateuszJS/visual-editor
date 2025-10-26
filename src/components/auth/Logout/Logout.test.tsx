import { render, screen, act } from '@testing-library/react'
import Logout from './Logout'
import userStore from '@/hooks/userStore/userStore'
import { server } from 'test/server'
import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'

describe('Logout component', () => {
  const { reload } = window.location

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, reload: jest.fn() },
    })
  })

  afterAll(() => {
    window.location.reload = reload
  })

  it('should call fetcher, reset user and reload window on click', async () => {
    const user = userEvent.setup()
    server.use(
      http.delete('/api/auth/logout', () => {
        return new HttpResponse(null, { status: 204 })
      })
    )

    render(<Logout />)

    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await user.click(logoutButton)

    await act(async () => {})

    expect(userStore.user).toBeNull()

    expect(window.location.reload).toHaveBeenCalled()
  })
})
