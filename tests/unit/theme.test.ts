import { describe, expect, it } from 'vitest';
import { isTheme, oppositeTheme, resolveTheme } from '@/lib/theme';

describe('theme rules', () => {
  it('a saved choice wins over the system setting', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('follows the system setting when nothing valid is saved', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme('purple', false)).toBe('light');
  });

  it('knows the two themes and flips between them', () => {
    expect(isTheme('dark')).toBe(true);
    expect(isTheme('DARK')).toBe(false);
    expect(oppositeTheme('dark')).toBe('light');
    expect(oppositeTheme('light')).toBe('dark');
  });
});
