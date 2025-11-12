import { HexAlphaColorPicker, HexColorInput } from 'react-colorful'
import cn from 'classnames'
import styles from './ColorInput.module.css'
import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import { Color } from '@mateuszjs/magic-render'
import numberInputStyles from '@/components/NumberInput/NumberInput.module.css'

interface Props {
  label: string
  value: Color // normalized RGBA array
  unit?: string
  disabled?: boolean
  onChange: (value: Color) => void
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
 * This component operates on hex values ONLY. It accept normalized rgba, but converts them to hex for the color picker.
 * any floating point precision issues are avoided this way.
 *
 * In Storybook sometimes updates can be laggy/jarring/stuck in an infinite loop,
 * It happens because useArgs returns data from two renders ago, not latest data.
 */
export default function ColorInput({ label, value, onChange, disabled = false }: Props) {
  const popoverId = useUniqueId()

  const onChangeColor = (newHex: string) => {
    const newValue = fromHex(newHex)
    onChange(newValue)
  }

  const hex = toHex(value)

  return (
    <>
      <button
        aria-label="Color picker"
        popoverTarget={popoverId}
        className={cn(numberInputStyles.root, {
          [styles.disabled]: disabled,
        })}
      >
        <span className={numberInputStyles.label}>{label}</span>
        <div className={styles.colorPicker}>
          <div style={{ backgroundColor: hex }} />
        </div>
      </button>
      <div id={popoverId} popover="auto" className={styles.popover} role="dialog" aria-modal="true">
        <HexAlphaColorPicker color={hex} onChange={onChangeColor} />
        <label className={styles.hexLabel}>
          Hex: #
          <HexColorInput color={hex} onChange={onChangeColor} className={styles.hexInput} alpha />
        </label>
      </div>
    </>
  )
}
