const TO_DEG = 180 / Math.PI

/**
 * Build a CSS conic-gradient from 4 angles in RADIANS (math convention: CCW from +x axis).
 *
 * Input is assumed to be in CCW (math-natural) order — i.e. ascending angle around the circle.
 *   angles[3] is the visually most-CCW point (top of the arc, "1st")
 *   angles[0] is the visually most-CW  point (bottom of the arc, "4th")
 *
 * Gradient: transparent at angles[3] → fade to red at angles[2] → stay red at angles[1]
 *           → fade to transparent at angles[0] → fully transparent across the gap.
 */
export function getConicGradient(angles: number[]): string {
  if (angles.length !== 4) throw new Error('Expected exactly 4 angles')

  // math radians (CCW from +x) → CSS degrees (CW from 12 o'clock)
  const toCssDeg = (rad: number): number => {
    const d = (90 - rad * TO_DEG) % 360
    return d < 0 ? d + 360 : d
  }

  // Reverse so we walk in CW (CSS) order; c1 is the "top" / start of red region.
  const [c1, c2, c3, c4] = [...angles].reverse().map(toCssDeg)

  // CW arc length from a to b, always positive (handles 360° wrap)
  const cwWidth = (a: number, b: number): number => {
    const w = b - a
    return w < 0 ? w + 360 : w
  }

  const d12 = cwWidth(c1, c2)
  const d13 = cwWidth(c1, c3)
  const d14 = cwWidth(c1, c4)

  return (
    `conic-gradient(from ${c1.toFixed(3)}deg, ` +
    `transparent 0deg, ` +
    `red ${d12.toFixed(3)}deg, ` +
    `red ${d13.toFixed(3)}deg, ` +
    `transparent ${d14.toFixed(3)}deg)`
  )
}
