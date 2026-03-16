import { render, screen } from '@testing-library/react'
import Logout from './Logout'
import userStore from '@/hooks/userStore/userStore'
import userEvent from '@testing-library/user-event'

describe('Logout component', () => {
  it('should call fetcher, reset user and reload window on click', async () => {
    const implSymbol = Reflect.ownKeys(window.location).find((i) => typeof i === 'symbol')!
    const windowReload = jest.spyOn(
      (window.location as unknown as { [key: symbol]: { reload: VoidFunction } })[implSymbol],
      'reload'
    )

    const user = userEvent.setup()

    render(<Logout />)
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await user.click(logoutButton)

    expect(userStore.user).toBeNull()
    expect(windowReload).toHaveBeenCalled()
    windowReload.mockRestore()
  })
})
