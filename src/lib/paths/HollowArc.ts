import { Point2D } from "../types/sol.js"
import { Traceable } from "./index.js"
import { SimplePath } from "./SimplePath.js"
import { sampleArc } from "./pathUtil.js"
import { polarToCartesian } from "../vectors.js"
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
    this.cX = cX
    this.cY = cY
    this.radius = r
    this.innerRadius = r2
    this.startAngle = a
    this.endAngle = a2
    this.antiClockwise = a > a2
  }

  /** Centre of the circles the arc is between */
  get center(): Point2D {
    return [this.cX, this.cY]
  }

  /** A point at the given radius and angle from the centre */
  private at(radius: number, angle: number): Point2D {
    return polarToCartesian(this.center, radius, angle)
  }

  traceIn = (ctx: CanvasRenderingContext2D) => {
    ctx.moveTo(...this.at(this.innerRadius, this.startAngle))
    ctx.lineTo(...this.at(this.radius, this.startAngle))
    ctx.arc(
      this.cX,
      this.cY,
      this.radius,
      this.startAngle,
      this.endAngle,
      this.antiClockwise
    )
    ctx.lineTo(...this.at(this.innerRadius, this.endAngle))
    ctx.arc(
      this.cX,
      this.cY,
      this.innerRadius,
      this.endAngle,
      this.startAngle,
      !this.antiClockwise
    )
  }

  toPath(detail: number): SimplePath {
    const d = Math.max(0, Math.floor(detail))

    const outerPoints = sampleArc({
      center: this.center,
      radius: this.radius,
      startAngle: this.startAngle,
      endAngle: this.endAngle,
      detail: d,
      antiClockwise: this.antiClockwise,
    })

    // back round the inside, in the opposite direction
    const innerPoints = sampleArc({
      center: this.center,
      radius: this.innerRadius,
      startAngle: this.endAngle,
      endAngle: this.startAngle,
      detail: d,
      antiClockwise: !this.antiClockwise,
    })

    return SimplePath.withPoints([
      this.at(this.innerRadius, this.startAngle),
      ...outerPoints,
      ...innerPoints,
    ]).close()
  }
}
