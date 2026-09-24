const numberFormat = new Intl.NumberFormat('es-ES', { useGrouping: 'always' });

export function formatNumber(n: number): string {
  return numberFormat.format(n);
}

export function parsePositiveInt(input: string): number | null {
  const digits = input.replace(/\D/g, '');
  if (!digits) return null;
  const n = Number.parseInt(digits, 10);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

export function parseCount(input: string): number | null {
  const digits = input.replace(/\D/g, '');
  if (!digits) return null;
  const n = Number.parseInt(digits, 10);
  return Number.isSafeInteger(n) ? n : null;
}

export function normalizeCode(input: string): string | null {
  const code = input.trim();
  return code ? code.toUpperCase() : null;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
