import { useRouter } from "next/router"
import { useState } from "react"
import { Canvas } from "../src/components/Canvas"
import sketches from "../src/examples/sketches"
import useInterval from "../src/hooks/useInterval"
import useKeypresses from "../src/hooks/useKeypresses"

export const INDEX_KEY = "play-ts.index"
export const SEED_KEY = "play-ts.seed"
export const TIME_KEY = "play-ts.time"

const selectSketches = sketches.Highlights.sketches

function ViewAll({ playing }: { playing?: boolean }) {
  const [sketchNo, setSketchNo] = useState(0)
  const [haveInteracted, setHaveInteracted] = useState(false)
  const [seed, setSeed] = useState(0)

  const router = useRouter()

  const goToNext = () => {
    setSketchNo(sketchNo < selectSketches.length - 1 ? sketchNo + 1 : 0)
  }
  const goToPrev = () =>
    setSketchNo(sketchNo > 0 ? sketchNo - 1 : selectSketches.length - 1)
  const onClick = (x: number, y: number, [w, h]: [number, number]) => {
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
    ["Escape", () => router.push("/")],
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
    [
      "r",
      () => {
        setSeed(seed + 131)
      },
    ],
  ])

  return (
    <div className="flex flex-col w-screen h-screen">
      <Canvas
        sketch={selectSketches[sketchNo].sketch}
        seed={seed}
        playing={playing}
        noShadow
        onClick={([x, y], size) => onClick(x, y, size)}
      />
    </div>
  )
}

export default ViewAll
