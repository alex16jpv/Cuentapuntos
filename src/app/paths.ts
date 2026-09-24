import type { Id } from '@/domain/types';

export const paths = {
  projects: '/',
  count: '/count',
  parts: '/parts',
  settings: '/settings',
  newProject: '/projects/new',
  editProject: (projectId: Id) => `/projects/${projectId}/edit`,
  newPart: (projectId: Id) => `/projects/${projectId}/parts/new`,
  editPart: (partId: Id) => `/parts/${partId}/edit`,
} as const;

export interface ReturnState {
  from?: string;
}
