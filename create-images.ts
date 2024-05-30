import { createCanvas } from "canvas"

import sketches from "./src/examples/sketches"
import { SCanvas } from "./src/lib"
import fs from "fs"

const width = 900
const height = 600

Object.entries(sketches).forEach(([category, { sketches }]) => {
  sketches.forEach(({ sketch, name }) => {
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext("2d")

    const sC = new SCanvas(
      // supports all the basics but not fully as per modern HTML canvas
      ctx as unknown as CanvasRenderingContext2D,
      {
        width,
        height,
      },
      42,
      0
    )

    sketch(sC)

    const stream = canvas.createPNGStream()
    const out = fs.createWriteStream(
      `./samples/${name.replaceAll(/[^A-z0-9]/g, "-")}.png`
    )

    stream.pipe(out)
    out.on("finish", () => console.log(`Done: ${name}`))
  })
})

let md = "# Sketches\n\n"

Object.entries(sketches).forEach(([category, { sketches }]) => {
  md += `## ${category}\n\n`

  sketches.forEach(({ name }) => {
    md += `### ${name}\n\n`
    md += `![${name}](./${name.replaceAll(/[^A-z0-9]/g, "-")}.png)\n\n`
  })
})

fs.writeFileSync("./samples/samples.md", md)
