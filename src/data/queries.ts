import { useLiveQuery } from 'dexie-react-hooks';
import { projectProgress, type ProjectProgress } from '@/domain/progress';
import type { Id, Project, Thread } from '@/domain/types';
import { db } from './db';
import { getPreferences } from './preferences';
import { listThreads } from './threads';

export interface ProjectSummary {
  project: Project;
  progress: ProjectProgress;
}

export interface Workspace {
  project: Project;
  threads: Thread[];
  activeThread: Thread | null;
  paused: boolean;
}

async function currentProject(): Promise<Project | null> {
  const prefs = await getPreferences();
  const chosen = prefs.currentProjectId ? await db.projects.get(prefs.currentProjectId) : undefined;
  return chosen ?? (await db.projects.orderBy('updatedAt').last()) ?? null;
}

function groupByProject(threads: Thread[]): Map<Id, Thread[]> {
  const groups = new Map<Id, Thread[]>();
  for (const thread of threads) {
    const group = groups.get(thread.projectId);
    if (group) group.push(thread);
    else groups.set(thread.projectId, [thread]);
  }
  return groups;
}

export function useProjectSummaries(): ProjectSummary[] | undefined {
  return useLiveQuery(async () => {
    const [projects, threads] = await Promise.all([
      db.projects.orderBy('updatedAt').reverse().toArray(),
      db.threads.toArray(),
    ]);
    const byProject = groupByProject(threads);
    return projects.map((project) => ({
      project,
      progress: projectProgress(project, byProject.get(project.id) ?? []),
    }));
  });
}

export function useWorkspace(): Workspace | null | undefined {
  return useLiveQuery(async () => {
    const [project, prefs] = await Promise.all([currentProject(), getPreferences()]);
    if (!project) return null;
    const threads = await listThreads(project.id);
    const activeThread = threads.find((t) => t.id === project.activeThreadId) ?? threads[0] ?? null;
    return { project, threads, activeThread, paused: prefs.paused };
  });
}

export function useProject(id: Id | undefined): Project | null | undefined {
  return useLiveQuery(async () => (id ? ((await db.projects.get(id)) ?? null) : null), [id]);
}

export function useThread(id: Id | undefined): Thread | null | undefined {
  return useLiveQuery(async () => (id ? ((await db.threads.get(id)) ?? null) : null), [id]);
}
