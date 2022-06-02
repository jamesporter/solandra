import { useState, useRef } from "react"
import Header from "../src/components/Header"
import SelectFromChoice from "../src/components/SelectFromChoice"
import {
  aspectRatioChoices,
  defaultAspectRatio,
  defaultSize,
  sizeChoices,
} from "../src/config"
import sketches from "../src/examples/sketches"
import { SCanvas } from "../src/lib"
import { getNumber, getSketchCategory, getSketchIdx } from "../src/util"
import { SEED_KEY, TIME_KEY } from "./view"

function downloadURI(uri: string, name: string) {
  let link = document.createElement("a")
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function Export() {
  const seed = getNumber(SEED_KEY) || 1
  const time = getNumber(TIME_KEY) || 0
  const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio)
  const [size, setSize] = useState(defaultSize)
  const [data, setData] = useState<string | null>(null)
  const previewRef = useRef<HTMLCanvasElement | null>(null)
  const sketchNo = getSketchIdx()
  const category = getSketchCategory() || "Highlights"
  const sketch = sketches[category].sketches[sketchNo || 0]

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
        <div className="flex flex-col gap-y-4 max-w-xl bg-sky-700 p-4 rounded-xl mx-auto">
          <h2 className="text-sky-200 text-4xl">Configure</h2>

          <SelectFromChoice
            value={aspectRatio}
            choices={aspectRatioChoices}
            onSelect={setAspectRatio}
          />

          <SelectFromChoice
            value={size}
            choices={sizeChoices}
            onSelect={setSize}
          />

          <button
            onClick={generate}
            className="bg-sky-400 hover:bg-sky-600 text-white font-bold focus:outline-none focus:shadow-outline px-2 py-4 rounded "
          >
            Generate {w}x{h} (Size: {Math.floor((w * h) / 1000000)} MP)
          </button>

          {data && (
            <>
              <button
                onClick={() => {
                  downloadURI(data, "sol.png")
                }}
                className="bg-sky-400 hover:bg-sky-600 text-white font-bold focus:outline-none focus:shadow-outline px-2 py-4 rounded  text-center"
              >
                Save
              </button>
              <p className="text-white italic">
                Browser support for saving varies e.g. Chrome rejects large
                image sizes (but will allow right click/save as), Safari is
                slower to render (and fails at larger sizes) but will allow
                saving of larger images.
              </p>
            </>
          )}
        </div>

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
