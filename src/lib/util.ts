export const clamp = (
  { from, to }: { from: number; to: number },
  n: number
): number => {
  return Math.min(to, Math.max(from, n))
}

export const scaler = ({
  minDomain,
  maxDomain,
  minRange,
  maxRange,
}: {
  minDomain: number
  maxDomain: number
  minRange: number
  maxRange: number
}): ((n: number) => number) => {
  const rangeS = maxRange - minRange
  const domainS = maxDomain - minDomain
  return n => minRange + (rangeS * (n - minDomain)) / domainS
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
