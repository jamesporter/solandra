import { Point2D } from "../types/sol"
import { Traceable, SimplePath } from "."
import { traceSimplePath } from "./pathUtil"
export default class Star implements Traceable {
  constructor(
    private config: {
      at: Point2D
      n: number
      r: number
      r2?: number
      a?: number
    }
  ) {
    if (this.config.n < 3)
      throw new Error(
        `Must have at least 3 points, n was set to ${this.config.n}`
      )
  }
  traceIn = (ctx: CanvasRenderingContext2D) => {
    let {
      at: [x, y],
      n,
      r,
      a: startAngle = 0,
      r2,
    } = this.config
    // Start from top... feels more natural?
    startAngle -= Math.PI / 2
    r2 || (r2 = r / 2)
    const dA = (Math.PI * 2) / n
    ctx.moveTo(x + r * Math.cos(startAngle), y + r * Math.sin(startAngle))
    for (let i = 1; i < n; i++) {
      ctx.lineTo(
        x + r2 * Math.cos(startAngle + (i - 0.5) * dA),
        y + r2 * Math.sin(startAngle + (i - 0.5) * dA)
      )
      ctx.lineTo(
        x + r * Math.cos(startAngle + i * dA),
        y + r * Math.sin(startAngle + i * dA)
      )
    }
    ctx.lineTo(
      x + r2 * Math.cos(startAngle + -0.5 * dA),
      y + r2 * Math.sin(startAngle + -0.5 * dA)
    )
    ctx.lineTo(x + r * Math.cos(startAngle), y + r * Math.sin(startAngle))
  }
  get path(): SimplePath {
    return traceSimplePath(this)
  }
}
