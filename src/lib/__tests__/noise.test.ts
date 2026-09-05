import { describe, expect, it } from "vitest"
import { fbm2, perlin2 } from "../noise"

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

  describe("fbm2", () => {
    it("is just perlin2 with a single octave", () => {
      expect(fbm2(0.3, 0.7, { octaves: 1 })).toBe(perlin2(0.3, 0.7))
    })

    it("stays in approximate range [-1, 1] however many octaves", () => {
      for (const octaves of [1, 2, 4, 8]) {
        for (let i = 0; i < 50; i++) {
          const value = fbm2(Math.random() * 100, Math.random() * 100, {
            octaves,
          })
          expect(value).toBeGreaterThanOrEqual(-1)
          expect(value).toBeLessThanOrEqual(1)
        }
      }
    })

    it("is deterministic", () => {
      expect(fbm2(1.5, 2.5)).toBe(fbm2(1.5, 2.5))
    })

    it("adds detail, so differs from plain noise at the same point", () => {
      const points: [number, number][] = [
        [0.3, 0.7],
        [1.2, 4.4],
        [12.5, 3.25],
      ]
      const differences = points.filter(
        ([x, y]) => Math.abs(fbm2(x, y, { octaves: 4 }) - perlin2(x, y)) > 1e-6
      )
      expect(differences).toHaveLength(points.length)
    })

    it("sums the octaves it is asked for, normalised by their amplitudes", () => {
      const expected =
        (perlin2(0.3, 0.7) +
          0.5 * perlin2(0.6, 1.4) +
          0.25 * perlin2(1.2, 2.8)) /
        1.75

      expect(fbm2(0.3, 0.7, { octaves: 3 })).toBeCloseTo(expected, 12)
    })

    it("respects persistence and lacunarity", () => {
      const expected = (perlin2(0.3, 0.7) + 0.8 * perlin2(0.9, 2.1)) / 1.8

      expect(
        fbm2(0.3, 0.7, { octaves: 2, persistence: 0.8, lacunarity: 3 })
      ).toBeCloseTo(expected, 12)
    })

    it("is rougher with higher persistence", () => {
      const roughness = (persistence: number) => {
        let total = 0
        for (let i = 0; i < 200; i++) {
          const x = i * 0.05
          total += Math.abs(
            fbm2(x + 0.01, 0.5, { octaves: 6, persistence }) -
              fbm2(x, 0.5, { octaves: 6, persistence })
          )
        }
        return total
      }

      expect(roughness(0.9)).toBeGreaterThan(roughness(0.2))
    })

    it("ignores the fractional part of octaves", () => {
      expect(fbm2(0.3, 0.7, { octaves: 2.9 })).toBe(
        fbm2(0.3, 0.7, { octaves: 2 })
      )
    })

    it("throws if asked for less than an octave", () => {
      expect(() => fbm2(0.3, 0.7, { octaves: 0 })).toThrow()
      expect(() => fbm2(0.3, 0.7, { octaves: -1 })).toThrow()
    })
  })
})
