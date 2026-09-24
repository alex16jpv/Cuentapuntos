import type { Id, Project } from '@/domain/types';
import { db } from './db';
import { getPreferences, updatePreferences } from './preferences';

export interface ProjectInput {
  name: string;
  target: number | null;
}

export async function createProject(input: ProjectInput): Promise<Id> {
  const now = Date.now();
  const project: Project = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    target: input.target,
    activeThreadId: null,
    createdAt: now,
    updatedAt: now,
  };
  await db.transaction('rw', db.projects, db.preferences, async () => {
    await db.projects.add(project);
    await updatePreferences({ currentProjectId: project.id });
  });
  return project.id;
}

export async function updateProject(id: Id, input: ProjectInput): Promise<void> {
  await db.projects.update(id, {
    name: input.name.trim(),
    target: input.target,
    updatedAt: Date.now(),
  });
}

export async function deleteProject(id: Id): Promise<void> {
  await db.transaction('rw', db.projects, db.threads, db.preferences, async () => {
    await db.threads.where('projectId').equals(id).delete();
    await db.projects.delete(id);
    const prefs = await getPreferences();
    if (prefs.currentProjectId === id) await updatePreferences({ currentProjectId: null });
  });
}

export function openProject(id: Id): Promise<void> {
  return updatePreferences({ currentProjectId: id });
}
