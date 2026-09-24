import { describe, expect, it } from 'vitest';
import { percent, projectProgress } from './progress';
import type { Project, Thread } from './types';

const project = (target: number | null): Project => ({
  id: 'p',
  name: 'Jardín de invierno',
  target,
  activeThreadId: null,
  createdAt: 0,
  updatedAt: 0,
});

const thread = (count: number, target: number | null): Thread => ({
  id: crypto.randomUUID(),
  projectId: 'p',
  name: 'Rojo',
  hex: '#C72B3B',
  code: '321',
  target,
  count,
  createdAt: 0,
});

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

describe('projectProgress', () => {
  const threads = [thread(1248, 2400), thread(640, 900), thread(312, 1100), thread(0, 560)];

  it('uses the sum of thread targets when the project has none', () => {
    expect(projectProgress(project(null), threads)).toEqual({
      count: 2200,
      target: 4960,
      percent: 44,
    });
  });

  it('prefers the project target when set', () => {
    expect(projectProgress(project(5000), threads).percent).toBe(44);
    expect(projectProgress(project(2200), threads).percent).toBe(100);
  });

  it('has no percent when nothing has a target', () => {
    expect(projectProgress(project(null), [thread(10, null)])).toEqual({
      count: 10,
      target: null,
      percent: null,
    });
  });
});
