import { useLiveQuery } from 'dexie-react-hooks';
import type { Part } from '@/domain/part';
import { summarize, type ProjectSummaryData } from '@/domain/summary';
import { techniqueOf, type TechniqueInfo } from '@/domain/techniques';
import type { Id, Preferences, Project } from '@/domain/types';
import { db } from './db';
import { listParts } from './parts';
import { getPreferences } from './preferences';

export interface ProjectSummary {
  project: Project;
  summary: ProjectSummaryData;
}

export interface Workspace {
  project: Project;
  technique: TechniqueInfo;
  parts: Part[];
  activePart: Part | null;
  paused: boolean;
}

async function currentProject(prefs: Preferences): Promise<Project | null> {
  const chosen = prefs.currentProjectId ? await db.projects.get(prefs.currentProjectId) : undefined;
  return chosen ?? (await db.projects.orderBy('updatedAt').last()) ?? null;
}

function groupByProject(parts: Part[]): Map<Id, Part[]> {
  const groups = new Map<Id, Part[]>();
  for (const part of parts) {
    const group = groups.get(part.projectId);
    if (group) group.push(part);
    else groups.set(part.projectId, [part]);
  }
  for (const group of groups.values()) group.sort((a, b) => a.createdAt - b.createdAt);
  return groups;
}

export function useProjectSummaries(): ProjectSummary[] | undefined {
  return useLiveQuery(async () => {
    const [projects, parts] = await Promise.all([
      db.projects.orderBy('updatedAt').reverse().toArray(),
      db.parts.toArray(),
    ]);
    const byProject = groupByProject(parts);
    return projects.map((project) => ({
      project,
      summary: summarize(project, byProject.get(project.id) ?? []),
    }));
  });
}

export function useWorkspace(): Workspace | null | undefined {
  return useLiveQuery(async () => {
    const project = await currentProject(await getPreferences());
    if (!project) return null;
    const parts = await listParts(project.id);
    const activePart = parts.find((p) => p.id === project.activePartId) ?? parts[0] ?? null;
    return {
      project,
      technique: techniqueOf(project.technique),
      parts,
      activePart,
      paused: project.paused,
    };
  });
}

export function useCurrentTechnique(): TechniqueInfo | null | undefined {
  return useLiveQuery(async () => {
    const project = await currentProject(await getPreferences());
    return project ? techniqueOf(project.technique) : null;
  });
}

export function useProject(id: Id | undefined): Project | null | undefined {
  return useLiveQuery(async () => (id ? ((await db.projects.get(id)) ?? null) : null), [id]);
}

export interface PartWithProject {
  part: Part;
  project: Project;
}

export function usePart(id: Id | undefined): PartWithProject | null | undefined {
  return useLiveQuery(async () => {
    const part = id ? await db.parts.get(id) : undefined;
    const project = part && (await db.projects.get(part.projectId));
    return part && project ? { part, project } : null;
  }, [id]);
}

export function usePreferences(): Preferences | undefined {
  return useLiveQuery(getPreferences);
}
