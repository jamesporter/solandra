import { describe, expect, it } from "vitest"
import { asSimplePath, SimplePath } from "../paths/SimplePath"
import { Star } from "../paths/Star"
import v from "../vectors"
import { curl2 } from "../noise"
import { pairWise } from "../collectionOps"
import { Point2D } from "../types/sol"
import { recordTrace } from "./testUtils"

const square = () =>
  SimplePath.withPoints([
    [0, 0],
    [2, 0],
    [2, 2],
    [0, 2],
  ]).close()

const straightLine = () =>
  SimplePath.withPoints([
    [0, 0],
    [1, 0],
  ])

/** How far a point sits from the nearest part of a path (not just its points) */
const distanceToPath = (at: Point2D, path: SimplePath): number =>
  Math.min(
    ...pairWise(path.points).map(([a, b]) => {
      const line = v.subtract(b, a)
      const length = v.magnitude(line)
      if (length === 0) return v.distance(at, a)
      const t = Math.max(
        0,
        Math.min(1, v.dot(v.subtract(at, a), line) / length ** 2)
      )
      return v.distance(at, v.pointAlong(a, b, t))
    })
  )

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

  describe("flowLine", () => {
    // a field pointing straight down the x axis, whatever its strength
    const rightwards = () => [3, 0] as Point2D

    it("steps through the field from the starting point", () => {
      const path = SimplePath.flowLine({
        from: [0, 0],
        field: rightwards,
        n: 3,
        step: 0.5,
      })
      closeToPoints(path.points, [
        [0, 0],
        [0.5, 0],
        [1, 0],
        [1.5, 0],
      ])
    })

    it("uses the field for direction only, so steps are all the same length", () => {
      const path = SimplePath.flowLine({
        from: [0, 0],
        field: ([x]) => [10 * (x + 1), 0],
        n: 3,
        step: 0.1,
      })
      pairWise(path.points).forEach(([a, b]) => {
        expect(v.distance(a, b)).toBeCloseTo(0.1)
      })
    })

    it("follows a turning field around", () => {
      // circling an attractor: always at right angles to the way in
      const path = SimplePath.flowLine({
        from: [1, 0],
        field: (at) => v.rotate(v.subtract([0, 0], at), Math.PI / 2),
        n: 20,
        step: 0.05,
      })
      path.points.forEach((at) => {
        // Euler integration drifts outwards a little, but should stay near
        expect(v.magnitude(at)).toBeGreaterThan(0.9)
        expect(v.magnitude(at)).toBeLessThan(1.2)
      })
    })

    it("stops where the field has no direction to give", () => {
      const path = SimplePath.flowLine({
        from: [0, 0],
        field: ([x]) => (x < 0.25 ? [1, 0] : [0, 0]),
        n: 100,
        step: 0.1,
      })
      expect(path.points).toHaveLength(4)
    })

    it("stops as soon as until says so", () => {
      const path = SimplePath.flowLine({
        from: [0, 0],
        field: rightwards,
        n: 100,
        step: 0.1,
        until: ([x]) => x > 0.25,
      })
      closeToPoints(path.points, [
        [0, 0],
        [0.1, 0],
        [0.2, 0],
        [0.3, 0],
      ])
    })

    it("can be traced through curl noise", () => {
      const path = SimplePath.flowLine({
        from: [0.5, 0.5],
        field: ([x, y]) => curl2(x * 3, y * 3),
        n: 50,
        step: 0.01,
      })
      expect(path.points).toHaveLength(51)
      expect(path.length).toBeCloseTo(0.5)
    })

    it("takes no steps when asked for none", () => {
      const path = SimplePath.flowLine({
        from: [0, 0],
        field: rightwards,
        n: 0,
      })
      expect(path.points).toEqual([[0, 0]])
    })

    it("throws if asked for a negative number of steps", () => {
      expect(() =>
        SimplePath.flowLine({ from: [0, 0], field: rightwards, n: -1 })
      ).toThrow()
    })
  })

  describe("boundingBox", () => {
    it("is the smallest box containing every point", () => {
      const path = SimplePath.withPoints([
        [0.2, 0.3],
        [0.6, 0.1],
        [0.4, 0.9],
      ])
      const { at, w, h } = path.boundingBox
      closeToPoints([at], [[0.2, 0.1]])
      expect(w).toBeCloseTo(0.4)
      expect(h).toBeCloseTo(0.8)
    })

    it("has no size for a single point", () => {
      const box = SimplePath.withPoints([[0.5, 0.5]]).boundingBox
      expect(box).toEqual({ at: [0.5, 0.5], w: 0, h: 0 })
    })

    it("throws for a path with no points", () => {
      expect(() => new SimplePath().boundingBox).toThrow()
    })
  })

  describe("area", () => {
    it("measures the area enclosed by a square", () => {
      expect(square().area).toBeCloseTo(4)
    })

    it("does not care whether the path was closed", () => {
      const points: Point2D[] = [
        [0, 0],
        [2, 0],
        [2, 2],
        [0, 2],
      ]
      expect(SimplePath.withPoints(points).area).toBeCloseTo(4)
      expect(SimplePath.withPoints(points).close().area).toBeCloseTo(4)
    })

    it("is positive whichever way round the points go", () => {
      expect(square().reversed.area).toBeCloseTo(4)
    })

    it("measures a triangle", () => {
      expect(
        SimplePath.withPoints([
          [0, 0],
          [1, 0],
          [0, 1],
        ]).area
      ).toBeCloseTo(0.5)
    })

    it("is zero for anything that cannot enclose an area", () => {
      expect(new SimplePath().area).toBe(0)
      expect(straightLine().area).toBe(0)
    })
  })

  describe("containsPoint", () => {
    it("knows what is inside and what is outside", () => {
      const s = square()
      expect(s.containsPoint([1, 1])).toBe(true)
      expect(s.containsPoint([0.01, 0.01])).toBe(true)
      expect(s.containsPoint([3, 1])).toBe(false)
      expect(s.containsPoint([1, -1])).toBe(false)
      expect(s.containsPoint([-1, -1])).toBe(false)
    })

    it("handles a concave shape, where a bounding box would not", () => {
      // a chevron: the notch at the top is outside the shape
      const chevron = SimplePath.withPoints([
        [0, 0],
        [1, 1],
        [2, 0],
        [2, 2],
        [0, 2],
      ]).close()
      expect(chevron.containsPoint([1, 1.5])).toBe(true)
      expect(chevron.containsPoint([1, 0.2])).toBe(false)
      expect(chevron.containsPoint([0.2, 0.5])).toBe(true)
    })

    it("contains nothing when there is no area to be inside", () => {
      expect(straightLine().containsPoint([0.5, 0])).toBe(false)
      expect(new SimplePath().containsPoint([0, 0])).toBe(false)
    })
  })

  describe("simplified", () => {
    it("drops points that barely change the shape", () => {
      const path = SimplePath.withPoints([
        [0, 0],
        [0.5, 0.0001],
        [1, 0],
      ])
      closeToPoints(path.simplified({ tolerance: 0.01 }).points, [
        [0, 0],
        [1, 0],
      ])
    })

    it("keeps points that do change the shape", () => {
      const path = SimplePath.withPoints([
        [0, 0],
        [0.5, 0.5],
        [1, 0],
      ])
      expect(path.simplified({ tolerance: 0.01 }).points).toHaveLength(3)
    })

    it("keeps the ends of the path", () => {
      const wiggly = SimplePath.withPoints(
        Array.from(
          { length: 50 },
          (_, i) => [i / 49, Math.sin(i) * 0.02] as Point2D
        )
      )
      const simplified = wiggly.simplified({ tolerance: 0.5 })
      closeToPoints(simplified.points, [
        [0, 0],
        [1, Math.sin(49) * 0.02],
      ])
    })

    it("thins out a smoothed path, keeping every point within the tolerance", () => {
      const wiggly = SimplePath.withPoints(
        Array.from(
          { length: 200 },
          (_, i) => [i / 199, Math.sin(i / 10) * 0.2] as Point2D
        )
      )
      const tolerance = 0.005
      const simplified = wiggly.simplified({ tolerance })

      expect(simplified.points.length).toBeLessThan(60)
      expect(simplified.points.length).toBeGreaterThan(2)
      // the guarantee the algorithm makes: nothing dropped strays further than
      // the tolerance from the path that is left
      wiggly.points.forEach((at) => {
        expect(distanceToPath(at, simplified)).toBeLessThanOrEqual(tolerance)
      })
    })

    it("leaves the original path alone", () => {
      const path = SimplePath.withPoints([
        [0, 0],
        [0.5, 0.0001],
        [1, 0],
      ])
      path.simplified()
      expect(path.points).toHaveLength(3)
    })

    it("passes through paths too short to simplify", () => {
      expect(straightLine().simplified().points).toHaveLength(2)
      expect(new SimplePath().simplified().points).toHaveLength(0)
    })

    it("throws for a negative tolerance", () => {
      expect(() => square().simplified({ tolerance: -1 })).toThrow()
    })
  })

  describe("convexHull", () => {
    it("wraps the path's points, leaving out the ones inside", () => {
      const path = SimplePath.withPoints([
        [0, 0],
        [2, 0],
        [1, 1],
        [2, 2],
        [0, 2],
      ])
      const hull = path.convexHull
      // closed, so the first point is repeated at the end
      expect(hull.points).toHaveLength(5)
      expect(hull.area).toBeCloseTo(4)
      expect(hull.containsPoint([1, 1])).toBe(true)
    })

    it("contains every point of the original path", () => {
      const path = SimplePath.withPoints([
        [0.1, 0.4],
        [0.8, 0.2],
        [0.5, 0.9],
        [0.3, 0.5],
        [0.6, 0.6],
      ])
      const hull = path.convexHull
      path.points.forEach((at) => {
        expect(
          hull.containsPoint(at) ||
            hull.points.some((p) => p[0] === at[0] && p[1] === at[1])
        ).toBe(true)
      })
    })

    it("throws for a path with no points", () => {
      expect(() => new SimplePath().convexHull).toThrow()
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
