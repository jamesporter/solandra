import { describe, it, expect } from "vitest"
import {
  evenProportions,
  scaler,
  scaler2d,
  clamp,
  lerp,
  isoTransform,
  triTransform,
  centroid,
  hexTransform,
  convexHull,
} from "../util"
import { SimplePath } from "../paths/SimplePath"
import { Point2D } from "../types/sol"

describe("Scaler", () => {
  it("should be able to scale", () => {
    const s = scaler({ minDomain: 1, maxDomain: 3, minRange: 2, maxRange: 4 })
    expect(s(2)).toBeCloseTo(3)
    expect(s(3)).toBeCloseTo(4)

    const s2 = scaler({
      minDomain: 0,
      maxDomain: -100,
      minRange: 0,
      maxRange: 50,
    })
    expect(s2(-50)).toBeCloseTo(25)
    expect(s2(-10)).toBeCloseTo(5)
  })
})

describe("Clamp", () => {
  it("should be able to clamp", () => {
    expect(clamp({ from: 0, to: 10 }, -10)).toBeCloseTo(0)
    expect(clamp({ from: 0, to: 10 }, 20)).toBeCloseTo(10)
  })
})

describe("Lerp", () => {
  it("should interpolate between two values", () => {
    expect(lerp({ from: 0, to: 10 }, 0.5)).toBeCloseTo(5)
    expect(lerp({ from: 10, to: 20 }, 0.25)).toBeCloseTo(12.5)
    expect(lerp({ from: 0, to: 10 }, 0)).toBeCloseTo(0)
    expect(lerp({ from: 0, to: 10 }, 1)).toBeCloseTo(10)
  })

  it("should extrapolate outside [0, 1]", () => {
    expect(lerp({ from: 0, to: 10 }, 1.5)).toBeCloseTo(15)
    expect(lerp({ from: 0, to: 10 }, -0.5)).toBeCloseTo(-5)
  })
})

describe("Isotransform", () => {
  it("should be able to be constent", () => {
    const itf = isoTransform(3.4)
    expect(itf([0, 1, 0])).toEqual(itf([1, 0, 1]))

    expect(itf([0, 2, 0])[1]).toBeCloseTo(-6.8)
    expect(itf([0, 2, 0])[0]).toBeCloseTo(0)
  })
})

describe("Describle Triangle Transform", () => {
  it("Can do up cases", () => {
    const tt = triTransform({ s: 1 })
    const r = 1 / (2 * Math.sin(Math.PI / 3))
    const h = 0.5 / Math.tan(Math.PI / 3)

    expect(tt([0, 0]).at[0]).toBeCloseTo(0)
    expect(tt([0, 0]).at[1]).toBeCloseTo(0)

    expect(tt([2, 0]).at[0]).toBeCloseTo(1)
    expect(tt([2, 0]).at[1]).toBeCloseTo(0)

    expect(tt([4, 0]).at[0]).toBeCloseTo(2)
    expect(tt([4, 0]).at[1]).toBeCloseTo(0)

    expect(tt([1, 1]).at[0]).toBeCloseTo(0.5)
    expect(tt([1, 1]).at[1]).toBeCloseTo(h + r)
  })

  it("Can do down cases", () => {
    const tt = triTransform({ s: 1 })
    const r = 1 / (2 * Math.sin(Math.PI / 3))
    const h = 0.5 / Math.tan(Math.PI / 3)

    expect(tt([1, 0]).at[0]).toBeCloseTo(0.5)
    expect(tt([1, 0]).at[1]).toBeCloseTo(h - r)
  })
})

describe("scaler2d", () => {
  it("scales each axis independently", () => {
    const s = scaler2d(
      { minDomain: 0, maxDomain: 10, minRange: 0, maxRange: 1 },
      { minDomain: 0, maxDomain: 100, minRange: 0, maxRange: 2 }
    )
    expect(s([5, 50])).toEqual([0.5, 1])
    expect(s([0, 0])).toEqual([0, 0])
    expect(s([10, 100])).toEqual([1, 2])
  })
})

describe("centroid", () => {
  it("averages a set of points", () => {
    expect(
      centroid([
        [0, 0],
        [2, 0],
        [2, 2],
        [0, 2],
      ])
    ).toEqual([1, 1])
  })

  it("ignores the repeated point of a closed path", () => {
    expect(
      centroid([
        [0, 0],
        [2, 0],
        [2, 2],
        [0, 2],
        [0, 0],
      ])
    ).toEqual([1, 1])
  })

  it("returns the only point of a single point path", () => {
    expect(centroid([[3, 4]])).toEqual([3, 4])
  })

  it("throws for no points", () => {
    expect(() => centroid([])).toThrow(/at least one point/)
  })
})

describe("hexTransform", () => {
  it("offsets alternate rows when vertical", () => {
    const h = hexTransform({ r: 1 })
    const cp6 = Math.cos(Math.PI / 6)

    expect(h([0, 0])[0]).toBeCloseTo(0)
    expect(h([0, 0])[1]).toBeCloseTo(0)
    // odd rows are shifted half a hexagon left
    expect(h([0, 1])[0]).toBeCloseTo(-cp6)
    expect(h([0, 1])[1]).toBeCloseTo(1.5)
    expect(h([1, 0])[0]).toBeCloseTo(2 * cp6)
  })

  it("offsets alternate columns when horizontal", () => {
    const h = hexTransform({ r: 1, vertical: false })
    const cp6 = Math.cos(Math.PI / 6)

    expect(h([0, 0])[0]).toBeCloseTo(0)
    expect(h([1, 0])[0]).toBeCloseTo(1.5)
    expect(h([1, 0])[1]).toBeCloseTo(-cp6)
    expect(h([0, 1])[1]).toBeCloseTo(2 * cp6)
  })

  it("scales with the radius", () => {
    const small = hexTransform({ r: 1 })
    const big = hexTransform({ r: 2 })
    expect(big([1, 0])[0]).toBeCloseTo(2 * small([1, 0])[0])
    expect(big([0, 1])[1]).toBeCloseTo(2 * small([0, 1])[1])
  })
})

describe("evenProportions", () => {
  it("spans 0 to 1 inclusively by default", () => {
    expect(evenProportions({ n: 3 })).toEqual([0, 0.5, 1])
    expect(evenProportions({ n: 5 })).toEqual([0, 0.25, 0.5, 0.75, 1])
  })

  it("stops short of 1 when not inclusive", () => {
    expect(evenProportions({ n: 4, inclusive: false })).toEqual([
      0, 0.25, 0.5, 0.75,
    ])
  })

  it("gives just the start for one proportion", () => {
    expect(evenProportions({ n: 1 })).toEqual([0])
    expect(evenProportions({ n: 1, inclusive: false })).toEqual([0])
  })

  it("throws if asked for none", () => {
    expect(() => evenProportions({ n: 0 })).toThrow()
    expect(() => evenProportions({ n: -2 })).toThrow()
  })
})

describe("convexHull", () => {
  it("wraps points, leaving out the ones inside", () => {
    const hull = convexHull([
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
      [0.5, 0.5],
    ])
    expect(hull).toHaveLength(4)
    expect(hull).toEqual(
      expect.arrayContaining([
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ])
    )
  })

  it("does not repeat the first point at the end", () => {
    const hull = convexHull([
      [0, 0],
      [1, 0],
      [0, 1],
    ])
    expect(hull).toHaveLength(3)
  })

  it("starts from the leftmost point and goes round clockwise as drawn", () => {
    const hull = convexHull([
      [1, 1],
      [0, 1],
      [1, 0],
      [0, 0],
    ])
    // y increases downwards on a canvas, so this reads clockwise on screen
    expect(hull).toEqual([
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ])
  })

  it("leaves out points lying along an edge", () => {
    const hull = convexHull([
      [0, 0],
      [0.5, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ])
    expect(hull).toHaveLength(4)
    expect(hull).not.toContainEqual([0.5, 0])
  })

  it("contains every point it was given", () => {
    const points: Point2D[] = Array.from(
      { length: 50 },
      (_, i) => [Math.cos(i * 2.4) * (1 + (i % 7)), Math.sin(i * 1.7) * 3] // arbitrary but fixed
    )
    const hull = convexHull(points)
    const inside = SimplePath.withPoints(hull).close()
    points.forEach((at) => {
      const onHull = hull.some(([x, y]) => x === at[0] && y === at[1])
      expect(onHull || inside.containsPoint(at)).toBe(true)
    })
  })

  it("passes through anything too small to wrap", () => {
    expect(convexHull([])).toEqual([])
    expect(convexHull([[0, 0]])).toEqual([[0, 0]])
    expect(
      convexHull([
        [0, 0],
        [1, 1],
      ])
    ).toEqual([
      [0, 0],
      [1, 1],
    ])
  })

  it("does not modify the points it was given", () => {
    const points: Point2D[] = [
      [1, 1],
      [0, 0],
      [1, 0],
    ]
    convexHull(points)
    expect(points).toEqual([
      [1, 1],
      [0, 0],
      [1, 0],
    ])
  })
})
