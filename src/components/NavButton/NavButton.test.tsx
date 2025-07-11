import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import HomeIcon from 'assets/home-icon.svg'
import NavButton from './NavButton'

describe('<NavButton>', () => {
  it('should render icon and text', () => {
    const { container } = render(
      <NavButton onClick={() => {}}>
        <>
          <HomeIcon />
          Content
        </>
      </NavButton>
    )
    expect(container).toMatchSnapshot()
  })

  it('should trigger onClick callbakc when clicked', () => {
    const onClick = jest.fn()

    render(
      <NavButton onClick={onClick}>
        <>
          <HomeIcon />
          Content
        </>
      </NavButton>
    )

    fireEvent.click(screen.getByText(/Content/i))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
