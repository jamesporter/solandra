import SCanvas from "../lib/sCanvas"
import { SimplePath } from "../lib/paths"
import { add, scale } from "../lib/vectors"
import { perlin2 } from "../lib/noise"

const blob = (p: SCanvas) => {
  p.background(205, 55, 95)
  const paths = p.build(p.times, 3, n =>
    SimplePath.withPoints(
      p.build(p.aroundCircle, { n: 12, at: [0, 0] }, (pt, i) =>
        add(
          pt,
          scale([perlin2(i / 12, 1 + n + p.t), perlin2(-i / 12, n + p.t)], 0.25)
        )
      )
    )
      .close()
      .chaiken({ n: 3, looped: true })
  )

  paths.forEach(pt => {
    p.withTranslation([0.5, 0.5], () => {
      p.withScale([1.2, 1.2], () => {
        p.setFillColour(205, 75, 90)
        p.fill(pt)
      })
    })
  })

  paths.forEach(pt => {
    p.withTranslation([0.5, 0.5], () => {
      p.setFillColour(205, 75, 45)
      p.fill(pt)
    })
  })
}

const lissajous = (p: SCanvas) => {
  p.background(140, 20, 10)
  p.lineWidth = 0.005
  p.setStrokeColour(140, 80, 60, 0.5)

  const a = 1
  const b = 2.4

  const sp = SimplePath.withPoints([])

  for (let t = 0; t < 50; t += 0.1) {
    sp.addPoint([
      0.5 + 0.4 * Math.sin(a * t),
      p.meta.bottom * (0.5 + 0.4 * Math.sin(b * t + p.t)),
    ])
  }

  p.draw(sp.chaiken({ n: 3 }))
}

const sketches: { name: string; sketch: (p: SCanvas) => void }[] = [
  { sketch: blob, name: "Blob" },
  { sketch: lissajous, name: "Lissajous" },
]

export default sketches
