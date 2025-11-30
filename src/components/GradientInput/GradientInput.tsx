import styles from './GradientInput.module.css'
import numberInputStyles from '@/components/NumberInput/NumberInput.module.css'
import cn from 'classnames'
import Popover from '../Popover/Popover'
import GradientSelection from './components/GradientSelection/GradientSelection'
import { toHex } from '@/utils/hex'
import React from 'react'
import { Gradient } from './types'

interface Props<T extends Gradient>
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'> {
  value: T
  onChange: (value: T, commit: boolean) => void
}

function getGradientCSS(value: Gradient): React.CSSProperties {
  const cssStops = value.stops
    .toSorted((a, b) => a.offset - b.offset)
    .map((stop) => toHex(stop.color) + ' ' + stop.offset * 100 + '%')
    .join(', ')

  const dx = value.start.x - value.end.x
  const dy = value.start.y - value.end.y
  const rad = Math.atan2(dy, dx)
  const angle = rad * (180 / Math.PI)

  if ('radius_ratio' in value) {
    const dist = Math.sqrt(dx * dx + dy * dy)
    const r = value.radius_ratio
    const scale = Math.abs(Math.sin(rad)) + Math.abs(Math.cos(rad))
    const rx = (dist * 100) / scale
    const ry = (dist * r * 100) / scale

    return {
      background: `radial-gradient(${rx}% ${ry}% at ${value.start.x * 100}% ${
        value.start.y * 100
      }%, ${cssStops})`,
      transform: `rotate(${-angle}deg) scale(${scale})`,
    }
  } else {
    return {
      background: `linear-gradient(${-(angle + 90)}deg, ${cssStops})`,
    }
  }
}

export default function GradientInput<T extends Gradient>({ value, onChange, ...rest }: Props<T>) {
  return (
    <Popover
      trigger={() => <div style={getGradientCSS(value)} />}
      popoverClassName={styles.popover}
      {...rest}
      className={cn(styles.colorPicker, numberInputStyles.input, rest.className)}
    >
      <GradientSelection<T> value={value} onChange={onChange} />
    </Popover>
  )
}
