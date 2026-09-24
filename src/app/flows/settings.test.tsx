import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getPreferences } from '@/data/preferences';
import { renderApp } from '@/test/renderApp';

describe('settings', () => {
  it('makes the text bigger across the app and remembers it', async () => {
    const { user } = renderApp('/');

    await user.click(await screen.findByRole('link', { name: /Ajustes/ }));
    expect(await screen.findByRole('radio', { name: /Normal/ })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    await user.click(screen.getByRole('radio', { name: /Muy grande/ }));

    await waitFor(() => expect(document.documentElement.style.fontSize).toBe('130%'));
    expect(screen.getByRole('radio', { name: /Muy grande/ })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect((await getPreferences()).textScale).toBe('extra');
    expect(localStorage.getItem('mis-labores:text-scale')).toBe('extra');
  });
});
