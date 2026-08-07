import { describe, expect, it } from "vitest"
import { RNG } from "../rng"

const take = (rng: RNG, n: number) => Array.from({ length: n }, () => rng.number())

describe("RNG", () => {
  it("is deterministic for a given seed", () => {
    expect(take(new RNG(1234), 20)).toEqual(take(new RNG(1234), 20))
  })

  it("gives different sequences for different seeds", () => {
    expect(take(new RNG(1), 10)).not.toEqual(take(new RNG(2), 10))
  })

  it("generates numbers in [0, 1)", () => {
    const rng = new RNG(99)
    for (let i = 0; i < 1000; i++) {
      const n = rng.number()
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThan(1)
    }
  })

  it("is roughly uniform", () => {
    const rng = new RNG(5)
    const buckets = new Array(10).fill(0)
    const n = 10000
    for (let i = 0; i < n; i++) {
      buckets[Math.floor(rng.number() * 10)]++
    }
    for (const count of buckets) {
      // each bucket should hold about a tenth, allow generous slack
      expect(count).toBeGreaterThan(n / 20)
      expect(count).toBeLessThan(n / 5)
    }
  })

  describe("integer", () => {
    it("stays in [0, max) for a power of two", () => {
      const rng = new RNG(11)
      for (let i = 0; i < 500; i++) {
        const n = rng.integer(8)
        expect(Number.isInteger(n)).toBe(true)
        expect(n).toBeGreaterThanOrEqual(0)
        expect(n).toBeLessThan(8)
      }
    })

    it("stays in [0, max) for a non power of two", () => {
      const rng = new RNG(12)
      for (let i = 0; i < 500; i++) {
        const n = rng.integer(7)
        expect(n).toBeGreaterThanOrEqual(0)
        expect(n).toBeLessThan(7)
      }
    })

    it("covers the whole range", () => {
      const rng = new RNG(13)
      const seen = new Set<number>()
      for (let i = 0; i < 500; i++) seen.add(rng.integer(5))
      expect(seen.size).toBe(5)
    })

    it("falls back to a raw 32 bit value when max is 0", () => {
      const n = new RNG(14).integer(0)
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThanOrEqual(0xffffffff)
    })
  })

  describe("state", () => {
    it("can be saved and restored to repeat a sequence", () => {
      const rng = new RNG(21)
      const state = rng.getState()
      const first = take(rng, 2)
      rng.setState(state)
      expect(take(rng, 2)).toEqual(first)
    })

    it("transfers a sequence to another generator", () => {
      const rng = new RNG(22)
      rng.number()

      const other = new RNG(0)
      other.setState(rng.getState())

      expect(take(other, 5)).toEqual(take(rng, 5))
    })
  })

  it("uses a random seed when none is given", () => {
    expect(take(new RNG(), 5)).not.toEqual(take(new RNG(), 5))
  })
})
