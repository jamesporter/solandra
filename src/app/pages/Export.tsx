import React, { useState, useRef } from "react";
import {
  aspectRatioChoices,
  defaultAspectRatio,
  defaultSize,
  sizeChoices
} from "../config";
import SelectFromChoice from "../components/SelectFromChoice";
import sketches from "../../sketches";
import PlayCanvas from "../../lib/play-canvas";
import { getNumber } from "../util";
import { SEED_KEY, TIME_KEY } from "./ViewSingle";

export function Export({ match }: { match: any }) {
  const seed = getNumber(SEED_KEY) || 1;
  const time = getNumber(TIME_KEY) || 0;
  const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio);
  const [size, setSize] = useState(defaultSize);
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const sketchNo = match.params.id;
  const sketch = sketches[sketchNo];

  const w = size;
  const h = Math.floor(size / aspectRatio);

  const generate = () => {
    const ctx =
      previewRef.current &&
      (previewRef.current.getContext("2d") as CanvasRenderingContext2D);
    if (ctx) {
      ctx.clearRect(0, 0, w, h);
      const pts = new PlayCanvas(
        ctx,
        {
          width: w,
          height: h
        },
        seed,
        time
      );
      sketch.sketch(pts);
    }
  };

  return (
    <div className="p-4">
      <SelectFromChoice
        value={aspectRatio}
        choices={aspectRatioChoices}
        onSelect={setAspectRatio}
      />

      <SelectFromChoice
        value={size}
        choices={sizeChoices}
        onSelect={setSize}
        tailwindContainerClasses="pt-4"
      />

      <button
        onClick={generate}
        className="bg-teal-500 hover:bg-teal-600 focus:outline-none focus:shadow-outline px-2 py-3 rounded mt-4"
      >
        Generate {w}x{h}
      </button>

      <p>Size: {Math.floor((w * h) / 1000000)} MP</p>

      <canvas
        width={size}
        height={size / aspectRatio}
        ref={previewRef}
        className="shadow-lg hover:shadow-2xl bg-white my-4"
      />
    </div>
  );
}
