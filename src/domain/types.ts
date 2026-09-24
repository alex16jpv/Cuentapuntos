import type { Technique } from './part';

export type Id = string;

export type TextScale = 'normal' | 'large' | 'extra';

export interface Project {
  id: Id;
  name: string;
  technique: Technique;
  target: number | null;
  activePartId: Id | null;
  createdAt: number;
  updatedAt: number;
}

export interface Preferences {
  id: 'app';
  currentProjectId: Id | null;
  paused: boolean;
  textScale: TextScale;
}
