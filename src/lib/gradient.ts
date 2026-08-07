/**
 * Gradient classes for creating linear and radial color gradients.
 * @module gradient
 */

import { Gradientable } from "./sCanvas.js"
import { Point2D } from "./types/sol.js"
import { hsla, ColorSpec } from "./colors.js"

/**
 * Applies colour stops to a canvas gradient.
 * @internal
 */
const withColorStops = <G extends CanvasGradient>(
  gradient: G,
  colors: [number, ColorSpec][]
): G => {
  for (const [n, { h, s, l, a }] of colors) {
    gradient.addColorStop(n, hsla(h, s, l, a))
  }
  return gradient
}

/**
 * Creates a linear gradient between two points with multiple color stops.
 * Use with `setFillGradient()` or `setStrokeGradient()` on SCanvas.
 *
 * @example
 * ```ts
 * // Horizontal gradient from left to right
 * const grad = new LinearGradient({
 *   from: [0, 0],
 *   to: [1, 0],
 *   colors: [
 *     [0, { h: 0, s: 70, l: 50, a: 1 }],     // Red at start
 *     [0.5, { h: 120, s: 70, l: 50, a: 1 }], // Green at middle
 *     [1, { h: 240, s: 70, l: 50, a: 1 }]    // Blue at end
 *   ]
 * })
 * s.setFillGradient(grad)
 * s.fill(new Rect({ at: [0, 0], w: 1, h: 1 }))
 * ```
 */
export class LinearGradient implements Gradientable {
  /**
   * Creates a linear gradient.
   *
   * @param config - Gradient configuration
   * @param config.from - Start point of the gradient
   * @param config.to - End point of the gradient
   * @param config.colors - Array of [position, color] tuples where position is 0-1
   */
  constructor(
    private config: {
      from: Point2D
      to: Point2D
      colors: [number, ColorSpec][]
    }
  ) {}

  /**
   * Generates the canvas gradient object.
   * @internal
   */
  gradient(ctx: CanvasRenderingContext2D): CanvasGradient {
    const {
      from: [x1, y1],
      to: [x2, y2],
      colors,
    } = this.config
    return withColorStops(ctx.createLinearGradient(x1, y1, x2, y2), colors)
  }
}

/**
 * Creates a radial gradient between two circles with multiple color stops.
 * The gradient radiates from a start circle to an end circle.
 * Use with `setFillGradient()` or `setStrokeGradient()` on SCanvas.
 *
 * @example
 * ```ts
 * // Radial gradient from center outward
 * const grad = new RadialGradient({
 *   start: [0.5, 0.5],
 *   end: [0.5, 0.5],
 *   rStart: 0,
 *   rEnd: 0.4,
 *   colors: [
 *     [0, { h: 60, s: 100, l: 70, a: 1 }],  // Yellow center
 *     [1, { h: 0, s: 100, l: 50, a: 1 }]    // Red edge
 *   ]
 * })
 * s.setFillGradient(grad)
 * s.fill(new Circle({ at: [0.5, 0.5], r: 0.4 }))
 * ```
 */
export class RadialGradient implements Gradientable {
  /**
   * Creates a radial gradient.
   *
   * @param config - Gradient configuration
   * @param config.start - Center point of the starting circle
   * @param config.end - Center point of the ending circle
   * @param config.rStart - Radius of the starting circle
   * @param config.rEnd - Radius of the ending circle
   * @param config.colors - Array of [position, color] tuples where position is 0-1
   */
  constructor(
    private config: {
      start: Point2D
      end: Point2D
      rStart: number
      rEnd: number
      colors: [number, ColorSpec][]
    }
  ) {}

  /**
   * Generates the canvas gradient object.
   * @internal
   */
  gradient(ctx: CanvasRenderingContext2D): CanvasGradient {
    const {
      start: [x1, y1],
      end: [x2, y2],
      rStart,
      rEnd,
      colors,
    } = this.config
    return withColorStops(
      ctx.createRadialGradient(x1, y1, rStart, x2, y2, rEnd),
      colors
    )
  }
}
