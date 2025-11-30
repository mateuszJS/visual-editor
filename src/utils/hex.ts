import { Color } from '@mateuszjs/magic-render/types'

export function toHex(value: Color): string {
  const r = Math.round(value[0] * 255)
  const g = Math.round(value[1] * 255)
  const b = Math.round(value[2] * 255)
  const a = Math.round(value[3] * 255)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
    .toString(16)
    .padStart(2, '0')}${a.toString(16).padStart(2, '0')}`
}

export function fromHex(hex: string): Color {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const a = hex.length > 7 ? parseInt(hex.slice(7, 9), 16) / 255 : 1

  return [r, g, b, a]
}
