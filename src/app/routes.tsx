import { Navigate, type RouteObject } from 'react-router';
import { CounterScreen } from '@/features/counter/CounterScreen';
import { EditProjectScreen } from '@/features/projects/EditProjectScreen';
import { NewProjectScreen } from '@/features/projects/NewProjectScreen';
import { ProjectsScreen } from '@/features/projects/ProjectsScreen';
import { AddThreadScreen } from '@/features/threads/AddThreadScreen';
import { EditThreadScreen } from '@/features/threads/EditThreadScreen';
import { ThreadsScreen } from '@/features/threads/ThreadsScreen';
import { AppShell, PlainLayout, TabLayout } from './AppShell';
import { ErrorScreen } from './ErrorScreen';

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    errorElement: <ErrorScreen />,
    children: [
      {
        element: <TabLayout />,
        children: [
          { index: true, element: <ProjectsScreen /> },
          { path: 'count', element: <CounterScreen /> },
          { path: 'threads', element: <ThreadsScreen /> },
        ],
      },
      {
        element: <PlainLayout />,
        children: [
          { path: 'projects/new', element: <NewProjectScreen /> },
          { path: 'projects/:projectId/edit', element: <EditProjectScreen /> },
          { path: 'projects/:projectId/threads/new', element: <AddThreadScreen /> },
          { path: 'threads/:threadId/edit', element: <EditThreadScreen /> },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];
