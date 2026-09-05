import { createCanvas, loadImage } from "canvas"
import fs from "node:fs"

import type { RgbaImage } from "./imageDiff"

/** Decode a PNG (in memory) into raw RGBA pixels. */
export async function decodePng(buffer: Buffer): Promise<RgbaImage> {
  const image = await loadImage(buffer)
  const canvas = createCanvas(image.width, image.height)
  const ctx = canvas.getContext("2d")
  ctx.drawImage(image, 0, 0)
  const { data, width, height } = ctx.getImageData(
    0,
    0,
    image.width,
    image.height
  )
  return { width, height, data: data as unknown as Uint8ClampedArray }
}

/** Decode a PNG from disk into raw RGBA pixels. */
export const readPng = (filePath: string): Promise<RgbaImage> =>
  decodePng(fs.readFileSync(filePath))

/** Write raw RGBA pixels out as a PNG. */
export function writePng(filePath: string, image: RgbaImage) {
  const canvas = createCanvas(image.width, image.height)
  const ctx = canvas.getContext("2d")
  const imageData = ctx.createImageData(image.width, image.height)
  imageData.data.set(image.data)
  ctx.putImageData(imageData, 0, 0)
  fs.writeFileSync(filePath, canvas.toBuffer("image/png"))
}
