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
}): ThemeColorable => {
  const dH = h2 - h1
  return (n: number) => ({
    h: h1 + (dH * n) / steps,
    s,
    l,
    a,
  })
}

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
}): ThemeColorable => {
  const dS = s2 - s1
  return (n: number) => ({
    h,
    s: s1 + (dS * n) / steps,
    l,
    a,
  })
}

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
}): ThemeColorable => {
  const dL = l2 - l1
  return (n: number) => ({
    h,
    s,
    l: l1 + (dL * n) / steps,
    a,
  })
}

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
}): ThemeColorable => {
  const dA = a2 - a1
  return (n: number) => ({
    h,
    s,
    l,
    a: a1 + (dA * n) / steps,
  })
}
