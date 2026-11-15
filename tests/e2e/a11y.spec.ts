// automatic accessibility scan with axe, in both themes.
// reduced motion is on so every section is visible straight away and gets scanned.
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

const pages = ['/', '/projects/streamix/', '/projects/yes-halal/', '/projects/kite/', '/404.html'];

for (const scheme of ['light', 'dark'] as const) {
  for (const path of pages) {
    test(`${path} has no axe violations in ${scheme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      const summary = results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        targets: violation.nodes.slice(0, 5).map((node) => node.target.join(' ')),
      }));
      expect(summary).toEqual([]);
    });
  }
}
