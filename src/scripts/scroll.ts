// everything that follows the scroll position: smooth jumps to sections,
// the header state, the back to top button and the active menu link.
import { byId, headerOffset, scrollBehavior } from './env';
import { closeMenu } from './menu';

/** scroll to an element below the header, and move keyboard focus there too */
export function scrollToTarget(target: HTMLElement, hash: string): void {
  const top = hash === '#home' || hash === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - headerOffset();
  window.scrollTo({ top, behavior: scrollBehavior() });

  // focus the target so the next tab press starts there, without a second jump
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

function initSmoothScroll(): void {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
    const hash = link?.getAttribute('href');
    if (!link || !hash || hash === '#' || hash === '#main') return;

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;

    event.preventDefault();
    closeMenu();
    scrollToTarget(target, hash);
    history.replaceState(null, '', hash);
  });
}

/** the home page marks the link of the section you are reading */
function createScrollSpy(): () => void {
  if (document.body.dataset['page'] !== 'home') return () => undefined;

  const links = [...document.querySelectorAll<HTMLAnchorElement>('.nav-link[data-section]')];
  const sections = links
    .map((link) => document.getElementById(link.dataset['section'] ?? ''))
    .filter((section): section is HTMLElement => section !== null);

  return () => {
    const line = window.scrollY + window.innerHeight * 0.35;
    let current = 'home';
    for (const section of sections) {
      if (line >= section.getBoundingClientRect().top + window.scrollY) current = section.id;
    }
    for (const link of links) {
      const active = link.dataset['section'] === current;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
}

export function initScroll(): void {
  initSmoothScroll();

  const header = byId('site-header');
  const backToTop = byId<HTMLButtonElement>('back-to-top');
  const updateSpy = createScrollSpy();
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    if (header) {
      const menuOpen = document.body.classList.contains('menu-open');
      header.classList.toggle('scrolled', y > 24);
      // hide the header while scrolling down, bring it back when scrolling up
      header.classList.toggle('tucked', y > lastY && y > 400 && !menuOpen && !header.contains(document.activeElement));
    }
    lastY = y;

    if (backToTop) {
      backToTop.classList.toggle('visible', y > 600);
      backToTop.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : '0');
    }

    updateSpy();
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true },
  );
  window.addEventListener('resize', updateSpy);

  // keyboard focus inside the header always shows it
  header?.addEventListener('focusin', () => header.classList.remove('tucked'));

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    // send focus to the top of the page so keyboard users start again from there
    byId('main')?.focus({ preventScroll: true });
  });

  update();
}
