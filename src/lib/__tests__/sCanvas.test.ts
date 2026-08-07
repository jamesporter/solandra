import { describe, it, expect } from "vitest"
import SCanvas from "../sCanvas"
import { createMockCtx } from "./testUtils"

describe("SCanvas", () => {
  describe("constructor", () => {
    it("initializes with correct aspect ratio", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 1000, height: 500 }, 42)
      expect(s.aspectRatio).toBe(2) // 1000/500
    })

    it("initializes meta with correct values", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 1000, height: 1000 }, 42)
      expect(s.meta.top).toBe(0)
      expect(s.meta.left).toBe(0)
      expect(s.meta.right).toBe(1)
      expect(s.meta.bottom).toBe(1) // height/width = aspectRatio
      expect(s.meta.center).toEqual([0.5, 0.5])
    })

    it("initializes with default time 0", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      expect(s.t).toBe(0)
    })

    it("initializes with custom time", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42, 0.5)
      expect(s.t).toBe(0.5)
    })
  })

  describe("updateTime", () => {
    it("updates the time value", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      s.updateTime(0.75)
      expect(s.t).toBe(0.75)
    })
  })

  describe("updateSize", () => {
    it("updates aspect ratio and meta", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      s.updateSize({ width: 200, height: 100 })
      expect(s.aspectRatio).toBe(2)
      expect(s.meta.bottom).toBe(0.5)
    })
  })

  describe("resetRandomNumberGenerator", () => {
    it("resets RNG with new seed", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const val1 = s.random()
      s.resetRandomNumberGenerator(42)
      const val2 = s.random()
      expect(val1).toBe(val2) // Same seed = same sequence
    })
  })

  describe("random", () => {
    it("returns values between 0 and 1", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      for (let i = 0; i < 100; i++) {
        const val = s.random()
        expect(val).toBeGreaterThanOrEqual(0)
        expect(val).toBeLessThan(1)
      }
    })

    it("is reproducible with same seed", () => {
      const { ctx: ctx1 } = createMockCtx()
      const { ctx: ctx2 } = createMockCtx()
      const s1 = new SCanvas(ctx1, { width: 100, height: 100 }, 123)
      const s2 = new SCanvas(ctx2, { width: 100, height: 100 }, 123)

      for (let i = 0; i < 10; i++) {
        expect(s1.random()).toBe(s2.random())
      }
    })
  })

  describe("uniformRandomInt", () => {
    it("returns integers in specified range (inclusive)", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const values = new Set<number>()
      for (let i = 0; i < 1000; i++) {
        const val = s.uniformRandomInt({ from: 1, to: 5 })
        expect(Number.isInteger(val)).toBe(true)
        expect(val).toBeGreaterThanOrEqual(1)
        expect(val).toBeLessThanOrEqual(5)
        values.add(val)
      }
      // Should hit all values 1-5
      expect(values.size).toBe(5)
    })

    it("returns integers in specified range (exclusive)", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      for (let i = 0; i < 100; i++) {
        const val = s.uniformRandomInt({ from: 0, to: 5, inclusive: false })
        expect(val).toBeGreaterThanOrEqual(0)
        expect(val).toBeLessThan(5)
      }
    })
  })

  describe("gaussian", () => {
    it("generates values with approximate mean and sd", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const values: number[] = []
      for (let i = 0; i < 1000; i++) {
        values.push(s.gaussian({ mean: 10, sd: 2 }))
      }
      const mean = values.reduce((a, b) => a + b, 0) / values.length
      expect(mean).toBeCloseTo(10, 0) // Mean should be close to 10
    })
  })

  describe("poisson", () => {
    it("generates non-negative integers", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      for (let i = 0; i < 100; i++) {
        const val = s.poisson(5)
        expect(Number.isInteger(val)).toBe(true)
        expect(val).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe("sample", () => {
    it("returns an element from the array", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const arr = [1, 2, 3, 4, 5]
      for (let i = 0; i < 10; i++) {
        expect(arr).toContain(s.sample(arr))
      }
    })
  })

  describe("samples", () => {
    it("returns n samples from the array", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const arr = ["a", "b", "c"]
      const result = s.samples(5, arr)
      expect(result).toHaveLength(5)
      result.forEach((item) => expect(arr).toContain(item))
    })
  })

  describe("shuffle", () => {
    it("shuffles array in place", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const original = [...arr]
      s.shuffle(arr)
      // Should have same elements
      expect([...arr].sort((a, b) => a - b)).toEqual(
        [...original].sort((a, b) => a - b)
      )
      // Unlikely to be in same order (technically possible but extremely rare)
      expect(arr.join("")).not.toBe(original.join(""))
    })
  })

  describe("perturb", () => {
    it("perturbs a point within magnitude", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const original: [number, number] = [0.5, 0.5]
      for (let i = 0; i < 100; i++) {
        const [x, y] = s.perturb({ at: original, magnitude: 0.1 })
        expect(Math.abs(x - 0.5)).toBeLessThanOrEqual(0.05)
        expect(Math.abs(y - 0.5)).toBeLessThanOrEqual(0.05)
      }
    })
  })

  describe("randomPoint", () => {
    it("returns a point within canvas bounds", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      for (let i = 0; i < 100; i++) {
        const [x, y] = s.randomPoint()
        expect(x).toBeGreaterThanOrEqual(0)
        expect(x).toBeLessThan(1)
        expect(y).toBeGreaterThanOrEqual(0)
        expect(y).toBeLessThan(1) // aspectRatio is 1
      }
    })
  })

  describe("randomAngle", () => {
    it("returns angle between 0 and 2*PI", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      for (let i = 0; i < 100; i++) {
        const angle = s.randomAngle()
        expect(angle).toBeGreaterThanOrEqual(0)
        expect(angle).toBeLessThan(Math.PI * 2)
      }
    })
  })

  describe("randomPolarity", () => {
    it("returns -1 or 1", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const results = new Set<number>()
      for (let i = 0; i < 100; i++) {
        const val = s.randomPolarity()
        expect(val === -1 || val === 1).toBe(true)
        results.add(val)
      }
      expect(results.has(-1)).toBe(true)
      expect(results.has(1)).toBe(true)
    })
  })

  describe("times", () => {
    it("calls callback n times", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const indices: number[] = []
      s.times(5, (i) => indices.push(i))
      expect(indices).toEqual([0, 1, 2, 3, 4])
    })
  })

  describe("downFrom", () => {
    it("counts down from n to 1", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const indices: number[] = []
      s.downFrom(5, (i) => indices.push(i))
      expect(indices).toEqual([5, 4, 3, 2, 1])
    })
  })

  describe("forTiling", () => {
    it("iterates over a grid", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const positions: [number, number][] = []
      s.forTiling({ n: 2 }, ([x, y]) => {
        positions.push([x, y])
      })
      // 2x2 grid = 4 tiles
      expect(positions).toHaveLength(4)
    })

    it("passes correct size to callback", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const sizes: [number, number][] = []
      s.forTiling({ n: 4 }, (_, [w, h]) => {
        sizes.push([w, h])
      })
      // Each tile should be 0.25 x 0.25
      sizes.forEach(([w, h]) => {
        expect(w).toBeCloseTo(0.25)
        expect(h).toBeCloseTo(0.25)
      })
    })

    it("passes correct center to callback", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      let firstCenter: [number, number] | null = null
      s.forTiling({ n: 2 }, (_, __, [cx, cy], i) => {
        if (i === 0) firstCenter = [cx, cy]
      })
      // First tile center should be at (0.25, 0.25)
      expect(firstCenter![0]).toBeCloseTo(0.25)
      expect(firstCenter![1]).toBeCloseTo(0.25)
    })

    it("respects margin parameter", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      let firstPos: [number, number] | null = null
      s.forTiling({ n: 2, margin: 0.1 }, ([x, y]) => {
        if (!firstPos) firstPos = [x, y]
      })
      expect(firstPos![0]).toBeCloseTo(0.1)
    })
  })

  describe("forHorizontal", () => {
    it("iterates horizontally", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const positions: number[] = []
      s.forHorizontal({ n: 4 }, ([x]) => positions.push(x))
      expect(positions).toHaveLength(4)
      // Each should start at 0, 0.25, 0.5, 0.75
      expect(positions[0]).toBeCloseTo(0)
      expect(positions[1]).toBeCloseTo(0.25)
    })
  })

  describe("forVertical", () => {
    it("iterates vertically", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const positions: number[] = []
      s.forVertical({ n: 4 }, ([_, y]) => positions.push(y))
      expect(positions).toHaveLength(4)
    })
  })

  describe("forGrid", () => {
    it("iterates over integer grid", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const points: [number, number][] = []
      s.forGrid({ minX: 0, maxX: 2, minY: 0, maxY: 2 }, ([x, y]) => {
        points.push([x, y])
      })
      // 3x3 grid = 9 points
      expect(points).toHaveLength(9)
      expect(points).toContainEqual([0, 0])
      expect(points).toContainEqual([2, 2])
    })
  })

  describe("aroundCircle", () => {
    it("iterates around a circle", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const points: [number, number][] = []
      s.aroundCircle({ n: 4, at: [0.5, 0.5], r: 0.2 }, ([x, y]) => {
        points.push([x, y])
      })
      expect(points).toHaveLength(4)
      // All points should be at distance r from center
      points.forEach(([x, y]) => {
        const dist = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2)
        expect(dist).toBeCloseTo(0.2, 1)
      })
    })
  })

  describe("range", () => {
    it("iterates over a range", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const values: number[] = []
      s.range({ from: 0, to: 1, n: 4 }, (val) => values.push(val))
      expect(values).toHaveLength(5) // inclusive by default
      expect(values[0]).toBe(0)
      expect(values[4]).toBe(1)
    })

    it("respects inclusive=false", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const values: number[] = []
      s.range({ from: 0, to: 1, n: 4, inclusive: false }, (val) =>
        values.push(val)
      )
      expect(values).toHaveLength(4)
    })
  })

  describe("build", () => {
    it("collects values from iteration", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      const centers = s.build(s.forTiling, { n: 2 }, (_, __, center) => center)
      expect(centers).toHaveLength(4)
    })
  })

  describe("proportionately", () => {
    it("selects based on weights", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)

      const counts = { a: 0, b: 0 }
      for (let i = 0; i < 1000; i++) {
        s.resetRandomNumberGenerator(i)
        const result = s.proportionately([
          [7, () => "a"],
          [3, () => "b"],
        ])
        counts[result as "a" | "b"]++
      }

      // 'a' should be selected about 70% of the time
      expect(counts.a).toBeGreaterThan(600)
      expect(counts.b).toBeGreaterThan(200)
    })

    it("throws with zero total", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      expect(() => s.proportionately([[0, () => "a"]])).toThrow(
        "Must be positive total"
      )
    })
  })

  describe("doProportion", () => {
    it("executes callback based on probability", () => {
      const { ctx } = createMockCtx()
      let count = 0

      for (let i = 0; i < 1000; i++) {
        const s = new SCanvas(ctx, { width: 100, height: 100 }, i)
        s.doProportion(0.3, () => count++)
      }

      // Should execute roughly 30% of the time
      expect(count).toBeGreaterThan(200)
      expect(count).toBeLessThan(400)
    })
  })

  describe("inDrawing", () => {
    it("returns true for points inside canvas", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      expect(s.inDrawing([0.5, 0.5])).toBe(true)
    })

    it("returns false for points outside canvas", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42)
      expect(s.inDrawing([-0.1, 0.5])).toBe(false)
      expect(s.inDrawing([1.1, 0.5])).toBe(false)
      expect(s.inDrawing([0.5, -0.1])).toBe(false)
      expect(s.inDrawing([0.5, 1.1])).toBe(false)
    })
  })

  describe("oscillate", () => {
    it("oscillates between from and to", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42, 0)

      // At t=0, cos(0) = 1, so value = from + (to-from)*(1+1)/2 = from + (to-from) = to
      const atZero = s.oscillate({ from: 0, to: 10 })
      expect(atZero).toBeCloseTo(10)
    })

    it("uses default values", () => {
      const { ctx } = createMockCtx()
      const s = new SCanvas(ctx, { width: 100, height: 100 }, 42, Math.PI)

      // At t=PI, cos(PI) = -1, so value = 0 + (1-0)*(1-1)/2 = 0
      const val = s.oscillate()
      expect(val).toBeCloseTo(0)
    })
  })
})
