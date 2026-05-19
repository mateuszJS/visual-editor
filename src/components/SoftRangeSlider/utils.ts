/**
 * Converts a linear position [-1, 1] → scaled exponential value [min, max]
 * Changes are slow near 0, fast near the extremes.
 * @param t    - linear input, -1 to 1 (knob position)
 * @param min  - output minimum (e.g. -100)
 * @param max  - output maximum (e.g. 100)
 * @param exp  - exponent curve steepness (2 = quadratic, 3 = cubic...)
 */
export function linearToExponential(t: number, min: number, max: number, exp: number = 2): number {
  // Clamp input
  const clamped = Math.max(-1, Math.min(1, t))
  // Apply power curve (preserves sign)
  const curved = Math.sign(clamped) * Math.pow(Math.abs(clamped), exp)
  // Scale to [min, max]
  return min + ((curved + 1) / 2) * (max - min)
}

/**
 * Converts a scaled exponential value [min, max] → linear position [-1, 1]
 * Inverse of linearToExponential.
 * @param value - exponential input (e.g. current knob value)
 * @param min   - value minimum (e.g. -100)
 * @param max   - value maximum (e.g. 100)
 * @param exp   - must match the exp used in linearToExponential
 */
export function exponentialToLinear(
  value: number,
  min: number,
  max: number,
  exp: number = 2
): number {
  // Normalize to [-1, 1]
  const curved = ((value - min) / (max - min)) * 2 - 1
  // Invert the power curve
  return Math.sign(curved) * Math.pow(Math.abs(curved), 1 / exp)
}
