/**
 * 2D vector operations for working with Point2D tuples.
 * All operations return new points/values and do not mutate input parameters.
 * @module vectors
 */

import { Point2D } from "./types/sol.js"

/**
 * Adds two 2D vectors component-wise.
 *
 * @param p1 - First vector
 * @param p2 - Second vector
 * @returns A new vector representing the sum of the two input vectors
 * @example
 * ```ts
 * add([1, 2], [3, 4]) // Returns [4, 6]
 * ```
 */
export const add = ([x1, y1]: Point2D, [x2, y2]: Point2D): Point2D => [
  x1 + x2,
  y1 + y2,
]

/**
 * Subtracts the second vector from the first component-wise.
 *
 * @param p1 - Vector to subtract from
 * @param p2 - Vector to subtract
 * @returns A new vector representing the difference
 * @example
 * ```ts
 * subtract([5, 7], [2, 3]) // Returns [3, 4]
 * ```
 */
export const subtract = ([x1, y1]: Point2D, [x2, y2]: Point2D): Point2D => [
  x1 - x2,
  y1 - y2,
]

/**
 * Calculates the magnitude (length) of a 2D vector.
 *
 * @param p - The vector
 * @returns The Euclidean length of the vector
 * @example
 * ```ts
 * magnitude([3, 4]) // Returns 5
 * ```
 */
export const magnitude = ([x, y]: Point2D): number => Math.sqrt(x ** 2 + y ** 2)

/**
 * Calculates the Euclidean distance between two points.
 *
 * @param a - First point
 * @param b - Second point
 * @returns The distance between the two points
 * @example
 * ```ts
 * distance([0, 0], [3, 4]) // Returns 5
 * ```
 */
export const distance = (a: Point2D, b: Point2D): number =>
  magnitude(subtract(a, b))

/**
 * Rotates a vector around the origin (0, 0) by a given angle.
 *
 * @param p - The vector to rotate
 * @param a - The angle in radians (positive is counter-clockwise)
 * @returns A new rotated vector
 * @example
 * ```ts
 * rotate([1, 0], Math.PI / 2) // Returns approximately [0, 1]
 * ```
 */
export const rotate = ([x, y]: Point2D, a: number): Point2D => [
  x * Math.cos(a) - y * Math.sin(a),
  x * Math.sin(a) + y * Math.cos(a),
]

/**
 * Rotates a point around a specified origin point by a given angle.
 *
 * @param origin - The point to rotate around
 * @param p - The point to rotate
 * @param a - The angle in radians (positive is counter-clockwise)
 * @returns A new rotated point
 * @example
 * ```ts
 * rotateAround([0.5, 0.5], [1, 0.5], Math.PI) // Rotates point around center
 * ```
 */
export const rotateAround = (
  origin: Point2D,
  [x, y]: Point2D,
  a: number
): Point2D => {
  const [oX, oY] = origin

  return [
    oX + (x - oX) * Math.cos(a) - (y - oY) * Math.sin(a),
    oY + (x - oX) * Math.sin(a) + (y - oY) * Math.cos(a),
  ]
}

/**
 * Normalizes a vector to have a magnitude of 1 (unit vector).
 * The zero vector has no direction, so it is returned unchanged
 * (rather than producing `[NaN, NaN]`, which would silently break drawing).
 *
 * @param p - The vector to normalize
 * @returns A new unit vector in the same direction, or [0, 0] for the zero vector
 * @example
 * ```ts
 * normalize([3, 4]) // Returns [0.6, 0.8]
 * normalize([0, 0]) // Returns [0, 0]
 * ```
 */
export const normalize = (p: Point2D): Point2D => {
  const m = magnitude(p)
  if (m === 0) return [0, 0]
  return [p[0] / m, p[1] / m]
}

/**
 * Scales a vector by a scalar value.
 *
 * @param p - The vector to scale
 * @param scale - The scaling factor
 * @returns A new scaled vector
 * @example
 * ```ts
 * scale([2, 3], 2) // Returns [4, 6]
 * ```
 */
export const scale = ([x, y]: Point2D, scale: number): Point2D => [
  scale * x,
  scale * y,
]

/**
 * Converts polar coordinates to Cartesian coordinates relative to a center point.
 *
 * @param center - The center point [x, y]
 * @param radius - The radius from the center
 * @param angle - The angle in radians (0 is to the right, π/2 is up)
 * @returns A new point in Cartesian coordinates
 * @example
 * ```ts
 * polarToCartesian([0.5, 0.5], 0.2, 0) // Returns [0.7, 0.5]
 * polarToCartesian([0.5, 0.5], 0.2, Math.PI / 2) // Returns [0.5, 0.7]
 * ```
 */
export const polarToCartesian = (
  [x, y]: Point2D,
  radius: number,
  angle: number
): Point2D => [x + radius * Math.cos(angle), y + radius * Math.sin(angle)]

/**
 * Finds a point along the line segment between two points.
 *
 * @param a - The start point
 * @param b - The end point
 * @param proportion - The proportion along the line (0 = point a, 1 = point b, 0.5 = midpoint)
 * @returns A new point at the specified proportion between a and b
 * @example
 * ```ts
 * pointAlong([0, 0], [10, 10], 0.5) // Returns [5, 5] (midpoint)
 * pointAlong([0, 0], [10, 10], 0.25) // Returns [2.5, 2.5]
 * ```
 */
export const pointAlong = (
  a: Point2D,
  b: Point2D,
  proportion = 0.5
): Point2D => {
  return add(a, scale(subtract(b, a), proportion))
}

/**
 * Calculates the dot product of two vectors.
 *
 * @param p1 - First vector
 * @param p2 - Second vector
 * @returns The dot product (scalar value)
 * @example
 * ```ts
 * dot([1, 2], [3, 4]) // Returns 11 (1*3 + 2*4)
 * ```
 */
export const dot = ([x1, y1]: Point2D, [x2, y2]: Point2D): number =>
  x1 * x2 + y1 * y2

/**
 * Calculates the 2D cross product of two vectors (the z-component of the
 * equivalent 3D cross product).
 * Useful for orientation tests: the sign indicates which side of the first
 * vector the second lies on, and it is zero when the vectors are parallel.
 *
 * @param p1 - First vector
 * @param p2 - Second vector
 * @returns The scalar cross product
 * @example
 * ```ts
 * cross([1, 0], [0, 1]) // Returns 1
 * cross([1, 0], [2, 0]) // Returns 0 (parallel)
 * ```
 */
export const cross = ([x1, y1]: Point2D, [x2, y2]: Point2D): number =>
  x1 * y2 - y1 * x2

/**
 * Calculates the angle (in radians) of a vector; the directional inverse of
 * polarToCartesian.
 *
 * @param p - The vector
 * @returns The angle in radians, in the range (-π, π]
 * @example
 * ```ts
 * heading([1, 0]) // Returns 0
 * heading([0, 1]) // Returns π/2
 * ```
 */
export const heading = ([x, y]: Point2D): number => Math.atan2(y, x)

const vectorOps = {
  add,
  subtract,
  magnitude,
  rotate,
  rotateAround,
  normalize,
  scale,
  polarToCartesian,
  pointAlong,
  dot,
  cross,
  heading,
  distance,
}

export default vectorOps
