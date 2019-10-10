type Color = string

/**
 * @param h hue 0 to 360
 * @param s saturation 0 to 100
 * @param l lightness 0 to 100
 * @param a alpha 0 to 1
 */
export function hsla(h: number, s: number, l: number, a: number = 1): Color {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`
}

export type ColorSpec = { h: number; s: number; l: number; a?: number }

/*
  Color themes should be able to give a color at a integer stop
*/
export interface ThemeColorable {
  (at: number): ColorSpec
}

export function isColorSpec(arg: number | ColorSpec): arg is ColorSpec {
  return !(typeof arg === "number")
}

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
