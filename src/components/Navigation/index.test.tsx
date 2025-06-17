import { act, render, screen } from '@testing-library/react'
import Navigation from '.'
import { initUserStore } from '@/hooks/userStore'

jest.mock('next/navigation', () => ({
  usePathname() {
    return '/explore'
  },
  useRouter() {},
}))

describe('<Navigation>', () => {
  it('should render five standard links for unautenticated user', async () => {
    const { container } = render(<Navigation />)

    await act(() => {}) // wait for lazy loaded components

    expect(container).toMatchSnapshot()
  })

  it('should replace "Login" link with "Profile" if user is signed in', async () => {
    render(<Navigation />)

    const loginLink = screen.getByText('Login')
    expect(loginLink).toBeInTheDocument()

    await act(async () => {
      initUserStore()
    })

    const profileLink = screen.getByText('Profile')
    expect(profileLink).toBeInTheDocument()
  })
})
