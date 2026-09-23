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
 * Default font stack.
 * Quote `-apple-system` so node-canvas accepts the font declaration.
 * An invalid declaration leaves both the previous font and size unchanged.
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
  // Omit unset options to keep the font shorthand valid.
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

    // Measure at 100x size to avoid Safari errors with small fonts, then
    // scale the metrics back down. Reset the transform during measurement
    // to avoid oversized fonts overflowing Pango in node-canvas.
    // Text metrics use user-space units, so resetting preserves the result.
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
      // TODO: Verify that the returned object covers all TextMetrics fields.
    } as TextMetrics

    ctx.restore()
    return metrics
  }
}
