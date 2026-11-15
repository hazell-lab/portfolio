// theme rules shared by the head script, the toggle and the tests.

export type Theme = 'light' | 'dark';

export const themeStorageKey = 'theme';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

/** a saved choice wins, otherwise follow the system setting */
export function resolveTheme(saved: unknown, systemPrefersDark: boolean): Theme {
  if (isTheme(saved)) {
    return saved;
  }
  return systemPrefersDark ? 'dark' : 'light';
}

export function oppositeTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}
