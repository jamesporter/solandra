import { Point2D } from "../types/sol"
import { Traceable } from "./index"
import { SimplePath } from "./SimplePath"
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
      align?: "center" | "topLeft"
    }
  ) {}
  traceIn = (ctx: CanvasRenderingContext2D) => {
    const { at, w: width, h: height, align = "center" } = this.config
    const [cX, cY] =
      align === "center" ? at : [at[0] + width / 2, at[1] + height / 2]
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
    const { at, w: width, h: height, align = "center" } = this.config
    const [cX, cY] =
      align === "center" ? at : [at[0] + width / 2, at[1] + height / 2]

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
