// the light and dark theme as react state.
// the inline script in the head picks the theme before the page paints,
// so this hook reads it from <html data-theme>, and writes it back there when it changes.
import { useCallback, useSyncExternalStore } from 'react';
import { oppositeTheme, resolveTheme, themeStorageKey, type Theme } from '@/lib/theme';

function readTheme(): Theme {
  return document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light';
}

function readSaved(): string | null {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch {
    return null;
  }
}

function save(theme: Theme): void {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // storage is blocked, the theme still works for this visit
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset['theme'] = theme;
}

function subscribe(onChange: () => void): () => void {
  // any change to data-theme, from this hook or anywhere else
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // follow the system setting while the visitor has not picked a theme
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystemChange = (event: MediaQueryListEvent) => applyTheme(resolveTheme(readSaved(), event.matches));
  system.addEventListener('change', onSystemChange);

  return () => {
    observer.disconnect();
    system.removeEventListener('change', onSystemChange);
  };
}

export interface ThemeChangeOptions {
  /** where the circle wipe starts, usually the button that was pressed */
  origin?: { x: number; y: number };
  animate?: boolean;
}

export function useTheme() {
  // null on the server, where the theme is not known yet
  const theme = useSyncExternalStore<Theme | null>(subscribe, readTheme, () => null);

  const setTheme = useCallback((next: Theme, options: ThemeChangeOptions = {}) => {
    save(next);
    const root = document.documentElement;
    const canAnimate = options.animate !== false && typeof document.startViewTransition === 'function' && !document.hidden;

    if (!canAnimate || root.classList.contains('theme-switching')) {
      applyTheme(next);
      return;
    }

    // a circle that grows from the button, drawn with a view transition
    const { x, y } = options.origin ?? { x: innerWidth / 2, y: 0 };
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.classList.add('theme-switching');
    const transition = document.startViewTransition(() => applyTheme(next));

    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 600, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
        );
      })
      .catch(() => undefined);

    void transition.finished
      .catch(() => undefined)
      .then(() => {
        root.classList.remove('theme-switching');
        if (readTheme() !== next) applyTheme(next);
      });
  }, []);

  const toggle = useCallback(
    (options?: ThemeChangeOptions) => setTheme(oppositeTheme(readTheme()), options),
    [setTheme],
  );

  return { theme, setTheme, toggle };
}
