export interface Traceable {
  traceIn(ctx: CanvasRenderingContext2D)
}

export interface Textable {
  textIn(ctx: CanvasRenderingContext2D)
}

export { default as SimplePath } from "./SimplePath"
export { default as Path } from "./Path"
export { default as CompoundPath } from "./CompoundPath"
export { default as Arc } from "./Arc"
export { default as Ellipse } from "./Ellipse"
export { default as Circle } from "./Circle"
export { default as Hatching } from "./Hatching"
export { default as HollowArc } from "./HollowArc"
export { default as Rect } from "./Rect"
export { default as Square } from "./Square"
export { default as RoundedRect } from "./RoundedRect"
export { default as Star } from "./Star"
export { default as RegularPolygon } from "./RegularPolygon"
export { default as Spiral } from "./Spiral"
export * from "./Text"
