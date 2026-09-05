import { createCanvas } from "canvas"
import { describe, expect, it } from "vitest"

import { systemFont, Text, type TextConfigWithKind } from "../paths/Text"
import SCanvas from "../sCanvas"
import { createMockCtx } from "./testUtils"

const size = { width: 900, height: 600 }

/** A real node-canvas context, set up the way a sketch sees one. */
const realCanvas = () => {
  const canvas = createCanvas(size.width, size.height)
  const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D
  return { canvas, ctx, s: new SCanvas(ctx, size, 1, 0) }
}

/** How many pixels the sketch drew on, as a rough "how much ink" measure. */
const inkedPixels = (canvas: ReturnType<typeof createCanvas>) => {
  const { data } = canvas
    .getContext("2d")
    .getImageData(0, 0, size.width, size.height)
  let count = 0
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) count++
  }
  return count
}

/** The font declaration `Text` puts on a context when drawing. */
const fontSpecFor = (config: Partial<TextConfigWithKind> = {}) => {
  const { ctx, history } = createMockCtx()
  new Text(
    { at: [0, 0], size: 12, kind: "fill", ...config },
    "Hi there!"
  ).textIn(ctx, undefined as unknown as SCanvas)
  return history.find((h) => h.startsWith("font = "))?.slice("font = ".length)
}

describe("the font declaration", () => {
  it("leaves out the parts that were not asked for", () => {
    expect(fontSpecFor({ font: "serif" })).toBe("12px serif")
  })

  it("includes the parts that were", () => {
    expect(
      fontSpecFor({
        font: "serif",
        style: "italic",
        variant: "small-caps",
        weight: "bold",
      })
    ).toBe("italic small-caps bold 12px serif")
  })

  it("falls back to the system stack", () => {
    expect(fontSpecFor()).toBe(`12px ${systemFont}`)
  })

  // A leading hyphen makes "-apple-system" an invalid family token to a strict
  // parser, and an invalid assignment to ctx.font is required to be a no-op —
  // so this used to leave the context on whatever font it already had,
  // ignoring the requested size along with the family.
  it("is something a canvas will actually accept", () => {
    // A plain, unscaled context: this is about whether the declaration parses,
    // not about how a sketch transforms it.
    const ctx = createCanvas(200, 100).getContext(
      "2d"
    ) as unknown as CanvasRenderingContext2D
    ctx.font = "40px DejaVu Serif"

    new Text({ at: [0.5, 0.5], size: 40, kind: "fill" }, "Hi").textIn(
      ctx,
      undefined as unknown as SCanvas
    )

    expect(ctx.font).toBe(`40px ${systemFont}`)
  })

  it("draws at the size that was asked for", () => {
    const small = realCanvas()
    small.s.fillText({ at: [0.5, 0.5], size: 0.05 }, "Hello")

    const large = realCanvas()
    large.s.fillText({ at: [0.5, 0.5], size: 0.2 }, "Hello")

    expect(inkedPixels(small.canvas)).toBeGreaterThan(0)
    // Four times the size, so a lot more ink. Before, both drew at whatever
    // size the context happened to default to, and these were equal.
    expect(inkedPixels(large.canvas)).toBeGreaterThan(
      inkedPixels(small.canvas) * 3
    )
  })
})

describe("measuring text", () => {
  const measureWith = (textSize: number) => {
    const { ctx, history } = createMockCtx()
    new Text({ at: [0, 0], size: textSize, kind: "fill" }, "Hi there!").measure(
      ctx
    )
    return history
  }

  it("measures small text with the transform reset", () => {
    const history = measureWith(0.2)

    // The font has to be built from an untransformed context: a sketch context
    // is scaled by the canvas size, and 100x a fractional size overflows the
    // integer Pango keeps a font size in.
    const transformReset = history.indexOf("setTransform(1, 0, 0, 1, 0, 0)")
    const fontSet = history.findIndex((h) => h.startsWith("font = "))
    expect(transformReset).toBeGreaterThanOrEqual(0)
    expect(fontSet).toBeGreaterThan(transformReset)
    expect(history[fontSet]).toContain("20px")
  })

  it("leaves the context as it found it", () => {
    const history = measureWith(0.2)

    expect(history.filter((h) => h === "save()")).toHaveLength(1)
    expect(history.filter((h) => h === "restore()")).toHaveLength(1)
    expect(history.indexOf("save()")).toBeLessThan(history.indexOf("restore()"))
  })

  it("measures a big font directly, without the scaling dance", () => {
    const history = measureWith(20)

    expect(history).not.toContain("save()")
    expect(history.some((h) => h.includes("20px"))).toBe(true)
  })

  it("returns the same metrics however big the canvas is", () => {
    const widthAt = (width: number) => {
      const dimensions = { width, height: (width * 2) / 3 }
      const ctx = createCanvas(dimensions.width, dimensions.height).getContext(
        "2d"
      ) as unknown as CanvasRenderingContext2D
      return new SCanvas(ctx, dimensions, 1, 0).measureText(
        { size: 0.2, font: "serif" },
        "Hi there!"
      ).width
    }

    expect(widthAt(1800)).toBeCloseTo(widthAt(300), 10)
  })
})
