// the home page: navigation, theme and the project filter
import { expect, test } from '@playwright/test';
import { hydrated } from './helpers';

test.describe('theme', () => {
  test('follows the system setting, then remembers the choice across pages', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    const toggle = page.locator('#theme-toggle');
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to light theme');
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to dark theme');

    await page.goto('/projects/kite/');
    await expect(html).toHaveAttribute('data-theme', 'light');
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('project filter', () => {
  test('filters by type and keeps the choice in the address', async ({ page }) => {
    await page.goto('/#projects');
    await hydrated(page, '.project-filters');
    const visible = page.locator('.project-card:visible');
    await expect(visible).toHaveCount(9);

    const desktop = page.locator('.filter-btn[data-filter="desktop"]');
    await desktop.click();
    await expect(desktop).toHaveAttribute('aria-pressed', 'true');
    await expect(visible).toHaveCount(3);
    for (const card of await visible.all()) await expect(card).toHaveAttribute('data-category', 'desktop');
    await expect(page).toHaveURL(/\?filter=desktop/);
    await expect(page.locator('#filter-status')).toHaveText('Showing 3 projects');

    // the contents list follows the filter
    await expect(page.locator('.project-contents li:visible')).toHaveCount(3);

    await page.locator('.filter-btn[data-filter="all"]').click();
    await expect(visible).toHaveCount(9);
    await expect(page).not.toHaveURL(/filter=/);
  });

  test('restores a shared filtered link', async ({ page }) => {
    await page.goto('/?filter=mobile');
    await hydrated(page, '.project-filters');
    await expect(page.locator('.project-card:visible')).toHaveCount(1);
    await expect(page.locator('.filter-btn[data-filter="mobile"]')).toHaveAttribute('aria-pressed', 'true');
  });

  test('featured front-end projects come first, supporting desktop work last', async ({ page }) => {
    await page.goto('/#projects');
    await expect(page.locator('.projects-featured .project-title-link')).toHaveText([
      'Streamix',
      'WaveMusic',
      'HazStore',
      'HazFocus',
    ]);
    await expect(page.locator('.projects-supporting .project-card')).toHaveCount(3);
  });

  test('ignores a filter value it does not know', async ({ page }) => {
    await page.goto('/?filter=<b>x</b>');
    await hydrated(page, '.project-filters');
    await expect(page.locator('.project-card:visible')).toHaveCount(9);
  });
});

test.describe('navigation', () => {
  test.skip(({ isMobile }) => isMobile, 'the mobile menu has its own test');

  test('a menu link scrolls to its section and marks it', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-link[data-section="education"]').click();
    await expect(page).toHaveURL(/#education$/);
    await expect(page.locator('#education')).toBeInViewport();
    await expect(page.locator('.nav-link[data-section="education"]')).toHaveAttribute('aria-current', 'location');
  });

  test('each project card opens its own page', async ({ page }) => {
    await page.goto('/');
    await page.locator('#project-clipnest .project-title-link').click();
    await expect(page).toHaveURL(/\/projects\/clipnest\/$/);
    await expect(page.locator('h1')).toContainText('ClipNest');
  });

  test('the skip link moves focus to the main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });
});

test.describe('mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'only on small screens');

  test('opens, closes with escape and closes after picking a link', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('#nav-toggle');
    const list = page.locator('.nav-list');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(list).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();

    await toggle.click();
    await page.locator('.nav-link[data-section="contact"]').click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page).toHaveURL(/#contact$/);
  });
});
