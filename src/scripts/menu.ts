// the mobile menu: open and close with the button, esc, a click outside or a link
import { byId } from './env';

let setMenu: (open: boolean) => void = () => undefined;

/** closes the mobile menu, safe to call when it is already closed */
export function closeMenu(): void {
  setMenu(false);
}

export function initMenu(): void {
  const header = byId('site-header');
  const nav = byId('primary-nav');
  const toggle = byId<HTMLButtonElement>('nav-toggle');
  const list = nav?.querySelector<HTMLElement>('.nav-list');
  if (!header || !nav || !toggle || !list) return;

  const isOpen = () => list.classList.contains('open');

  setMenu = (open: boolean) => {
    if (open === isOpen()) return;
    list.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    document.body.classList.toggle('menu-open', open);
    if (open) header.classList.remove('tucked');
  };

  toggle.addEventListener('click', () => setMenu(!isOpen()));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setMenu(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!isOpen() || !(target instanceof Node)) return;
    if (!list.contains(target) && !toggle.contains(target)) setMenu(false);
  });

  // a link inside the menu always closes it, also when it leaves the page
  list.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) setMenu(false);
  });

  // the full menu shows from 961px, so the mobile one must not stay open
  window.matchMedia('(min-width: 961px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });
}
