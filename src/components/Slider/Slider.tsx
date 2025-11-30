import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import styles from './Slider.module.css'
import cn from 'classnames'
import { Fragment } from 'react'

export interface Handle {
  label: string
  value: number
  color?: string
}

interface Props {
  ariaLabel: string
  handles: Handle[]
  min: number
  max: number
  onChange: (values: Handle[], commit: boolean) => void
  className?: string // className mainly to style handlers
  children?: React.ReactNode // track is transparent by default
  onFocusHandler?: (index: number) => void
}

// created base on:
// https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/

export default function RangeSlider({
  ariaLabel,
  min,
  max,
  handles,
  onChange,
  className,
  children,
  onFocusHandler,
}: Props) {
  const id = useUniqueId()

  return (
    // label or fieldset is not used because grid on them doesn't work properly in Chrome
    <div className={cn(styles.inputsWrapper, className)} role="group" aria-label={ariaLabel}>
      <div className={styles.trackWrapper}>{children}</div>
      {handles.map((handle, index) => (
        <Fragment key={index}>
          <label className={styles.srOnly} htmlFor={`slider-${id}-${index}`}>
            {handle.label}
          </label>
          <input
            id={`slider-${id}-${index}`}
            type="range"
            step={0.01}
            min={min}
            value={handle.value}
            max={max}
            className={styles.slider}
            onChange={(e) => {
              const newValues = [...handles]
              newValues[index].value = Number(e.target.value)
              onChange(newValues, false)
            }}
            style={{ color: handle.color }}
            onFocus={onFocusHandler && (() => onFocusHandler(index))}
            onPointerUp={() => onChange(handles, true)}
          />
        </Fragment>
      ))}
    </div>
  )
}
