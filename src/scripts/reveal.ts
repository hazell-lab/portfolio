// the hero intro and the gentle fade in of sections as they scroll into view.
// with reduced motion everything is shown at once.
import { prefersReducedMotion, root } from './env';

export function initIntro(): void {
  const start = () => root.classList.add('loaded');
  if (prefersReducedMotion() || !document.fonts) {
    start();
    return;
  }
  // wait for the fonts so the letters do not jump, but never longer than 1.2s
  void Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1200))]).then(start);
}

export function initReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>('.reveal');

  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    root.classList.add('no-reveal');
    elements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        const delay = element.dataset['delay'];
        if (delay) element.style.transitionDelay = `${delay}ms`;
        element.classList.add('visible');
        observer.unobserve(element);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );

  elements.forEach((element) => observer.observe(element));
}
