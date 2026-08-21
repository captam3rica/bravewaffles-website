import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bravewaffles.io',
  redirects: {
    '/terms': '/consistent-notes/terms',
    '/privacy': '/consistent-notes/privacy',
  },
});
