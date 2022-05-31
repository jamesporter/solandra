import { Point2D } from "../types/sol"
import { Ellipse } from "."

/**
 * Just an ellipse with width = height
 */
export class Circle extends Ellipse {
  constructor(config: {
    at: Point2D
    r: number
    align?: "center" | "topLeft"
  }) {
    super({
      at: config.at,
      w: config.r * 2,
      h: config.r * 2,
      align: config.align,
    })
  }
}
