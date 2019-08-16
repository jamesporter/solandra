import React, { useState, useRef } from "react"
import {
  aspectRatioChoices,
  defaultAspectRatio,
  defaultSize,
  sizeChoices,
} from "../config"
import SelectFromChoice from "../components/SelectFromChoice"
import sketches from "../../examples/sketches"
import SCanvas from "../../lib/sCanvas"
import { getNumber, getSketchIdx } from "../util"
import { SEED_KEY, TIME_KEY } from "./ViewSingle"
import Header from "../components/Header"

function downloadURI(uri, name) {
  let link = document.createElement("a")
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function Export() {
  const seed = getNumber(SEED_KEY) || 1
  const time = getNumber(TIME_KEY) || 0
  const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio)
  const [size, setSize] = useState(defaultSize)
  const [data, setData] = useState<string | null>(null)
  const previewRef = useRef<HTMLCanvasElement | null>(null)
  const sketchNo = getSketchIdx()
  const sketch = sketches[sketchNo || 0]

  const w = size
  const h = Math.floor(size / aspectRatio)

  const generate = () => {
    const ctx =
      previewRef.current &&
      (previewRef.current.getContext("2d") as CanvasRenderingContext2D)
    if (ctx) {
      ctx.clearRect(0, 0, w, h)
      const pts = new SCanvas(
        ctx,
        {
          width: w,
          height: h,
        },
        seed,
        time
      )
      sketch.sketch(pts)
      setData(previewRef.current && previewRef.current.toDataURL())
    }
  }

  return (
    <>
      <Header />
      <div className="p-4">
        <SelectFromChoice
          value={aspectRatio}
          choices={aspectRatioChoices}
          onSelect={setAspectRatio}
        />

        <SelectFromChoice
          value={size}
          choices={sizeChoices}
          onSelect={setSize}
          tailwindContainerClasses="pt-4"
        />

        <button
          onClick={generate}
          className="bg-teal-500 hover:bg-teal-600 focus:outline-none focus:shadow-outline px-2 py-4 rounded mt-4"
        >
          Generate {w}x{h} (Size: {Math.floor((w * h) / 1000000)} MP)
        </button>

        {data && (
          <>
            <a
              onClick={() => {
                downloadURI(data, "sol.png")
              }}
              className="ml-2 bg-teal-500 hover:bg-teal-600 focus:outline-none focus:shadow-outline px-4 py-4 rounded mt-4 inline-block"
            >
              Save
            </a>
            <p>
              Browser support for saving varies e.g. Chrome rejects large image
              sizes (but will allow right click/save as), Safari is slower to
              render (and fails at larger sizes) but will allow saving of larger
              images.
            </p>
          </>
        )}

        <canvas
          width={size}
          height={size / aspectRatio}
          ref={previewRef}
          className="shadow-lg hover:shadow-2xl bg-white my-4"
        />
      </div>
    </>
  )
}
