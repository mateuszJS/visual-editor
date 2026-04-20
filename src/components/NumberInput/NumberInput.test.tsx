import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NumberInput from './NumberInput'
import { useState } from 'react'

interface Props {
  initialValue: number
  onChange?: (newValue: number, commit: boolean) => void
  roundDecimals?: boolean
}

const TestableComponent = ({ initialValue, onChange = () => {}, roundDecimals }: Props) => {
  const [value, setValue] = useState(initialValue)

  const onChangeWrapper = (newValue: number, commit: boolean) => {
    setValue(newValue)
    onChange(newValue, commit)
  }

  return (
    <NumberInput
      label="Test label"
      value={value}
      onChange={onChangeWrapper}
      roundDecimals={roundDecimals}
    />
  )
}

describe('NumberInput', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('typing valid values', () => {
    it('should display and call onChange with correct value when typing "1"', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={0} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '1')

      expect(input).toHaveValue('1')
      expect(onChange).toHaveBeenLastCalledWith(1, false)

      await user.click(document.body) // blur input
      expect(onChange).toHaveBeenLastCalledWith(1, true)
    })

    it('when type "-" should display "-" and avoid calling onChange', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={0} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '-')

      expect(input).toHaveValue('-')
      expect(onChange).not.toHaveBeenCalled()
    })

    it('when type "-.5" should display "-.5" and call onChange with "-0.5" value when typing "-.5"', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={0} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '-.5')

      expect(input).toHaveValue('-.5')
      expect(onChange).toHaveBeenLastCalledWith(-0.5, false)
    })
  })

  describe('decimal points', () => {
    it('by default should round values to two decimal points', async () => {
      render(<TestableComponent initialValue={4.719} />)
      const input = screen.getByRole('textbox', { name: /test label/i })

      expect(input).toHaveValue('4.72')
    })

    it('no rounding when prop roundDecimals = false', async () => {
      render(<TestableComponent initialValue={4.719} roundDecimals={false} />)
      const input = screen.getByRole('textbox', { name: /test label/i })

      expect(input).toHaveValue('4.719')
    })
  })

  describe('typing invalid values', () => {
    it('should not update displayed value nor call onChange when typing "a"', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={5} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })
      await user.type(input, 'a')

      expect(input).toHaveValue('5')
      expect(onChange.mock.calls.length).toBe(0)
    })

    it('should not update displayed value nor call onChange when typing "1a"', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={0} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '1a')

      expect(input).toHaveValue('1')
      expect(onChange).toHaveBeenLastCalledWith(1, false)
    })

    it('should not update displayed value nor call onChange when pasting "Infinity"', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={5} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.paste('Infinity')

      expect(input).toHaveValue('')
      expect(onChange.mock.calls.length).toBe(0) // clear
    })

    it('should not update displayed value nor call onChange when pasting "NaN"', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={5} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.paste('NaN')

      expect(input).toHaveValue('')
      expect(onChange.mock.calls.length).toBe(0) // clear
    })

    it('should not update displayed value nor call onChange when pasting "-Infinity"', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={5} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.paste('-Infinity')

      expect(input).toHaveValue('')
      expect(onChange.mock.calls.length).toBe(0) // clear
    })
  })

  describe('keyboard arrow keys', () => {
    it('should round decimal value and increase by 1 when pressing ArrowUp', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={5.7} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.click(input)
      await user.keyboard('{ArrowUp}')

      expect(onChange).toHaveBeenCalledWith(7, true)
    })

    it('pressing key for longer should increase value by nubmer of events.', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={1} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.click(input)

      await user.keyboard('{ArrowUp>10/}')
      expect(onChange).toHaveBeenCalledTimes(10)
      expect(onChange).toHaveBeenLastCalledWith(11, true)

      await user.keyboard('{ArrowUp>5/}')
      expect(onChange).toHaveBeenCalledTimes(15)
      expect(onChange).toHaveBeenLastCalledWith(16, true)
    })

    it('pressing key + shift for longer should increase value by nubmer of events * 10.', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={1} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.click(input)

      await user.keyboard('{Shift>}')
      await user.keyboard('{ArrowUp>10/}')
      expect(onChange).toHaveBeenCalledTimes(10)
      expect(onChange).toHaveBeenLastCalledWith(101, true)

      await user.keyboard('{/Shift}')
      await user.keyboard('{ArrowUp>5/}')
      expect(onChange).toHaveBeenCalledTimes(15)
      expect(onChange).toHaveBeenLastCalledWith(106, true)
    })

    it('pressing key + Meta key for longer should increase value by nubmer of events * 10.', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={1} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.click(input)

      await user.keyboard('{Meta>}')
      await user.keyboard('{ArrowUp>10/}')
      expect(onChange).toHaveBeenCalledTimes(10)
      expect(onChange).toHaveBeenLastCalledWith(1001, true)

      await user.keyboard('{/Meta}')
      await user.keyboard('{ArrowUp>5/}')
      expect(onChange).toHaveBeenCalledTimes(15)
      expect(onChange).toHaveBeenLastCalledWith(1006, true)
    })

    it('should round decimal value and decrease by 1 when pressing ArrowDown', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={5.3} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.click(input)
      await user.keyboard('{ArrowDown}')

      expect(onChange).toHaveBeenCalledWith(4, true)
    })
  })

  describe('onBlur normalization', () => {
    it('should normalize "-" to "0" on blur', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={0} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '-')
      await user.tab()

      expect(input).toHaveValue('0')
    })

    it('should normalize "-.5" to "-0.5" on blur', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={-0.5} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '-.5')
      await user.tab()

      expect(input).toHaveValue('-0.5')
    })

    it('should normalize empty string to "0" on blur', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={0} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.tab()

      expect(input).toHaveValue('0')
    })

    it('should normalize "0001" to "1" on blur', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={1} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '0001')
      await user.tab()

      expect(input).toHaveValue('1')
    })

    it('should keep "-0.01" the same on blur', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<TestableComponent initialValue={-0.01} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '-0.01')
      await user.tab()

      expect(input).toHaveValue('-0.01')
    })
  })
})
