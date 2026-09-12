import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pagefindMiddleware } from './pagefind-dev';

function tmpDist() {
  const dir = mkdtempSync(join(tmpdir(), 'pagefind-test-'));
  afterEach(() => {
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  });
  return dir;
}

describe('pagefind dev middleware', () => {
  it('serves pagefind assets from the given directory', () => {
    const dir = tmpDist();
    writeFileSync(join(dir, 'pagefind.js'), 'export const search = () => {};');
    let status = 0;
    let type = '';
    let body = '';
    pagefindMiddleware(dir)(
      { url: '/pagefind/pagefind.js' },
      {
        statusCode: 0,
        setHeader(k: string, v: string) {
          if (k === 'Content-Type') type = v;
        },
        end(chunk: unknown) {
          status = this.statusCode;
          body = String(chunk);
        },
      },
      () => {
        throw new Error('next should not be called');
      },
    );
    expect(status).toBe(200);
    expect(type).toBe('application/javascript');
    expect(body).toBe('export const search = () => {};');
  });

  it('serves nested assets', () => {
    const dir = tmpDist();
    writeFileSync(join(dir, 'wasm.en.pagefind'), 'binary');
    let status = 0;
    pagefindMiddleware(dir)(
      { url: '/pagefind/wasm.en.pagefind' },
      {
        statusCode: 0,
        setHeader() {},
        end() {
          status = this.statusCode;
        },
      },
      () => {
        throw new Error('next should not be called');
      },
    );
    expect(status).toBe(200);
  });

  it('maps content types by extension', () => {
    const dir = tmpDist();
    writeFileSync(join(dir, 'foo.wasm'), 'binary');
    let status = 0;
    let type = '';
    pagefindMiddleware(dir)(
      { url: '/pagefind/foo.wasm' },
      {
        statusCode: 0,
        setHeader(k: string, v: string) {
          if (k === 'Content-Type') type = v;
        },
        end() {
          status = this.statusCode;
        },
      },
      () => {
        throw new Error('next should not be called');
      },
    );
    expect(status).toBe(200);
    expect(type).toBe('application/wasm');
  });

  it('404s with a helpful message when the index is missing', () => {
    const dir = tmpDist();
    let status = 0;
    let body = '';
    pagefindMiddleware(dir)(
      { url: '/pagefind/pagefind.js' },
      {
        statusCode: 0,
        setHeader() {},
        end(chunk: string) {
          status = this.statusCode;
          body = chunk;
        },
      },
      () => {
        throw new Error('next should not be called');
      },
    );
    expect(status).toBe(404);
    expect(body).toContain('npm run build');
  });

  it('404s on missing files even when the index exists', () => {
    const dir = tmpDist();
    writeFileSync(join(dir, 'pagefind.js'), 'x');
    let status = 0;
    pagefindMiddleware(dir)(
      { url: '/pagefind/nope.js' },
      {
        statusCode: 0,
        setHeader() {},
        end() {
          status = this.statusCode;
        },
      },
      () => {
        throw new Error('next should not be called');
      },
    );
    expect(status).toBe(404);
  });

  it('blocks path traversal outside the pagefind directory', () => {
    const dir = tmpDist();
    writeFileSync(join(dir, 'secret.txt'), 'secret');
    let status = 0;
    pagefindMiddleware(dir)(
      { url: '/pagefind/../secret.txt' },
      {
        statusCode: 0,
        setHeader() {},
        end() {
          status = this.statusCode;
        },
      },
      () => {
        throw new Error('next should not be called');
      },
    );
    expect(status).toBe(404);
  });

  it('calls next for non-pagefind paths', () => {
    const dir = tmpDist();
    let called = false;
    pagefindMiddleware(dir)({ url: '/somewhere-else' }, {} as never, () => {
      called = true;
    });
    expect(called).toBe(true);
  });
});