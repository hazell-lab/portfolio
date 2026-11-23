// every page loads, has one h1, a description and no console errors
import { expect, test } from '@playwright/test';
import { projectSlugs } from './helpers';

const pages = ['/', ...projectSlugs.map((slug) => `/projects/${slug}/`)];

for (const path of pages) {
  test(`loads ${path} without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path}$`));
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });
}

test('unknown addresses get the 404 page', async ({ page }) => {
  const response = await page.goto('/this-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('does not exist');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

test('robots.txt and the sitemap are served', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('sitemap-index.xml');
  const sitemap = await request.get('/sitemap-0.xml');
  const xml = await sitemap.text();
  for (const slug of projectSlugs) expect(xml).toContain(`/projects/${slug}/`);
  expect(xml).not.toContain('404');
});

test('the resume download is a real pdf', async ({ page, request }) => {
  await page.goto('/');
  const href = await page.locator('a[download]').first().getAttribute('href');
  expect(href).toBeTruthy();
  const response = await request.get(href ?? '');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('pdf');
});

test('every link to another site opens safely in a new tab', async ({ page }) => {
  for (const path of ['/', '/projects/streamix/']) {
    await page.goto(path);
    const links = page.locator('a[href^="http"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const href = (await link.getAttribute('href')) ?? '';
      if (href.startsWith('http://localhost')) continue;
      await expect(link, href).toHaveAttribute('target', '_blank');
      await expect(link, href).toHaveAttribute('rel', /noopener/);
    }
  }
});

test('the social preview image exists', async ({ page, request }) => {
  await page.goto('/');
  const image = await page.locator('meta[property="og:image"]').getAttribute('content');
  const response = await request.get(new URL(image ?? '').pathname);
  expect(response.status()).toBe(200);
});
