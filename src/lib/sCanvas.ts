import { Size, Point2D, Vector2D } from "./types/sol.js"
import { hsla, ColorSpec } from "./colors.js"
import { Traceable } from "./paths/index.js"
import { TextConfig, Text } from "./paths/Text.js"
import { Rect } from "./paths/Rect.js"
import { RNG } from "./rng.js"
import { poissonDiskPoints } from "./poissonDisk.js"
import { asSimplePath, SimplePathLike } from "./paths/SimplePath.js"
import { evenProportions } from "./util.js"
import { heading } from "./vectors.js"

/**
 * Interface for objects that can generate canvas gradients.
 */
export interface Gradientable {
  gradient(ctx: CanvasRenderingContext2D): CanvasGradient
}

/**
 * SCanvas (Solandra Canvas) - The main API for creating generative art.
 *
 * A normalized canvas where the width is always 1, with height determined by aspect ratio.
 * Provides human-friendly APIs for drawing, iteration, randomness, and transformations.
 *
 * Key Features:
 * - Normalized coordinate system (width = 1)
 * - Seeded randomness for reproducibility
 * - Iteration utilities (tiling, grids, circles)
 * - Transform helpers (rotation, scale, translation)
 * - Color management with HSLA
 * - Time-based animations
 *
 * @example
 * ```ts
 * const s = new SCanvas(ctx, { width: 1000, height: 1000 }, 42)
 * s.background(0, 0, 100) // White background
 * s.forTiling({ n: 10 }, ([x, y], [w, h]) => {
 *   s.fill(new Circle({ at: [x + w/2, y + h/2], r: w/3 }))
 * })
 * ```
 */
export default class SCanvas {
  readonly aspectRatio: number
  readonly originalScale: number
  private rng: RNG
  readonly t: number

  meta: {
    top: number
    bottom: number
    right: number
    left: number
    aspectRatio: number
    center: [number, number]
  }

  constructor(
    private ctx: CanvasRenderingContext2D,
    { width, height }: Size,
    rngSeed?: number,
    time?: number
  ) {
    ctx.resetTransform()
    this.aspectRatio = width / height
    // i.e. size 1 = entire width
    this.originalScale = width
    // i.e. size 1/100 of width
    ctx.scale(width, width)
    ctx.lineWidth = 0.01
    ctx.lineJoin = "round"
    ctx.strokeStyle = "black"
    ctx.fillStyle = "gray"
    this.lineStyle = { cap: "round" }

    this.meta = this.currentMeta()

    this.rng = new RNG(rngSeed)
    this.t = time || 0
  }

  /**
   * Allow for re-use of a single SCanvas
   *
   * In examples and most early use just recreated but this is somewhat wasteful
   */
  updateTime(time: number) {
    // @ts-ignore (sorry but don't want other people to do this!)
    this.t = time
  }

  /**
   * Allow for re-use of a single SCanvas
   *
   * In examples and most early use just recreated but this is somewhat wasteful
   */
  updateSize({ width, height }: { width: number; height: number }) {
    this.ctx.resetTransform()
    // @ts-ignore (sorry but don't want other people to do this!)
    this.aspectRatio = width / height
    // i.e. size 1 = entire width
    // @ts-ignore (sorry but don't want other people to do this!)
    this.originalScale = width
    // i.e. size 1/100 of width
    this.ctx.scale(width, width)

    this.meta = this.currentMeta()
  }

  /**
   * The bounds of the drawing area, derived from the current aspect ratio.
   */
  private currentMeta(): SCanvas["meta"] {
    return {
      top: 0,
      bottom: 1 / this.aspectRatio,
      right: 1,
      left: 0,
      aspectRatio: this.aspectRatio,
      center: [0.5, 0.5 / this.aspectRatio],
    }
  }

  resetRandomNumberGenerator(seed?: number) {
    this.rng = new RNG(seed)
  }

  set lineWidth(width: number) {
    this.ctx.lineWidth = width
  }

  set lineStyle({
    cap = "round",
    join = "round",
  }: {
    cap?: "round" | "butt" | "square"
    join?: "round" | "bevel" | "miter"
  }) {
    this.ctx.lineCap = cap
    this.ctx.lineJoin = join
  }

  /**
   * The supplied pattern is at scale of canvas
   */
  set dash({
    pattern = [0.05, 0.05],
    offset = 0,
  }: {
    pattern?: number[]
    offset?: number
  }) {
    this.ctx.setLineDash(pattern)
    this.ctx.lineDashOffset = offset
  }

  clearShadow() {
    this.ctx.shadowBlur = 0
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 0
  }

  /**
   * Shadow scale is at size of Canvas. (This is not how HTML 5 Canvas works.)
   */
  set shadow({
    size = 0.01,
    color = { h: 0, s: 0, l: 0, a: 0.5 },
    dX = 0,
    dY = 0.01,
  }: {
    size?: number
    color?: { h: number; s: number; l: number; a: number }
    dX?: number
    dY?: number
  }) {
    const { h, s, l, a } = color
    this.ctx.shadowBlur = size * this.originalScale
    this.ctx.shadowColor = hsla(h, s, l, a)
    this.ctx.shadowOffsetX = dX * this.originalScale
    this.ctx.shadowOffsetY = dY * this.originalScale
  }

  background(h: number, s: number, l: number, a: number = 1) {
    this.fillCanvas(() => hsla(h, s, l, a))
  }

  backgroundFromSpec({ h, s, l, a }: ColorSpec) {
    this.background(h, s, l, a)
  }

  backgroundGradient(gradient: Gradientable) {
    this.fillCanvas(() => gradient.gradient(this.ctx))
  }

  /**
   * Cover the whole drawing area, leaving the current fill style unchanged.
   */
  private fillCanvas(style: () => string | CanvasGradient) {
    this.withState(() => {
      this.ctx.fillStyle = style()
      const { right, bottom } = this.meta
      this.fill(new Rect({ at: [0, 0], w: right, h: bottom }))
    })
  }

  setStrokeColor(h: number, s: number, l: number, a: number = 1) {
    this.ctx.strokeStyle = hsla(h, s, l, a)
  }

  setStrokeColorFromSpec({ h, s, l, a }: ColorSpec) {
    this.setStrokeColor(h, s, l, a)
  }

  setFillColor(h: number, s: number, l: number, a: number = 1) {
    this.ctx.fillStyle = hsla(h, s, l, a)
  }

  setFillColorFromSpec({ h, s, l, a }: ColorSpec) {
    this.setFillColor(h, s, l, a)
  }

  setStrokeGradient(gradient: Gradientable) {
    this.ctx.strokeStyle = gradient.gradient(this.ctx)
  }

  setFillGradient(gradient: Gradientable) {
    this.ctx.fillStyle = gradient.gradient(this.ctx)
  }

  draw(traceable: Traceable) {
    this.ctx.beginPath()
    traceable.traceIn(this.ctx)
    this.ctx.stroke()
  }

  fill(traceable: Traceable) {
    this.ctx.beginPath()
    traceable.traceIn(this.ctx)
    this.ctx.fill()
  }

  drawText(config: TextConfig, text: string) {
    new Text({ ...config, kind: "stroke" }, text).textIn(this.ctx, this)
  }

  fillText(config: TextConfig, text: string) {
    new Text({ ...config, kind: "fill" }, text).textIn(this.ctx, this)
  }

  measureText(config: Omit<TextConfig, "at">, text: string) {
    return new Text({ ...config, kind: "stroke", at: [0, 0] }, text).measure(
      this.ctx
    )
  }

  drawImage({
    image,
    at = [0, 0],
    w,
    h,
  }: {
    image: CanvasImageSource
    at?: Point2D
    w?: number
    h?: number
  }) {
    this.ctx.drawImage(image, at[0], at[1], w ?? 1, h ?? this.meta.bottom)
  }

  /**
   * Iterates over a single cell with margins, useful for content that needs padding from edges.
   *
   * @param margin - The margin size (0 to 0.5, where 0.5 would leave no space)
   * @param callback - Called with position, size, center, and index (always 0)
   * @example
   * ```ts
   * s.forMargin(0.05, ([x, y], [w, h]) => {
   *   // Draw content with 5% margin on all sides
   * })
   * ```
   */
  forMargin = (
    margin: number,
    callback: (
      point: Point2D,
      delta: Vector2D,
      center: Point2D,
      i: number
    ) => void
  ) => this.forTiling({ n: 1, margin }, callback)

  /**
   * Iterates over a regular grid/tiling of the canvas.
   * The fundamental building block for many generative art patterns.
   *
   * @param config - Configuration for the tiling
   * @param config.n - Number of columns
   * @param config.type - "proportionate" (default) maintains aspect ratio, "square" forces square tiles
   * @param config.margin - Margin around the edges (default: 0)
   * @param config.order - "columnFirst" (default) or "rowFirst" iteration order
   * @param callback - Called for each tile with position, size, center, and sequential index
   * @example
   * ```ts
   * // 10x10 grid of circles
   * s.forTiling({ n: 10, margin: 0.05 }, ([x, y], [w, h], [cx, cy]) => {
   *   s.fill(new Circle({ at: [cx, cy], r: w * 0.4 }))
   * })
   *
   * // Square tiles
   * s.forTiling({ n: 10, type: "square" }, ([x, y], [w, h]) => {
   *   s.fill(new Rect({ at: [x, y], w, h }))
   * })
   * ```
   */
  forTiling = (
    config: {
      n: number
      type?: "square" | "proportionate"
      margin?: number
      order?: "columnFirst" | "rowFirst"
    },
    callback: (
      point: Point2D,
      delta: Vector2D,
      center: Point2D,
      i: number
    ) => void
  ) => {
    let k = 0
    const {
      n,
      type = "proportionate",
      margin = 0,
      order = "columnFirst",
    } = config
    const nY = type === "square" ? Math.floor(n * (1 / this.aspectRatio)) : n
    const deltaX = (1 - margin * 2) / n

    const hY =
      type === "square" ? deltaX * nY : 1 / this.aspectRatio - 2 * margin
    const deltaY = hY / nY

    const sX = margin
    const sY = (1 / this.aspectRatio - hY) / 2

    const tile = (i: number, j: number) => {
      callback(
        [sX + i * deltaX, sY + j * deltaY],
        [deltaX, deltaY],
        [sX + i * deltaX + deltaX / 2, sY + j * deltaY + deltaY / 2],
        k
      )
      k++
    }

    if (order === "columnFirst") {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < nY; j++) tile(i, j)
      }
    } else {
      for (let j = 0; j < nY; j++) {
        for (let i = 0; i < n; i++) tile(i, j)
      }
    }
  }

  /**
   * Iterates over horizontal divisions of the canvas.
   * Each cell spans the full height (minus margins).
   *
   * @param config - Configuration
   * @param config.n - Number of horizontal divisions
   * @param config.margin - Margin around edges (default: 0)
   * @param callback - Called for each division with position, size, center, and index
   * @example
   * ```ts
   * s.forHorizontal({ n: 5, margin: 0.05 }, ([x, y], [w, h], [cx, cy], i) => {
   *   s.setFillColor(i * 60, 50, 50)
   *   s.fill(new Rect({ at: [x, y], w, h }))
   * })
   * ```
   */
  forHorizontal = (
    config: {
      n: number
      margin?: number
    },
    callback: (
      point: Point2D,
      delta: Vector2D,
      center: Point2D,
      i: number
    ) => void
  ) => {
    const { n, margin = 0 } = config

    const sX = margin
    const eX = 1 - margin
    const sY = margin
    const dY = 1 / this.aspectRatio - 2 * margin
    const dX = (eX - sX) / n

    for (let i = 0; i < n; i++) {
      callback(
        [sX + i * dX, sY],
        [dX, dY],
        [sX + i * dX + dX / 2, sY + dY / 2],
        i
      )
    }
  }

  /**
   * Iterates over vertical divisions of the canvas.
   * Each cell spans the full width (minus margins).
   *
   * @param config - Configuration
   * @param config.n - Number of vertical divisions
   * @param config.margin - Margin around edges (default: 0)
   * @param callback - Called for each division with position, size, center, and index
   * @example
   * ```ts
   * s.forVertical({ n: 3 }, ([x, y], [w, h]) => {
   *   s.draw(new Rect({ at: [x, y], w, h }))
   * })
   * ```
   */
  forVertical = (
    config: {
      n: number
      margin?: number
    },
    callback: (
      point: Point2D,
      delta: Vector2D,
      center: Point2D,
      i: number
    ) => void
  ) => {
    const { n, margin = 0 } = config

    const sX = margin
    const eY = 1 / this.aspectRatio - margin
    const sY = margin
    const dX = 1 - 2 * margin
    const dY = (eY - sY) / n

    for (let i = 0; i < n; i++) {
      callback(
        [sX, sY + i * dY],
        [dX, dY],
        [sX + dX / 2, sY + i * dY + dY / 2],
        i
      )
    }
  }

  /**
   * Iterates over integer grid coordinates within specified bounds.
   * Useful for algorithmic patterns on discrete grids.
   *
   * @param config - Grid bounds and order
   * @param config.minX - Minimum x coordinate (inclusive)
   * @param config.maxX - Maximum x coordinate (inclusive)
   * @param config.minY - Minimum y coordinate (inclusive)
   * @param config.maxY - Maximum y coordinate (inclusive)
   * @param config.order - "columnFirst" (default) or "rowFirst" iteration order
   * @param callback - Called for each grid point with coordinates and sequential index
   * @example
   * ```ts
   * s.forGrid({ minX: 0, maxX: 9, minY: 0, maxY: 9 }, ([x, y]) => {
   *   const size = 0.08
   *   s.fill(new Circle({ at: [x * 0.1, y * 0.1], r: size }))
   * })
   * ```
   */
  forGrid = (
    config: {
      minX: number
      maxX: number
      minY: number
      maxY: number
      order?: "columnFirst" | "rowFirst"
    },
    callback: (point: Point2D, i: number) => void
  ) => {
    let k = 0
    const { minX, maxX, minY, maxY, order = "columnFirst" } = config

    const point = (i: number, j: number) => {
      callback([i, j], k)
      k++
    }

    if (order === "columnFirst") {
      for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) point(i, j)
      }
    } else {
      for (let j = minY; j <= maxY; j++) {
        for (let i = minX; i <= maxX; i++) point(i, j)
      }
    }
  }

  /**
   * Builds an array of values using iteration utilities instead of drawing directly.
   * Useful for collecting data from iteration patterns for further processing.
   *
   * @template C - Configuration type for the iteration function
   * @template T - Tuple type of callback parameters
   * @template U - Return type of the callback
   * @param iterFn - An iteration function (like forTiling, forGrid, etc.)
   * @param config - Configuration for the iteration function
   * @param cb - Callback that returns a value for each iteration
   * @returns An array of values returned by the callback
   * @example
   * ```ts
   * // Build array of circle positions
   * const circles = s.build(s.forTiling, { n: 5 }, ([x, y], [w, h]) => {
   *   return { x: x + w/2, y: y + h/2, r: w * 0.4 }
   * })
   * // Later draw them in custom order
   * circles.forEach(c => s.fill(new Circle({ at: [c.x, c.y], r: c.r })))
   * ```
   */
  build = <C, T extends any[], U>(
    iterFn: (config: C, callback: (...args: T) => void) => void,
    config: C,
    cb: (...args: T) => U
  ): U[] => {
    const res: U[] = []
    iterFn(config, (...as: T) => {
      res.push(cb(...as))
    })
    return res
  }

  /**
   * Wraps an iteration function to execute callbacks in random order.
   * Collects all iteration arguments, shuffles them, then executes the callback.
   *
   * @template C - Configuration type for the iteration function
   * @template T - Tuple type of callback parameters
   * @param iterFn - An iteration function (like forTiling, forGrid, etc.)
   * @param config - Configuration for the iteration function
   * @param cb - Callback to execute for each iteration (in random order)
   * @example
   * ```ts
   * // Draw tiles in random order (useful for layering effects)
   * s.withRandomOrder(s.forTiling, { n: 10 }, ([x, y], [w, h]) => {
   *   s.fill(new Circle({ at: [x + w/2, y + h/2], r: w * 0.5 }))
   * })
   * ```
   */
  withRandomOrder<C, T extends any[]>(
    iterFn: (config: C, callback: (...args: T) => void) => void,
    config: C,
    cb: (...args: T) => void
  ) {
    const args: T[] = []
    iterFn(config, (...as: T) => {
      args.push(as)
    })
    this.shuffle(args)

    for (let a of args) {
      cb(...a)
    }
  }

  doProportion(p: number, callback: () => void) {
    if (this.rng.number() < p) {
      callback()
    }
  }

  times = (n: number, callback: (n: number) => void) => {
    for (let i = 0; i < n; i++) {
      callback(i)
    }
  }

  downFrom(n: number, callback: (n: number) => void) {
    for (let i = n; i > 0; i--) {
      callback(i)
    }
  }

  aroundCircle = (
    config: {
      at?: Point2D
      r?: number
      n: number
    },
    callback: (point: Point2D, i: number) => void
  ) => {
    const { n, at: [cX, cY] = [0.5, 0.5 / this.aspectRatio], r = 0.25 } = config
    const da = (Math.PI * 2) / n

    let a = -Math.PI * 0.5
    for (let i = 0; i < n; i++) {
      callback([cX + r * Math.cos(a + da), cY + r * Math.sin(a + da)], i)
      a += da
    }
  }

  /**
   * Randomly selects and executes one case from weighted options.
   * Each case has a weight (proportion) and a function to execute if selected.
   *
   * @template T - Return type of the case functions
   * @param cases - Array of [weight, function] tuples
   * @returns The result of the selected function
   * @example
   * ```ts
   * // 50% circles, 30% squares, 20% triangles
   * const shape = s.proportionately([
   *   [5, () => new Circle({ at: [0.5, 0.5], r: 0.2 })],
   *   [3, () => new Rect({ at: [0.4, 0.4], w: 0.2, h: 0.2 })],
   *   [2, () => new RegularPolygon({ at: [0.5, 0.5], n: 3, r: 0.2 })]
   * ])
   * s.fill(shape)
   * ```
   */
  proportionately<T>(cases: [number, () => T][]): T {
    const total = cases.map((c) => c[0]).reduce((a, b) => a + b, 0)
    if (total <= 0) throw new Error("Must be positive total")
    let r = this.rng.number() * total

    for (let i = 0; i < cases.length; i++) {
      if (cases[i][0] > r) {
        return cases[i][1]()
      } else {
        r -= cases[i][0]
      }
    }
    //fallback *should never happen!*
    return cases[0][1]()
  }

  randomPoint(): Point2D {
    return [this.rng.number(), this.rng.number() / this.aspectRatio]
  }

  randomAngle(): number {
    return this.rng.number() * Math.PI * 2
  }

  forPoissonDiskPoints = (
    config: {
      minDist: number
      attempts?: number
    },
    callback: (at: Point2D, i: number) => void
  ) => {
    const { minDist, attempts = 30 } = config

    const points = poissonDiskPoints({
      width: 1,
      height: this.meta.bottom,
      minDist,
      rng: () => this.random(),
      k: attempts,
    })

    points.forEach(callback)
  }

  /**
   * Iterates over points evenly spaced along a path, by distance travelled.
   *
   * The callback also gets the angle the path is heading in at each point, so
   * things can be laid out following the path rather than just sitting on it.
   *
   * @param config - Configuration
   * @param config.path - The path to follow. A `SimplePath`, or anything with
   * one: `Line`, `Rect`, `RegularPolygon`, `Star` and `Spiral` all do.
   * @param config.n - How many points
   * @param config.inclusive - Whether to include the end of the path
   * (default: true). Pass false for a closed path, where the end is the start.
   * @param callback - Called with the point, the angle of the path there
   * (radians), and a sequential index
   * @example
   * ```ts
   * // Beads on a wiggly wire
   * const wire = SimplePath.withPoints(
   *   s.build(s.range, { n: 20 }, (x) => [x, 0.3 + 0.1 * Math.sin(x * 10)])
   * )
   * s.alongPath({ path: wire, n: 40 }, (at) => {
   *   s.fill(new Circle({ at, r: 0.01 }))
   * })
   *
   * // Rectangles turned to follow the outline of a star
   * s.alongPath(
   *   { path: new Star({ at: s.meta.center, n: 5, r: 0.3 }), n: 60 },
   *   (at, angle) => {
   *     s.withTranslation(at, () => {
   *       s.withRotation(angle, () => {
   *         s.fill(new Rect({ at: [0, 0], w: 0.03, h: 0.01, align: "center" }))
   *       })
   *     })
   *   }
   * )
   * ```
   */
  alongPath = (
    config: {
      path: SimplePathLike
      n: number
      inclusive?: boolean
    },
    callback: (point: Point2D, angle: number, i: number) => void
  ) => {
    const { path, n, inclusive = true } = config
    const simplePath = asSimplePath(path)

    evenProportions({ n, inclusive }).forEach((proportion, i) => {
      callback(
        simplePath.pointAt(proportion),
        heading(simplePath.tangentAt(proportion)),
        i
      )
    })
  }

  range = (
    config: { from?: number; to?: number; n: number; inclusive?: boolean },
    callback: (n: number) => void
  ) => {
    const { from = 0, to = 1, n, inclusive = true } = config

    const di = (to - from) / n
    const max = inclusive ? n : n - 1
    for (let i = 0; i <= max; i++) {
      callback(i * di + from)
    }
  }

  inDrawing = (point: Point2D): boolean => {
    const { left, right, top, bottom } = this.meta
    return (
      point[0] > left && point[0] < right && point[1] > top && point[1] < bottom
    )
  }

  // Transforms and state

  /**
   * Run a callback with the canvas state saved beforehand and restored after,
   * so anything it changes (styles, transforms, clipping) stays local to it.
   */
  private withState(callback: () => void) {
    this.ctx.save()
    callback()
    this.ctx.restore()
  }

  withClipping = (clipArea: Traceable, callback: () => void) => {
    this.withState(() => {
      this.ctx.beginPath()
      clipArea.traceIn(this.ctx)
      this.ctx.clip()
      callback()
    })
  }

  /**
   * Within a context all style/color changes are local.
   */
  withContext = (callback: () => void) => {
    this.withState(callback)
  }

  withRotation = (angle: number, callback: () => void) => {
    this.withState(() => {
      this.ctx.rotate(angle)
      callback()
    })
  }

  withScale = (scale: Vector2D, callback: () => void) => {
    this.withState(() => {
      this.ctx.scale(scale[0], scale[1])
      callback()
    })
  }

  withTranslation = (translation: Vector2D, callback: () => void) => {
    this.withState(() => {
      this.ctx.translate(translation[0], translation[1])
      callback()
    })
  }

  withTransform = (
    config: {
      hScale: number
      hSkew: number
      vSkew: number
      vScale: number
      dX: number
      dY: number
    },
    callback: () => void
  ) => {
    this.withState(() => {
      const { hScale, hSkew, vSkew, vScale, dX, dY } = config
      this.ctx.transform(hScale, hSkew, vSkew, vScale, dX, dY)
      callback()
    })
  }

  withBlendMode = (mode: GlobalCompositeOperation, callback: () => void) => {
    this.withState(() => {
      this.ctx.globalCompositeOperation = mode
      callback()
    })
  }

  /**
   * Draws the same thing several times over, arranged symmetrically: the
   * callback runs once per copy, with the canvas already rotated and/or
   * reflected, so a single shape becomes a rosette, a mirrored pair or a
   * kaleidoscope.
   *
   * @param config - Configuration
   * @param config.type - "rotational" (default) for `n` rotated copies,
   * "mirror" for a reflected pair, or "kaleidoscope" for `n` rotated pairs,
   * each reflected (so 2n copies)
   * @param config.n - How many rotations (default: 6). Ignored by "mirror".
   * @param config.at - The centre of the symmetry (default: the canvas centre)
   * @param config.axis - Which line to reflect in, "vertical" (default, so the
   * copy is flipped left to right) or "horizontal". Ignored by "rotational".
   * @param callback - Called once per copy, with the index of the copy and
   * whether this copy is a reflection
   * @throws Error if fewer than one rotation is requested
   * @example
   * ```ts
   * // A six petalled rosette from one petal
   * s.withSymmetry({ n: 6 }, () => {
   *   s.fill(new Ellipse({ at: [0.5, 0.25], w: 0.1, h: 0.3 }))
   * })
   *
   * // Kaleidoscope: each of the 8 rotations is drawn twice, mirrored
   * s.withSymmetry({ type: "kaleidoscope", n: 8 }, (i, reflected) => {
   *   s.setFillColor(reflected ? 200 : 40, 80, 50, 0.6)
   *   s.fill(new Rect({ at: [0.5, 0.1], w: 0.2, h: 0.15 }))
   * })
   * ```
   */
  withSymmetry = (
    config: {
      type?: "rotational" | "mirror" | "kaleidoscope"
      n?: number
      at?: Point2D
      axis?: "vertical" | "horizontal"
    },
    callback: (i: number, reflected: boolean) => void
  ) => {
    const {
      type = "rotational",
      n = 6,
      at: [cX, cY] = this.meta.center,
      axis = "vertical",
    } = config

    if (n < 1) throw new Error(`Must have at least one copy, n was set to ${n}`)

    let i = 0
    const copy = (angle: number, reflected: boolean) => {
      this.withState(() => {
        // rotate and reflect about the centre of symmetry, not the origin
        this.ctx.translate(cX, cY)
        this.ctx.rotate(angle)
        if (reflected) {
          if (axis === "vertical") {
            this.ctx.scale(-1, 1)
          } else {
            this.ctx.scale(1, -1)
          }
        }
        this.ctx.translate(-cX, -cY)
        callback(i, reflected)
      })
      i++
    }

    if (type === "mirror") {
      copy(0, false)
      copy(0, true)
      return
    }

    const dA = (Math.PI * 2) / n
    for (let j = 0; j < n; j++) {
      copy(j * dA, false)
      if (type === "kaleidoscope") copy(j * dA, true)
    }
  }

  // Randomness

  /**
   * A uniform random number between 0 and 1
   */
  random = (): number => {
    return this.rng.number()
  }

  /**
   * A uniform random integer. Default lower bound is 0.
   * Upper bound can be inclusive (default) or exclusive
   */
  uniformRandomInt = (config: {
    from?: number
    to: number
    inclusive?: boolean
  }) => {
    const { to, from = 0, inclusive = true } = config
    const d = to - from + (inclusive ? 1 : 0)
    return from + Math.floor(this.random() * d)
  }

  /**
   * A random Point2D on a grid
   */
  uniformGridPoint = ({
    minX,
    maxX,
    minY,
    maxY,
  }: {
    minX: number
    maxX: number
    minY: number
    maxY: number
  }): Point2D => {
    return [
      this.uniformRandomInt({ from: minX, to: maxX }),
      this.uniformRandomInt({ from: minY, to: maxY }),
    ]
  }

  /**
   * A coin toss with result either -1 or 1
   */
  randomPolarity = (): 1 | -1 => {
    return this.rng.number() > 0.5 ? 1 : -1
  }

  /**
   * Sample uniformly from an array
   *
   * @throws Error if the array is empty
   */
  sample = <T>(from: T[]): T => {
    if (from.length === 0) throw new Error("Cannot sample from an empty array")
    return from[Math.floor(this.rng.number() * from.length)]
  }

  /**
   * n uniform samples from an array
   */
  samples = <T>(n: number, from: T[]): T[] => {
    let res: T[] = []
    for (let i = 0; i < n; i++) {
      res.push(this.sample(from))
    }
    return res
  }

  /**
   * Shuffle an array
   */
  shuffle = <T>(items: T[]): T[] => {
    let currentIndex = items.length
    let temporaryValue: T
    let randomIndex = 0

    while (0 !== currentIndex) {
      randomIndex = Math.floor(this.rng.number() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = items[currentIndex]
      items[currentIndex] = items[randomIndex]
      items[randomIndex] = temporaryValue
    }

    return items
  }

  /**
   * Perturb a point by a random amount (by default uniform random changes in
   * -0.05 to 0.05, optional magnitude scales this e.g. magnitude 1 is perturbations
   * of -0.5 to 0.5)
   */
  perturb = (config: { at: Point2D; magnitude?: number }): Point2D => {
    const {
      at: [x, y],
      magnitude = 0.1,
    } = config
    return [
      x + magnitude * (this.rng.number() - 0.5),
      y + magnitude * (this.rng.number() - 0.5),
    ]
  }

  /**
   * Gaussian random number, default mean 0, default standard deviation 1
   */
  gaussian = (config?: { mean?: number; sd?: number }): number => {
    const { mean = 0, sd = 1 } = config || {}
    // rng.number() is in [0, 1) so use 1 - a to keep the log argument in (0, 1]
    const a = this.rng.number()
    const b = this.rng.number()
    const n = Math.sqrt(-2.0 * Math.log(1 - a)) * Math.cos(2.0 * Math.PI * b)
    return mean + n * sd
  }

  /**
   * Poisson random number, lambda (the mean and variance) is only parameter
   */
  poisson = (lambda: number): number => {
    const limit = Math.exp(-lambda)
    let prod = this.rng.number()
    let n = 0
    while (prod >= limit) {
      n++
      prod *= this.rng.number()
    }
    return n
  }

  /**
   * Creates smooth oscillating values over time using cosine.
   * Useful for animations that loop seamlessly.
   *
   * @param config - Oscillation parameters
   * @param config.from - Minimum value (default: 0)
   * @param config.to - Maximum value (default: 1)
   * @param config.rate - Oscillation speed multiplier (default: 1)
   * @returns A value oscillating between from and to based on this.t
   * @example
   * ```ts
   * // Oscillate circle radius over time
   * const r = s.oscillate({ from: 0.1, to: 0.3, rate: 2 })
   * s.fill(new Circle({ at: [0.5, 0.5], r }))
   *
   * // Oscillate hue for color animations
   * const hue = s.oscillate({ from: 0, to: 360, rate: 0.5 })
   * s.setFillColor(hue, 70, 50)
   * ```
   */
  oscillate = (config?: {
    from?: number
    to?: number
    rate?: number
  }): number => {
    const { from = 0, to = 1, rate = 1 } = config || {}
    return from + ((to - from) * (1 + Math.cos(this.t * rate))) / 2
  }
}
