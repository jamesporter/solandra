import React, { useState } from "react"
import Canvas from "./../Canvas"
import sketches from "../../examples/sketches"
import useKeypresses from "../hooks/useKeypresses"
import useInterval from "../hooks/useInterval"
import { navigate } from "@reach/router"

export const INDEX_KEY = "play-ts.index"
export const SEED_KEY = "play-ts.seed"
export const TIME_KEY = "play-ts.time"

const selectSketches = sketches.Highlights.sketches
function ViewAll({ playing }: { playing?: boolean }) {
  const [sketchNo, setSketchNo] = useState(0)
  const [haveInteracted, setHaveInteracted] = useState(false)

  const goToNext = () => {
    setSketchNo(sketchNo < selectSketches.length - 1 ? sketchNo + 1 : 0)
  }
  const goToPrev = () =>
    setSketchNo(sketchNo > 0 ? sketchNo - 1 : selectSketches.length - 1)
  const onClick = (x, y, [w, h]) => {
    setHaveInteracted(true)
    if (x / w < 0.333333) {
      goToPrev()
    } else if (x / w < 0.666666667) {
      // do nothing (i.e. pause)
    } else {
      goToNext()
    }
  }

  useInterval(() => {
    if (!haveInteracted) goToNext()
  }, 2000)

  useKeypresses([
    ["Escape", () => navigate("/")],
    [
      "ArrowRight",
      () => {
        setHaveInteracted(true)
        goToNext()
      },
    ],
    [
      "ArrowLeft",
      () => {
        setHaveInteracted(true)
        goToPrev()
      },
    ],
  ])

  return (
    <Canvas
      sketch={selectSketches[sketchNo].sketch}
      seed={12}
      playing={playing}
      noShadow
      onClick={([x, y], size) => onClick(x, y, size)}
    />
  )
}

export default ViewAll
