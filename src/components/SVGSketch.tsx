/* eslint-disable @next/next/no-img-element */
import { SolandraSvg } from "solandra-svg"

export function SVGSketch({
  sketch,
  width,
  height,
  className = "",
}: {
  sketch: (sol: SolandraSvg) => void
  width: number
  height: number
  className?: string
}) {
  const svg = new SolandraSvg(width, height, 1)
  sketch(svg)
  return (
    <img
      src={svg.imageSrc(true)}
      alt="Solandra SVG Sketch"
      className={className}
    />
  )
}
