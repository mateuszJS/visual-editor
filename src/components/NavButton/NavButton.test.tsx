import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
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

  it('should trigger onClick callback when clicked', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()

    render(
      <NavButton onClick={onClick}>
        <>
          <HomeIcon />
          Content
        </>
      </NavButton>
    )

    await user.click(screen.getByText(/Content/i))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
