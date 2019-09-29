import { Point2D } from "../types/sol"
import { Traceable } from "./index"
import { v } from ".."
export default class RoundedRect implements Traceable {
  readonly at: Point2D
  readonly w: number
  readonly h: number
  readonly r: number

  constructor(config: {
    at: Point2D
    w: number
    h: number
    r: number
    align?: "topLeft" | "center"
  }) {
    const { at, w, h, r, align = "topLeft" } = config
    this.at = align === "topLeft" ? at : v.subtract(at, [w / 2, h / 2])
    this.w = w
    this.h = h
    this.r = r
  }

  traceIn = (ctx: CanvasRenderingContext2D) => {
    const r = Math.min(this.r, this.h / 2, this.w / 2)
    const [x1, y1] = this.at
    const x2 = x1 + this.w
    const y2 = y1 + this.h
    ctx.moveTo(x1 + r, y1)
    ctx.lineTo(x2 - r, y1)
    ctx.quadraticCurveTo(x2, y1, x2, y1 + r)
    ctx.lineTo(x2, y2 - r)
    ctx.quadraticCurveTo(x2, y2, x2 - r, y2)
    ctx.lineTo(x1 + r, y2)
    ctx.quadraticCurveTo(x1, y2, x1, y2 - r)
    ctx.lineTo(x1, y1 + r)
    ctx.quadraticCurveTo(x1, y1, x1 + r, y1)
  }
}
