import type { Id } from './types';

export type Technique = 'embroidery' | 'crochet' | 'knitting' | 'other';
export type CountMode = 'stitches' | 'rows';

export interface Part {
  id: Id;
  projectId: Id;
  name: string;
  hex: string | null;
  code: string | null;
  target: number | null;
  count: number;
  rowTarget: number | null;
  rowHistory: number[];
  createdAt: number;
}

export type PartCounters = Pick<Part, 'count' | 'rowTarget' | 'rowHistory'>;

export function rowsDone(part: Pick<Part, 'rowHistory'>): number {
  return part.rowHistory.length;
}

export function currentRow(part: Pick<Part, 'rowHistory'>): number {
  return part.rowHistory.length + 1;
}

export function isFinished(part: Pick<Part, 'rowHistory' | 'rowTarget'>): boolean {
  return part.rowTarget !== null && part.rowHistory.length >= part.rowTarget;
}

export function totalStitches(part: Pick<Part, 'count' | 'rowHistory'>): number {
  return part.rowHistory.reduce((sum, n) => sum + n, part.count);
}

export function addStitch(part: PartCounters): PartCounters {
  return { ...part, count: part.count + 1 };
}

export function finishRow(part: PartCounters): PartCounters {
  if (isFinished(part)) return part;
  return { ...part, rowHistory: [...part.rowHistory, part.count], count: 0 };
}

export function stepBack(part: PartCounters, mode: CountMode): PartCounters {
  if (part.count > 0) return { ...part, count: part.count - 1 };
  if (mode === 'stitches' || part.rowHistory.length === 0) return part;
  const rowHistory = part.rowHistory.slice(0, -1);
  return { ...part, rowHistory, count: part.rowHistory.at(-1) ?? 0 };
}

export function canStepBack(part: PartCounters, mode: CountMode): boolean {
  return part.count > 0 || (mode === 'rows' && part.rowHistory.length > 0);
}
