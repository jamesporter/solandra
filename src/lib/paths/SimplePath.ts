import { Traceable } from "./index.js"
import { Point2D, Vector2D } from "../types/sol.js"
import { tripleWise, pairWise } from "../collectionOps.js"
import v from "../vectors.js"
import { centroid, clamp, convexHull, evenProportions } from "../util.js"

import { CurveConfig, Path } from "./Path.js"

export class SimplePath implements Traceable {
  constructor(public points: Point2D[] = []) {}

  static startAt(point: Point2D): SimplePath {
    return new SimplePath([point])
  }

  static withPoints(points: Point2D[]): SimplePath {
    return new SimplePath(points)
  }

  /**
   * Traces a path through a vector field, starting at a point and repeatedly
   * stepping in whatever direction the field points in there.
   *
   * The field is sampled for direction only (the vector is normalized), so
   * every step is the same length however strong the field is, and any
   * function of a point will do: `curl2` noise, the tangent of another path,
   * the pull towards an attractor. Where the field has no direction at all
   * (the zero vector) the path can go no further, so it stops there.
   *
   * @param config - Configuration
   * @param config.from - Where to start
   * @param config.field - The field: given a point, the direction to head in
   * @param config.n - How many steps to take (default: 100), so the path has
   * up to n + 1 points
   * @param config.step - How far to move each step (default: 0.01)
   * @param config.until - Optional stopping condition, called with each new
   * point and its index; the path ends as soon as it returns true. Handy for
   * stopping at the edge of the canvas, e.g. `(at) => !s.inDrawing(at)`.
   * @throws Error if a negative number of steps is asked for
   * @example
   * ```ts
   * // Curling streamers of noise
   * s.times(40, () => {
   *   s.draw(
   *     SimplePath.flowLine({
   *       from: s.randomPoint(),
   *       field: ([x, y]) => curl2(x * 3, y * 3),
   *       n: 150,
   *       step: 0.005,
   *       until: (at) => !s.inDrawing(at),
   *     })
   *   )
   * })
   *
   * // Any field will do: this one circles an attractor
   * SimplePath.flowLine({
   *   from: [0.5, 0.2],
   *   field: (at) => v.rotate(v.subtract([0.5, 0.5], at), Math.PI / 2),
   * })
   * ```
   */
  static flowLine(config: {
    from: Point2D
    field: (at: Point2D) => Vector2D
    n?: number
    step?: number
    until?: (at: Point2D, i: number) => boolean
  }): SimplePath {
    const { from, field, n = 100, step = 0.01, until } = config
    if (n < 0) throw new Error(`Cannot take ${n} steps, n must not be negative`)

    const points: Point2D[] = [from]
    let at = from

    for (let i = 0; i < n; i++) {
      const direction = v.normalize(field(at))
      // nowhere to go: a zero vector has no direction to follow
      if (direction[0] === 0 && direction[1] === 0) break
      at = v.add(at, v.scale(direction, step))
      points.push(at)
      if (until?.(at, i)) break
    }

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

  /**
   * The smallest axis aligned box containing every point of the path, in the
   * form a `Rect` takes, so `new Rect(path.boundingBox)` is the box itself.
   *
   * @throws Error if the path has no points
   * @example
   * ```ts
   * const path = SimplePath.withPoints([[0.2, 0.3], [0.6, 0.1], [0.4, 0.9]])
   * path.boundingBox // { at: [0.2, 0.1], w: 0.4, h: 0.8 }
   *
   * // Outline whatever was drawn
   * s.draw(new Rect(path.boundingBox))
   * ```
   */
  get boundingBox(): { at: Point2D; w: number; h: number } {
    if (this.points.length === 0)
      throw new Error("Cannot take the bounding box of a path with no points")

    let [minX, minY] = this.points[0]
    let [maxX, maxY] = this.points[0]
    for (const [x, y] of this.points) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }

    return { at: [minX, minY], w: maxX - minX, h: maxY - minY }
  }

  /**
   * The area the path encloses, taking it as closed (the last point joined
   * back to the first, whether or not `close` was called).
   *
   * Always positive, whichever way round the points go. A path that crosses
   * itself has no one sensible area; the parts it winds around in opposite
   * directions cancel out.
   *
   * @example
   * ```ts
   * SimplePath.withPoints([[0, 0], [1, 0], [1, 1], [0, 1]]).area // 1
   * ```
   */
  get area(): number {
    const n = this.points.length
    if (n < 3) return 0

    // the shoelace formula, over every edge including the closing one
    let total = 0
    for (let i = 0; i < n; i++) {
      const [x1, y1] = this.points[i]
      const [x2, y2] = this.points[(i + 1) % n]
      total += x1 * y2 - x2 * y1
    }
    return Math.abs(total) / 2
  }

  /**
   * Whether a point falls inside the path, taking it as closed (as `area`
   * does). Use it to scatter things within an outline, or to decide what a
   * shape has caught.
   *
   * Points exactly on the outline may land either way, as floating point
   * arithmetic decides; that is unavoidable, and rarely matters when the
   * points being tested are random.
   *
   * @param point - The point to test
   * @example
   * ```ts
   * const square = SimplePath.withPoints([[0, 0], [1, 0], [1, 1], [0, 1]])
   * square.containsPoint([0.5, 0.5]) // true
   * square.containsPoint([1.5, 0.5]) // false
   *
   * // Fill a shape with dots
   * s.times(200, () => {
   *   const at = s.randomPoint()
   *   if (outline.containsPoint(at)) s.fill(new Circle({ at, r: 0.005 }))
   * })
   * ```
   */
  containsPoint([x, y]: Point2D): boolean {
    const n = this.points.length
    if (n < 3) return false

    // cast a ray to the right and count the edges it crosses: an odd number
    // means the point started inside
    let inside = false
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const [xI, yI] = this.points[i]
      const [xJ, yJ] = this.points[j]

      if (yI > y !== yJ > y && x < ((xJ - xI) * (y - yI)) / (yJ - yI) + xI) {
        inside = !inside
      }
    }
    return inside
  }

  /**
   * A copy of the path with the points that barely change its shape dropped
   * (the Ramer-Douglas-Peucker algorithm): every point left out lies within
   * `tolerance` of the simplified line.
   *
   * Chaikin smoothing, tracing a flow field or sampling a curve all give paths
   * with far more points than their shape needs. Thinning them out first keeps
   * later work (and exported SVG) manageable, and a heavy tolerance is an
   * effect in its own right, faceting a smooth curve.
   *
   * @param config - Configuration
   * @param config.tolerance - How far a point may sit from the simplified line
   * before it has to be kept (default: 0.01, so 1% of the canvas width)
   * @throws Error if a negative tolerance is given
   * @example
   * ```ts
   * const wiggly = SimplePath.withPoints(points).chaiken({ n: 4 })
   * wiggly.simplified({ tolerance: 0.002 }) // same shape, fewer points
   * wiggly.simplified({ tolerance: 0.05 }) // angular, faceted version
   * ```
   */
  simplified(config: { tolerance?: number } = {}): SimplePath {
    const { tolerance = 0.01 } = config
    if (tolerance < 0)
      throw new Error(`Tolerance must not be negative, was ${tolerance}`)
    if (this.points.length < 3) return new SimplePath(this.points.slice())

    const keep = (from: number, to: number): Point2D[] => {
      const a = this.points[from]
      const b = this.points[to]
      const line = v.subtract(b, a)
      const length = v.magnitude(line)

      let worst = 0
      let worstAt = from

      for (let i = from + 1; i < to; i++) {
        const offset = v.subtract(this.points[i], a)
        // where the line has no length every point is measured from its start
        const d =
          length === 0
            ? v.magnitude(offset)
            : Math.abs(v.cross(line, offset)) / length
        if (d > worst) {
          worst = d
          worstAt = i
        }
      }

      // nothing in between strays far enough to be worth keeping
      if (worst <= tolerance) return [a]
      return keep(from, worstAt).concat(keep(worstAt, to))
    }

    const points = keep(0, this.points.length - 1)
    points.push(this.points[this.points.length - 1])
    return new SimplePath(points)
  }

  /**
   * The convex hull of the path's points, as a closed path: the smallest
   * convex shape containing the whole path, as if a rubber band were stretched
   * around it.
   *
   * @throws Error if the path has no points
   * @example
   * ```ts
   * // Wrap a scattered cloud of points
   * const cloud = SimplePath.withPoints(s.build(s.times, 30, () => s.randomPoint()))
   * s.setFillColor(200, 60, 60, 0.3)
   * s.fill(cloud.convexHull)
   * ```
   */
  get convexHull(): SimplePath {
    if (this.points.length === 0)
      throw new Error("Cannot take the convex hull of a path with no points")
    return SimplePath.withPoints(convexHull(this.points)).close()
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
