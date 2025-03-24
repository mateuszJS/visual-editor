import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import HomeIcon from 'assets/home-icon.svg'
import NavLink from '.'

const mockUsePathname = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname() {
    return mockUsePathname()
  },
}))

describe('<NavLink>', () => {
  it('should render icon and text>', () => {
    const { container } = render(
      <NavLink href="my-link">
        <>
          <HomeIcon />
          Content
        </>
      </NavLink>
    )
    expect(container).toMatchSnapshot()
  })

  it('should add class active when is active', () => {
    mockUsePathname.mockImplementation(() => '/my-link')
    const { container } = render(
      <NavLink href="/my-link">
        <>
          <HomeIcon />
          Content
        </>
      </NavLink>
    )
    expect(container).toMatchSnapshot()
  })
})
