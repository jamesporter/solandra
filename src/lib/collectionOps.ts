export function pairWise<T>(items: T[]): [T, T][] {
  if (items.length < 2) return [];
  const res: [T, T][] = [];
  for (let i = 0; i < items.length - 1; i++) {
    res.push([items[i], items[i + 1]]);
  }
  return res;
}

export function tripleWise<T>(items: T[], looped?: boolean): [T, T, T][] {
  if (items.length < 3) return [];
  const res: [T, T, T][] = [];

  if (looped) res.push([items[items.length - 2], items[0], items[1]]);
  for (let i = 0; i < items.length - 2; i++) {
    res.push([items[i], items[i + 1], items[i + 2]]);
  }
  if (looped)
    res.push([items[items.length - 2], items[items.length - 1], items[1]]);
  return res;
}

export function zip2<T, S>(items: T[], other: S[]): [T, S][] {
  const res: [T, S][] = [];
  for (let i = 0; i < items.length && i < other.length; i++) {
    res.push([items[i], other[i]]);
  }
  return res;
}

export function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

export function arrayOf<T>(n: number, init: () => T): T[] {
  return Array.from({ length: n }, _ => init());
}

export default {
  pairWise,
  tripleWise,
  zip2,
  sum,
  arrayOf
};
