import { describe, expect, it } from "vitest"
import {
  hsla,
  simpleLinearGradient,
  hueRange,
  saturationRange,
  lightnessRange,
  alphaRange,
  harmony,
  mixColors,
} from "../colors"

describe("colors", () => {
  describe("hsla", () => {
    it("creates an HSLA color string with default alpha", () => {
      expect(hsla(0, 100, 50)).toBe("hsla(0, 100%, 50%, 1)")
    })

    it("creates an HSLA color string with custom alpha", () => {
      expect(hsla(240, 100, 50, 0.5)).toBe("hsla(240, 100%, 50%, 0.5)")
    })

    it("handles full hue range", () => {
      expect(hsla(360, 100, 50)).toBe("hsla(360, 100%, 50%, 1)")
    })

    it("handles zero values", () => {
      expect(hsla(0, 0, 0, 0)).toBe("hsla(0, 0%, 0%, 0)")
    })

    it("handles decimal values", () => {
      expect(hsla(180.5, 75.5, 25.5, 0.75)).toBe(
        "hsla(180.5, 75.5%, 25.5%, 0.75)"
      )
    })
  })

  describe("simpleLinearGradient", () => {
    it("creates a gradient function with correct start color", () => {
      const gradient = simpleLinearGradient(
        { h: 0, s: 100, l: 50 },
        { h: 240, s: 100, l: 50 },
        10
      )
      const startColor = gradient(0)
      expect(startColor.h).toBe(0)
      expect(startColor.s).toBe(100)
      expect(startColor.l).toBe(50)
      expect(startColor.a).toBe(1)
    })

    it("creates a gradient function with correct end color", () => {
      const gradient = simpleLinearGradient(
        { h: 0, s: 100, l: 50 },
        { h: 240, s: 100, l: 50 },
        10
      )
      const endColor = gradient(10)
      expect(endColor.h).toBe(240)
      expect(endColor.s).toBe(100)
      expect(endColor.l).toBe(50)
    })

    it("interpolates middle color correctly", () => {
      const gradient = simpleLinearGradient(
        { h: 0, s: 100, l: 50 },
        { h: 240, s: 100, l: 50 },
        10
      )
      const midColor = gradient(5)
      expect(midColor.h).toBe(120)
      expect(midColor.s).toBe(100)
      expect(midColor.l).toBe(50)
    })

    it("handles alpha interpolation", () => {
      const gradient = simpleLinearGradient(
        { h: 0, s: 100, l: 50, a: 0 },
        { h: 0, s: 100, l: 50, a: 1 },
        10
      )
      expect(gradient(0).a).toBe(0)
      expect(gradient(5).a).toBe(0.5)
      expect(gradient(10).a).toBe(1)
    })

    it("handles missing alpha (defaults to 1)", () => {
      const gradient = simpleLinearGradient(
        { h: 0, s: 100, l: 50 },
        { h: 0, s: 100, l: 50 },
        10
      )
      expect(gradient(0).a).toBe(1)
      expect(gradient(10).a).toBe(1)
    })

    it("interpolates all channels", () => {
      const gradient = simpleLinearGradient(
        { h: 0, s: 0, l: 0, a: 0 },
        { h: 360, s: 100, l: 100, a: 1 },
        10
      )
      const midColor = gradient(5)
      expect(midColor.h).toBe(180)
      expect(midColor.s).toBe(50)
      expect(midColor.l).toBe(50)
      expect(midColor.a).toBe(0.5)
    })
  })

  describe("hueRange", () => {
    it("creates a hue gradient with constant saturation and lightness", () => {
      const hueGradient = hueRange({ h1: 0, h2: 360, s: 70, l: 50, steps: 12 })

      // Start
      const start = hueGradient(0)
      expect(start.h).toBe(0)
      expect(start.s).toBe(70)
      expect(start.l).toBe(50)
      expect(start.a).toBe(1)

      // Middle
      const mid = hueGradient(6)
      expect(mid.h).toBe(180)
      expect(mid.s).toBe(70)
      expect(mid.l).toBe(50)

      // End
      const end = hueGradient(12)
      expect(end.h).toBe(360)
      expect(end.s).toBe(70)
      expect(end.l).toBe(50)
    })

    it("handles custom alpha", () => {
      const hueGradient = hueRange({
        h1: 0,
        h2: 360,
        s: 70,
        l: 50,
        a: 0.5,
        steps: 10,
      })
      expect(hueGradient(0).a).toBe(0.5)
      expect(hueGradient(5).a).toBe(0.5)
    })
  })

  describe("saturationRange", () => {
    it("creates a saturation gradient with constant hue and lightness", () => {
      const satGradient = saturationRange({
        h: 0,
        s1: 20,
        s2: 100,
        l: 50,
        steps: 10,
      })

      // Start
      const start = satGradient(0)
      expect(start.h).toBe(0)
      expect(start.s).toBe(20)
      expect(start.l).toBe(50)

      // Middle
      const mid = satGradient(5)
      expect(mid.h).toBe(0)
      expect(mid.s).toBe(60)
      expect(mid.l).toBe(50)

      // End
      const end = satGradient(10)
      expect(end.h).toBe(0)
      expect(end.s).toBe(100)
      expect(end.l).toBe(50)
    })

    it("handles custom alpha", () => {
      const satGradient = saturationRange({
        h: 0,
        s1: 0,
        s2: 100,
        l: 50,
        a: 0.8,
        steps: 10,
      })
      expect(satGradient(5).a).toBe(0.8)
    })
  })

  describe("lightnessRange", () => {
    it("creates a lightness gradient with constant hue and saturation", () => {
      const lightGradient = lightnessRange({
        h: 240,
        s: 70,
        l1: 20,
        l2: 80,
        steps: 10,
      })

      // Start
      const start = lightGradient(0)
      expect(start.h).toBe(240)
      expect(start.s).toBe(70)
      expect(start.l).toBe(20)

      // Middle
      const mid = lightGradient(5)
      expect(mid.h).toBe(240)
      expect(mid.s).toBe(70)
      expect(mid.l).toBe(50)

      // End
      const end = lightGradient(10)
      expect(end.h).toBe(240)
      expect(end.s).toBe(70)
      expect(end.l).toBe(80)
    })

    it("handles custom alpha", () => {
      const lightGradient = lightnessRange({
        h: 0,
        s: 50,
        l1: 0,
        l2: 100,
        a: 0.3,
        steps: 10,
      })
      expect(lightGradient(5).a).toBe(0.3)
    })
  })

  describe("alphaRange", () => {
    it("creates an alpha gradient with constant color", () => {
      const alphaGradient = alphaRange({
        h: 0,
        s: 100,
        l: 50,
        a1: 0,
        a2: 1,
        steps: 10,
      })

      // Start
      const start = alphaGradient(0)
      expect(start.h).toBe(0)
      expect(start.s).toBe(100)
      expect(start.l).toBe(50)
      expect(start.a).toBe(0)

      // Middle
      const mid = alphaGradient(5)
      expect(mid.a).toBe(0.5)

      // End
      const end = alphaGradient(10)
      expect(end.a).toBe(1)
    })

    it("handles reverse alpha gradient", () => {
      const alphaGradient = alphaRange({
        h: 0,
        s: 100,
        l: 50,
        a1: 1,
        a2: 0,
        steps: 10,
      })
      expect(alphaGradient(0).a).toBe(1)
      expect(alphaGradient(5).a).toBe(0.5)
      expect(alphaGradient(10).a).toBe(0)
    })
  })
})

describe("range helpers", () => {
  it("agree with simpleLinearGradient", () => {
    const steps = 8
    for (let n = 0; n <= steps; n++) {
      expect(
        hueRange({ h1: 20, h2: 300, s: 40, l: 60, a: 0.5, steps })(n)
      ).toEqual(
        simpleLinearGradient(
          { h: 20, s: 40, l: 60, a: 0.5 },
          { h: 300, s: 40, l: 60, a: 0.5 },
          steps
        )(n)
      )
      expect(
        saturationRange({ h: 20, s1: 0, s2: 100, l: 60, steps })(n)
      ).toEqual(
        simpleLinearGradient(
          { h: 20, s: 0, l: 60, a: 1 },
          { h: 20, s: 100, l: 60, a: 1 },
          steps
        )(n)
      )
      expect(
        lightnessRange({ h: 20, s: 40, l1: 10, l2: 90, steps })(n)
      ).toEqual(
        simpleLinearGradient(
          { h: 20, s: 40, l: 10, a: 1 },
          { h: 20, s: 40, l: 90, a: 1 },
          steps
        )(n)
      )
      expect(
        alphaRange({ h: 20, s: 40, l: 60, a1: 0, a2: 1, steps })(n)
      ).toEqual(
        simpleLinearGradient(
          { h: 20, s: 40, l: 60, a: 0 },
          { h: 20, s: 40, l: 60, a: 1 },
          steps
        )(n)
      )
    }
  })
})

describe("harmony", () => {
  const base = { h: 210, s: 70, l: 50 }

  it("starts with the colour it was given", () => {
    expect(harmony(base)[0]).toEqual({ h: 210, s: 70, l: 50 })
  })

  it("puts the complement opposite by default", () => {
    expect(harmony(base)).toEqual([
      { h: 210, s: 70, l: 50 },
      { h: 30, s: 70, l: 50 },
    ])
  })

  it("spaces a triad evenly round the circle", () => {
    expect(harmony({ h: 0, s: 70, l: 50 }, { type: "triadic" })).toEqual([
      { h: 0, s: 70, l: 50 },
      { h: 120, s: 70, l: 50 },
      { h: 240, s: 70, l: 50 },
    ])
  })

  it("makes a tetrad of two complementary pairs", () => {
    const colors = harmony({ h: 20, s: 70, l: 50 }, { type: "tetradic" })
    expect(colors.map((c) => c.h)).toEqual([20, 110, 200, 290])
  })

  it("splits the complement either side", () => {
    const colors = harmony(base, { type: "splitComplementary", spread: 20 })
    expect(colors.map((c) => c.h)).toEqual([210, 10, 50])
  })

  it("takes neighbouring hues either side for an analogous scheme", () => {
    const colors = harmony(base, { type: "analogous", n: 5, spread: 10 })
    expect(colors.map((c) => c.h)).toEqual([210, 220, 200, 230, 190])
  })

  it("varies lightness rather than hue for a monochrome scheme", () => {
    const colors = harmony(base, { type: "monochrome", n: 3, spread: 40 })
    expect(colors).toEqual([
      { h: 210, s: 70, l: 30 },
      { h: 210, s: 70, l: 50 },
      { h: 210, s: 70, l: 70 },
    ])
  })

  it("keeps a monochrome scheme within the range lightness has", () => {
    const colors = harmony({ h: 0, s: 50, l: 95 }, { type: "monochrome" })
    colors.forEach(({ l }) => {
      expect(l).toBeGreaterThanOrEqual(0)
      expect(l).toBeLessThanOrEqual(100)
    })
  })

  it("wraps hues back into 0 to 360", () => {
    const colors = harmony({ h: 350, s: 70, l: 50 }, { type: "triadic" })
    colors.forEach(({ h }) => {
      expect(h).toBeGreaterThanOrEqual(0)
      expect(h).toBeLessThan(360)
    })
    expect(colors.map((c) => c.h)).toEqual([350, 110, 230])
  })

  it("carries saturation, lightness and alpha over from the base colour", () => {
    const colors = harmony(
      { h: 100, s: 33, l: 66, a: 0.5 },
      { type: "triadic" }
    )
    colors.forEach(({ s, l, a }) => {
      expect(s).toBe(33)
      expect(l).toBe(66)
      expect(a).toBe(0.5)
    })
  })

  it("gives as many colours as asked for", () => {
    expect(harmony(base, { type: "analogous", n: 1 })).toHaveLength(1)
    expect(harmony(base, { type: "analogous", n: 4 })).toHaveLength(4)
    expect(harmony(base, { type: "monochrome", n: 1 })).toEqual([base])
    expect(harmony(base, { type: "monochrome", n: 8 })).toHaveLength(8)
  })

  it("throws if asked for no colours at all", () => {
    expect(() => harmony(base, { type: "analogous", n: 0 })).toThrow()
    expect(() => harmony(base, { type: "monochrome", n: 0 })).toThrow()
  })
})

describe("mixColors", () => {
  const red = { h: 0, s: 100, l: 50 }
  const blue = { h: 240, s: 50, l: 30 }

  it("mixes evenly by default", () => {
    expect(
      mixColors({ h: 0, s: 0, l: 0, a: 0 }, { h: 100, s: 50, l: 80, a: 1 })
    ).toEqual({ h: 50, s: 25, l: 40, a: 0.5 })
  })

  it("returns the ends at 0 and 1", () => {
    expect(mixColors(red, blue, 0)).toEqual({ ...red, a: 1 })
    expect(mixColors(red, blue, 1)).toEqual({ ...blue, a: 1 })
  })

  it("takes the short way round the hue circle", () => {
    expect(mixColors({ h: 350, s: 80, l: 50 }, { h: 10, s: 80, l: 50 }).h).toBe(
      0
    )
    expect(mixColors({ h: 10, s: 80, l: 50 }, { h: 350, s: 80, l: 50 }).h).toBe(
      0
    )
    // exactly opposite colours are a tie, and turn the increasing way
    expect(mixColors({ h: 0, s: 80, l: 50 }, { h: 180, s: 80, l: 50 }).h).toBe(
      90
    )
  })

  it("always gives a hue in 0 to 360", () => {
    for (const p of [-1, -0.25, 0.5, 1.5, 3]) {
      const { h } = mixColors(
        { h: 20, s: 50, l: 50 },
        { h: 300, s: 50, l: 50 },
        p
      )
      expect(h).toBeGreaterThanOrEqual(0)
      expect(h).toBeLessThan(360)
    }
  })

  it("treats a missing alpha as fully opaque", () => {
    expect(mixColors({ h: 0, s: 0, l: 0 }, { h: 0, s: 0, l: 0, a: 0 }).a).toBe(
      0.5
    )
  })

  it("carries on past the two colours when asked to", () => {
    expect(
      mixColors({ h: 0, s: 20, l: 40 }, { h: 0, s: 40, l: 50 }, 2)
    ).toEqual({ h: 0, s: 60, l: 60, a: 1 })
  })
})
