import { SCanvas } from "../lib"

const textSketches: { name: string; sketch: (p: SCanvas) => void }[] = [
  {
    sketch: (s) => {
      s.background(210, 90, 80)

      s.setFillColor(210, 80, 30)
      //   s.fillText(
      //     {
      //       at: s.meta.center,
      //       size: 0.2,
      //       align: "center",
      //       font: "sans-serif",
      //     },
      //     "Hi there!"
      //   )

      // @ts-ignore
      const ctx: CanvasRenderingContext2D = s.ctx
      // this doesn't work on safari ...
      ctx.font = "0.49px sans-serif"
      ctx.fillText("test", 0, 1)
    },
    name: "Basics",
  },
]

export default textSketches
