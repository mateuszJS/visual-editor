import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import styles from './RangeSlider.module.css'
import cn from 'classnames'

interface Props {
  ariaLabel: string
  start: number
  end: number
  min: number
  max: number
  onChange: (start: number, end: number, commit: boolean) => void
  className?: string
}

// created base on:
// https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/

export default function RangeSlider({
  ariaLabel,
  min,
  max,
  start,
  end,
  onChange,
  className,
}: Props) {
  const id = useUniqueId()
  const cssVars = {
    '--start': start,
    '--end': end,
    '--min': min,
    '--max': max,
  } as React.CSSProperties

  return (
    // label or fieldset is not used because of issue(grid on the doesnt work in chrome)
    <div
      className={cn(styles.inputsWrapper, className)}
      style={cssVars}
      role="group"
      aria-label={ariaLabel}
    >
      <label className={styles.srOnly} htmlFor={`${id}-start`}>
        start:
      </label>
      <input
        id={`${id}-start`}
        type="range"
        min={min}
        value={start}
        max={max}
        className={styles.slider}
        onChange={(e) => {
          const value = Number(e.target.value)
          onChange(value, Math.min(value, end), true)
        }}
      />
      <label className={styles.srOnly} htmlFor={`${id}-end`}>
        end:
      </label>
      <input
        id={`${id}-end`}
        type="range"
        min={min}
        value={end}
        max={max}
        className={styles.slider}
        onChange={(e) => {
          const value = Number(e.target.value)
          onChange(Math.max(value, start), value, true)
        }}
      />
    </div>
  )
}
