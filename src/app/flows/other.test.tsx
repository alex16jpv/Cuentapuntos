import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '@/test/renderApp';
import { expectStatus } from '@/test/seed';

describe('other', () => {
  it('goes straight to a ready counter', async () => {
    const { user } = renderApp('/projects/new');

    await user.click(await screen.findByRole('button', { name: /Otra cosa/ }));
    await user.type(screen.getByLabelText('¿Cómo se llama?'), 'Pulsera');
    await user.click(screen.getByRole('button', { name: 'Empezar a contar' }));

    const tap = await screen.findByRole('button', { name: 'Sumar un punto' });
    await user.click(tap);
    await expectStatus(/^1/);
    expect(screen.getByRole('button', { name: /Contador.*Cambiar/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contadores' })).toBeInTheDocument();
  });
});
