import styles from './styles.module.css'

interface Props {
  id: string
  text: string
}
function generateVibrantColorFromId(projectId: number): string {
  // Generate hue (0-360) based solely on project ID
  const hue = (projectId * 137.508) % 360

  // Generate saturation and lightness based solely on project ID
  const saturation = 70 + (projectId % 30) // 70-100%
  const lightness = 45 + (projectId % 20) // 45-65%

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100

    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
      const k = (n + h * 12) % 12
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    }

    return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
  }

  const [r, g, b] = hslToRgb(hue, saturation, lightness)
  const toHex = (value: number) => value.toString(16).padStart(2, '0')

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
export default function ProjectPanel({ id, text }: Props) {
  return (
    <a
      className={styles.projectPanel}
      style={{ '--project-color': generateVibrantColorFromId(Number(id)) } as React.CSSProperties}
      href={`/project/${id}`}
    >
      <p>{text}</p>
    </a>
  )
}
