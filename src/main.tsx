import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { routes } from '@/app/routes';
import { applyStoredTextScale } from '@/app/textScale';
import '@/styles/global.css';

applyStoredTextScale();

const router = createBrowserRouter(routes);

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element');

createRoot(container).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
