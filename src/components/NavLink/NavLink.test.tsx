import { render } from '@testing-library/react'
import HomeIcon from 'assets/home-icon.svg'
import NavLink from './NavLink'

const mockUsePathname = jest.fn(() => '/')

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

describe('<NavLink>', () => {
  it('should render icon and text', () => {
    const { container } = render(
      <NavLink href="/explore">
        <>
          <HomeIcon />
          Content
        </>
      </NavLink>
    )
    expect(container).toMatchSnapshot()
  })

  it('should add class active when is active', () => {
    mockUsePathname.mockImplementationOnce(() => '/explore')
    const { container } = render(
      <NavLink href="/explore">
        <>
          <HomeIcon />
          Content
        </>
      </NavLink>
    )
    expect(container).toMatchSnapshot()
  })
})
