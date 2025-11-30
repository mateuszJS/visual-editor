import { render, screen, fireEvent } from '@testing-library/react'
import RangeSlider from './RangeSlider'
import { useState } from 'react'

interface Props {
  initialStart: number
  initialEnd: number
  min: number
  max: number
  onChange?: (start: number, end: number, commit: boolean) => void
}

const TestableComponent = ({ initialStart, initialEnd, min, max, onChange = () => {} }: Props) => {
  const [start, setStart] = useState(initialStart)
  const [end, setEnd] = useState(initialEnd)

  const onChangeWrapper = (newStart: number, newEnd: number, commit: boolean) => {
    setStart(newStart)
    setEnd(newEnd)
    onChange(newStart, newEnd, commit)
  }

  return (
    <RangeSlider
      ariaLabel="Test range"
      start={start}
      end={end}
      min={min}
      max={max}
      onChange={onChangeWrapper}
    />
  )
}

describe('RangeSlider', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <RangeSlider
        ariaLabel="Test range"
        start={10}
        end={90}
        min={0}
        max={100}
        onChange={() => {}}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('calls onChange when start slider is moved', () => {
    const onChange = jest.fn()
    render(
      <TestableComponent initialStart={40} initialEnd={20} min={0} max={100} onChange={onChange} />
    )

    const startInput = screen.getByLabelText('Distance at which effect starts')
    fireEvent.change(startInput, { target: { value: '50' } })

    expect(onChange).toHaveBeenCalledWith(50, 20, false)
  })

  it('calls onChange when end slider is moved', () => {
    const onChange = jest.fn()
    render(
      <TestableComponent initialStart={90} initialEnd={10} min={0} max={100} onChange={onChange} />
    )

    const endInput = screen.getByLabelText('Distance at which effect ends')
    fireEvent.change(endInput, { target: { value: '20' } })

    expect(onChange).toHaveBeenCalledWith(90, 20, false)
  })

  it('clamps start value to end value when start > end', () => {
    const onChange = jest.fn()
    render(
      <TestableComponent initialStart={50} initialEnd={30} min={0} max={100} onChange={onChange} />
    )

    const startInput = screen.getByLabelText('Distance at which effect starts')
    fireEvent.change(startInput, { target: { value: '10' } })

    expect(onChange).toHaveBeenCalledWith(10, 10, false)
  })
})
