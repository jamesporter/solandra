import { describe, expect, it } from "vitest"
import { Circle } from "../paths/Circle"
import { Ellipse } from "../paths/Ellipse"
import { Rect } from "../paths/Rect"
import { SimplePath } from "../paths/SimplePath"
import { Point2D } from "../types/sol"

describe("paths", () => {
  describe("Rect", () => {
    it("creates a rectangle with topLeft alignment (default)", () => {
      const rect = new Rect({ at: [0, 0], w: 10, h: 5 })
      expect(rect.at).toEqual([0, 0])
      expect(rect.w).toBe(10)
      expect(rect.h).toBe(5)
    })

    it("creates a rectangle with center alignment", () => {
      const rect = new Rect({ at: [5, 5], w: 10, h: 10, align: "center" })
      expect(rect.at).toEqual([0, 0])
      expect(rect.w).toBe(10)
      expect(rect.h).toBe(10)
    })

    it("converts to SimplePath with correct points", () => {
      const rect = new Rect({ at: [0, 0], w: 2, h: 3 })
      const path = rect.path
      expect(path.points).toHaveLength(5) // 4 corners + closing point
      expect(path.points[0]).toEqual([0, 0])
      expect(path.points[1]).toEqual([2, 0])
      expect(path.points[2]).toEqual([2, 3])
      expect(path.points[3]).toEqual([0, 3])
      expect(path.points[4]).toEqual([0, 0]) // closed
    })

    describe("split", () => {
      it("splits horizontally in half", () => {
        const rect = new Rect({ at: [0, 0], w: 10, h: 10 })
        const [left, right] = rect.split({ orientation: "horizontal" })

        expect(left.at).toEqual([0, 0])
        expect(left.w).toBe(5)
        expect(left.h).toBe(10)

        expect(right.at).toEqual([5, 0])
        expect(right.w).toBe(5)
        expect(right.h).toBe(10)
      })

      it("splits vertically in half", () => {
        const rect = new Rect({ at: [0, 0], w: 10, h: 10 })
        const [top, bottom] = rect.split({ orientation: "vertical" })

        expect(top.at).toEqual([0, 0])
        expect(top.w).toBe(10)
        expect(top.h).toBe(5)

        expect(bottom.at).toEqual([0, 5])
        expect(bottom.w).toBe(10)
        expect(bottom.h).toBe(5)
      })

      it("splits horizontally with proportions", () => {
        const rect = new Rect({ at: [0, 0], w: 10, h: 10 })
        const parts = rect.split({
          orientation: "horizontal",
          split: [1, 2, 1],
        })

        expect(parts).toHaveLength(3)
        expect(parts[0].w).toBe(2.5)
        expect(parts[1].w).toBe(5)
        expect(parts[2].w).toBe(2.5)
      })

      it("splits vertically with proportions", () => {
        const rect = new Rect({ at: [0, 0], w: 10, h: 10 })
        const parts = rect.split({ orientation: "vertical", split: [1, 1] })

        expect(parts).toHaveLength(2)
        expect(parts[0].h).toBe(5)
        expect(parts[1].h).toBe(5)
      })
    })
  })

  describe("Ellipse", () => {
    it("creates an ellipse with center alignment (default)", () => {
      const ellipse = new Ellipse({ at: [0.5, 0.5], w: 0.4, h: 0.3 })
      // Ellipse stores config internally
      expect(ellipse).toBeDefined()
    })

    it("converts to SimplePath with detail 0 (diamond)", () => {
      const ellipse = new Ellipse({ at: [0.5, 0.5], w: 0.4, h: 0.3 })
      const path = ellipse.toPath(0)
      expect(path.points).toHaveLength(5) // 4 points + closing
    })

    it("converts to SimplePath with higher detail", () => {
      const ellipse = new Ellipse({ at: [0.5, 0.5], w: 0.4, h: 0.3 })
      const path = ellipse.toPath(12)
      expect(path.points.length).toBeGreaterThan(5)
    })

    it("handles topLeft alignment", () => {
      const ellipse = new Ellipse({ at: [0, 0], w: 1, h: 1, align: "topLeft" })
      const path = ellipse.toPath(0)
      // Should be centered at (0.5, 0.5) when aligned topLeft
      const points = path.points
      expect(points).toContainEqual([0.5, 0])
      expect(points).toContainEqual([1, 0.5])
      expect(points).toContainEqual([0.5, 1])
      expect(points).toContainEqual([0, 0.5])
    })
  })

  describe("Circle", () => {
    it("creates a circle (extends Ellipse)", () => {
      const circle = new Circle({ at: [0.5, 0.5], r: 0.2 })
      expect(circle).toBeInstanceOf(Ellipse)
    })

    it("converts to path correctly", () => {
      const circle = new Circle({ at: [0.5, 0.5], r: 0.2 })
      const path = circle.toPath(0)
      expect(path.points).toHaveLength(5)

      // Check cardinal points
      const points = path.points
      const topExists = points.some(
        (p) => Math.abs(p[0] - 0.5) < 0.01 && Math.abs(p[1] - 0.3) < 0.01
      )
      const rightExists = points.some(
        (p) => Math.abs(p[0] - 0.7) < 0.01 && Math.abs(p[1] - 0.5) < 0.01
      )
      expect(topExists).toBe(true)
      expect(rightExists).toBe(true)
    })
  })

  describe("SimplePath", () => {
    describe("creation", () => {
      it("creates empty path", () => {
        const path = new SimplePath()
        expect(path.points).toEqual([])
      })

      it("creates path with initial points", () => {
        const path = new SimplePath([
          [0, 0],
          [1, 1],
        ])
        expect(path.points).toEqual([
          [0, 0],
          [1, 1],
        ])
      })

      it("creates path using startAt", () => {
        const path = SimplePath.startAt([0, 0])
        expect(path.points).toEqual([[0, 0]])
      })

      it("creates path using withPoints", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [1, 0],
          [1, 1],
        ])
        expect(path.points).toEqual([
          [0, 0],
          [1, 0],
          [1, 1],
        ])
      })
    })

    describe("addPoint", () => {
      it("adds a point to the path", () => {
        const path = SimplePath.startAt([0, 0])
        path.addPoint([1, 1])
        expect(path.points).toEqual([
          [0, 0],
          [1, 1],
        ])
      })

      it("chains addPoint calls", () => {
        const path = SimplePath.startAt([0, 0])
          .addPoint([1, 0])
          .addPoint([1, 1])
          .addPoint([0, 1])
        expect(path.points).toHaveLength(4)
      })
    })

    describe("close", () => {
      it("closes the path by repeating first point", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [1, 0],
          [1, 1],
        ]).close()
        expect(path.points).toHaveLength(4)
        expect(path.points[3]).toEqual([0, 0])
      })

      it("handles empty path", () => {
        const path = new SimplePath().close()
        expect(path.points).toEqual([])
      })
    })

    describe("centroid", () => {
      it("calculates centroid of triangle", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [3, 0],
          [0, 3],
        ])
        const c = path.centroid
        expect(c[0]).toBe(1)
        expect(c[1]).toBe(1)
      })

      it("calculates centroid of square", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [2, 0],
          [2, 2],
          [0, 2],
        ])
        const c = path.centroid
        expect(c[0]).toBe(1)
        expect(c[1]).toBe(1)
      })
    })

    describe("moved", () => {
      it("moves path by delta", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [1, 1],
        ])
        const moved = path.moved([5, 5])
        expect(moved.points).toEqual([
          [5, 5],
          [6, 6],
        ])
      })

      it("returns new path (doesn't mutate)", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [1, 1],
        ])
        const moved = path.moved([5, 5])
        expect(path.points).toEqual([
          [0, 0],
          [1, 1],
        ])
        expect(moved.points).toEqual([
          [5, 5],
          [6, 6],
        ])
      })
    })

    describe("scaled", () => {
      it("scales path around centroid", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [2, 0],
          [2, 2],
          [0, 2],
        ])
        const scaled = path.scaled(2)
        // Centroid is (1, 1), so points should move away by factor of 2
        expect(scaled.centroid[0]).toBeCloseTo(1)
        expect(scaled.centroid[1]).toBeCloseTo(1)
        // Check a corner point
        expect(scaled.points[0][0]).toBeCloseTo(-1)
        expect(scaled.points[0][1]).toBeCloseTo(-1)
      })
    })

    describe("reversed", () => {
      it("reverses point order", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [1, 0],
          [1, 1],
        ])
        const reversed = path.reversed
        expect(reversed.points).toEqual([
          [1, 1],
          [1, 0],
          [0, 0],
        ])
      })
    })

    describe("transformed", () => {
      it("applies transformation to all points", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [1, 1],
        ])
        const doubled = path.transformed(([x, y]) => [x * 2, y * 2])
        expect(doubled.points).toEqual([
          [0, 0],
          [2, 2],
        ])
      })
    })

    describe("rotated", () => {
      it("rotates path around centroid", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [2, 0],
          [2, 2],
          [0, 2],
        ])
        const rotated = path.rotated(Math.PI)
        // After 180 degree rotation, centroid should be the same
        expect(rotated.centroid[0]).toBeCloseTo(1)
        expect(rotated.centroid[1]).toBeCloseTo(1)
        // Points should be reflected
        expect(rotated.points[0][0]).toBeCloseTo(2)
        expect(rotated.points[0][1]).toBeCloseTo(2)
      })
    })

    describe("withAppended", () => {
      it("appends another path", () => {
        const path1 = SimplePath.withPoints([
          [0, 0],
          [1, 0],
        ])
        const path2 = SimplePath.withPoints([
          [1, 1],
          [0, 1],
        ])
        const combined = path1.withAppended(path2)
        expect(combined.points).toEqual([
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ])
      })
    })

    describe("edges", () => {
      it("returns array of edge paths", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ])
        const edges = path.edges
        expect(edges).toHaveLength(4)
        expect(edges[0].points).toEqual([
          [0, 0],
          [1, 0],
        ])
        expect(edges[1].points).toEqual([
          [1, 0],
          [1, 1],
        ])
        expect(edges[2].points).toEqual([
          [1, 1],
          [0, 1],
        ])
        expect(edges[3].points).toEqual([
          [0, 1],
          [0, 0],
        ])
      })
    })

    describe("segmented", () => {
      it("splits path into triangular segments around centroid", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [2, 0],
          [2, 2],
          [0, 2],
          [0, 0],
        ])
        const segments = path.segmented
        expect(segments).toHaveLength(4)
        // Each segment should have centroid as one of its points
        segments.forEach((seg) => {
          const hasCenter = seg.points.some(
            (p) => Math.abs(p[0] - 1) < 0.01 && Math.abs(p[1] - 1) < 0.01
          )
          expect(hasCenter).toBe(true)
        })
      })

      it("throws error with less than 2 points", () => {
        const path = SimplePath.withPoints([[0, 0]])
        expect(() => path.segmented).toThrow("Must have at least 2 points")
      })
    })

    describe("exploded", () => {
      it("creates exploded triangular segments", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [2, 0],
          [2, 2],
          [0, 2],
          [0, 0],
        ])
        const exploded = path.exploded({ magnitude: 1.5, scale: 1 })
        expect(exploded).toHaveLength(4)
      })

      it("uses default values", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [2, 0],
          [2, 2],
          [0, 2],
          [0, 0],
        ])
        const exploded = path.exploded()
        expect(exploded).toHaveLength(4)
      })
    })

    describe("chaiken", () => {
      it("smooths path with chaiken algorithm", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ])
        const smoothed = path.chaiken({ n: 1 })
        // Chaiken adds more points
        expect(smoothed.points.length).toBeGreaterThan(4)
      })

      it("handles multiple iterations", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ])
        const smoothed = path.chaiken({ n: 2 })
        expect(smoothed.points.length).toBeGreaterThan(8)
      })
    })

    describe("transformPoints", () => {
      it("mutates points in place", () => {
        const path = SimplePath.withPoints([
          [0, 0],
          [1, 1],
        ])
        path.transformPoints(([x, y]) => [x + 1, y + 1])
        expect(path.points).toEqual([
          [1, 1],
          [2, 2],
        ])
      })
    })
  })
})
