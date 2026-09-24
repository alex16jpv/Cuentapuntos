import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '@/test/renderApp';
import { seedEmbroidery } from '@/test/seed';

describe('editing', () => {
  it('edits and deletes a color', async () => {
    await seedEmbroidery();
    const { user } = renderApp('/parts');

    await user.click(await screen.findByRole('link', { name: 'Editar Rojo' }));
    const count = await screen.findByLabelText('Puntos contados');
    await user.clear(count);
    await user.type(count, '1248');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('DMC 321 · 1.248 puntos')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Editar Rojo' }));
    await user.click(await screen.findByRole('button', { name: 'Borrar este color' }));
    expect(await screen.findByRole('button', { name: 'Cancelar' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Sí, borrar' }));

    expect(await screen.findByRole('heading', { name: 'Colores' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Rojo/ })).not.toBeInTheDocument();
  });

  it('refuses to save a blank count instead of wiping it', async () => {
    await seedEmbroidery();
    const { user } = renderApp('/parts');

    await user.click(await screen.findByRole('link', { name: 'Editar Negro' }));
    await user.clear(await screen.findByLabelText('Puntos contados'));
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Puede ser 0');
    expect(screen.getByRole('heading', { name: 'Editar color' })).toBeInTheDocument();
  });

  it('edits and deletes the project', async () => {
    await seedEmbroidery();
    const { user } = renderApp('/parts');

    await user.click(await screen.findByRole('link', { name: /Cambiar nombre o borrar proyecto/ }));
    const name = await screen.findByLabelText('¿Cómo se llama?');
    await user.clear(name);
    await user.type(name, 'Jardín de primavera');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('Jardín de primavera')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /Cambiar nombre o borrar proyecto/ }));
    await user.click(await screen.findByRole('button', { name: 'Borrar proyecto' }));
    await user.click(await screen.findByRole('button', { name: 'Sí, borrar' }));

    expect(await screen.findByText('¡Hola!')).toBeInTheDocument();
  });

  it('returns to the counter without duplicating history after adding from it', async () => {
    const projectId = await seedEmbroidery();
    const { user, router } = renderApp('/count');

    await user.click(await screen.findByRole('button', { name: /Cambiar/ }));
    await user.click(await screen.findByRole('link', { name: /Añadir un color/ }));
    expect(router.state.location.pathname).toBe(`/projects/${projectId}/parts/new`);
    await user.click(await screen.findByRole('button', { name: 'Azul' }));
    await user.click(screen.getByRole('button', { name: 'Añadir Azul' }));
    await user.click(await screen.findByRole('button', { name: 'Empezar a contar' }));

    expect(await screen.findByRole('button', { name: /Azul.*Cambiar/ })).toBeInTheDocument();
    expect(router.state.historyAction).toBe('POP');
  });
});
