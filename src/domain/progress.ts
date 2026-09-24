import type { Project, Thread } from './types';

export function percent(count: number, target: number | null): number | null {
  if (!target || target <= 0) return null;
  return Math.min(100, Math.round((count / target) * 100));
}

export function totalCount(threads: readonly Thread[]): number {
  return threads.reduce((sum, t) => sum + t.count, 0);
}

export function projectTarget(project: Project, threads: readonly Thread[]): number | null {
  if (project.target) return project.target;
  const sum = threads.reduce((acc, t) => acc + (t.target ?? 0), 0);
  return sum > 0 ? sum : null;
}

export interface ProjectProgress {
  count: number;
  target: number | null;
  percent: number | null;
}

export function projectProgress(project: Project, threads: readonly Thread[]): ProjectProgress {
  const count = totalCount(threads);
  const target = projectTarget(project, threads);
  return { count, target, percent: percent(count, target) };
}
