export interface DocsNavItem {
  slug: string; // file stem; page lives at /consistent-notes/docs/<slug>/
  title: string;
}

export interface DocsNavGroup {
  group: string;
  items: DocsNavItem[];
}

export const DOC_NAV: DocsNavGroup[] = [
  {
    group: 'Getting started',
    items: [
      { slug: 'install-and-setup', title: 'Install & setup' },
      { slug: 'quickstart', title: 'Quickstart' },
    ],
  },
  {
    group: 'Using the app',
    items: [
      { slug: 'writing-notes', title: 'Writing entries' },
      { slug: 'todos', title: 'Todos & rollover' },
      { slug: 'streaks-heatmaps', title: 'Streaks & heatmaps' },
      { slug: 'search', title: 'Search' },
      { slug: 'reminders', title: 'Reminders' },
      { slug: 'vim-mode', title: 'Vim mode' },
      { slug: 'themes', title: 'Themes' },
    ],
  },
  {
    group: 'Markdown',
    items: [
      { slug: 'markdown', title: 'What is Markdown?' },
      { slug: 'markdown-reference', title: 'Markdown reference' },
    ],
  },
  {
    group: 'Reference',
    items: [
      { slug: 'keyboard-shortcuts', title: 'Keyboard shortcuts' },
      { slug: 'settings', title: 'Settings' },
    ],
  },
  {
    group: 'Data',
    items: [
      { slug: 'where-your-notes-live', title: 'Where your entries live' },
      { slug: 'markdown-export', title: 'Markdown export' },
      { slug: 'sync', title: 'Sync' },
    ],
  },
  {
    group: 'Help',
    items: [
      { slug: 'troubleshooting', title: 'Troubleshooting' },
      { slug: 'contact-support', title: 'Contact support' },
      { slug: 'changelog', title: 'Changelog' },
    ],
  },
];

export function docSlugs(): string[] {
  return DOC_NAV.flatMap((g) => g.items.map((i) => i.slug));
}

export function slugToNavItem(slug: string): { nav: DocsNavItem; group: string } | undefined {
  for (const g of DOC_NAV) {
    const nav = g.items.find((i) => i.slug === slug);
    if (nav) return { nav, group: g.group };
  }
  return undefined;
}

export function prevNext(slug: string): { prev?: DocsNavItem; next?: DocsNavItem } {
  const flat = DOC_NAV.flatMap((g) => g.items);
  const i = flat.findIndex((item) => item.slug === slug);
  if (i === -1) return {};
  return {
    prev: i > 0 ? flat[i - 1] : undefined,
    next: i < flat.length - 1 ? flat[i + 1] : undefined,
  };
}
