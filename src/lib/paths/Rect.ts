import { Point2D } from "../types/sol.js"
import { Traceable } from "./index.js"
import { Align, boxTopLeft } from "./pathUtil.js"
import { SimplePath } from "./SimplePath.js"

export class Rect implements Traceable {
  readonly at: Point2D
  readonly w: number
  readonly h: number

  constructor(config: { at: Point2D; w: number; h: number; align?: Align }) {
    this.at = boxTopLeft(config)
    this.w = config.w
    this.h = config.h
  }

  traceIn = (ctx: CanvasRenderingContext2D) => {
    ctx.rect(this.at[0], this.at[1], this.w, this.h)
  }

  get path(): SimplePath {
    const [x, y] = this.at
    return SimplePath.withPoints([
      this.at,
      [x + this.w, y],
      [x + this.w, y + this.h],
      [x, y + this.h],
    ]).close()
  }

  /**
   * Divide into a row (horizontal) or column (vertical) of rects.
   *
   * A single number splits in two at that proportion, an array of numbers
   * splits into that many parts, sized in proportion to the numbers given
   * (they need not sum to one).
   */
  split = (config: {
    orientation: "vertical" | "horizontal"
    split?: number | number[]
  }): Rect[] => {
    const { orientation, split = 0.5 } = config
    const horizontal = orientation === "horizontal"
    const extent = horizontal ? this.w : this.h

    const parts = typeof split === "number" ? [split, 1 - split] : split
    const total = parts.reduce((a, b) => a + b, 0)

    const [x, y] = this.at
    let offset = 0

    return parts.map((part, i) => {
      // the last part takes up whatever is left, so parts always tile exactly
      const size =
        i === parts.length - 1 ? extent - offset : extent * (part / total)
      const rect = new Rect({
        at: horizontal ? [x + offset, y] : [x, y + offset],
        w: horizontal ? size : this.w,
        h: horizontal ? this.h : size,
      })
      offset += size
      return rect
    })
  }
}
