import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NumberInput from './NumberInput'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('NumberInput', () => {
  const defaultProps = {
    label: 'Test Label',
    value: 0,
    onChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('typing valid values', () => {
    it('should display and call onChange with correct value when typing "1"', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput {...defaultProps} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '1')

      expect(input).toHaveValue('1')
      expect(onChange).toHaveBeenLastCalledWith(1)
    })

    it('should display "-" and call onChange with 0 when typing "-"', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput {...defaultProps} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '-')

      expect(input).toHaveValue('-')
      expect(onChange).toHaveBeenLastCalledWith(0)
    })

    it('should display "-.5" and call onChange with "-0.5" value when typing "-.5"', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput {...defaultProps} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '-.5')

      expect(input).toHaveValue('-.5')
      expect(onChange).toHaveBeenLastCalledWith(-0.5)
    })
  })

  describe('typing invalid values', () => {
    it('should not update displayed value nor call onChange when typing "a"', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput {...defaultProps} value={5} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })
      await user.type(input, 'a')

      expect(input).toHaveValue('5')
      expect(onChange.mock.calls.length).toBe(0)
    })

    it('should not update displayed value nor call onChange when typing "1a"', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput {...defaultProps} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '1a')

      expect(input).toHaveValue('1')
      expect(onChange).toHaveBeenLastCalledWith(1)
    })

    it('should not update displayed value nor call onChange when pasting "Infinity"', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput {...defaultProps} value={5} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.paste('Infinity')

      expect(input).toHaveValue('')
      expect(onChange.mock.calls.length).toBe(1) // clear
    })

    it('should not update displayed value nor call onChange when pasting "NaN"', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput {...defaultProps} value={5} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.paste('NaN')

      expect(input).toHaveValue('')
      expect(onChange.mock.calls.length).toBe(1) // clear
    })

    it('should not update displayed value nor call onChange when pasting "-Infinity"', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput {...defaultProps} value={5} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.paste('-Infinity')

      expect(input).toHaveValue('')
      expect(onChange.mock.calls.length).toBe(1) // clear
    })
  })

  describe('keyboard arrow keys', () => {
    it('should round decimal value and increase by 1 when pressing ArrowUp', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput {...defaultProps} value={5.7} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.click(input)
      await user.keyboard('{ArrowUp}')

      expect(onChange).toHaveBeenCalledWith(7)
    })

    it('should round decimal value and decrease by 1 when pressing ArrowDown', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput {...defaultProps} value={5.3} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.click(input)
      await user.keyboard('{ArrowDown}')

      expect(onChange).toHaveBeenCalledWith(4)
    })
  })

  describe('onBlur normalization', () => {
    it('should normalize "-" to "0" on blur', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput {...defaultProps} value={0} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '-')
      await user.tab()

      expect(input).toHaveValue('0')
    })

    it('should normalize "-.5" to "-0.5" on blur', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput {...defaultProps} value={-0.5} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '-.5')
      await user.tab()

      expect(input).toHaveValue('-0.5')
    })

    it('should normalize empty string to "0" on blur', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput {...defaultProps} value={0} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.tab()

      expect(input).toHaveValue('0')
    })

    it('should normalize "0001" to "1" on blur', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput {...defaultProps} value={1} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '0001')
      await user.tab()

      expect(input).toHaveValue('1')
    })

    it('should keep "-0.01" the same on blur', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<NumberInput {...defaultProps} value={-0.01} onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /test label/i })

      await user.clear(input)
      await user.type(input, '-0.01')
      await user.tab()

      expect(input).toHaveValue('-0.01')
    })
  })
})
