import { describe, expect, it } from "vitest"
import { perlin2 } from "../noise"

describe("noise", () => {
  describe("perlin2", () => {
    it("returns values in approximate range [-1, 1]", () => {
      // Sample many points to verify range
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 100
        const y = Math.random() * 100
        const value = perlin2(x, y)
        expect(value).toBeGreaterThanOrEqual(-1)
        expect(value).toBeLessThanOrEqual(1)
      }
    })

    it("returns consistent values for same input", () => {
      const v1 = perlin2(1.5, 2.5)
      const v2 = perlin2(1.5, 2.5)
      expect(v1).toBe(v2)
    })

    it("returns different values for different inputs", () => {
      // Use non-integer coordinates since perlin2 returns 0 at integer grid points
      const v1 = perlin2(0.5, 0.5)
      const v2 = perlin2(1.5, 1.5)
      const v3 = perlin2(2.5, 2.5)
      // Not all should be the same
      expect(v1 === v2 && v2 === v3).toBe(false)
    })

    it("produces continuous noise (nearby points have similar values)", () => {
      const base = perlin2(5, 5)
      const nearby1 = perlin2(5.001, 5)
      const nearby2 = perlin2(5, 5.001)

      // Nearby points should be close in value
      expect(Math.abs(base - nearby1)).toBeLessThan(0.1)
      expect(Math.abs(base - nearby2)).toBeLessThan(0.1)
    })

    it("handles negative coordinates", () => {
      const value = perlin2(-5, -5)
      expect(value).toBeGreaterThanOrEqual(-1)
      expect(value).toBeLessThanOrEqual(1)
    })

    it("handles zero coordinates", () => {
      const value = perlin2(0, 0)
      expect(typeof value).toBe("number")
      expect(isNaN(value)).toBe(false)
    })

    it("handles large coordinates", () => {
      const value = perlin2(1000, 1000)
      expect(value).toBeGreaterThanOrEqual(-1)
      expect(value).toBeLessThanOrEqual(1)
    })

    it("produces varied output across a grid", () => {
      const values = new Set<number>()
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          // Use non-integer coordinates to avoid grid points where noise is 0
          values.add(perlin2(x * 0.3 + 0.1, y * 0.3 + 0.1))
        }
      }
      // Should have many unique values
      expect(values.size).toBeGreaterThan(20)
    })

    it("returns 0 at integer coordinates (expected behavior)", () => {
      // Perlin noise typically returns 0 at integer grid points
      const value = perlin2(0, 0)
      expect(value).toBeCloseTo(0, 1)
    })

    it("is not just returning zeros", () => {
      let nonZeroCount = 0
      for (let i = 0; i < 100; i++) {
        const value = perlin2(i * 0.1 + 0.05, i * 0.1 + 0.05)
        if (Math.abs(value) > 0.01) {
          nonZeroCount++
        }
      }
      expect(nonZeroCount).toBeGreaterThan(50)
    })
  })
})
