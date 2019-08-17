import { Point2D } from "../types/sol"
import { Textable } from "."

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
export enum Font {
  Arial = "Arial",
  Helvetica = "Helvetica",
  TimesNewRoman = "Times New Roman",
  Times = "Times",
  CourierNew = "Courier New",
  Courier = "Courier",
  Palatino = "Palatino",
  Garamond = "Garamond",
  Bookman = "Bookman",
  AvantGarde = "Avant Garde",
  System = "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
}

export type TextConfigWithKind = {
  sizing?: TextSizing
  align?: TextHorizontalAlign
  size: number
  font?: Font
  at: Point2D
  kind: "fill" | "stroke"
  style?: FontStyle
  weight?: FontWeight
  variant?: FontVariant
}

export type TextConfig = Omit<TextConfigWithKind, "kind">

export class Text implements Textable {
  /**
   * Text is always vertically aligned
   * By default is fixed (specified vertcial font size) but can choose fitted, then will fit horizontally to size
   * @param config Configuration
   */
  constructor(private config: TextConfigWithKind, private text: string) {}

  textIn = (ctx: CanvasRenderingContext2D) => {
    const {
      size,
      sizing = "fixed",
      align = "center",
      font = Font.System,
      at,
      style = "normal",
      weight = "normal",
      variant = "normal",
      kind,
    } = this.config
    ctx.textAlign = align

    let y: number
    if (sizing === "fixed") {
      ctx.font = `${style} ${variant} ${weight} ${size}px ${font}`
      y = at[1] + size / 2
    } else {
      ctx.font = `${style} ${variant} ${weight} 1px ${font}`
      const { width: mW } = ctx.measureText(this.text)
      const sizeH = size / mW
      ctx.font = `${style} ${variant} ${weight} ${sizeH}px ${font}`
      y = at[1] + sizeH / 2
    }
    if (kind === "fill") {
      ctx.fillText(this.text, at[0], y)
    } else {
      ctx.strokeText(this.text, at[0], y)
    }
  }
}
