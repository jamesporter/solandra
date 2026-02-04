import { describe, expect, it, vi } from "vitest"
import { LinearGradient, RadialGradient } from "../gradient"

// Mock CanvasRenderingContext2D
const createMockContext = () => {
  const colorStops: Array<[number, string]> = []
  const mockGradient = {
    addColorStop: vi.fn((offset: number, color: string) => {
      colorStops.push([offset, color])
    }),
    colorStops,
  }

  return {
    createLinearGradient: vi.fn(
      (x0: number, y0: number, x1: number, y1: number) => {
        return mockGradient
      }
    ),
    createRadialGradient: vi.fn(
      (
        x0: number,
        y0: number,
        r0: number,
        x1: number,
        y1: number,
        r1: number
      ) => {
        return mockGradient
      }
    ),
    mockGradient,
  }
}

describe("gradient", () => {
  describe("LinearGradient", () => {
    it("creates a linear gradient with correct parameters", () => {
      const ctx = createMockContext()
      const gradient = new LinearGradient({
        from: [0, 0],
        to: [1, 0],
        colors: [[0, { h: 0, s: 100, l: 50, a: 1 }]],
      })

      gradient.gradient(ctx as unknown as CanvasRenderingContext2D)

      expect(ctx.createLinearGradient).toHaveBeenCalledWith(0, 0, 1, 0)
    })

    it("adds color stops", () => {
      const ctx = createMockContext()
      const gradient = new LinearGradient({
        from: [0, 0],
        to: [1, 0],
        colors: [
          [0, { h: 0, s: 100, l: 50, a: 1 }],
          [0.5, { h: 120, s: 100, l: 50, a: 1 }],
          [1, { h: 240, s: 100, l: 50, a: 1 }],
        ],
      })

      gradient.gradient(ctx as unknown as CanvasRenderingContext2D)

      expect(ctx.mockGradient.addColorStop).toHaveBeenCalledTimes(3)
      expect(ctx.mockGradient.colorStops[0][0]).toBe(0)
      expect(ctx.mockGradient.colorStops[1][0]).toBe(0.5)
      expect(ctx.mockGradient.colorStops[2][0]).toBe(1)
    })

    it("formats color stops as HSLA strings", () => {
      const ctx = createMockContext()
      const gradient = new LinearGradient({
        from: [0, 0],
        to: [1, 0],
        colors: [[0, { h: 180, s: 75, l: 50, a: 0.8 }]],
      })

      gradient.gradient(ctx as unknown as CanvasRenderingContext2D)

      expect(ctx.mockGradient.colorStops[0][1]).toBe("hsla(180, 75%, 50%, 0.8)")
    })

    it("handles vertical gradient", () => {
      const ctx = createMockContext()
      const gradient = new LinearGradient({
        from: [0.5, 0],
        to: [0.5, 1],
        colors: [[0, { h: 0, s: 100, l: 50, a: 1 }]],
      })

      gradient.gradient(ctx as unknown as CanvasRenderingContext2D)

      expect(ctx.createLinearGradient).toHaveBeenCalledWith(0.5, 0, 0.5, 1)
    })

    it("handles diagonal gradient", () => {
      const ctx = createMockContext()
      const gradient = new LinearGradient({
        from: [0, 0],
        to: [1, 1],
        colors: [[0, { h: 0, s: 100, l: 50, a: 1 }]],
      })

      gradient.gradient(ctx as unknown as CanvasRenderingContext2D)

      expect(ctx.createLinearGradient).toHaveBeenCalledWith(0, 0, 1, 1)
    })

    it("handles missing alpha (defaults to undefined which becomes 1)", () => {
      const ctx = createMockContext()
      const gradient = new LinearGradient({
        from: [0, 0],
        to: [1, 0],
        colors: [[0, { h: 0, s: 100, l: 50 }]],
      })

      gradient.gradient(ctx as unknown as CanvasRenderingContext2D)

      // hsla function defaults alpha to 1
      expect(ctx.mockGradient.colorStops[0][1]).toContain("hsla(0, 100%, 50%")
    })
  })

  describe("RadialGradient", () => {
    it("creates a radial gradient with correct parameters", () => {
      const ctx = createMockContext()
      const gradient = new RadialGradient({
        start: [0.5, 0.5],
        end: [0.5, 0.5],
        rStart: 0,
        rEnd: 0.4,
        colors: [[0, { h: 0, s: 100, l: 50, a: 1 }]],
      })

      gradient.gradient(ctx as unknown as CanvasRenderingContext2D)

      expect(ctx.createRadialGradient).toHaveBeenCalledWith(
        0.5,
        0.5,
        0,
        0.5,
        0.5,
        0.4
      )
    })

    it("adds color stops", () => {
      const ctx = createMockContext()
      const gradient = new RadialGradient({
        start: [0.5, 0.5],
        end: [0.5, 0.5],
        rStart: 0,
        rEnd: 0.5,
        colors: [
          [0, { h: 60, s: 100, l: 70, a: 1 }],
          [1, { h: 0, s: 100, l: 50, a: 1 }],
        ],
      })

      gradient.gradient(ctx as unknown as CanvasRenderingContext2D)

      expect(ctx.mockGradient.addColorStop).toHaveBeenCalledTimes(2)
    })

    it("handles offset center points", () => {
      const ctx = createMockContext()
      const gradient = new RadialGradient({
        start: [0.3, 0.3],
        end: [0.5, 0.5],
        rStart: 0.1,
        rEnd: 0.5,
        colors: [[0, { h: 0, s: 100, l: 50, a: 1 }]],
      })

      gradient.gradient(ctx as unknown as CanvasRenderingContext2D)

      expect(ctx.createRadialGradient).toHaveBeenCalledWith(
        0.3,
        0.3,
        0.1,
        0.5,
        0.5,
        0.5
      )
    })

    it("formats color stops as HSLA strings", () => {
      const ctx = createMockContext()
      const gradient = new RadialGradient({
        start: [0.5, 0.5],
        end: [0.5, 0.5],
        rStart: 0,
        rEnd: 0.5,
        colors: [[0.5, { h: 270, s: 80, l: 60, a: 0.9 }]],
      })

      gradient.gradient(ctx as unknown as CanvasRenderingContext2D)

      expect(ctx.mockGradient.colorStops[0][1]).toBe("hsla(270, 80%, 60%, 0.9)")
    })
  })
})
