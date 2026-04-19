import { useEffect, useState } from 'react'
import styles from './NumberInput.module.css'
import decimals from '@/utils/decimals'
import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import cn from 'classnames'
import ErrorTooltip from '../ErrorTooltip/ErrorTooltip'

interface Props extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'min' | 'max'
> {
  label: string
  value: number
  unit?: string
  roundDecimals?: boolean
  large?: boolean
  tooltipSide?: 'bottom' | 'left'
  min?: number
  max?: number
  onChange: (value: number, commit: boolean) => void
}

export default function NumberInput({
  label,
  value: rawValue,
  onChange,
  unit = '',
  roundDecimals = true,
  className,
  large,
  tooltipSide = 'bottom',
  min,
  max,
  ...rest
}: Props) {
  const value = roundDecimals ? decimals(rawValue) : rawValue
  const [tempVal, setTempVal] = useState(value.toString())
  const inputId = useUniqueId()
  const [error, setError] = useState('')

  useEffect(() => {
    const tempStringifiedValue =
      tempVal === '-' || tempVal === '-.' ? '0' : Number(tempVal).toString()
    // we want user allow to type '-' or '0.' so we do not update tempVal if it's still valid/same value
    if (value.toString() !== tempStringifiedValue) {
      setTempVal(value.toString())
    }
  }, [value])

  const onNewValue = (val: number, commit: boolean) => {
    if (!Number.isNaN(val) && Math.abs(val) !== Infinity) {
      setTempVal(val.toString())

      if (min !== undefined && val < min) {
        setError(`Value cannot be smaller than ${min}${unit}`)
        return
      }

      if (max !== undefined && val > max) {
        setError(`Value cannot be grater than ${max}${unit}`)
        return
      }

      onChange(val, commit)
      if (error) {
        setError('')
      }
    }
  }

  const onBlur = () => {
    onNewValue(value, true) // reset to last valid value
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    if (val === '-' || val === '-.' || val === '') {
      // Number('-') returns NaN
      setTempVal(val)
      // onChange(0, false)
      return
    }

    const num = Number(val) // avoid parseFloat -> allows non-numerical characters at the end
    onNewValue(num, false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let mod = e.key === 'ArrowUp' ? 1 : e.key === 'ArrowDown' ? -1 : 0

    if (e.shiftKey) {
      mod *= 10
    } else if (e.metaKey) {
      mod *= 100
    }

    if (mod !== 0) {
      e.preventDefault()
      const newValue = Math.round(value + mod)
      onNewValue(newValue, true)
    }
  }

  return (
    <>
      <label
        className={cn(styles.label, large && styles.labelLarge)}
        htmlFor={inputId}
        suppressHydrationWarning
      >
        {label}
      </label>
      <div className={cn(styles.resizableWrapper, className, large && styles.wrapperLarge)}>
        <input
          type="text"
          value={tempVal}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          size={
            1
          } /* it's a solution for browser which does not support field-sizing: content; yet */
          onBlur={onBlur}
          autoComplete="off"
          {...rest}
          id={inputId}
          suppressHydrationWarning
          className={styles.input}
          aria-invalid={!!error}
        />
        <span className={styles.suffix}>
          <span className={styles.invisible}>{tempVal}</span>
          &nbsp;
          {unit}
        </span>

        <ErrorTooltip inputId={inputId} msg={error} tooltipSide={tooltipSide} />
      </div>
    </>
  )
}
