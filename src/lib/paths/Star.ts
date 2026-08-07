import { Point2D } from "../types/sol.js"
import { Traceable } from "./index.js"
import { regularPolygonPoints } from "./pathUtil.js"
import { SimplePath } from "./SimplePath.js"

export class Star implements Traceable {
  constructor(
    private config: {
      at: Point2D
      n: number
      r: number
      r2?: number
      a?: number
    }
  ) {
    if (this.config.n < 3)
      throw new Error(
        `Must have at least 3 points, n was set to ${this.config.n}`
      )
  }

  traceIn = (ctx: CanvasRenderingContext2D) => {
    this.path.traceIn(ctx)
  }

  get path(): SimplePath {
    const { at, n, r, a = 0, r2 = r / 2 } = this.config
    // the inner points sit half a segment round from the outer ones
    const outer = regularPolygonPoints({ at, n, r, a })
    const inner = regularPolygonPoints({
      at,
      n,
      r: r2,
      a: a + Math.PI / n,
    })

    return SimplePath.withPoints(
      outer.flatMap((point, i): Point2D[] => [point, inner[i]])
    ).close()
  }
}
