import fs from "node:fs"
import { beforeAll, describe, expect, it } from "vitest"

import { fontDirectory, useBundledFonts } from "../fonts"

/**
 * Guards the thing that made sample images environment dependent: which font
 * a request like `sans-serif` or `times` actually resolves to. If these come
 * out wrong the sample images will differ between machines however tolerant
 * the comparison is.
 */
describe("bundled fonts", () => {
  // Loaded only after fontconfig has been pointed at the bundled fonts.
  let widthOf: (font: string) => number

  beforeAll(async () => {
    useBundledFonts()
    const { createCanvas } = await import("canvas")
    const ctx = createCanvas(100, 100).getContext("2d")
    widthOf = (font: string) => {
      ctx.font = `40px ${font}`
      return ctx.measureText("Hi there!").width
    }
  })

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

  it("resolves the generic families to the bundled faces", () => {
    expect(widthOf("sans-serif")).toBe(widthOf("DejaVu Sans"))
    expect(widthOf("serif")).toBe(widthOf("DejaVu Serif"))
    expect(widthOf("monospace")).toBe(widthOf("DejaVu Sans Mono"))
  })

  it("keeps the three faces distinguishable", () => {
    const widths = new Set(
      ["DejaVu Sans", "DejaVu Serif", "DejaVu Sans Mono"].map(widthOf)
    )
    expect(widths.size).toBe(3)
  })

  it("maps the families the samples ask for onto the right face", () => {
    // src/examples/text.ts asks for these by name.
    expect(widthOf("sans")).toBe(widthOf("DejaVu Sans"))
    expect(widthOf("times")).toBe(widthOf("DejaVu Serif"))

    // The named faces in the default stack in src/lib/paths/Text.ts. (Note
    // that node-canvas rejects the whole stack because of the leading hyphen
    // in "-apple-system", so it never reaches fontconfig as written.)
    for (const font of ["Helvetica", "Arial", "Segoe UI", "Roboto"]) {
      expect(widthOf(font)).toBe(widthOf("DejaVu Sans"))
    }
  })

  it("falls back to the sans face for a font it does not have", () => {
    // "Josefin Sans" is a web font one of the samples deliberately asks for
    // without providing; it must not resolve to whatever the machine happens
    // to have installed.
    expect(widthOf("Josefin Sans")).toBe(widthOf("DejaVu Sans"))
    expect(widthOf("Comic Sans MS")).toBe(widthOf("DejaVu Sans"))
  })
})
