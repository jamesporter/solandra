import { SCanvas } from "."
import { Sketch } from "./types/sol"

export function render({
  w = 2048,
  h = 2048,
  sketch,
  seed = 0,
  time = 0,
}: {
  w?: number
  h?: number
  seed?: number
  sketch: Sketch
  time?: number
}) {
  const offscreen = new OffscreenCanvas(w, h)

  const ctx = offscreen.getContext("2d")
  if (!ctx) throw new Error("Unable to create OffscreenCanvas context")

  const sC = new SCanvas(
    ctx as unknown as CanvasRenderingContext2D,
    {
      width: w,
      height: h,
    },
    seed,
    time
  )

  sketch(sC)

  return offscreen.transferToImageBitmap()
}
