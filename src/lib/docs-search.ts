// Client-side docs search. The button is server-rendered; everything else
// happens here: lazy Pagefind load, dialog control, ⌘K, and result rendering.
// "Pagefind" ships its own types via the pagefind npm package's generated
// client, but we load it dynamically from /pagefind/pagefind.js, so declare
// the small surface we use.

interface PagefindResult {
  data: () => Promise<{ url: string; excerpt: string; meta: { title: string } }>;
}
interface Pagefind {
  search: (q: string) => Promise<{ results: PagefindResult[] }>;
}

let pagefind: Pagefind | null = null;
let loading: Promise<Pagefind> | null = null;

// Non-literal specifier so Rollup leaves this as a runtime import
// (a literal would fail the client build: the file only exists in dist/).
const pagefindUrl = '/pagefind/pagefind.js';

export function loadPagefind(): Promise<Pagefind> {
  if (pagefind) return Promise.resolve(pagefind);
  if (loading) return loading;
  loading = import(/* @vite-ignore */ pagefindUrl).then((m: any) => {
    pagefind = m as Pagefind;
    return pagefind;
  });
  return loading;
}

export async function runSearch(q: string): Promise<{ url: string; excerpt: string; title: string }[]> {
  const pf = await loadPagefind();
  const res = await pf.search(q);
  const data = await Promise.all(res.results.slice(0, 8).map((r) => r.data()));
  return data.map((d) => ({ url: d.url, excerpt: d.excerpt, title: d.meta.title }));
}

export function initSearch(): void {
  const btn = document.getElementById('docs-search-open');
  const dialog = document.getElementById('docs-search-dialog') as HTMLDialogElement | null;
  const input = document.getElementById('docs-search-input') as HTMLInputElement | null;
  const resultsEl = document.getElementById('docs-search-results');
  if (!btn || !dialog || !input || !resultsEl) return;

  let selectedIndex = 0;
  let results: { url: string; excerpt: string; title: string }[] = [];
  let debounce: ReturnType<typeof setTimeout> | undefined;

  function renderResults() {
    if (!results.length) {
      resultsEl!.innerHTML = '<p class="docs-search-empty">No results. Try a different search.</p>';
      return;
    }
    resultsEl!.innerHTML = results
      .map(
        (r, i) => `
        <a class="docs-search-result" href="${r.url}" data-index="${i}"
           aria-selected="${i === selectedIndex}">
          <span class="url">${r.title}</span>
          <span class="excerpt">${r.excerpt}</span>
        </a>`,
      )
      .join('');
    const sel = resultsEl!.querySelector('[aria-selected="true"]');
    sel?.scrollIntoView({ block: 'nearest' });
  }

  function open() {
    dialog!.showModal();
    input!.value = '';
    results = [];
    selectedIndex = 0;
    renderResults();
    loadPagefind().catch(() => {
      resultsEl!.innerHTML = '<p class="docs-search-empty">Search is unavailable.</p>';
    });
    setTimeout(() => input!.focus(), 0);
  }

  function close() {
    dialog!.close();
  }

  btn.addEventListener('click', open);

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close(); // click on ::backdrop
  });

  input.addEventListener('input', () => {
    clearTimeout(debounce);
    const q = input!.value.trim();
    if (!q) {
      results = [];
      renderResults();
      return;
    }
    debounce = setTimeout(async () => {
      try {
        results = await runSearch(q);
        selectedIndex = 0;
        renderResults();
      } catch {
        resultsEl.innerHTML = '<p class="docs-search-empty">Search is unavailable.</p>';
      }
    }, 120);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!results.length) return;
      selectedIndex =
        e.key === 'ArrowDown'
          ? (selectedIndex + 1) % results.length
          : (selectedIndex - 1 + results.length) % results.length;
      renderResults();
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      window.location.href = results[selectedIndex].url;
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dialog.open) close();
      else open();
    }
  });
}
