export const clamp = (
  { from, to }: { from: number; to: number },
  n: number
): number => {
  return Math.min(to, Math.max(from, n));
};
