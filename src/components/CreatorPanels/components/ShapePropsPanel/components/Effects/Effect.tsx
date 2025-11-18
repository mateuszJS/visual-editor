import ColorInput from '@/components/ColorInput/ColorInput'
import NumberInput from '@/components/NumberInput/NumberInput'
import { SdfEffect } from '@mateuszjs/magic-render'
import styles from './Effect.module.css'

interface Props extends SdfEffect {
  onChange: (changes: SdfEffect, commit: boolean) => void
}

export default function Effect({ onChange, ...effect }: Props) {
  return (
    <li className={styles.root}>
      {'solid' in effect.fill && (
        <ColorInput
          label="Fill:"
          value={effect.fill.solid}
          onChange={(color, commit) => onChange({ ...effect, fill: { solid: color } }, commit)}
        />
      )}
      <NumberInput
        label="From:"
        value={effect.dist_start}
        onChange={(dist_start) => onChange({ ...effect, dist_start }, true)}
        unit="px"
      />
      <NumberInput
        label="To:"
        value={effect.dist_end}
        onChange={(dist_end) => onChange({ ...effect, dist_end }, true)}
        unit="px"
      />
    </li>
  )
}
