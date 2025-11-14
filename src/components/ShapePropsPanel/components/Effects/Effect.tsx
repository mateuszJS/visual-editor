import ColorInput from '@/components/ColorInput/ColorInput'
import NumberInput from '@/components/NumberInput/NumberInput'
import { SdfEffect } from '@mateuszjs/magic-render'
import styles from './styles.module.css'

interface Props extends SdfEffect {
  onChange: (changes: SdfEffect) => void
}

export default function Effect({ onChange, ...effect }: Props) {
  return (
    <li className={styles.root}>
      {'solid' in effect.fill && (
        <ColorInput
          label="Fill:"
          value={effect.fill.solid}
          onChange={(color) => onChange({ ...effect, fill: { solid: color } })}
        />
      )}
      <NumberInput
        label="From:"
        value={effect.dist_start}
        onChange={(dist_start) => onChange({ ...effect, dist_start })}
        unit="px"
      />
      <NumberInput
        label="To:"
        value={effect.dist_end}
        onChange={(dist_end) => onChange({ ...effect, dist_end })}
        unit="px"
      />
    </li>
  )
}
