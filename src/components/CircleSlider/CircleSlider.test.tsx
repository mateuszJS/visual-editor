import { render, screen } from '@testing-library/react'
import CircleSlider from './CircleSlider'

const noop = () => {}

describe('CircleSlider', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <CircleSlider
        ariaLabel="Test angle"
        handles={[
          { label: 'Start', value: 45 },
          { label: 'End', value: 200 },
        ]}
        onChange={noop}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('renders one button per handle, labeled by its handle label', () => {
    render(
      <CircleSlider
        ariaLabel="Test angle"
        handles={[
          { label: 'Start', value: 45 },
          { label: 'End', value: 200 },
        ]}
        onChange={noop}
      />
    )

    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'End' })).toBeInTheDocument()
  })

  it('rotates each arm to match its handle value', () => {
    const { container } = render(
      <CircleSlider
        ariaLabel="Test angle"
        handles={[
          { label: 'A', value: 0 },
          { label: 'B', value: 120 },
        ]}
        onChange={noop}
      />
    )

    const arms = Array.from(container.querySelectorAll<HTMLElement>('[style*="rotate"]'))
    expect(arms).toHaveLength(2)
    expect(arms[0].style.transform).toBe('rotate(0deg)')
    expect(arms[1].style.transform).toBe('rotate(120deg)')
  })
})
