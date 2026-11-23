// astro config for the portfolio
// the site is fully static: every page is rendered to html at build time.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// the public address of the site. set SITE_URL on netlify when the .com domain is ready,
// canonical urls, open graph urls and the sitemap all follow it.
const site = process.env.SITE_URL ?? 'https://hazimaqil-portfolio.netlify.app';

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
        "img-src 'self' data:",
        "font-src 'self'",
        // the repository panel on project pages reads public data from the github api
        "connect-src 'self' https://api.github.com",
        "form-action 'self'",
        "base-uri 'self'",
        "object-src 'none'",
      ],
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
