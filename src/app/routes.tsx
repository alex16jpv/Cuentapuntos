import { Navigate, type RouteObject } from 'react-router';
import { CounterScreen } from '@/features/counter/CounterScreen';
import { EditProjectScreen } from '@/features/projects/EditProjectScreen';
import { NewProjectScreen } from '@/features/projects/NewProjectScreen';
import { ProjectsScreen } from '@/features/projects/ProjectsScreen';
import { AddPartScreen } from '@/features/parts/AddPartScreen';
import { EditPartScreen } from '@/features/parts/EditPartScreen';
import { PartsScreen } from '@/features/parts/PartsScreen';
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
          { path: 'parts', element: <PartsScreen /> },
        ],
      },
      {
        element: <PlainLayout />,
        children: [
          { path: 'projects/new', element: <NewProjectScreen /> },
          { path: 'projects/:projectId/edit', element: <EditProjectScreen /> },
          { path: 'projects/:projectId/parts/new', element: <AddPartScreen /> },
          { path: 'parts/:partId/edit', element: <EditPartScreen /> },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];
