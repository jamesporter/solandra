import { Traceable } from "./index.js"
import { Point2D, Vector2D } from "../types/sol.js"
import { v } from "../index.js"
import { SimplePath } from "./SimplePath.js"

export class Line implements Traceable {
  constructor(
    private a: Point2D,
    private b: Point2D
  ) {}

  /**
   * @param delta Vector to move path by
   */
  moved(delta: Vector2D): Line {
    return new Line(v.add(this.a, delta), v.add(this.b, delta))
  }

  traceIn = (ctx: CanvasRenderingContext2D) => {
    ctx.moveTo(...this.a)
    ctx.lineTo(...this.b)
  }

  get path(): SimplePath {
    return new SimplePath([this.a, this.b])
  }
}
