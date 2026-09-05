import React, { useState } from "react"
import { Canvas } from "./Canvas"
import sketches from "../examples/sketches"
import useKeypresses from "../hooks/useKeypresses"
import useInterval from "../hooks/useInterval"
import { useRouter } from "next/router"

export const INDEX_KEY = "play-ts.index"
export const SEED_KEY = "play-ts.seed"
export const TIME_KEY = "play-ts.time"

const selectSketches = sketches.Highlights.sketches
export function ViewAll({ playing }: { playing?: boolean }) {
  const router = useRouter()
  const [sketchNo, setSketchNo] = useState(0)
  const [haveInteracted, setHaveInteracted] = useState(false)
  const [seed, setSeed] = useState(0)

  const goToNext = () => {
    setSketchNo(sketchNo < selectSketches.length - 1 ? sketchNo + 1 : 0)
  }
  const goToPrev = () =>
    setSketchNo(sketchNo > 0 ? sketchNo - 1 : selectSketches.length - 1)
  const onClick = (x: number, y: number, [w, _h]: [number, number]) => {
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
    <div className="relative flex min-h-0 flex-1 self-stretch">
      <Canvas
        sketch={selectSketches[sketchNo].sketch}
        seed={seed}
        playing={playing}
        noShadow
        ariaLabel={`${selectSketches[sketchNo].name}, generative artwork`}
        onClick={([x, y], size) => onClick(x, y, size)}
      />
      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2 opacity-80 hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={() => {
            setHaveInteracted(true)
            goToPrev()
          }}
          aria-label="Previous artwork"
          className="rounded-full bg-slate-900/80 px-3 py-1 text-white"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => setHaveInteracted(true)}
          aria-label="Pause automatic slideshow"
          className="rounded-full bg-slate-900/80 px-3 py-1 text-white"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={() => {
            setHaveInteracted(true)
            goToNext()
          }}
          aria-label="Next artwork"
          className="rounded-full bg-slate-900/80 px-3 py-1 text-white"
        >
          →
        </button>
      </div>
    </div>
  )
}
