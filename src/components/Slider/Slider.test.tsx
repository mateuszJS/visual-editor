import { render, screen, fireEvent } from '@testing-library/react'
import Slider, { Handle } from './Slider'
import { useState } from 'react'

interface Props {
  initialHandles: Handle[]
  min: number
  max: number
  onChange?: (handles: Handle[], commit: boolean) => void
}

const TestableComponent = ({ initialHandles, min, max, onChange = () => {} }: Props) => {
  const [handles, setHandles] = useState(initialHandles)

  const onChangeWrapper = (newHandles: Handle[], commit: boolean) => {
    setHandles(newHandles)
    onChange(newHandles, commit)
  }

  return (
    <Slider
      ariaLabel="Test range"
      handles={handles}
      min={min}
      max={max}
      onChange={onChangeWrapper}
    />
  )
}

describe('Slider', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <Slider
        ariaLabel="Test range"
        handles={[
          { label: 'handler A', value: 10 },
          { label: 'handler B', value: 90 },
        ]}
        min={0}
        max={100}
        onChange={() => {}}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('calls onChange when a handler slider is moved', () => {
    const onChange = jest.fn()
    render(
      <TestableComponent
        initialHandles={[
          { label: 'handler A', value: 40 },
          { label: 'handler B', value: 20 },
        ]}
        min={0}
        max={100}
        onChange={onChange}
      />
    )

    const startInput = screen.getByLabelText('handler A')
    fireEvent.change(startInput, { target: { value: '50' } })

    expect(onChange).toHaveBeenCalledWith(
      [
        { label: 'handler A', value: 50 },
        { label: 'handler B', value: 20 },
      ],
      true
    )
  })
})
