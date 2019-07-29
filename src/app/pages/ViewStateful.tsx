import React from "react"

import sketches from "../../stateful-sketches"
import { getSketchIdx } from "../util"
import StatefulCanvas from "../StatefulCanvas"

export const INDEX_KEY = "play-ts.index"
export const SEED_KEY = "play-ts.seed"
export const TIME_KEY = "play-ts.time"

export default function ViewStateful() {
  const sketchNo = getSketchIdx() || 0

  return (
    <div className="flex-1 flex flex-row items-stretch">
      <StatefulCanvas
        aspectRatio={1}
        sketch={sketches[sketchNo]}
        seed={12}
        playing={true}
      />
    </div>
  )
}
