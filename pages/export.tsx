import { useMemo, useRef, useState } from "react"
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

export type ExportFormat = "image/png" | "image/jpeg" | "image/webp"

export const MAX_EXPORT_DIMENSION = 16384
export const MAX_EXPORT_PIXELS = 64_000_000

export function validateExportSize(width: number, height: number) {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1
  ) {
    return "Width and height must be positive whole numbers."
  }
  if (width > MAX_EXPORT_DIMENSION || height > MAX_EXPORT_DIMENSION) {
    return `Each dimension must be ${MAX_EXPORT_DIMENSION.toLocaleString()} pixels or less.`
  }
  if (width * height > MAX_EXPORT_PIXELS) {
    return `The image must be ${MAX_EXPORT_PIXELS / 1_000_000} megapixels or less.`
  }
  return null
}

export function extensionFor(format: ExportFormat) {
  return format === "image/jpeg" ? "jpg" : format.split("/")[1]
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.download = name
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}

export default function Export() {
  const seed = getNumber(SEED_KEY) || 1
  const time = getNumber(TIME_KEY) || 0
  const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio)
  const [width, setWidth] = useState(defaultSize)
  const [height, setHeight] = useState(
    Math.floor(defaultSize / defaultAspectRatio)
  )
  const [format, setFormat] = useState<ExportFormat>("image/png")
  const [quality, setQuality] = useState(0.92)
  const [transparent, setTransparent] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const previewRef = useRef<HTMLCanvasElement | null>(null)
  const sketchNo = getSketchIdx()
  const category = getSketchCategory() || "Highlights"
  const sketch = sketches[category].sketches[sketchNo || 0]
  const sizeError = useMemo(
    () => validateExportSize(width, height),
    [width, height]
  )

  const setPreset = (size: number) => {
    setWidth(size)
    setHeight(Math.floor(size / aspectRatio))
    setGenerated(false)
  }

  const changeAspectRatio = (ratio: number) => {
    setAspectRatio(ratio)
    setHeight(Math.floor(width / ratio))
    setGenerated(false)
  }

  const generate = async () => {
    setError(sizeError)
    if (sizeError) return
    const canvas = previewRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) {
      setError("Canvas rendering is not available in this browser.")
      return
    }

    setIsGenerating(true)
    setGenerated(false)
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    try {
      canvas.width = width
      canvas.height = height
      ctx.clearRect(0, 0, width, height)
      if (!transparent || format === "image/jpeg") {
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, width, height)
      }
      sketch.sketch(new SCanvas(ctx, { width, height }, seed, time))
      setGenerated(true)
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to render this image."
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const save = () => {
    const canvas = previewRef.current
    if (!canvas) return
    canvas.toBlob(
      (blob) => {
        if (blob)
          downloadBlob(blob, `solandra-${sketch.name}.${extensionFor(format)}`)
        else
          setError(
            `This browser could not encode a ${extensionFor(format).toUpperCase()} image.`
          )
      },
      format,
      quality
    )
  }

  const inputClass =
    "rounded border border-sky-300 bg-white px-3 py-2 text-sky-950"

  return (
    <>
      <Header />
      <main className="p-4">
        <div className="mx-auto flex max-w-xl flex-col gap-y-4 rounded-xl bg-sky-700 p-4">
          <h1 className="text-4xl text-sky-100">Export artwork</h1>
          <p className="text-sky-100">
            Configure a high-resolution export of {sketch.name}.
          </p>

          <fieldset>
            <legend className="mb-1 font-semibold text-white">
              Aspect ratio
            </legend>
            <SelectFromChoice
              value={aspectRatio}
              choices={aspectRatioChoices}
              onSelect={changeAspectRatio}
            />
          </fieldset>
          <fieldset>
            <legend className="mb-1 font-semibold text-white">
              Size preset
            </legend>
            <SelectFromChoice
              value={width}
              choices={sizeChoices}
              onSelect={setPreset}
            />
          </fieldset>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 font-semibold text-white">
              Width
              <input
                className={inputClass}
                type="number"
                min="1"
                max={MAX_EXPORT_DIMENSION}
                value={width}
                onChange={(event) => {
                  setWidth(Number(event.target.value))
                  setGenerated(false)
                }}
              />
            </label>
            <label className="flex flex-col gap-1 font-semibold text-white">
              Height
              <input
                className={inputClass}
                type="number"
                min="1"
                max={MAX_EXPORT_DIMENSION}
                value={height}
                onChange={(event) => {
                  setHeight(Number(event.target.value))
                  setGenerated(false)
                }}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 font-semibold text-white">
            Format
            <select
              className={inputClass}
              value={format}
              onChange={(event) => {
                setFormat(event.target.value as ExportFormat)
                setGenerated(false)
              }}
            >
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WebP</option>
            </select>
          </label>

          {format !== "image/png" && (
            <label className="flex flex-col gap-1 font-semibold text-white">
              Quality: {Math.round(quality * 100)}%
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.01"
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
              />
            </label>
          )}

          {format !== "image/jpeg" && (
            <label className="flex items-center gap-2 font-semibold text-white">
              <input
                type="checkbox"
                checked={transparent}
                onChange={(event) => {
                  setTransparent(event.target.checked)
                  setGenerated(false)
                }}
              />
              Allow transparent background
            </label>
          )}

          {(sizeError || error) && (
            <p role="alert" className="rounded-sm bg-red-100 p-2 text-red-900">
              {sizeError || error}
            </p>
          )}

          <button
            disabled={!!sizeError || isGenerating}
            onClick={() => void generate()}
            className="rounded-sm bg-sky-400 px-2 py-4 font-bold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating
              ? "Generating…"
              : `Generate ${width}×${height} (${Math.round((width * height) / 100_000) / 10} MP)`}
          </button>
          {generated && (
            <button
              onClick={save}
              className="rounded-sm bg-emerald-500 px-2 py-4 text-center font-bold text-white hover:bg-emerald-600"
            >
              Save {extensionFor(format).toUpperCase()}
            </button>
          )}
        </div>

        <canvas
          ref={previewRef}
          role="img"
          aria-label={`Export preview of ${sketch.name}`}
          className="mx-auto my-4 block h-auto max-w-full bg-white shadow-lg"
        />
      </main>
    </>
  )
}
