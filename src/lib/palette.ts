/**
 * Procedural color palette generation using cosine gradients.
 * Based on Inigo Quilez's technique: https://iquilezles.org/articles/palettes/
 * @module palette
 */

/**
 * A 3D point used for RGB color component values.
 */
export type Point3D = [number, number, number]

/**
 * Converts RGB color values to HSL color space.
 * @internal
 */
function rgbToHSL(
  r: number,
  g: number,
  b: number
): [h: number, s: number, l: number] {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h * 360, s * 100, l * 100]
}

/**
 * Calculates a color at position t using cosine palette formula.
 * @internal
 */
function colourFor(t: number, a: Point3D, b: Point3D, c: Point3D, d: Point3D) {
  const r = a[0] + b[0] * Math.cos(2 * Math.PI * (c[0] * t + d[0]))
  const g = a[1] + b[1] * Math.cos(2 * Math.PI * (c[1] * t + d[1]))
  const bl = a[2] + b[2] * Math.cos(2 * Math.PI * (c[2] * t + d[2]))

  return rgbToHSL(r, g, bl)
}

/**
 * Generates a procedural color palette using cosine gradients.
 * The formula uses four 3D vectors (a, b, c, d) to create smooth color variations.
 * Based on Inigo Quilez's technique for shader-based palettes.
 *
 * Formula: `color(t) = a + b * cos(2π * (c * t + d))`
 *
 * @param config - Palette configuration
 * @param config.a - Offset/bias values for RGB channels
 * @param config.b - Amplitude values for RGB channels
 * @param config.c - Frequency values for RGB channels
 * @param config.d - Phase shift values for RGB channels
 * @param config.steps - Number of colors to generate
 * @returns Array of [hue, saturation, lightness] color tuples
 * @example
 * ```ts
 * // Create a custom rainbow palette with 10 colors
 * const colors = palette({
 *   a: [0.5, 0.5, 0.5],
 *   b: [0.5, 0.5, 0.5],
 *   c: [1.0, 1.0, 1.0],
 *   d: [0.0, 0.33, 0.67],
 *   steps: 10
 * })
 *
 * // Use in a sketch
 * s.forTiling({ n: 10 }, ([x, y], [w, h], _, i) => {
 *   const [h, s, l] = colors[i % colors.length]
 *   s.setFillColor(h, s, l)
 *   s.fill(new Rect({ at: [x, y], w, h }))
 * })
 * ```
 */
export function palette({
  a,
  b,
  c,
  d,
  steps,
}: {
  a: Point3D
  b: Point3D
  c: Point3D
  d: Point3D
  steps: number
}) {
  const colors = []
  for (let i = 0; i < steps; i++) {
    // I don't want to include 2 ends as they will be same colour
    colors.push(colourFor(i / steps, a, b, c, d))
  }
  return colors
}

/**
 * Generates a color palette using a named preset.
 * Provides convenient access to curated color palettes without needing to specify parameters.
 *
 * Available presets:
 * - `rainbow` - Full spectrum rainbow colors
 * - `warmth` - Warm reds, oranges, yellows
 * - `rusty` - Rustic earth tones
 * - `autumnal` - Autumn-inspired oranges and browns
 * - `natural` - Natural greens and earth tones
 * - `neon` - Bright neon colors
 * - `subtle` - Muted, subtle color variations
 *
 * @param preset - The name of the preset palette
 * @param steps - Number of colors to generate from the palette
 * @returns Array of [hue, saturation, lightness] color tuples
 * @example
 * ```ts
 * // Generate a warm color palette with 8 colors
 * const warmColors = palettePreset("warmth", 8)
 *
 * // Use in art
 * s.forTiling({ n: 8 }, ([x, y], [w, h], _, i) => {
 *   const [h, s, l] = warmColors[i]
 *   s.setFillColor(h, s, l)
 *   s.fill(new Rect({ at: [x, y], w, h }))
 * })
 *
 * // Try different presets
 * const neonColors = palettePreset("neon", 5)
 * const naturalColors = palettePreset("natural", 12)
 * ```
 */
export function palettePreset(preset: Preset, steps: number) {
  return palette(
    // @ts-expect-error
    {
      ...presets[preset],
      steps,
    }
  )
}

/**
 * Predefined palette configurations.
 * @internal
 */
const presets = {
  rainbow: {
    a: [0.5, 0.5, 0.5],
    b: [0.5, 0.5, 0.5],
    c: [1.0, 1.0, 1.0],
    d: [0.0, 0.33, 0.67],
  },
  warmth: {
    a: [0.5, 0.5, 0.5],
    b: [0.5, 0.5, 0.5],
    c: [1.0, 1.0, 1.0],
    d: [0.0, 0.1, 0.2],
  },
  rusty: {
    a: [0.5, 0.5, 0.5],
    b: [0.5, 0.5, 0.5],
    c: [1.0, 1.0, 1.0],
    d: [0.3, 0.2, 0.2],
  },
  autumnal: {
    a: [0.5, 0.5, 0.5],
    b: [0.5, 0.5, 0.5],
    c: [1.0, 1.0, 0.5],
    d: [0.8, 0.9, 0.3],
  },
  natural: {
    a: [0.5, 0.5, 0.5],
    b: [0.5, 0.5, 0.5],
    c: [1.0, 0.7, 0.4],
    d: [0.0, 0.15, 0.2],
  },
  neon: {
    a: [0.5, 0.5, 0.5],
    b: [0.5, 0.5, 0.5],
    c: [2.0, 1.0, 0.0],
    d: [0.5, 0.2, 0.25],
  },
  subtle: {
    a: [0.8, 0.5, 0.4],
    b: [0.2, 0.4, 0.2],
    c: [2.0, 1.0, 1.0],
    d: [0.0, 0.25, 0.25],
  },
}

/**
 * Valid preset palette names.
 * One of: "rainbow" | "warmth" | "rusty" | "autumnal" | "natural" | "neon" | "subtle"
 */
export type Preset = keyof typeof presets
