import { describe, expect, it } from "vitest"
import SCanvas from "../sCanvas"
import { Rect } from "../paths/Rect"
import { Circle } from "../paths/Circle"
import { LinearGradient } from "../gradient"
import { createMockCtx } from "./testUtils"

const canvas = (width = 100, height = 100) => {
  const { ctx, history } = createMockCtx()
  const s = new SCanvas(ctx, { width, height }, 1, 0)
  history.length = 0 // ignore the constructor's setup calls
  return { s, history }
}

/** Every state changing helper should save before and restore after */
const stateHelpers: [string, (s: SCanvas, cb: () => void) => void][] = [
  ["withContext", (s, cb) => s.withContext(cb)],
  ["withRotation", (s, cb) => s.withRotation(0.5, cb)],
  ["withScale", (s, cb) => s.withScale([2, 2], cb)],
  ["withTranslation", (s, cb) => s.withTranslation([0.1, 0.1], cb)],
  [
    "withTransform",
    (s, cb) =>
      s.withTransform(
        { hScale: 1, hSkew: 0, vSkew: 0, vScale: 1, dX: 0, dY: 0 },
        cb
      ),
  ],
  ["withBlendMode", (s, cb) => s.withBlendMode("multiply", cb)],
  [
    "withClipping",
    (s, cb) => s.withClipping(new Rect({ at: [0, 0], w: 1, h: 1 }), cb),
  ],
]

describe("SCanvas state helpers", () => {
  for (const [name, run] of stateHelpers) {
    it(`${name} saves, runs the callback, then restores`, () => {
      const { s, history } = canvas()
      let calledWhilstSaved = false

      run(s, () => {
        calledWhilstSaved =
          history.includes("save()") && !history.includes("restore()")
      })

      expect(calledWhilstSaved).toBe(true)
      expect(history[0]).toBe("save()")
      expect(history[history.length - 1]).toBe("restore()")
      expect(history.filter((h) => h === "save()")).toHaveLength(1)
      expect(history.filter((h) => h === "restore()")).toHaveLength(1)
    })

    it(`${name} restores even when nested`, () => {
      const { s, history } = canvas()
      run(s, () => run(s, () => {}))

      expect(history.filter((h) => h === "save()")).toHaveLength(2)
      expect(history.filter((h) => h === "restore()")).toHaveLength(2)
      expect(history[history.length - 1]).toBe("restore()")
    })
  }

  it("withRotation rotates by the given angle", () => {
    const { s, history } = canvas()
    s.withRotation(0.25, () => {})
    expect(history).toContain("rotate(0.25)")
  })

  it("withScale scales by the given vector", () => {
    const { s, history } = canvas()
    s.withScale([2, 3], () => {})
    expect(history).toContain("scale(2, 3)")
  })

  it("withTranslation translates by the given vector", () => {
    const { s, history } = canvas()
    s.withTranslation([0.1, 0.2], () => {})
    expect(history).toContain("translate(0.1, 0.2)")
  })

  it("withTransform applies the full matrix", () => {
    const { s, history } = canvas()
    s.withTransform(
      { hScale: 1, hSkew: 2, vSkew: 3, vScale: 4, dX: 5, dY: 6 },
      () => {}
    )
    expect(history).toContain("transform(1, 2, 3, 4, 5, 6)")
  })

  it("withBlendMode sets the composite operation", () => {
    const { s, history } = canvas()
    s.withBlendMode("multiply", () => {})
    expect(history).toContain("globalCompositeOperation = multiply")
  })

  it("withClipping traces the clip area and clips", () => {
    const { s, history } = canvas()
    s.withClipping(new Rect({ at: [0, 0], w: 0.5, h: 0.5 }), () => {})
    expect(history).toContain("beginPath()")
    expect(history).toContain("rect(0, 0, 0.5, 0.5)")
    expect(history).toContain("clip()")
  })
})

describe("SCanvas drawing", () => {
  it("draw begins a path, traces and strokes", () => {
    const { s, history } = canvas()
    s.draw(new Rect({ at: [0, 0], w: 1, h: 1 }))
    expect(history).toEqual(["beginPath()", "rect(0, 0, 1, 1)", "stroke()"])
  })

  it("fill begins a path, traces and fills", () => {
    const { s, history } = canvas()
    s.fill(new Circle({ at: [0.5, 0.5], r: 0.1 }))
    expect(history[0]).toBe("beginPath()")
    expect(history[history.length - 1]).toBe("fill()")
  })

  it("background fills the whole canvas without leaking the fill style", () => {
    const { s, history } = canvas(200, 100)
    s.background(120, 50, 50)

    expect(history[0]).toBe("save()")
    expect(history).toContain("fillStyle = hsla(120, 50%, 50%, 1)")
    expect(history).toContain("rect(0, 0, 1, 0.5)")
    expect(history[history.length - 1]).toBe("restore()")
  })

  it("backgroundFromSpec matches background", () => {
    const { s: a, history: viaSpec } = canvas()
    a.backgroundFromSpec({ h: 10, s: 20, l: 30, a: 0.4 })

    const { s: b, history: viaArgs } = canvas()
    b.background(10, 20, 30, 0.4)

    expect(viaSpec).toEqual(viaArgs)
  })

  it("backgroundGradient fills the canvas with a gradient", () => {
    const { s, history } = canvas()
    s.backgroundGradient(
      new LinearGradient({
        from: [0, 0],
        to: [1, 0],
        colors: [
          [0, { h: 0, s: 0, l: 0 }],
          [1, { h: 0, s: 0, l: 100 }],
        ],
      })
    )
    expect(history[0]).toBe("save()")
    expect(history).toContain("createLinearGradient(0, 0, 1, 0)")
    expect(history[history.length - 1]).toBe("restore()")
  })
})

describe("SCanvas styling", () => {
  it("sets stroke and fill colours as hsla", () => {
    const { s, history } = canvas()
    s.setStrokeColor(1, 2, 3)
    s.setFillColor(4, 5, 6, 0.5)
    expect(history).toEqual([
      "strokeStyle = hsla(1, 2%, 3%, 1)",
      "fillStyle = hsla(4, 5%, 6%, 0.5)",
    ])
  })

  it("the FromSpec colour setters match the positional ones", () => {
    const { s: a, history: viaSpec } = canvas()
    a.setStrokeColorFromSpec({ h: 1, s: 2, l: 3, a: 0.5 })
    a.setFillColorFromSpec({ h: 4, s: 5, l: 6 })

    const { s: b, history: viaArgs } = canvas()
    b.setStrokeColor(1, 2, 3, 0.5)
    b.setFillColor(4, 5, 6, undefined)

    expect(viaSpec).toEqual(viaArgs)
  })

  it("sets line width, cap and join", () => {
    const { s, history } = canvas()
    s.lineWidth = 0.05
    s.lineStyle = { cap: "butt", join: "bevel" }
    expect(history).toEqual([
      "lineWidth = 0.05",
      "lineCap = butt",
      "lineJoin = bevel",
    ])
  })

  it("defaults line style to round", () => {
    const { s, history } = canvas()
    s.lineStyle = {}
    expect(history).toEqual(["lineCap = round", "lineJoin = round"])
  })

  it("sets dash pattern and offset", () => {
    const { s, history } = canvas()
    s.dash = { pattern: [0.1, 0.2], offset: 0.05 }
    expect(history).toEqual(["setLineDash(0.1,0.2)", "lineDashOffset = 0.05"])
  })

  it("scales shadows to the canvas size", () => {
    const { s, history } = canvas(1000, 1000)
    s.shadow = { size: 0.01, dX: 0.02, dY: 0.03 }
    expect(history).toContain("shadowBlur = 10")
    expect(history).toContain("shadowOffsetX = 20")
    expect(history).toContain("shadowOffsetY = 30")
  })

  it("clears shadows", () => {
    const { s, history } = canvas()
    s.clearShadow()
    expect(history).toEqual([
      "shadowBlur = 0",
      "shadowOffsetX = 0",
      "shadowOffsetY = 0",
    ])
  })
})

describe("SCanvas iteration order", () => {
  it("forTiling visits columns first by default", () => {
    const { s } = canvas()
    const visited = s.build(s.forTiling, { n: 2 }, ([x, y]) => [x, y])
    expect(visited).toEqual([
      [0, 0],
      [0, 0.5],
      [0.5, 0],
      [0.5, 0.5],
    ])
  })

  it("forTiling can visit rows first", () => {
    const { s } = canvas()
    const visited = s.build(
      s.forTiling,
      { n: 2, order: "rowFirst" as const },
      ([x, y]) => [x, y]
    )
    expect(visited).toEqual([
      [0, 0],
      [0.5, 0],
      [0, 0.5],
      [0.5, 0.5],
    ])
  })

  it("forTiling gives the same cells in either order", () => {
    const { s } = canvas(200, 100)
    const columnFirst = s.build(s.forTiling, { n: 3 }, (at, delta, center) => [
      at,
      delta,
      center,
    ])
    const rowFirst = s.build(
      s.forTiling,
      { n: 3, order: "rowFirst" as const },
      (at, delta, center) => [at, delta, center]
    )
    expect([...rowFirst].sort()).toEqual([...columnFirst].sort())
  })

  it("forTiling indexes sequentially", () => {
    const { s } = canvas()
    expect(s.build(s.forTiling, { n: 2 }, (_a, _d, _c, i) => i)).toEqual([
      0, 1, 2, 3,
    ])
  })

  it("forTiling with square type keeps cells square", () => {
    const { s } = canvas(200, 100)
    const [[w, h]] = s.build(
      s.forTiling,
      { n: 4, type: "square" as const },
      (_at, delta) => delta
    )
    expect(w).toBeCloseTo(h, 10)
  })

  it("forGrid can visit rows first", () => {
    const { s } = canvas()
    const config = { minX: 0, maxX: 1, minY: 0, maxY: 1 }
    expect(
      s.build(s.forGrid, { ...config, order: "rowFirst" as const }, (at) => at)
    ).toEqual([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ])
    expect(s.build(s.forGrid, config, (at) => at)).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ])
  })

  it("forMargin is a single tile inset by the margin", () => {
    const { s } = canvas()
    const cells = s.build(s.forMargin, 0.1, (at, delta) => [at, delta])
    expect(cells).toHaveLength(1)
    expect(cells[0][0][0]).toBeCloseTo(0.1, 10)
    expect(cells[0][1][0]).toBeCloseTo(0.8, 10)
  })

  it("withRandomOrder visits every item exactly once", () => {
    const { s } = canvas()
    const seen: number[] = []
    s.withRandomOrder(s.forTiling, { n: 3 }, (_at, _d, _c, i) => {
      seen.push(i)
    })
    expect([...seen].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  })
})

describe("SCanvas images and text", () => {
  it("drawImage defaults to filling the canvas", () => {
    const { s, history } = canvas(200, 100)
    s.drawImage({ image: "img" as unknown as CanvasImageSource })
    expect(history).toEqual(["drawImage(img, 0, 0, 1, 0.5)"])
  })

  it("drawImage respects explicit position and size", () => {
    const { s, history } = canvas()
    s.drawImage({
      image: "img" as unknown as CanvasImageSource,
      at: [0.1, 0.2],
      w: 0.3,
      h: 0.4,
    })
    expect(history).toEqual(["drawImage(img, 0.1, 0.2, 0.3, 0.4)"])
  })

  it("fillText fills and drawText strokes", () => {
    const { s, history } = canvas()
    s.fillText({ at: [0.5, 0.5], size: 0.1 }, "hello")
    expect(history.some((h) => h.startsWith("fillText(hello"))).toBe(true)

    history.length = 0
    s.drawText({ at: [0.5, 0.5], size: 0.1 }, "hello")
    expect(history.some((h) => h.startsWith("strokeText(hello"))).toBe(true)
  })
})
