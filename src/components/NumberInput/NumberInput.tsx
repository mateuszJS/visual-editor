import { useEffect, useRef, useState } from 'react'
import styles from './NumberInput.module.css'
import decimals from '@/utils/decimals'
import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import cn from 'classnames'

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  value: number
  unit?: string
  roundDecimals?: boolean
  onChange: (value: number, commit: boolean) => void
}

export default function NumberInput({
  label,
  value: rawValue,
  onChange,
  unit = '',
  roundDecimals = true,
  className,
  ...rest
}: Props) {
  const value = roundDecimals ? decimals(rawValue) : rawValue
  const [tempVal, setTempVal] = useState(value.toString())
  const pressedKeys = useRef<Record<string, boolean>>({})
  const inputId = useUniqueId()

  useEffect(() => {
    const tempStringifiedValue =
      tempVal === '-' || tempVal === '-.' ? '0' : Number(tempVal).toString()
    // we want user allow to type '-' or '0.' so we do not update tempVal if it's still valid/same value
    if (value.toString() !== tempStringifiedValue) {
      setTempVal(value.toString())
    }
  }, [value])

  const onBlur = () => {
    setTempVal(value.toString()) // reset to last valid value
    onChange(value, true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    if (val === '-' || val === '-.') {
      // Number('-') returns NaN
      setTempVal(val)
      onChange(0, false)
      return
    }

    const num = Number(val) // avoid parseFloat -> allows non-numerical characters at the end
    if (!Number.isNaN(num) && Math.abs(num) !== Infinity) {
      setTempVal(val)
      onChange(num, false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (pressedKeys.current[e.key]) return
    pressedKeys.current[e.key] = true

    const mod = e.key === 'ArrowUp' ? 1 : e.key === 'ArrowDown' ? -1 : 0
    if (mod !== 0) {
      e.preventDefault()
      const newValue = Math.round(value + mod)
      onChange(newValue, true)
    }
  }

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      pressedKeys.current[e.key] = false
    }
  }

  return (
    <>
      <label className={styles.label} htmlFor={inputId} suppressHydrationWarning>
        {label}
      </label>
      <div className={cn(styles.resizableWrapper, className)}>
        <input
          type="text"
          value={tempVal}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          size={
            1
          } /* it's a solution for browser which does not support field-sizing: content; yet */
          onBlur={onBlur}
          autoComplete="off"
          {...rest}
          id={inputId}
          suppressHydrationWarning
          className={styles.input}
        />
        <span className={styles.suffix}>
          <span className={styles.invisible}>{tempVal}</span>
          &nbsp;
          {unit}
        </span>
      </div>
    </>
  )
}
