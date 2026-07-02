import { describe, expect, it } from "vitest"
import {
  hsla,
  simpleLinearGradient,
  hueRange,
  saturationRange,
  lightnessRange,
  alphaRange,
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
