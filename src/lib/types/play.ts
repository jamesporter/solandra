import PlayCanvas from "../play-canvas";

export type Play = {
  context: CanvasRenderingContext2D;
  meta: {
    width: number;
    height: number;
  };
};

export type Sketch = {
  (play: PlayCanvas): void;
};

export type Message = {
  type: "click";
  at: Point2D;
};

export type StatefulSketch<S> = {
  name: string;
  sketch: (p: PlayCanvas, state: S) => void;
  initialState: () => S;
  handleMessage?: (message: Message, state: S) => S;
};

export type Size = { width: number; height: number };

export type Point2D = [number, number];
export type Vector2D = [number, number];
