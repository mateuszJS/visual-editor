import { useEffect, useState } from 'react'
import styles from './NumberInput.module.css'
import decimals from '@/utils/decimals'
import useUniqueId from '@/hooks/useUniqueId/useUniqueId'

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  value: number
  unit?: string
  roundDecimals?: boolean
  onChange: (value: number) => void
}

export default function NumberInput({
  label,
  value: rawValue,
  onChange,
  unit = '',
  roundDecimals = true,
  ...rest
}: Props) {
  const value = roundDecimals ? decimals(rawValue) : rawValue
  const [tempVal, setTempVal] = useState(value.toString())
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
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    if (val === '-' || val === '-.') {
      // Number('-') returns NaN
      setTempVal(val)
      onChange(0)
      return
    }

    const num = Number(val) // avoid parseFloat -> allows non-numerical characters at the end
    if (!Number.isNaN(num) && Math.abs(num) !== Infinity) {
      setTempVal(val)
      onChange(num)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const mod = e.key === 'ArrowUp' ? 1 : e.key === 'ArrowDown' ? -1 : 0
    if (mod !== 0) {
      e.preventDefault()
      const newValue = Math.round(value + mod)
      onChange(newValue)
    }
  }

  return (
    <>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <div className={styles.resizableWrapper}>
        <input
          type="text"
          value={tempVal}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          size={1}
          onBlur={onBlur}
          {...rest}
          id={inputId}
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
