// the one script every page loads, for the small parts that do not need react.
// each part checks for its own elements, so a page without them simply skips that part.
// the theme switch, project filter, gallery and contact form are react islands in src/components/react.
import { initMenu } from './menu';
import { initScroll } from './scroll';
import { initIntro, initReveal } from './reveal';
import { initClock } from './clock';

const parts: [string, () => void][] = [
  ['menu', initMenu],
  ['scroll', initScroll],
  ['intro', initIntro],
  ['reveal', initReveal],
  ['clock', initClock],
];

for (const [name, init] of parts) {
  try {
    init();
  } catch (error) {
    // one broken part should not stop the others
    console.error(`could not start ${name}`, error);
  }
}
