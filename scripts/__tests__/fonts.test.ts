import { createCanvas } from "canvas"
import fs from "node:fs"
import { describe, expect, it } from "vitest"

import {
  faceFor,
  fontDirectory,
  pinFonts,
  pinFontSpec,
  pinnedFonts,
  registerBundledFonts,
} from "../fonts"

registerBundledFonts()

const ctx = createCanvas(200, 100).getContext("2d")

/** Width of a known string, which identifies the face being used. */
const widthOf = (font: string) => {
  ctx.font = `40px ${font}`
  return ctx.measureText("Hi there!").width
}

/**
 * What the bundled faces measure. Hard coded on purpose: if a machine
 * substitutes its own font for one of ours these change, and everything about
 * the sample images stops being comparable. Better to fail here, saying so,
 * than to fail later as six mysteriously different text samples — which is
 * exactly what happened when this was left to fontconfig, and fontconfig
 * turned out not to be in the picture on macOS.
 */
const expectedWidths: Record<string, number> = {
  sans: 175.76,
  serif: 184.77,
  mono: 216.74,
}

describe("bundled fonts", () => {
  it("ships the faces it claims to", () => {
    for (const file of [
      "DejaVuSans.ttf",
      "DejaVuSerif.ttf",
      "DejaVuSansMono.ttf",
      "LICENSE.txt",
    ]) {
      expect(fs.existsSync(`${fontDirectory}/${file}`)).toBe(true)
    }
  })

  it("registers faces this machine renders with, not its own", () => {
    for (const [kind, family] of Object.entries(pinnedFonts)) {
      // 0.5% would not distinguish two rasterisations of the same font, but is
      // nowhere near enough to let a different typeface through: Helvetica
      // measures 151 here against DejaVu Sans's 176.
      expect(widthOf(`"${family}"`)).toBeCloseTo(expectedWidths[kind], 0)
    }
  })

  it("keeps the three faces distinguishable", () => {
    const widths = Object.values(pinnedFonts).map((f) => widthOf(`"${f}"`))
    expect(new Set(widths).size).toBe(3)
  })
})

describe("choosing a face", () => {
  it("sends the generic families where they belong", () => {
    expect(faceFor("sans-serif")).toBe("sans")
    expect(faceFor("serif")).toBe("serif")
    expect(faceFor("monospace")).toBe("mono")
  })

  it("recognises the families the samples ask for", () => {
    // src/examples/text.ts
    expect(faceFor("sans")).toBe("sans")
    expect(faceFor("times")).toBe("serif")
  })

  it("takes the first family it recognises, as a browser would", () => {
    expect(faceFor("Times New Roman, sans-serif")).toBe("serif")
    expect(faceFor("Helvetica, Times")).toBe("serif")
    expect(faceFor("'Courier New', serif")).toBe("mono")
  })

  it("falls back to sans for a font it has never heard of", () => {
    // "Josefin Sans" is a web font one of the samples deliberately asks for
    // without providing; it must not resolve to whatever the machine has.
    expect(faceFor("Josefin Sans")).toBe("sans")
    expect(faceFor("Comic Sans MS")).toBe("sans")
  })

  it("copes with the quoting CSS allows", () => {
    expect(faceFor('"Times New Roman"')).toBe("serif")
    expect(faceFor("'monospace'")).toBe("mono")
    expect(faceFor("  SERIF  ")).toBe("serif")
  })
})

describe("rewriting a font declaration", () => {
  it("keeps everything but the family", () => {
    expect(pinFontSpec("italic bold 12px serif")).toBe(
      `italic bold 12px "${pinnedFonts.serif}"`
    )
    expect(pinFontSpec("0.19999px sans-serif")).toBe(
      `0.19999px "${pinnedFonts.sans}"`
    )
  })

  it("replaces a whole stack", () => {
    expect(
      pinFontSpec(
        "40px '-apple-system', BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      )
    ).toBe(`40px "${pinnedFonts.sans}"`)
  })

  it("leaves a declaration it cannot parse alone", () => {
    expect(pinFontSpec("not a font")).toBe("not a font")
  })
})

describe("a pinned context", () => {
  it("renders a sketch's font request with a bundled face", () => {
    const pinned = pinFonts(
      createCanvas(200, 100).getContext(
        "2d"
      ) as unknown as CanvasRenderingContext2D
    )

    pinned.font = "40px sans-serif"
    expect(pinned.font).toBe(`40px "${pinnedFonts.sans}"`)
    expect(pinned.measureText("Hi there!").width).toBeCloseTo(
      expectedWidths.sans,
      0
    )

    pinned.font = "40px times"
    expect(pinned.measureText("Hi there!").width).toBeCloseTo(
      expectedWidths.serif,
      0
    )
  })

  it("passes everything else through", () => {
    const canvas = createCanvas(20, 20)
    const pinned = pinFonts(
      canvas.getContext("2d") as unknown as CanvasRenderingContext2D
    )

    pinned.fillStyle = "#ff0000"
    pinned.fillRect(0, 0, 20, 20)

    expect(pinned.fillStyle).toBe("#ff0000")
    expect(canvas.getContext("2d").getImageData(5, 5, 1, 1).data[0]).toBe(255)
  })
})
