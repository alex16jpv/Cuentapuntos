import { formatNumber } from '@/domain/format';
import { currentRow, isFinished, rowsDone, type Part } from '@/domain/part';
import type { ProjectSummaryData } from '@/domain/summary';
import type { TechniqueInfo } from '@/domain/techniques';

export function stitchesLabel(n: number): string {
  return n === 1 ? '1 punto' : `${formatNumber(n)} puntos`;
}

export function partCode(part: Pick<Part, 'code'>): string | null {
  return part.code ? `DMC ${part.code}` : null;
}

export function partSummary(
  part: Part,
  technique: TechniqueInfo,
  { notStartedLabel = false } = {},
): string {
  if (technique.row) {
    const row = technique.row;
    if (isFinished(part)) return 'Terminada';
    const done = rowsDone(part);
    if (notStartedLabel && done === 0 && part.count === 0) return 'Sin empezar';
    const of = part.rowTarget ? ` de ${formatNumber(part.rowTarget)}` : '';
    return `${row.oneCapital} ${formatNumber(currentRow(part))}${of}`;
  }
  const count = notStartedLabel && part.count === 0 ? 'sin empezar' : stitchesLabel(part.count);
  const code = partCode(part);
  return code ? `${code} · ${count}` : capitalize(count);
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function projectLine(summary: ProjectSummaryData, technique: TechniqueInfo): string {
  const row = technique.row;
  if (!row) return stitchesLabel(summary.stitches);
  const rows = summary.rows === 1 ? `1 ${row.one}` : `${formatNumber(summary.rows)} ${row.many}`;
  if (summary.partsTotal <= 1) return capitalize(rows);
  return `${summary.partsDone} de ${summary.partsTotal} ${technique.part.many} terminadas`;
}
