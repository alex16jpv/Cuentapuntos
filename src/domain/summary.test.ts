import { describe, expect, it } from 'vitest';
import type { Part } from './part';
import { summarize } from './summary';

let seq = 0;
const part = (p: Partial<Part>): Part => ({
  id: String(++seq),
  projectId: 'p',
  name: 'x',
  hex: null,
  code: null,
  target: null,
  count: 0,
  rowTarget: null,
  rowHistory: [],
  createdAt: seq,
  ...p,
});

describe('summarize', () => {
  it('embroidery uses stitches against the project or color targets', () => {
    const parts = [part({ count: 1248, target: 2400 }), part({ count: 952, target: 2560 })];
    expect(summarize({ technique: 'embroidery', target: null }, parts)).toMatchObject({
      mode: 'stitches',
      stitches: 2200,
      percent: 44,
    });
    expect(summarize({ technique: 'embroidery', target: 2200 }, parts).percent).toBe(100);
  });

  it('crochet uses rows when every piece has a row target', () => {
    const parts = [
      part({ rowTarget: 10, rowHistory: [6, 12, 18, 24, 30] }),
      part({ rowTarget: 10, rowHistory: Array(10).fill(8) }),
    ];
    expect(summarize({ technique: 'crochet', target: null }, parts)).toMatchObject({
      mode: 'rows',
      rows: 15,
      partsDone: 1,
      partsTotal: 2,
      percent: 75,
    });
  });

  it('crochet has no percent if a piece has no row target', () => {
    const parts = [part({ rowTarget: 10 }), part({})];
    expect(summarize({ technique: 'crochet', target: null }, parts).percent).toBeNull();
  });

  it('empty projects have no percent', () => {
    expect(summarize({ technique: 'knitting', target: null }, []).percent).toBeNull();
    expect(summarize({ technique: 'other', target: null }, []).percent).toBeNull();
  });
});
