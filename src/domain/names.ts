export function numberedNames(name: string, quantity: number): string[] {
  const base = name.trim();
  if (quantity <= 1) return [base];
  return Array.from({ length: quantity }, (_, i) => `${base} ${i + 1}`);
}

export function listInSpanish(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`;
}
