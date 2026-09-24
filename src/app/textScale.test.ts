import { describe, expect, it } from 'vitest';
import { applyStoredTextScale, applyTextScale } from './textScale';

describe('text scale', () => {
  it('applies the stored size at startup', () => {
    localStorage.setItem('cuentapuntos:text-scale', 'large');
    applyStoredTextScale();
    expect(document.documentElement.style.fontSize).toBe('115%');
  });

  it('ignores unknown stored values', () => {
    localStorage.setItem('cuentapuntos:text-scale', 'huge');
    applyStoredTextScale();
    expect(document.documentElement.style.fontSize).toBe('');
  });

  it('remembers what it applies', () => {
    applyTextScale('extra');
    expect(document.documentElement.style.fontSize).toBe('130%');
    expect(localStorage.getItem('cuentapuntos:text-scale')).toBe('extra');
  });
});
