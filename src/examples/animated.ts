import SCanvas from "../lib/sCanvas"
import { SimplePath, Rect } from "../lib/paths"
import { add, scale } from "../lib/vectors"
import { perlin2 } from "../lib/noise"
import { scaler } from "../lib"

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

const lowResAnimation = (p: SCanvas) => {
  const scaleX = scaler({
    minDomain: 0.1,
    maxDomain: 0.9,
    minRange: -2 * Math.PI,
    maxRange: Math.PI,
  })

  const scaleY = scaler({
    minDomain: 0.1,
    maxDomain: p.meta.bottom - 0.1,
    minRange: -1,
    maxRange: 1,
  })
  const d = 0.001
  p.background(215, 20, 20)
  p.forTiling({ n: 35, type: "square", margin: 0.1 }, ([x, y], [w, h]) => {
    if (scaleY(y) > Math.cos(p.t * 2 + scaleX(x))) {
      p.setFillColour(215 - y * 40, 90, 40)
      p.fill(new Rect({ at: [x + d, y + d], w: w - 2 * d, h: h - 2 * d }))
    }
  })
}

const sketches: { name: string; sketch: (p: SCanvas) => void }[] = [
  { sketch: blob, name: "Blob" },
  { sketch: lissajous, name: "Lissajous" },
  { sketch: lowResAnimation, name: "Low Resolution" },
]

export default sketches
