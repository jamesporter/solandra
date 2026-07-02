import { describe, expect, it } from "vitest"
import { Path } from "../paths/Path"
import { Rect } from "../paths/Rect"
import { SimplePath } from "../paths/SimplePath"
import { Traceable } from "../paths"
import * as lib from "../index"

const trace = (t: Traceable): string[] => {
  const calls: string[] = []
  const ctx = {
    moveTo: (...args: number[]) => calls.push(`moveTo(${args.join(",")})`),
    lineTo: (...args: number[]) => calls.push(`lineTo(${args.join(",")})`),
    bezierCurveTo: (...args: number[]) =>
      calls.push(`bezierCurveTo(${args.join(",")})`),
  } as unknown as CanvasRenderingContext2D
  t.traceIn(ctx)
  return calls
}

const squarePath = () =>
  Path.startAt([0, 0])
    .addLineTo([1, 0])
    .addLineTo([1, 1])
    .addLineTo([0, 1])
    .addLineTo([0, 0])

describe("Rect.split with a numeric proportion", () => {
  it("splits horizontally at the given proportion", () => {
    const rect = new Rect({ at: [0, 0], w: 10, h: 10 })
    const [left, right] = rect.split({
      orientation: "horizontal",
      split: 0.3,
    })

    expect(left.at).toEqual([0, 0])
    expect(left.w).toBeCloseTo(3)
    expect(right.at[0]).toBeCloseTo(3)
    expect(right.w).toBeCloseTo(7)
  })

  it("splits vertically at the given proportion", () => {
    const rect = new Rect({ at: [0, 0], w: 10, h: 10 })
    const [top, bottom] = rect.split({ orientation: "vertical", split: 0.25 })

    expect(top.h).toBeCloseTo(2.5)
    expect(bottom.at[1]).toBeCloseTo(2.5)
    expect(bottom.h).toBeCloseTo(7.5)
  })
})

describe("Path.subdivide", () => {
  it("throws on out of range indices", () => {
    expect(() => squarePath().subdivide({ m: 0, n: 10 })).toThrow()
    expect(() => squarePath().subdivide({ m: 3, n: 1 })).toThrow()
    expect(() => squarePath().subdivide({ m: -1, n: 2 })).toThrow()
  })

  it("closes both paths when splitting with a straight line", () => {
    const [path1, path2] = squarePath().subdivide({ m: 0, n: 2 })

    const calls1 = trace(path1)
    // triangle (0,0) -> (1,0) -> (1,1) closed back to (0,0)
    expect(calls1).toEqual([
      "moveTo(0,0)",
      "lineTo(1,0)",
      "lineTo(1,1)",
      "lineTo(0,0)",
    ])

    const calls2 = trace(path2)
    // triangle (1,1) -> (0,1) -> (0,0) closed back to (1,1)
    expect(calls2).toEqual([
      "moveTo(1,1)",
      "lineTo(0,1)",
      "lineTo(0,0)",
      "lineTo(1,1)",
    ])
  })
})

describe("SimplePath.subdivide", () => {
  it("throws on out of range indices", () => {
    const path = SimplePath.withPoints([
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ]).close()
    expect(() => path.subdivide({ m: 3, n: 1 })).toThrow()
    expect(() => path.subdivide({ m: 0, n: 10 })).toThrow()
  })
})

describe("CurveConfig polarity", () => {
  it("treats polarity the same as the deprecated polarlity", () => {
    const withPolarity = Path.startAt([0, 0]).addCurveTo([1, 0], {
      curveSize: 2,
      polarity: -1,
    })
    const withTypo = Path.startAt([0, 0]).addCurveTo([1, 0], {
      curveSize: 2,
      polarlity: -1,
    })

    expect(trace(withPolarity)).toEqual(trace(withTypo))
  })

  it("bends to opposite sides for opposite polarities", () => {
    const up = Path.startAt([0, 0]).addCurveTo([1, 0], { polarity: 1 })
    const down = Path.startAt([0, 0]).addCurveTo([1, 0], { polarity: -1 })

    expect(trace(up)).not.toEqual(trace(down))
  })
})

describe("library entry point", () => {
  it("exposes color utilities", () => {
    expect(lib.hsla(0, 100, 50)).toBe("hsla(0, 100%, 50%, 1)")
    expect(typeof lib.hueRange).toBe("function")
    expect(typeof lib.simpleLinearGradient).toBe("function")
  })

  it("exposes RNG and poisson disk sampling", () => {
    const rng = new lib.RNG(42)
    const n = rng.number()
    expect(n).toBeGreaterThanOrEqual(0)
    expect(n).toBeLessThan(1)
    expect(typeof lib.poissonDiskPoints).toBe("function")
  })

  it("exposes named collection ops", () => {
    expect(lib.arrayOf(3, () => 1)).toEqual([1, 1, 1])
    expect(lib.sum([1, 2, 3])).toBe(6)
  })

  it("includes rotateAround in the vector ops object", () => {
    const [x, y] = lib.v.rotateAround([1, 1], [2, 1], Math.PI)
    expect(x).toBeCloseTo(0)
    expect(y).toBeCloseTo(1)
  })
})
