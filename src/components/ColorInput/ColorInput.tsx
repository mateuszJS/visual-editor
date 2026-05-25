import { Color } from '@mateuszjs/magic-render/types'
import numberInputStyles from '@/components/NumberInput/NumberInput.module.css'
import cn from 'classnames'
import { fromHex, toHex } from '@/utils/hex'
import Popover from '../Popover/Popover'
import ColorSelection from './components/ColorSelection/ColorSelection'
import styles from './ColorInput.module.css'
import useUniqueId from '@/hooks/useUniqueId/useUniqueId'

interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'> {
  label?: string
  value: Color // normalized RGBA array
  onChange: (value: Color, commit: boolean) => void
}

export default function ColorInput({ label, value, onChange, ...rest }: Props) {
  const hex = toHex(value)
  const inputId = useUniqueId()

  return (
    <>
      {label && (
        <label htmlFor={inputId} className={numberInputStyles.label}>
          Color:
        </label>
      )}
      <Popover
        trigger={() => <div style={{ backgroundColor: hex }} />}
        popoverClassName={styles.popover}
        {...rest}
        id={inputId}
        className={cn(styles.colorPicker, rest.className, {
          [styles.withLabel]: !!label,
        })}
        variant="ghost"
        noHover
      >
        <ColorSelection
          initialValue={hex}
          onChange={(newHex, commit) => {
            onChange(fromHex(newHex), commit)
          }}
        />
      </Popover>
    </>
  )
}
