import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { db } from '@/data/db';
import { renderApp } from '@/test/renderApp';
import { seedEmbroidery } from '@/test/seed';
import { WIDE_SCREEN } from '@/ui/useMediaQuery';

describe('resilience and layout', () => {
  it('moves to the next field on Enter instead of submitting', async () => {
    const { user } = renderApp('/projects/new?tecnica=embroidery');

    await user.type(await screen.findByLabelText('¿Cómo se llama?'), 'Mantel{Enter}');

    expect(screen.getByLabelText('¿Cuántos puntos tiene?')).toHaveFocus();
    expect(await db.projects.count()).toBe(0);
  });

  it('tells the user when a write fails', async () => {
    await seedEmbroidery();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { user } = renderApp('/count');
    const tap = await screen.findByRole('button', { name: 'Sumar un punto' });

    vi.spyOn(db, 'transaction').mockRejectedValueOnce(new Error('QuotaExceededError'));
    await user.click(tap);

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo guardar');
  });

  it('reads the page content before the navigation', async () => {
    renderApp('/');
    const main = await screen.findByRole('main');
    const nav = screen.getByRole('navigation', { name: 'Principal' });
    expect(main.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('puts "Nuevo proyecto" in the header on wide screens', async () => {
    await seedEmbroidery();
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === WIDE_SCREEN,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    renderApp('/');

    await screen.findByRole('button', { name: /Jardín de invierno/ });
    const title = screen.getByRole('heading', { name: '¿Qué hacemos hoy?' });
    const header = title.closest('header');
    if (!header) throw new Error('Missing header');
    expect(within(header).getByRole('link', { name: /Nuevo proyecto/ })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Nuevo proyecto/ })).toHaveLength(1);
  });
});
