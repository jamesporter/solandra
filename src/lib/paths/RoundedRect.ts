import { Point2D } from "../types/sol.js"
import { Traceable } from "./index.js"
import { SimplePath } from "./SimplePath.js"
import { Align, boxTopLeft, sampleQuadraticBezier } from "./pathUtil.js"
export class RoundedRect implements Traceable {
  readonly at: Point2D
  readonly w: number
  readonly h: number
  readonly r: number

  constructor(config: {
    at: Point2D
    w: number
    h: number
    r: number
    align?: Align
  }) {
    this.at = boxTopLeft(config)
    this.w = config.w
    this.h = config.h
    this.r = config.r
  }

  /** Corner radius, never more than half the shortest side */
  private get cornerRadius(): number {
    return Math.min(this.r, this.h / 2, this.w / 2)
  }

  /**
   * The four rounded corners, clockwise from the top left, each as the point
   * the straight edge before it ends at, the corner it curves around, and the
   * point the next straight edge starts from.
   */
  private get corners(): {
    start: Point2D
    control: Point2D
    end: Point2D
  }[] {
    const r = this.cornerRadius
    const [x1, y1] = this.at
    const x2 = x1 + this.w
    const y2 = y1 + this.h

    return [
      { start: [x2 - r, y1], control: [x2, y1], end: [x2, y1 + r] },
      { start: [x2, y2 - r], control: [x2, y2], end: [x2 - r, y2] },
      { start: [x1 + r, y2], control: [x1, y2], end: [x1, y2 - r] },
      { start: [x1, y1 + r], control: [x1, y1], end: [x1 + r, y1] },
    ]
  }

  traceIn = (ctx: CanvasRenderingContext2D) => {
    const [x1, y1] = this.at
    ctx.moveTo(x1 + this.cornerRadius, y1)
    for (const { start, control, end } of this.corners) {
      ctx.lineTo(...start)
      ctx.quadraticCurveTo(control[0], control[1], end[0], end[1])
    }
  }

  toPath(detail: number): SimplePath {
    const d = Math.max(0, Math.floor(detail))
    const r = this.cornerRadius
    const [x1, y1] = this.at
    const x2 = x1 + this.w
    const y2 = y1 + this.h

    if (d === 0 || r === 0) {
      // Return simple rectangle
      return SimplePath.withPoints([
        [x1, y1],
        [x2, y1],
        [x2, y2],
        [x1, y2],
      ]).close()
    }

    const points: Point2D[] = [[x1 + r, y1]]
    for (const corner of this.corners) {
      // the straight edge up to the corner, then the corner itself
      points.push(
        corner.start,
        ...sampleQuadraticBezier({ ...corner, detail: d })
      )
    }

    return SimplePath.withPoints(points).close()
  }
}
