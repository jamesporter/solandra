import { Traceable, SimplePath } from "."
import { Point2D } from "../types/sol"
import { traceSimplePath } from "./pathUtil"

export default class RegularPolygon implements Traceable {
  constructor(
    private config: {
      at: Point2D
      n: number
      r: number
      a?: number
    }
  ) {
    if (this.config.n < 3)
      throw new Error(
        `Must have at least 3 sides, n was set to ${this.config.n}`
      )
  }

  traceIn = (ctx: CanvasRenderingContext2D) => {
    let {
      at: [x, y],
      n,
      r,
      a: startAngle = 0,
    } = this.config
    // Start from top... feels more natural?
    startAngle -= Math.PI / 2
    const dA = (Math.PI * 2) / n
    ctx.moveTo(x + r * Math.cos(startAngle), y + r * Math.sin(startAngle))
    for (let i = 1; i < n; i++) {
      ctx.lineTo(
        x + r * Math.cos(startAngle + i * dA),
        y + r * Math.sin(startAngle + i * dA)
      )
    }
    ctx.lineTo(x + r * Math.cos(startAngle), y + r * Math.sin(startAngle))
  }

  get path(): SimplePath {
    return traceSimplePath(this)
  }
}
