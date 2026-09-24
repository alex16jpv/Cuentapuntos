import { describe, expect, it } from 'vitest';
import { percent } from './progress';

describe('percent', () => {
  it('rounds and caps at 100', () => {
    expect(percent(1248, 2400)).toBe(52);
    expect(percent(3000, 2400)).toBe(100);
  });

  it('returns null without a target', () => {
    expect(percent(10, null)).toBeNull();
    expect(percent(10, 0)).toBeNull();
  });
});
