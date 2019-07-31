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

      <div
        className="flex flex-col m-auto mb-4 shadow-lg"
        style={{ width: 320, height: 240 }}
      >
        <Canvas sketch={sketch} seed={1} noShadow playing={playing} />
      </div>
    </>
  )
}
