/**
 * Collection utility functions for working with arrays.
 * @module collectionOps
 */

/**
 * Creates pairs of consecutive elements from an array.
 * For an array [a, b, c, d], returns [[a, b], [b, c], [c, d]].
 *
 * @template T - The type of elements in the array
 * @param items - The input array
 * @returns An array of tuples containing consecutive pairs, or empty array if input has fewer than 2 elements
 * @example
 * ```ts
 * pairWise([1, 2, 3, 4]) // Returns [[1, 2], [2, 3], [3, 4]]
 * pairWise(["a", "b", "c"]) // Returns [["a", "b"], ["b", "c"]]
 * ```
 */
export function pairWise<T>(items: T[]): [T, T][] {
  if (items.length < 2) return []
  const res: [T, T][] = []
  for (let i = 0; i < items.length - 1; i++) {
    res.push([items[i], items[i + 1]])
  }
  return res
}

/**
 * Creates triplets of consecutive elements from an array.
 * For an array [a, b, c, d], returns [[a, b, c], [b, c, d]].
 *
 * @template T - The type of elements in the array
 * @param items - The input array
 * @param looped - If true, wraps around to include elements from the start at the end
 * @returns An array of tuples containing consecutive triplets, or empty array if input has fewer than 3 elements
 * @example
 * ```ts
 * tripleWise([1, 2, 3, 4]) // Returns [[1, 2, 3], [2, 3, 4]]
 * tripleWise([1, 2, 3, 4], true) // Returns [[3, 1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 2]]
 * ```
 */
export function tripleWise<T>(items: T[], looped?: boolean): [T, T, T][] {
  if (items.length < 3) return []
  const res: [T, T, T][] = []

  if (looped) res.push([items[items.length - 2], items[0], items[1]])
  for (let i = 0; i < items.length - 2; i++) {
    res.push([items[i], items[i + 1], items[i + 2]])
  }
  if (looped)
    res.push([items[items.length - 2], items[items.length - 1], items[1]])
  return res
}

/**
 * Combines two arrays into an array of tuples by pairing elements at matching indices.
 * Stops at the length of the shorter array.
 *
 * @template T - The type of elements in the first array
 * @template S - The type of elements in the second array
 * @param items - The first array
 * @param other - The second array
 * @returns An array of tuples pairing elements from both arrays
 * @example
 * ```ts
 * zip2([1, 2, 3], ["a", "b", "c"]) // Returns [[1, "a"], [2, "b"], [3, "c"]]
 * zip2([1, 2], ["a", "b", "c", "d"]) // Returns [[1, "a"], [2, "b"]]
 * ```
 */
export function zip2<T, S>(items: T[], other: S[]): [T, S][] {
  const res: [T, S][] = []
  for (let i = 0; i < items.length && i < other.length; i++) {
    res.push([items[i], other[i]])
  }
  return res
}

/**
 * Calculates the sum of all numbers in an array.
 *
 * @param numbers - Array of numbers to sum
 * @returns The sum of all numbers, or 0 for an empty array
 * @example
 * ```ts
 * sum([1, 2, 3, 4]) // Returns 10
 * sum([]) // Returns 0
 * ```
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}

/**
 * Creates an array of a specified length by calling an initialization function for each element.
 * The initialization function is called n times to create n new instances.
 *
 * @template T - The type of elements to create
 * @param n - The number of elements to create
 * @param init - A function that returns a new element (called once per element)
 * @returns An array of n elements created by the init function
 * @example
 * ```ts
 * arrayOf(3, () => Math.random()) // Returns 3 random numbers
 * arrayOf(5, () => [0, 0]) // Returns [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
 * ```
 */
export function arrayOf<T>(n: number, init: () => T): T[] {
  return Array.from({ length: n }, (_) => init())
}

const collectionOps = {
  pairWise,
  tripleWise,
  zip2,
  sum,
  arrayOf,
}

export default collectionOps
