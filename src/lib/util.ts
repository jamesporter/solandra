import { Point2D } from "./types/sol"

export const clamp = (
  { from, to }: { from: number; to: number },
  n: number
): number => {
  return Math.min(to, Math.max(from, n))
}

type ScaleConfig = {
  minDomain: number
  maxDomain: number
  minRange: number
  maxRange: number
}

export const scaler = ({
  minDomain,
  maxDomain,
  minRange,
  maxRange,
}: ScaleConfig): ((n: number) => number) => {
  const rangeS = maxRange - minRange
  const domainS = maxDomain - minDomain
  return n => minRange + (rangeS * (n - minDomain)) / domainS
}

export const scaler2d = (
  c1: ScaleConfig,
  c2: ScaleConfig
): ((point: Point2D) => Point2D) => {
  const s1 = scaler(c1)
  const s2 = scaler(c2)
  return ([x, y]: Point2D) => [s1(x), s2(y)]
}

/**
 * @param height The height of the (vertical parts of) isometric grid cells
 * @returns A function mapping from [x,y,z] to [x,y].
 */
export const isoTransform = (height: number) => {
  const w = (height * Math.sqrt(3)) / 2
  return ([x, y, z]: [number, number, number]): [number, number] => [
    -w * (z - x),
    -height * (x / 2 + y + z / 2),
  ]
}

export const centroid = (points: Point2D[]): Point2D => {
  const n = points.length
  if (n === 0) {
    throw new Error("centroid must have at least one point")
  } else if (n === 1) {
    return points[0]
  } else {
    let m =
      points[0][0] == points[n - 1][0] && points[0][1] == points[n - 1][1]
        ? n - 1
        : n

    let x = 0
    let y = 0
    for (let i = 0; i < m; i++) {
      x += points[i][0]
      y += points[i][1]
    }
    return [x / m, y / m]
  }
}

const hr = Math.sin(Math.PI / 3)
const cp6 = Math.cos(Math.PI / 6)

export const hexTransform = ({
  r,
  vertical = true,
}: {
  r: number
  vertical?: boolean
}) => ([x, y]: Point2D): Point2D => {
  if (vertical) {
    return [y % 2 === 0 ? 2 * r * cp6 * x : (2 * x - 1) * r * cp6, 1.5 * y * r]
  } else {
    return [r * 1.5 * x, x % 2 === 0 ? 2 * r * cp6 * y : (2 * y - 1) * r * cp6]
  }
}
