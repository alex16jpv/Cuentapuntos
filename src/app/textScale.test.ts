import { describe, expect, it } from 'vitest';
import { applyStoredTextScale, applyTextScale } from './textScale';

describe('text scale', () => {
  it('applies the stored size at startup', () => {
    localStorage.setItem('mis-labores:text-scale', 'large');
    applyStoredTextScale();
    expect(document.documentElement.style.fontSize).toBe('115%');
  });

  it('ignores unknown stored values', () => {
    localStorage.setItem('mis-labores:text-scale', 'huge');
    applyStoredTextScale();
    expect(document.documentElement.style.fontSize).toBe('');
  });

  it('remembers what it applies', () => {
    applyTextScale('extra');
    expect(document.documentElement.style.fontSize).toBe('130%');
    expect(localStorage.getItem('mis-labores:text-scale')).toBe('extra');
  });
});
