import SCanvas from "../lib/sCanvas"
import { Path, RegularPolygon, Star, CompoundPath } from "../lib/path"

const compoundPath = (p: SCanvas) => {
  p.background(45, 80, 75)
  p.setFillColour(220, 9, 45, 0.4)
  // To remove a shape from another shape the path winding order must be opposite (hence the reversed)
  p.times(4, n => {
    p.fill(
      CompoundPath.withPaths(
        new RegularPolygon({ at: p.meta.center, r: 0.3 + n * 0.05, n: 8 }).path,
        new Star({ at: p.meta.center, r: 0.3 + n * 0.05, n: 4 }).path.reversed
      )
    )
  })
}

const compoundPath2 = (p: SCanvas) => {
  p.background(45, 20, 95)
  p.forTiling({ n: 3, type: "square" }, (at, [dX], c, i) => {
    p.setFillColour(220 - i * 40, 30, 45, 0.4)
    const s = 1 + 0.5 * p.random()
    p.times(4, n => {
      p.fill(
        CompoundPath.withPaths(
          new RegularPolygon({
            at: c,
            r: dX / 4 + dX * n * 0.05,
            n: 2 * (i + 3),
          }).path,
          new Star({
            at: c,
            r: (s * dX) / 4 + dX * n * 0.05,
            n: i + 3,
          }).path.transformed(pt => p.perturb(pt, { magnitude: 0.05 })).reversed
        )
      )
    })
  })
}

const transformingPaths = (p: SCanvas) => {
  p.background(30, 80, 40)
  const { center, bottom, right } = p.meta
  const [cX, cY] = center
  const r = 0.3 * Math.min(bottom, right)
  const path = Path.startAt([cX + r * Math.cos(p.t), cY + r * Math.sin(p.t)])
  p.times(33, n => {
    path.addCurveTo(
      [
        cX + (n % 2 === 0 ? 1 : 0.8) * r * Math.cos(p.t + (n * Math.PI) / 16),
        cY + (n % 2 === 0 ? 1 : 0.8) * r * Math.sin(p.t + (n * Math.PI) / 16),
      ],
      {
        polarlity: n % 2 === 0 ? 1 : -1,
      }
    )
  })

  p.times(4, sc => {
    const scale = (sc ** 1.5 + 1) * 0.22
    p.lineWidth = (sc + 1) * 0.002

    p.setStrokeColour(0, 0, 0, 0.9)
    p.draw(path.scaled(scale))
    p.setStrokeColour(0, 0, 0, 0.3)
    p.draw(path.rotated(0.234234 + p.t / 10).scaled(scale))
  })
}

const sketches: { name: string; sketch: (p: SCanvas) => void }[] = [
  { sketch: compoundPath, name: "Compound Path" },
  { sketch: compoundPath2, name: "Compound Path 2" },
  { sketch: transformingPaths, name: "Transforming Paths" },
]

export default sketches
