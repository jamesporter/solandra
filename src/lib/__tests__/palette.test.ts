import { describe, expect, it } from "vitest"
import { palette, palettePreset } from "../palette"

describe("palette", () => {
  describe("palette function", () => {
    it("generates correct number of colors", () => {
      const colors = palette({
        a: [0.5, 0.5, 0.5],
        b: [0.5, 0.5, 0.5],
        c: [1.0, 1.0, 1.0],
        d: [0.0, 0.33, 0.67],
        steps: 10,
      })
      expect(colors).toHaveLength(10)
    })

    it("returns HSL color tuples", () => {
      const colors = palette({
        a: [0.5, 0.5, 0.5],
        b: [0.5, 0.5, 0.5],
        c: [1.0, 1.0, 1.0],
        d: [0.0, 0.33, 0.67],
        steps: 5,
      })

      colors.forEach((color) => {
        expect(color).toHaveLength(3)
        const [h, s, l] = color
        // Hue should be 0-360
        expect(h).toBeGreaterThanOrEqual(0)
        expect(h).toBeLessThanOrEqual(360)
        // Saturation should be 0-100
        expect(s).toBeGreaterThanOrEqual(0)
        expect(s).toBeLessThanOrEqual(100)
        // Lightness should be 0-100
        expect(l).toBeGreaterThanOrEqual(0)
        expect(l).toBeLessThanOrEqual(100)
      })
    })

    it("generates different colors for different positions", () => {
      const colors = palette({
        a: [0.5, 0.5, 0.5],
        b: [0.5, 0.5, 0.5],
        c: [1.0, 1.0, 1.0],
        d: [0.0, 0.33, 0.67],
        steps: 10,
      })

      // Check that not all colors are the same
      const uniqueHues = new Set(colors.map((c) => Math.round(c[0])))
      expect(uniqueHues.size).toBeGreaterThan(1)
    })

    it("handles single step", () => {
      const colors = palette({
        a: [0.5, 0.5, 0.5],
        b: [0.5, 0.5, 0.5],
        c: [1.0, 1.0, 1.0],
        d: [0.0, 0.33, 0.67],
        steps: 1,
      })
      expect(colors).toHaveLength(1)
    })
  })

  describe("palettePreset function", () => {
    it("generates rainbow palette", () => {
      const colors = palettePreset("rainbow", 12)
      expect(colors).toHaveLength(12)

      // Rainbow should have varied hues
      const hues = colors.map((c) => c[0])
      const minHue = Math.min(...hues)
      const maxHue = Math.max(...hues)
      expect(maxHue - minHue).toBeGreaterThan(100) // Should span at least 100 degrees
    })

    it("generates warmth palette", () => {
      const colors = palettePreset("warmth", 8)
      expect(colors).toHaveLength(8)

      // Warmth should have colors in the warm range
      colors.forEach((color) => {
        expect(color).toHaveLength(3)
      })
    })

    it("generates rusty palette", () => {
      const colors = palettePreset("rusty", 6)
      expect(colors).toHaveLength(6)
    })

    it("generates autumnal palette", () => {
      const colors = palettePreset("autumnal", 8)
      expect(colors).toHaveLength(8)
    })

    it("generates natural palette", () => {
      const colors = palettePreset("natural", 10)
      expect(colors).toHaveLength(10)
    })

    it("generates neon palette", () => {
      const colors = palettePreset("neon", 5)
      expect(colors).toHaveLength(5)
    })

    it("generates subtle palette", () => {
      const colors = palettePreset("subtle", 7)
      expect(colors).toHaveLength(7)
    })

    it("all presets produce valid HSL colors", () => {
      const presets = [
        "rainbow",
        "warmth",
        "rusty",
        "autumnal",
        "natural",
        "neon",
        "subtle",
      ] as const

      presets.forEach((preset) => {
        const colors = palettePreset(preset, 5)
        colors.forEach((color) => {
          const [h, s, l] = color
          expect(h).toBeGreaterThanOrEqual(0)
          expect(s).toBeGreaterThanOrEqual(0)
          expect(l).toBeGreaterThanOrEqual(0)
        })
      })
    })
  })
})
