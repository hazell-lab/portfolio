// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '@/components/react/ThemeToggle';
import { themeStorageKey } from '@/lib/theme';

beforeEach(() => {
  document.documentElement.dataset['theme'] = 'light';
});

describe('ThemeToggle', () => {
  it('names the theme it will switch to', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument();
  });

  it('switches the theme, saves the choice and updates its label', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(localStorage.getItem(themeStorageKey)).toBe('dark');
    expect(await screen.findByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('follows a theme change made somewhere else on the page', async () => {
    render(<ThemeToggle />);
    document.documentElement.dataset['theme'] = 'dark';
    expect(await screen.findByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });
});
