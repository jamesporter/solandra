import { Traceable } from "./index.js"

export class CompoundPath implements Traceable {
  private constructor(private paths: Traceable[]) {}

  static withPaths(...paths: Traceable[]) {
    return new CompoundPath(paths)
  }

  traceIn(ctx: CanvasRenderingContext2D) {
    this.paths.forEach((p) => p.traceIn(ctx))
  }
}
