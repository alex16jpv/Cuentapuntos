import type { KeyboardEvent, RefObject } from 'react';

export function focusOnEnter(
  event: KeyboardEvent<HTMLInputElement>,
  next: RefObject<HTMLInputElement | null>,
): void {
  if (event.key !== 'Enter' || !next.current) return;
  event.preventDefault();
  next.current.focus();
}
