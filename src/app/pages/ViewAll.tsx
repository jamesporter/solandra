import React, { useState } from "react"
import Canvas from "./../Canvas"
import sketches from "../../sketches"
import useKeypresses from "../hooks/useKeypresses"
import { navigate } from "@reach/router"

export const INDEX_KEY = "play-ts.index"
export const SEED_KEY = "play-ts.seed"
export const TIME_KEY = "play-ts.time"

function ViewAll() {
  const [sketchNo, setSketchNo] = useState(0)

  const goToNext = () =>
    setSketchNo(sketchNo < sketches.length - 1 ? sketchNo + 1 : 0)
  const goToPrev = () =>
    setSketchNo(sketchNo > 0 ? sketchNo - 1 : sketches.length - 1)
  const onClick = (x, y, [w, h]) => {
    if (x / w < 0.5) {
      goToPrev()
    } else {
      goToNext()
    }
  }

  useKeypresses([
    ["Escape", () => navigate("/")],
    ["ArrowRight", goToNext],
    ["ArrowLeft", goToPrev],
  ])

  return (
    <Canvas
      sketch={sketches[sketchNo].sketch}
      seed={12}
      playing={true}
      noShadow
      onClick={(evt, size) => onClick(evt.clientX, evt.clientY, size)}
    />
  )
}

export default ViewAll
