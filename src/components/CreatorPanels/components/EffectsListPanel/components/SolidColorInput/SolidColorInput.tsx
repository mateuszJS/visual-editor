import ColorInput from '@/components/ColorInput/ColorInput'
import styles from './SolidColorInput.module.css'
import { Color, Vector4 } from '@mateuszjs/magic-render/types'

interface Props {
  value: Vector4
  onChange: (newValue: Vector4, commit: boolean) => void
}

export function SolidColorInput({ value, onChange }: Props) {
  return (
    <div>
      <ColorInput value={value as Color} onChange={onChange} className={styles.root} />
    </div>
  )
}
