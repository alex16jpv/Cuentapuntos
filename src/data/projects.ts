import type { Technique } from '@/domain/part';
import { DEFAULT_COUNTER_NAME, TECHNIQUES } from '@/domain/techniques';
import type { Id, Project } from '@/domain/types';
import { db } from './db';
import { addParts } from './parts';
import { getPreferences, updatePreferences } from './preferences';

export interface ProjectInput {
  name: string;
  technique: Technique;
  target: number | null;
}

export async function createProject(input: ProjectInput): Promise<Id> {
  const now = Date.now();
  const project: Project = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    technique: input.technique,
    target: TECHNIQUES[input.technique].askStitchTarget ? input.target : null,
    activePartId: null,
    createdAt: now,
    updatedAt: now,
  };
  await db.transaction('rw', db.projects, db.parts, db.preferences, async () => {
    await db.projects.add(project);
    if (input.technique === 'other') {
      await addParts(project.id, [
        { name: DEFAULT_COUNTER_NAME, hex: null, code: null, target: null, rowTarget: null },
      ]);
    }
    await updatePreferences({ currentProjectId: project.id });
  });
  return project.id;
}

export async function updateProject(
  id: Id,
  input: Pick<ProjectInput, 'name' | 'target'>,
): Promise<void> {
  await db.transaction('rw', db.projects, async () => {
    const project = await db.projects.get(id);
    if (!project) return;
    await db.projects.update(id, {
      name: input.name.trim(),
      target: TECHNIQUES[project.technique].askStitchTarget ? input.target : null,
      updatedAt: Date.now(),
    });
  });
}

export async function deleteProject(id: Id): Promise<void> {
  await db.transaction('rw', db.projects, db.parts, db.preferences, async () => {
    await db.parts.where('projectId').equals(id).delete();
    await db.projects.delete(id);
    const prefs = await getPreferences();
    if (prefs.currentProjectId === id) await updatePreferences({ currentProjectId: null });
  });
}

export function openProject(id: Id): Promise<void> {
  return updatePreferences({ currentProjectId: id });
}
