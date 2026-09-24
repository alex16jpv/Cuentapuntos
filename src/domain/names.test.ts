import { describe, expect, it } from 'vitest';
import { listInSpanish, numberedNames } from './names';

describe('names', () => {
  it('numbers repeated pieces', () => {
    expect(numberedNames(' Brazo ', 1)).toEqual(['Brazo']);
    expect(numberedNames('Brazo', 2)).toEqual(['Brazo 1', 'Brazo 2']);
  });

  it('joins lists the Spanish way', () => {
    expect(listInSpanish(['A'])).toBe('A');
    expect(listInSpanish(['A', 'B'])).toBe('A y B');
    expect(listInSpanish(['A', 'B', 'C'])).toBe('A, B y C');
  });
});
