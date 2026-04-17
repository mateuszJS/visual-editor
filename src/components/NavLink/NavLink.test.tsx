import { render } from '@testing-library/react'
import HomeIcon from 'assets/home-icon.svg'
import NavLink from './NavLink'

const mockUsePathname = jest.fn(() => '/')

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter() {},
}))

describe('<NavLink>', () => {
  it('should render icon and text', () => {
    const { container } = render(
      <NavLink href="/storage">
        <>
          <HomeIcon />
          Content
        </>
      </NavLink>
    )
    expect(container).toMatchSnapshot()
  })

  it('should add class active when is active', () => {
    mockUsePathname.mockImplementationOnce(() => '/storage')
    const { container } = render(
      <NavLink href="/storage">
        <>
          <HomeIcon />
          Content
        </>
      </NavLink>
    )
    expect(container).toMatchSnapshot()
  })
})
