import Dexie, { type EntityTable } from 'dexie';
import type { Part } from '@/domain/part';
import type { Preferences, Project } from '@/domain/types';

export class AppDatabase extends Dexie {
  projects!: EntityTable<Project, 'id'>;
  parts!: EntityTable<Part, 'id'>;
  preferences!: EntityTable<Preferences, 'id'>;

  constructor(name = 'cuentapuntos') {
    super(name);
    this.version(1).stores({
      projects: 'id, updatedAt',
      parts: 'id, projectId, [projectId+createdAt]',
      preferences: 'id',
    });
  }
}

export const db = new AppDatabase();

export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;
  if (await navigator.storage.persisted()) return true;
  return navigator.storage.persist();
}
