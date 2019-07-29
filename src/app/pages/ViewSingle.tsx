import React, { useState } from "react"
import Canvas from "./../Canvas"
import SelectFromChoice from "./../components/SelectFromChoice"
import SelectFromOptions from "./../components/SelectFromOptions"
import { aspectRatioChoices, defaultAspectRatio } from "./../config"
import sketches from "../../sketches"
import source from "../examples.json"
import { getNumber, setNumber, getSketchIdx, setSketchIdxParam } from "../util"
import Spacer from "../components/Spacer"
import Flex from "../components/Flex"
import { Link } from "gatsby"
import Header from "../components/Header"

export const INDEX_KEY = "play-ts.index"
export const SEED_KEY = "play-ts.seed"
export const TIME_KEY = "play-ts.time"

function ViewSingle() {
  const parsedInt = getSketchIdx()
  const idx = getNumber(INDEX_KEY)
  const sketchNo = parsedInt !== null ? parsedInt : idx || 0

  const [showSource, setShowSource] = useState(false)
  const [isPlaying, setPlaying] = useState(false)
  const goToPrev = () => {
    let nextNo = sketchNo - 1
    if (nextNo < 0) nextNo = sketches.length - 1
    setSketchIdxParam(nextNo)
  }
  const goToNext = () => {
    let nextNo = sketchNo + 1
    if (nextNo >= sketches.length) nextNo = 0
    setSketchIdxParam(nextNo)
  }

  const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio)

  const [seed, setSeed] = useState(getNumber(SEED_KEY) || 1)
  const updateSeed = () => {
    const newSeed = seed + 1
    setNumber(SEED_KEY, newSeed)
    setSeed(newSeed)
  }

  return (
    <>
      <Header />
      <div className="flex-1 flex flex-row items-stretch">
        <Canvas
          aspectRatio={aspectRatio}
          sketch={sketches[sketchNo].sketch}
          seed={seed}
          playing={isPlaying}
        />
        {showSource && (
          <div
            className="fixed shadow-md bg-gray-700 overflow-scroll inset-y-0 right-0"
            style={{
              backgroundColor: "hsla(218,17%,20%,0.9)",
            }}
          >
            <div className="text-gray-100 px-8 pt-8 flex flex-row justify-between items-center">
              <h2 className="text-gray-100 font-bold text-xl">
                {sketches[sketchNo].name}
              </h2>
              <button
                className={`bg-gray-500 hover:bg-teal-600 focus:outline-none focus:shadow-outline px-2 py-1 rounded`}
                onClick={() => setShowSource(!showSource)}
                title="Toggle Source Code"
              >
                Close
              </button>
            </div>
            <pre className="text-gray-300 p-8">
              {source[sketches[sketchNo].name]}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-gray-300 px-8 py-4 flex flex-row">
        <button
          className={`bg-gray-500 hover:bg-teal-600 focus:outline-none focus:shadow-outline px-2 py-1 rounded mr-2`}
          onClick={goToPrev}
          title="Previous"
        >
          ←
        </button>

        <SelectFromOptions
          options={sketches.map(s => s.name)}
          onSelect={name => {
            const idx = sketches.findIndex(s => s.name === name)
            setNumber(INDEX_KEY, idx)
            if (idx !== null) setSketchIdxParam(idx)
          }}
          selection={sketches[sketchNo].name}
        />

        <button
          className={`bg-gray-500 hover:bg-teal-600 focus:outline-none focus:shadow-outline px-2 py-1 rounded ml-2`}
          onClick={goToNext}
          title="Next"
        >
          →
        </button>

        <Spacer />
        <button
          className={`bg-gray-500 hover:bg-teal-600 focus:outline-none focus:shadow-outline px-2 py-1 rounded ml-2`}
          onClick={updateSeed}
          title="Refresh"
        >
          ↻
        </button>

        <Spacer />

        <SelectFromChoice
          value={aspectRatio}
          choices={aspectRatioChoices}
          onSelect={setAspectRatio}
          tailwindContainerClasses="hidden md:flex"
        />

        <Flex />

        <button
          className={`${
            isPlaying ? "bg-teal-700" : "bg-gray-500"
          } hover:bg-teal-600 focus:outline-none focus:shadow-outline px-2 py-1 rounded ml-2 hidden md:flex items-center`}
          onClick={() => setPlaying(!isPlaying)}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <Spacer />

        <button
          className={`${
            showSource ? "bg-teal-700" : "bg-gray-500"
          } hover:bg-teal-600 focus:outline-none focus:shadow-outline px-2 py-1 rounded ml-2 hidden md:flex items-center`}
          onClick={() => setShowSource(!showSource)}
          title="Toggle Source Code"
        >
          Source Code
        </button>

        <Spacer />

        <Link
          to={`/export/${sketchNo}`}
          className="bg-teal-500 hover:bg-teal-700 focus:outline-none focus:shadow-outline px-2 py-3 rounded ml-2"
        >
          Export
        </Link>
      </div>
    </>
  )
}

export default ViewSingle
