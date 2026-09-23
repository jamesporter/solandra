import { Sketch } from "../lib"
import { Canvas } from "./Canvas"

// Responsive canvas with defaults for embedded documentation examples.
export function ExampleCanvas({
  sketch,
  playing = false,
  seed = 0,
}: {
  sketch: Sketch
  playing?: boolean
  seed?: number
}) {
  return (
    <div className="mx-auto my-8 flex w-[240px] h-[240px] @lg:w-[480px] @lg:h-[480px] @md:w-[320px] @md:h-[320px]">
      <Canvas sketch={sketch} seed={seed} playing={playing} aspectRatio={1} />
    </div>
  )
}
