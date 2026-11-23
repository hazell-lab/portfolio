// the contact form. netlify forms only exists on the deployed site,
// so these tests answer the post themselves to check both the success and the failure path.
import { expect, test, type Page } from '@playwright/test';
import { hydrated } from './helpers';

async function fill(page: Page) {
  await page.fill('#name', 'Aina');
  await page.fill('#email', 'aina@example.com');
  await page.fill('#subject', 'Internship');
  await page.fill('#message', 'Hello, I would like to talk about an internship.');
}

async function answerPost(page: Page, status: number) {
  const bodies: string[] = [];
  await page.route('**/', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    bodies.push(route.request().postData() ?? '');
    return route.fulfill({ status, body: status === 200 ? 'ok' : 'error' });
  });
  return bodies;
}

test.beforeEach(async ({ page }) => {
  await page.goto('/#contact');
  await hydrated(page, '#contact-form');
});

test('netlify can find the form in the static html', async ({ page }) => {
  // the form people use is a react island, so a hidden copy with the same fields is what netlify detects
  const detection = page.locator('form[data-netlify="true"]');
  await expect(detection).toHaveCount(1);
  await expect(detection).toHaveAttribute('name', 'contact');
  await expect(detection).toHaveAttribute('netlify-honeypot', 'bot-field');
  await expect(detection).toBeHidden();
  for (const field of ['bot-field', 'name', 'email', 'subject', 'message']) {
    await expect(detection.locator(`[name="${field}"]`)).toHaveCount(1);
  }
});

test('the visible form posts to netlify, with a spam trap', async ({ page }) => {
  const form = page.locator('#contact-form');
  await expect(form).toHaveAttribute('name', 'contact');
  await expect(form).toHaveAttribute('method', 'POST');
  await expect(form.locator('input[name="form-name"]')).toHaveValue('contact');
  // the trap is moved off screen and hidden from screen readers and the tab order
  const trap = form.locator('input[name="bot-field"]');
  await expect(trap).toHaveAttribute('tabindex', '-1');
  await expect(form.locator('p:has(input[name="bot-field"])')).toHaveAttribute('aria-hidden', 'true');
  await expect(form.locator('p:has(input[name="bot-field"])')).toHaveClass(/visually-hidden/);
});

test('shows an error for each field and focuses the first one', async ({ page }) => {
  await page.locator('#form-submit').click();
  await expect(page.locator('#name')).toBeFocused();
  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#name')).toHaveAttribute('aria-describedby', 'name-error');
  await expect(page.locator('#name-error')).toHaveText('Please fill in your name.');
  await expect(page.locator('#email-error')).toHaveText('Please fill in your email.');
  await expect(page.locator('#form-status')).toHaveText('Please fix the highlighted fields.');

  // the error clears as soon as the field is fixed
  await page.fill('#name', 'Aina');
  await expect(page.locator('#name')).not.toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#name-error')).toHaveText('');
});

test('rejects a badly formed email', async ({ page }) => {
  await fill(page);
  await page.fill('#email', 'aina@example');
  await page.locator('#form-submit').click();
  await expect(page.locator('#email')).toBeFocused();
  await expect(page.locator('#email-error')).toContainText('valid email');
});

test('says sent only after the server accepts the message', async ({ page }) => {
  const bodies = await answerPost(page, 200);
  await fill(page);
  await page.locator('#form-submit').click();

  await expect(page.locator('#form-status')).toHaveText('Thanks, Aina! Your message was sent. I will reply soon.');
  await expect(page.locator('#form-status')).toHaveClass(/success/);
  await expect(page.locator('#name')).toHaveValue('');
  expect(bodies[0]).toContain('form-name=contact');
  expect(bodies[0]).toContain('email=aina%40example.com');
});

test('shows an error, keeps the text and never claims success when sending fails', async ({ page }) => {
  await answerPost(page, 500);
  await fill(page);
  await page.locator('#form-submit').click();

  const status = page.locator('#form-status');
  await expect(status).toHaveClass(/error/);
  await expect(status).toContainText('could not be sent');
  await expect(status).not.toContainText('was sent');
  await expect(page.locator('#message')).toHaveValue(/internship/);
  await expect(page.locator('#form-submit')).toBeEnabled();
});
