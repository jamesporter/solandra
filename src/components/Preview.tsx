import React, { useRef, useLayoutEffect } from "react"
import { Sketch } from "../lib/types/sol"
import SCanvas from "../lib/sCanvas"
import Link from "next/link"

type CanvasProps = {
  sketch: Sketch
  size?: number
  id: number
  name: string
  category: string
}

export default function Preview({
  size = 200,
  sketch,
  id,
  name,
  category,
}: CanvasProps) {
  const canvasRef = useRef(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  useLayoutEffect(() => {
    let ctx
    if (!ctxRef.current) {
      const cvs = canvasRef.current
      if (cvs) {
        ctx = (cvs as HTMLCanvasElement).getContext("2d")
      }
    } else {
      ctx = ctxRef.current
    }

    if (ctx) {
      ctx.clearRect(0, 0, size, size)
      const pts = new SCanvas(
        ctx,
        {
          width: size,
          height: size,
        },
        1
      )
      sketch(pts)
    }
  })

  return (
    <div className="m-4">
      <h3 className="text-md text-center font-semibold pb-4">{name}</h3>
      <Link to={`/view?sketch=${id}&category=${category}`}>
        <canvas
          width={size}
          height={size}
          ref={canvasRef}
          className="shadow-lg hover:shadow-2xl bg-white"
        />
      </Link>
    </div>
  )
}
