import { describe, expect, it } from 'vitest';
import { db } from './db';
import { getPreferences } from './preferences';
import { createProject, deleteProject } from './projects';
import {
  addThread,
  bumpThread,
  deleteThread,
  listThreads,
  selectThread,
  updateThread,
} from './threads';

const red = { name: 'Rojo', hex: '#C72B3B', code: '321', target: 2400 };
const black = { name: 'Negro', hex: '#1E1B1A', code: '310', target: null };

describe('projects', () => {
  it('creating a project makes it the current one', async () => {
    const id = await createProject({ name: '  Mantel de flores ', target: null });
    expect((await db.projects.get(id))?.name).toBe('Mantel de flores');
    expect((await getPreferences()).currentProjectId).toBe(id);
  });

  it('deleting a project removes its threads and clears the selection', async () => {
    const id = await createProject({ name: 'Cojín', target: 300 });
    const other = await createProject({ name: 'Otro', target: null });
    await addThread(id, red);
    await addThread(other, black);
    await db.preferences.update('app', { currentProjectId: id });

    await deleteProject(id);

    expect(await db.projects.get(id)).toBeUndefined();
    expect(await listThreads(id)).toHaveLength(0);
    expect(await listThreads(other)).toHaveLength(1);
    expect((await getPreferences()).currentProjectId).toBeNull();
  });
});

describe('threads', () => {
  it('a new thread starts at zero and becomes the active one', async () => {
    const projectId = await createProject({ name: 'Jardín', target: null });
    await addThread(projectId, red);
    const second = await addThread(projectId, black);

    const threads = await listThreads(projectId);
    expect(threads.map((t) => t.name)).toEqual(['Rojo', 'Negro']);
    expect(threads.every((t) => t.count === 0)).toBe(true);
    expect((await db.projects.get(projectId))?.activeThreadId).toBe(second);
  });

  it('counting never goes below zero', async () => {
    const projectId = await createProject({ name: 'Jardín', target: null });
    const id = await addThread(projectId, red);

    await Promise.all([bumpThread(id, 1), bumpThread(id, 1), bumpThread(id, 1)]);
    expect((await db.threads.get(id))?.count).toBe(3);

    for (let i = 0; i < 5; i++) await bumpThread(id, -1);
    expect((await db.threads.get(id))?.count).toBe(0);
  });

  it('manual edits clamp the count', async () => {
    const projectId = await createProject({ name: 'Jardín', target: null });
    const id = await addThread(projectId, red);
    await updateThread(id, { count: -4 });
    expect((await db.threads.get(id))?.count).toBe(0);
  });

  it('deleting the active thread activates another one', async () => {
    const projectId = await createProject({ name: 'Jardín', target: null });
    const first = await addThread(projectId, red);
    const second = await addThread(projectId, black);

    await deleteThread(second);
    expect((await db.projects.get(projectId))?.activeThreadId).toBe(first);

    await deleteThread(first);
    expect((await db.projects.get(projectId))?.activeThreadId).toBeNull();
  });

  it('selecting a thread activates it on its own project', async () => {
    const projectId = await createProject({ name: 'Jardín', target: null });
    const first = await addThread(projectId, red);
    await addThread(projectId, black);

    await selectThread(first);
    expect((await db.projects.get(projectId))?.activeThreadId).toBe(first);
  });

  it('editing or deleting a thread marks its project as recently updated', async () => {
    const projectId = await createProject({ name: 'Jardín', target: null });
    const id = await addThread(projectId, red);
    await db.projects.update(projectId, { updatedAt: 0 });

    await updateThread(id, { count: 5 });
    expect((await db.projects.get(projectId))?.updatedAt).toBeGreaterThan(0);

    await db.projects.update(projectId, { updatedAt: 0 });
    await deleteThread(id);
    expect((await db.projects.get(projectId))?.updatedAt).toBeGreaterThan(0);
  });
});
