import { Sketch } from "../lib"
import { Canvas } from "./Canvas"

// Not really optimal, but simple responsive canvas for docs (rendering in mdx/don't want to have to worry about lots of props etc)
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
