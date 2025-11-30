import { LinearGradient, Point, RadialGradient } from '@mateuszjs/magic-render/types'

export function getLinearEndpoints(
  angleDegrees: number,
  gradient: LinearGradient
): { start: Point; end: Point } {
  const radians = (angleDegrees * Math.PI) / 180
  const center = {
    x: (gradient.start.x + gradient.end.x) / 2,
    y: (gradient.start.y + gradient.end.y) / 2,
  }
  const distance = Math.hypot(center.x - gradient.start.x, center.y - gradient.start.y)
  return {
    start: {
      x: Math.cos(radians) * distance + center.x,
      y: Math.sin(radians) * distance + center.y,
    },
    end: {
      x: Math.cos(radians + Math.PI) * distance + center.x,
      y: Math.sin(radians + Math.PI) * distance + center.y,
    },
  }
}

// returns only end point, start point stays constant during rotation
export function getRadialEndPoint(angleDegrees: number, gradient: RadialGradient): Point {
  const radians = (angleDegrees * Math.PI) / 180
  const distance = Math.hypot(gradient.start.x - gradient.end.x, gradient.start.y - gradient.end.y)
  return {
    x: Math.cos(radians) * distance + gradient.start.x,
    y: Math.sin(radians) * distance + gradient.start.y,
  }
}
