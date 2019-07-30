import React from "react"
import Source from "./Source"
import Canvas from "../../app/Canvas"
import { PlayCanvas } from "../../lib"

export default function CodeAndSketch({
  sketch,
}: {
  sketch: (p: PlayCanvas) => void
}) {
  return (
    <>
      <Source code={sketch.toString()} />

      <div className="flex flex-col m-auto w-64 h-48">
        <Canvas sketch={sketch} seed={1} />
      </div>
    </>
  )
}
