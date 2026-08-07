import { Traceable } from "./index.js"
import { Point2D } from "../types/sol.js"
import { SimplePath } from "./SimplePath.js"
import { polarToCartesian, subtract } from "../vectors.js"

/**
 * How a shape's `at` point relates to its bounding box.
 */
export type Align = "topLeft" | "center"

/**
 * The top left of a box, however it was specified.
 * @internal
 */
export const boxTopLeft = ({
  at,
  w,
  h,
  align = "topLeft",
}: {
  at: Point2D
  w: number
  h: number
  align?: Align
}): Point2D => (align === "topLeft" ? at : subtract(at, [w / 2, h / 2]))

/**
 * The centre of a box, however it was specified.
 * @internal
 */
export const boxCenter = ({
  at,
  w,
  h,
  align = "center",
}: {
  at: Point2D
  w: number
  h: number
  align?: Align
}): Point2D => (align === "center" ? at : [at[0] + w / 2, at[1] + h / 2])

/**
 * Vertices of a regular polygon, starting from the top (which feels more
 * natural than starting from the right) and going clockwise.
 *
 * @param config.at Centre of the polygon
 * @param config.n Number of vertices
 * @param config.r Distance of each vertex from the centre
 * @param config.a Rotation applied to the whole polygon (radians)
 * @internal
 */
export function regularPolygonPoints({
  at,
  n,
  r,
  a = 0,
}: {
  at: Point2D
  n: number
  r: number
  a?: number
}): Point2D[] {
  // Start from top... feels more natural?
  const startAngle = a - Math.PI / 2
  const dA = (Math.PI * 2) / n
  return Array.from({ length: n }, (_, i) =>
    polarToCartesian(at, r, startAngle + i * dA)
  )
}

/**
 * NB Not all canvas stuff supported, don't export this!
 * Good enough for some things
 * @param traceable
 */
export function traceSimplePath(traceable: Traceable): SimplePath {
  const sp = SimplePath.withPoints([])

  traceable.traceIn({
    moveTo(x, y) {
      sp.addPoint([x, y])
    },
    lineTo(x, y) {
      sp.addPoint([x, y])
    },
  } as CanvasRenderingContext2D)
  return sp
}

/**
 * Sample points along a circular arc
 * @param config Configuration object with center, radius, angles, and detail level
 * @returns Array of points along the arc (detail + 2 points including start and end)
 */
export function sampleArc(config: {
  center: Point2D
  radius: number
  startAngle: number
  endAngle: number
  detail: number
  antiClockwise?: boolean
}): Point2D[] {
  const {
    center: [cX, cY],
    radius,
    startAngle,
    endAngle,
    detail,
    antiClockwise = false,
  } = config

  // Handle the angle difference based on direction
  let angleDiff = endAngle - startAngle
  if (antiClockwise) {
    // For antiClockwise, we want a negative angle difference
    if (angleDiff > 0) {
      angleDiff = angleDiff - 2 * Math.PI
    }
  } else {
    // For clockwise, we want a positive angle difference
    if (angleDiff < 0) {
      angleDiff = angleDiff + 2 * Math.PI
    }
  }

  const numPoints = detail + 2
  const points: Point2D[] = []

  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1)
    const angle = startAngle + t * angleDiff
    points.push([cX + radius * Math.cos(angle), cY + radius * Math.sin(angle)])
  }

  return points
}

/**
 * Sample points along a quadratic Bezier curve
 * @param config Configuration with start, control, end points and detail level
 * @returns Array of intermediate points (excludes start, includes end)
 */
export function sampleQuadraticBezier(config: {
  start: Point2D
  control: Point2D
  end: Point2D
  detail: number
}): Point2D[] {
  const { start, control, end, detail } = config

  if (detail === 0) {
    return [end]
  }

  const points: Point2D[] = []
  const numPoints = detail + 1

  for (let i = 1; i <= numPoints; i++) {
    const t = i / numPoints
    const t1 = 1 - t
    // Quadratic Bezier formula: B(t) = (1-t)² * P0 + 2(1-t)t * P1 + t² * P2
    const x = t1 * t1 * start[0] + 2 * t1 * t * control[0] + t * t * end[0]
    const y = t1 * t1 * start[1] + 2 * t1 * t * control[1] + t * t * end[1]
    points.push([x, y])
  }

  return points
}
