/**
 * Boolean operations for paths using the polygon-clipping library.
 *
 * This module provides high-quality boolean operations (union, intersection,
 * difference, XOR) for SimplePath objects. These operations allow you to
 * combine, subtract, and intersect shapes to create complex geometric forms.
 *
 * ## Key Features
 * - **Union**: Combine multiple shapes into one
 * - **Intersection**: Find overlapping areas
 * - **Difference**: Subtract shapes from each other
 * - **XOR**: Get symmetric difference (non-overlapping areas)
 *
 * ## Usage
 * Boolean operations work with SimplePath objects. Use the `shapeToSimplePath`
 * helper to convert common shapes (circles, rectangles, etc.) to SimplePath format.
 *
 * All operations return an array of SimplePath objects because the result may
 * consist of multiple disconnected regions.
 *
 * @module booleanOps
 *
 * @example
 * ```typescript
 * import { union, intersection, difference, xor, shapeToSimplePath } from 'solandra'
 *
 * // Create shapes
 * const circle1 = shapeToSimplePath.circle([0.3, 0.5], 0.2)
 * const circle2 = shapeToSimplePath.circle([0.7, 0.5], 0.2)
 * const square = shapeToSimplePath.rect(0.3, 0.3, 0.4, 0.4)
 *
 * // Combine shapes
 * const combined = union(circle1, circle2, square)
 * combined.forEach(path => s.fill(path))
 *
 * // Find overlap
 * const overlap = intersection(circle1, circle2)
 * overlap.forEach(path => s.fill(path))
 *
 * // Cut out a shape
 * const withHole = difference(square, circle1)
 * withHole.forEach(path => s.fill(path))
 * ```
 */

import polygonClipping from "polygon-clipping"
import { SimplePath } from "./paths/SimplePath"
import { Point2D } from "./types/sol"

type Polygon = Point2D[][]
type MultiPolygon = Polygon[]

/**
 * Convert a MultiPolygon result back to Solandra SimplePath objects.
 * Handles both exterior rings and holes (interior rings).
 */
function multiPolygonToPaths(multiPolygon: MultiPolygon): SimplePath[] {
  const paths: SimplePath[] = []

  for (const polygon of multiPolygon) {
    if (polygon.length === 0) continue

    // The first ring is the exterior
    const exteriorRing = polygon[0]
    if (exteriorRing.length > 0) {
      // Close the path if not already closed
      const points = [...exteriorRing]
      if (
        points[0][0] !== points[points.length - 1][0] ||
        points[0][1] !== points[points.length - 1][1]
      ) {
        points.push([points[0][0], points[0][1]])
      }
      paths.push(SimplePath.withPoints(points))
    }

    // Handle holes (interior rings)
    // For now, we'll create separate paths for holes
    // In the future, we could support a HollowPath type
    for (let i = 1; i < polygon.length; i++) {
      const holeRing = polygon[i]
      if (holeRing.length > 0) {
        const points = [...holeRing]
        if (
          points[0][0] !== points[points.length - 1][0] ||
          points[0][1] !== points[points.length - 1][1]
        ) {
          points.push([points[0][0], points[0][1]])
        }
        paths.push(SimplePath.withPoints(points))
      }
    }
  }

  return paths
}

/**
 * Union operation - combines multiple paths into one.
 * Returns the area covered by any of the input paths.
 *
 * The union of two or more shapes is the total area covered by at least one of the shapes.
 * This is useful for merging overlapping shapes into a single shape.
 *
 * @param paths - SimplePath objects to union together
 * @returns Array of SimplePath objects representing the union
 *
 * @example
 * ```typescript
 * const circle1 = shapeToSimplePath.circle([0.3, 0.5], 0.2)
 * const circle2 = shapeToSimplePath.circle([0.7, 0.5], 0.2)
 * const result = union(circle1, circle2)
 * result.forEach(path => s.fill(path))
 * ```
 */
export function union(...paths: SimplePath[]): SimplePath[] {
  if (paths.length === 0) return []
  if (paths.length === 1) return paths

  const polygons: Polygon[] = paths.map((p) => [p.points])
  const result = polygonClipping.union(polygons[0], ...polygons.slice(1))

  return multiPolygonToPaths(result)
}

/**
 * Intersection operation - finds the overlapping area.
 * Returns the area covered by all input paths.
 *
 * The intersection of two or more shapes is the area where all shapes overlap.
 * If the shapes don't overlap, an empty array is returned.
 *
 * @param paths - SimplePath objects to intersect
 * @returns Array of SimplePath objects representing the intersection
 *
 * @example
 * ```typescript
 * const circle1 = shapeToSimplePath.circle([0.4, 0.5], 0.2)
 * const circle2 = shapeToSimplePath.circle([0.6, 0.5], 0.2)
 * const overlap = intersection(circle1, circle2)
 * overlap.forEach(path => s.fill(path))
 * ```
 */
export function intersection(...paths: SimplePath[]): SimplePath[] {
  if (paths.length === 0) return []
  if (paths.length === 1) return paths

  const polygons: Polygon[] = paths.map((p) => [p.points])
  const result = polygonClipping.intersection(polygons[0], ...polygons.slice(1))

  return multiPolygonToPaths(result)
}

/**
 * Difference operation - subtracts paths from the first path.
 * Returns the area of the first path minus all other paths.
 *
 * The difference operation removes the area of the clipping paths from the subject path.
 * This is useful for cutting holes or removing parts of a shape.
 *
 * @param subjectPath - The base path to subtract from
 * @param clipPaths - Paths to subtract from the subject
 * @returns Array of SimplePath objects representing the difference
 *
 * @example
 * ```typescript
 * const square = shapeToSimplePath.rect(0.2, 0.2, 0.6, 0.6)
 * const circle = shapeToSimplePath.circle([0.5, 0.5], 0.2)
 * // Square with circular hole
 * const result = difference(square, circle)
 * result.forEach(path => s.fill(path))
 * ```
 */
export function difference(
  subjectPath: SimplePath,
  ...clipPaths: SimplePath[]
): SimplePath[] {
  if (clipPaths.length === 0) return [subjectPath]

  const subjectPolygon: Polygon = [subjectPath.points]
  const clipPolygons: Polygon[] = clipPaths.map((p) => [p.points])
  const result = polygonClipping.difference(subjectPolygon, ...clipPolygons)

  return multiPolygonToPaths(result)
}

/**
 * XOR operation - exclusive or.
 * Returns the area covered by an odd number of paths.
 *
 * The XOR operation returns areas that are covered by exactly one shape (or an odd number).
 * Overlapping areas are excluded. This creates interesting symmetric difference patterns.
 *
 * @param paths - SimplePath objects to XOR together
 * @returns Array of SimplePath objects representing the XOR result
 *
 * @example
 * ```typescript
 * const circle1 = shapeToSimplePath.circle([0.4, 0.5], 0.25)
 * const circle2 = shapeToSimplePath.circle([0.6, 0.5], 0.25)
 * // Everything except the overlap
 * const result = xor(circle1, circle2)
 * result.forEach(path => s.fill(path))
 * ```
 */
export function xor(...paths: SimplePath[]): SimplePath[] {
  if (paths.length === 0) return []
  if (paths.length === 1) return paths

  const polygons: Polygon[] = paths.map((p) => [p.points])
  const result = polygonClipping.xor(polygons[0], ...polygons.slice(1))

  return multiPolygonToPaths(result)
}

/**
 * Helper object containing utility functions to convert common geometric shapes
 * to SimplePath objects for use with boolean operations.
 *
 * These helpers approximate curves (circles, ellipses) with line segments.
 * Higher segment counts produce smoother curves but more complex paths.
 *
 * @example
 * ```typescript
 * const circle = shapeToSimplePath.circle([0.5, 0.5], 0.2)
 * const square = shapeToSimplePath.rect(0.3, 0.3, 0.4, 0.4)
 * const combined = union(circle, square)
 * ```
 */
export const shapeToSimplePath = {
  /**
   * Convert a circle to a SimplePath with the specified number of segments.
   *
   * @param center - Center point [x, y] of the circle
   * @param radius - Radius of the circle
   * @param segments - Number of line segments to approximate the circle (default: 64)
   * @returns SimplePath representing the circle
   */
  circle(center: Point2D, radius: number, segments: number = 64): SimplePath {
    const points: Point2D[] = []
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      points.push([
        center[0] + Math.cos(angle) * radius,
        center[1] + Math.sin(angle) * radius,
      ])
    }
    return SimplePath.withPoints(points)
  },

  /**
   * Convert a rectangle to a SimplePath.
   *
   * @param x - X coordinate of the top-left corner
   * @param y - Y coordinate of the top-left corner
   * @param width - Width of the rectangle
   * @param height - Height of the rectangle
   * @returns SimplePath representing the rectangle
   */
  rect(x: number, y: number, width: number, height: number): SimplePath {
    return SimplePath.withPoints([
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height],
      [x, y],
    ])
  },

  /**
   * Convert an ellipse to a SimplePath.
   *
   * @param center - Center point [x, y] of the ellipse
   * @param radiusX - Horizontal radius
   * @param radiusY - Vertical radius
   * @param segments - Number of line segments to approximate the ellipse (default: 64)
   * @returns SimplePath representing the ellipse
   */
  ellipse(
    center: Point2D,
    radiusX: number,
    radiusY: number,
    segments: number = 64
  ): SimplePath {
    const points: Point2D[] = []
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      points.push([
        center[0] + Math.cos(angle) * radiusX,
        center[1] + Math.sin(angle) * radiusY,
      ])
    }
    return SimplePath.withPoints(points)
  },

  /**
   * Convert a regular polygon to a SimplePath.
   *
   * @param center - Center point [x, y] of the polygon
   * @param radius - Distance from center to vertices
   * @param sides - Number of sides (e.g., 3 for triangle, 6 for hexagon)
   * @param rotation - Rotation angle in radians (default: 0)
   * @returns SimplePath representing the regular polygon
   */
  regularPolygon(
    center: Point2D,
    radius: number,
    sides: number,
    rotation: number = 0
  ): SimplePath {
    const points: Point2D[] = []
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2 + rotation
      points.push([
        center[0] + Math.cos(angle) * radius,
        center[1] + Math.sin(angle) * radius,
      ])
    }
    return SimplePath.withPoints(points)
  },
}
