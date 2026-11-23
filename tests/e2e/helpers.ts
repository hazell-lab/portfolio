import { expect, type Page } from '@playwright/test';

// shared bits for the end to end tests

export const projectSlugs = [
  'streamix',
  'wavemusic',
  'yes-halal',
  'clipnest',
  'hazstore',
  'hazcast',
  'hazfocus',
  'kite',
  'islandbar',
] as const;

/** waits until the react island that holds this element has hydrated (astro drops the ssr attribute then) */
export async function hydrated(page: Page, selector: string): Promise<void> {
  await page.locator(selector).first().scrollIntoViewIfNeeded();
  await expect(page.locator(`astro-island:has(${selector})`).first()).not.toHaveAttribute('ssr', /.*/);
}
