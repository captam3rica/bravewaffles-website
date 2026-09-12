// Dev-only: serves the Pagefind index at /pagefind during `astro dev`.
// `npm run build` generates the index into dist/pagefind, but the dev server
// never sees dist/, so ⌘K search would 404 without this middleware.

import fs from 'node:fs';
import path from 'node:path';

const CONTENT_TYPES: Record<string, string> = {
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
};

function contentTypeFor(file: string): string {
  return CONTENT_TYPES[path.extname(file)] ?? 'application/octet-stream';
}

export function pagefindMiddleware(root: string) {
  const resolvedRoot = path.resolve(root);
  return (req: { url?: string }, res: { statusCode: number; setHeader(k: string, v: string): void; end(chunk: string | Uint8Array): void }, next: () => void): void => {
    const url = req.url ?? '';
    if (!url.startsWith('/pagefind/')) return next();

    const file = path.resolve(resolvedRoot, url.slice('/pagefind/'.length));
    const inside = file === resolvedRoot || file.startsWith(resolvedRoot + path.sep);
    if (!inside || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Pagefind index not built. Run `npm run build` once so dev search can find it.');
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', contentTypeFor(file));
    res.end(fs.readFileSync(file));
  };
}

export function pagefindDevPlugin(options: { dir?: string } = {}) {
  const root = options.dir ?? path.resolve(process.cwd(), 'dist', 'pagefind');
  return {
    name: 'pagefind-dev',
    configureServer(server: { middlewares: { use: (fn: unknown) => void } }) {
      server.middlewares.use(pagefindMiddleware(root));
    },
  };
}