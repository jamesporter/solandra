import React from "react"
import Source from "./Source"
import Canvas from "../../app/Canvas"
import { PlayCanvas } from "../../lib"

export default function CodeAndSketch({
  sketch,
  code,
  playing = false,
}: {
  sketch: (p: PlayCanvas) => void
  code: string
  playing?: boolean
}) {
  return (
    <>
      <Source code={code} />

      <div className="flex flex-col m-auto w-64 h-48 mb-8 shadow-lg">
        <Canvas sketch={sketch} seed={1} noShadow playing={playing} />
      </div>
    </>
  )
}
