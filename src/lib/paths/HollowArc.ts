import { Point2D } from "../types/sol"
import { Traceable } from "./index"
export class HollowArc implements Traceable {
  readonly cX: number
  readonly cY: number
  readonly radius: number
  readonly innerRadius: number
  readonly startAngle: number
  readonly endAngle: number
  readonly antiClockwise: boolean
  constructor(config: {
    at: Point2D
    r: number
    r2: number
    a: number
    a2: number
  }) {
    const {
      at: [cX, cY],
      r,
      r2,
      a,
      a2,
    } = config
    const antiClockwise = a > a2
    this.cX = cX
    this.cY = cY
    this.radius = r
    this.innerRadius = r2
    this.startAngle = a
    this.endAngle = a2
    this.antiClockwise = antiClockwise
  }
  traceIn = (ctx: CanvasRenderingContext2D) => {
    ctx.moveTo(
      this.cX + this.innerRadius * Math.cos(this.startAngle),
      this.cY + this.innerRadius * Math.sin(this.startAngle)
    )
    ctx.lineTo(
      this.cX + this.radius * Math.cos(this.startAngle),
      this.cY + this.radius * Math.sin(this.startAngle)
    )
    ctx.arc(
      this.cX,
      this.cY,
      this.radius,
      this.startAngle,
      this.endAngle,
      this.antiClockwise
    )
    ctx.lineTo(
      this.cX + this.innerRadius * Math.cos(this.endAngle),
      this.cY + this.innerRadius * Math.sin(this.endAngle)
    )
    ctx.arc(
      this.cX,
      this.cY,
      this.innerRadius,
      this.endAngle,
      this.startAngle,
      !this.antiClockwise
    )
  }
}
