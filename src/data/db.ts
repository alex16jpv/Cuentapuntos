import Dexie, { type EntityTable } from 'dexie';
import type { Preferences, Project, Thread } from '@/domain/types';

export class BastidorDB extends Dexie {
  projects!: EntityTable<Project, 'id'>;
  threads!: EntityTable<Thread, 'id'>;
  preferences!: EntityTable<Preferences, 'id'>;

  constructor(name = 'mi-bastidor') {
    super(name);
    this.version(1).stores({
      projects: 'id, updatedAt',
      threads: 'id, projectId, [projectId+createdAt]',
      preferences: 'id',
    });
  }
}

export const db = new BastidorDB();

export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;
  if (await navigator.storage.persisted()) return true;
  return navigator.storage.persist();
}
