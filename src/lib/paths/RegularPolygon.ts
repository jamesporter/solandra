import { Traceable } from "."
import { Point2D } from "../types/sol"
import { traceSimplePath } from "./pathUtil"
import { SimplePath } from "./SimplePath"

export class RegularPolygon implements Traceable {
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

export class Hexagon extends RegularPolygon {
  constructor({
    at,
    r,
    vertical = true,
  }: {
    at: Point2D
    r: number
    vertical?: boolean
  }) {
    super({
      at,
      r,
      n: 6,
      a: vertical ? 0 : Math.PI / 6,
    })
  }
}

export class EquilateralTriangle extends RegularPolygon {
  constructor({
    at,
    s,
    flipped,
  }: {
    at: Point2D
    s: number
    flipped: boolean
  }) {
    super({
      at,
      r: s / (2 * Math.sin(Math.PI / 3)),
      n: 3,
      a: flipped ? Math.PI : 0,
    })
  }
}
