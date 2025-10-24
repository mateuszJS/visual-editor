import { fireEvent, render, screen } from '@testing-library/react'
import HomeIcon from 'assets/home-icon.svg'
import NavButton from './NavButton'
import { describe, expect, vi } from 'vitest'
import it from 'test/browser-extend'

describe('<NavButton>', () => {
  it('should render icon and text', async () => {
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
    const onClick = vi.fn()

    render(
      <NavButton onClick={onClick}>
        <>
          <HomeIcon />
          Content
        </>
      </NavButton>
    )

    fireEvent.click(screen.getByText(/content/i))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
