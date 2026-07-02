import { describe, expect, it } from "vitest"
import {
  add,
  subtract,
  magnitude,
  distance,
  rotate,
  rotateAround,
  normalize,
  scale,
  polarToCartesian,
  pointAlong,
  dot,
  cross,
  heading,
} from "../vectors"

describe("vectors", () => {
  describe("add", () => {
    it("adds two vectors", () => {
      expect(add([1, 2], [3, 4])).toEqual([4, 6])
    })

    it("handles negative values", () => {
      expect(add([1, -2], [-3, 4])).toEqual([-2, 2])
    })

    it("handles zero vectors", () => {
      expect(add([0, 0], [5, 5])).toEqual([5, 5])
      expect(add([5, 5], [0, 0])).toEqual([5, 5])
    })

    it("handles decimals", () => {
      expect(add([0.5, 0.25], [0.25, 0.5])).toEqual([0.75, 0.75])
    })
  })

  describe("subtract", () => {
    it("subtracts two vectors", () => {
      expect(subtract([5, 7], [2, 3])).toEqual([3, 4])
    })

    it("handles negative results", () => {
      expect(subtract([1, 2], [3, 4])).toEqual([-2, -2])
    })

    it("handles zero vectors", () => {
      expect(subtract([5, 5], [0, 0])).toEqual([5, 5])
      expect(subtract([5, 5], [5, 5])).toEqual([0, 0])
    })
  })

  describe("magnitude", () => {
    it("calculates magnitude of a 3-4-5 triangle", () => {
      expect(magnitude([3, 4])).toBe(5)
    })

    it("handles zero vector", () => {
      expect(magnitude([0, 0])).toBe(0)
    })

    it("handles unit vectors", () => {
      expect(magnitude([1, 0])).toBe(1)
      expect(magnitude([0, 1])).toBe(1)
    })

    it("handles negative values", () => {
      expect(magnitude([-3, -4])).toBe(5)
    })

    it("handles diagonal unit", () => {
      expect(magnitude([1, 1])).toBeCloseTo(Math.SQRT2)
    })
  })

  describe("distance", () => {
    it("calculates distance between two points", () => {
      expect(distance([0, 0], [3, 4])).toBe(5)
    })

    it("returns 0 for same points", () => {
      expect(distance([5, 5], [5, 5])).toBe(0)
    })

    it("is commutative", () => {
      expect(distance([0, 0], [3, 4])).toBe(distance([3, 4], [0, 0]))
    })

    it("handles negative coordinates", () => {
      expect(distance([-1, -1], [2, 3])).toBe(5)
    })
  })

  describe("rotate", () => {
    it("rotates by 90 degrees", () => {
      const result = rotate([1, 0], Math.PI / 2)
      expect(result[0]).toBeCloseTo(0)
      expect(result[1]).toBeCloseTo(1)
    })

    it("rotates by 180 degrees", () => {
      const result = rotate([1, 0], Math.PI)
      expect(result[0]).toBeCloseTo(-1)
      expect(result[1]).toBeCloseTo(0)
    })

    it("rotates by 0 degrees (no change)", () => {
      const result = rotate([1, 0], 0)
      expect(result[0]).toBeCloseTo(1)
      expect(result[1]).toBeCloseTo(0)
    })

    it("rotates by -90 degrees", () => {
      const result = rotate([1, 0], -Math.PI / 2)
      expect(result[0]).toBeCloseTo(0)
      expect(result[1]).toBeCloseTo(-1)
    })

    it("rotates by 360 degrees (full circle)", () => {
      const result = rotate([3, 4], 2 * Math.PI)
      expect(result[0]).toBeCloseTo(3)
      expect(result[1]).toBeCloseTo(4)
    })
  })

  describe("rotateAround", () => {
    it("rotates around origin (same as rotate)", () => {
      const result = rotateAround([0, 0], [1, 0], Math.PI / 2)
      expect(result[0]).toBeCloseTo(0)
      expect(result[1]).toBeCloseTo(1)
    })

    it("rotates around center point", () => {
      const result = rotateAround([0.5, 0.5], [1, 0.5], Math.PI)
      expect(result[0]).toBeCloseTo(0)
      expect(result[1]).toBeCloseTo(0.5)
    })

    it("rotates around arbitrary point", () => {
      const result = rotateAround([1, 1], [2, 1], Math.PI / 2)
      expect(result[0]).toBeCloseTo(1)
      expect(result[1]).toBeCloseTo(2)
    })

    it("returns same point when rotating by 0", () => {
      const result = rotateAround([0.5, 0.5], [1, 0.5], 0)
      expect(result[0]).toBeCloseTo(1)
      expect(result[1]).toBeCloseTo(0.5)
    })
  })

  describe("normalize", () => {
    it("normalizes a vector to unit length", () => {
      const result = normalize([3, 4])
      expect(result[0]).toBeCloseTo(0.6)
      expect(result[1]).toBeCloseTo(0.8)
      expect(magnitude(result)).toBeCloseTo(1)
    })

    it("normalizes unit vectors (no change)", () => {
      const result = normalize([1, 0])
      expect(result[0]).toBeCloseTo(1)
      expect(result[1]).toBeCloseTo(0)
    })

    it("normalizes negative vectors", () => {
      const result = normalize([-3, -4])
      expect(result[0]).toBeCloseTo(-0.6)
      expect(result[1]).toBeCloseTo(-0.8)
      expect(magnitude(result)).toBeCloseTo(1)
    })

    it("returns [0, 0] for the zero vector rather than NaN", () => {
      expect(normalize([0, 0])).toEqual([0, 0])
    })
  })

  describe("scale", () => {
    it("scales a vector by a factor", () => {
      expect(scale([2, 3], 2)).toEqual([4, 6])
    })

    it("scales by 1 (no change)", () => {
      expect(scale([5, 7], 1)).toEqual([5, 7])
    })

    it("scales by 0", () => {
      expect(scale([5, 7], 0)).toEqual([0, 0])
    })

    it("scales by negative factor", () => {
      expect(scale([2, 3], -1)).toEqual([-2, -3])
    })

    it("scales by fractional factor", () => {
      expect(scale([10, 20], 0.5)).toEqual([5, 10])
    })
  })

  describe("polarToCartesian", () => {
    it("converts at 0 angle", () => {
      const result = polarToCartesian([0.5, 0.5], 0.2, 0)
      expect(result[0]).toBeCloseTo(0.7)
      expect(result[1]).toBeCloseTo(0.5)
    })

    it("converts at 90 degrees", () => {
      const result = polarToCartesian([0.5, 0.5], 0.2, Math.PI / 2)
      expect(result[0]).toBeCloseTo(0.5)
      expect(result[1]).toBeCloseTo(0.7)
    })

    it("converts at 180 degrees", () => {
      const result = polarToCartesian([0.5, 0.5], 0.2, Math.PI)
      expect(result[0]).toBeCloseTo(0.3)
      expect(result[1]).toBeCloseTo(0.5)
    })

    it("converts at 270 degrees", () => {
      const result = polarToCartesian([0.5, 0.5], 0.2, (3 * Math.PI) / 2)
      expect(result[0]).toBeCloseTo(0.5)
      expect(result[1]).toBeCloseTo(0.3)
    })

    it("handles zero radius", () => {
      const result = polarToCartesian([0.5, 0.5], 0, Math.PI / 4)
      expect(result[0]).toBeCloseTo(0.5)
      expect(result[1]).toBeCloseTo(0.5)
    })
  })

  describe("pointAlong", () => {
    it("finds midpoint", () => {
      expect(pointAlong([0, 0], [10, 10], 0.5)).toEqual([5, 5])
    })

    it("returns start point at 0", () => {
      expect(pointAlong([0, 0], [10, 10], 0)).toEqual([0, 0])
    })

    it("returns end point at 1", () => {
      expect(pointAlong([0, 0], [10, 10], 1)).toEqual([10, 10])
    })

    it("finds quarter point", () => {
      expect(pointAlong([0, 0], [10, 10], 0.25)).toEqual([2.5, 2.5])
    })

    it("handles negative coordinates", () => {
      expect(pointAlong([-5, -5], [5, 5], 0.5)).toEqual([0, 0])
    })

    it("uses default proportion of 0.5", () => {
      expect(pointAlong([0, 0], [10, 10])).toEqual([5, 5])
    })

    it("extrapolates beyond end point", () => {
      expect(pointAlong([0, 0], [10, 10], 2)).toEqual([20, 20])
    })
  })

  describe("dot", () => {
    it("calculates dot product of two vectors", () => {
      expect(dot([1, 2], [3, 4])).toBe(11) // 1*3 + 2*4 = 11
    })

    it("returns 0 for perpendicular vectors", () => {
      expect(dot([1, 0], [0, 1])).toBe(0)
    })

    it("calculates square of magnitude for same vector", () => {
      expect(dot([3, 4], [3, 4])).toBe(25) // magnitude squared
    })

    it("handles zero vector", () => {
      expect(dot([0, 0], [5, 5])).toBe(0)
    })

    it("handles negative values", () => {
      expect(dot([1, -2], [-3, 4])).toBe(-11) // 1*(-3) + (-2)*4 = -11
    })
  })

  describe("cross", () => {
    it("calculates the 2D cross product", () => {
      expect(cross([1, 0], [0, 1])).toBe(1)
      expect(cross([0, 1], [1, 0])).toBe(-1)
    })

    it("returns 0 for parallel vectors", () => {
      expect(cross([1, 2], [2, 4])).toBe(0)
      expect(cross([1, 0], [2, 0])).toBe(0)
    })

    it("is anti-symmetric", () => {
      expect(cross([2, 3], [5, 7])).toBe(-cross([5, 7], [2, 3]))
    })
  })

  describe("heading", () => {
    it("returns the angle of a vector", () => {
      expect(heading([1, 0])).toBeCloseTo(0)
      expect(heading([0, 1])).toBeCloseTo(Math.PI / 2)
      expect(heading([-1, 0])).toBeCloseTo(Math.PI)
      expect(heading([0, -1])).toBeCloseTo(-Math.PI / 2)
    })

    it("is the inverse of polarToCartesian direction", () => {
      const angle = 0.7
      const p = polarToCartesian([0, 0], 2, angle)
      expect(heading(p)).toBeCloseTo(angle)
    })
  })
})
