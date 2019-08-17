import { SimplePath, Traceable } from "."

/**
 * NB Not all canvas stuff supported, don't export this!
 * Good enough for some things
 * @param traceable
 */
export function traceSimplePath(traceable: Traceable): SimplePath {
  const sp = SimplePath.withPoints([])

  traceable.traceIn({
    moveTo(x, y) {
      sp.addPoint([x, y])
    },
    lineTo(x, y) {
      sp.addPoint([x, y])
    },
  } as CanvasRenderingContext2D)
  return sp
}
