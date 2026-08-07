import { describe, expect, it } from "vitest"
import { Arc } from "../paths/Arc"
import { HollowArc } from "../paths/HollowArc"
import { Hatching } from "../paths/Hatching"
import { Line } from "../paths/Line"
import { Rect } from "../paths/Rect"
import { RoundedRect } from "../paths/RoundedRect"
import { Square } from "../paths/Square"
import { Circle } from "../paths/Circle"
import { CompoundPath } from "../paths/CompoundPath"
import {
  EquilateralTriangle,
  Hexagon,
  RegularPolygon,
} from "../paths/RegularPolygon"
import { Spiral } from "../paths/Spiral"
import { Star } from "../paths/Star"
import { Point2D } from "../types/sol"
import { recordTrace, tracedPoints } from "./testUtils"

const closeTo = (
  actual: [number, number],
  expected: [number, number],
  precision = 10
) => {
  expect(actual[0]).toBeCloseTo(expected[0], precision)
  expect(actual[1]).toBeCloseTo(expected[1], precision)
}

/** Distance of a point from a centre, for checking points sit on a circle */
const radiusFrom = ([cX, cY]: Point2D, [x, y]: [number, number]) =>
  Math.sqrt((x - cX) ** 2 + (y - cY) ** 2)

describe("Rect", () => {
  it("traces as a single rect call", () => {
    const calls = recordTrace(new Rect({ at: [0.1, 0.2], w: 0.3, h: 0.4 }))
    expect(calls).toEqual([{ op: "rect", args: [0.1, 0.2, 0.3, 0.4] }])
  })

  describe("split", () => {
    it("splits horizontally by proportions, tiling the full width", () => {
      const rect = new Rect({ at: [1, 2], w: 8, h: 4 })
      const parts = rect.split({
        orientation: "horizontal",
        split: [1, 3],
      })

      expect(parts).toHaveLength(2)
      expect(parts[0].at).toEqual([1, 2])
      expect(parts[0].w).toBe(2)
      expect(parts[1].at).toEqual([3, 2])
      expect(parts[1].w).toBe(6)
      // heights untouched
      expect(parts.map((p) => p.h)).toEqual([4, 4])
      // no gaps, no overlaps
      expect(parts[0].w + parts[1].w).toBe(rect.w)
    })

    it("splits vertically by proportions, tiling the full height", () => {
      const rect = new Rect({ at: [1, 2], w: 8, h: 4 })
      const parts = rect.split({ orientation: "vertical", split: [1, 1, 2] })

      expect(parts.map((p) => p.at)).toEqual([
        [1, 2],
        [1, 3],
        [1, 4],
      ])
      expect(parts.map((p) => p.h)).toEqual([1, 1, 2])
      expect(parts.map((p) => p.w)).toEqual([8, 8, 8])
    })

    it("normalises proportions that do not sum to one", () => {
      const rect = new Rect({ at: [0, 0], w: 10, h: 10 })
      const parts = rect.split({ orientation: "horizontal", split: [10, 30] })

      expect(parts.map((p) => p.w)).toEqual([2.5, 7.5])
    })

    it("defaults to an even split when no split given", () => {
      const rect = new Rect({ at: [0, 0], w: 10, h: 6 })
      expect(
        rect.split({ orientation: "vertical" }).map((p) => p.h)
      ).toEqual([3, 3])
    })

    it("handles a single proportion", () => {
      const rect = new Rect({ at: [0, 0], w: 10, h: 6 })
      const parts = rect.split({ orientation: "horizontal", split: [1] })
      expect(parts).toHaveLength(1)
      expect(parts[0].w).toBe(10)
    })
  })
})

describe("Square", () => {
  it("is a rect with equal sides", () => {
    const square = new Square({ at: [0, 0], s: 4 })
    expect(square.w).toBe(4)
    expect(square.h).toBe(4)
  })

  it("centres when aligned to center", () => {
    const square = new Square({ at: [5, 5], s: 4, align: "center" })
    expect(square.at).toEqual([3, 3])
  })
})

describe("Circle", () => {
  it("traces as an ellipse of equal width and height", () => {
    const circleCalls = recordTrace(new Circle({ at: [0.5, 0.5], r: 0.25 }))
    expect(circleCalls[0]).toEqual({ op: "moveTo", args: [0.5, 0.25] })
    expect(circleCalls.filter((c) => c.op === "bezierCurveTo")).toHaveLength(4)
  })

  it("samples points on the circle in toPath", () => {
    const circle = new Circle({ at: [0.5, 0.5], r: 0.25 })
    const path = circle.toPath(16)
    for (const point of path.points) {
      expect(radiusFrom([0.5, 0.5], point)).toBeCloseTo(0.25, 10)
    }
  })
})

describe("RoundedRect", () => {
  it("clamps the corner radius to half the smallest side", () => {
    const rect = new RoundedRect({ at: [0, 0], w: 2, h: 1, r: 10 })
    const points = rect.toPath(4).points
    for (const [x, y] of points) {
      expect(x).toBeGreaterThanOrEqual(-1e-9)
      expect(x).toBeLessThanOrEqual(2 + 1e-9)
      expect(y).toBeGreaterThanOrEqual(-1e-9)
      expect(y).toBeLessThanOrEqual(1 + 1e-9)
    }
  })

  it("degenerates to a plain rectangle at zero detail", () => {
    const path = new RoundedRect({ at: [0, 0], w: 2, h: 4, r: 0.5 }).toPath(0)
    expect(path.points).toEqual([
      [0, 0],
      [2, 0],
      [2, 4],
      [0, 4],
      [0, 0],
    ])
  })

  it("traces corners with quadratic curves", () => {
    const calls = recordTrace(
      new RoundedRect({ at: [0, 0], w: 2, h: 2, r: 0.5 })
    )
    expect(calls.filter((c) => c.op === "quadraticCurveTo")).toHaveLength(4)
    expect(calls.filter((c) => c.op === "lineTo")).toHaveLength(4)
  })

  it("centres when aligned to center", () => {
    const rect = new RoundedRect({
      at: [5, 5],
      w: 2,
      h: 4,
      r: 0.5,
      align: "center",
    })
    expect(rect.at).toEqual([4, 3])
  })
})

describe("Arc", () => {
  it("records the geometry it was constructed with", () => {
    const arc = new Arc({ at: [0.5, 0.5], r: 0.25, a: 0, a2: Math.PI })
    expect(arc.cX).toBe(0.5)
    expect(arc.cY).toBe(0.5)
    expect(arc.radius).toBe(0.25)
    expect(arc.startAngle).toBe(0)
    expect(arc.endAngle).toBe(Math.PI)
    expect(arc.antiClockwise).toBe(false)
  })

  it("is anticlockwise when the start angle is after the end angle", () => {
    const arc = new Arc({ at: [0, 0], r: 1, a: Math.PI, a2: 0 })
    expect(arc.antiClockwise).toBe(true)
  })

  it("traces via the canvas arc method", () => {
    const calls = recordTrace(
      new Arc({ at: [0.5, 0.5], r: 0.25, a: 0, a2: Math.PI })
    )
    expect(calls.map((c) => c.op)).toContain("arc")
  })

  it("sampled path starts at the centre and stays on the radius", () => {
    const arc = new Arc({ at: [0.5, 0.5], r: 0.25, a: 0, a2: Math.PI })
    const points = arc.toPath(8).points

    expect(points[0]).toEqual([0.5, 0.5])
    expect(points[points.length - 1]).toEqual([0.5, 0.5])
    for (const point of points.slice(1, -1)) {
      expect(radiusFrom([0.5, 0.5], point)).toBeCloseTo(0.25, 10)
    }
  })
})

describe("HollowArc", () => {
  it("traces both radii", () => {
    const calls = recordTrace(
      new HollowArc({ at: [0.5, 0.5], r: 0.25, r2: 0.1, a: 0, a2: Math.PI })
    )
    const arcs = calls.filter((c) => c.op === "arc")
    expect(arcs).toHaveLength(2)
    expect(arcs[0].args[2]).toBe(0.25)
    expect(arcs[1].args[2]).toBe(0.1)
    // outer and inner traced in opposite directions
    expect(arcs[0].args[5]).toBe(!arcs[1].args[5])
  })

  it("starts on the inner radius at the start angle", () => {
    const calls = recordTrace(
      new HollowArc({ at: [0.5, 0.5], r: 0.25, r2: 0.1, a: 0, a2: Math.PI })
    )
    closeTo(calls[0].args as [number, number], [0.6, 0.5])
    closeTo(calls[1].args as [number, number], [0.75, 0.5])
  })

  it("sampled path alternates between the two radii", () => {
    const hollowArc = new HollowArc({
      at: [0.5, 0.5],
      r: 0.25,
      r2: 0.1,
      a: 0,
      a2: Math.PI,
    })
    const radii = hollowArc
      .toPath(4)
      .points.map((p) => radiusFrom([0.5, 0.5], p))

    for (const r of radii) {
      expect(Math.min(Math.abs(r - 0.25), Math.abs(r - 0.1))).toBeLessThan(1e-9)
    }
    expect(radii[0]).toBeCloseTo(0.1, 10)
  })
})

describe("RegularPolygon", () => {
  it("requires at least three sides", () => {
    expect(() => new RegularPolygon({ at: [0, 0], n: 2, r: 1 })).toThrow(
      /at least 3 sides/
    )
  })

  it("traces n vertices starting from the top, and closes", () => {
    const points = tracedPoints(new RegularPolygon({ at: [0, 0], n: 4, r: 1 }))

    // n vertices plus a repeat of the first to close the shape
    expect(points).toHaveLength(5)
    closeTo(points[0], [0, -1])
    closeTo(points[1], [1, 0])
    closeTo(points[2], [0, 1])
    closeTo(points[3], [-1, 0])
    closeTo(points[4], [0, -1])
  })

  it("respects a start angle offset", () => {
    const points = tracedPoints(
      new RegularPolygon({ at: [0, 0], n: 4, r: 1, a: Math.PI / 2 })
    )
    closeTo(points[0], [1, 0])
  })

  it("exposes the same points as a SimplePath", () => {
    const polygon = new RegularPolygon({ at: [0.5, 0.5], n: 6, r: 0.2 })
    expect(polygon.path.points).toEqual(tracedPoints(polygon))
  })

  it("keeps every vertex on the circumscribed circle", () => {
    const polygon = new RegularPolygon({ at: [0.5, 0.4], n: 7, r: 0.2 })
    for (const point of polygon.path.points) {
      expect(radiusFrom([0.5, 0.4], point)).toBeCloseTo(0.2, 10)
    }
  })
})

describe("Hexagon", () => {
  it("has six sides", () => {
    const hexagon = new Hexagon({ at: [0, 0], r: 1 })
    expect(hexagon.path.points).toHaveLength(7)
  })

  it("rotates by half a segment when horizontal", () => {
    const vertical = new Hexagon({ at: [0, 0], r: 1 }).path.points[0]
    const horizontal = new Hexagon({ at: [0, 0], r: 1, vertical: false }).path
      .points[0]
    expect(horizontal).not.toEqual(vertical)
    closeTo(vertical, [0, -1])
  })
})

describe("EquilateralTriangle", () => {
  it("has a circumradius derived from the side length", () => {
    const s = 1
    const triangle = new EquilateralTriangle({ at: [0, 0], s, flipped: false })
    const points = triangle.path.points

    expect(points).toHaveLength(4)
    const expectedR = s / (2 * Math.sin(Math.PI / 3))
    for (const point of points) {
      expect(radiusFrom([0, 0], point)).toBeCloseTo(expectedR, 10)
    }
  })

  it("points the other way when flipped", () => {
    const up = new EquilateralTriangle({ at: [0, 0], s: 1, flipped: false })
    const down = new EquilateralTriangle({ at: [0, 0], s: 1, flipped: true })
    expect(up.path.points[0][1]).toBeLessThan(0)
    expect(down.path.points[0][1]).toBeGreaterThan(0)
  })
})

describe("Star", () => {
  it("requires at least three points", () => {
    expect(() => new Star({ at: [0, 0], n: 2, r: 1 })).toThrow(
      /at least 3 points/
    )
  })

  it("alternates between the outer and inner radius", () => {
    const star = new Star({ at: [0, 0], n: 5, r: 1, r2: 0.4 })
    const points = star.path.points

    // 2n vertices plus the closing repeat
    expect(points).toHaveLength(11)
    for (let i = 0; i < points.length - 1; i++) {
      expect(radiusFrom([0, 0], points[i])).toBeCloseTo(i % 2 === 0 ? 1 : 0.4, 10)
    }
    expect(points[points.length - 1]).toEqual(points[0])
  })

  it("defaults the inner radius to half the outer", () => {
    const star = new Star({ at: [0, 0], n: 5, r: 1 })
    expect(radiusFrom([0, 0], star.path.points[1])).toBeCloseTo(0.5, 10)
  })

  it("starts from the top", () => {
    const star = new Star({ at: [0, 0], n: 5, r: 1 })
    closeTo(star.path.points[0], [0, -1])
  })
})

describe("Line", () => {
  it("traces from a to b", () => {
    const calls = recordTrace(new Line([0, 0], [1, 1]))
    expect(calls).toEqual([
      { op: "moveTo", args: [0, 0] },
      { op: "lineTo", args: [1, 1] },
    ])
  })

  it("can be moved without mutating the original", () => {
    const line = new Line([0, 0], [1, 1])
    const moved = line.moved([1, 2])
    expect(moved.path.points).toEqual([
      [1, 2],
      [2, 3],
    ])
    expect(line.path.points).toEqual([
      [0, 0],
      [1, 1],
    ])
  })
})

describe("Spiral", () => {
  it("builds a path with n + 1 points", () => {
    const spiral = new Spiral({ at: [0.5, 0.5], l: 0.01, n: 10 })
    expect(spiral.path.points).toHaveLength(11)
  })

  it("spirals outwards", () => {
    const spiral = new Spiral({ at: [0.5, 0.5], l: 0.01, n: 20, rate: 0.01 })
    const radii = spiral.path.points.map((p) => radiusFrom([0.5, 0.5], p))
    for (let i = 1; i < radii.length; i++) {
      expect(radii[i]).toBeGreaterThan(radii[i - 1])
    }
  })

  it("traces the same points as its path", () => {
    const spiral = new Spiral({ at: [0.5, 0.5], l: 0.01, n: 5 })
    expect(tracedPoints(spiral)).toEqual(spiral.path.points)
  })
})

describe("Hatching", () => {
  it("draws a line through the centre plus symmetric pairs", () => {
    const calls = recordTrace(
      new Hatching({ at: [0, 0], r: 1, a: 0, delta: 0.5 })
    )
    // moveTo/lineTo pairs only
    expect(calls.every((c) => c.op === "moveTo" || c.op === "lineTo")).toBe(true)
    expect(calls).toHaveLength(2 + 4 * 2)
  })

  it("keeps all hatch endpoints within the circle", () => {
    const points = tracedPoints(
      new Hatching({ at: [0.5, 0.5], r: 0.25, a: Math.PI / 4, delta: 0.05 })
    )
    for (const point of points) {
      expect(radiusFrom([0.5, 0.5], point)).toBeLessThanOrEqual(0.25 + 1e-9)
    }
  })
})

describe("CompoundPath", () => {
  it("traces each path in turn", () => {
    const compound = CompoundPath.withPaths(
      new Line([0, 0], [1, 0]),
      new Line([1, 0], [1, 1])
    )
    expect(tracedPoints(compound)).toEqual([
      [0, 0],
      [1, 0],
      [1, 0],
      [1, 1],
    ])
  })
})
