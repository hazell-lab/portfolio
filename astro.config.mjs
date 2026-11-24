// astro config for the portfolio
// the site is fully static: every page is rendered to html at build time.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import { goatCounter, GOATCOUNTER_SCRIPT } from './src/lib/analytics.mjs';

// the public address of the site. set SITE_URL on netlify when the .com domain is ready,
// canonical urls, open graph urls and the sitemap all follow it.
const site = process.env.SITE_URL ?? 'https://hazimaqil-portfolio.netlify.app';

// page view counting, only when GOATCOUNTER_CODE is set on netlify (see src/lib/analytics.mjs)
const analytics = goatCounter(process.env.GOATCOUNTER_CODE);

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: {
    // /projects/streamix/ instead of /projects/streamix.html
    format: 'directory',
  },
  integrations: [
    // react renders the interactive islands: theme switch, project explorer, gallery, repo details, contact form.
    // everything else stays plain html with no javascript
    react(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  security: {
    // astro hashes every script and style it emits and writes a csp meta tag,
    // so no inline code runs unless it was part of the build
    csp: {
      directives: [
        "default-src 'self'",
        `img-src 'self' data:${analytics ? ` ${analytics.origin}` : ''}`,
        "font-src 'self'",
        // the repository panel on project pages reads public data from the github api
        // goatcounter sends each page view to its own server when it is turned on
        `connect-src 'self' https://api.github.com${analytics ? ` ${analytics.origin}` : ''}`,
        "form-action 'self'",
        "base-uri 'self'",
        "object-src 'none'",
      ],
      // the goatcounter script is the only script that comes from another server
      ...(analytics && { scriptDirective: { resources: ["'self'", GOATCOUNTER_SCRIPT] } }),
    },
  },
  markdown: { syntaxHighlight: false },
  // keep fonts and images as real files, inlined data: urls would break the font-src csp rule
  vite: { build: { assetsInlineLimit: 0 } },
  prefetch: {
    // project pages are small, fetch them when a link is hovered or focused
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
