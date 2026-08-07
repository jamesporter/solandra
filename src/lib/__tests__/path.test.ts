import { describe, expect, it } from "vitest"
import { Path } from "../paths/Path"
import { recordTrace } from "./testUtils"

const triangle = () =>
  Path.startAt([0, 0]).addLineTo([2, 0]).addLineTo([2, 2]).addLineTo([0, 0])

describe("Path", () => {
  it("traces lines", () => {
    const calls = recordTrace(Path.startAt([0, 0]).addLineTo([1, 1]))
    expect(calls).toEqual([
      { op: "moveTo", args: [0, 0] },
      { op: "lineTo", args: [1, 1] },
    ])
  })

  it("traces curves as cubic beziers", () => {
    const calls = recordTrace(
      Path.startAt([0, 0]).addCurveTo([1, 1], { curveSize: 1 })
    )
    expect(calls.map((c) => c.op)).toEqual(["moveTo", "bezierCurveTo"])
    expect(calls[1].args).toHaveLength(6)
  })

  it("addCurve is addCurveTo with the destination in the config", () => {
    const viaTo = recordTrace(
      Path.startAt([0, 0]).addCurveTo([1, 1], { curveSize: 0.5, twist: 0.2 })
    )
    const viaConfig = recordTrace(
      Path.startAt([0, 0]).addCurve({ to: [1, 1], curveSize: 0.5, twist: 0.2 })
    )
    expect(viaConfig).toEqual(viaTo)
  })

  describe("centroid", () => {
    it("averages the start point of each edge", () => {
      expect(triangle().centroid).toEqual([4 / 3, 2 / 3])
    })
  })

  describe("transformations", () => {
    it("moves the whole path", () => {
      const points = recordTrace(triangle().moved([1, 1])).flatMap(
        (c) => c.args
      )
      expect(points.slice(0, 2)).toEqual([1, 1])
    })

    it("scales about the centroid, leaving the centroid fixed", () => {
      const scaled = triangle().scaled(2)
      const [cX, cY] = triangle().centroid
      expect(scaled.centroid[0]).toBeCloseTo(cX, 10)
      expect(scaled.centroid[1]).toBeCloseTo(cY, 10)
    })

    it("rotates about the centroid, leaving the centroid fixed", () => {
      const rotated = triangle().rotated(Math.PI / 3)
      const [cX, cY] = triangle().centroid
      expect(rotated.centroid[0]).toBeCloseTo(cX, 10)
      expect(rotated.centroid[1]).toBeCloseTo(cY, 10)
    })

    it("rotates points the same way as rotating a known point", () => {
      const rotated = Path.startAt([0, 0])
        .addLineTo([2, 0])
        .addLineTo([0, 0])
        .rotated(Math.PI)

      const traced = recordTrace(rotated)
      // centroid of [0,0] and [2,0] is [1, 0]; a half turn swaps the two
      expect(traced[0].args[0]).toBeCloseTo(2, 10)
      expect(traced[0].args[1]).toBeCloseTo(0, 10)
    })

    it("reverses lines and curves", () => {
      const reversed = Path.startAt([0, 0])
        .addLineTo([1, 0])
        .addCurveTo([1, 1]).reversed

      const ops = recordTrace(reversed).map((c) => c.op)
      expect(ops).toEqual(["moveTo", "lineTo", "bezierCurveTo"])
    })

    it("keeps loops closed under a non deterministic transform", () => {
      let i = 0
      const path = triangle().transformedLooped(([x, y]) => [x + i++, y])
      const calls = recordTrace(path)
      const first = calls[0].args
      const last = calls[calls.length - 1].args
      expect(last.slice(-2)).toEqual(first)
    })
  })

  describe("segmented", () => {
    it("makes a triangle per edge", () => {
      const segments = triangle().segmented
      expect(segments).toHaveLength(3)
      for (const segment of segments) {
        expect(recordTrace(segment).map((c) => c.op)).toEqual([
          "moveTo",
          "lineTo",
          "lineTo",
          "lineTo",
        ])
      }
    })

    it("throws when there are too few edges", () => {
      expect(() => Path.startAt([0, 0]).addLineTo([1, 1]).segmented).toThrow(
        /at least 2 edges/
      )
    })
  })

  describe("exploded", () => {
    it("pushes segments away from the centroid", () => {
      const c = triangle().centroid
      const exploded = triangle().exploded({ magnitude: 2 })
      const segmented = triangle().segmented

      expect(exploded).toHaveLength(3)
      exploded.forEach((path, i) => {
        const before = Math.hypot(
          segmented[i].centroid[0] - c[0],
          segmented[i].centroid[1] - c[1]
        )
        const after = Math.hypot(
          path.centroid[0] - c[0],
          path.centroid[1] - c[1]
        )
        expect(after).toBeGreaterThan(before)
      })
    })

    it("throws when there are too few edges", () => {
      expect(() => Path.startAt([0, 0]).addLineTo([1, 1]).exploded()).toThrow(
        /at least 2 edges/
      )
    })
  })

  describe("subdivide", () => {
    it("throws on out of range indices", () => {
      expect(() => triangle().subdivide({ m: 2, n: 1 })).toThrow()
      expect(() => triangle().subdivide({ m: 0, n: 99 })).toThrow()
    })

    it("splits with a curve when one is supplied", () => {
      const [a, b] = triangle().subdivide({
        m: 0,
        n: 2,
        curve: { curveSize: 1 },
      })
      expect(recordTrace(a).map((c) => c.op)).toContain("bezierCurveTo")
      expect(recordTrace(b).map((c) => c.op)).toContain("bezierCurveTo")
    })
  })
})
