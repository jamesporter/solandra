import {
  PlayCanvas,
  Point2D,
  Vector2D,
  RoundedRect,
  clamp,
  Circle,
  StatefulSketch
} from "../lib";
import { add, scale } from "../lib/vectors";

type BallState = { position: Point2D; velocity: Vector2D; hue: number };

const ball = (p: PlayCanvas, state: BallState) => {
  p.background(state.hue, 50, 90);

  p.setFillColour(state.hue, 80, 40, 0.2);
  p.fill(
    new RoundedRect({
      at: [
        clamp({ from: 0, to: p.meta.right - 0.3 }, state.position[0] - 0.15),
        clamp({ from: 0, to: p.meta.bottom - 0.3 }, state.position[1] - 0.15)
      ],
      w: 0.3,
      h: 0.3,
      r: 0.05
    })
  );
  p.setFillColour(state.hue, 80, 40);
  p.fill(new Circle({ at: state.position, r: 0.05 }));
  state.position = add(state.position, scale(state.velocity, 0.016));

  if (state.position[0] > p.meta.right - 0.05) {
    state.velocity[0] *= -1;
    state.hue += 5;
  }
  if (state.position[0] < p.meta.left + 0.05) {
    state.velocity[0] *= -1;
    state.hue += 5;
  }
  if (state.position[1] > p.meta.bottom - 0.05) {
    state.velocity[1] *= -1;
    state.hue += 5;
  }
  if (state.position[1] < p.meta.top + 0.05) {
    state.velocity[1] *= -1;
    state.hue += 5;
  }
};

const ballSketch: StatefulSketch<BallState> = {
  sketch: ball,
  name: "Simple State",
  initialState: () => ({ position: [0.2, 0.4], velocity: [1, 1], hue: 215 })
};

export default ballSketch;
