import { Traceable } from "./index.js"
import { Point2D } from "../types/sol.js"
import { regularPolygonPoints } from "./pathUtil.js"
import { SimplePath } from "./SimplePath.js"

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
    this.path.traceIn(ctx)
  }

  get path(): SimplePath {
    return SimplePath.withPoints(regularPolygonPoints(this.config)).close()
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
