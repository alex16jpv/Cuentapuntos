import { screen, waitFor } from '@testing-library/react';
import { expect } from 'vitest';
import { addParts, type PartInput } from '@/data/parts';
import { createProject } from '@/data/projects';

export const RED: PartInput = {
  name: 'Rojo',
  hex: '#C72B3B',
  code: '321',
  target: 2400,
  rowTarget: null,
};
export const BLACK: PartInput = {
  name: 'Negro',
  hex: '#1E1B1A',
  code: '310',
  target: null,
  rowTarget: null,
};

export function piece(name: string, rowTarget: number | null = null): PartInput {
  return { name, hex: null, code: null, target: null, rowTarget };
}

export async function seedEmbroidery() {
  const projectId = await createProject({
    name: 'Jardín de invierno',
    technique: 'embroidery',
    target: null,
  });
  await addParts(projectId, [RED]);
  await addParts(projectId, [BLACK]);
  return projectId;
}

export async function seedCrochet(parts: PartInput[] = [piece('Cabeza', 2), piece('Cuerpo', 3)]) {
  const projectId = await createProject({ name: 'Osito', technique: 'crochet', target: null });
  await addParts(projectId, parts);
  return projectId;
}

export async function expectStatus(text: string | RegExp) {
  await waitFor(() => {
    expect(screen.getByRole('status')).toHaveTextContent(text);
  });
}

export async function expectRowStitches(text: string) {
  await expectStatus(text);
}
