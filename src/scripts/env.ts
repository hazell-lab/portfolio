// small shared helpers for the browser scripts

export const root = document.documentElement;

/** true when the visitor asked the system for less motion */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** view transitions are a nice extra, only used when the browser has them and motion is ok */
export function canAnimateViews(): boolean {
  return typeof document.startViewTransition === 'function' && !prefersReducedMotion() && !document.hidden;
}

export function byId<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/** the header height, so scrolling to a section does not hide it under the header */
export function headerOffset(): number {
  const header = byId('site-header');
  return header ? header.offsetHeight - 1 : 0;
}

export function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth';
}
