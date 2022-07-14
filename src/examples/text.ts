import { SCanvas, v } from "../lib"

const basicSketch = (s: SCanvas) => {
  s.background(210, 90, 80)

  s.setFillColor(210, 80, 30)

  s.fillText(
    {
      at: s.meta.center,
      size: 0.19999,
      align: "center",
      font: "sans-serif",
    },
    "Hi there!"
  )
}

const positions = (s: SCanvas) => {
  s.background(50, 30, 90)

  s.setFillColor(110, 80, 30)

  s.times(11, (i) => {
    s.times(11, (j) => {
      s.fillText(
        {
          at: [i / 10, j / 10],
          size: 0.015,
          align: "center",
          font: "times",
        },
        `${i / 10},${j / 10}`
      )
    })
  })
}

const measure = (s: SCanvas) => {
  s.background(220, 30, 90)

  s.setFillColor(310, 80, 30)

  const m = s.measureText({ size: 0.2, font: "sans" }, "Hi there!")

  s.fillText(
    { at: s.meta.center, size: 0.1, font: "sans" },
    `w: ${m.width.toFixed(2)} bba: ${m.fontBoundingBoxAscent}`
  )
}

const customFont = (s: SCanvas) => {
  s.background(40, 40, 90)
  s.setFillColor(340, 80, 30)
  s.fillText(
    { at: s.meta.center, size: 0.17, font: "Josefin Sans" },
    `Josefin Sans`
  )

  s.setFillColor(210, 80, 30)
  s.fillText(
    {
      at: v.add(s.meta.center, [0, 0.2]),
      size: 0.1,
      font: "Josefin Sans",
    },
    `A web font`
  )
}

const sketches: { name: string; sketch: (p: SCanvas) => void }[] = [
  { sketch: basicSketch, name: "Basics" },
  { sketch: positions, name: "Positions" },
  { sketch: measure, name: "Measure" },
  { sketch: customFont, name: "Custom Font" },
]

export default sketches
