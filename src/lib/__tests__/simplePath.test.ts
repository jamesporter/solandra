import { describe, expect, it } from "vitest"
import { asSimplePath, SimplePath } from "../paths/SimplePath"
import { Star } from "../paths/Star"
import v from "../vectors"
import { Point2D } from "../types/sol"
import { recordTrace } from "./testUtils"

const square = () =>
  SimplePath.withPoints([
    [0, 0],
    [2, 0],
    [2, 2],
    [0, 2],
  ]).close()

const closeToPoints = (
  actual: Point2D[],
  expected: Point2D[],
  precision = 10
) => {
  expect(actual).toHaveLength(expected.length)
  actual.forEach(([x, y], i) => {
    expect(x).toBeCloseTo(expected[i][0], precision)
    expect(y).toBeCloseTo(expected[i][1], precision)
  })
}

describe("SimplePath", () => {
  it("starts at a point and accumulates more", () => {
    const path = SimplePath.startAt([0, 0]).addPoint([1, 1])
    expect(path.points).toEqual([
      [0, 0],
      [1, 1],
    ])
  })

  it("closes by repeating the first point", () => {
    expect(square().points).toEqual([
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
      [0, 0],
    ])
  })

  it("closing an empty path is a no-op", () => {
    expect(SimplePath.withPoints([]).close().points).toEqual([])
  })

  it("traces as a moveTo then lineTos", () => {
    const calls = recordTrace(
      SimplePath.withPoints([
        [0, 0],
        [1, 0],
        [1, 1],
      ])
    )
    expect(calls.map((c) => c.op)).toEqual(["moveTo", "lineTo", "lineTo"])
  })

  describe("centroid", () => {
    it("averages the points", () => {
      expect(
        SimplePath.withPoints([
          [0, 0],
          [2, 0],
          [2, 2],
          [0, 2],
        ]).centroid
      ).toEqual([1, 1])
    })

    it("ignores the duplicated point of a closed path", () => {
      expect(square().centroid).toEqual([1, 1])
    })
  })

  describe("transformations", () => {
    it("moves every point, leaving the original alone", () => {
      const path = square()
      const moved = path.moved([1, 2])

      expect(moved.points[0]).toEqual([1, 2])
      expect(path.points[0]).toEqual([0, 0])
    })

    it("scales about the centroid", () => {
      const scaled = square().scaled(2)
      closeToPoints(scaled.points, [
        [-1, -1],
        [3, -1],
        [3, 3],
        [-1, 3],
        [-1, -1],
      ])
    })

    it("rotates about the centroid", () => {
      const rotated = square().rotated(Math.PI / 2)
      closeToPoints(rotated.points, [
        [2, 0],
        [2, 2],
        [0, 2],
        [0, 0],
        [2, 0],
      ])
    })

    it("rotating by a full turn is (near enough) the identity", () => {
      closeToPoints(square().rotated(Math.PI * 2).points, square().points)
    })

    it("transforms points in place with transformPoints", () => {
      const path = square()
      const returned = path.transformPoints(([x, y]) => [x + 1, y])

      expect(returned).toBe(path)
      expect(path.points[0]).toEqual([1, 0])
    })

    it("keeps loops closed under a non deterministic transform", () => {
      let i = 0
      const path = square().transformLooped(([x, y]) => [x + i++, y])
      expect(path.points[path.points.length - 1]).toEqual(path.points[0])
    })

    it("transformLoopedPoints mutates but keeps the loop closed", () => {
      let i = 0
      const path = square()
      path.transformLoopedPoints(([x, y]) => [x + i++, y])
      expect(path.points[path.points.length - 1]).toEqual(path.points[0])
    })

    it("reverses", () => {
      const path = SimplePath.withPoints([
        [0, 0],
        [1, 1],
        [2, 2],
      ])
      expect(path.reversed.points).toEqual([
        [2, 2],
        [1, 1],
        [0, 0],
      ])
      // original untouched
      expect(path.points[0]).toEqual([0, 0])
    })

    it("appends another path", () => {
      const joined = SimplePath.withPoints([[0, 0]]).withAppended(
        SimplePath.withPoints([[1, 1]])
      )
      expect(joined.points).toEqual([
        [0, 0],
        [1, 1],
      ])
    })
  })

  describe("chaiken", () => {
    it("smooths by adding points", () => {
      const path = SimplePath.withPoints([
        [0, 0],
        [1, 0],
        [1, 1],
      ]).chaiken({ n: 1 })
      expect(path.points.length).toBeGreaterThan(3)
      // endpoints preserved for an unlooped path
      expect(path.points[0]).toEqual([0, 0])
      expect(path.points[path.points.length - 1]).toEqual([1, 1])
    })

    it("keeps a looped path closed", () => {
      const path = square().chaiken({ n: 2, looped: true })
      expect(path.points[0]).toEqual(path.points[path.points.length - 1])
    })
  })

  describe("segmented", () => {
    it("makes one triangle per edge", () => {
      const segments = square().segmented
      expect(segments).toHaveLength(4)
      for (const segment of segments) {
        expect(segment.points).toHaveLength(4)
        // each triangle includes the centroid and closes on itself
        expect(segment.points[2]).toEqual([1, 1])
        expect(segment.points[3]).toEqual(segment.points[0])
      }
    })

    it("throws when there are too few points", () => {
      expect(() => SimplePath.withPoints([[0, 0]]).segmented).toThrow(
        /at least 2 points/
      )
    })
  })

  describe("exploded", () => {
    it("pushes segments away from the centroid", () => {
      const segments = square().exploded({ magnitude: 2 })
      expect(segments).toHaveLength(4)

      const original = square().segmented
      for (let i = 0; i < segments.length; i++) {
        const [oX, oY] = original[i].centroid
        const [eX, eY] = segments[i].centroid
        const from = Math.hypot(oX - 1, oY - 1)
        const to = Math.hypot(eX - 1, eY - 1)
        expect(to).toBeGreaterThan(from)
      }
    })

    it("leaves segments in place at magnitude 1", () => {
      const exploded = square().exploded({ magnitude: 1 })
      const segmented = square().segmented
      exploded.forEach((path, i) => {
        closeToPoints(path.points, segmented[i].points)
      })
    })

    it("throws when there are too few points", () => {
      expect(() => SimplePath.withPoints([[0, 0]]).exploded()).toThrow(
        /at least 2 points/
      )
    })
  })

  describe("edges", () => {
    it("makes a two point path per consecutive pair", () => {
      const edges = SimplePath.withPoints([
        [0, 0],
        [1, 0],
        [1, 1],
      ]).edges
      expect(edges.map((e) => e.points)).toEqual([
        [
          [0, 0],
          [1, 0],
        ],
        [
          [1, 0],
          [1, 1],
        ],
      ])
    })
  })

  describe("curvify", () => {
    it("uses curves where the style says so, lines otherwise", () => {
      const path = SimplePath.withPoints([
        [0, 0],
        [1, 0],
        [1, 1],
      ]).curvify((i) => (i === 0 ? { curveSize: 1 } : null))

      const ops = recordTrace(path).map((c) => c.op)
      expect(ops).toEqual(["moveTo", "bezierCurveTo", "lineTo"])
    })

    it("throws when there are too few points", () => {
      expect(() => SimplePath.withPoints([[0, 0]]).curvify(() => null)).toThrow(
        /at least 2 points/
      )
    })
  })

  describe("subdivide", () => {
    it("splits into two closed paths", () => {
      const [a, b] = square().subdivide({ m: 0, n: 2 })
      expect(a.points[0]).toEqual(a.points[a.points.length - 1])
      expect(a.points.length).toBeGreaterThan(2)
      expect(b.points.length).toBeGreaterThan(2)
    })
  })

  describe("length", () => {
    it("sums the lengths of the segments", () => {
      const path = SimplePath.withPoints([
        [0, 0],
        [3, 0],
        [3, 4],
      ])
      expect(path.length).toBe(7)
    })

    it("is 0 for a path that goes nowhere", () => {
      expect(SimplePath.withPoints([[1, 1]]).length).toBe(0)
      expect(SimplePath.withPoints([]).length).toBe(0)
      expect(
        SimplePath.withPoints([
          [1, 1],
          [1, 1],
        ]).length
      ).toBe(0)
    })

    it("includes the closing segment of a closed path", () => {
      // 2 by 2 square, so all four sides
      expect(square().length).toBe(8)
    })
  })

  describe("pointAt", () => {
    const path = () =>
      SimplePath.withPoints([
        [0, 0],
        [1, 0],
        [1, 1],
      ])

    it("gives the ends at 0 and 1", () => {
      expect(path().pointAt(0)).toEqual([0, 0])
      expect(path().pointAt(1)).toEqual([1, 1])
    })

    it("measures by distance, not by point index", () => {
      // half of the total length of 2 is the corner
      expect(path().pointAt(0.5)).toEqual([1, 0])
      closeToPoints([path().pointAt(0.25)], [[0.5, 0]])
      closeToPoints([path().pointAt(0.75)], [[1, 0.5]])
    })

    it("spaces evenly however uneven the points are", () => {
      // the same line, but with a redundant point crammed near the start
      const uneven = SimplePath.withPoints([
        [0, 0],
        [0.01, 0],
        [1, 0],
      ])
      closeToPoints([uneven.pointAt(0.5)], [[0.5, 0]])
    })

    it("clamps proportions outside [0, 1]", () => {
      expect(path().pointAt(-1)).toEqual([0, 0])
      expect(path().pointAt(2)).toEqual([1, 1])
    })

    it("copes with a path of zero length", () => {
      const stuck = SimplePath.withPoints([
        [1, 1],
        [1, 1],
      ])
      expect(stuck.pointAt(0.5)).toEqual([1, 1])
      expect(SimplePath.withPoints([[1, 1]]).pointAt(0.5)).toEqual([1, 1])
    })

    it("throws for a path with no points", () => {
      expect(() => SimplePath.withPoints([]).pointAt(0.5)).toThrow(/no points/)
    })
  })

  describe("tangentAt", () => {
    const path = () =>
      SimplePath.withPoints([
        [0, 0],
        [1, 0],
        [1, 1],
      ])

    it("is a unit vector in the direction of travel", () => {
      closeToPoints([path().tangentAt(0.25)], [[1, 0]])
      closeToPoints([path().tangentAt(0.75)], [[0, 1]])
    })

    it("gives an angle usable for rotation", () => {
      expect(v.heading(path().tangentAt(0.75))).toBeCloseTo(Math.PI / 2, 10)
    })

    it("is [0, 0] where the path goes nowhere", () => {
      expect(
        SimplePath.withPoints([
          [1, 1],
          [1, 1],
        ]).tangentAt(0.5)
      ).toEqual([0, 0])
    })
  })

  describe("pointsAlong", () => {
    const line = () =>
      SimplePath.withPoints([
        [0, 0],
        [1, 0],
      ])

    it("includes both ends by default", () => {
      closeToPoints(line().pointsAlong({ n: 3 }), [
        [0, 0],
        [0.5, 0],
        [1, 0],
      ])
    })

    it("stops short of the end when not inclusive", () => {
      closeToPoints(line().pointsAlong({ n: 4, inclusive: false }), [
        [0, 0],
        [0.25, 0],
        [0.5, 0],
        [0.75, 0],
      ])
    })

    it("gives the start for a single point", () => {
      expect(line().pointsAlong({ n: 1 })).toEqual([[0, 0]])
    })

    it("spaces points evenly by distance around a closed path", () => {
      const points = square().pointsAlong({ n: 4, inclusive: false })
      closeToPoints(points, [
        [0, 0],
        [2, 0],
        [2, 2],
        [0, 2],
      ])
    })

    it("throws if asked for no points", () => {
      expect(() => line().pointsAlong({ n: 0 })).toThrow()
    })
  })

  describe("asSimplePath", () => {
    it("passes a SimplePath straight through", () => {
      const path = square()
      expect(asSimplePath(path)).toBe(path)
    })

    it("takes the path of anything that has one", () => {
      const star = new Star({ at: [0, 0], n: 5, r: 1 })
      expect(asSimplePath(star).points).toEqual(star.path.points)
    })
  })
})
