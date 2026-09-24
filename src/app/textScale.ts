import { useEffect } from 'react';
import { usePreferences } from '@/data/queries';
import type { TextScale } from '@/domain/types';

export const TEXT_SCALES: readonly { id: TextScale; label: string; size: string }[] = [
  { id: 'normal', label: 'Normal', size: '100%' },
  { id: 'large', label: 'Grande', size: '115%' },
  { id: 'extra', label: 'Muy grande', size: '130%' },
];

const STORAGE_KEY = 'mis-labores:text-scale';

function sizeOf(scale: string | null): string | null {
  return TEXT_SCALES.find((s) => s.id === scale)?.size ?? null;
}

export function applyTextScale(scale: TextScale): void {
  document.documentElement.style.fontSize = sizeOf(scale) ?? '100%';
  try {
    localStorage.setItem(STORAGE_KEY, scale);
  } catch {
    return;
  }
}

export function applyStoredTextScale(): void {
  try {
    const size = sizeOf(localStorage.getItem(STORAGE_KEY));
    if (size) document.documentElement.style.fontSize = size;
  } catch {
    return;
  }
}

export function useTextScaleSync(): void {
  const scale = usePreferences()?.textScale;
  useEffect(() => {
    if (scale) applyTextScale(scale);
  }, [scale]);
}
