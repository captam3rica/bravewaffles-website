import { defineConfig } from 'astro/config';
import rehypeShortcutPills from './src/lib/rehype-shortcut-pills.ts';
import { pagefindDevPlugin } from './src/lib/pagefind-dev.ts';

export default defineConfig({
  site: 'https://bravewaffles.io',
  markdown: {
    rehypePlugins: [rehypeShortcutPills],
  },
  vite: {
    plugins: [pagefindDevPlugin()],
  },
  redirects: {
    '/terms': '/consistent-notes/terms',
    '/privacy': '/consistent-notes/privacy',
  },
});
