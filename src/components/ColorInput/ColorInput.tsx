import styles from './ColorInput.module.css'
import { Color } from '@mateuszjs/magic-render/types'
import numberInputStyles from '@/components/NumberInput/NumberInput.module.css'
import cn from 'classnames'
import Popover from '../Popover/Popover'
import ColorSelection from './components/ColorSelection/ColorSelection'

interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'> {
  label: string
  value: Color // normalized RGBA array
  onChange: (value: Color, commit: boolean) => void
}

function toHex(value: Color): string {
  const r = Math.round(value[0] * 255)
  const g = Math.round(value[1] * 255)
  const b = Math.round(value[2] * 255)
  const a = Math.round(value[3] * 255)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
    .toString(16)
    .padStart(2, '0')}${a.toString(16).padStart(2, '0')}`
}

function fromHex(hex: string): Color {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const a = hex.length > 7 ? parseInt(hex.slice(7, 9), 16) / 255 : 1

  return [r, g, b, a]
}

/**
 * This component operates on hex values ONLY. It accepts normalized rgba, but converts them to hex for the color picker.
 * Any floating point precision issues are avoided this way.
 *
 * In Storybook sometimes updates can be laggy/jarring/stuck in an infinite loop,
 * It happens because useArgs returns data from two renders ago, not latest data.
 */
export default function ColorInput({ label, value, onChange, ...rest }: Props) {
  const hex = toHex(value)

  return (
    <Popover
      trigger={() => <div style={{ backgroundColor: hex }} />}
      aria-label={label}
      popoverClassName={styles.popover}
      {...rest}
      className={cn(styles.colorPicker, numberInputStyles.input, rest.className)}
    >
      <ColorSelection
        initialValue={hex}
        onChange={(newHex, commit) => {
          onChange(fromHex(newHex), commit)
        }}
      />
    </Popover>
  )
}
