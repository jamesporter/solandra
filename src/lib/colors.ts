/**
 * Color utilities and theme functions using HSLA color model.
 * @module colors
 */

/**
 * A CSS color string.
 */
type Color = string

/**
 * Converts HSLA color values to a CSS color string.
 *
 * @param h - Hue (0 to 360 degrees)
 * @param s - Saturation (0 to 100 percent)
 * @param l - Lightness (0 to 100 percent)
 * @param a - Alpha/opacity (0 to 1, default: 1)
 * @returns CSS HSLA color string
 * @example
 * ```ts
 * const red = hsla(0, 100, 50) // "hsla(0, 100%, 50%, 1)"
 * const semiTransparentBlue = hsla(240, 100, 50, 0.5) // "hsla(240, 100%, 50%, 0.5)"
 * ```
 */
export function hsla(h: number, s: number, l: number, a: number = 1): Color {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`
}

/**
 * Color specification using HSLA components.
 */
export type ColorSpec = { h: number; s: number; l: number; a?: number }

/**
 * Function that returns a color at a given step/position.
 * Used for creating color themes and gradients.
 */
export interface ThemeColorable {
  (at: number): ColorSpec
}

/**
 * Creates a simple linear gradient between two colors over a number of steps.
 *
 * @param a - Starting color
 * @param b - Ending color
 * @param steps - Number of steps in the gradient
 * @returns A function that returns the interpolated color at step n
 * @example
 * ```ts
 * const gradient = simpleLinearGradient(
 *   { h: 0, s: 100, l: 50 },    // Red
 *   { h: 240, s: 100, l: 50 },  // Blue
 *   10
 * )
 *
 * s.forTiling({ n: 10 }, ([x, y], [w, h], _, i) => {
 *   const { h, s, l, a } = gradient(i)
 *   s.setFillColor(h, s, l, a)
 *   s.fill(new Rect({ at: [x, y], w, h }))
 * })
 * ```
 */
export const simpleLinearGradient = (
  a: ColorSpec,
  b: ColorSpec,
  steps: number
): ThemeColorable => {
  const dH = b.h - a.h
  const dS = b.s - a.s
  const dL = b.l - a.l
  const a1 = typeof a.a === "undefined" ? 1 : a.a
  const a2 = typeof b.a === "undefined" ? 1 : b.a
  const dA = a2 - a1

  return (n: number) => ({
    h: a.h + (dH * n) / steps,
    s: a.s + (dS * n) / steps,
    l: a.l + (dL * n) / steps,
    a: a1 + (dA * n) / steps,
  })
}

/**
 * Creates a color gradient that varies only in hue.
 * Saturation, lightness, and alpha remain constant.
 *
 * @param config - Configuration
 * @param config.h1 - Starting hue (0-360)
 * @param config.h2 - Ending hue (0-360)
 * @param config.s - Constant saturation (0-100)
 * @param config.l - Constant lightness (0-100)
 * @param config.a - Constant alpha (0-1, default: 1)
 * @param config.steps - Number of steps
 * @returns A function that returns the color at step n
 * @example
 * ```ts
 * // Rainbow gradient with constant saturation and lightness
 * const rainbow = hueRange({ h1: 0, h2: 360, s: 70, l: 50, steps: 12 })
 *
 * s.forTiling({ n: 12 }, ([x, y], [w, h], _, i) => {
 *   const { h, s, l } = rainbow(i)
 *   s.setFillColor(h, s, l)
 *   s.fill(new Rect({ at: [x, y], w, h }))
 * })
 * ```
 */
export const hueRange = ({
  h1,
  h2,
  s,
  l,
  a = 1,
  steps,
}: {
  h1: number
  h2: number
  s: number
  l: number
  a?: number
  steps: number
}): ThemeColorable =>
  simpleLinearGradient({ h: h1, s, l, a }, { h: h2, s, l, a }, steps)

/**
 * Creates a color gradient that varies only in saturation.
 * Hue, lightness, and alpha remain constant.
 *
 * @param config - Configuration
 * @param config.h - Constant hue (0-360)
 * @param config.s1 - Starting saturation (0-100)
 * @param config.s2 - Ending saturation (0-100)
 * @param config.l - Constant lightness (0-100)
 * @param config.a - Constant alpha (0-1, default: 1)
 * @param config.steps - Number of steps
 * @returns A function that returns the color at step n
 * @example
 * ```ts
 * // From muted to vibrant red
 * const satGradient = saturationRange({ h: 0, s1: 20, s2: 100, l: 50, steps: 10 })
 * ```
 */
export const saturationRange = ({
  h,
  s1,
  s2,
  l,
  a = 1,
  steps,
}: {
  h: number
  s1: number
  s2: number
  l: number
  a?: number
  steps: number
}): ThemeColorable =>
  simpleLinearGradient({ h, s: s1, l, a }, { h, s: s2, l, a }, steps)

/**
 * Creates a color gradient that varies only in lightness.
 * Hue, saturation, and alpha remain constant.
 *
 * @param config - Configuration
 * @param config.h - Constant hue (0-360)
 * @param config.s - Constant saturation (0-100)
 * @param config.l1 - Starting lightness (0-100)
 * @param config.l2 - Ending lightness (0-100)
 * @param config.a - Constant alpha (0-1, default: 1)
 * @param config.steps - Number of steps
 * @returns A function that returns the color at step n
 * @example
 * ```ts
 * // From dark to light blue
 * const lightGradient = lightnessRange({ h: 240, s: 70, l1: 20, l2: 80, steps: 10 })
 * ```
 */
export const lightnessRange = ({
  h,
  s,
  l1,
  l2,
  a = 1,
  steps,
}: {
  h: number
  s: number
  l1: number
  l2: number
  a?: number
  steps: number
}): ThemeColorable =>
  simpleLinearGradient({ h, s, l: l1, a }, { h, s, l: l2, a }, steps)

/**
 * Creates a color gradient that varies only in alpha (opacity).
 * Hue, saturation, and lightness remain constant.
 *
 * @param config - Configuration
 * @param config.h - Constant hue (0-360)
 * @param config.s - Constant saturation (0-100)
 * @param config.l - Constant lightness (0-100)
 * @param config.a1 - Starting alpha (0-1)
 * @param config.a2 - Ending alpha (0-1)
 * @param config.steps - Number of steps
 * @returns A function that returns the color at step n
 * @example
 * ```ts
 * // From transparent to opaque red
 * const fadeIn = alphaRange({ h: 0, s: 100, l: 50, a1: 0, a2: 1, steps: 10 })
 *
 * s.forTiling({ n: 10 }, ([x, y], [w, h], _, i) => {
 *   const { h, s, l, a } = fadeIn(i)
 *   s.setFillColor(h, s, l, a)
 *   s.fill(new Rect({ at: [x, y], w, h }))
 * })
 * ```
 */
export const alphaRange = ({
  h,
  s,
  l,
  a1,
  a2,
  steps,
}: {
  h: number
  s: number
  l: number
  a1: number
  a2: number
  steps: number
}): ThemeColorable =>
  simpleLinearGradient({ h, s, l, a: a1 }, { h, s, l, a: a2 }, steps)
