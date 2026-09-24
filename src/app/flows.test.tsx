import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { db } from '@/data/db';
import { createProject } from '@/data/projects';
import { addThread } from '@/data/threads';
import { renderApp } from '@/test/renderApp';

async function seedProject() {
  const projectId = await createProject({ name: 'Jardín de invierno', target: null });
  await addThread(projectId, { name: 'Rojo', hex: '#C72B3B', code: '321', target: 2400 });
  await addThread(projectId, { name: 'Negro', hex: '#1E1B1A', code: '310', target: null });
  return projectId;
}

describe('first run', () => {
  it('creates a project, adds a color and counts stitches', async () => {
    const { user } = renderApp('/');

    expect(await screen.findByText('Aún no tienes proyectos')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /Nuevo proyecto/ }));

    await user.click(await screen.findByRole('button', { name: 'Empezar a bordar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Escribe un nombre');

    await user.type(screen.getByLabelText('¿Cómo se llama?'), 'Mantel de flores');
    await user.type(screen.getByLabelText('¿Cuántos puntos tiene?'), '2.400');
    await user.click(screen.getByRole('button', { name: 'Empezar a bordar' }));

    expect(await screen.findByText('Aún no hay colores')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /Añadir un color/ }));

    expect(await screen.findByText('Primero elige un color')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Rojo' }));
    expect(screen.getByLabelText(/número del hilo/)).toHaveValue('321');
    await user.type(screen.getByLabelText(/Cuántos puntos de este color/), '10');
    await user.click(screen.getByRole('button', { name: 'Añadir Rojo' }));

    expect(await screen.findByText('¡Listo!')).toBeInTheDocument();
    expect(screen.getByText(/Añadiste/)).toHaveTextContent(
      'Añadiste Rojo (DMC 321) a Mantel de flores.',
    );
    await user.click(screen.getByRole('button', { name: 'Contar con este color' }));

    const tap = await screen.findByRole('button', { name: 'Sumar un punto' });
    await user.click(tap);
    await user.click(tap);
    await user.click(tap);
    expect(await screen.findByText('de 10 puntos')).toBeInTheDocument();
    await expectCount('3');

    await user.click(screen.getByRole('button', { name: /Quitar uno/ }));
    await expectCount('2');

    await user.click(screen.getByRole('button', { name: 'Pausar' }));
    const paused = await screen.findByRole('button', { name: 'Contador en pausa' });
    await user.click(paused);
    await expectCount('2');
    expect(screen.getByRole('button', { name: /Quitar uno/ })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Seguir contando' }));
    await user.click(await screen.findByRole('button', { name: 'Sumar un punto' }));
    await expectCount('3');

    await user.click(screen.getByRole('link', { name: 'Proyectos' }));
    const card = await screen.findByRole('button', { name: /Mantel de flores/ });
    expect(card).toHaveTextContent('3 puntos');
    expect(card).toHaveTextContent('0%');
  });
});

describe('counter', () => {
  it('switches the active color from the sheet', async () => {
    await seedProject();
    const { user } = renderApp('/count');

    await user.click(await screen.findByRole('button', { name: /Negro.*Cambiar/ }));
    const sheet = await screen.findByRole('dialog', { name: '¿Qué color vas a usar?' });
    await user.click(within(sheet).getByRole('button', { name: /Rojo/ }));

    expect(await screen.findByRole('button', { name: /Rojo.*Cambiar/ })).toBeInTheDocument();
    expect(screen.getByText('de 2.400 puntos')).toBeInTheDocument();
  });

  it('falls back to project progress when the color has no target', async () => {
    const projectId = await createProject({ name: 'Cojín', target: 200 });
    await addThread(projectId, { name: 'Azul', hex: '#1E4A9C', code: null, target: null });
    renderApp('/count');

    expect(await screen.findByText('puntos con este color')).toBeInTheDocument();
    expect(screen.getByText('0% del proyecto')).toBeInTheDocument();
    expect(screen.getByText('Sin número')).toBeInTheDocument();
  });
});

describe('threads', () => {
  it('lists colors, marks the active one and opens it in the counter', async () => {
    await seedProject();
    const { user, router } = renderApp('/threads');

    const active = await screen.findByRole('button', { name: /Negro/ });
    expect(active).toHaveTextContent('En uso');
    expect(active).toHaveTextContent('DMC 310 · sin empezar');

    await user.click(screen.getByRole('button', { name: /Rojo/ }));
    expect(await screen.findByRole('button', { name: /Rojo.*Cambiar/ })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/count');
  });

  it('edits and deletes a color', async () => {
    await seedProject();
    const { user } = renderApp('/threads');

    await user.click(await screen.findByRole('link', { name: 'Editar Rojo' }));
    const count = await screen.findByLabelText('Puntos contados');
    await user.clear(count);
    await user.type(count, '1248');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByText('DMC 321 · 1.248 puntos')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Editar Rojo' }));
    await user.click(await screen.findByRole('button', { name: 'Borrar este color' }));
    await user.click(await screen.findByRole('button', { name: 'Sí, borrar' }));

    expect(await screen.findByRole('heading', { name: 'Hilos' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Rojo/ })).not.toBeInTheDocument();
  });

  it('edits and deletes the project', async () => {
    await seedProject();
    const { user } = renderApp('/threads');

    await user.click(await screen.findByRole('link', { name: /Editar proyecto/ }));
    const name = await screen.findByLabelText('¿Cómo se llama?');
    await user.clear(name);
    await user.type(name, 'Jardín de primavera');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('Jardín de primavera')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /Editar proyecto/ }));
    await user.click(await screen.findByRole('button', { name: 'Borrar proyecto' }));
    await user.click(await screen.findByRole('button', { name: 'Sí, borrar' }));

    expect(await screen.findByText('Aún no tienes proyectos')).toBeInTheDocument();
  });
});

describe('review fixes', () => {
  it('returns to the counter without duplicating history after adding a color from it', async () => {
    const projectId = await seedProject();
    const { user, router } = renderApp('/count');

    await user.click(await screen.findByRole('button', { name: /Cambiar/ }));
    await user.click(await screen.findByRole('link', { name: /Añadir un color/ }));
    expect(router.state.location.pathname).toBe(`/projects/${projectId}/threads/new`);
    await user.click(await screen.findByRole('button', { name: 'Azul' }));
    await user.click(screen.getByRole('button', { name: 'Añadir Azul' }));
    await user.click(await screen.findByRole('button', { name: 'Contar con este color' }));

    expect(await screen.findByRole('button', { name: /Azul.*Cambiar/ })).toBeInTheDocument();
    expect(router.state.historyAction).toBe('POP');
    expect(router.state.location.pathname).toBe('/count');
  });

  it('refuses to save a blank count instead of wiping it', async () => {
    await seedProject();
    const { user } = renderApp('/threads');

    await user.click(await screen.findByRole('link', { name: 'Editar Negro' }));
    await user.clear(await screen.findByLabelText('Puntos contados'));
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Puede ser 0');
    expect(screen.getByRole('heading', { name: 'Editar color' })).toBeInTheDocument();
  });

  it('moves to the next field on Enter instead of submitting', async () => {
    const { user } = renderApp('/projects/new');

    await user.type(await screen.findByLabelText('¿Cómo se llama?'), 'Mantel{Enter}');

    expect(screen.getByLabelText('¿Cuántos puntos tiene?')).toHaveFocus();
    expect(await db.projects.count()).toBe(0);
  });

  it('accepts letter codes like B5200', async () => {
    const projectId = await seedProject();
    const { user } = renderApp(`/projects/${projectId}/threads/new`);

    await user.type(await screen.findByLabelText(/número del hilo/), 'b5200');

    expect(screen.getByRole('button', { name: 'Blanco' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('focuses Cancelar when asking to delete', async () => {
    await seedProject();
    const { user } = renderApp('/threads');

    await user.click(await screen.findByRole('link', { name: 'Editar Rojo' }));
    await user.click(await screen.findByRole('button', { name: 'Borrar este color' }));

    expect(await screen.findByRole('button', { name: 'Cancelar' })).toHaveFocus();
  });

  it('tells the user when a write fails', async () => {
    await seedProject();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { user } = renderApp('/count');
    const tap = await screen.findByRole('button', { name: 'Sumar un punto' });

    vi.spyOn(db, 'transaction').mockRejectedValueOnce(new Error('QuotaExceededError'));
    await user.click(tap);

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo guardar');
  });
});

async function expectCount(value: string) {
  await waitFor(() => {
    expect(screen.getByRole('status').firstChild?.textContent).toBe(value);
  });
}
