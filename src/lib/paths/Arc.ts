import { Point2D } from "../types/sol.js"
import { Traceable } from "./index.js"
import { sampleArc } from "./pathUtil.js"
import { SimplePath } from "./SimplePath.js"
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
    this.cX = cX
    this.cY = cY
    this.radius = r
    this.startAngle = a
    this.endAngle = a2
    this.antiClockwise = a > a2
  }

  /** Centre of the circle the arc is part of */
  get center(): Point2D {
    return [this.cX, this.cY]
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
    if (this.startAngle - this.endAngle > 0.0001) ctx.lineTo(this.cX, this.cY)
  }

  toPath(detail: number): SimplePath {
    const points = sampleArc({
      center: this.center,
      radius: this.radius,
      startAngle: this.startAngle,
      endAngle: this.endAngle,
      detail: Math.max(0, Math.floor(detail)),
      antiClockwise: this.antiClockwise,
    })
    return SimplePath.withPoints([this.center, ...points]).close()
  }
}
