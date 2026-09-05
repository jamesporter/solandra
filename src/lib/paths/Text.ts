import { Point2D } from "../types/sol.js"
import SCanvas from "../sCanvas.js"

export type TextSizing = "fixed" | "fitted"
export type TextHorizontalAlign = CanvasRenderingContext2D["textAlign"]
export type FontStyle = "normal" | "italic" | "oblique"
export type FontVariant = "normal" | "small-caps"
export type FontWeight =
  | "normal"
  | "bold"
  | "bolder"
  | "lighter"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"

export type TextConfigWithKind = {
  align?: TextHorizontalAlign
  size: number
  font?: string
  at: Point2D
  kind: "fill" | "stroke"
  style?: FontStyle
  weight?: FontWeight
  variant?: FontVariant
}

export type TextConfig = Omit<TextConfigWithKind, "kind">

/**
 * The stack used when a caller does not name a font.
 *
 * `-apple-system` is quoted deliberately. Browsers accept it bare, but a
 * leading hyphen makes it an invalid font family token to stricter parsers
 * (node-canvas's among them) — and an invalid assignment to `ctx.font` is
 * required to be a no-op, so the whole declaration was silently dropped and
 * text kept whatever font, *and size*, the context happened to have. Quoting
 * is valid CSS everywhere and keeps the macOS system font.
 */
export const systemFont =
  "'-apple-system', BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

function configToFontSpecString({
  style,
  variant,
  weight,
  size,
  font,
}: Pick<
  TextConfigWithKind,
  "style" | "variant" | "weight" | "size" | "font"
>): string {
  // Omitted parts are left out rather than written as empty strings: a font
  // shorthand is all or nothing to parse, so the fewer moving parts the better.
  return [style, variant, weight, `${size}px`, font ?? systemFont]
    .filter(Boolean)
    .join(" ")
}

export class Text {
  constructor(
    private config: TextConfigWithKind,
    private text: string
  ) {}

  textIn = (ctx: CanvasRenderingContext2D, _s: SCanvas) => {
    const { size, at, kind, align = "center" } = this.config
    ctx.textAlign = align

    let y: number

    ctx.font = configToFontSpecString(this.config)
    y = at[1] + size / 2

    if (kind === "fill") {
      ctx.fillText(this.text, at[0], y)
    } else {
      ctx.strokeText(this.text, at[0], y)
    }
  }

  measure(ctx: CanvasRenderingContext2D): TextMetrics {
    const { size, align = "center" } = this.config
    ctx.textAlign = align

    if (size >= 1) {
      ctx.font = configToFontSpecString(this.config)
      return ctx.measureText(this.text)
    }

    // Safari messes up for small sizes, so measure a 100x larger font and
    // scale the metrics back down.
    //
    // Sketch coordinates are normalised, which means the context is scaled by
    // the canvas size, which means that 100x lands somewhere around 20,000px
    // once the transform is applied. Text metrics are defined in user space
    // and so do not depend on the transform, but the font a renderer builds to
    // produce them does: at that size node-canvas overflows the integer Pango
    // keeps a font size in and measures with a font that failed to load. So
    // measure with the transform reset, which changes nothing about the answer
    // and everything about the font used to arrive at it.
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.font = configToFontSpecString({ ...this.config, size: size * 100 })

    const m = ctx.measureText(this.text)
    const metrics = {
      actualBoundingBoxAscent: m.actualBoundingBoxAscent / 100,
      actualBoundingBoxDescent: m.actualBoundingBoxDescent / 100,
      actualBoundingBoxLeft: m.actualBoundingBoxLeft / 100,
      actualBoundingBoxRight: m.actualBoundingBoxRight / 100,
      fontBoundingBoxAscent: m.fontBoundingBoxAscent / 100,
      fontBoundingBoxDescent: m.fontBoundingBoxDescent / 100,
      width: m.width / 100,
      // TODO should check this is okay, newer TS not happy with original returned stuff, but for many purposes likely fine
    } as TextMetrics

    ctx.restore()
    return metrics
  }
}
