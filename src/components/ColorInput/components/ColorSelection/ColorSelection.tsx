import { useState } from 'react'
import { HexAlphaColorPicker, HexColorInput } from 'react-colorful'
import styles from './ColorSelection.module.css'

interface Props {
  initialValue: string
  onChange: (hex: string, commit: boolean) => void
}

export default function ColorSelection({ initialValue, onChange }: Props) {
  const [hex, setHex] = useState<string>(initialValue)

  const previewChange = (newHex: string) => {
    setHex(newHex)
    onChange(newHex, false)
  }

  const commitChange = () => {
    onChange(hex, true)
  }

  return (
    <>
      <HexAlphaColorPicker color={hex} onChange={previewChange} onPointerUp={commitChange} />
      <label className={styles.hexLabel}>
        Hex: #
        <HexColorInput color={hex} onChange={previewChange} alpha onBlur={commitChange} />
      </label>
    </>
  )
}
