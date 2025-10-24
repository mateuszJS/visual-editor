import { render, screen, fireEvent, act } from '@testing-library/react'
import Logout from './Logout'
import userStore from '@/hooks/userStore/userStore'
import { http, HttpResponse } from 'msw'
import { describe, beforeAll, afterAll, expect, vi } from 'vitest'
import it from 'test/browser-extend'

// vi.spyOn(window.location, 'reload')
// vi.mock(window,  { spyOnly: true })

describe('Logout component', () => {
  // const { reload } = window.location

  beforeAll(() => {
    // vi.mock(window.location,  { spyOnly: true })
    // Object.defineProperty(window, 'location', {
    //   writable: true,
    //   value: { ...window.location, reload: vi.fn() },
    // })
  })

  afterAll(() => {
    // window.location.reload = reload
  })

  it('should call fetcher, reset user and reload window on click', async ({ worker }) => {
    worker.use(
      http.delete('/api/auth/logout', () => {
        return new HttpResponse(null, { status: 204 })
      })
    )

    render(<Logout />)

    const logoutButton = screen.getByRole('button', { name: /logout/i })
    fireEvent.click(logoutButton)

    await act(async () => {})

    expect(userStore.user).toBeNull()

    expect(window.location.reload).toHaveBeenCalled()
  })
})
