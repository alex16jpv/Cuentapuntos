import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '@/test/renderApp';
import { expectStatus, seedEmbroidery } from '@/test/seed';

describe('embroidery', () => {
  it('first run: create a project, add a color and count', async () => {
    const { user, router } = renderApp('/');

    expect(await screen.findByText('¡Hola!')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /Crear mi primer proyecto/ }));
    await user.click(await screen.findByRole('button', { name: /Bordado/ }));

    await user.click(await screen.findByRole('button', { name: 'Empezar a bordar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Escribe un nombre');
    await user.type(screen.getByLabelText('¿Cómo se llama?'), 'Mantel de flores');
    await user.type(screen.getByLabelText('¿Cuántos puntos tiene?'), '2.400');
    await user.click(screen.getByRole('button', { name: 'Empezar a bordar' }));

    expect(await screen.findByRole('heading', { name: 'Añadir un color' })).toBeInTheDocument();
    expect(screen.getByText('Primero elige un color')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Rojo' }));
    expect(screen.getByLabelText(/número del hilo/)).toHaveValue('321');
    await user.type(screen.getByLabelText(/Cuántos puntos de este color/), '10');
    await user.click(screen.getByRole('button', { name: 'Añadir Rojo' }));

    expect(await screen.findByText(/Añadiste/)).toHaveTextContent(
      'Añadiste Rojo (DMC 321) a Mantel de flores.',
    );
    await user.click(screen.getByRole('button', { name: 'Empezar a contar' }));

    const tap = await screen.findByRole('button', { name: 'Sumar un punto' });
    await user.click(tap);
    await user.click(tap);
    await user.click(tap);
    expect(await screen.findByText('de 10 puntos')).toBeInTheDocument();
    await expectStatus(/^3/);

    await user.click(screen.getByRole('button', { name: /Quitar uno/ }));
    await expectStatus(/^2/);

    await user.click(screen.getByRole('button', { name: 'Pausar' }));
    await user.click(await screen.findByRole('button', { name: 'Contador en pausa' }));
    await expectStatus(/^2/);
    expect(screen.getByRole('button', { name: /Quitar uno/ })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Seguir contando' }));

    await user.click(screen.getByRole('link', { name: 'Proyectos' }));
    expect(router.state.location.pathname).toBe('/');
    const card = await screen.findByRole('button', { name: /Mantel de flores/ });
    expect(card).toHaveTextContent('Bordado');
    expect(card).toHaveTextContent('2 puntos');
    expect(card).toHaveTextContent('0%');
  });

  it('switches the active color from the sheet', async () => {
    await seedEmbroidery();
    const { user } = renderApp('/count');

    await user.click(await screen.findByRole('button', { name: /Negro.*Cambiar/ }));
    const sheet = await screen.findByRole('dialog', { name: '¿Qué color vas a usar?' });
    await user.click(within(sheet).getByRole('button', { name: /Rojo/ }));

    expect(await screen.findByRole('button', { name: /Rojo.*Cambiar/ })).toBeInTheDocument();
    expect(screen.getByText('de 2.400 puntos')).toBeInTheDocument();
  });

  it('lists colors in the Colores tab and opens one in the counter', async () => {
    await seedEmbroidery();
    const { user, router } = renderApp('/parts');

    expect(await screen.findByRole('heading', { name: 'Colores' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Colores' })).toBeInTheDocument();
    const active = screen.getByRole('button', { name: /Negro/ });
    expect(active).toHaveTextContent('En uso');
    expect(active).toHaveTextContent('DMC 310 · sin empezar');

    await user.click(screen.getByRole('button', { name: /Rojo/ }));
    expect(await screen.findByRole('button', { name: /Rojo.*Cambiar/ })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/count');
  });

  it('accepts letter codes like B5200', async () => {
    const projectId = await seedEmbroidery();
    const { user } = renderApp(`/projects/${projectId}/parts/new`);

    await user.type(await screen.findByLabelText(/número del hilo/), 'b5200');

    expect(screen.getByRole('button', { name: 'Blanco' })).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('project creation history', () => {
  it('Back from the counter after creating a project returns to the projects list', async () => {
    const { user, router } = renderApp('/');

    await user.click(await screen.findByRole('link', { name: /Crear mi primer proyecto/ }));
    await user.click(await screen.findByRole('button', { name: /Otra cosa/ }));
    await user.click(screen.getByRole('button', { name: 'Volver' }));
    expect(await screen.findByRole('heading', { name: '¿Qué vas a hacer?' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Otra cosa/ }));
    await user.type(screen.getByLabelText('¿Cómo se llama?'), 'Pulsera');
    await user.click(screen.getByRole('button', { name: 'Empezar a contar' }));
    await screen.findByRole('button', { name: 'Sumar un punto' });

    await router.navigate(-1);
    expect(await screen.findByRole('heading', { name: '¿Qué hacemos hoy?' })).toBeInTheDocument();
  });
});
