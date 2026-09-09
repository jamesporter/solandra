import { describe, expect, it } from "vitest"
import { curl2, fbm2, perlin2, worley2, worleyCell2 } from "../noise"

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

  describe("curl2", () => {
    it("returns consistent values for the same input", () => {
      expect(curl2(1.5, 2.5)).toEqual(curl2(1.5, 2.5))
    })

    it("varies over space", () => {
      const a = curl2(0.5, 0.5)
      const b = curl2(5.5, 3.25)
      expect(a).not.toEqual(b)
    })

    it("is smooth: nearby points give nearby vectors", () => {
      const [x1, y1] = curl2(3, 4)
      const [x2, y2] = curl2(3.001, 4)
      expect(Math.abs(x1 - x2)).toBeLessThan(0.1)
      expect(Math.abs(y1 - y2)).toBeLessThan(0.1)
    })

    it("is divergence free (the point of curl noise)", () => {
      // the whole reason for taking the curl: nothing is a source or a sink, so
      // flow lines never collapse together
      const h = 0.001
      for (const [x, y] of [
        [1.3, 2.7],
        [10.25, 0.5],
        [-4.1, 6.6],
      ]) {
        const dXdX = (curl2(x + h, y)[0] - curl2(x - h, y)[0]) / (2 * h)
        const dYdY = (curl2(x, y + h)[1] - curl2(x, y - h)[1]) / (2 * h)
        expect(dXdX + dYdY).toBeCloseTo(0, 3)
      }
    })

    it("is perpendicular to the gradient of the noise it comes from", () => {
      const h = 0.0001
      const x = 2.35
      const y = 1.15
      const gradient = [
        (perlin2(x + h, y) - perlin2(x - h, y)) / (2 * h),
        (perlin2(x, y + h) - perlin2(x, y - h)) / (2 * h),
      ]
      const [cX, cY] = curl2(x, y)
      // dot product of two perpendicular vectors is zero
      expect(gradient[0] * cX + gradient[1] * cY).toBeCloseTo(0, 3)
    })

    it("takes more octaves, giving a more varied field", () => {
      const simple = curl2(1.5, 2.5)
      const turbulent = curl2(1.5, 2.5, { octaves: 4 })
      expect(turbulent).not.toEqual(simple)
    })

    it("rejects fewer than one octave, as fbm2 does", () => {
      expect(() => curl2(1, 1, { octaves: 0 })).toThrow()
    })
  })
  describe("worley2", () => {
    it("returns consistent values for the same input", () => {
      expect(worley2(1.5, 2.5)).toBe(worley2(1.5, 2.5))
      expect(worleyCell2(1.5, 2.5)).toEqual(worleyCell2(1.5, 2.5))
    })

    it("returns distances in roughly [0, 1]", () => {
      for (let i = 0; i < 200; i++) {
        const value = worley2(Math.random() * 50, Math.random() * 50)
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(1.5)
      }
    })

    it("finds the nearest feature point, so f2 is never smaller than f1", () => {
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 20
        const y = Math.random() * 20
        expect(worley2(x, y, { feature: "f2" })).toBeGreaterThanOrEqual(
          worley2(x, y)
        )
      }
    })

    it("gives the gap between the two nearest points as the difference", () => {
      const x = 3.3
      const y = 7.1
      expect(worley2(x, y, { feature: "difference" })).toBeCloseTo(
        worley2(x, y, { feature: "f2" }) - worley2(x, y),
        10
      )
    })

    it("is a distance, so it changes no faster than the point moves", () => {
      const h = 0.01
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 20
        const y = Math.random() * 20
        // the nearest feature point can only get h closer or h further away
        expect(Math.abs(worley2(x + h, y) - worley2(x, y))).toBeLessThanOrEqual(
          h + 1e-12
        )
      }
    })

    it("puts the feature point in the middle of its cell with no jitter", () => {
      // the middle of a cell, so the point in it is the nearest thing there is
      expect(worley2(4.5, 6.5, { jitter: 0 })).toBeCloseTo(0, 10)
      // and a corner is half a cell away in each direction
      expect(worley2(4, 6, { jitter: 0 })).toBeCloseTo(Math.sqrt(0.5), 10)
    })

    it("measures distance the way it is asked to", () => {
      const at: [number, number] = [4.2, 6.1]
      const config = { jitter: 0 } as const
      const euclidean = worley2(...at, config)
      const manhattan = worley2(...at, { ...config, metric: "manhattan" })
      const chebyshev = worley2(...at, { ...config, metric: "chebyshev" })

      // for the same point, chebyshev <= euclidean <= manhattan
      expect(chebyshev).toBeLessThanOrEqual(euclidean)
      expect(euclidean).toBeLessThanOrEqual(manhattan)
      expect(manhattan).toBeCloseTo(0.3 + 0.4, 10)
      expect(chebyshev).toBeCloseTo(0.4, 10)
    })

    it("scatters the feature points when jittered", () => {
      const regular = worleyCell2(4.2, 6.1, { jitter: 0 })
      const jittered = worleyCell2(4.2, 6.1, { jitter: 1 })
      expect(jittered.at).not.toEqual(regular.at)
      expect(regular.at).toEqual([4.5, 6.5])
    })

    it("rejects jitter outside [0, 1]", () => {
      expect(() => worley2(1, 1, { jitter: -0.1 })).toThrow()
      expect(() => worley2(1, 1, { jitter: 1.5 })).toThrow()
      expect(() => worleyCell2(1, 1, { jitter: 2 })).toThrow()
    })
  })

  describe("worleyCell2", () => {
    it("gives every point in a cell the same id and feature point", () => {
      const { cell, id, at } = worleyCell2(4.2, 6.1, { jitter: 0.5 })

      // the cell a point belongs to is the one its nearest feature point is in
      for (let i = 0; i < 50; i++) {
        const x = cell[0] + Math.random()
        const y = cell[1] + Math.random()
        const other = worleyCell2(x, y, { jitter: 0.5 })
        if (other.cell[0] === cell[0] && other.cell[1] === cell[1]) {
          expect(other.id).toBe(id)
          expect(other.at).toEqual(at)
        }
      }
    })

    it("gives neighbouring cells different ids", () => {
      const ids = new Set<number>()
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          ids.add(worleyCell2(i + 0.5, j + 0.5, { jitter: 0 }).id)
        }
      }
      // hashes can collide, but 64 cells should not nearly all land together
      expect(ids.size).toBeGreaterThan(50)
    })

    it("keeps the feature point inside its own cell", () => {
      for (let i = 0; i < 100; i++) {
        const { cell, at } = worleyCell2(Math.random() * 30, Math.random() * 30)
        expect(at[0]).toBeGreaterThanOrEqual(cell[0])
        expect(at[0]).toBeLessThanOrEqual(cell[0] + 1)
        expect(at[1]).toBeGreaterThanOrEqual(cell[1])
        expect(at[1]).toBeLessThanOrEqual(cell[1] + 1)
      }
    })

    it("works with negative coordinates", () => {
      const { cell, at } = worleyCell2(-3.4, -7.8, { jitter: 0 })
      expect(cell).toEqual([-4, -8])
      expect(at).toEqual([-3.5, -7.5])
    })

    it("reports the distances worley2 does", () => {
      const { f1, f2 } = worleyCell2(2.3, 5.7)
      expect(f1).toBeCloseTo(worley2(2.3, 5.7), 10)
      expect(f2).toBeCloseTo(worley2(2.3, 5.7, { feature: "f2" }), 10)
    })
  })
})
