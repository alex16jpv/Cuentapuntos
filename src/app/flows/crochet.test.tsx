import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { db } from '@/data/db';
import { renderApp } from '@/test/renderApp';
import { expectRowStitches, expectStatus, piece, seedCrochet } from '@/test/seed';

describe('crochet', () => {
  it('creates a doll with two arms and counts rows', async () => {
    const { user } = renderApp('/projects/new');

    await user.click(await screen.findByRole('button', { name: /Ganchillo/ }));
    expect(screen.queryByLabelText('¿Cuántos puntos tiene?')).not.toBeInTheDocument();
    await user.type(screen.getByLabelText('¿Cómo se llama?'), 'Osito');
    await user.click(screen.getByRole('button', { name: 'Empezar a tejer' }));

    expect(await screen.findByRole('heading', { name: 'Añadir una pieza' })).toBeInTheDocument();
    expect(screen.getByText('Primero escribe un nombre')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Brazo' }));
    await user.click(screen.getByRole('button', { name: 'Una más' }));
    expect(screen.getByText('Se añadirán: Brazo 1 y Brazo 2.')).toBeInTheDocument();
    await user.type(screen.getByLabelText(/Cuántas vueltas tiene/), '2');
    await user.click(screen.getByRole('button', { name: 'Añadir 2 piezas' }));

    expect(await screen.findByText(/Añadiste/)).toHaveTextContent(
      'Añadiste Brazo 1 y Brazo 2 a Osito.',
    );
    await user.click(screen.getByRole('button', { name: 'Empezar a contar' }));

    expect(await screen.findByText('Estás tejiendo')).toBeInTheDocument();
    await expectStatus(/Vuelta\s*1\s*de 2/);
    const tap = screen.getByRole('button', { name: 'Sumar un punto' });
    await user.click(tap);
    await user.click(tap);
    await expectRowStitches('2 puntos en esta vuelta');

    await user.click(screen.getByRole('button', { name: 'Terminé la vuelta 1' }));
    await expectStatus(/Vuelta\s*2\s*de 2/);
    await expectRowStitches('0 puntos en esta vuelta');

    await user.click(screen.getByRole('button', { name: /Quitar uno/ }));
    await expectStatus(/Vuelta\s*1\s*de 2/);
    await expectRowStitches('2 puntos en esta vuelta');

    await user.click(screen.getByRole('button', { name: 'Terminé la vuelta 1' }));
    await user.click(await screen.findByRole('button', { name: 'Terminé la vuelta 2' }));

    expect(await screen.findByText('¡Terminaste Brazo 1!')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sumar un punto' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Seguir con Brazo 2' }));
    expect(await screen.findByRole('button', { name: /Brazo 2.*Cambiar/ })).toBeInTheDocument();
    await expectStatus(/Vuelta\s*1\s*de 2/);

    await user.click(screen.getByRole('link', { name: 'Piezas' }));
    const done = await screen.findByRole('button', { name: /Brazo 1/ });
    expect(done).toHaveTextContent('Terminada');
    expect(screen.getByRole('button', { name: /Brazo 2/ })).toHaveTextContent('En uso');

    await user.click(screen.getByRole('link', { name: 'Proyectos' }));
    const card = await screen.findByRole('button', { name: /Osito/ });
    expect(card).toHaveTextContent('Ganchillo');
    expect(card).toHaveTextContent('1 de 2 piezas terminadas');
    expect(card).toHaveTextContent('50%');
  });

  it('"Todo es una pieza" uses the project name', async () => {
    const projectId = await seedCrochet([]);
    const { user } = renderApp(`/projects/${projectId}/parts/new`);

    await user.click(await screen.findByRole('button', { name: 'Todo es una pieza' }));
    expect(screen.getByLabelText('O escribe otro nombre')).toHaveValue('Osito');
    await user.click(screen.getByRole('button', { name: 'Añadir Osito' }));
    expect(await screen.findByText(/Añadiste/)).toBeInTheDocument();
  });

  it('a finished piece can get one more row', async () => {
    await seedCrochet([piece('Cabeza', 1)]);
    const { user } = renderApp('/count');

    await user.click(await screen.findByRole('button', { name: 'Terminé la vuelta 1' }));
    expect(await screen.findByText('¡Terminaste Cabeza!')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver mis piezas' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Me falta otra vuelta' }));
    await expectStatus(/Vuelta\s*2\s*de 2/);
  });

  it('switching pieces uses the piece sheet', async () => {
    await seedCrochet();
    const { user } = renderApp('/count');

    await user.click(await screen.findByRole('button', { name: /Cambiar de pieza/ }));
    const sheet = await screen.findByRole('dialog', { name: '¿Qué pieza vas a tejer?' });
    expect(within(sheet).getByRole('link', { name: /Añadir una pieza/ })).toBeInTheDocument();
    await user.click(within(sheet).getByRole('button', { name: /Cuerpo/ }));
    expect(await screen.findByRole('button', { name: /Cuerpo.*Cambiar/ })).toBeInTheDocument();
  });

  it('corrects finished rows when editing a piece', async () => {
    await seedCrochet([piece('Cabeza', 10)]);
    const { user } = renderApp('/parts');

    await user.click(await screen.findByRole('link', { name: 'Editar Cabeza' }));
    const rows = await screen.findByLabelText('Vueltas terminadas');
    await user.clear(rows);
    await user.type(rows, '4');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByText('Vuelta 5 de 10')).toBeInTheDocument();
    const [part] = await db.parts.toArray();
    expect(part?.rowHistory).toHaveLength(4);
  });
});

describe('knitting', () => {
  it('talks about rows (filas) instead of rounds', async () => {
    const { user } = renderApp('/projects/new');

    await user.click(await screen.findByRole('button', { name: /^Punto/ }));
    await user.type(screen.getByLabelText('¿Cómo se llama?'), 'Bufanda');
    await user.click(screen.getByRole('button', { name: 'Empezar a tejer' }));
    await user.click(await screen.findByRole('button', { name: 'Todo es una pieza' }));
    await user.type(screen.getByLabelText(/Cuántas filas tiene/), '100');
    await user.click(screen.getByRole('button', { name: 'Añadir Bufanda' }));
    await user.click(await screen.findByRole('button', { name: 'Empezar a contar' }));

    await expectStatus(/Fila\s*1\s*de 100/);
    expect(screen.getByRole('button', { name: 'Terminé la fila 1' })).toBeInTheDocument();
  });
});
