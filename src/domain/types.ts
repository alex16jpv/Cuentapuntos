export type Id = string;

export interface Project {
  id: Id;
  name: string;
  target: number | null;
  activeThreadId: Id | null;
  createdAt: number;
  updatedAt: number;
}

export interface Thread {
  id: Id;
  projectId: Id;
  name: string;
  hex: string;
  code: string | null;
  target: number | null;
  count: number;
  createdAt: number;
}

export interface Preferences {
  id: 'app';
  currentProjectId: Id | null;
  paused: boolean;
}
