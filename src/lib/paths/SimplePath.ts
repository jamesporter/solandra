import { Traceable, Path } from "."
import { Point2D, Vector2D } from "../types/sol"
import { tripleWise, pairWise } from "../collectionOps"
import { v } from ".."
import { centroid } from "../util"
import { CurveConfig } from "./Path"

export default class SimplePath implements Traceable {
  private constructor(public points: Point2D[] = []) {}

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
    n: number
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
    return this.transformed(pt => v.add(pt, delta))
  }

  scaled(scale: number): SimplePath {
    const c = this.centroid
    return this.transformed(p => v.add(c, v.scale(v.subtract(p, c), scale)))
  }

  /**
   * Warning mutates
   * @param delta Vector to move path by
   */
  transformPoints(transform: (point: Point2D) => Point2D): SimplePath {
    this.points = this.points.map(transform)
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
    if (this.points.length < 2) throw new Error("Must have at least 2 points")
    const n = this.points.length - 1
    const paths: SimplePath[] = []
    for (let i = 0; i < n; i++) {
      const newPath = SimplePath.withPoints([
        this.points[i],
        this.points[i + 1],
        c,
        this.points[i],
      ]).scaled(scale)
      const npc = newPath.centroid
      const displacement = v.scale(v.subtract(npc, c), magnitude - 1.0)
      paths.push(newPath.moved(displacement))
    }
    return paths
  }

  transformed(transform: (point: Point2D) => Point2D): SimplePath {
    return new SimplePath(this.points.map(transform))
  }

  withAppended(other: SimplePath): SimplePath {
    return new SimplePath(this.points.concat(other.points))
  }

  rotated(angle: number): SimplePath {
    const c = this.centroid
    const [cX, cY] = c
    return this.transformed(pt => {
      const [dX, dY] = v.subtract(pt, c)
      return [
        cX + Math.cos(angle) * dX - Math.sin(angle) * dY,
        cY + Math.sin(angle) * dX + Math.cos(angle) * dY,
      ]
    })
  }

  subdivide(config: { m: number; n: number }): SimplePath[] {
    const l = this.points.length
    const { n, m } = config
    if (m > n || n >= l || m >= l || n < 0 || m < 0)
      new Error(
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

  get edges(): SimplePath[] {
    return pairWise(this.points).map(SimplePath.withPoints)
  }
}
