import { describe, expect, it } from 'vitest';
import {
  addStitch,
  canStepBack,
  currentRow,
  finishRow,
  isFinished,
  stepBack,
  totalStitches,
  type PartCounters,
} from './part';

const fresh = (rowTarget: number | null = null): PartCounters => ({
  count: 0,
  rowTarget,
  rowHistory: [],
});

describe('rows', () => {
  it('finishing a row stores its stitches and starts the next one', () => {
    let part = fresh();
    part = addStitch(addStitch(part));
    part = finishRow(part);
    expect(part).toEqual({ count: 0, rowTarget: null, rowHistory: [2] });
    expect(currentRow(part)).toBe(2);
  });

  it('can finish a row without counting stitches', () => {
    expect(finishRow(finishRow(fresh())).rowHistory).toEqual([0, 0]);
  });

  it('is finished once the target rows are done and ignores further finishes', () => {
    let part = finishRow(finishRow(fresh(2)));
    expect(isFinished(part)).toBe(true);
    part = finishRow(part);
    expect(part.rowHistory).toHaveLength(2);
  });

  it('never finishes without a target', () => {
    expect(isFinished(finishRow(fresh()))).toBe(false);
  });

  it('stepping back at zero reopens the previous row with its stitches', () => {
    let part = finishRow(addStitch(addStitch(addStitch(fresh()))));
    expect(canStepBack(part, 'rows')).toBe(true);
    part = stepBack(part, 'rows');
    expect(part).toEqual({ count: 3, rowTarget: null, rowHistory: [] });
    part = stepBack(part, 'rows');
    expect(part.count).toBe(2);
  });

  it('stepping back reopens a finished piece', () => {
    const done = finishRow(fresh(1));
    expect(isFinished(stepBack(done, 'rows'))).toBe(false);
  });

  it('does nothing at the very beginning', () => {
    expect(canStepBack(fresh(), 'rows')).toBe(false);
    expect(stepBack(fresh(), 'rows')).toEqual(fresh());
  });

  it('counts all stitches across rows', () => {
    const part = addStitch(finishRow(addStitch(addStitch(fresh()))));
    expect(totalStitches(part)).toBe(3);
  });
});

describe('stitches mode', () => {
  it('never steps into rows', () => {
    const part = { count: 0, rowTarget: null, rowHistory: [4] };
    expect(canStepBack(part, 'stitches')).toBe(false);
    expect(stepBack(part, 'stitches')).toBe(part);
  });
});
