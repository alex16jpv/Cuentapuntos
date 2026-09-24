import Dexie from 'dexie';
import { describe, expect, it } from 'vitest';
import { BastidorDB, db } from './db';
import {
  addPart,
  addParts,
  addRowToTarget,
  completeRow,
  countStitch,
  deletePart,
  listParts,
  removeStitch,
  selectPart,
  updatePart,
  type PartInput,
} from './parts';
import { getPreferences } from './preferences';
import { createProject, deleteProject, updateProject } from './projects';

const red: PartInput = { name: 'Rojo', hex: '#C72B3B', code: '321', target: 2400, rowTarget: null };
const black: PartInput = {
  name: 'Negro',
  hex: '#1E1B1A',
  code: '310',
  target: null,
  rowTarget: null,
};
const piece = (name: string, rowTarget: number | null = null): PartInput => ({
  name,
  hex: null,
  code: null,
  target: null,
  rowTarget,
});

const embroidery = (name = 'Jardín') =>
  createProject({ name, technique: 'embroidery', target: null });
const crochet = (name = 'Osito') => createProject({ name, technique: 'crochet', target: null });

describe('projects', () => {
  it('creating a project makes it the current one', async () => {
    const id = await createProject({ name: '  Mantel ', technique: 'embroidery', target: 300 });
    expect(await db.projects.get(id)).toMatchObject({
      name: 'Mantel',
      technique: 'embroidery',
      target: 300,
    });
    expect((await getPreferences()).currentProjectId).toBe(id);
  });

  it('only stitch-counting techniques keep a stitch target', async () => {
    const id = await createProject({ name: 'Bufanda', technique: 'knitting', target: 500 });
    expect((await db.projects.get(id))?.target).toBeNull();
    await updateProject(id, { name: 'Bufanda', target: 900 });
    expect((await db.projects.get(id))?.target).toBeNull();
  });

  it('"other" projects start with a counter ready to use', async () => {
    const id = await createProject({ name: 'Macramé', technique: 'other', target: null });
    const parts = await listParts(id);
    expect(parts.map((p) => p.name)).toEqual(['Contador']);
    expect((await db.projects.get(id))?.activePartId).toBe(parts[0]?.id);
  });

  it('deleting a project removes its parts and clears the selection', async () => {
    const id = await embroidery();
    const other = await embroidery('Otro');
    await addPart(id, red);
    await addPart(other, black);
    await db.preferences.update('app', { currentProjectId: id });

    await deleteProject(id);

    expect(await db.projects.get(id)).toBeUndefined();
    expect(await listParts(id)).toHaveLength(0);
    expect(await listParts(other)).toHaveLength(1);
    expect((await getPreferences()).currentProjectId).toBeNull();
  });
});

describe('parts', () => {
  it('new parts start empty, keep order, and the first new one becomes active', async () => {
    const projectId = await crochet();
    await addPart(projectId, piece('Cabeza'));
    const [arm1] = await addParts(projectId, [piece('Brazo 1'), piece('Brazo 2')]);

    const parts = await listParts(projectId);
    expect(parts.map((p) => p.name)).toEqual(['Cabeza', 'Brazo 1', 'Brazo 2']);
    expect(parts.every((p) => p.count === 0 && p.rowHistory.length === 0)).toBe(true);
    expect((await db.projects.get(projectId))?.activePartId).toBe(arm1);
  });

  it('counting stitches never goes below zero in stitch mode', async () => {
    const id = await addPart(await embroidery(), red);
    await Promise.all([countStitch(id), countStitch(id), countStitch(id)]);
    expect((await db.parts.get(id))?.count).toBe(3);
    for (let i = 0; i < 5; i++) await removeStitch(id);
    expect((await db.parts.get(id))?.count).toBe(0);
  });

  it('rows: finishing, stepping back across rows, and a finished piece', async () => {
    const id = await addPart(await crochet(), piece('Cabeza', 2));
    await countStitch(id);
    await countStitch(id);
    await completeRow(id);
    expect(await db.parts.get(id)).toMatchObject({ count: 0, rowHistory: [2] });

    await removeStitch(id);
    expect(await db.parts.get(id)).toMatchObject({ count: 2, rowHistory: [] });

    await completeRow(id);
    await completeRow(id);
    await countStitch(id);
    expect(await db.parts.get(id)).toMatchObject({ count: 0, rowHistory: [2, 0] });

    await addRowToTarget(id);
    expect((await db.parts.get(id))?.rowTarget).toBe(3);
  });

  it('manual edits clamp the count and resize the row history', async () => {
    const id = await addPart(await crochet(), piece('Cuerpo'));
    await completeRow(id);
    await updatePart(id, { count: -4, rowsDone: 3 });
    expect(await db.parts.get(id)).toMatchObject({ count: 0, rowHistory: [0, 0, 0] });
    await updatePart(id, { rowsDone: 1, name: '  Tronco ' });
    expect(await db.parts.get(id)).toMatchObject({ name: 'Tronco', rowHistory: [0] });
  });

  it('selecting and deleting keep the active part consistent', async () => {
    const projectId = await embroidery();
    const first = await addPart(projectId, red);
    const second = await addPart(projectId, black);

    await selectPart(first);
    expect((await db.projects.get(projectId))?.activePartId).toBe(first);

    await deletePart(first);
    expect((await db.projects.get(projectId))?.activePartId).toBe(second);
    await deletePart(second);
    expect((await db.projects.get(projectId))?.activePartId).toBeNull();
  });

  it('edits mark the project as recently updated', async () => {
    const projectId = await embroidery();
    const id = await addPart(projectId, red);
    await db.projects.update(projectId, { updatedAt: 0 });
    await updatePart(id, { count: 5 });
    expect((await db.projects.get(projectId))?.updatedAt).toBeGreaterThan(0);
  });
});

describe('migration from v1', () => {
  it('turns threads into embroidery parts and keeps the selection', async () => {
    const name = 'migration-test';
    const v1 = new Dexie(name);
    v1.version(1).stores({
      projects: 'id, updatedAt',
      threads: 'id, projectId, [projectId+createdAt]',
      preferences: 'id',
    });
    await v1.table('projects').add({
      id: 'p1',
      name: 'Jardín',
      target: null,
      activeThreadId: 't1',
      createdAt: 1,
      updatedAt: 1,
    });
    await v1.table('threads').add({
      id: 't1',
      projectId: 'p1',
      name: 'Rojo',
      hex: '#C72B3B',
      code: '321',
      target: 2400,
      count: 1248,
      createdAt: 1,
    });
    await v1.table('preferences').add({ id: 'app', currentProjectId: 'p1', paused: true });
    v1.close();

    const v3 = new BastidorDB(name);
    expect(await v3.projects.get('p1')).toMatchObject({
      technique: 'embroidery',
      activePartId: 't1',
    });
    expect(await v3.projects.get('p1')).not.toHaveProperty('activeThreadId');
    expect(await v3.parts.get('t1')).toMatchObject({
      count: 1248,
      rowHistory: [],
      rowTarget: null,
    });
    expect(await v3.preferences.get('app')).toMatchObject({ paused: true, textScale: 'normal' });
    expect(v3.tables.map((t) => t.name).sort()).toEqual(['parts', 'preferences', 'projects']);
    await v3.delete();
  });
});
