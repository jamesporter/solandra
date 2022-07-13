import { Point2D } from "../types/sol"
import { SCanvas } from ".."

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

export const systemFont =
  "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif"

function configToFontSpecString({
  style,
  variant,
  weight,
  size,
  font,
}: TextConfigWithKind): string {
  return `${style ?? ""} ${variant ?? ""} ${weight ?? ""} ${size}px ${
    font ?? systemFont
  }`
}

export class Text {
  constructor(private config: TextConfigWithKind, private text: string) {}

  textIn = (ctx: CanvasRenderingContext2D, s: SCanvas) => {
    const { size, at, kind, align = "center" } = this.config
    ctx.textAlign = align

    let y: number

    if (size < 1) {
      s.withScale([0.01, 0.01], () => {
        ctx.font = configToFontSpecString({
          ...this.config,
          size: this.config.size * 100,
        })
        y = at[1] * 100 + (size * 100) / 2

        if (kind === "fill") {
          ctx.fillText(this.text, at[0] * 100, y)
        } else {
          ctx.strokeText(this.text, at[0] * 100, y)
        }
      })
    } else {
      ctx.font = configToFontSpecString(this.config)
      y = at[1] + size / 2

      if (kind === "fill") {
        ctx.fillText(this.text, at[0], y)
      } else {
        ctx.strokeText(this.text, at[0], y)
      }
    }
  }
}
