import { SoftVector4 } from '@mateuszjs/magic-render/types'

const TAU = 2 * Math.PI

// CCW arc from `from` to `to`, in [0, 2π).
function ccwArc(from: number, to: number): number {
  let arc = (to - from) % TAU
  if (arc < 0) arc += TAU
  return arc
}

/**
 * Returns true if `value` lies on the arc from `low` to `high`
 * traveled in the given direction.
 *   isCCW = true  → arc from low to high going counter-clockwise (increasing math angle)
 *   isCCW = false → arc from low to high going clockwise          (decreasing math angle)
 *
 * Endpoints are inclusive: `value === low` and `value === high` both return true.
 * If `low === high`, only `value === low` returns true.
 */
function isBetween(low: number, high: number, value: number): boolean {
  return ccwArc(low, value) <= ccwArc(low, high)
}

export function sanitizeOnChange(value: SoftVector4, index: number, newComponent: number | null) {
  if (newComponent === null) {
    const newValues = value.toSpliced(index, 1, null)
    return newValues as SoftVector4
  }

  const prev = index === 0 ? 3 : index - 1
  const next = index === 3 ? 0 : index + 1

  const isValid = isBetween(value[prev] as number, value[next] as number, newComponent)
  if (isValid) {
    return value.toSpliced(index, 1, newComponent) as SoftVector4
    // const newValues = value.toSpliced(index, 1, newComponent)
  }

  return value

  // Left neighbors must stay CW of newComponent
  // (in CCW-array convention, smaller index = more CW = smaller unwrapped math angle).
  // If a left neighbor ended up CCW of newComponent, snap it to newComponent.
  // for (let i = index - 1; i >= 0; i--) {
  //   const v = newValues[i]
  //   if (v !== null && signedArc(newComponent, v) > 0) {
  //     newValues[i] = newComponent
  //   }
  // }

  // Right neighbors must stay CCW of newComponent.
  // If one ended up CW, snap.
  // for (let i = index + 1; i < newValues.length; i++) {
  //   const v = newValues[i]
  //   if (v !== null && signedArc(newComponent, v) < 0) {
  //     newValues[i] = newComponent
  //   }
  // }

  // return newValues as SoftVector4
}
