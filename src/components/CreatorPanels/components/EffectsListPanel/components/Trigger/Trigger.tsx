import AngleIcon from 'assets/angle.svg'
import TProgressIcon from 'assets/t-progress.svg'
import DistanceIcon from 'assets/distance.svg'
import { Vector4 } from '@mateuszjs/magic-render/types'
import styles from './Trigger.module.css'

export type TriggerType = 'a' | 'c' | 'd' | 't'

const TYPE_LABELS: Record<TriggerType, string> = {
  a: 'Angle',
  c: 'Color',
  d: 'Distance',
  t: 'Progress',
}

function colorToCss(color: Vector4) {
  const [r, g, b, a] = color
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a ?? 1})`
}

interface Props {
  name: string
  type: TriggerType
  color?: Vector4
}

export function Trigger({ name, type, color }: Props) {
  let visual: React.ReactNode = null

  if (type === 'c' && color) {
    visual = (
      <div
        className={styles.colorSample}
        style={{ '--fill-color': colorToCss(color) } as React.CSSProperties}
      />
    )
  } else if (type === 'a') {
    visual = <AngleIcon />
  } else if (type === 'd') {
    visual = <DistanceIcon />
  } else if (type === 't') {
    visual = <TProgressIcon />
  }

  return (
    <div className={styles.root}>
      <div className={styles.icon}>{visual}</div>
      <div className={styles.labels}>
        <p className={styles.name}>{name}</p>
        <p className={styles.type}>{TYPE_LABELS[type]}</p>
      </div>
    </div>
  )
}
