import { useRef, useState } from 'react'
import { HexAlphaColorPicker, HexColorInput } from 'react-colorful'
import styles from './ColorSelection.module.css'

interface Props {
  initialValue: string
  onChange: (hex: string, commit: boolean) => void
}

export default function ColorSelection({ initialValue, onChange }: Props) {
  const [hex, setHex] = useState<string>(initialValue)

  // When user clicks on a color, then there is no enough time to update state with hex
  // and let for onPointerUp callback to have fresh value
  // so this ref provides this callback with fresh value of hex
  const currentHex = useRef(hex)
  currentHex.current = hex

  const previewChange = (newHex: string) => {
    currentHex.current = newHex
    setHex(newHex)
    onChange(newHex, false)
  }

  const commitChange = () => {
    onChange(currentHex.current, true)
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
