import { formatNumber } from '@/domain/format';
import type { Thread } from '@/domain/types';

export function threadCode(thread: Pick<Thread, 'code'>): string {
  return thread.code ? `DMC ${thread.code}` : 'Sin número';
}

export function threadSummary(thread: Thread, { notStartedLabel = false } = {}): string {
  const count =
    notStartedLabel && thread.count === 0 ? 'sin empezar' : `${formatNumber(thread.count)} puntos`;
  return thread.code ? `DMC ${thread.code} · ${count}` : count;
}
