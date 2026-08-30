import { defineConfig } from 'astro/config';
import rehypeShortcutPills from './src/lib/rehype-shortcut-pills.ts';

export default defineConfig({
  site: 'https://bravewaffles.io',
  markdown: {
    rehypePlugins: [rehypeShortcutPills],
  },
  redirects: {
    '/terms': '/consistent-notes/terms',
    '/privacy': '/consistent-notes/privacy',
  },
});
