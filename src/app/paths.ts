import type { Id } from '@/domain/types';

export const paths = {
  projects: '/',
  count: '/count',
  threads: '/threads',
  newProject: '/projects/new',
  editProject: (projectId: Id) => `/projects/${projectId}/edit`,
  newThread: (projectId: Id) => `/projects/${projectId}/threads/new`,
  editThread: (threadId: Id) => `/threads/${threadId}/edit`,
} as const;

export interface ReturnState {
  from?: string;
}
