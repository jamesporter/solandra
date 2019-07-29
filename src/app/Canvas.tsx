import React, { useRef, useLayoutEffect, useState } from "react";
import useDimensions from "react-use-dimensions";
import { Sketch } from "../lib/types/play";
import PlayCanvas from "../lib/play-canvas";
import { setNumber, getNumber } from "./util";
import { TIME_KEY } from "./pages/ViewSingle";

type CanvasProps = {
  sketch: Sketch;
  aspectRatio: number;
  seed: number;
  playing?: boolean;
};

/**
 * Because this is actually a massive pain to do with hooks
 */
class CanvasPainterService {
  ctx?: CanvasRenderingContext2D;
  canvas?: HTMLCanvasElement;
  sketch?: Sketch;
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
    aspectRatio,
    sketch,
    seed,
    playing
  }: {
    width: number;
    height: number;
    aspectRatio: number;
    sketch: Sketch;
    seed: number;
    playing: boolean;
  }) {
    if (width && height) {
      if (width / height > aspectRatio) {
        this.height = height - 20;
        this.width = this.height * aspectRatio;
      } else {
        this.width = width - 20;
        this.height = this.width / aspectRatio;
      }
    }

    this.sketch = sketch;
    this.seed = seed;
    if (this.playing && !playing) {
      // Paused, so save time for the export?
      setNumber(TIME_KEY, this.time);
    }
    this.playing = playing;

    this.canvas!.height = this.height;
    this.canvas!.width = this.width;
    this.af && cancelAnimationFrame(this.af);
    this.updateTime();
  }

  updateTime = () => {
    if (this.playing) {
      this.time += 0.01666666666;
      this.af = requestAnimationFrame(this.updateTime);
    }
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
      this.sketch && this.sketch(pts);
    }
  };
}

export default function Canvas({
  aspectRatio,
  sketch,
  seed,
  playing = false
}: CanvasProps) {
  const [ref, { width, height }] = useDimensions();
  const canvasRef = useRef(null);
  // seems to be way more performant to re-use context
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [painterRef] = useState(new CanvasPainterService());

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
      seed,
      playing
    });
  }, [playing, seed, sketch, aspectRatio, width, height]);

  return (
    <div
      className="flex-1 self-stretch flex items-center justify-center"
      ref={ref}
    >
      <canvas id="myCanvas" ref={canvasRef} className="shadow-md bg-white" />
    </div>
  );
}
