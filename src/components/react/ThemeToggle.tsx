// the light and dark switch in the header.
// its label always names the theme you will get, which is clearer than "toggle theme".
import { oppositeTheme } from '@/lib/theme';
import { useTheme } from '@/hooks/useTheme';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const next = theme ? oppositeTheme(theme) : null;

  return (
    <button
      className="theme-toggle"
      id="theme-toggle"
      type="button"
      // before react runs the theme is not known yet, so the label stays general
      aria-label={next ? `Switch to ${next} theme` : 'Switch theme'}
      onClick={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        toggle({
          origin: { x: event.clientX || box.left + box.width / 2, y: event.clientY || box.top + box.height / 2 },
          animate: !reducedMotion,
        });
      }}
    >
      <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 3.75a8.25 8.25 0 0 1 0 16.5z" fill="currentColor" />
      </svg>
      <span className="theme-label" aria-hidden="true">
        {next === 'dark' ? 'Dark' : next === 'light' ? 'Light' : 'Theme'}
      </span>
    </button>
  );
}
