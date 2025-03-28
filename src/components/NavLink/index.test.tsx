import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import HomeIcon from 'assets/home-icon.svg'
import NavLink from '.'

const mockUsePathname = jest.fn(() => '/home')

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
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
    mockUsePathname.mockImplementationOnce(() => '/my-link')
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

  it('TEEESTING', () => {
    // mockUsePathname.mockImplementation(() => '/link')
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
