/**
 * Poisson disk sampling for generating evenly-distributed random points.
 * Creates points that maintain a minimum distance from each other, resulting in
 * a more uniform and visually pleasing distribution than pure random placement.
 * @module poissonDisk
 */

import { v } from "."
import { Point2D } from "./types/sol"
import { distance } from "./vectors"

/**
 * Generates Poisson disk sampled points within a rectangular region.
 * Points are randomly distributed but maintain a minimum distance from each other.
 *
 * @param config - Configuration for point generation
 * @param config.width - Width of the sampling region
 * @param config.height - Height of the sampling region
 * @param config.minDist - Minimum distance between any two points
 * @param config.rng - Random number generator function (returns 0-1)
 * @param config.k - Number of attempts to place each point (higher = denser, default: 30)
 * @returns Array of generated points
 * @example
 * ```ts
 * // Generate evenly-spaced points across the canvas
 * const points = poissonDiskPoints({
 *   width: 1,
 *   height: 1,
 *   minDist: 0.05,
 *   rng: () => Math.random(),
 *   k: 30
 * })
 *
 * points.forEach(([x, y]) => {
 *   s.fill(new Circle({ at: [x, y], r: 0.01 }))
 * })
 * ```
 */
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

/**
 * Implements the Poisson disk sampling algorithm.
 * Uses Bridson's algorithm with a spatial grid for efficient neighbor checking.
 *
 * @example
 * ```ts
 * const sampler = new PoissonDiskSampling(1, 1, 0.05, 30)
 * const points = sampler.generatePoints(() => Math.random())
 * ```
 */
export class PoissonDiskSampling {
  private grid: (Point2D | null)[][]
  /** Generated points */
  points: Point2D[]
  private spawnPoints: Point2D[]
  private cellSize: number

  /**
   * Creates a new Poisson disk sampler.
   *
   * @param width - Width of the sampling region
   * @param height - Height of the sampling region
   * @param minDist - Minimum distance between points
   * @param k - Number of attempts to place each point
   */
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

  /**
   * Generates the Poisson disk sampled points.
   *
   * @param rng - Random number generator function that returns values between 0 and 1
   * @returns Array of generated points
   */
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

  /**
   * Checks if a candidate point is valid (within bounds and far enough from other points).
   * @internal
   */
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
