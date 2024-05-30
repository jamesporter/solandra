import { LinearGradient, Path, SCanvas } from "../lib"
import { Canvas } from "./Canvas"

export function QuickStartExample() {
  return (
    <div className="flex flex-col" style={{ height: 640 }}>
      <Canvas
        seed={8}
        playing
        sketch={(p: SCanvas) => {
          p.backgroundGradient(
            new LinearGradient({
              from: [0, 0],
              to: [0, p.meta.bottom],
              colors: [
                [0, { h: 215, s: 30, l: 35 }],
                [1, { h: 230, s: 30, l: 20 }],
              ],
            })
          )

          const n = Math.floor(50 * (1 + Math.sin(p.t * 0.8)))

          p.forVertical({ n: 100, margin: 0.15 }, ([x, y], [dX, dY], c, i) => {
            const revCounts = parseInt(
              i
                .toString()
                .split("")
                .map((i) => parseInt(i))
                .reverse()
                .join("")
            )
            if (revCounts >= n) return

            const h = p.gaussian({
              mean: dY,
              sd: (1.5 * dY) / p.meta.bottom,
            })
            const curveSize = p.gaussian({ sd: 0.25 * p.meta.right })
            const xOffset = p.gaussian({ sd: dX / 25 })

            const h1 = p.uniformRandomInt({ from: 280, to: 350 })
            const h2 = p.uniformRandomInt({ from: 0, to: 30 })

            p.setFillGradient(
              new LinearGradient({
                from: [x + xOffset, y],
                to: [x + dX + xOffset, y + dY],
                colors: [
                  [0, { h: h1, s: 60, l: 65, a: 0 }],
                  [0.05, { h: h1, s: 60, l: 65, a: 0 }],
                  [0.1, { h: h1, s: 60, l: 65, a: 0.8 }],
                  [
                    0.5,
                    {
                      h: p.gaussian({ mean: 10 }) + (h1 + h2) / 2,
                      s: 60,
                      l: 65,
                      a: 0.7,
                    },
                  ],
                  [0.9, { h: h2, s: 60, l: 65, a: 0.8 }],
                  [0.95, { h: h2, s: 60, l: 65, a: 0 }],
                  [1, { h: h2, s: 60, l: 65, a: 0 }],
                ],
              })
            )
            p.fill(
              Path.startAt([x, y])
                .addCurveTo([x + dX, y], { curveSize })
                .addLineTo([x + dX, y + h])
                .addCurveTo([x, y + h], { curveSize, polarlity: -1 })
                .addLineTo([x, y])
            )
          })
        }}
      />
    </div>
  )
}
