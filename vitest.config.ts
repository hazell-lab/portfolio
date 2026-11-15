/// <reference types="vitest/config" />
// tests run through astro's vite setup, so the @ alias and image imports work like in the site.
// plain logic runs in node; files that render react ask for jsdom with a comment at the top.
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    environment: 'node',
    setupFiles: ['tests/setup.ts'],
  },
});
