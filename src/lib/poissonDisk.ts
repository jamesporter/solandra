import { v } from "."
import { Point2D } from "./types/sol"
import { distance } from "./vectors"

export function poissonDiskPoints({
  width,
  height,
  minDist,
  rng,
  k,
}: {
  width: number
  height: number
  minDist: number
  rng: () => number
  k: number
}) {
  const pds = new PoissonDiskSampling(width, height, minDist, k)
  pds.generatePoints(rng)
  return pds.points
}

export class PoissonDiskSampling {
  private grid: (Point2D | null)[][]
  points: Point2D[]
  private spawnPoints: Point2D[]
  private cellSize: number

  constructor(
    private width: number,
    private height: number,
    private minDist: number,
    private k: number
  ) {
    this.cellSize = this.minDist / Math.sqrt(2)
    this.grid = Array.from(
      { length: Math.ceil(this.height / this.cellSize) },
      () =>
        Array.from(
          { length: Math.ceil(this.width / this.cellSize) },
          () => null
        )
    )
    this.points = []
    this.spawnPoints = []
  }

  generatePoints(rng: () => number) {
    let initialPoint: Point2D = [rng() * this.width, rng() * this.height]
    this.points.push(initialPoint)
    this.spawnPoints.push(initialPoint)
    this.grid[Math.floor(initialPoint[1] / this.cellSize)][
      Math.floor(initialPoint[0] / this.cellSize)
    ] = initialPoint

    while (this.spawnPoints.length > 0) {
      let spawnIndex = Math.floor(rng() * this.spawnPoints.length)
      let spawnCentre = this.spawnPoints[spawnIndex]
      let accepted = false

      for (let i = 0; i < this.k; i++) {
        let angle = rng() * 2 * Math.PI
        let dir: Point2D = [Math.cos(angle), Math.sin(angle)]
        let dist = rng() * this.minDist + this.minDist
        let newPoint: Point2D = [
          spawnCentre[0] + dir[0] * dist,
          spawnCentre[1] + dir[1] * dist,
        ]

        if (this.isValid(newPoint)) {
          this.points.push(newPoint)
          this.spawnPoints.push(newPoint)
          this.grid[Math.floor(newPoint[1] / this.cellSize)][
            Math.floor(newPoint[0] / this.cellSize)
          ] = newPoint
          accepted = true
          break
        }
      }

      if (!accepted) {
        this.spawnPoints.splice(spawnIndex, 1)
      }
    }

    return this.points
  }

  private isValid(point: Point2D): boolean {
    if (
      point[0] < 0 ||
      point[0] >= this.width ||
      point[1] < 0 ||
      point[1] >= this.height
    ) {
      return false
    }

    let gridX = Math.floor(point[0] / this.cellSize)
    let gridY = Math.floor(point[1] / this.cellSize)
    let xStart = Math.max(gridX - 2, 0)
    let yStart = Math.max(gridY - 2, 0)
    let xEnd = Math.min(gridX + 2, this.grid[0].length - 1)
    let yEnd = Math.min(gridY + 2, this.grid.length - 1)

    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        let p = this.grid[y][x]
        if (p && distance(p, point) < this.minDist) {
          return false
        }
      }
    }

    return true
  }
}
