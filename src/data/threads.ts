import type { Id, Project, Thread } from '@/domain/types';
import { db } from './db';

export interface ThreadInput {
  name: string;
  hex: string;
  code: string | null;
  target: number | null;
}

export async function addThread(projectId: Id, input: ThreadInput): Promise<Id> {
  const id = crypto.randomUUID();
  await db.transaction('rw', db.threads, db.projects, async () => {
    const now = Date.now();
    const last = (await listThreads(projectId)).at(-1);
    const createdAt = last ? Math.max(now, last.createdAt + 1) : now;
    await db.threads.add({ id, projectId, ...input, count: 0, createdAt });
    await db.projects.update(projectId, { activeThreadId: id, updatedAt: now });
  });
  return id;
}

export async function updateThread(
  id: Id,
  changes: Partial<ThreadInput & { count: number }>,
): Promise<void> {
  const safe =
    changes.count === undefined ? changes : { ...changes, count: Math.max(0, changes.count) };
  await db.transaction('rw', db.threads, db.projects, async () => {
    const thread = await db.threads.get(id);
    if (!thread) return;
    await db.threads.update(id, safe);
    await db.projects.update(thread.projectId, { updatedAt: Date.now() });
  });
}

export async function deleteThread(id: Id): Promise<void> {
  await db.transaction('rw', db.threads, db.projects, async () => {
    const thread = await db.threads.get(id);
    if (!thread) return;
    await db.threads.delete(id);
    const project = await db.projects.get(thread.projectId);
    if (!project) return;
    const changes: Partial<Project> = { updatedAt: Date.now() };
    if (project.activeThreadId === id) {
      const next = await listThreads(thread.projectId);
      changes.activeThreadId = next[0]?.id ?? null;
    }
    await db.projects.update(project.id, changes);
  });
}

export async function selectThread(threadId: Id): Promise<void> {
  await db.transaction('rw', db.threads, db.projects, async () => {
    const thread = await db.threads.get(threadId);
    if (thread) await db.projects.update(thread.projectId, { activeThreadId: thread.id });
  });
}

export async function bumpThread(id: Id, delta: number): Promise<void> {
  await db.transaction('rw', db.threads, db.projects, async () => {
    const thread = await db.threads.get(id);
    if (!thread) return;
    const count = Math.max(0, thread.count + delta);
    if (count === thread.count) return;
    await db.threads.update(id, { count });
    await db.projects.update(thread.projectId, { updatedAt: Date.now() });
  });
}

export function listThreads(projectId: Id): Promise<Thread[]> {
  return db.threads
    .where('[projectId+createdAt]')
    .between([projectId, -Infinity], [projectId, Infinity])
    .toArray();
}
