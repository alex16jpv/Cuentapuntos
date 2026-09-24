import {
  isFinished,
  rowsDone,
  totalStitches,
  type CountMode,
  type Part,
  type Technique,
} from './part';
import { percent } from './progress';
import { TECHNIQUES } from './techniques';

export interface ProjectSummaryData {
  mode: CountMode;
  stitches: number;
  rows: number;
  partsDone: number;
  partsTotal: number;
  percent: number | null;
}

export function partPercent(part: Part, mode: CountMode): number | null {
  if (mode === 'rows') return percent(rowsDone(part), part.rowTarget);
  return percent(part.count, part.target);
}

export function summarize(
  project: { technique: Technique; target: number | null },
  parts: readonly Part[],
): ProjectSummaryData {
  const mode = TECHNIQUES[project.technique].mode;
  const stitches = parts.reduce((sum, p) => sum + totalStitches(p), 0);
  const rows = parts.reduce((sum, p) => sum + rowsDone(p), 0);
  const partsDone = parts.filter(isFinished).length;
  return {
    mode,
    stitches,
    rows,
    partsDone,
    partsTotal: parts.length,
    percent:
      mode === 'rows' ? rowsPercent(parts) : stitchesPercent(project.target, parts, stitches),
  };
}

function stitchesPercent(target: number | null, parts: readonly Part[], stitches: number) {
  const total = target ?? parts.reduce((sum, p) => sum + (p.target ?? 0), 0);
  return percent(stitches, total || null);
}

function rowsPercent(parts: readonly Part[]) {
  if (parts.length === 0 || parts.some((p) => p.rowTarget === null)) return null;
  const done = parts.reduce((sum, p) => sum + Math.min(rowsDone(p), p.rowTarget ?? 0), 0);
  const total = parts.reduce((sum, p) => sum + (p.rowTarget ?? 0), 0);
  return percent(done, total);
}
