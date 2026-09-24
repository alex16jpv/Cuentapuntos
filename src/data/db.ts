import Dexie, { type EntityTable, type Transaction } from 'dexie';
import type { Part } from '@/domain/part';
import type { Preferences, Project } from '@/domain/types';

interface ThreadV1 {
  id: string;
  projectId: string;
  name: string;
  hex: string;
  code: string | null;
  target: number | null;
  count: number;
  createdAt: number;
}

export class BastidorDB extends Dexie {
  projects!: EntityTable<Project, 'id'>;
  parts!: EntityTable<Part, 'id'>;
  preferences!: EntityTable<Preferences, 'id'>;

  constructor(name = 'mi-bastidor') {
    super(name);
    this.version(1).stores({
      projects: 'id, updatedAt',
      threads: 'id, projectId, [projectId+createdAt]',
      preferences: 'id',
    });
    this.version(2)
      .stores({ parts: 'id, projectId, [projectId+createdAt]' })
      .upgrade(migrateThreadsToParts);
    this.version(3).stores({ threads: null });
  }
}

async function migrateThreadsToParts(tx: Transaction): Promise<void> {
  const threads: ThreadV1[] = await tx.table('threads').toArray();
  await tx.table('parts').bulkAdd(
    threads.map((t): Part => ({
      id: t.id,
      projectId: t.projectId,
      name: t.name,
      hex: t.hex,
      code: t.code,
      target: t.target,
      count: t.count,
      rowTarget: null,
      rowHistory: [],
      createdAt: t.createdAt,
    })),
  );
  await tx
    .table('projects')
    .toCollection()
    .modify((p: Record<string, unknown>) => {
      p.technique = 'embroidery';
      p.activePartId = p.activeThreadId ?? null;
      delete p.activeThreadId;
    });
  await tx
    .table('preferences')
    .toCollection()
    .modify((p: Record<string, unknown>) => {
      p.textScale = 'normal';
    });
}

export const db = new BastidorDB();

export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;
  if (await navigator.storage.persisted()) return true;
  return navigator.storage.persist();
}
