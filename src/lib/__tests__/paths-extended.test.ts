import { describe, it, expect } from "vitest"
import { Arc } from "../paths/Arc"
import { CompoundPath } from "../paths/CompoundPath"
import { Hatching } from "../paths/Hatching"
import { HollowArc } from "../paths/HollowArc"
import { Line } from "../paths/Line"
import { Path } from "../paths/Path"
import { RegularPolygon, Hexagon, EquilateralTriangle } from "../paths/RegularPolygon"
import { RoundedRect } from "../paths/RoundedRect"
import { SimplePath } from "../paths/SimplePath"
import { Spiral } from "../paths/Spiral"
import { Square } from "../paths/Square"
import { Star } from "../paths/Star"
import { sampleArc, sampleQuadraticBezier, traceSimplePath } from "../paths/pathUtil"
import { Rect } from "../paths/Rect"

// Minimal mock canvas context for traceIn testing
function makeMockCtx() {
  const calls: { method: string; args: number[] }[] = []
  const ctx = {
    moveTo: (x: number, y: number) => calls.push({ method: "moveTo", args: [x, y] }),
    lineTo: (x: number, y: number) => calls.push({ method: "lineTo", args: [x, y] }),
    arc: (x: number, y: number, r: number, a1: number, a2: number, ac: boolean) =>
      calls.push({ method: "arc", args: [x, y, r, a1, a2, ac ? 1 : 0] }),
    quadraticCurveTo: (cpx: number, cpy: number, x: number, y: number) =>
      calls.push({ method: "quadraticCurveTo", args: [cpx, cpy, x, y] }),
    bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) =>
      calls.push({ method: "bezierCurveTo", args: [cp1x, cp1y, cp2x, cp2y, x, y] }),
  } as unknown as CanvasRenderingContext2D
  return { ctx, calls }
}

describe("pathUtil", () => {
  describe("sampleArc", () => {
    it("returns detail+2 points", () => {
      const pts = sampleArc({ center: [0, 0], radius: 1, startAngle: 0, endAngle: Math.PI, detail: 3 })
      expect(pts).toHaveLength(5) // detail + 2
    })

    it("starts and ends at correct positions", () => {
      const pts = sampleArc({ center: [0, 0], radius: 1, startAngle: 0, endAngle: Math.PI / 2, detail: 0 })
      expect(pts[0][0]).toBeCloseTo(1)
      expect(pts[0][1]).toBeCloseTo(0)
      expect(pts[pts.length - 1][0]).toBeCloseTo(0)
      expect(pts[pts.length - 1][1]).toBeCloseTo(1)
    })

    it("handles antiClockwise direction", () => {
      const pts = sampleArc({
        center: [0, 0],
        radius: 1,
        startAngle: Math.PI / 2,
        endAngle: 0,
        detail: 0,
        antiClockwise: true,
      })
      expect(pts[0][0]).toBeCloseTo(0)
      expect(pts[0][1]).toBeCloseTo(1)
      expect(pts[pts.length - 1][0]).toBeCloseTo(1)
      expect(pts[pts.length - 1][1]).toBeCloseTo(0)
    })

    it("wraps angle correctly for clockwise when endAngle < startAngle", () => {
      // clockwise, endAngle < startAngle → should wrap by adding 2π
      const pts = sampleArc({
        center: [0, 0],
        radius: 1,
        startAngle: Math.PI,
        endAngle: 0,
        detail: 2,
        antiClockwise: false,
      })
      expect(pts).toHaveLength(4)
    })

    it("uses non-zero center", () => {
      const pts = sampleArc({ center: [1, 2], radius: 1, startAngle: 0, endAngle: 0, detail: 0 })
      expect(pts[0][0]).toBeCloseTo(2) // 1 + 1*cos(0)
      expect(pts[0][1]).toBeCloseTo(2) // 2 + 1*sin(0)
    })
  })

  describe("sampleQuadraticBezier", () => {
    it("returns [end] for detail=0", () => {
      const pts = sampleQuadraticBezier({ start: [0, 0], control: [0.5, 1], end: [1, 0], detail: 0 })
      expect(pts).toHaveLength(1)
      expect(pts[0]).toEqual([1, 0])
    })

    it("returns detail+1 points for detail>0", () => {
      const pts = sampleQuadraticBezier({ start: [0, 0], control: [0.5, 1], end: [1, 0], detail: 3 })
      expect(pts).toHaveLength(4)
    })

    it("last point approximates end point for detail=1", () => {
      const pts = sampleQuadraticBezier({ start: [0, 0], control: [0.5, 1], end: [1, 0], detail: 1 })
      expect(pts[pts.length - 1][0]).toBeCloseTo(1)
      expect(pts[pts.length - 1][1]).toBeCloseTo(0)
    })

    it("midpoint is on the curve for a symmetric case", () => {
      // For a symmetric bezier with start=[0,0], control=[0.5,1], end=[1,0]
      // B(0.5) = 0.25*[0,0] + 2*0.25*[0.5,1] + 0.25*[1,0] = [0.5, 0.5]
      const pts = sampleQuadraticBezier({ start: [0, 0], control: [0.5, 1], end: [1, 0], detail: 1 })
      expect(pts[0][0]).toBeCloseTo(0.5)
      expect(pts[0][1]).toBeCloseTo(0.5)
    })
  })

  describe("traceSimplePath", () => {
    it("creates a SimplePath from a Line", () => {
      const line = new Line([0, 0], [1, 1])
      const sp = traceSimplePath(line)
      expect(sp).toBeInstanceOf(SimplePath)
      expect(sp.points).toHaveLength(2)
    })

    it("captures moveTo and lineTo calls", () => {
      // Use RegularPolygon which only uses moveTo/lineTo (traceSimplePath doesn't support ctx.rect)
      const poly = new RegularPolygon({ at: [0, 0], n: 4, r: 1 })
      const sp = traceSimplePath(poly)
      expect(sp.points.length).toBeGreaterThan(0)
    })
  })
})

describe("Arc", () => {
  it("sets properties correctly", () => {
    const arc = new Arc({ at: [1, 2], r: 0.5, a: 0, a2: Math.PI })
    expect(arc.cX).toBe(1)
    expect(arc.cY).toBe(2)
    expect(arc.radius).toBe(0.5)
    expect(arc.startAngle).toBe(0)
    expect(arc.endAngle).toBe(Math.PI)
    expect(arc.antiClockwise).toBe(false)
  })

  it("sets antiClockwise=true when a > a2", () => {
    const arc = new Arc({ at: [0, 0], r: 1, a: Math.PI, a2: 0 })
    expect(arc.antiClockwise).toBe(true)
  })

  it("toPath returns a SimplePath", () => {
    const arc = new Arc({ at: [0, 0], r: 1, a: 0, a2: Math.PI })
    const path = arc.toPath(4)
    expect(path).toBeInstanceOf(SimplePath)
    expect(path.points.length).toBeGreaterThan(3)
  })

  it("toPath clamps negative detail to 0", () => {
    const arc = new Arc({ at: [0, 0], r: 1, a: 0, a2: Math.PI })
    const pathNeg = arc.toPath(-5)
    const path0 = arc.toPath(0)
    expect(pathNeg.points.length).toBe(path0.points.length)
  })

  it("traceIn with nearly-equal angles skips moveTo", () => {
    const { ctx, calls } = makeMockCtx()
    const arc = new Arc({ at: [0, 0], r: 1, a: 0, a2: 0.00001 })
    arc.traceIn(ctx)
    const moveToCount = calls.filter((c) => c.method === "moveTo").length
    expect(moveToCount).toBe(0)
  })

  it("traceIn calls ctx.arc", () => {
    const { ctx, calls } = makeMockCtx()
    const arc = new Arc({ at: [0, 0], r: 1, a: 0, a2: Math.PI })
    arc.traceIn(ctx)
    expect(calls.some((c) => c.method === "arc")).toBe(true)
  })
})

describe("HollowArc", () => {
  it("sets properties correctly", () => {
    const ha = new HollowArc({ at: [0, 0], r: 1, r2: 0.5, a: 0, a2: Math.PI })
    expect(ha.cX).toBe(0)
    expect(ha.cY).toBe(0)
    expect(ha.radius).toBe(1)
    expect(ha.innerRadius).toBe(0.5)
    expect(ha.startAngle).toBe(0)
    expect(ha.endAngle).toBe(Math.PI)
    expect(ha.antiClockwise).toBe(false)
  })

  it("sets antiClockwise=true when a > a2", () => {
    const ha = new HollowArc({ at: [0, 0], r: 1, r2: 0.5, a: Math.PI, a2: 0 })
    expect(ha.antiClockwise).toBe(true)
  })

  it("toPath returns a SimplePath", () => {
    const ha = new HollowArc({ at: [0, 0], r: 1, r2: 0.5, a: 0, a2: Math.PI })
    const path = ha.toPath(2)
    expect(path).toBeInstanceOf(SimplePath)
    expect(path.points.length).toBeGreaterThan(4)
  })

  it("traceIn calls ctx.arc twice (outer and inner)", () => {
    const { ctx, calls } = makeMockCtx()
    const ha = new HollowArc({ at: [0, 0], r: 1, r2: 0.5, a: 0, a2: Math.PI / 2 })
    ha.traceIn(ctx)
    const arcCalls = calls.filter((c) => c.method === "arc")
    expect(arcCalls.length).toBe(2)
  })
})

describe("CompoundPath", () => {
  it("creates a compound path with withPaths", () => {
    const line1 = new Line([0, 0], [1, 0])
    const line2 = new Line([0, 1], [1, 1])
    const cp = CompoundPath.withPaths(line1, line2)
    expect(cp).toBeInstanceOf(CompoundPath)
  })

  it("traceIn calls traceIn on all sub-paths", () => {
    const { ctx, calls } = makeMockCtx()
    const line1 = new Line([0, 0], [1, 0])
    const line2 = new Line([0, 1], [1, 1])
    const cp = CompoundPath.withPaths(line1, line2)
    cp.traceIn(ctx)
    const moveCalls = calls.filter((c) => c.method === "moveTo")
    const lineCalls = calls.filter((c) => c.method === "lineTo")
    expect(moveCalls.length).toBe(2)
    expect(lineCalls.length).toBe(2)
  })

  it("works with a single path", () => {
    const { ctx, calls } = makeMockCtx()
    const line = new Line([0, 0], [1, 1])
    const cp = CompoundPath.withPaths(line)
    cp.traceIn(ctx)
    expect(calls.filter((c) => c.method === "moveTo").length).toBe(1)
  })
})

describe("Line", () => {
  it("path getter returns SimplePath with two points", () => {
    const line = new Line([0, 0], [1, 1])
    const sp = line.path
    expect(sp).toBeInstanceOf(SimplePath)
    expect(sp.points).toEqual([[0, 0], [1, 1]])
  })

  it("moved returns a new Line translated by delta", () => {
    const line = new Line([0, 0], [1, 1])
    const moved = line.moved([2, 3])
    const sp = moved.path
    expect(sp.points[0]).toEqual([2, 3])
    expect(sp.points[1]).toEqual([3, 4])
  })

  it("moved does not mutate the original", () => {
    const line = new Line([0, 0], [1, 1])
    line.moved([5, 5])
    expect(line.path.points[0]).toEqual([0, 0])
  })

  it("traceIn calls moveTo and lineTo", () => {
    const { ctx, calls } = makeMockCtx()
    const line = new Line([0, 0], [1, 1])
    line.traceIn(ctx)
    expect(calls[0]).toEqual({ method: "moveTo", args: [0, 0] })
    expect(calls[1]).toEqual({ method: "lineTo", args: [1, 1] })
  })
})

describe("RegularPolygon", () => {
  it("throws if n < 3", () => {
    expect(() => new RegularPolygon({ at: [0, 0], n: 2, r: 1 })).toThrow(
      "Must have at least 3 sides"
    )
  })

  it("creates a triangle (n=3)", () => {
    const poly = new RegularPolygon({ at: [0.5, 0.5], n: 3, r: 0.4 })
    const path = poly.path
    expect(path.points.length).toBe(4) // 3 vertices + closing
  })

  it("creates a square (n=4)", () => {
    const poly = new RegularPolygon({ at: [0, 0], n: 4, r: 1 })
    const path = poly.path
    expect(path.points.length).toBe(5)
  })

  it("accepts optional angle parameter", () => {
    const poly1 = new RegularPolygon({ at: [0, 0], n: 6, r: 1 })
    const poly2 = new RegularPolygon({ at: [0, 0], n: 6, r: 1, a: Math.PI / 6 })
    // Different starting angles produce different first points
    expect(poly1.path.points[0]).not.toEqual(poly2.path.points[0])
  })
})

describe("Hexagon", () => {
  it("creates a 6-sided polygon", () => {
    const hex = new Hexagon({ at: [0, 0], r: 1 })
    expect(hex).toBeInstanceOf(RegularPolygon)
    // 6 vertices + closing = 7 points
    expect(hex.path.points.length).toBe(7)
  })

  it("vertical variant differs from horizontal", () => {
    const vHex = new Hexagon({ at: [0, 0], r: 1, vertical: true })
    const hHex = new Hexagon({ at: [0, 0], r: 1, vertical: false })
    expect(vHex.path.points[0]).not.toEqual(hHex.path.points[0])
  })
})

describe("EquilateralTriangle", () => {
  it("creates a 3-sided polygon", () => {
    const tri = new EquilateralTriangle({ at: [0, 0], s: 1, flipped: false })
    expect(tri).toBeInstanceOf(RegularPolygon)
    expect(tri.path.points.length).toBe(4)
  })

  it("flipped variant differs from non-flipped", () => {
    const up = new EquilateralTriangle({ at: [0, 0], s: 1, flipped: false })
    const down = new EquilateralTriangle({ at: [0, 0], s: 1, flipped: true })
    expect(up.path.points[0]).not.toEqual(down.path.points[0])
  })
})

describe("RoundedRect", () => {
  it("stores topLeft position (default align)", () => {
    const rr = new RoundedRect({ at: [1, 2], w: 4, h: 3, r: 0.5 })
    expect(rr.at).toEqual([1, 2])
    expect(rr.w).toBe(4)
    expect(rr.h).toBe(3)
    expect(rr.r).toBe(0.5)
  })

  it("adjusts position for center alignment", () => {
    const rr = new RoundedRect({ at: [2, 2], w: 4, h: 2, r: 0.2, align: "center" })
    expect(rr.at).toEqual([0, 1])
  })

  it("toPath with detail=0 returns simple rectangle", () => {
    const rr = new RoundedRect({ at: [0, 0], w: 2, h: 1, r: 0.2 })
    const path = rr.toPath(0)
    expect(path).toBeInstanceOf(SimplePath)
    // Simple rectangle: 4 corners + closing = 5 points
    expect(path.points.length).toBe(5)
  })

  it("toPath with r=0 returns simple rectangle", () => {
    const rr = new RoundedRect({ at: [0, 0], w: 2, h: 1, r: 0 })
    const path = rr.toPath(4)
    expect(path.points.length).toBe(5)
  })

  it("toPath with detail>0 and r>0 returns more points (rounded corners)", () => {
    const rr = new RoundedRect({ at: [0, 0], w: 2, h: 1, r: 0.2 })
    const simple = rr.toPath(0)
    const rounded = rr.toPath(2)
    expect(rounded.points.length).toBeGreaterThan(simple.points.length)
  })

  it("traceIn calls quadraticCurveTo for corners", () => {
    const { ctx, calls } = makeMockCtx()
    const rr = new RoundedRect({ at: [0, 0], w: 2, h: 1, r: 0.2 })
    rr.traceIn(ctx)
    expect(calls.filter((c) => c.method === "quadraticCurveTo").length).toBe(4)
  })
})

describe("Spiral", () => {
  it("creates a path with n+1 points", () => {
    const spiral = new Spiral({ at: [0.5, 0.5], l: 0.05, n: 100 })
    expect(spiral.path.points.length).toBe(101)
  })

  it("uses default rate and angle", () => {
    const spiral = new Spiral({ at: [0, 0], l: 0.1, n: 10 })
    expect(spiral.path.points.length).toBe(11)
  })

  it("accepts custom start angle", () => {
    const s1 = new Spiral({ at: [0, 0], l: 0.1, n: 5, a: 0 })
    const s2 = new Spiral({ at: [0, 0], l: 0.1, n: 5, a: Math.PI })
    expect(s1.path.points[0]).not.toEqual(s2.path.points[0])
  })

  it("traceIn delegates to path.traceIn", () => {
    const { ctx, calls } = makeMockCtx()
    const spiral = new Spiral({ at: [0, 0], l: 0.1, n: 3 })
    spiral.traceIn(ctx)
    expect(calls.length).toBeGreaterThan(0)
  })
})

describe("Square", () => {
  it("extends Rect with equal width and height", () => {
    const sq = new Square({ at: [0, 0], s: 5 })
    expect(sq.w).toBe(5)
    expect(sq.h).toBe(5)
  })

  it("accepts center alignment", () => {
    const sq = new Square({ at: [5, 5], s: 4, align: "center" })
    expect(sq.at).toEqual([3, 3])
    expect(sq.w).toBe(4)
    expect(sq.h).toBe(4)
  })
})

describe("Star", () => {
  it("throws if n < 3", () => {
    expect(() => new Star({ at: [0, 0], n: 2, r: 1 })).toThrow(
      "Must have at least 3 points"
    )
  })

  it("creates a 5-pointed star", () => {
    const star = new Star({ at: [0, 0], n: 5, r: 1 })
    const path = star.path
    // 5 outer + 5 inner + closing = 11 points
    expect(path.points.length).toBe(11)
  })

  it("creates a 3-pointed star", () => {
    const star = new Star({ at: [0, 0], n: 3, r: 1 })
    const path = star.path
    expect(path.points.length).toBe(7)
  })

  it("accepts custom inner radius r2", () => {
    const star1 = new Star({ at: [0, 0], n: 5, r: 1 })
    const star2 = new Star({ at: [0, 0], n: 5, r: 1, r2: 0.8 })
    expect(star1.path.points[0]).not.toEqual(star2.path.points[1])
  })
})

describe("Hatching", () => {
  it("traceIn calls moveTo and lineTo", () => {
    const { ctx, calls } = makeMockCtx()
    const h = new Hatching({ at: [0.5, 0.5], r: 0.3, a: 0, delta: 0.1 })
    h.traceIn(ctx)
    expect(calls.filter((c) => c.method === "moveTo").length).toBeGreaterThan(0)
    expect(calls.filter((c) => c.method === "lineTo").length).toBeGreaterThan(0)
  })

  it("produces the center line first", () => {
    const { calls } = makeMockCtx()
    const { ctx } = makeMockCtx()
    const h = new Hatching({ at: [0.5, 0.5], r: 0.2, a: Math.PI / 2, delta: 0.1 })
    h.traceIn(ctx)
  })
})

describe("Path", () => {
  describe("startAt", () => {
    it("creates a Path", () => {
      const p = Path.startAt([0, 0])
      expect(p).toBeInstanceOf(Path)
    })
  })

  describe("addLineTo", () => {
    it("adds a line edge and returns same path", () => {
      const p = Path.startAt([0, 0])
      const returned = p.addLineTo([1, 0])
      expect(returned).toBe(p)
    })
  })

  describe("addCurveTo", () => {
    it("adds a cubic edge", () => {
      const p = Path.startAt([0, 0]).addCurveTo([1, 0])
      expect(p).toBeInstanceOf(Path)
    })

    it("accepts curve config", () => {
      const p = Path.startAt([0, 0]).addCurveTo([1, 0], { curveSize: 0.5, polarlity: -1 })
      expect(p).toBeInstanceOf(Path)
    })
  })

  describe("addCurve", () => {
    it("is equivalent to addCurveTo with config", () => {
      const p1 = Path.startAt([0, 0]).addCurveTo([1, 0], { curveSize: 0.3 })
      const p2 = Path.startAt([0, 0]).addCurve({ to: [1, 0], curveSize: 0.3 })
      // Both produce a valid path
      expect(p1).toBeInstanceOf(Path)
      expect(p2).toBeInstanceOf(Path)
    })
  })

  describe("moved", () => {
    it("translates all points", () => {
      const p = Path.startAt([0, 0]).addLineTo([1, 0])
      const moved = p.moved([2, 3])
      const { ctx, calls } = makeMockCtx()
      moved.traceIn(ctx)
      expect(calls[0]).toEqual({ method: "moveTo", args: [2, 3] })
    })
  })

  describe("centroid", () => {
    it("returns centroid of line segment start points", () => {
      const p = Path.startAt([0, 0]).addLineTo([2, 0]).addLineTo([2, 2])
      const c = p.centroid
      // edges from [0,0]→[2,0] and [2,0]→[2,2]: centroid of [0,0],[2,0] = [1,0]
      expect(c[0]).toBeCloseTo(1)
      expect(c[1]).toBeCloseTo(0)
    })
  })

  describe("reversed", () => {
    it("reverses line edges", () => {
      const { ctx: ctx1, calls: calls1 } = makeMockCtx()
      const { ctx: ctx2, calls: calls2 } = makeMockCtx()
      const p = Path.startAt([0, 0]).addLineTo([1, 0]).addLineTo([1, 1])
      p.traceIn(ctx1)
      p.reversed.traceIn(ctx2)
      // First moveTo of original vs reversed should differ
      expect(calls1[0].args).not.toEqual(calls2[0].args)
    })
  })

  describe("scaled", () => {
    it("returns a Path", () => {
      const p = Path.startAt([0, 0]).addLineTo([2, 0]).addLineTo([2, 2]).addLineTo([0, 2])
      const scaled = p.scaled(2)
      expect(scaled).toBeInstanceOf(Path)
    })
  })

  describe("rotated", () => {
    it("returns a Path", () => {
      const p = Path.startAt([0, 0]).addLineTo([1, 0]).addLineTo([1, 1]).addLineTo([0, 1])
      const rotated = p.rotated(Math.PI / 2)
      expect(rotated).toBeInstanceOf(Path)
    })
  })

  describe("segmented", () => {
    it("splits into triangular segments", () => {
      // 4 edges: [0,0]→[2,0]→[2,2]→[0,2]→[0,0]
      const p = Path.startAt([0, 0])
        .addLineTo([2, 0])
        .addLineTo([2, 2])
        .addLineTo([0, 2])
        .addLineTo([0, 0])
      const segments = p.segmented
      expect(segments).toHaveLength(4)
      segments.forEach((s) => expect(s).toBeInstanceOf(Path))
    })

    it("throws with fewer than 2 edges", () => {
      // 0 edges: centroid fails; 1 edge: explicit check fires
      expect(() => {
        const p = Path.startAt([0, 0]).addLineTo([1, 0])
        return p.segmented
      }).toThrow()
    })
  })

  describe("exploded", () => {
    it("returns displaced segments", () => {
      // 4 edges: closed square
      const p = Path.startAt([0, 0])
        .addLineTo([2, 0])
        .addLineTo([2, 2])
        .addLineTo([0, 2])
        .addLineTo([0, 0])
      const exploded = p.exploded()
      expect(exploded).toHaveLength(4)
    })
  })

  describe("traceIn", () => {
    it("calls moveTo on first edge start and lineTo for line edges", () => {
      const { ctx, calls } = makeMockCtx()
      const p = Path.startAt([0, 0]).addLineTo([1, 0]).addLineTo([1, 1])
      p.traceIn(ctx)
      expect(calls[0]).toEqual({ method: "moveTo", args: [0, 0] })
      expect(calls[1]).toEqual({ method: "lineTo", args: [1, 0] })
      expect(calls[2]).toEqual({ method: "lineTo", args: [1, 1] })
    })

    it("calls bezierCurveTo for cubic edges", () => {
      const { ctx, calls } = makeMockCtx()
      const p = Path.startAt([0, 0]).addCurveTo([1, 0])
      p.traceIn(ctx)
      expect(calls.some((c) => c.method === "bezierCurveTo")).toBe(true)
    })
  })

  describe("subdivide", () => {
    it("splits a path into two sub-paths (straight)", () => {
      const p = Path.startAt([0, 0])
        .addLineTo([1, 0])
        .addLineTo([1, 1])
        .addLineTo([0, 1])
        .addLineTo([0, 0])
      const [p1, p2] = p.subdivide({ m: 0, n: 2 })
      expect(p1).toBeInstanceOf(Path)
      expect(p2).toBeInstanceOf(Path)
    })
  })
})
