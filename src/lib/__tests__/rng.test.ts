import { describe, it, expect } from "vitest"
import { RNG } from "../rng"

describe("RNG", () => {
  describe("constructor", () => {
    it("creates an instance with no seed", () => {
      const rng = new RNG()
      expect(rng).toBeInstanceOf(RNG)
    })

    it("creates an instance with a single seed", () => {
      const rng = new RNG(42)
      expect(rng).toBeInstanceOf(RNG)
    })

    it("creates an instance with a full 64-bit seed", () => {
      const rng = new RNG(0x12345678, 0x9abcdef0)
      expect(rng).toBeInstanceOf(RNG)
    })
  })

  describe("reproducibility", () => {
    it("produces the same sequence for the same seed", () => {
      const rng1 = new RNG(12345)
      const rng2 = new RNG(12345)

      for (let i = 0; i < 20; i++) {
        expect(rng1.next()).toBe(rng2.next())
      }
    })

    it("produces different sequences for different seeds", () => {
      const rng1 = new RNG(1)
      const rng2 = new RNG(2)

      const vals1 = Array.from({ length: 10 }, () => rng1.next())
      const vals2 = Array.from({ length: 10 }, () => rng2.next())

      expect(vals1).not.toEqual(vals2)
    })

    it("produces the same sequence with full 64-bit seed", () => {
      const rng1 = new RNG(0xaabb, 0xccdd)
      const rng2 = new RNG(0xaabb, 0xccdd)

      for (let i = 0; i < 10; i++) {
        expect(rng1.next()).toBe(rng2.next())
      }
    })
  })

  describe("next()", () => {
    it("returns an unsigned 32-bit integer", () => {
      const rng = new RNG(999)
      for (let i = 0; i < 100; i++) {
        const val = rng.next()
        expect(val).toBeGreaterThanOrEqual(0)
        expect(val).toBeLessThanOrEqual(0xffffffff)
        expect(Number.isInteger(val)).toBe(true)
      }
    })

    it("produces varied output (not stuck)", () => {
      const rng = new RNG(777)
      const values = new Set(Array.from({ length: 50 }, () => rng.next()))
      expect(values.size).toBeGreaterThan(40)
    })
  })

  describe("number()", () => {
    it("returns values in [0, 1)", () => {
      const rng = new RNG(555)
      for (let i = 0; i < 100; i++) {
        const val = rng.number()
        expect(val).toBeGreaterThanOrEqual(0)
        expect(val).toBeLessThan(1)
      }
    })

    it("produces varied output", () => {
      const rng = new RNG(333)
      const values = Array.from({ length: 50 }, () => rng.number())
      const unique = new Set(values)
      expect(unique.size).toBeGreaterThan(40)
    })

    it("is reproducible with same seed", () => {
      const rng1 = new RNG(42)
      const rng2 = new RNG(42)
      for (let i = 0; i < 20; i++) {
        expect(rng1.number()).toBe(rng2.number())
      }
    })
  })

  describe("integer(max)", () => {
    it("returns values in [0, max)", () => {
      const rng = new RNG(111)
      for (let i = 0; i < 100; i++) {
        const val = rng.integer(10)
        expect(val).toBeGreaterThanOrEqual(0)
        expect(val).toBeLessThan(10)
        expect(Number.isInteger(val)).toBe(true)
      }
    })

    it("handles power-of-2 max (fast path)", () => {
      const rng = new RNG(222)
      for (let i = 0; i < 100; i++) {
        const val = rng.integer(16)
        expect(val).toBeGreaterThanOrEqual(0)
        expect(val).toBeLessThan(16)
      }
    })

    it("returns full next() when max is 0", () => {
      const rng1 = new RNG(999)
      const rng2 = new RNG(999)
      expect(rng1.integer(0)).toBe(rng2.next())
    })

    it("covers the full range", () => {
      const rng = new RNG(444)
      const seen = new Set<number>()
      for (let i = 0; i < 1000; i++) {
        seen.add(rng.integer(6))
      }
      // All values 0-5 should appear
      for (let v = 0; v < 6; v++) {
        expect(seen.has(v)).toBe(true)
      }
    })

    it("is reproducible with same seed", () => {
      const rng1 = new RNG(777)
      const rng2 = new RNG(777)
      for (let i = 0; i < 20; i++) {
        expect(rng1.integer(100)).toBe(rng2.integer(100))
      }
    })
  })

  describe("getState() / setState()", () => {
    it("returns a 4-element tuple", () => {
      const rng = new RNG(42)
      const state = rng.getState()
      expect(state).toHaveLength(4)
      state.forEach((v) => expect(Number.isInteger(v)).toBe(true))
    })

    it("restores state so subsequent calls repeat", () => {
      const rng = new RNG(12345)
      // Advance a bit
      rng.next()
      rng.next()

      const state = rng.getState()
      const v1 = rng.number()
      const v2 = rng.number()

      rng.setState(state)
      expect(rng.number()).toBe(v1)
      expect(rng.number()).toBe(v2)
    })

    it("setState ensures increment is always odd", () => {
      const rng = new RNG(42)
      const state = rng.getState()
      // Manually set an even increment
      rng.setState([state[0], state[1], state[2], 100])
      const restoredState = rng.getState()
      // The increment should have the lowest bit set (be odd)
      expect(restoredState[3] & 1).toBe(1)
    })
  })
})
