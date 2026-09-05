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
  ariaLabel?: string
}

/**
 * Because this is actually a massive pain to do with hooks
 */
export class CanvasPainterService {
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
  lastFrameTime: number | null = null
  pixelRatio = 1

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
    pixelRatio,
  }: {
    width: number
    height: number
    aspectRatio: number
    sketch: Sketch
    seed: number
    playing: boolean
    noShadow: boolean
    pixelRatio: number
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
    this.pixelRatio = pixelRatio

    this.canvas!.style.height = `${this.height}px`
    this.canvas!.style.width = `${this.width}px`
    this.canvas!.height = Math.round(this.height * pixelRatio)
    this.canvas!.width = Math.round(this.width * pixelRatio)
    this.stop()
    this.lastFrameTime = null
    this.updateTime()
  }

  stop = () => {
    if (this.af !== null) cancelAnimationFrame(this.af)
    this.af = null
  }

  updateTime = (timestamp?: number) => {
    if (this.playing) {
      if (timestamp !== undefined && this.lastFrameTime !== null) {
        this.time += Math.min((timestamp - this.lastFrameTime) / 1000, 0.1)
      }
      if (timestamp !== undefined) this.lastFrameTime = timestamp
      this.af = requestAnimationFrame(this.updateTime)
    }
    this.draw()
  }

  draw = () => {
    if (this.ctx) {
      this.ctx.save()
      this.ctx.setTransform(1, 0, 0, 1, 0, 0)
      this.ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height)
      this.ctx.restore()
      const pts = new SCanvas(
        this.ctx,
        {
          width: this.canvas!.width,
          height: this.canvas!.height,
        },
        this.seed,
        this.time
      )
      if (this.sketch) this.sketch(pts)
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
  ariaLabel = "Generative artwork",
}: CanvasProps) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [painterRef] = useState(new CanvasPainterService())

  useLayoutEffect(() => {
    // seems to be way more performant to re-use the context, so only ask the
    // canvas for one the first time round
    if (!ctxRef.current && canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext("2d")
      painterRef.canvas = canvasRef.current
    }

    const ctx = ctxRef.current
    if (!ctx) return

    painterRef.ctx = ctx
    painterRef.configure({
      width,
      height,
      aspectRatio: aspectRatio || width / height,
      sketch,
      seed,
      playing,
      noShadow: !!noShadow,
      pixelRatio: Math.max(window.devicePixelRatio || 1, 1),
    })
    return () => painterRef.stop()
  }, [playing, seed, sketch, aspectRatio, width, height, painterRef, noShadow])

  return (
    <div
      className="flex-1 self-stretch flex items-center justify-center"
      ref={ref}
      onClick={(evt: any) => {
        const { top, left } = canvasRef.current!.getBoundingClientRect()
        const x = evt.clientX - left
        const y = evt.clientY - top
        onClick([x, y], [painterRef.width, painterRef.height])
      }}
    >
      <canvas
        id="myCanvas"
        role="img"
        aria-label={ariaLabel}
        ref={canvasRef}
        className={`${noShadow ? "" : "shadow-md"}`}
      />
    </div>
  )
}
