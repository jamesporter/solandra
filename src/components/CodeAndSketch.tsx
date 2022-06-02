import React from "react"
import { SCanvas } from "../lib"
import { Canvas } from "./Canvas"
import Source from "./Source"

export default function CodeAndSketch({
  sketch,
  code,
  playing = false,
}: {
  sketch: (p: SCanvas) => void
  code: string
  playing?: boolean
}) {
  return (
    <>
      <Source code={code} />

      <div
        className="flex flex-col m-auto mb-4 shadow-lg rounded-xl overflow-hidden"
        style={{ width: 320, height: 240 }}
      >
        <Canvas sketch={sketch} seed={1} noShadow playing={playing} />
      </div>
    </>
  )
}
