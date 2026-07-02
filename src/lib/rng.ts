/**
 * PCG (Permuted Congruential Generator) random number generator.
 * A fast, high-quality random number generator with excellent statistical properties.
 * Based on https://github.com/thomcc/pcg-random
 * See also http://www.pcg-random.org/
 * @module rng
 */

/**
 * Multiply two 64-bit numbers (given in parts), and store the result in `out`.
 * @internal
 */
function mul64_(
  out: Int32Array,
  aHi: number,
  aLo: number,
  bHi: number,
  bLo: number
) {
  var c1 = ((aLo >>> 16) * (bLo & 0xffff)) >>> 0
  var c0 = ((aLo & 0xffff) * (bLo >>> 16)) >>> 0

  var lo = ((aLo & 0xffff) * (bLo & 0xffff)) >>> 0
  var hi = ((aLo >>> 16) * (bLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16))) >>> 0

  c0 = (c0 << 16) >>> 0
  lo = (lo + c0) >>> 0
  if (lo >>> 0 < c0 >>> 0) {
    hi = (hi + 1) >>> 0
  }

  c1 = (c1 << 16) >>> 0
  lo = (lo + c1) >>> 0
  if (lo >>> 0 < c1 >>> 0) {
    hi = (hi + 1) >>> 0
  }

  hi = (hi + Math.imul(aLo, bHi)) >>> 0
  hi = (hi + Math.imul(aHi, bLo)) >>> 0

  out[0] = hi
  out[1] = lo
}

/**
 * Add two 64-bit numbers (given in parts), and store the result in `out`.
 * @internal
 */
function add64_(
  out: Int32Array,
  aHi: number,
  aLo: number,
  bHi: number,
  bLo: number
) {
  var hi = (aHi + bHi) >>> 0
  var lo = (aLo + bLo) >>> 0
  if (lo >>> 0 < aLo >>> 0) {
    hi = (hi + 1) | 0
  }
  out[0] = hi
  out[1] = lo
}

const defaultIncHi = 0x14057b7e
const defaultIncLo = 0xf767814f

const MUL_HI = 0x5851f42d >>> 0
const MUL_LO = 0x4c957f2d >>> 0

const BIT_53 = 9007199254740992.0
const BIT_27 = 134217728.0

/**
 * PCG Random Number Generator.
 * A seedable pseudo-random number generator with excellent statistical properties.
 * Perfect for reproducible generative art and simulations.
 *
 * @example
 * ```ts
 * // Create with random seed
 * const rng = new RNG()
 *
 * // Create with specific seed for reproducibility
 * const rng = new RNG(12345)
 *
 * // Generate random values
 * const randomFloat = rng.number() // 0.0 to 1.0
 * const randomInt = rng.integer(100) // 0 to 99
 * ```
 */
export class RNG {
  private state: Int32Array

  /**
   * Creates a new PCG random number generator.
   *
   * @param seedHi - High 32 bits of the seed (optional, defaults to random)
   * @param seedLo - Low 32 bits of the seed (optional)
   * @param incHi - High 32 bits of the increment (optional, use default for best results)
   * @param incLo - Low 32 bits of the increment (optional, use default for best results)
   * @example
   * ```ts
   * const rng1 = new RNG() // Random seed
   * const rng2 = new RNG(42) // Seeded with 42
   * const rng3 = new RNG(0x12345678, 0x9abcdef0) // Full 64-bit seed
   * ```
   */
  constructor(
    seedHi?: number,
    seedLo?: number,
    incHi: number = defaultIncHi,
    incLo: number = defaultIncLo
  ) {
    let hi: number
    let lo: number

    if (seedLo === undefined && seedHi === undefined) {
      lo = (Math.random() * 0xffffffff) >>> 0
      hi = 0
    } else if (seedLo === undefined) {
      lo = seedHi as number
      hi = 0
    } else {
      lo = seedLo
      hi = seedHi as number
    }

    this.state = new Int32Array([0, 0, incHi >>> 0, (incLo | 1) >>> 0])
    this.next()
    add64_(this.state, this.state[0], this.state[1], hi >>> 0, lo >>> 0)
    this.next()
  }

  /**
   * Gets the current internal state of the generator.
   * Can be used with setState() to save and restore the generator state.
   *
   * @returns A tuple of four 32-bit integers representing the internal state
   * @example
   * ```ts
   * const state = rng.getState()
   * // ... generate some numbers ...
   * rng.setState(state) // Restore to saved state
   * ```
   */
  getState(): [number, number, number, number] {
    return [this.state[0], this.state[1], this.state[2], this.state[3]]
  }

  /**
   * Restores the internal state of the generator.
   * Use with getState() to save and restore the generator state for reproducibility.
   *
   * @param state - A tuple of four 32-bit integers from a previous getState() call
   * @example
   * ```ts
   * const state = rng.getState()
   * const num1 = rng.number()
   * rng.setState(state) // Reset state
   * const num2 = rng.number() // num2 === num1
   * ```
   */
  setState(state: [number, number, number, number]) {
    this.state[0] = state[0]
    this.state[1] = state[1]
    this.state[2] = state[2]
    this.state[3] = state[3] | 1
  }

  /**
   * Generates a random 32-bit unsigned integer.
   * This is the core method that implements the PCG algorithm.
   *
   * @returns A random 32-bit unsigned integer (0 to 4294967295)
   * @example
   * ```ts
   * const randomBits = rng.next()
   * ```
   */
  next(): number {
    // save current state (what we'll use for this number)
    var oldHi = this.state[0] >>> 0
    var oldLo = this.state[1] >>> 0

    // churn LCG.
    mul64_(this.state, oldHi, oldLo, MUL_HI, MUL_LO)
    add64_(
      this.state,
      this.state[0],
      this.state[1],
      this.state[2],
      this.state[3]
    )

    // get least sig. 32 bits of ((oldstate >> 18) ^ oldstate) >> 27
    var xsHi = oldHi >>> 18
    var xsLo = ((oldLo >>> 18) | (oldHi << 14)) >>> 0
    xsHi = (xsHi ^ oldHi) >>> 0
    xsLo = (xsLo ^ oldLo) >>> 0
    var xorshifted = ((xsLo >>> 27) | (xsHi << 5)) >>> 0
    // rotate xorshifted right a random amount, based on the most sig. 5 bits
    // bits of the old state.
    var rot = oldHi >>> 27
    var rot2 = ((-rot >>> 0) & 31) >>> 0
    return ((xorshifted >>> rot) | (xorshifted << rot2)) >>> 0
  }

  /**
   * Generates a uniformly distributed random integer in the range [0, max).
   * Uses rejection sampling to ensure uniform distribution across the entire range.
   *
   * @param max - The exclusive upper bound (must be positive)
   * @returns A random integer from 0 (inclusive) to max (exclusive)
   * @example
   * ```ts
   * const diceRoll = rng.integer(6) + 1 // 1 to 6
   * const arrayIndex = rng.integer(myArray.length)
   * ```
   */
  integer(max: number): number {
    if (!max) {
      return this.next()
    }
    max = max >>> 0
    if ((max & (max - 1)) === 0) {
      return this.next() & (max - 1) // fast path for power of 2
    }

    var num = 0
    var skew = ((-max >>> 0) % max) >>> 0
    for (num = this.next(); num < skew; num = this.next()) {
      // this loop will rarely execute more than twice,
      // and is intentionally empty
    }
    return num % max
  }

  /**
   * Generates a uniformly distributed random floating-point number in the range [0.0, 1.0).
   * Uses 53 bits of precision (every bit of the IEEE-754 double mantissa is randomized).
   *
   * @returns A random double-precision float from 0.0 (inclusive) to 1.0 (exclusive)
   * @example
   * ```ts
   * const randomFloat = rng.number() // 0.0 to 1.0
   * const randomInRange = rng.number() * 100 + 50 // 50 to 150
   * ```
   */
  number(): number {
    var hi = (this.next() & 0x03ffffff) * 1.0
    var lo = (this.next() & 0x07ffffff) * 1.0
    return (hi * BIT_27 + lo) / BIT_53
  }
}
