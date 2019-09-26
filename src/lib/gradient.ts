import { Gradientable } from "./sCanvas"
import { Point2D } from "./types/sol"
import { hsla } from "./colors"

export class LinearGradient implements Gradientable {
  constructor(
    private config: {
      from: Point2D
      to: Point2D
      colors: [
        number,
        {
          h: number
          s: number
          l: number
          a?: number
        }
      ][]
    }
  ) {}

  gradient(ctx: CanvasRenderingContext2D): CanvasGradient {
    const {
      from: [x1, y1],
      to: [x2, y2],
      colors,
    } = this.config
    const lg = ctx.createLinearGradient(x1, y1, x2, y2)
    for (let [n, { h, s, l, a }] of colors) {
      lg.addColorStop(n, hsla(h, s, l, a))
    }
    return lg
  }
}

export class RadialGradient implements Gradientable {
  constructor(
    private config: {
      start: Point2D
      end: Point2D
      rStart: number
      rEnd: number
      colors: [
        number,
        {
          h: number
          s: number
          l: number
          a?: number
        }
      ][]
    }
  ) {}

  gradient(ctx: CanvasRenderingContext2D): CanvasGradient {
    const {
      start: [x1, y1],
      end: [x2, y2],
      rStart,
      rEnd,
      colors,
    } = this.config
    const lg = ctx.createRadialGradient(x1, y1, rStart, x2, y2, rEnd)
    for (let [n, { h, s, l, a }] of colors) {
      lg.addColorStop(n, hsla(h, s, l, a))
    }
    return lg
  }
}
