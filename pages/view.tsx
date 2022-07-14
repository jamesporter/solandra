import Link from "next/link"
import { useState } from "react"
import Flex from "../src/components/Flex"
import Header from "../src/components/Header"
import SelectFromChoice from "../src/components/SelectFromChoice"
import { aspectRatioChoices, defaultAspectRatio } from "../src/config"
import sketches from "../src/examples/sketches"
import {
  getNumber,
  getSketchCategory,
  getSketchIdx,
  setNumber,
} from "../src/util"
import SyntaxHighlighter from "react-syntax-highlighter"
import { Canvas } from "../src/components/Canvas"
import source from "../src/data/source.json"
import Head from "next/head"

export const INDEX_KEY = "play-ts.index"
export const SEED_KEY = "play-ts.seed"
export const TIME_KEY = "play-ts.time"

function ViewSingle() {
  const parsedInt = getSketchIdx()
  const category = getSketchCategory() || "Highlights"
  const idx = getNumber(INDEX_KEY)
  const sketchNo = parsedInt !== null ? parsedInt : idx || 0

  const [showSource, setShowSource] = useState(false)
  const [isPlaying, setPlaying] = useState(false)
  const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio)

  const [seed, setSeed] = useState(getNumber(SEED_KEY) || 1)
  const updateSeed = () => {
    const newSeed = seed + 1
    setNumber(SEED_KEY, newSeed)
    setSeed(newSeed)
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      <Header />
      <div className="bg-sky-800 px-2 py-4 flex flex-row">
        <button
          className={`bg-gray-200 hover:bg-sky-400 focus:outline-none focus:shadow-outline px-2 py-1 rounded ml-2`}
          onClick={updateSeed}
          title="Refresh"
        >
          ↻
        </button>

        <button
          className={`${
            isPlaying ? "bg-sky-200" : "bg-gray-200"
          } hover:bg-sky-400 focus:outline-none focus:shadow-outline px-2 py-1 rounded ml-2 items-center w-20`}
          onClick={() => setPlaying(!isPlaying)}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <Flex />

        <SelectFromChoice
          value={aspectRatio}
          choices={aspectRatioChoices}
          onSelect={setAspectRatio}
        />

        <Flex />

        <button
          className={`${
            showSource ? "bg-sky-200" : "bg-gray-200"
          } hover:bg-sky-400 focus:outline-none focus:shadow-outline px-2 py-1 rounded ml-2 items-center`}
          onClick={() => setShowSource(!showSource)}
          title="Toggle Source Code"
        >
          Source Code
        </button>

        <Link href={`/export?sketch=${sketchNo}&category=${category}`}>
          <a className="bg-gray-200 hover:bg-sky-400 focus:outline-none focus:shadow-outline px-2 mr-2 py-3 rounded ml-2">
            Export
          </a>
        </Link>
      </div>
      <div className="flex-1 flex flex-row items-stretch">
        <Canvas
          aspectRatio={aspectRatio}
          sketch={sketches[category].sketches[sketchNo].sketch}
          seed={seed}
          playing={isPlaying}
        />
        {showSource && (
          <div
            className="fixed shadow-md bg-gray-700 overflow-scroll inset-y-0 right-0"
            style={{
              backgroundColor: "hsla(218,17%,20%,0.9)",
              maxWidth: "95vw",
            }}
          >
            <div className="text-gray-100 px-8 pt-8 flex flex-row justify-between items-center">
              <h2 className="text-gray-100 font-bold text-xl">
                {sketches[category].sketches[sketchNo].name}
              </h2>
              <button
                className={`bg-gray-500 hover:bg-teal-600 focus:outline-none focus:shadow-outline px-2 py-1 rounded`}
                onClick={() => setShowSource(!showSource)}
                title="Toggle Source Code"
              >
                Close
              </button>
            </div>
            <div className="p-8 text-gray-300">
              <SyntaxHighlighter language="typescript" useInlineStyles={false}>
                {
                  // @ts-expect-error
                  source[sketches[category].fileName][
                    sketches[category].sketches[sketchNo].name
                  ]
                }
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewSingle
