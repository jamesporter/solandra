/**
 * Perceptual image comparison used for sample (snapshot) image testing.
 *
 * Exact byte comparison (or `git diff`) is useless here: node-canvas renders
 * via cairo/pango, so the exact bytes depend on the versions of those
 * libraries, the fonts installed and even the CPU's floating point rounding.
 * Two renders of the same sketch on different machines routinely differ in a
 * few thousand pixels by a shade or two, or by a sub pixel shift along an
 * edge, while looking identical.
 *
 * So instead we ask "are these two images the same picture?", allowing:
 *
 *  1. small colour differences, measured with a perceptual (YIQ) metric
 *     rather than raw RGB distance, and
 *  2. differences that are explained by a sub pixel shift: a pixel only
 *     counts against us if nothing within `shiftTolerance` pixels of it in
 *     the other image looks like it (this absorbs antialiasing along edges,
 *     which is where renderers disagree most).
 *
 * What is left is counted, and the images pass if the fraction of matching
 * pixels is at least `threshold`.
 */

export type RgbaImage = {
  width: number
  height: number
  /** RGBA, 4 bytes per pixel, row major. */
  data: Uint8ClampedArray
}

export type CompareOptions = {
  /**
   * Per pixel colour sensitivity, 0-1, in the style of pixelmatch. Smaller is
   * stricter. 0.1 tolerates a shade or two of difference.
   */
  colorTolerance: number
  /**
   * How far (in pixels) to look for a matching pixel before counting a
   * difference. 1 absorbs antialiasing and sub pixel shifts; 0 disables it.
   */
  shiftTolerance: number
  /**
   * Radius of the neighbourhood whose average colour also has to differ before
   * a pixel counts. This is what tells a redrawn edge apart from a redrawn
   * picture: a glyph rasterised slightly differently moves individual pixels a
   * long way but barely moves the average around them, whereas a shape that
   * moved, or changed colour, moves both. 0 disables it.
   */
  structureRadius: number
  /**
   * How much that average is allowed to differ, 0-1. Much tighter than
   * `colorTolerance`, because averaging shrinks differences — and because the
   * differences it is meant to forgive shrink all the way to nothing: moving
   * an edge takes ink from one pixel and gives it to another, leaving the
   * average alone, whereas recolouring or moving a shape does not.
   */
  structureTolerance: number
  /** Fraction of pixels that must match for the images to be considered equal. */
  threshold: number
}

export const defaultCompareOptions: CompareOptions = {
  colorTolerance: 0.1,
  shiftTolerance: 1,
  structureRadius: 5,
  structureTolerance: 0.03,
  threshold: 0.99,
}

export type CompareResult = {
  width: number
  height: number
  totalPixels: number
  /** Pixels that differ by more than the colour tolerance. */
  changedPixels: number
  /** Of those, the ones not explained by a shift or by local detail. */
  significantPixels: number
  /** 1 - significantPixels / totalPixels. */
  similarity: number
  /** Largest perceptual distance (0-1) seen at any significant pixel. */
  maxDelta: number
  passed: boolean
}

/** Maximum possible value of the YIQ delta below, used to normalise it. */
const MAX_YIQ_DELTA = 35215

const rgb2y = (r: number, g: number, b: number) =>
  r * 0.29889531 + g * 0.58662247 + b * 0.11448223

const rgb2i = (r: number, g: number, b: number) =>
  r * 0.59597799 - g * 0.2741761 - b * 0.32180189

const rgb2q = (r: number, g: number, b: number) =>
  r * 0.21147017 - g * 0.52261711 + b * 0.31114694

/** Composite a pixel onto a white background, so alpha differences count. */
const onWhite = (channel: number, alpha: number) =>
  255 + (channel - 255) * (alpha / 255)

/**
 * Perceptual distance between two colours, normalised to 0-1. Based on the
 * YIQ colour space, which weights differences roughly the way an eye does
 * (brightness matters much more than hue).
 */
export function rgbDelta(
  ar: number,
  ag: number,
  ab: number,
  br: number,
  bg: number,
  bb: number
): number {
  if (ar === br && ag === bg && ab === bb) return 0

  const y = rgb2y(ar, ag, ab) - rgb2y(br, bg, bb)
  const i = rgb2i(ar, ag, ab) - rgb2i(br, bg, bb)
  const q = rgb2q(ar, ag, ab) - rgb2q(br, bg, bb)

  const delta = 0.5053 * y * y + 0.299 * i * i + 0.1957 * q * q
  return delta / MAX_YIQ_DELTA
}

/** As `rgbDelta`, for two pixels in RGBA buffers, composited onto white. */
export function colorDelta(
  a: Uint8ClampedArray,
  ai: number,
  b: Uint8ClampedArray,
  bi: number
): number {
  const aAlpha = a[ai + 3]
  const bAlpha = b[bi + 3]

  return rgbDelta(
    onWhite(a[ai], aAlpha),
    onWhite(a[ai + 1], aAlpha),
    onWhite(a[ai + 2], aAlpha),
    onWhite(b[bi], bAlpha),
    onWhite(b[bi + 1], bAlpha),
    onWhite(b[bi + 2], bAlpha)
  )
}

/**
 * Summed area table over an image's white-composited channels, so the mean
 * colour of any box can be read in constant time.
 */
class BoxMeans {
  private sums: Float64Array
  private rowStride: number

  constructor(
    private image: RgbaImage,
    private radius: number
  ) {
    const { width, height, data } = image
    this.rowStride = (width + 1) * 3
    this.sums = new Float64Array(this.rowStride * (height + 1))

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4
        const alpha = data[i + 3]
        const here = (y + 1) * this.rowStride + (x + 1) * 3
        const up = y * this.rowStride + (x + 1) * 3
        const left = (y + 1) * this.rowStride + x * 3
        const upLeft = y * this.rowStride + x * 3

        for (let c = 0; c < 3; c++) {
          this.sums[here + c] =
            onWhite(data[i + c], alpha) +
            this.sums[up + c] +
            this.sums[left + c] -
            this.sums[upLeft + c]
        }
      }
    }
  }

  /** Mean colour of the box centred on (x, y), clipped to the image. */
  mean(x: number, y: number, into: Float64Array) {
    const { width, height } = this.image
    const x0 = Math.max(0, x - this.radius)
    const y0 = Math.max(0, y - this.radius)
    const x1 = Math.min(width - 1, x + this.radius) + 1
    const y1 = Math.min(height - 1, y + this.radius) + 1
    const count = (x1 - x0) * (y1 - y0)

    const bottomRight = y1 * this.rowStride + x1 * 3
    const topRight = y0 * this.rowStride + x1 * 3
    const bottomLeft = y1 * this.rowStride + x0 * 3
    const topLeft = y0 * this.rowStride + x0 * 3

    for (let c = 0; c < 3; c++) {
      into[c] =
        (this.sums[bottomRight + c] -
          this.sums[topRight + c] -
          this.sums[bottomLeft + c] +
          this.sums[topLeft + c]) /
        count
    }
  }
}

/**
 * True if some pixel within `radius` of (x, y) in `other` is within
 * `maxDelta` of the pixel at `index` in `source`. A difference that can be
 * explained this way is a shifted edge, not a different picture.
 */
function hasNearbyMatch(
  source: Uint8ClampedArray,
  index: number,
  other: Uint8ClampedArray,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  maxDelta: number
): boolean {
  const minX = Math.max(0, x - radius)
  const maxX = Math.min(width - 1, x + radius)
  const minY = Math.max(0, y - radius)
  const maxY = Math.min(height - 1, y + radius)

  for (let ny = minY; ny <= maxY; ny++) {
    for (let nx = minX; nx <= maxX; nx++) {
      const otherIndex = (ny * width + nx) * 4
      if (colorDelta(source, index, other, otherIndex) <= maxDelta) return true
    }
  }
  return false
}

/**
 * Compare two images. Optionally writes a visualisation into `diff`: the
 * expected image faded out, with tolerated differences in yellow and
 * significant ones in red.
 */
export function compareImages(
  expected: RgbaImage,
  actual: RgbaImage,
  options: Partial<CompareOptions> = {},
  diff?: Uint8ClampedArray
): CompareResult {
  const {
    colorTolerance,
    shiftTolerance,
    structureRadius,
    structureTolerance,
    threshold,
  } = { ...defaultCompareOptions, ...options }

  if (expected.width !== actual.width || expected.height !== actual.height) {
    throw new Error(
      `Image sizes differ: expected ${expected.width}x${expected.height}, got ${actual.width}x${actual.height}`
    )
  }

  const { width, height } = expected
  const totalPixels = width * height
  const maxDelta = colorTolerance * colorTolerance
  const maxMeanDelta = structureTolerance * structureTolerance

  let changedPixels = 0
  let significantPixels = 0
  let worstDelta = 0

  const expectedMeans =
    structureRadius > 0 ? new BoxMeans(expected, structureRadius) : undefined
  const actualMeans =
    structureRadius > 0 ? new BoxMeans(actual, structureRadius) : undefined
  const expectedMean = new Float64Array(3)
  const actualMean = new Float64Array(3)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4
      const delta = colorDelta(expected.data, index, actual.data, index)

      if (delta <= maxDelta) {
        if (diff) writeFaded(expected.data, index, diff)
        continue
      }

      changedPixels++

      // A difference is forgiven only if it works both ways: the expected
      // pixel appears somewhere nearby in the actual image *and* vice versa.
      // One way alone would forgive a shape appearing out of nowhere next to
      // an existing edge.
      const shifted =
        shiftTolerance > 0 &&
        hasNearbyMatch(
          expected.data,
          index,
          actual.data,
          x,
          y,
          width,
          height,
          shiftTolerance,
          maxDelta
        ) &&
        hasNearbyMatch(
          actual.data,
          index,
          expected.data,
          x,
          y,
          width,
          height,
          shiftTolerance,
          maxDelta
        )

      if (shifted) {
        if (diff) writePixel(diff, index, 255, 220, 0)
        continue
      }

      // Last chance: if the neighbourhood as a whole still looks the same,
      // this is detail being drawn differently rather than a different
      // picture. Text is where this matters — a glyph is mostly edge, and
      // different platforms rasterise edges differently.
      if (expectedMeans && actualMeans) {
        expectedMeans.mean(x, y, expectedMean)
        actualMeans.mean(x, y, actualMean)
        const meanDelta = rgbDelta(
          expectedMean[0],
          expectedMean[1],
          expectedMean[2],
          actualMean[0],
          actualMean[1],
          actualMean[2]
        )
        if (meanDelta <= maxMeanDelta) {
          if (diff) writePixel(diff, index, 255, 220, 0)
          continue
        }
      }

      significantPixels++
      worstDelta = Math.max(worstDelta, Math.sqrt(delta))
      if (diff) writePixel(diff, index, 255, 0, 0)
    }
  }

  const similarity = 1 - significantPixels / totalPixels

  return {
    width,
    height,
    totalPixels,
    changedPixels,
    significantPixels,
    similarity,
    maxDelta: worstDelta,
    passed: similarity >= threshold,
  }
}

function writePixel(
  target: Uint8ClampedArray,
  index: number,
  r: number,
  g: number,
  b: number
) {
  target[index] = r
  target[index + 1] = g
  target[index + 2] = b
  target[index + 3] = 255
}

function writeFaded(
  source: Uint8ClampedArray,
  index: number,
  target: Uint8ClampedArray
) {
  const alpha = source[index + 3]
  // 10% of the original, on white: enough to see the shape, not enough to
  // confuse with the highlighted differences.
  const faded = (channel: number) => 255 - (255 - onWhite(channel, alpha)) * 0.1
  writePixel(
    target,
    index,
    faded(source[index]),
    faded(source[index + 1]),
    faded(source[index + 2])
  )
}
