import React, { useRef, useLayoutEffect, useState } from "react";
import useDimensions from "react-use-dimensions";
import { StatefulSketch } from "../lib/types/play";
import PlayCanvas from "../lib/play-canvas";
import { getNumber } from "./util";
import { TIME_KEY } from "./pages/ViewSingle";

type CanvasProps<S> = {
  sketch: StatefulSketch<S>;
  aspectRatio: number;
  seed: number;
  playing?: boolean;
};

/**
 * Because this is actually a massive pain to do with hooks
 */
class CanvasPainterService<S> {
  ctx?: CanvasRenderingContext2D;
  canvas?: HTMLCanvasElement;
  sketch?: StatefulSketch<S>;
  state: S | null = null;
  seed = 0;
  playing = false;
  time: number;
  width = 100;
  height = 100;
  aspectRatio = 100;
  af: number | null = null;

  constructor() {
    this.time = getNumber(TIME_KEY) || 0;
  }

  configure({
    width,
    height,
    sketch,
    seed
  }: {
    width: number;
    height: number;
    aspectRatio: number;
    sketch: StatefulSketch<S>;
    seed: number;
  }) {
    if (width && height) {
      this.width = width;
      this.height = height;
    }

    this.state = sketch.initialState();
    this.sketch = sketch;
    this.seed = seed;

    this.canvas!.height = this.height;
    this.canvas!.width = this.width;
    this.af && cancelAnimationFrame(this.af);
    this.updateTime();
  }

  handleClick(x: number, y: number) {
    const top = this.canvas!.getBoundingClientRect().top;
    const xRel = x / this.width;
    const yRel = (y - top) / this.width;

    if (this.sketch && this.sketch.handleMessage) {
      this.state = this.sketch.handleMessage(
        { type: "click", at: [xRel, yRel] },
        this.state!
      );
    }
  }

  updateTime = () => {
    this.time += 0.01666666666;
    this.af = requestAnimationFrame(this.updateTime);
    this.draw();
  };

  draw = () => {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      const pts = new PlayCanvas(
        this.ctx,
        {
          width: this.width,
          height: this.height
        },
        this.seed,
        this.time
      );
      this.sketch && this.sketch.sketch(pts, this.state!);
    }
  };
}

export default function StatefulCanvas<S>({
  aspectRatio,
  sketch,
  seed,
  playing = false
}: CanvasProps<S>) {
  const [ref, { width, height }] = useDimensions();
  const canvasRef = useRef(null);
  // seems to be way more performant to re-use context
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [painterRef] = useState(new CanvasPainterService<S>());

  useLayoutEffect(() => {
    let ctx;
    if (!ctxRef.current) {
      const cvs = canvasRef.current;
      if (cvs) {
        ctx = (cvs as HTMLCanvasElement).getContext("2d");
        painterRef.canvas = cvs;
      }
    } else {
      ctx = ctxRef.current;
    }

    painterRef.ctx = ctx;
    painterRef.configure({
      width,
      height,
      aspectRatio,
      sketch,
      seed
    });
  }, [playing, seed, sketch, aspectRatio, width, height]);

  return (
    <div
      className="flex-1 self-stretch flex items-center justify-center"
      ref={ref}
    >
      <canvas
        id="myCanvas"
        ref={canvasRef}
        className="shadow-md bg-white"
        onClick={evt => painterRef.handleClick(evt.clientX, evt.clientY)}
      />
    </div>
  );
}
