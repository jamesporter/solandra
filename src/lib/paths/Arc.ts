import { Point2D } from "../types/sol"
import { Traceable } from "./index"
export class Arc implements Traceable {
  readonly cX: number
  readonly cY: number
  readonly radius: number
  readonly startAngle: number
  readonly endAngle: number
  readonly antiClockwise: boolean
  constructor(config: { at: Point2D; r: number; a: number; a2: number }) {
    const {
      at: [cX, cY],
      r,
      a,
      a2,
    } = config
    const antiClockwise = a > a2
    this.cX = cX
    this.cY = cY
    this.radius = r
    this.startAngle = a
    this.endAngle = a2
    this.antiClockwise = antiClockwise
  }
  traceIn = (ctx: CanvasRenderingContext2D) => {
    if (Math.abs(this.startAngle - this.endAngle) > 0.0001)
      ctx.moveTo(this.cX, this.cY)
    ctx.arc(
      this.cX,
      this.cY,
      this.radius,
      this.startAngle,
      this.endAngle,
      this.antiClockwise
    )
    if (this.startAngle - this.endAngle > 0.0001) ctx.lineTo(this.cX, this.cX)
  }
}
