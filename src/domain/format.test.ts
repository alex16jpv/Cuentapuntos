import { describe, expect, it } from 'vitest';
import { formatNumber, normalizeCode, parseCount, parsePositiveInt } from './format';
import { findByCode, PALETTE } from './palette';

describe('formatNumber', () => {
  it('groups thousands with dots, including four-digit numbers', () => {
    expect(formatNumber(2200)).toBe('2.200');
    expect(formatNumber(1248)).toBe('1.248');
    expect(formatNumber(310)).toBe('310');
  });
});

describe('parsePositiveInt', () => {
  it('reads digits and ignores separators', () => {
    expect(parsePositiveInt('2400')).toBe(2400);
    expect(parsePositiveInt('2.400')).toBe(2400);
  });

  it('returns null for blank or zero', () => {
    expect(parsePositiveInt('')).toBeNull();
    expect(parsePositiveInt('abc')).toBeNull();
    expect(parsePositiveInt('0')).toBeNull();
  });

  it('parseCount accepts zero but rejects blank or unsafe input', () => {
    expect(parseCount('0')).toBe(0);
    expect(parseCount('12')).toBe(12);
    expect(parseCount('')).toBeNull();
    expect(parseCount('99999999999999999999')).toBeNull();
  });
});

describe('codes', () => {
  it('normalizes codes', () => {
    expect(normalizeCode('  b5200 ')).toBe('B5200');
    expect(normalizeCode('   ')).toBeNull();
  });

  it('finds palette colors by DMC code, case-insensitively', () => {
    expect(PALETTE[findByCode('321')]?.name).toBe('Rojo');
    expect(PALETTE[findByCode('b5200')]?.name).toBe('Blanco');
    expect(findByCode('9999')).toBe(-1);
    expect(findByCode('')).toBe(-1);
  });
});
