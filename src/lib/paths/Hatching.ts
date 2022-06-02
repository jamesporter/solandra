import { Point2D } from "../types/sol"
import { Traceable } from "./index"
/**
 * Hatching in a circle around a point, with a radius and delta between lines
 */
export class Hatching implements Traceable {
  constructor(
    private config: {
      at: Point2D
      r: number
      a: number
      delta: number
    }
  ) {}
  traceIn = (ctx: CanvasRenderingContext2D) => {
    const {
      at: [x, y],
      r,
      a,
      delta,
    } = this.config
    let perpOffset = 0
    const rca = r * Math.cos(a - Math.PI / 2)
    const rsa = r * Math.sin(a - Math.PI / 2)
    const dX = Math.cos(a)
    const dY = Math.sin(a)
    ctx.moveTo(x - rca, y - rsa)
    ctx.lineTo(x + rca, y + rsa)
    while (perpOffset < r) {
      perpOffset += delta
      const [sX, sY] = [perpOffset * dX, perpOffset * dY]
      // divide by r as using rsa/rca below
      const rl = Math.sqrt(r * r - perpOffset * perpOffset) / r
      ctx.moveTo(x + sX - rl * rca, y + sY - rl * rsa)
      ctx.lineTo(x + sX + rl * rca, y + sY + rl * rsa)
      ctx.moveTo(x - sX - rl * rca, y - sY - rl * rsa)
      ctx.lineTo(x - sX + rl * rca, y - sY + rl * rsa)
    }
  }
}
