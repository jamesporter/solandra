import React, { useRef, useLayoutEffect, useState } from "react"
import { Sketch } from "../lib/types/sol"
import SCanvas from "../lib/sCanvas"
import { setNumber, getNumber } from "../util"
import { useMeasure } from "react-use"

export const INDEX_KEY = "play-ts.index"
export const SEED_KEY = "play-ts.seed"
export const TIME_KEY = "play-ts.time"

type CanvasProps = {
  sketch: Sketch
  aspectRatio?: number
  seed: number
  playing?: boolean
  noShadow?: boolean
  onClick?: (position: [number, number], size: [number, number]) => void
}

/**
 * Because this is actually a massive pain to do with hooks
 */
class CanvasPainterService {
  ctx?: CanvasRenderingContext2D
  canvas?: HTMLCanvasElement
  sketch?: Sketch
  seed = 0
  playing = false
  time: number
  width = 100
  height = 100
  aspectRatio = 100
  af: number | null = null

  constructor() {
    this.time = getNumber(TIME_KEY) || 0
  }

  configure({
    width,
    height,
    aspectRatio,
    sketch,
    seed,
    playing,
    noShadow,
  }: {
    width: number
    height: number
    aspectRatio: number
    sketch: Sketch
    seed: number
    playing: boolean
    noShadow: boolean
  }) {
    if (width && height) {
      if (width / height > aspectRatio) {
        this.height = height - (noShadow ? 0 : 20)
        this.width = this.height * aspectRatio
      } else {
        this.width = width - (noShadow ? 0 : 20)
        this.height = this.width / aspectRatio
      }
    }

    this.sketch = sketch
    this.seed = seed
    if (this.playing && !playing) {
      // Paused, so save time for the export?
      setNumber(TIME_KEY, this.time)
    }
    this.playing = playing

    this.canvas!.height = this.height
    this.canvas!.width = this.width
    this.af && cancelAnimationFrame(this.af)
    this.updateTime()
  }

  updateTime = () => {
    if (this.playing) {
      this.time += 0.01666666666
      this.af = requestAnimationFrame(this.updateTime)
    }
    this.draw()
  }

  draw = () => {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height)
      const pts = new SCanvas(
        this.ctx,
        {
          width: this.width,
          height: this.height,
        },
        this.seed,
        this.time
      )
      this.sketch && this.sketch(pts)
    }
  }
}

export function Canvas({
  aspectRatio,
  sketch,
  seed,
  playing = false,
  noShadow = false,
  onClick = () => {},
}: CanvasProps) {
  const [ref, { width, height }] = useMeasure()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // seems to be way more performant to re-use context
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [painterRef] = useState(new CanvasPainterService())

  useLayoutEffect(() => {
    let ctx
    if (!ctxRef.current) {
      const cvs = canvasRef.current
      if (cvs) {
        ctx = (cvs as HTMLCanvasElement).getContext("2d")
        painterRef.canvas = cvs
      }
    } else {
      ctx = ctxRef.current
    }

    // @ts-expect-error
    painterRef.ctx = ctx
    painterRef.configure({
      width,
      height,
      aspectRatio: aspectRatio || width / height,
      sketch,
      seed,
      playing,
      noShadow: !!noShadow,
    })
  }, [playing, seed, sketch, aspectRatio, width, height, painterRef, noShadow])

  return (
    <div
      className="flex-1 self-stretch flex items-center justify-center"
      ref={ref}
      onClick={(evt: any) => {
        const { top, left } = canvasRef.current!.getBoundingClientRect()
        const x = evt.clientX - left
        const y = evt.clientY - top
        onClick([x, y], [width, height])
      }}
    >
      <canvas
        id="myCanvas"
        ref={canvasRef}
        className={`${noShadow ? "" : "shadow-md"}`}
      />
    </div>
  )
}
