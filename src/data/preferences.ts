import type { Preferences } from '@/domain/types';
import { db } from './db';

const DEFAULT_PREFERENCES: Preferences = { id: 'app', currentProjectId: null, paused: false };

export async function getPreferences(): Promise<Preferences> {
  return { ...DEFAULT_PREFERENCES, ...(await db.preferences.get('app')) };
}

export async function updatePreferences(changes: Partial<Omit<Preferences, 'id'>>): Promise<void> {
  await db.transaction('rw', db.preferences, async () => {
    const current = await getPreferences();
    await db.preferences.put({ ...current, ...changes });
  });
}

export function setPaused(paused: boolean): Promise<void> {
  return updatePreferences({ paused });
}
