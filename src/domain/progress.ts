export function percent(count: number, target: number | null): number | null {
  if (!target || target <= 0) return null;
  return Math.min(100, Math.round((count / target) * 100));
}
