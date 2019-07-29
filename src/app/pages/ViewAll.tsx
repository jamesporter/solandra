import React, { useState } from "react"
import Canvas from "./../Canvas"
import sketches from "../../sketches"
import { getNumber, getSketchIdx } from "../util"

export const INDEX_KEY = "play-ts.index"
export const SEED_KEY = "play-ts.seed"
export const TIME_KEY = "play-ts.time"

function ViewAll() {
  const [sketchNo, setSketchNo] = useState(0)

  return (
    <Canvas
      sketch={sketches[sketchNo].sketch}
      seed={12}
      playing={true}
      noShadow
      onClick={() =>
        setSketchNo(sketchNo < sketches.length - 1 ? sketchNo + 1 : 0)
      }
    />
  )
}

export default ViewAll
