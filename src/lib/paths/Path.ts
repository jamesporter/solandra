import { Traceable } from "."
import { Point2D, Vector2D } from "../types/sol"
import { v } from ".."
import { centroid } from "../util"

type PathEdge =
  | { kind: "line"; from: Point2D; to: Point2D }
  | {
      kind: "cubic"
      from: Point2D
      to: Point2D
      control1: Point2D
      control2: Point2D
    }

export type CurveConfig = {
  polarlity?: 1 | -1
  curveSize?: number
  curveAngle?: number
  bulbousness?: number
  twist?: number
}

export class Path implements Traceable {
  private currentPoint: Point2D
  private edges: PathEdge[] = []

  private constructor(startPoint: Point2D) {
    this.currentPoint = startPoint
  }

  static startAt(point: Point2D): Path {
    return new Path(point)
  }

  /**
   * Add a line to a point
   */
  addLineTo = (point: Point2D): Path => {
    this.edges.push({
      kind: "line",
      from: this.currentPoint,
      to: point,
    })
    this.currentPoint = point
    return this
  }

  /**
   * Add a curve
   */
  addCurve = (config: CurveConfig & { to: Point2D }): Path => {
    const { to, ...other } = config
    return this.addCurveTo(to, other)
  }

  /**
   * Adds a curve to a point
   * with optional configuration
   *
   * Admittedly this is inconsistent with APIs elsewhere (where typically config
   * goes first) but I found in practice this is nice. addCurve is also available
   * and more consistent.
   */
  addCurveTo = (point: Point2D, config: CurveConfig = {}): Path => {
    const {
      curveSize = 1,
      polarlity = 1,
      bulbousness = 1,
      curveAngle = 0,
      twist = 0,
    } = config

    const u = v.subtract(point, this.currentPoint)
    const d = v.magnitude(u)
    const m = v.add(this.currentPoint, v.scale(u, 0.5))
    const perp = v.normalize(v.rotate(u, -Math.PI / 2))
    const rotatedPerp = v.rotate(perp, curveAngle)
    const controlMid = v.add(
      m,
      v.scale(rotatedPerp, curveSize * polarlity * d * 0.5)
    )
    const perpOfRot = v.normalize(v.rotate(rotatedPerp, -Math.PI / 2 - twist))

    const control1 = v.add(
      controlMid,
      v.scale(perpOfRot, (bulbousness * d) / 2)
    )
    const control2 = v.add(
      controlMid,
      v.scale(perpOfRot, (-bulbousness * d) / 2)
    )

    this.edges.push({
      kind: "cubic",
      control1,
      control2,
      to: point,
      from: this.currentPoint,
    })
    this.currentPoint = point
    return this
  }

  /**
   * @param delta Vector to move path by
   */
  moved(delta: Vector2D): Path {
    return this.transformed((pt) => v.add(pt, delta))
  }

  /**
   * Scale a path around its (vertex-wise) centroid
   * @param scale
   */
  scaled(scale: number): Path {
    const c = this.centroid
    return this.transformed((p) => v.add(c, v.scale(v.subtract(p, c), scale)))
  }

  get reversed(): Path {
    const newPath = new Path(this.currentPoint)
    const newEdges = this.edges.map((e: PathEdge): PathEdge => {
      switch (e.kind) {
        case "line":
          return { kind: "line", from: e.to, to: e.from }
        case "cubic":
          return {
            kind: "cubic",
            from: e.to,
            to: e.from,
            control1: e.control2,
            control2: e.control1,
          }
      }
    })
    newPath.edges = newEdges
    return newPath
  }

  /**
   * Vertex-wise centroid
   */
  get centroid(): Point2D {
    return centroid(this.edges.map((e) => e.from))
  }

  /**
   * Split the path into triangular segments, around the centroid
   */
  get segmented(): Path[] {
    const c = this.centroid
    if (this.edges.length < 2) throw new Error("Must have at least 2 edges")
    const n = this.edges.length
    const paths: Path[] = []
    for (let e of this.edges) {
      const newPath = new Path(e.to)
      newPath.edges = [e]
      newPath.addLineTo(c)
      newPath.addLineTo(e.from)
      paths.push(newPath)
    }
    return paths
  }

  /**
   * Split the path into triangular segments, around the centroid.
   * displaced by magnitude and scaled by scale
   */
  exploded(config: { magnitude?: number; scale?: number } = {}): Path[] {
    const { magnitude = 1.2, scale = 1 } = config
    const c = this.centroid
    if (this.edges.length < 2) throw new Error("Must have at least 2 edges")
    const paths: Path[] = []
    for (let e of this.edges) {
      const newPath = new Path(e.to)
      newPath.edges = [e]
      newPath.addLineTo(c)
      newPath.addLineTo(e.from)
      const snp = newPath.scaled(scale)
      const npc = snp.centroid
      const displacement = v.scale(v.subtract(npc, c), magnitude - 1.0)
      paths.push(snp.moved(displacement))
    }
    return paths
  }

  /**
   * A new path transforming the current one in a pointwise manner
   * @param transform
   */
  transformed(transform: (point: Point2D) => Point2D): Path {
    const newPath = new Path(this.currentPoint)

    newPath.edges = this.edges.map((e): PathEdge => {
      switch (e.kind) {
        case "cubic":
          return {
            kind: "cubic",
            from: transform(e.from),
            to: transform(e.to),
            control1: transform(e.control1),
            control2: transform(e.control2),
          }
        case "line":
          return {
            kind: "line",
            from: transform(e.from),
            to: transform(e.to),
          }
      }
    })
    return newPath
  }

  transformedLooped(transform: (point: Point2D) => Point2D): Path {
    const newPath = this.transformed(transform)

    const lastEdge = newPath.edges[newPath.edges.length - 1]
    const firstEdge = newPath.edges[0]

    // ensure loops even if transform were non deterministic
    lastEdge.to = [...firstEdge.from]

    return newPath
  }

  /**
   * Rotate a path about its vertex-wise centroid
   * @param angle radians as alway
   */
  rotated(angle: number): Path {
    const c = this.centroid
    const [cX, cY] = c
    return this.transformed((pt) => {
      const [dX, dY] = v.subtract(pt, c)
      return [
        cX + Math.cos(angle) * dX - Math.sin(angle) * dY,
        cY + Math.sin(angle) * dX + Math.cos(angle) * dY,
      ]
    })
  }

  /**
   * Split a path into two, supply a curve configuration to split with a curve
   * otherwise will be split with a straight line.
   * @param config
   */
  subdivide(config: { m: number; n: number; curve?: CurveConfig }): Path[] {
    const l = this.edges.length
    const { n, m } = config
    if (m > n || n >= l || m >= l || n < 0 || m < 0)
      new Error(
        "Requires two indices, ordered, each less than the total edges in this path"
      )
    const es1 = this.edges.slice(m, n)
    const es2 = [...this.edges.slice(n), ...this.edges.slice(0, m)]

    if (config.curve) {
      const path1 = new Path(es1[es1.length - 1].to)
      const path2 = new Path(es2[es2.length - 1].to)

      path1.edges = es1
      path2.edges = es2

      const polarlity: 1 | -1 = (config.curve && config.curve.polarlity) || 1

      path1.addCurveTo(es1[0].from, config.curve)
      path2.addCurveTo(es2[0].from, {
        ...config.curve,
        polarlity: -polarlity as 1 | -1,
      })

      return [path1, path2]
    } else {
      es1.push({ to: es1[0].from, from: es1[es1.length - 1].to, kind: "line" })
      es2.push({ from: es1[0].from, to: es1[es1.length - 1].to, kind: "line" })
      const path1 = new Path(es1[es1.length - 1].to)
      path1.edges = es1
      const path2 = new Path(es2[es2.length - 1].to)
      path2.edges = es2

      return [path1, path2]
    }
  }

  traceIn = (ctx: CanvasRenderingContext2D) => {
    const { from } = this.edges[0]
    ctx.moveTo(...from)
    for (let edge of this.edges) {
      switch (edge.kind) {
        case "line":
          ctx.lineTo(...edge.to)
          break
        case "cubic": {
          const { to, control1, control2 } = edge
          ctx.bezierCurveTo(
            control1[0],
            control1[1],
            control2[0],
            control2[1],
            to[0],
            to[1]
          )
          break
        }
      }
    }
  }
}
