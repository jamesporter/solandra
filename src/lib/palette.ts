export type Point3D = [number, number, number]

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

function colourFor(t: number, a: Point3D, b: Point3D, c: Point3D, d: Point3D) {
  const r = a[0] + b[0] * Math.cos(2 * Math.PI * (c[0] * t + d[0]))
  const g = a[1] + b[1] * Math.cos(2 * Math.PI * (c[1] * t + d[1]))
  const bl = a[2] + b[2] * Math.cos(2 * Math.PI * (c[2] * t + d[2]))

  return rgbToHSL(r, g, bl)
}

// following https://iquilezles.org/articles/palettes/ which is really tailored to shaders, but even if a bit inefficient as we'd typically generate a one time finite palette it should be a rounding error in many cases
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
    colors.push(colourFor(i / steps, a, b, c, d))
  }
  return colors
}

export function palettePreset(preset: Preset, steps: number) {
  return palette({
    ...presets[preset],
    steps,
  })
}

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
} satisfies Record<string, { a: Point3D; b: Point3D; c: Point3D; d: Point3D }>

export type Preset = keyof typeof presets
