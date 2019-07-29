import {
  PlayCanvas,
  Point2D,
  Circle,
  StatefulSketch,
  Message,
  SimplePath
} from "../lib";

type PaintState = { points: Point2D[] };

const paint = (p: PlayCanvas, state: PaintState) => {
  p.setStrokeColour(215, 50, 20, 0.4);
  if (state.points.length > 1) p.draw(SimplePath.withPoints(state.points));
  state.points.forEach((pt, i) => {
    p.setFillColour(200 + 30 * Math.cos(i), 80, 40, 0.8);
    p.fill(new Circle({ at: pt, r: 0.02 * (2 + Math.cos(i)) }));
  });
};

const paintSketch: StatefulSketch<PaintState> = {
  sketch: paint,
  name: "Simple Painting",
  initialState: () => ({ points: [] }),
  handleMessage: (message: Message, state: PaintState) => {
    switch (message.type) {
      case "click":
        state.points.push(message.at);
        return state;
    }
  }
};

export default paintSketch;
