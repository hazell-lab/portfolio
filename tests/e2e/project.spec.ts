// project pages: contents, previous and next, related projects and the screenshot lightbox
import { expect, test } from '@playwright/test';
import { hydrated } from './helpers';

test('the contents list only names sections that exist', async ({ page }) => {
  for (const slug of ['streamix', 'hazstore', 'yes-halal']) {
    await page.goto(`/projects/${slug}/`);
    const links = page.locator('.case-toc a');
    for (const link of await links.all()) {
      const id = ((await link.getAttribute('href')) ?? '').slice(1);
      await expect(page.locator(`#${id}`), `${slug} #${id}`).toHaveCount(1);
    }
  }
});

test('a team project says what was my part', async ({ page }) => {
  await page.goto('/projects/yes-halal/');
  await expect(page.locator('#team')).toContainText('only the work I was responsible for');
  await expect(page.locator('.case-kicker')).toContainText('Team of 4');
});

test('previous and next go around the list', async ({ page }) => {
  await page.goto('/projects/streamix/');
  await expect(page.locator('a[rel="prev"]')).toContainText('IslandBar');
  await page.locator('a[rel="next"]').click();
  await expect(page).toHaveURL(/\/projects\/wavemusic\/$/);
  await expect(page.locator('h1')).toContainText('WaveMusic');
});

test('related projects link to other project pages', async ({ page }) => {
  await page.goto('/projects/kite/');
  const related = page.locator('.case-related-card');
  await expect(related).toHaveCount(2);
  for (const card of await related.all()) {
    await expect(card).toHaveAttribute('href', /^\/projects\/[a-z-]+\/$/);
    await expect(card).not.toHaveAttribute('href', '/projects/kite/');
  }
});

test('the lightbox opens, steps, closes with escape and returns focus', async ({ page }) => {
  await page.goto('/projects/streamix/');
  await hydrated(page, '.case-gallery');
  const openers = page.locator('.case-shot-expand');
  await expect(openers).toHaveCount(3);

  const first = openers.first();
  await first.scrollIntoViewIfNeeded();
  await first.click();

  const dialog = page.locator('dialog.lightbox');
  const count = dialog.locator('.lightbox-count');
  await expect(dialog).toBeVisible();
  await expect(count).toHaveText('Screenshot 1 of 3');
  const image = dialog.locator('.lightbox-figure img');
  await expect(image).toHaveAttribute('alt', /dune/);
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);

  await page.keyboard.press('ArrowRight');
  await expect(count).toHaveText('Screenshot 2 of 3');
  const previous = dialog.getByRole('button', { name: 'Previous screenshot' });
  await previous.click();
  await previous.click();
  await expect(count).toHaveText('Screenshot 3 of 3');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(first).toBeFocused();
  await expect(page.locator('body')).not.toHaveClass(/lightbox-open/);
});

test('the front end section explains how a featured project is built', async ({ page }) => {
  await page.goto('/projects/wavemusic/');
  await expect(page.locator('.case-toc a[href="#front-end"]')).toHaveText('How the front end works');
  await expect(page.locator('#front-end li').first()).toBeVisible();
});

test.describe('repository panel', () => {
  const repo = {
    full_name: 'hazell-lab/Streamix',
    html_url: 'https://github.com/hazell-lab/Streamix',
    description: null,
    language: 'TypeScript',
    pushed_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    default_branch: 'main',
    archived: false,
  };

  test('shows live details from the github api', async ({ page }) => {
    await page.route('https://api.github.com/repos/**', (route) => route.fulfill({ json: repo }));
    await page.goto('/projects/streamix/');
    await hydrated(page, '.repo-panel');
    const panel = page.locator('.repo-panel');
    await expect(panel).toContainText('2 days ago');
    await expect(panel).toContainText('TypeScript');
    await expect(panel.getByRole('link', { name: /commit history/i })).toHaveAttribute(
      'href',
      'https://github.com/hazell-lab/Streamix/commits/main',
    );
  });

  test('falls back to a plain link when github refuses', async ({ page }) => {
    await page.route('https://api.github.com/repos/**', (route) => route.fulfill({ status: 403, json: {} }));
    await page.goto('/projects/streamix/');
    await hydrated(page, '.repo-panel');
    const panel = page.locator('.repo-panel');
    await expect(panel).toContainText('GitHub is limiting requests');
    await expect(panel.getByRole('link', { name: /source code for streamix/i })).toHaveAttribute(
      'href',
      'https://github.com/hazell-lab/Streamix',
    );
  });
});

test('old .html case study addresses are listed for redirects', async ({ request }) => {
  // netlify does the redirect, here we only check the target pages exist
  for (const slug of ['streamix', 'wavemusic', 'yes-halal', 'clipnest']) {
    expect((await request.get(`/projects/${slug}/`)).status()).toBe(200);
  }
});
