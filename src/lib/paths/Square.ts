import { Point2D } from "../types/sol"
import { Rect } from "."

export default class Square extends Rect {
  constructor(config: {
    at: Point2D
    s: number
    align?: "topLeft" | "center"
  }) {
    const { at, s, align } = config
    super({ at, h: s, w: s, align: align })
  }
}
