import React, { useState } from "react"
import Canvas from "./../Canvas"
import sketches from "../../sketches"
import useKeypresses from "../hooks/useKeypresses"
import useInterval from "../hooks/useInterval"
import { navigate } from "@reach/router"

export const INDEX_KEY = "play-ts.index"
export const SEED_KEY = "play-ts.seed"
export const TIME_KEY = "play-ts.time"

const whiteList = [
  "Tiling",
  "Tiled Curves",
  "Script-ish",
  "Doodles",
  "Circles",
  "Ellipses Demo",
  "Gradient Demo 1",
  "Gradient Demo 2",
  "Gaussian 3",
  "Poisson",
  "Curves",
  "Transforms Demo 2",
  "Time",
  "Polygons 3",
  "Stack Polygons",
  "Fancy Tiling",
  "Another Tiling",
  "Lissajous",
  "Sketching Curves",
  "Shading In",
  "Shading Again",
  "Shaded Arcs",
  "Arc Chart",
  "Bars",
  "Little Abstracts",
]

const selectSketches = sketches.filter(s => whiteList.includes(s.name))

function ViewAll({ playing }: { playing?: boolean }) {
  const [sketchNo, setSketchNo] = useState(0)

  const goToNext = () =>
    setSketchNo(sketchNo < selectSketches.length - 1 ? sketchNo + 1 : 0)
  const goToPrev = () =>
    setSketchNo(sketchNo > 0 ? sketchNo - 1 : selectSketches.length - 1)
  const onClick = (x, y, [w, h]) => {
    if (x / w < 0.5) {
      goToPrev()
    } else {
      goToNext()
    }
  }

  useInterval(goToNext, 2000)

  useKeypresses([
    ["Escape", () => navigate("/")],
    ["ArrowRight", goToNext],
    ["ArrowLeft", goToPrev],
  ])

  return (
    <Canvas
      sketch={selectSketches[sketchNo].sketch}
      seed={12}
      playing={playing}
      noShadow
      onClick={(evt, size) => onClick(evt.clientX, evt.clientY, size)}
    />
  )
}

export default ViewAll
