// shared setup for the unit and component tests
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';

if (typeof window !== 'undefined') {
  const { cleanup } = await import('@testing-library/react');

  afterEach(() => {
    cleanup();
    sessionStorage.clear();
    localStorage.clear();
    history.replaceState(null, '', '/');
    vi.restoreAllMocks();
  });

  // jsdom has no matchMedia or IntersectionObserver, so these stand in for them
  window.matchMedia ??= (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;

  window.IntersectionObserver ??= class {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
}
