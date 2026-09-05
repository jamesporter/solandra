import { commandMenuItems, type CommandMenuItem } from "./data/commandMenuItems"

const separators = new Set([" ", "-", "_", "/", ".", ",", ":", "&", "(", ")"])

export type FuzzyMatch = {
  score: number
  /** Indices into the target of the characters that matched, for highlighting. */
  indices: number[]
}

function isBoundary(target: string, i: number): boolean {
  if (i === 0) return true
  const before = target[i - 1]
  if (separators.has(before)) return true
  // camelCase boundary, eg the P of forPoissonDiskPoints
  return (
    before === before.toLowerCase() && target[i] !== target[i].toLowerCase()
  )
}

/**
 * Greedy subsequence match. Every character of the query has to appear in the
 * target, in order, but not necessarily adjacently. Matches at the start of a
 * word and runs of adjacent characters score highly, gaps cost a little.
 * Returns null when the query isn't a subsequence of the target at all.
 */
export function fuzzyMatch(query: string, target: string): FuzzyMatch | null {
  const q = query.toLowerCase().replace(/\s+/g, "")
  if (q.length === 0) return { score: 0, indices: [] }

  const lower = target.toLowerCase()
  const indices: number[] = []
  let score = 0
  let from = 0
  let previous = -2

  for (const character of q) {
    const at = lower.indexOf(character, from)
    if (at < 0) return null

    if (isBoundary(target, at)) score += at === 0 ? 14 : 9
    if (at === previous + 1) score += 10
    score -= Math.min(at - previous - 1, 6)

    indices.push(at)
    previous = at
    from = at + 1
  }

  // all else being equal a shorter, more completely matched name is better
  return { score: score + Math.round((30 * q.length) / target.length), indices }
}

export type CommandMenuResult = {
  item: CommandMenuItem
  /** Indices into item.name to highlight; empty when matched on keywords. */
  indices: number[]
  score: number
}

/**
 * Rank the command menu items against what has been typed. An empty query
 * gives everything back in curated order.
 */
export function searchCommandMenu(
  query: string,
  items: CommandMenuItem[] = commandMenuItems
): CommandMenuResult[] {
  const trimmed = query.trim()
  if (trimmed.length === 0) {
    return items.map((item) => ({ item, indices: [], score: 0 }))
  }

  const results: CommandMenuResult[] = []

  for (const item of items) {
    const byName = fuzzyMatch(trimmed, item.name)
    const context = [item.section, item.keywords].filter(Boolean).join(" ")
    const byContext = context ? fuzzyMatch(trimmed, context) : null

    // a hit on the name is always worth more than one on the hidden terms
    const contextScore = byContext ? byContext.score * 0.4 - 10 : null

    if (byName && (contextScore === null || byName.score >= contextScore)) {
      results.push({ item, indices: byName.indices, score: byName.score })
    } else if (contextScore !== null) {
      results.push({ item, indices: [], score: contextScore })
    }
  }

  // Array.prototype.sort is stable, so equal scores keep their curated order
  return results.sort((a, b) => b.score - a.score)
}
