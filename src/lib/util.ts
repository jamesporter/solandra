/**
 * Utility functions for coordinate transformations, scaling, and geometric operations.
 * @module util
 */

import { Point2D } from "./types/sol.js"

/**
 * Clamps a number to be within a specified range.
 *
 * @param range - The range bounds
 * @param range.from - Minimum value
 * @param range.to - Maximum value
 * @param n - The number to clamp
 * @returns The clamped value between from and to
 * @example
 * ```ts
 * clamp({ from: 0, to: 1 }, 1.5) // Returns 1
 * clamp({ from: 0, to: 1 }, -0.5) // Returns 0
 * clamp({ from: 0, to: 1 }, 0.5) // Returns 0.5
 * ```
 */
export const clamp = (
  { from, to }: { from: number; to: number },
  n: number
): number => {
  return Math.min(to, Math.max(from, n))
}

/**
 * Linearly interpolates between two numbers.
 * The numeric counterpart of `v.pointAlong` for points.
 *
 * @param range - The range bounds
 * @param range.from - Value at proportion 0
 * @param range.to - Value at proportion 1
 * @param proportion - The interpolation proportion (not clamped, so values
 * outside [0, 1] extrapolate)
 * @returns The interpolated value
 * @example
 * ```ts
 * lerp({ from: 0, to: 10 }, 0.5) // Returns 5
 * lerp({ from: 10, to: 20 }, 0.25) // Returns 12.5
 * ```
 */
export const lerp = (
  { from, to }: { from: number; to: number },
  proportion: number
): number => {
  return from + (to - from) * proportion
}

/**
 * Configuration for scaling functions that map from one numeric range to another.
 */
type ScaleConfig = {
  /** Minimum value of the input domain */
  minDomain: number
  /** Maximum value of the input domain */
  maxDomain: number
  /** Minimum value of the output range */
  minRange: number
  /** Maximum value of the output range */
  maxRange: number
}

/**
 * Creates a scaling function that maps values from one range to another.
 * Useful for converting between different coordinate systems or value ranges.
 *
 * @param config - Scaling configuration
 * @param config.minDomain - Minimum input value
 * @param config.maxDomain - Maximum input value
 * @param config.minRange - Minimum output value
 * @param config.maxRange - Maximum output value
 * @returns A function that maps input values to the output range
 * @example
 * ```ts
 * // Map 0-100 to 0-1
 * const scale = scaler({ minDomain: 0, maxDomain: 100, minRange: 0, maxRange: 1 })
 * scale(50) // Returns 0.5
 * scale(100) // Returns 1
 *
 * // Map temperature from Celsius to normalized range
 * const tempScale = scaler({ minDomain: -20, maxDomain: 40, minRange: 0, maxRange: 1 })
 * tempScale(10) // Returns 0.5
 * ```
 */
export const scaler = ({
  minDomain,
  maxDomain,
  minRange,
  maxRange,
}: ScaleConfig): ((n: number) => number) => {
  const rangeS = maxRange - minRange
  const domainS = maxDomain - minDomain
  return (n) => minRange + (rangeS * (n - minDomain)) / domainS
}

/**
 * Creates a 2D scaling function that independently maps x and y coordinates.
 * Combines two 1D scalers for transforming 2D points.
 *
 * @param c1 - Scaling configuration for x-coordinate
 * @param c2 - Scaling configuration for y-coordinate
 * @returns A function that maps 2D points from input domain to output range
 * @example
 * ```ts
 * // Map grid coordinates (0-10, 0-10) to canvas space (0-1, 0-1)
 * const scale = scaler2d(
 *   { minDomain: 0, maxDomain: 10, minRange: 0, maxRange: 1 },
 *   { minDomain: 0, maxDomain: 10, minRange: 0, maxRange: 1 }
 * )
 * scale([5, 5]) // Returns [0.5, 0.5]
 * ```
 */
export const scaler2d = (
  c1: ScaleConfig,
  c2: ScaleConfig
): ((point: Point2D) => Point2D) => {
  const s1 = scaler(c1)
  const s2 = scaler(c2)
  return ([x, y]: Point2D) => [s1(x), s2(y)]
}

/**
 * Creates an isometric projection transformation function.
 * Converts 3D coordinates [x, y, z] to 2D isometric projection coordinates.
 *
 * @param height - The height of the vertical parts of isometric grid cells
 * @returns A function that maps 3D points [x, y, z] to 2D isometric coordinates [x, y]
 * @example
 * ```ts
 * const iso = isoTransform(0.1)
 * const [x2d, y2d] = iso([1, 0, 0]) // Convert 3D cube coordinate to 2D
 *
 * // Draw isometric grid
 * s.forGrid({ minX: 0, maxX: 5, minY: 0, maxY: 5 }, ([x, y]) => {
 *   const [px, py] = iso([x, 0, y])
 *   s.fill(new Circle({ at: [px + 0.5, py + 0.5], r: 0.02 }))
 * })
 * ```
 */
export const isoTransform = (height: number) => {
  const w = (height * Math.sqrt(3)) / 2
  return ([x, y, z]: [number, number, number]): [number, number] => [
    -w * (z - x),
    -height * (x / 2 + y + z / 2),
  ]
}

/**
 * Calculates the centroid (geometric center) of a set of points.
 * If the first and last points are the same (closed path), ignores the duplicate.
 *
 * @param points - Array of 2D points
 * @returns The centroid point (average of all x and y coordinates)
 * @throws Error if the points array is empty
 * @example
 * ```ts
 * const center = centroid([[0, 0], [1, 0], [1, 1], [0, 1]]) // Returns [0.5, 0.5]
 *
 * // Find center of a polygon and draw from there
 * const poly = new RegularPolygon({ at: [0.5, 0.5], n: 6, r: 0.2 })
 * const center = centroid(poly.points())
 * s.fill(new Circle({ at: center, r: 0.05 }))
 * ```
 */
export const centroid = (points: Point2D[]): Point2D => {
  const n = points.length
  if (n === 0) {
    throw new Error("centroid must have at least one point")
  } else if (n === 1) {
    return points[0]
  } else {
    let m =
      points[0][0] == points[n - 1][0] && points[0][1] == points[n - 1][1]
        ? n - 1
        : n

    let x = 0
    let y = 0
    for (let i = 0; i < m; i++) {
      x += points[i][0]
      y += points[i][1]
    }
    return [x / m, y / m]
  }
}

const cp6 = Math.cos(Math.PI / 6)

/**
 * Creates a hexagonal grid transformation function.
 * Converts integer grid coordinates to positions in a hexagonal tiling pattern.
 *
 * @param config - Hexagonal grid configuration
 * @param config.r - Radius of each hexagon
 * @param config.vertical - If true (default), hexagons have a vertex at top; if false, flat edge at top
 * @returns A function that maps integer grid coordinates to hexagonal grid positions
 * @example
 * ```ts
 * // Vertical hexagons (pointy top)
 * const hexV = hexTransform({ r: 0.05, vertical: true })
 * s.forGrid({ minX: 0, maxX: 10, minY: 0, maxY: 10 }, ([x, y]) => {
 *   const [hx, hy] = hexV([x, y])
 *   s.fill(new Hexagon({ at: [hx, hy], r: 0.05 }))
 * })
 *
 * // Horizontal hexagons (flat top)
 * const hexH = hexTransform({ r: 0.05, vertical: false })
 * ```
 */
export const hexTransform =
  ({ r, vertical = true }: { r: number; vertical?: boolean }) =>
  ([x, y]: Point2D): Point2D => {
    if (vertical) {
      return [
        y % 2 === 0 ? 2 * r * cp6 * x : (2 * x - 1) * r * cp6,
        1.5 * y * r,
      ]
    } else {
      return [
        r * 1.5 * x,
        x % 2 === 0 ? 2 * r * cp6 * y : (2 * y - 1) * r * cp6,
      ]
    }
  }

/**
 * Creates a triangular grid transformation function.
 * Converts integer grid coordinates to positions in a triangular tiling pattern.
 * Triangles alternate between pointing up and down to create a tessellation.
 *
 * @param config - Triangle grid configuration
 * @param config.s - Side length of each equilateral triangle
 * @returns A function that maps integer grid coordinates to triangle centers and orientation
 * @example
 * ```ts
 * const tri = triTransform({ s: 0.1 })
 * s.forGrid({ minX: 0, maxX: 10, minY: 0, maxY: 10 }, ([x, y]) => {
 *   const { at, flipped } = tri([x, y])
 *   const triangle = new EquilateralTriangle({
 *     at,
 *     r: 0.05,
 *     a: flipped ? Math.PI : 0
 *   })
 *   s.fill(triangle)
 * })
 * ```
 */
export const triTransform = ({ s }: { s: number }) => {
  const r = s / (2 * Math.sin(Math.PI / 3))
  const h = (s * 0.5) / Math.tan(Math.PI / 3)

  return ([x, y]: Point2D): { at: Point2D; flipped: boolean } => {
    const isUp = (x + y) % 2 === 0
    if (isUp) {
      return { at: [0.5 * s * x, (h + r) * y], flipped: false }
    } else {
      return { at: [0.5 * s * x, (h + r) * y + h - r], flipped: true }
    }
  }
}
