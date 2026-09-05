import { beforeEach, describe, expect, it, vi } from "vitest"
import { CanvasPainterService } from "../components/Canvas"

describe("CanvasPainterService", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn(() => 7)
    )
    vi.stubGlobal("cancelAnimationFrame", vi.fn())
  })

  it("uses a high-DPI backing store while keeping logical sketch dimensions", () => {
    const service = new CanvasPainterService()
    const ctx = {
      clearRect: vi.fn(),
      setTransform: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      resetTransform: vi.fn(),
      scale: vi.fn(),
    } as unknown as CanvasRenderingContext2D
    const canvas = { width: 0, height: 0, style: {} } as HTMLCanvasElement
    const sketch = vi.fn()
    service.ctx = ctx
    service.canvas = canvas

    service.configure({
      width: 420,
      height: 220,
      aspectRatio: 2,
      sketch,
      seed: 3,
      playing: false,
      noShadow: true,
      pixelRatio: 2,
    })

    expect(service.width).toBe(420)
    expect(service.height).toBe(210)
    expect(canvas.width).toBe(840)
    expect(canvas.height).toBe(420)
    expect(canvas.style.width).toBe("420px")
    expect(sketch).toHaveBeenCalledOnce()
  })

  it("advances animation using elapsed frame time and caps long gaps", () => {
    const service = new CanvasPainterService()
    service.playing = true
    service.draw = vi.fn()

    service.updateTime(1000)
    service.updateTime(1016)
    expect(service.time).toBeCloseTo(0.016)
    service.updateTime(5000)
    expect(service.time).toBeCloseTo(0.116)
  })

  it("cancels a pending animation frame", () => {
    const service = new CanvasPainterService()
    service.af = 12
    service.stop()
    expect(cancelAnimationFrame).toHaveBeenCalledWith(12)
    expect(service.af).toBeNull()
  })
})
