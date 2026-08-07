import { describe, expect, it } from "vitest"
import {
  sampleArc,
  sampleQuadraticBezier,
  traceSimplePath,
} from "../paths/pathUtil"
import { Line } from "../paths/Line"
import { Point2D } from "../types/sol"

const radiusFrom = ([cX, cY]: Point2D, [x, y]: Point2D) =>
  Math.sqrt((x - cX) ** 2 + (y - cY) ** 2)

describe("sampleArc", () => {
  it("returns detail + 2 points", () => {
    for (const detail of [0, 1, 5, 20]) {
      const points = sampleArc({
        center: [0, 0],
        radius: 1,
        startAngle: 0,
        endAngle: Math.PI,
        detail,
      })
      expect(points).toHaveLength(detail + 2)
    }
  })

  it("starts and ends on the given angles", () => {
    const points = sampleArc({
      center: [1, 1],
      radius: 2,
      startAngle: 0,
      endAngle: Math.PI / 2,
      detail: 4,
    })
    expect(points[0][0]).toBeCloseTo(3, 10)
    expect(points[0][1]).toBeCloseTo(1, 10)
    expect(points[points.length - 1][0]).toBeCloseTo(1, 10)
    expect(points[points.length - 1][1]).toBeCloseTo(3, 10)
  })

  it("keeps every point on the radius", () => {
    const points = sampleArc({
      center: [0.5, 0.5],
      radius: 0.25,
      startAngle: 1,
      endAngle: 3,
      detail: 10,
    })
    for (const point of points) {
      expect(radiusFrom([0.5, 0.5], point)).toBeCloseTo(0.25, 10)
    }
  })

  it("goes the long way round when the end angle is behind the start", () => {
    const points = sampleArc({
      center: [0, 0],
      radius: 1,
      startAngle: Math.PI,
      endAngle: 0,
      detail: 2,
    })
    // clockwise from PI to 0 passes through 3PI/2, i.e. below the origin
    expect(points[2][1]).toBeLessThan(0)
  })

  it("goes the other way when anticlockwise", () => {
    const points = sampleArc({
      center: [0, 0],
      radius: 1,
      startAngle: Math.PI,
      endAngle: 0,
      detail: 2,
      antiClockwise: true,
    })
    expect(points[2][1]).toBeGreaterThan(0)
  })
})

describe("sampleQuadraticBezier", () => {
  const curve = {
    start: [0, 0] as Point2D,
    control: [1, 0] as Point2D,
    end: [1, 1] as Point2D,
  }

  it("returns just the end point at zero detail", () => {
    expect(sampleQuadraticBezier({ ...curve, detail: 0 })).toEqual([[1, 1]])
  })

  it("returns detail + 1 points, finishing at the end point", () => {
    const points = sampleQuadraticBezier({ ...curve, detail: 4 })
    expect(points).toHaveLength(5)
    expect(points[points.length - 1]).toEqual([1, 1])
  })

  it("bends towards the control point", () => {
    const points = sampleQuadraticBezier({ ...curve, detail: 1 })
    // midpoint of the curve is pulled towards [1, 0], not the chord midpoint
    expect(points[0][0]).toBeGreaterThan(0.5)
    expect(points[0][1]).toBeLessThan(0.5)
  })

  it("is a straight line when the control sits on the chord", () => {
    const points = sampleQuadraticBezier({
      start: [0, 0],
      control: [0.5, 0.5],
      end: [1, 1],
      detail: 3,
    })
    for (const [x, y] of points) {
      expect(x).toBeCloseTo(y, 10)
    }
  })
})

describe("traceSimplePath", () => {
  it("collects the points a traceable visits", () => {
    expect(traceSimplePath(new Line([0, 0], [1, 2])).points).toEqual([
      [0, 0],
      [1, 2],
    ])
  })
})
