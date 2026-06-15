import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import styles from './Slider.module.scss'
import cn from 'classnames'
import clamp from '@/utils/clamp'

export interface Handle {
  label: string
  value: number
  knobType?: string
  color?: string
  removable?: boolean
}

interface Props {
  ariaLabel: string
  handles: Array<Handle | null>
  min: number
  max: number
  onChange: (index: number, newValue: number | null, commit: boolean) => void
  className?: string // className mainly to style handlers
  children?: React.ReactNode // track is transparent by default
  onFocusHandler?: (index: number) => void
  getNewKnobValue: (index: number) => number
}

// created base on:
// https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/

export default function Slider({
  ariaLabel,
  min,
  max,
  handles,
  onChange,
  className,
  children,
  onFocusHandler,
  getNewKnobValue,
}: Props) {
  const id = useUniqueId()

  return (
    // label or fieldset is not used because grid on them doesn't work properly in Chrome
    <div className={cn(styles.inputsWrapper, className)} role="group" aria-label={ariaLabel}>
      <div className={styles.trackWrapper}>{children}</div>
      {handles.map((handle, index) => {
        if (handle === null) {
          const newValue = getNewKnobValue(index)
          const fraction = (newValue - min) / (max - min)
          return (
            <button
              key={index}
              type="button"
              data-slider-add-btn
              className={cn(styles.addBtn, styles.cross)}
              style={{ '--position': fraction } as React.CSSProperties}
              onClick={() => onChange(index, newValue, true)}
              aria-label="Add handle"
            ></button>
          )
        }
        return (
          <div className={styles.sliderIsolator} key={index}>
            <label className={styles.srOnly} htmlFor={`slider-${id}-${index}`}>
              {handle.label}
            </label>
            <input
              id={`slider-${id}-${index}`}
              type="range"
              step={0.01}
              min={min}
              value={clamp(handle.value, min, max)}
              max={max}
              {...{ [`data-knob-${handle.knobType}`]: true }}
              className={styles.slider}
              onChange={(e) => {
                onChange(index, Number(e.target.value), false)
              }}
              style={{ color: handle.color }}
              onFocus={onFocusHandler && (() => onFocusHandler(index))}
              onPointerUp={() => onChange(index, handle.value, true)}
            />
            {handle.removable && (
              <button
                className={styles.removeBtn}
                onClick={() => onChange(index, null, true)}
              ></button>
            )}
          </div>
        )
      })}
    </div>
  )
}
