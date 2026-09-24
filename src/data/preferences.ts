import type { Preferences, TextScale } from '@/domain/types';
import { db } from './db';

const DEFAULT_PREFERENCES: Preferences = {
  id: 'app',
  currentProjectId: null,
  textScale: 'normal',
};

export async function getPreferences(): Promise<Preferences> {
  return { ...DEFAULT_PREFERENCES, ...(await db.preferences.get('app')) };
}

export async function updatePreferences(changes: Partial<Omit<Preferences, 'id'>>): Promise<void> {
  await db.transaction('rw', db.preferences, async () => {
    const current = await getPreferences();
    await db.preferences.put({ ...current, ...changes });
  });
}

export function setTextScale(textScale: TextScale): Promise<void> {
  return updatePreferences({ textScale });
}
