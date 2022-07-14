import { SCanvas } from "../lib"

const textSketches: { name: string; sketch: (p: SCanvas) => void }[] = [
  {
    sketch: (s) => {
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
    },
    name: "Basics",
  },
  {
    sketch: (s) => {
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
    },
    name: "Position",
  },
  {
    sketch: (s) => {
      s.background(220, 30, 90)

      s.setFillColor(310, 80, 30)

      const m = s.measureText({ size: 0.2, font: "sans" }, "Hi there!")

      s.fillText(
        { at: s.meta.center, size: 0.1, font: "sans" },
        `w: ${m.width.toFixed(2)} bba: ${m.fontBoundingBoxAscent}`
      )
    },
    name: "Measure",
  },
]

export default textSketches
