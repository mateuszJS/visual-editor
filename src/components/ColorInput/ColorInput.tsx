import { useRef } from 'react'
import { HexAlphaColorPicker, HexColorInput } from 'react-colorful'
import styles from './ColorInput.module.css'
import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import { Color } from '@mateuszjs/magic-render'
import numberInputStyles from '@/components/NumberInput/NumberInput.module.css'
import cn from 'classnames'

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
  const popoverId = useUniqueId()
  const hex = toHex(value)
  const valueRef = useRef(hex) // onChange(.., false) doesn't trigger re-render
  // so this ref helps us keep track of the latest value

  if (valueRef.current !== hex) {
    valueRef.current = hex
  }

  const onChangeColor = (newHex: string) => {
    valueRef.current = newHex
    onChange(fromHex(newHex), false)
  }

  const lastCommittedHex = useRef<string | null>(null)
  const handlePopoverToggle = (e: React.ToggleEvent<HTMLDivElement>) => {
    if (e.newState === 'open') {
      // Store the initial value when editing starts
      lastCommittedHex.current = hex
    }
  }

  const submitChange = () => {
    // Only commit if the value actually changed from when editing started(lastCommittedHex has changed)
    // alternative would be to use just "value" instead of "lastCommittedHex", but this way we heavily depend on
    // making sure unnecessary renders won't happen, what seems to be too fragile strategy
    if (lastCommittedHex.current !== valueRef.current) {
      lastCommittedHex.current = valueRef.current
      onChange(fromHex(valueRef.current), true)
    }
  }

  return (
    <>
      <button
        {...rest}
        popoverTarget={popoverId}
        className={cn(styles.colorPicker, numberInputStyles.input, rest.className)}
        aria-label={label}
      >
        <div style={{ backgroundColor: hex }} />
      </button>
      <div
        id={popoverId}
        popover="auto"
        className={styles.popover}
        role="dialog"
        aria-modal="true"
        onToggle={handlePopoverToggle}
      >
        <HexAlphaColorPicker color={hex} onChange={onChangeColor} onPointerUp={submitChange} />
        <label className={styles.hexLabel}>
          Hex: #
          <HexColorInput
            color={hex}
            onChange={onChangeColor}
            className={styles.hexInput}
            alpha
            onBlur={submitChange}
          />
        </label>
      </div>
    </>
  )
}
