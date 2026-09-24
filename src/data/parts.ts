import {
  addStitch,
  finishRow,
  isFinished,
  stepBack,
  type Part,
  type PartCounters,
} from '@/domain/part';
import { TECHNIQUES } from '@/domain/techniques';
import type { Id, Project } from '@/domain/types';
import { db } from './db';

export interface PartInput {
  name: string;
  hex: string | null;
  code: string | null;
  target: number | null;
  rowTarget: number | null;
}

export type PartChanges = Partial<PartInput & { count: number; rowsDone: number }>;

export async function addParts(projectId: Id, inputs: readonly PartInput[]): Promise<Id[]> {
  if (inputs.length === 0) return [];
  const ids = inputs.map(() => crypto.randomUUID());
  await db.transaction('rw', db.parts, db.projects, async () => {
    const now = Date.now();
    const last = (await listParts(projectId)).at(-1);
    let createdAt = last ? Math.max(now, last.createdAt + 1) : now;
    await db.parts.bulkAdd(
      inputs.map((input, i): Part => ({
        id: ids[i] ?? crypto.randomUUID(),
        projectId,
        ...input,
        name: input.name.trim(),
        count: 0,
        rowHistory: [],
        createdAt: createdAt++,
      })),
    );
    await db.projects.update(projectId, { activePartId: ids[0] ?? null, updatedAt: now });
  });
  return ids;
}

export async function addPart(projectId: Id, input: PartInput): Promise<Id> {
  const [id] = await addParts(projectId, [input]);
  if (!id) throw new Error('Part was not created');
  return id;
}

export async function updatePart(id: Id, changes: PartChanges): Promise<void> {
  const { rowsDone, count, ...fields } = changes;
  await db.transaction('rw', db.parts, db.projects, async () => {
    const part = await db.parts.get(id);
    if (!part) return;
    const update: Partial<Part> = { ...fields };
    if (fields.name !== undefined) update.name = fields.name.trim();
    if (count !== undefined) update.count = Math.max(0, count);
    if (rowsDone !== undefined) update.rowHistory = resizeHistory(part.rowHistory, rowsDone);
    if (isFinished({ ...part, ...update })) update.count = 0;
    await db.parts.update(id, update);
    await db.projects.update(part.projectId, { updatedAt: Date.now() });
  });
}

function resizeHistory(history: readonly number[], rows: number): number[] {
  const size = Math.max(0, rows);
  if (size <= history.length) return history.slice(0, size);
  return [...history, ...Array<number>(size - history.length).fill(0)];
}

export async function deletePart(id: Id): Promise<void> {
  await db.transaction('rw', db.parts, db.projects, async () => {
    const part = await db.parts.get(id);
    if (!part) return;
    await db.parts.delete(id);
    const project = await db.projects.get(part.projectId);
    if (!project) return;
    const changes: Partial<Project> = { updatedAt: Date.now() };
    if (project.activePartId === id) {
      const next = await listParts(part.projectId);
      changes.activePartId = next[0]?.id ?? null;
    }
    await db.projects.update(project.id, changes);
  });
}

export async function selectPart(id: Id): Promise<void> {
  await db.transaction('rw', db.parts, db.projects, async () => {
    const part = await db.parts.get(id);
    if (part) await db.projects.update(part.projectId, { activePartId: part.id });
  });
}

async function mutateCounters(
  id: Id,
  change: (part: PartCounters, project: Project) => PartCounters,
): Promise<void> {
  await db.transaction('rw', db.parts, db.projects, async () => {
    const part = await db.parts.get(id);
    const project = part && (await db.projects.get(part.projectId));
    if (!part || !project) return;
    const next = change(part, project);
    if (next.count === part.count && next.rowHistory === part.rowHistory) return;
    await db.parts.update(id, { count: next.count, rowHistory: next.rowHistory });
    await db.projects.update(project.id, { updatedAt: Date.now() });
  });
}

export function countStitch(id: Id): Promise<void> {
  return mutateCounters(id, (part, project) =>
    TECHNIQUES[project.technique].mode === 'rows' && isFinished(part) ? part : addStitch(part),
  );
}

export function removeStitch(id: Id): Promise<void> {
  return mutateCounters(id, (part, project) => stepBack(part, TECHNIQUES[project.technique].mode));
}

export function completeRow(id: Id): Promise<void> {
  return mutateCounters(id, (part) => finishRow(part));
}

export async function addRowToTarget(id: Id): Promise<void> {
  await db.transaction('rw', db.parts, db.projects, async () => {
    const part = await db.parts.get(id);
    if (!part) return;
    await db.parts.update(id, {
      rowTarget: Math.max(part.rowTarget ?? 0, part.rowHistory.length) + 1,
    });
    await db.projects.update(part.projectId, { updatedAt: Date.now() });
  });
}

export function listParts(projectId: Id): Promise<Part[]> {
  return db.parts
    .where('[projectId+createdAt]')
    .between([projectId, -Infinity], [projectId, Infinity])
    .toArray();
}
