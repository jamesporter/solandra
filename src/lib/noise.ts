/**
 * 2D Perlin noise implementation for organic, natural-looking randomness.
 * Adapted from public domain code: https://github.com/josephg/noisejs/blob/master/perlin.js
 * @module noise
 */

import { dot } from "./vectors.js"

/**
 * Smoothstep interpolation function for Perlin noise.
 * @internal
 */
function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

/**
 * Linear interpolation between two values.
 * @internal
 */
function lerp(a: number, b: number, t: number) {
  return (1 - t) * a + t * b
}

/**
 * Gradient vectors for Perlin noise.
 * @internal
 */
const grad3 = [
  [1, 1, 0],
  [-1, 1, 0],
  [1, -1, 0],
  [-1, -1, 0],
  [1, 0, 1],
  [-1, 0, 1],
  [1, 0, -1],
  [-1, 0, -1],
  [0, 1, 1],
  [0, -1, 1],
  [0, 1, -1],
  [0, -1, -1],
]

var p = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
  36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234,
  75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237,
  149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48,
  27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105,
  92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73,
  209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
  164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38,
  147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189,
  28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101,
  155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
  178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
  191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
  181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
  138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215,
  61, 156, 180,
]

/**
 * Permutation table for noise generation.
 * @internal
 */
const perm: number[] = Array.from({ length: 512 })

/**
 * Gradient permutation table.
 * @internal
 */
const gradP: any[] = Array.from({ length: 512 })

/**
 * Seeds the noise function for reproducible results.
 * @internal
 */
function seedNoise(seed: number) {
  if (seed > 0 && seed < 1) {
    seed *= 65536
  }

  seed = Math.floor(seed)
  if (seed < 256) {
    seed |= seed << 8
  }

  for (var i = 0; i < 256; i++) {
    var v
    if (i & 1) {
      v = p[i] ^ (seed & 255)
    } else {
      v = p[i] ^ ((seed >> 8) & 255)
    }

    perm[i] = perm[i + 256] = v
    gradP[i] = gradP[i + 256] = grad3[v % 12]
  }
}

seedNoise(0)

/**
 * Generates 2D Perlin noise at the given coordinates.
 * Returns smooth, continuous noise values useful for organic patterns and textures.
 * The output range is approximately -1 to 1, though values at the extremes are rare.
 *
 * @param ax - X coordinate (can be any real number)
 * @param ay - Y coordinate (can be any real number)
 * @returns A noise value approximately in the range [-1, 1]
 * @example
 * ```ts
 * // Create organic terrain heights
 * s.forTiling({ n: 20 }, ([x, y], [w, h], [cx, cy]) => {
 *   const noiseVal = perlin2(cx * 10, cy * 10) // Scale coordinates for detail
 *   const height = (noiseVal + 1) * 0.5 // Normalize to 0-1
 *   s.setFillColor(120, 50, height * 50 + 25) // Green gradient
 *   s.fill(new Rect({ at: [x, y], w, h }))
 * })
 *
 * // Organic displacement of points
 * s.forGrid({ minX: 0, maxX: 10, minY: 0, maxY: 10 }, ([x, y]) => {
 *   const dx = perlin2(x * 0.5, y * 0.5) * 0.05
 *   const dy = perlin2(x * 0.5 + 100, y * 0.5 + 100) * 0.05
 *   s.fill(new Circle({ at: [x * 0.1 + dx, y * 0.1 + dy], r: 0.01 }))
 * })
 * ```
 */
export function perlin2(ax: number, ay: number) {
  let X = Math.floor(ax)
  let Y = Math.floor(ay)

  let x = ax - X
  let y = ay - Y

  X = X & 255
  Y = Y & 255

  // Calculate noise contributions from each of the four corners
  var n00 = dot(gradP[X + perm[Y]], [x, y])
  var n01 = dot(gradP[X + perm[Y + 1]], [x, y - 1])
  var n10 = dot(gradP[X + 1 + perm[Y]], [x - 1, y])
  var n11 = dot(gradP[X + 1 + perm[Y + 1]], [x - 1, y - 1])

  const u = fade(x)

  // Interpolate the four results
  return lerp(lerp(n00, n10, u), lerp(n01, n11, u), fade(y))
}

/**
 * Fractal (fractional Brownian motion) noise: several octaves of {@link perlin2}
 * summed together, each at a higher frequency and lower amplitude than the last.
 *
 * Plain Perlin noise is smooth at exactly one scale, which is why hand rolled
 * terrain and cloud textures tend to look soft and samey. Adding octaves keeps
 * the large scale shape whilst piling detail on top of it.
 *
 * The result is scaled by the total amplitude, so it stays in roughly the same
 * range as `perlin2` (approximately [-1, 1]) whatever the settings.
 *
 * @param ax - X coordinate (can be any real number)
 * @param ay - Y coordinate (can be any real number)
 * @param config - Fractal configuration
 * @param config.octaves - How many layers of noise to sum (default: 4). One
 * octave is just `perlin2`; each further octave adds finer detail.
 * @param config.persistence - How much quieter each octave is than the last
 * (default: 0.5). Higher is rougher, lower is smoother.
 * @param config.lacunarity - How much finer each octave is than the last
 * (default: 2, i.e. each octave has twice the frequency)
 * @returns A noise value approximately in the range [-1, 1]
 * @throws Error if fewer than one octave is requested
 * @example
 * ```ts
 * // Cloudy, multi-scale texture rather than smooth blobs
 * s.forTiling({ n: 100, type: "square" }, ([x, y], [dX, dY]) => {
 *   const n = fbm2(x * 4, y * 4, { octaves: 5 })
 *   s.setFillColor(210, 40, 50 + n * 40)
 *   s.fill(new Rect({ at: [x, y], w: dX, h: dY }))
 * })
 *
 * // Rougher (more high frequency detail)
 * fbm2(x, y, { octaves: 6, persistence: 0.7 })
 * ```
 */
export function fbm2(
  ax: number,
  ay: number,
  config: {
    octaves?: number
    persistence?: number
    lacunarity?: number
  } = {}
): number {
  const { octaves = 4, persistence = 0.5, lacunarity = 2 } = config
  const n = Math.floor(octaves)
  if (n < 1)
    throw new Error(
      `Must have at least one octave, octaves was set to ${octaves}`
    )

  let total = 0
  // the first octave always has amplitude 1, so this can never be zero
  let totalAmplitude = 0
  let amplitude = 1
  let frequency = 1

  for (let i = 0; i < n; i++) {
    total += amplitude * perlin2(ax * frequency, ay * frequency)
    totalAmplitude += Math.abs(amplitude)
    amplitude *= persistence
    frequency *= lacunarity
  }

  return total / totalAmplitude
}

/**
 * Curl noise: a smooth vector field derived from {@link fbm2}, in which
 * nothing ever converges or piles up.
 *
 * The obvious way to make a flow field is to take a noise value as an angle,
 * but such fields have sources and sinks: follow them and everything drains
 * into the same few places. This instead takes the noise as a stream function
 * and returns its curl, `(∂n/∂y, -∂n/∂x)`, which is divergence free, so lines
 * following it swirl around each other indefinitely without collapsing
 * together.
 *
 * The vector's direction is what matters; its magnitude depends on how fast
 * the underlying noise is changing. `SimplePath.flowLine` normalizes it, and
 * `v.normalize` will do the same by hand.
 *
 * @param ax - X coordinate (can be any real number)
 * @param ay - Y coordinate (can be any real number)
 * @param config - Configuration
 * @param config.epsilon - The step used to take the numerical derivative
 * (default: 0.0001). Larger smooths the field out, much smaller loses
 * precision.
 * @param config.octaves - Octaves of the underlying noise (default: 1, i.e.
 * plain `perlin2`). More octaves give a more turbulent field.
 * @param config.persistence - How much quieter each octave is (default: 0.5)
 * @param config.lacunarity - How much finer each octave is (default: 2)
 * @returns A vector [x, y], the curl of the noise at that point
 * @example
 * ```ts
 * // Draw the field itself: a short line in the flow direction at each point
 * s.forTiling({ n: 25, type: "square" }, ([x, y], [dX], [cX, cY]) => {
 *   const [uX, uY] = v.normalize(curl2(cX * 3, cY * 3))
 *   s.draw(SimplePath.withPoints([[cX, cY], [cX + uX * dX, cY + uY * dX]]))
 * })
 *
 * // More turbulent
 * curl2(x, y, { octaves: 4 })
 * ```
 */
export function curl2(
  ax: number,
  ay: number,
  config: {
    epsilon?: number
    octaves?: number
    persistence?: number
    lacunarity?: number
  } = {}
): [number, number] {
  const { epsilon = 0.0001, octaves = 1, persistence, lacunarity } = config

  const n = (x: number, y: number) =>
    fbm2(x, y, { octaves, persistence, lacunarity })

  const dNdX = (n(ax + epsilon, ay) - n(ax - epsilon, ay)) / (2 * epsilon)
  const dNdY = (n(ax, ay + epsilon) - n(ax, ay - epsilon)) / (2 * epsilon)

  return [dNdY, -dNdX]
}

/**
 * Which of the distances to the feature points around a point {@link worley2}
 * should report.
 */
export type WorleyFeature = "f1" | "f2" | "difference"

/**
 * How distance is measured for {@link worley2}. Euclidean gives round cells,
 * Manhattan diamonds, Chebyshev squares.
 */
export type WorleyMetric = "euclidean" | "manhattan" | "chebyshev"

/**
 * Configuration shared by {@link worley2} and {@link worleyCell2}.
 */
type WorleyConfig = {
  /**
   * How far a cell's feature point may stray from the middle of its cell, 0
   * (a perfectly regular grid) to 1 (anywhere in the cell). Default 1.
   */
  jitter?: number
  /** How distance is measured (default: "euclidean") */
  metric?: WorleyMetric
}

/**
 * The feature point belonging to the cell at integer coordinates (i, j), and
 * a stable hash of that cell.
 *
 * The hash comes from the same permutation table as `perlin2`, so a cell
 * always gets the same point and the same id, without anything having to be
 * stored.
 * @internal
 */
function worleyPoint(i: number, j: number, jitter: number) {
  const hA = perm[(i & 255) + perm[j & 255]]
  const hB = perm[(j & 255) + perm[(i + 149) & 255]]
  return {
    // jitter of 1 puts the point anywhere in the cell, 0 in the middle of it
    at: [
      i + 0.5 + jitter * (hA / 255 - 0.5),
      j + 0.5 + jitter * (hB / 255 - 0.5),
    ] as [number, number],
    id: hA * 256 + hB,
  }
}

/**
 * Distance under one of the {@link WorleyMetric}s.
 * @internal
 */
function worleyDistance(dX: number, dY: number, metric: WorleyMetric): number {
  switch (metric) {
    case "manhattan":
      return Math.abs(dX) + Math.abs(dY)
    case "chebyshev":
      return Math.max(Math.abs(dX), Math.abs(dY))
    default:
      return Math.sqrt(dX * dX + dY * dY)
  }
}

/**
 * The nearest feature point to a point, and the two smallest distances.
 * @internal
 */
function worleyNearest(
  ax: number,
  ay: number,
  config: WorleyConfig = {}
): {
  f1: number
  f2: number
  cell: [number, number]
  at: [number, number]
  id: number
} {
  const { jitter = 1, metric = "euclidean" } = config
  if (jitter < 0 || jitter > 1)
    throw new Error(`Jitter must be between 0 and 1, was ${jitter}`)

  const cX = Math.floor(ax)
  const cY = Math.floor(ay)

  let f1 = Infinity
  let f2 = Infinity
  let cell: [number, number] = [cX, cY]
  let at: [number, number] = [ax, ay]
  let id = 0

  // a feature point never leaves its own cell, so the neighbours are enough
  for (let i = cX - 1; i <= cX + 1; i++) {
    for (let j = cY - 1; j <= cY + 1; j++) {
      const point = worleyPoint(i, j, jitter)
      const d = worleyDistance(point.at[0] - ax, point.at[1] - ay, metric)
      if (d < f1) {
        f2 = f1
        f1 = d
        cell = [i, j]
        at = point.at
        id = point.id
      } else if (d < f2) {
        f2 = d
      }
    }
  }

  return { f1, f2, cell, at, id }
}

/**
 * Worley (cellular) noise: space divided into cells, each with a feature point
 * somewhere inside it, and the value at a point given by how far away the
 * nearest of those points is.
 *
 * Where `perlin2` gives soft clouds, this gives structure - scales, cobbles,
 * cracked mud, stained glass, cells under a microscope. Coordinates are in
 * cells, so `worley2(x * 8, y * 8)` puts eight cells across the canvas.
 *
 * `"difference"` (the distance to the second nearest point minus the distance
 * to the nearest) is the useful one for outlines: it falls to zero exactly on
 * the boundaries between cells, drawing the cracks rather than filling the
 * cells.
 *
 * @param ax - X coordinate, in cells (can be any real number)
 * @param ay - Y coordinate, in cells (can be any real number)
 * @param config - Configuration
 * @param config.feature - Which distance to report: `"f1"` (default) the
 * nearest feature point, `"f2"` the second nearest, or `"difference"` the gap
 * between them
 * @param config.jitter - How far a feature point may stray from the middle of
 * its cell, 0 (a regular grid) to 1 (anywhere in the cell, the default)
 * @param config.metric - `"euclidean"` (default) for round cells,
 * `"manhattan"` for diamonds, `"chebyshev"` for squares
 * @returns A distance in cells, roughly in the range [0, 1]
 * @throws Error if jitter is outside [0, 1]
 * @example
 * ```ts
 * // Cobbles: dark in the middle of each cell, light at the edges
 * s.forTiling({ n: 100, type: "square" }, ([x, y], [dX, dY]) => {
 *   const d = worley2(x * 8, y * 8)
 *   s.setFillColor(30, 40, 20 + d * 60)
 *   s.fill(new Rect({ at: [x, y], w: dX, h: dY }))
 * })
 *
 * // Just the cracks between the cells
 * worley2(x * 8, y * 8, { feature: "difference" })
 *
 * // Square cells on a regular grid: a woven, tiled look
 * worley2(x * 8, y * 8, { metric: "chebyshev", jitter: 0.4 })
 * ```
 */
export function worley2(
  ax: number,
  ay: number,
  config: WorleyConfig & { feature?: WorleyFeature } = {}
): number {
  const { feature = "f1" } = config
  const { f1, f2 } = worleyNearest(ax, ay, config)

  switch (feature) {
    case "f2":
      return f2
    case "difference":
      return f2 - f1
    default:
      return f1
  }
}

/**
 * The cell a point falls in, for colouring each cell as a whole rather than
 * shading by distance.
 *
 * Everywhere within one cell gets the same `id` and `at`, so a mosaic can be
 * built by asking for every pixel (or tile) and looking the colour up from the
 * id, and shapes can be placed on the feature points themselves.
 *
 * @param ax - X coordinate, in cells (can be any real number)
 * @param ay - Y coordinate, in cells (can be any real number)
 * @param config - Configuration
 * @param config.jitter - How far a feature point may stray from the middle of
 * its cell, 0 to 1 (default: 1)
 * @param config.metric - How distance is measured (default: "euclidean")
 * @returns The cell's integer coordinates, its feature point, a stable id for
 * it (an integer in [0, 65535], handy modulo something for a colour), and the
 * distances to the nearest and second nearest feature points
 * @throws Error if jitter is outside [0, 1]
 * @example
 * ```ts
 * // A mosaic: every tile takes the colour of the cell it falls in
 * s.forTiling({ n: 120, type: "square" }, ([x, y], [dX, dY], at) => {
 *   const { id } = worleyCell2(at[0] * 7, at[1] * 7)
 *   s.setFillColor(id % 60 + 180, 60, 40 + (id % 30))
 *   s.fill(new Rect({ at: [x, y], w: dX, h: dY }))
 * })
 *
 * // A dot on the feature point of each cell
 * const { at } = worleyCell2(x * 7, y * 7)
 * s.fill(new Circle({ at: [at[0] / 7, at[1] / 7], r: 0.005 }))
 * ```
 */
export function worleyCell2(
  ax: number,
  ay: number,
  config: WorleyConfig = {}
): {
  cell: [number, number]
  at: [number, number]
  id: number
  f1: number
  f2: number
} {
  return worleyNearest(ax, ay, config)
}
