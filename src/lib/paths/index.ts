export interface Traceable {
  traceIn(ctx: CanvasRenderingContext2D): void
}

export interface Textable {
  textIn(ctx: CanvasRenderingContext2D): void
}

//test
export * from "./SimplePath"
export * from "./Path"
export * from "./CompoundPath"
export * from "./Arc"
export * from "./Ellipse"
export * from "./Circle"
export * from "./Hatching"
export * from "./HollowArc"
export * from "./Rect"
export * from "./Square"
export * from "./RoundedRect"
export * from "./Star"
export * from "./RegularPolygon"
export * from "./Spiral"
export * from "./Line"
export * from "./Text"
