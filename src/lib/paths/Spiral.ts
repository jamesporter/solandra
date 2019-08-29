import { Traceable, SimplePath } from "."
import { Point2D } from "../types/sol"
import { v } from ".."

export default class Spiral implements Traceable {
  path: SimplePath
  constructor({
    at,
    a: sA = 0,
    l,
    n,
  }: {
    at: Point2D
    a?: number
    l: number
    n: number
  }) {
    this.path = SimplePath.withPoints([])
    let a = sA
    let r = l
    this.path.addPoint(v.add(at, [r * Math.cos(a), r * Math.sin(a)]))
    for (let i = 0; i < n; i++) {
      const dA = 2 * Math.asin(l / (r * 2))
      r += 0.005 * dA
      a += dA
      this.path.addPoint(v.add(at, [r * Math.cos(a), r * Math.sin(a)]))
    }
  }

  traceIn(ctx: CanvasRenderingContext2D) {
    this.path.traceIn(ctx)
  }
}
