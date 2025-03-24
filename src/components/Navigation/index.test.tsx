import { act, render, screen } from '@testing-library/react'
import Navigation from '.'
import useUserStore from '@/hooks/useUserStore'

jest.mock('next/navigation', () => ({
  usePathname() {
    return () => '/explore'
  },
}))

describe('<Navigation>', () => {
  it('should render five standard links for unautenticated user', () => {
    const { container } = render(<Navigation />)
    expect(container).toMatchSnapshot()
  })

  it('should replace "Login" link with "Profile" if user is signed in', async () => {
    render(<Navigation />)

    const loginLink = screen.getByText('Login')
    expect(loginLink).toBeInTheDocument()

    await act(async () => {
      useUserStore.setState({ user: {} })
    })

    const profileLink = screen.getByText('Profile')
    expect(profileLink).toBeInTheDocument()
  })
})
