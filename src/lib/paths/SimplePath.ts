import { Traceable } from "./index.js"
import { Point2D, Vector2D } from "../types/sol.js"
import { tripleWise, pairWise } from "../collectionOps.js"
import v from "../vectors.js"
import { centroid, clamp, evenProportions } from "../util.js"

import { CurveConfig, Path } from "./Path.js"

export class SimplePath implements Traceable {
  constructor(public points: Point2D[] = []) {}

  static startAt(point: Point2D): SimplePath {
    return new SimplePath([point])
  }

  static withPoints(points: Point2D[]): SimplePath {
    return new SimplePath(points)
  }

  addPoint(point: Point2D): SimplePath {
    this.points.push(point)
    return this
  }

  close(): SimplePath {
    if (this.points[0]) this.points.push(this.points[0])
    return this
  }

  /**
   * Smooth out path by adding more points to give curvy result
   * @param iterations
   */
  chaiken({
    n = 1,
    looped = false,
  }: {
    n?: number
    looped?: boolean
  }): SimplePath {
    for (let i = 0; i < n; i++) {
      this.points = (looped ? [] : this.points.slice(0, 1))
        .concat(
          tripleWise(this.points, looped).flatMap(([a, b, c]) => [
            v.pointAlong(b, a, 0.25),
            v.pointAlong(b, c, 0.25),
          ])
        )
        .concat(looped ? [] : this.points.slice(this.points.length - 1))
        .slice(looped ? 1 : 0)
    }
    if (looped) this.points[0] = this.points[this.points.length - 1]
    return this
  }

  traceIn = (ctx: CanvasRenderingContext2D) => {
    const from = this.points[0]
    ctx.moveTo(...from)
    for (let point of this.points.slice(1)) {
      ctx.lineTo(...point)
    }
  }

  /**
   * @param delta Vector to move path by
   */
  moved(delta: Vector2D): SimplePath {
    return this.transformed((pt) => v.add(pt, delta))
  }

  scaled(scale: number): SimplePath {
    const c = this.centroid
    return this.transformed((p) => v.add(c, v.scale(v.subtract(p, c), scale)))
  }

  transformPoints(transform: (point: Point2D) => Point2D): SimplePath {
    this.points = this.points.map(transform)
    return this
  }

  /**
   * If points are closed loop (repeat first and last) and transform is non deterministic use this to set the last point to the (transformed) first point
   * @param transform
   * @returns
   */
  transformLoopedPoints(transform: (point: Point2D) => Point2D): SimplePath {
    this.points = this.points.map(transform)
    this.points[this.points.length - 1] = [this.points[0][0], this.points[0][1]]
    return this
  }

  get reversed(): SimplePath {
    return new SimplePath(this.points.slice().reverse())
  }

  get centroid(): Point2D {
    return centroid(this.points)
  }

  /**
   * Split the path into triangular segments, around the centroid
   */
  get segmented(): SimplePath[] {
    const c = this.centroid
    if (this.points.length < 2) throw new Error("Must have at least 2 points")
    const n = this.points.length - 1
    const paths: SimplePath[] = []
    for (let i = 0; i < n; i++) {
      paths.push(
        SimplePath.withPoints([
          this.points[i],
          this.points[i + 1],
          c,
          this.points[i],
        ])
      )
    }
    return paths
  }

  /**
   * Split the path into triangular segments, around the centroid.
   * displaced by magnitude and scaled by scale
   */
  exploded(config: { magnitude?: number; scale?: number } = {}): SimplePath[] {
    const { magnitude = 1.2, scale = 1 } = config
    const c = this.centroid
    return this.segmented.map((segment) => {
      const scaled = segment.scaled(scale)
      const displacement = v.scale(
        v.subtract(scaled.centroid, c),
        magnitude - 1.0
      )
      return scaled.moved(displacement)
    })
  }

  transformed(transform: (point: Point2D) => Point2D): SimplePath {
    return new SimplePath(this.points.map(transform))
  }

  transformLooped(transform: (point: Point2D) => Point2D): SimplePath {
    const points = this.points.map(transform)
    points[points.length - 1] = [points[0][0], points[0][1]]
    return new SimplePath(points)
  }

  withAppended(other: SimplePath): SimplePath {
    return new SimplePath(this.points.concat(other.points))
  }

  /**
   * Rotate a path about its centroid
   * @param angle radians as always
   */
  rotated(angle: number): SimplePath {
    const c = this.centroid
    return this.transformed((pt) => v.rotateAround(c, pt, angle))
  }

  subdivide(config: { m: number; n: number }): SimplePath[] {
    const l = this.points.length
    const { n, m } = config
    if (m > n || n >= l || m >= l || n < 0 || m < 0)
      throw new Error(
        "Requires two indices, ordered, each less than the total points in this path"
      )
    const p1 = [...this.points.slice(m, n + 1), this.points[m]]
    const p2 = [
      ...this.points.slice(n - 1),
      ...this.points.slice(0, m + 1),
      this.points[n],
    ]
    return [SimplePath.withPoints(p1), SimplePath.withPoints(p2)]
  }

  /**
   * Convert a simple path to a curved path
   * @param style
   */
  curvify(style: (i: number) => CurveConfig | null): Path {
    if (this.points.length < 2) throw new Error("Must have at least 2 points")
    const startAt = this.points[0]
    const path = Path.startAt(startAt)
    for (let i = 0; i < this.points.length - 1; i++) {
      const cs = style(i)
      if (cs) {
        path.addCurveTo(this.points[i + 1], cs)
      } else {
        path.addLineTo(this.points[i + 1])
      }
    }
    return path
  }

  /**
   * The total length of the path: the sum of the lengths of its segments.
   *
   * @example
   * ```ts
   * SimplePath.withPoints([[0, 0], [0.3, 0], [0.3, 0.4]]).length // 0.7
   * ```
   */
  get length(): number {
    return pairWise(this.points).reduce(
      (total, [a, b]) => total + v.distance(a, b),
      0
    )
  }

  /**
   * Which segment a proportion of the way along the path falls in, and how far
   * into that segment it is.
   */
  private locate(proportion: number): {
    from: Point2D
    to: Point2D
    t: number
  } {
    if (this.points.length === 0)
      throw new Error("Cannot sample a path with no points")
    if (this.points.length === 1)
      return { from: this.points[0], to: this.points[0], t: 0 }

    const edges = pairWise(this.points)
    const target = clamp({ from: 0, to: 1 }, proportion) * this.length

    let travelled = 0
    for (const [from, to] of edges) {
      const d = v.distance(from, to)
      // >= so a path of zero length still resolves to its first segment
      if (travelled + d >= target) {
        return { from, to, t: d === 0 ? 0 : (target - travelled) / d }
      }
      travelled += d
    }

    // only reachable through floating point drift right at the end of the path
    const [from, to] = edges[edges.length - 1]
    return { from, to, t: 1 }
  }

  /**
   * The point a given proportion of the way along the path, measured by
   * distance travelled (so evenly spaced proportions give evenly spaced
   * points, however unevenly spaced the path's own points are).
   *
   * @param proportion Where along the path, 0 is the start and 1 the end.
   * Values outside that range are clamped.
   * @throws Error if the path has no points
   * @example
   * ```ts
   * const path = SimplePath.withPoints([[0, 0], [1, 0], [1, 1]])
   * path.pointAt(0.5) // [1, 0], the halfway point by distance
   * ```
   */
  pointAt(proportion: number): Point2D {
    const { from, to, t } = this.locate(proportion)
    return v.pointAlong(from, to, t)
  }

  /**
   * The unit tangent (the direction of travel) a given proportion of the way
   * along the path. Use `v.heading` on it for the angle, e.g. to rotate
   * something to follow the path.
   *
   * A path that goes nowhere has no direction, so that gives [0, 0].
   *
   * @param proportion Where along the path, 0 is the start and 1 the end.
   * Values outside that range are clamped.
   * @throws Error if the path has no points
   * @example
   * ```ts
   * const path = SimplePath.withPoints([[0, 0], [1, 0]])
   * path.tangentAt(0.5) // [1, 0]
   * v.heading(path.tangentAt(0.5)) // 0
   * ```
   */
  tangentAt(proportion: number): Vector2D {
    const { from, to } = this.locate(proportion)
    return v.normalize(v.subtract(to, from))
  }

  /**
   * n points evenly spaced along the path by distance. Handy for scattering
   * shapes along an outline, or resampling a path with uneven points.
   *
   * @param config.n Number of points (at least 1)
   * @param config.inclusive Whether to include the end point (default: true).
   * Pass false for a closed path, where the end is the start again.
   * @throws Error if the path has no points, or fewer than one point is asked for
   * @example
   * ```ts
   * // Ten circles spread evenly along a wiggly path
   * path.pointsAlong({ n: 10 }).forEach((at) => s.fill(new Circle({ at, r: 0.01 })))
   * ```
   */
  pointsAlong(config: { n: number; inclusive?: boolean }): Point2D[] {
    return evenProportions(config).map((proportion) => this.pointAt(proportion))
  }

  get edges(): SimplePath[] {
    return pairWise(this.points).map((points) => SimplePath.withPoints(points))
  }
}

/**
 * A `SimplePath`, or anything that can produce one: `Line`, `Rect`,
 * `RegularPolygon`, `Star` and `Spiral` all expose a `path`.
 */
export type SimplePathLike = SimplePath | { path: SimplePath }

/**
 * The `SimplePath` of anything path-like.
 *
 * @example
 * ```ts
 * asSimplePath(new Star({ at: [0.5, 0.5], n: 5, r: 0.2 })).pointsAlong({ n: 20 })
 * ```
 */
export const asSimplePath = (path: SimplePathLike): SimplePath =>
  path instanceof SimplePath ? path : path.path
