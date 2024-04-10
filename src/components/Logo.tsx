import { RegularPolygon, SCanvas } from "../lib"
import { Canvas } from "./Canvas"

const logo = (p: SCanvas) => {
  const { bottom, right, center } = p.meta
  const d = Math.min(bottom, right) / 2.8

  p.times(5, (n) => {
    const sides = 10 - n
    const r = d - n * 0.16 * d + (1 + Math.cos(p.t * 1.5)) / 45
    p.setFillColor(345, 70, 20 + n * 12)
    p.fill(
      new RegularPolygon({
        at: center,
        n: sides,
        r,
        a: 0.1 * Math.cos(p.t),
      })
    )
  })
}

export function Logo() {
  return (
    <div
      style={{
        height: "50vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Canvas sketch={logo} seed={1} noShadow playing />
    </div>
  )
}
