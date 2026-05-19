import cn from 'classnames'
import Slider from '@/components/Slider/Slider'
import styles from './SoftRangeSlider.module.css'
import { exponentialToLinear, linearToExponential } from './utils'
import { SoftVector4 } from '@mateuszjs/magic-render/types'
import { softVecToHandles } from '../CreatorPanels/components/ShapePropsPanel/components/utils'

interface Props {
  ariaLabel: string
  value: SoftVector4 /*[soft-start, start, end, soft-end]*/
  min: number
  max: number
  onChange: (newValue: SoftVector4, commit: boolean) => void
  className?: string
}

const LINEAR_MAX = 1
const LINEAR_MIN = -1

export default function SoftRangeSlider({
  ariaLabel,
  min,
  max,
  value,
  onChange,
  className,
}: Props) {
  const linearValue = value.map((v) =>
    v === null ? null : exponentialToLinear(v, min, max)
  ) as SoftVector4

  // ignored if linearValue[0] === null
  const cssVarsSoftStart = {
    '--start': linearValue[0],
    '--end': linearValue[1] === null ? linearValue[2] : linearValue[1],
    '--color-intense': '50%',
    '--height': '0.35em',
  } as React.CSSProperties

  // ignored if linearValue[1 or 2] === null
  const cssVarsHardMiddle = {
    '--start': linearValue[1],
    '--end': linearValue[2],
    '--color-intense': '70%',
    '--height': '0.5em',
  } as React.CSSProperties

  // ignored if linearValue[3] === null
  const cssVarsSoftEnd = {
    '--start': linearValue[2] === null ? linearValue[1] : linearValue[2],
    '--end': linearValue[3],
    '--color-intense': '50%',
    '--height': '0.35em',
  } as React.CSSProperties

  const em1 = exponentialToLinear(16, min, max) // to align gradient perfectly with knobs
  const normalize = (value: number) =>
    ((em1 * 0.25 + LINEAR_MAX - value) / (LINEAR_MAX - LINEAR_MIN + em1 * 0.5)) * 100 + '%'

  const handles = softVecToHandles(linearValue)

  const y = linearValue[1] === null ? linearValue[2] : linearValue[1]
  const z = linearValue[2] === null ? linearValue[1] : linearValue[2]
  if (z == null || y == null) {
    throw Error(`in soft vec 4 y and z are null at once. ${linearValue}`)
  }

  const getNewKnobValue = (index: number) => {
    const prev = handles[index - 1] || handles[index - 2] || null
    const next = handles[index + 1] || handles[index + 2] || null
    const lower = prev !== null ? prev.value : max
    const upper = next !== null ? next.value : min

    return (lower + upper) / 2
  }

  return (
    <div
      className={styles.root}
      style={
        {
          '--min': LINEAR_MIN,
          '--max': LINEAR_MAX,
          background: `radial-gradient(circle at 0% 100%, transparent ${normalize(linearValue[0] === null ? y : linearValue[0])}, red ${normalize(y)}, red ${normalize(z)}, transparent ${normalize(linearValue[3] === null ? z : linearValue[3])})`,
        } as React.CSSProperties
      }
    >
      <div className={styles.arcsWrapper}>
        <div className={styles.arc} data-primary style={{ width: `calc(${normalize(0)}*sqrt(2)` }}>
          <span className={styles.topLabel}>0px</span>
          <span className={styles.rightLabel}>0px</span>
        </div>
        {linearValue[0] !== null && (
          <div
            className={styles.arc}
            style={{ width: `calc(${normalize(linearValue[0])}*sqrt(2))` }}
          ></div>
        )}
        {linearValue[1] !== null && (
          <div
            className={styles.arc}
            style={{ width: `calc(${normalize(linearValue[1])}*sqrt(2))` }}
          ></div>
        )}
        {linearValue[2] !== null && (
          <div
            className={styles.arc}
            style={{ width: `calc(${normalize(linearValue[2])}*sqrt(2))` }}
          ></div>
        )}
        {linearValue[3] !== null && (
          <div
            className={styles.arc}
            style={{ width: `calc(${normalize(linearValue[3])}*sqrt(2))` }}
          ></div>
        )}
      </div>
      <Slider
        ariaLabel={ariaLabel}
        handles={handles}
        min={LINEAR_MIN}
        max={LINEAR_MAX}
        getNewKnobValue={getNewKnobValue}
        onChange={(index, newLinearComponent, commit) => {
          if (newLinearComponent === null) {
            const newValues = value.toSpliced(index, 1, null)
            onChange(newValues as SoftVector4, commit)
            return
          }

          const newComponent = linearToExponential(newLinearComponent, min, max)
          const newValues = value.toSpliced(index, 1, newComponent)

          // ensures all values on the left are greater(inside the shape, positive values)
          for (let i = index - 1; i >= 0; i--) {
            const v = newValues[i]
            if (v !== null) {
              newValues[i] = Math.max(v, newComponent)
            }
          }

          // ensures all values on the right are smaller(outside the shape, negative values)
          for (let i = index + 1; i < newValues.length; i++) {
            const v = newValues[i]
            if (v !== null) {
              newValues[i] = Math.min(v, newComponent)
            }
          }

          onChange(newValues as SoftVector4, commit)
        }}
        className={cn(styles.slider, className)}
      >
        <>
          <div className={styles.track} />
          {linearValue[0] !== null && (
            <div className={styles.selectedRangeTrack} style={cssVarsSoftStart} />
          )}
          {linearValue[1] !== null && linearValue[2] !== null && (
            <div className={styles.selectedRangeTrack} style={cssVarsHardMiddle} />
          )}
          {linearValue[3] !== null && (
            <div className={styles.selectedRangeTrack} style={cssVarsSoftEnd} />
          )}
        </>
      </Slider>
    </div>
  )
}
