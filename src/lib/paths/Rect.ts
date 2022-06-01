import { Point2D } from "../types/sol"
import { Traceable } from "."
import { v } from ".."
import { SimplePath } from "./SimplePath"
export class Rect implements Traceable {
  readonly at: Point2D
  readonly w: number
  readonly h: number

  constructor(config: {
    at: Point2D
    w: number
    h: number
    align?: "topLeft" | "center"
  }) {
    const { at, w, h, align = "topLeft" } = config
    this.at = align === "topLeft" ? at : v.subtract(at, [w / 2, h / 2])
    this.w = w
    this.h = h
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

  split = (config: {
    orientation: "vertical" | "horizontal"
    split?: number | number[]
  }): Rect[] => {
    let { orientation, split } = config
    split = split || 0.5
    if (orientation === "horizontal") {
      if (typeof split === "number") {
        return [
          new Rect({ at: this.at, w: this.w / 2, h: this.h }),
          new Rect({
            at: [this.at[0] + this.w / 2, this.at[1]],
            w: this.w / 2,
            h: this.h,
          }),
        ]
      } else {
        const total = split.reduce((a, b) => a + b, 0)
        const proportions = split.map((s) => s / total)
        let xDxs: [number, number][] = []
        let c = 0
        proportions.forEach((p) => {
          xDxs.push([c, p * this.w])
          c += p * this.w
        })
        return xDxs.map(
          ([x, dX], i) =>
            new Rect({
              at: [this.at[0] + x, this.at[1]],
              w: dX,
              h: this.h,
            })
        )
      }
    } else {
      if (typeof split === "number") {
        return [
          new Rect({ at: this.at, w: this.w, h: this.h / 2 }),
          new Rect({
            at: [this.at[0], this.at[1] + this.h / 2],
            w: this.w,
            h: this.h / 2,
          }),
        ]
      } else {
        const total = split.reduce((a, b) => a + b, 0)
        const proportions = split.map((s) => s / total)
        let yDys: [number, number][] = []
        let c = 0
        proportions.forEach((p) => {
          yDys.push([c, p * this.h])
          c += p * this.h
        })
        return yDys.map(
          ([y, dY], i) =>
            new Rect({
              at: [this.at[0], this.at[1] + y],
              w: this.w,
              h: dY,
            })
        )
      }
    }
  }
}
