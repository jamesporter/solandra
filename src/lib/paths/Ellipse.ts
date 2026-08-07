import { Point2D } from "../types/sol.js"
import { Traceable } from "./index.js"
import { Align, boxCenter } from "./pathUtil.js"
import { SimplePath } from "./SimplePath.js"
/**
 * Technically you can't do ellipses/circles properly with cubic beziers, but you can come very, very close
 *
 * Uses 4 point, cubic beziers, approximation of (4/3)*tan(pi/8) for control points
 *
 * https://stackoverflow.com/questions/1734745/how-to-create-circle-with-bézier-curves
 */
export class Ellipse implements Traceable {
  constructor(
    protected config: {
      at: Point2D
      w: number
      h: number
      align?: Align
    }
  ) {}

  /** Centre of the ellipse, however it was specified */
  private get center(): Point2D {
    return boxCenter(this.config)
  }

  traceIn = (ctx: CanvasRenderingContext2D) => {
    const { w: width, h: height } = this.config
    const [cX, cY] = this.center
    const a = (4 / 3) * Math.tan(Math.PI / 8)
    ctx.moveTo(cX, cY - height / 2)
    ctx.bezierCurveTo(
      cX + (a * width) / 2,
      cY - height / 2,
      cX + width / 2,
      cY - (a * height) / 2,
      cX + width / 2,
      cY
    )
    ctx.bezierCurveTo(
      cX + width / 2,
      cY + (a * height) / 2,
      cX + (a * width) / 2,
      cY + height / 2,
      cX,
      cY + height / 2
    )
    ctx.bezierCurveTo(
      cX - (a * width) / 2,
      cY + height / 2,
      cX - width / 2,
      cY + (a * height) / 2,
      cX - width / 2,
      cY
    )
    ctx.bezierCurveTo(
      cX - width / 2,
      cY - (a * height) / 2,
      cX - (a * width) / 2,
      cY - height / 2,
      cX,
      cY - height / 2
    )
  }

  toPath(detail: number): SimplePath {
    const d = Math.max(0, Math.floor(detail))
    const { w: width, h: height } = this.config
    const [cX, cY] = this.center

    if (d === 0) {
      // Return 4-point diamond approximation
      return SimplePath.withPoints([
        [cX, cY - height / 2],
        [cX + width / 2, cY],
        [cX, cY + height / 2],
        [cX - width / 2, cY],
      ]).close()
    }

    // Sample points around the ellipse
    const pointsPerQuadrant = Math.max(1, Math.ceil((d + 1) / 4))
    const totalSegments = pointsPerQuadrant * 4
    const points: Point2D[] = []

    for (let i = 0; i < totalSegments; i++) {
      const angle = (2 * Math.PI * i) / totalSegments
      points.push([
        cX + (width / 2) * Math.cos(angle),
        cY + (height / 2) * Math.sin(angle),
      ])
    }

    return SimplePath.withPoints(points).close()
  }
}
