import { describe, it, expect } from "vitest"
import {
  scaler,
  scaler2d,
  clamp,
  lerp,
  isoTransform,
  triTransform,
  centroid,
  hexTransform,
} from "../util"

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
