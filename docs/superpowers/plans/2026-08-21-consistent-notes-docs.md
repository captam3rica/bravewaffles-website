# Consistent Notes Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Consistent Notes Docs — a 19-page documentation section at `/consistent-notes/docs/` (plus a landing index at the docs root), with a sticky grouped left nav, on-this-page rail, ⌘K Pagefind search, and full content targeting the App Store launch build.

**Architecture:** Astro content collections drive the 19 pages from Markdown files (no per-page `.astro` files). A custom `DocsLayout.astro` (not Starlight — see `docs/adr/0001-custom-docs-shell.md`) wraps the existing `Base.astro` chrome and composes three shell components: `DocsSidebar`, `DocsOnThisPage`, and `DocsSearch`. Nav structure comes from a hand-ordered `docs-nav.ts` config (the single source for group order and page order); the rail is generated from rendered `h2` headings; search is Pagefind over the built `dist/consistent-notes/docs/` subtree, loaded on demand and opened via ⌘K.

**Tech Stack:** Astro 5 content collections (glob loader), TypeScript strict, plain CSS (extend `global.css` with a `docs.css`), Pagefind (npx, no install), Vitest for unit-tested logic, GitHub Pages deploy via existing workflow.

---

## Source-of-truth facts (verified 2026-08-21 — do not re-derive)

All app facts below were verified against `/Users/captam3rica/dev/consistency`, primarily branch `consistency-dev` @ `06e4ffb` (the launch-track branch; `feat-add-storekit` @ `68b64bf` merges it and adds StoreKit). If docs work continues weeks later, re-verify app behavior before publishing.

**Terminology (CONTEXT.md contracts):** product is always "Consistent Notes"; a day's page is an **entry**; the section is **Docs**; "menu bar" (two words). Streak = "days in a row with a non-empty entry — even one word counts." Heatmap = "darker days had more list items (bullets and checkboxes)" — never "notes" for the metric.

**IA count note:** the grilling handoff says "17 pages," but its own enumeration lists 19 (Getting started 2 + Using the app 7 + Markdown 2 + Reference 2 + Data 3 + Help 3). The enumeration is authoritative; this plan builds 19 content pages plus the landing index.

**Distribution & pricing:** App Store launch build comes from `feat-add-storekit` (v0.24.2-dev; StoreKit 2, `APP_STORE` build flag). Subscription: monthly $1.99 (`io.bravewaffles.consistency.sub.monthly`), yearly $19.99 (`io.bravewaffles.consistency.sub.yearly`, "Save 16%"), 14-day free trial on both (Apple introductory offer, `P2W`, eligibility server-side). Trial starts when the user confirms the "Start Free Trial" purchase. At expiry the app locks and the paywall returns ("Your free trial has ended" / "Your subscription has ended"). Paywall: Restore Purchases (`AppStore.sync()`), links to `/consistent-notes/privacy` + `/consistent-notes/terms`. Settings gains a 4th "Subscription" tab (status, trial days remaining, plan, renews/expires date, tier picker, Manage Subscription → `https://apps.apple.com/account/subscriptions`). No onboarding flow: first launch of an App Store build shows the paywall immediately. Direct `.pkg` builds have no StoreKit/paywall — **docs describe the App Store build**. System requirement: macOS 14.0+. Bundle id `io.bravewaffles.consistency`.

**Data:** Entries live in the SwiftData store; every save also writes a Markdown file via `NotesFileService.writeNote`. Default export folder is inside the sandbox container — `~/Library/Containers/io.bravewaffles.consistency/Data/Documents/Consistency Notes` — unless the user sets a custom folder (Settings → Data → Change…). Files are organized `<folder>/<year>/YYYY-MM-DD.md` with `created:`/`updated:`/`source:`/`wordCount:` YAML frontmatter. Settings → Data also has Show in Finder and a **Recovery** rescan (imports `.md` files named `YYYY-MM-DD.md` for dates missing from the journal; never overwrites non-empty entries).

**Editor defaults (launch build):** autosave 1.5 s after typing stops (and on close/navigate); spell check off; autocorrect off (requires spell check on); markdown delimiters 3-way setting "Current line" (options: Always show / Current line / Hidden; migrated from old Hide-markdown bool); formatting toolbar visible (⌘⇧T toggles); todo rollover OFF by default; reminders off by default (time 9:00 AM when enabled); launch at login off; hide tab bar off; more vertical space off; 27 themes (System Default is the default; Dracula, Catppuccin, Nord, Gruvbox, Monokai, Tokyo Night, etc.); vim off by default (tabs motions, editor modal mode, visual-line nav on when enabled, escape sequence empty, indicator shown, hardcore mode off).

**Markdown (launch build, commit `06e4ffb`):** headings `#`–`######` (h4+ styled as h3; heading text bold at body size; `#` markers hidden except on the current line); bold `**`/`__`; italic `*`/`_`; strikethrough `~~`; underline `~text~` (single tildes; replaced `<u>` tags — `<u>` no longer renders as underline); inline code with chip background; links `[text](url)` clickable, scheme-less URLs get `https://`; emoji `:shortcodes:` (1,888 shortcodes, fuzzy-matched, 6-most-recent on empty query, Tab/←→/↑↓/⏎/click, expands to a 7-column grid, inserts the emoji character); unordered `- ` / `* `; ordered `1. ` (auto-increments on Return); task todos `- [ ]` / `- [x]` / cancelled `- [-]` (dashed strikethrough); blockquote `>` (nested supported); horizontal rule: a line of exactly `---` renders a full-width divider (raw dashes visible on the caret's line); auto-pairs `()[]{}"'` and backtick; paste URL over selection wraps `[selection](url)`; Return continues lists/checklists (empty item Return deletes the marker). **Not supported (renders as plain text, never stripped):** tables, fenced code blocks, images, footnotes, raw HTML.

**Todos:** indentation is 4 spaces per level (tabs also 1 level); checking a `- [ ]` cascades to all indented sub-items below (one-directional: unchecking a parent does not uncheck children); `⌘⇧⏎` toggles a todo; typing `[` then `]` at line start expands to `- [ ] `; day header shows "N ToDo · N ToDone" (cancelled excluded). Rollover: banner on today's entry "N open todos from previous days" with View in Todos (⌘T) / Roll over (⌘R) / dismiss; when the Roll Over Todos setting is on, rollover happens automatically once per session; rollover copies still-open todos from any previous day (skipping ones already present today), appended at the end of today's entry preserving indentation. Todos tab aggregates open items across days (deduped, latest occurrence), "Added <date>" per row, checking acts on the original entry.

**Streaks & heatmap:** streak badge `🔥 N` in the header, recomputed live, counts consecutive days ending today with a non-empty entry (reads 0 until you write today). Longest streak stat (launch build): longest run within the current calendar year, shown in the heatmap legend row. Heatmap: full current calendar year, one month per row, scrollable; today has a dot; hover previews the entry's first lines; intensity = count of lines starting with `-` or `*` (bullets and checkboxes), tiers 1–3 / 4–7 / 8–12 / 13–18 / 19+. **Pre-launch check:** the in-app legend still says "notes" (and a wrong "26+" top label) — user has committed to fixing before launch; docs wording must match the fixed legend.

**Views & navigation:** tabs Notes / Heatmap / ToDos (⌘1/⌘2/⌘3); hold ⌘ 0.75 s shows the shortcuts overlay (works in list and editor); global hotkey ⇧⌘C opens/closes the popover from anywhere (configurable in Settings → Shortcuts); search all entries ⌘⇧F (debounced, case/diacritic-insensitive, one result per matching line, newest first; ⏎ opens the entry and flashes the match); find-in-note ⌘F (live highlighting, "n of m" counter, ⏎/⇧⏎ next/prev, ⎋ selects the current match and closes); editor shortcuts: ⌘B/I/E/L/U bold/italic/code/link/underline, ⌘⇧S strikethrough, ⌘⇧B blockquote, ⌘⇧1-3 headings, ⌘⇧7/8 ordered/bullet list, ⌘S save, ⌘⏎ save-and-close, ⌘R rollover, ⌘[ / ⌘] previous/next entry, ⎋ close. Vim: two independent toggles (tabs j/k/gg/G/o/O; editor modal editing with counts, motions, operators, text objects, visual modes, `/` find, `*`/`#`/n/N, u/⌃r, `?` help), escape sequence (e.g. "jk"), hardcore mode disables arrow keys in the lists.

**Version/changelog:** no CHANGELOG file exists in the app repo; `git tag` runs 0.9.0 → v0.21.9 (main) with dev tags through v0.24.2-dev on the launch branch. The docs changelog page launches with a "What's new" for the **launch release** (write it from the launch branch at publish time — see Task 13), seeded with the notable user-facing history summarized in the Changelog draft below.

**Existing site:** Astro `^5.0.0`; `Base.astro` takes `title` + `description`; Nav/Footer are full-width with `.inner` 1240px columns; `global.css` tokens `--bg --cl --fg --comment --purple --cyan --green --pink --yellow --outer` with `html[data-theme='light']` variants; `.prose` styles exist; deploy workflow runs `npm run check && npm test && npm run build` on Node 22 with `npm ci`.

---

## File Structure

```
src/
  content.config.ts                          # docs collection schema
  lib/
    docs-nav.ts                              # nav groups/order + helpers (tested)
    docs-nav.test.ts
    docs-search.ts                           # Pagefind loader + ⌘K (client script)
  styles/
    docs.css                                 # docs shell styles (imported by DocsLayout)
  components/docs/
    DocsSidebar.astro                        # sticky left nav, collapsible groups, mobile drawer
    DocsOnThisPage.astro                     # right rail from h2s (build-time) + scroll spy
    DocsSearch.astro                         # search button (⌘K) + drawer
    DocsPreviousNext.astro                   # prev/next pager
    DocsPageCard.astro                       # index/landing card link
  layouts/
    DocsLayout.astro                         # Base + docs grid; renders content + shell
  pages/
    consistent-notes/docs/index.astro        # landing funnel (static page, cards to key pages)
    consistent-notes/docs/[slug].astro       # all 19 content pages via getStaticPaths
src/content/docs/                            # 19 .md files, written with full content in Tasks 7-11
.github/workflows/deploy.yml                 # unchanged (Pagefind runs inside `npm run build`)
package.json                                 # build script gains pagefind step
```

Responsibility boundaries: `docs-nav.ts` owns IA structure only; `docs-search.ts` owns all client search behavior (button, drawer, keyboard); the three `.astro` components are presentational and receive data from `DocsLayout`; content lives entirely in `src/content/docs/`; nothing in this feature touches `theme.ts`, `Nav.astro`, or `Footer.astro`.

---

## Task 1: Docs collection schema

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Create the collection config**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    sidebar: z.object({
      hidden: z.boolean().default(false),
    }).default({}),
    layout: z.literal('docs').default('docs'),
  }),
});

export const collections = { docs };
```

Notes: `sidebar.hidden` exists only for the Sync stub if we later want it out of the nav — v1 keeps it visible, so all 19 pages set nothing special. The slug comes from the file path (`install-and-setup.md` → `consistent-notes/docs/install-and-setup`).

- [ ] **Step 2: Verify collection typechecks**

Run: `npx astro sync && npm run check`
Expected: PASS (no errors; `.astro/types.d.ts` regenerated).

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(docs): add docs content collection schema"
```

---

## Task 2: Nav config (TDD)

**Files:**
- Create: `src/lib/docs-nav.ts`
- Create: `src/lib/docs-nav.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from 'vitest';
import { DOC_NAV, docSlugs, prevNext, slugToNavItem } from './docs-nav';

describe('docs nav', () => {
  it('has 6 groups and 19 visible pages', () => {
    expect(DOC_NAV).toHaveLength(6);
    const pages = DOC_NAV.flatMap((g) => g.items);
    expect(pages).toHaveLength(19);
  });

  it('slugs are unique and ordered', () => {
    const slugs = docSlugs();
    expect(new Set(slugs).size).toBe(19);
    expect(slugs[0]).toBe('install-and-setup');
    expect(slugs[slugs.length - 1]).toBe('changelog');
  });

  it('maps a slug to its group', () => {
    expect(slugToNavItem('quickstart')?.group).toBe('Getting started');
    expect(slugToNavItem('nope')).toBeUndefined();
  });

  it('returns prev/next across groups', () => {
    // last of Getting started -> first of Using the app
    expect(prevNext('quickstart').next?.slug).toBe('writing-notes');
    expect(prevNext('writing-notes').prev?.slug).toBe('quickstart');
    expect(prevNext('install-and-setup').prev).toBeUndefined();
    expect(prevNext('changelog').next).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './docs-nav'`

- [ ] **Step 3: Write the implementation**

```ts
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
```

Note: `prevNext` returns the full nav items (`{ slug, title }`), so pagers never need a second lookup and titles can't drift from the nav.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (4 docs-nav tests + 5 theme tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/docs-nav.ts src/lib/docs-nav.test.ts
git commit -m "feat(docs): add nav structure with 6 groups and 19 pages"
```

---

## Task 3: Shell styles

**Files:**
- Create: `src/styles/docs.css`

- [ ] **Step 1: Write the docs stylesheet**

```css
/* Docs shell. Grid: [sidebar] [content] [rail]. Mobile: drawer + accordion. */

/* Docs pages need more width than .wrap's 1240px (240 + 720 + 200 + 96 gap).
   Widen just the wrap that hosts a docs grid; everything else is untouched. */
.wrap:has(.docs-grid) { max-width: 1360px; padding: 0 32px; }

.docs-grid {
  display: grid;
  grid-template-columns: 240px minmax(0, 720px) 200px;
  gap: 48px;
  justify-content: center;
  align-items: start;
  width: 100%;
  padding-top: 40px;
}
.docs-grid > .docs-main { min-width: 0; }

/* --- Sidebar --- */
.docs-sidebar { position: sticky; top: 24px; max-height: calc(100vh - 48px); overflow-y: auto; }
.docs-nav-group { margin-bottom: 20px; }
.docs-nav-group h3 {
  font-size: 12px; color: var(--comment); text-transform: uppercase; letter-spacing: .12em;
  margin: 0 0 6px; padding: 0; border: none; font-weight: 400;
}
.docs-nav-group ul { list-style: none; margin: 0; padding: 0; }
.docs-nav-group a {
  display: block; padding: 4px 10px; border-radius: 6px;
  color: var(--comment); text-decoration: none; font-size: 14px; line-height: 1.4;
}
.docs-nav-group a:hover { color: var(--fg); background: color-mix(in srgb, var(--cl) 40%, transparent); }
.docs-nav-group a[aria-current='page'] { color: var(--purple); background: color-mix(in srgb, var(--purple) 12%, transparent); }

/* --- On-this-page rail --- */
.docs-rail { position: sticky; top: 24px; font-size: 13px; }
.docs-rail h3 {
  font-size: 12px; color: var(--comment); text-transform: uppercase; letter-spacing: .12em;
  margin: 0 0 6px; font-weight: 400;
}
.docs-rail ul { list-style: none; margin: 0; padding: 0; }
.docs-rail a { display: block; padding: 3px 0 3px 12px; color: var(--comment); text-decoration: none; border-left: 2px solid var(--cl); }
.docs-rail a:hover { color: var(--fg); }
.docs-rail a.active { color: var(--purple); border-left-color: var(--purple); }

/* --- Search --- */
button.docs-search-btn {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  width: 100%; max-width: 420px;
  margin-bottom: 20px; padding: 8px 12px; border-radius: 8px; cursor: pointer;
  background: transparent; border: 1px solid var(--cl); color: var(--comment); font: inherit; font-size: 14px;
}
button.docs-search-btn:hover { border-color: var(--purple); color: var(--purple); }
button.docs-search-btn .kbd { font-size: 12px; border: 1px solid var(--cl); border-radius: 4px; padding: 1px 6px; }
.docs-search-dialog { position: fixed; inset: 0; display: none; }
.docs-search-dialog[open] { display: block; }
.docs-search-dialog::backdrop { background: rgb(0 0 0 / .5); }
.docs-search-box {
  position: fixed; top: 15vh; left: 50%; transform: translateX(-50%);
  width: min(640px, calc(100vw - 32px));
  background: var(--bg); border: 1px solid var(--cl); border-radius: 12px;
  display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 16px 48px rgb(0 0 0 / .35);
}
.docs-search-box input {
  background: transparent; border: none; outline: none; color: var(--fg);
  font: inherit; font-size: 16px; padding: 16px; border-bottom: 1px solid var(--cl);
}
.docs-search-results { max-height: 50vh; overflow-y: auto; padding: 8px; }
.docs-search-result { display: block; padding: 10px 12px; border-radius: 8px; text-decoration: none; color: var(--fg); }
.docs-search-result[aria-selected='true'] { background: color-mix(in srgb, var(--purple) 15%, transparent); }
.docs-search-result .url { display: block; font-size: 12px; color: var(--comment); margin-bottom: 2px; }
.docs-search-result .excerpt { font-size: 14px; }
.docs-search-result mark { background: none; color: var(--pink); }
.docs-search-empty { padding: 16px; color: var(--comment); font-size: 14px; }

/* --- Page furniture --- */
.docs-eyebrow { font-size: 12px; color: var(--comment); text-transform: uppercase; letter-spacing: .12em; margin-bottom: 8px; }
.docs-title { font-size: 40px; font-weight: 700; margin-bottom: 12px; }
.docs-lede { font-size: 16px; color: var(--comment); margin-bottom: 32px; max-width: 60ch; }

/* Docs prose (docs pages don't use .prose to avoid marketing h1 styling) */
.docs-prose { font-size: 15px; }
.docs-prose h2 { font-size: 24px; font-weight: 700; margin: 40px 0 12px; padding-top: 8px; scroll-margin-top: 24px; }
.docs-prose h3 { font-size: 17px; margin: 28px 0 8px; scroll-margin-top: 24px; }
.docs-prose p, .docs-prose ul, .docs-prose ol { margin: 0 0 16px; max-width: 72ch; }
.docs-prose ul, .docs-prose ol { padding-left: 26px; }
.docs-prose li { margin-bottom: 4px; }
.docs-prose a { color: var(--purple); }
.docs-prose code {
  font-size: .9em; background: color-mix(in srgb, var(--cl) 45%, transparent);
  border-radius: 4px; padding: 1px 5px;
}
.docs-prose pre { background: var(--outer); border: 1px solid var(--cl); border-radius: 8px; padding: 14px 16px; overflow-x: auto; margin: 0 0 16px; }
.docs-prose pre code { background: none; padding: 0; font-size: 13px; }
.docs-prose blockquote { border-left: 3px solid var(--cl); color: var(--comment); padding-left: 16px; margin: 0 0 16px; }
.docs-prose table { border-collapse: collapse; margin: 0 0 16px; font-size: 14px; }
.docs-prose th, .docs-prose td { border: 1px solid var(--cl); padding: 6px 12px; text-align: left; }
.docs-prose th { color: var(--comment); text-transform: uppercase; font-size: 12px; letter-spacing: .08em; }
.docs-prose kbd {
  font: inherit; font-size: 12px; background: color-mix(in srgb, var(--cl) 45%, transparent);
  border: 1px solid var(--cl); border-bottom-width: 2px; border-radius: 5px; padding: 2px 7px; white-space: nowrap;
}
.docs-prose .docs-callout {
  border: 1px solid var(--cl); border-left: 3px solid var(--cyan); border-radius: 8px;
  padding: 12px 16px; margin: 0 0 16px; color: var(--fg); background: color-mix(in srgb, var(--cl) 20%, transparent);
}
.docs-prose hr { border: none; border-top: 1px solid var(--cl); margin: 32px 0; }

/* --- Prev/next pager --- */
.docs-pager { display: flex; justify-content: space-between; gap: 16px; margin-top: 56px; border-top: 1px solid var(--cl); padding-top: 24px; }
.docs-pager a { text-decoration: none; color: var(--fg); max-width: 48%; }
.docs-pager a:hover .docs-pager-title { color: var(--purple); }
.docs-pager .docs-pager-label { display: block; font-size: 12px; color: var(--comment); margin-bottom: 2px; }
.docs-pager .docs-pager-title { font-size: 15px; }
.docs-pager a.next { margin-left: auto; text-align: right; }

/* --- Mobile --- */
@media (max-width: 1024px) {
  .docs-grid { grid-template-columns: minmax(0, 720px); }
  .docs-sidebar, .docs-rail { display: none; }
  .docs-mobile-bar { display: flex; }
}
.docs-mobile-bar { display: none; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--cl); margin-bottom: 24px; }
button.docs-menu-btn {
  background: transparent; border: 1px solid var(--cl); border-radius: 8px; color: var(--fg);
  font: inherit; font-size: 14px; padding: 6px 12px; cursor: pointer;
}
button.docs-menu-btn:hover { border-color: var(--purple); color: var(--purple); }
.docs-drawer { position: fixed; inset: 0; z-index: 40; display: none; }
.docs-drawer[data-open='true'] { display: block; }
.docs-drawer .docs-drawer-backdrop { position: absolute; inset: 0; background: rgb(0 0 0 / .5); }
.docs-drawer .docs-drawer-panel {
  position: absolute; top: 0; bottom: 0; left: 0; width: min(300px, 85vw);
  background: var(--bg); border-right: 1px solid var(--cl); overflow-y: auto; padding: 20px;
}
.docs-drawer details summary {
  cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; color: var(--comment); text-transform: uppercase; letter-spacing: .12em; padding: 8px 0 4px;
}
.docs-drawer details summary::-webkit-details-marker { display: none; }
.docs-drawer details summary::after { content: '+'; font-size: 14px; }
.docs-drawer details[open] summary::after { content: '−'; }
```

No build verification needed yet (imported in Task 4).

- [ ] **Step 2: Commit**

```bash
git add src/styles/docs.css
git commit -m "feat(docs): add docs shell styles"
```

---

## Task 4: DocsLayout + slug pages

**Files:**
- Create: `src/layouts/DocsLayout.astro`
- Create: `src/pages/consistent-notes/docs/[slug].astro`
- Create: `src/pages/consistent-notes/docs/index.astro`

- [ ] **Step 1: Create `DocsLayout.astro`**

```astro
---
import '../styles/docs.css';
import Base from './Base.astro';
import DocsSidebar from '../components/docs/DocsSidebar.astro';
import DocsOnThisPage from '../components/docs/DocsOnThisPage.astro';
import DocsSearch from '../components/docs/DocsSearch.astro';
import DocsPreviousNext from '../components/docs/DocsPreviousNext.astro';
import { DOC_NAV } from '../lib/docs-nav';

interface Props {
  frontmatter: { title: string; description?: string };
  slug: string; // '' for the index
  headings: { depth: number; slug: string; text: string }[];
}

const { frontmatter, slug, headings } = Astro.props;
const currentPath = slug ? `/consistent-notes/docs/${slug}/` : '/consistent-notes/docs/';

// Uniform hrefs — every nav item points at its own page; the index is a
// separate landing and appears in no nav group, so it gets no pager either.
function navHref(s: string): string {
  return `/consistent-notes/docs/${s}/`;
}

const flat = DOC_NAV.flatMap((g) => g.items);
const idx = flat.findIndex((i) => navHref(i.slug) === currentPath);
const prevNav = idx > 0 ? flat[idx - 1] : undefined;
const nextNav = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : undefined;
const railHeadings = headings.filter((h) => h.depth === 2);

const baseDescription =
  frontmatter.description ||
  `Consistent Notes documentation — ${frontmatter.title}. A macOS menu bar journaling app by Bravewaffles.`;
---

<Base title={`${frontmatter.title} — Consistent Notes Docs`}>
  <div class="docs-grid">
    <DocsSidebar currentPath={currentPath} navHref={navHref} />
    <div class="docs-main">
      <DocsSearch />
      <p class="docs-eyebrow">Docs</p>
      <h1 class="docs-title">{frontmatter.title}</h1>
      {frontmatter.description && <p class="docs-lede">{frontmatter.description}</p>}
      <div class="docs-prose">
        <slot />
      </div>
      {(prevNav || nextNav) && (
        <DocsPreviousNext
          prev={prevNav ? { href: navHref(prevNav.slug), label: prevNav.title } : undefined}
          next={nextNav ? { href: navHref(nextNav.slug), label: nextNav.title } : undefined}
        />
      )}
    </div>
    <DocsOnThisPage headings={railHeadings} />
  </div>
</Base>
```

Notes: the search button sits at the top of `.docs-main` (visible at every breakpoint, and the dialog itself is `position: fixed` so it can live anywhere in the DOM). The mobile bar and drawer get mounted in Task 6.

- [ ] **Step 2: Create the `[slug].astro` page router**

```astro
---
import { getCollection, render } from 'astro:content';
import DocsLayout from '../../../layouts/DocsLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('docs');
  return entries.map((e) => ({
    params: { slug: e.id.replace(/\.md$/, '') },
    props: { entry: e },
  }));
}

const { entry } = Astro.props;
const { Content, headings } = await render(entry);
---

<DocsLayout frontmatter={entry.data} slug={entry.id.replace(/\.md$/, '')} headings={headings}>
  <Content />
</DocsLayout>
```

(All content files — including `install-and-setup.md` — route through this file. The index at `docs/index.astro` is a separate static landing page, not a collection route.)

- [ ] **Step 3: Create the docs index page**

The landing lives at the docs root and funnels to Install & setup and Quickstart (per the settled IA). Install & setup remains its own page.

```astro
---
import { getCollection } from 'astro:content';
import DocsLayout from '../../../layouts/DocsLayout.astro';
import DocsPageCard from '../../../components/docs/DocsPageCard.astro';

const entries = await getCollection('docs');
const bySlug = (s: string) => entries.find((e) => e.id === `${s}.md`);
const gettingStarted = ['install-and-setup', 'quickstart'].map(bySlug).filter((e) => e !== undefined);
const everyday = ['writing-notes', 'todos', 'streaks-heatmaps', 'search', 'keyboard-shortcuts'].map(bySlug).filter((e) => e !== undefined);
---

<DocsLayout frontmatter={{ title: 'Consistent Notes Docs' }} slug="" headings={[]}>
  <p class="docs-lede">
    Everything you need to use Consistent Notes, the macOS menu bar journaling app.
    New here? Start with Install &amp; setup, then the Quickstart.
  </p>
  <h2>Start here</h2>
  <div class="docs-card-grid">
    {gettingStarted.map((e) => <DocsPageCard href={`/consistent-notes/docs/${e.id.replace(/\.md$/, '')}/`} title={e.data.title} description={e.data.description} />)}
  </div>
  <h2>Everyday pages</h2>
  <div class="docs-card-grid">
    {everyday.map((e) => <DocsPageCard href={`/consistent-notes/docs/${e.id.replace(/\.md$/, '')}/`} title={e.data.title} description={e.data.description} />)}
  </div>
  <h2>Browse everything</h2>
  <p>Use the navigation on the left, or press <kbd>⌘K</kbd> to search the Docs.</p>
</DocsLayout>
```

- [ ] **Step 4: Add the card grid CSS**

Append to `src/styles/docs.css`:

```css
.docs-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; margin: 0 0 24px; }
a.docs-card {
  display: block; border: 1px solid var(--cl); border-radius: 8px; padding: 16px;
  text-decoration: none; color: var(--fg); transition: border-color .15s;
}
a.docs-card:hover { border-color: var(--purple); }
a.docs-card h3 { font-size: 15px; margin: 0 0 4px; }
a.docs-card p { font-size: 13px; color: var(--comment); margin: 0; }
```

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: build succeeds; `dist/consistent-notes/docs/index.html` exists (the empty collection means no `[slug]` pages yet — they arrive with Task 7's content). Also run `npm run check` to confirm the new files typecheck.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/DocsLayout.astro src/pages/consistent-notes/docs/ src/styles/docs.css
git commit -m "feat(docs): add docs layout and page routers"
```

---

## Task 5: Sidebar, rail, pager, card components

**Files:**
- Create: `src/components/docs/DocsSidebar.astro`
- Create: `src/components/docs/DocsOnThisPage.astro`
- Create: `src/components/docs/DocsPreviousNext.astro`
- Create: `src/components/docs/DocsPageCard.astro`

- [ ] **Step 1: Create `DocsSidebar.astro`**

```astro
---
import { DOC_NAV } from '../../lib/docs-nav';

interface Props {
  currentPath: string;
  navHref: (slug: string) => string;
}
const { currentPath, navHref } = Astro.props;
---

<aside class="docs-sidebar">
  <nav aria-label="Docs">
    {DOC_NAV.map((g) => (
      <div class="docs-nav-group">
        <h3>{g.group}</h3>
        <ul>
          {g.items.map((item) => (
            <li>
              <a
                href={navHref(item.slug)}
                aria-current={navHref(item.slug) === currentPath ? 'page' : undefined}
              >{item.title}</a>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </nav>
</aside>
```

- [ ] **Step 2: Create `DocsOnThisPage.astro`**

```astro
---
interface Props {
  headings: { depth: number; slug: string; text: string }[];
}
const { headings } = Astro.props;
---

{headings.length > 0 && (
  <aside class="docs-rail" aria-label="On this page">
    <h3>On this page</h3>
    <ul>
      {headings.map((h) => (
        <li><a href={`#${h.slug}`} data-rail-link>{h.text}</a></li>
      ))}
    </ul>
  </aside>
)}
```

- [ ] **Step 3: Create `DocsPreviousNext.astro`**

```astro
---
interface Props {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
}
const { prev, next } = Astro.props;
---

{(prev || next) && (
  <nav class="docs-pager" aria-label="Pager">
    {prev && (
      <a class="prev" href={prev.href}>
        <span class="docs-pager-label">Previous</span>
        <span class="docs-pager-title">← {prev.label}</span>
      </a>
    )}
    {next && (
      <a class="next" href={next.href}>
        <span class="docs-pager-label">Next</span>
        <span class="docs-pager-title">{next.label} →</span>
      </a>
    )}
  </nav>
)}
```

- [ ] **Step 4: Create `DocsPageCard.astro`**

```astro
---
interface Props {
  href: string;
  title: string;
  description: string;
}
const { href, title, description } = Astro.props;
---

<a class="docs-card" href={href}>
  <h3>{title}</h3>
  {description && <p>{description}</p>}
</a>
```

- [ ] **Step 5: Verify typecheck**

Run: `npm run check`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/docs/
git commit -m "feat(docs): add sidebar, rail, pager, and card components"
```

---

## Task 6: Search (client logic + Pagefind wiring)

**Files:**
- Create: `src/lib/docs-search.ts`
- Create: `src/components/docs/DocsSearch.astro`
- Modify: `package.json` (build script)
- Modify: `src/layouts/DocsLayout.astro` (mount mobile bar + drawer; import `docs-search.ts`)

Search is entirely client-side progressive enhancement. The **button** renders always; Pagefind loads on first open (not on page load) so marketing pages never pay for it. Docs-only scope comes from running Pagefind with `--glob` against only the docs subtree after `astro build`.

- [ ] **Step 1: Create `src/lib/docs-search.ts`**

```ts
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

export function loadPagefind(): Promise<Pagefind> {
  if (pagefind) return Promise.resolve(pagefind);
  if (loading) return loading;
  loading = import(/* @vite-ignore */ '/pagefind/pagefind.js').then((m: any) => {
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
      resultsEl.innerHTML = '<p class="docs-search-empty">No results. Try a different search.</p>';
      return;
    }
    resultsEl.innerHTML = results
      .map(
        (r, i) => `
        <a class="docs-search-result" href="${r.url}" data-index="${i}"
           aria-selected="${i === selectedIndex}">
          <span class="url">${r.title}</span>
          <span class="excerpt">${r.excerpt}</span>
        </a>`,
      )
      .join('');
    const sel = resultsEl.querySelector('[aria-selected="true"]');
    sel?.scrollIntoView({ block: 'nearest' });
  }

  function open() {
    dialog.showModal();
    input!.value = '';
    results = [];
    selectedIndex = 0;
    renderResults();
    loadPagefind().catch(() => {
      resultsEl.innerHTML = '<p class="docs-search-empty">Search is unavailable.</p>';
    });
    setTimeout(() => input!.focus(), 0);
  }

  function close() {
    dialog.close();
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
```

- [ ] **Step 2: Create `DocsSearch.astro`**

```astro
---
---

<button id="docs-search-open" class="docs-search-btn" type="button">
  <span>Search the Docs</span>
  <span class="kbd">⌘K</span>
</button>

<dialog id="docs-search-dialog" class="docs-search-dialog">
  <div class="docs-search-box">
    <input id="docs-search-input" type="text" placeholder="Search the Docs…" autocomplete="off" />
    <div id="docs-search-results" class="docs-search-results"></div>
  </div>
</dialog>

<script>
  import { initSearch } from '../../lib/docs-search';
  initSearch();
</script>
```

- [ ] **Step 3: Wire Pagefind into the build**

In `package.json`, change:

```json
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && npx -y pagefind --site dist --glob 'consistent-notes/docs/**/*.html'",
    "preview": "astro preview",
    "check": "astro check",
    "test": "NODE_OPTIONS=--no-experimental-webstorage vitest run"
  },
```

`npx -y pagefind` downloads pagefind on first CI run and caches it; locally add `pagefind` as a devDependency if you want it cached (`npm i -D pagefind` — then plain `npx pagefind` uses the local copy). The `--glob` restricts the index to the docs subtree so marketing pages stay out of results (v1 scope per the ADR).

- [ ] **Step 4: Mount the mobile bar + drawer in DocsLayout**

`<DocsSearch />` stays where Task 4 put it — top of `.docs-main`, visible at every breakpoint (adding it as a fourth `.docs-grid` child would shift the sidebar into the content column; don't). Two edits to `src/layouts/DocsLayout.astro`:

**Edit 1** — add the mobile bar as the first child inside `.docs-main` (above `<DocsSearch />`):

```astro
    <div class="docs-main">
      <div class="docs-mobile-bar">
        <button id="docs-menu-open" class="docs-menu-btn" type="button">☰ Docs</button>
      </div>
      <DocsSearch />
```

**Edit 2** — add the drawer as the last child inside `<Base>`, *after* the closing `</div>` of `.docs-grid` (a sibling of the grid, not a child — it's `position: fixed`):

```astro
  </div>{/* end .docs-grid */}

  <div class="docs-drawer" id="docs-drawer" data-open="false">
    <div class="docs-drawer-backdrop" data-drawer-close></div>
    <div class="docs-drawer-panel">
      <nav aria-label="Docs">
        {DOC_NAV.map((g) => (
          <details open={g.group === 'Getting started' || undefined}>
            <summary>{g.group}</summary>
            <div class="docs-nav-group">
              <ul>
                {g.items.map((item) => (
                  <li>
                    <a
                      href={navHref(item.slug)}
                      aria-current={navHref(item.slug) === currentPath ? 'page' : undefined}
                    >{item.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </nav>
    </div>
  </div>
</Base>
```

And the drawer's open/close behavior — add this script block at the end of the component (Astro bundles it as a deferred module, so the DOM exists when it runs):

```astro
<script>
  const openBtn = document.getElementById('docs-menu-open');
  const drawer = document.getElementById('docs-drawer');
  drawer?.querySelectorAll('[data-drawer-close]').forEach((el) =>
    el.addEventListener('click', () => drawer.setAttribute('data-open', 'false')),
  );
  drawer?.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => drawer?.setAttribute('data-open', 'false')),
  );
  openBtn?.addEventListener('click', () => drawer?.setAttribute('data-open', 'true'));
</script>
```

(The drawer nav uses `<details>` collapsible groups, matching the ADR's accordion-on-mobile pattern; desktop keeps the always-open sticky sidebar.)

- [ ] **Step 5: Verify search works locally**

```bash
npm run build
npx -y serve dist
```

Open the served docs page, click Search, type "todo". Expected: dialog opens, results appear after ~1s (first query loads the index). ⌘K toggles. Confirm `dist/pagefind/` exists with `pagefind.js`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/docs-search.ts src/components/docs/DocsSearch.astro src/layouts/DocsLayout.astro package.json package-lock.json
git commit -m "feat(docs): add pagefind search with cmd-k"
```

---

## Task 7: Content — Getting started + Using the app (9 files)

**Files:**
- Create: `src/content/docs/install-and-setup.md`
- Create: `src/content/docs/quickstart.md`
- Create: `src/content/docs/writing-notes.md`
- Create: `src/content/docs/todos.md`
- Create: `src/content/docs/streaks-heatmaps.md`
- Create: `src/content/docs/search.md`
- Create: `src/content/docs/reminders.md`
- Create: `src/content/docs/vim-mode.md`
- Create: `src/content/docs/themes.md`

Writing rules for all content tasks: every page opens with a one-sentence description in frontmatter (it feeds the search index and index cards); second person; `entry` not "note" for a day's page; `menu bar` two words; only what the app does today (facts above); no screenshots; link between pages with absolute paths like `/consistent-notes/docs/writing-notes/`; `<kbd>` for keys; fenced examples show plain text inside a fenced block (the app doesn't support fenced blocks — that's a website rendering feature, fine to use).

- [ ] **Step 1: `install-and-setup.md`**

```markdown
---
title: Install & setup
description: Install Consistent Notes from the Mac App Store, start your free trial, and make it yours in two minutes.
---

Consistent Notes lives in your menu bar — there when you need it, tucked away when you don't. This page covers installing it, starting your trial, and the handful of settings worth knowing on day one.

## Requirements

- A Mac running macOS 14 (Sonoma) or later
- An Apple ID (for the App Store download and subscription)

## Install from the Mac App Store

1. Open the App Store on your Mac and search for **Consistent Notes**, or [get it here](#) directly.
2. Click **Get**, then **Install**.
3. When it first opens, Consistent Notes adds its icon to the right side of your menu bar.

> **Link note (remove at publish):** replace `#` with the live App Store URL when the listing is approved — same constant the product page uses (`APP_STORE_MAC_URL` in `src/lib/site.ts`).

## Start your free trial

The first time you open the app you'll see the subscription screen.

1. Choose a plan — **$1.99/month** or **$19.99/year** (save 16%).
2. Click **Start Free Trial**. Your 14-day trial begins when you confirm in the App Store sheet.
3. The trial is the full app, no feature limits. When it ends, the subscription screen returns and you can subscribe or walk away.

You can see days remaining in your trial in **Settings → Subscription**. Subscriptions renew automatically until you cancel, in your App Store account settings ([Manage Subscriptions](https://apps.apple.com/account/subscriptions)). If you reinstall or switch Macs, **Restore Purchases** recovers your subscription.

## The two-minute setup

Three settings are worth a look on day one. Open them with **⌘,** (Settings lives in the gear menu in the app's popover).

### Open it from anywhere

The global shortcut — **⇧⌘C** by default — shows and hides Consistent Notes from any app. Change it in **Settings → Shortcuts** if it clashes with something you use.

### Write every day

Turn on **Enable daily reminder** in **Settings → General → Reminders** and pick a time. macOS will ask permission to send notifications the first time.

### Keep todos flowing

**Settings → General → Roll Over Todos** copies unfinished todos from previous days into today's entry automatically. Off by default — the app asks you each morning instead.

## Where to go next

- [Quickstart](/consistent-notes/docs/quickstart/) — write your first entry in two minutes
- [Keyboard shortcuts](/consistent-notes/docs/keyboard-shortcuts/) — hold **⌘** in the app to see them all
```

- [ ] **Step 2: `quickstart.md`**

```markdown
---
title: Quickstart
description: Write your first entry, check off a todo, and find your streak — the two-minute tour of Consistent Notes.
---

This page is the whole app in two minutes: open it, write, check things off, close it. Everything else in these Docs is detail you can look up later.

## 1. Open the app

Press **⇧⌘C** (or click the Consistent Notes icon in your menu bar). The app opens over whatever you were doing.

Today's entry is already there, with the date at the top. You never create an entry — each day has one waiting.

## 2. Write something

Type. Anything. One word counts as an entry.

Format as you go:

- `**bold**`, `*italic*`, `` `code` `` — or select text and press **⌘B**, **⌘I**, **⌘E**
- `-` then space makes a bullet
- `- [ ]` then space makes a todo checkbox

See the [Markdown reference](/consistent-notes/docs/markdown-reference/) for everything.

## 3. Make a todo

On its own line, type `- [ ] water the plants` and press **Return**. The app continues the list for you.

Click the checkbox (or press **⌘⇧⏎**) to complete a todo. Checking a parent todo checks everything nested under it.

## 4. Close it and forget it

Press **⎋** or **⇧⌘C**. Everything saved on its own — entries autosave one and a half seconds after you stop typing.

Come back tomorrow and write one word. Do that for a few days and the flame next to the app's name starts counting your [streak](/consistent-notes/docs/streaks-heatmaps/).

## What's next

- [Todos & rollover](/consistent-notes/docs/todos/) — how open todos carry to future days
- [Search](/consistent-notes/docs/search/) — find anything you've written, from any year
- [Themes](/consistent-notes/docs/themes/) — 27 ways to make it yours
```

- [ ] **Step 3: `writing-notes.md`**

```markdown
---
title: Writing entries
description: The day-by-day editor — markdown as you type, emoji shortcodes, find in entry, and how saving works.
---

Each day in Consistent Notes is one entry, dated and saved automatically. This page covers the editor itself; formatting syntax lives in the [Markdown reference](/consistent-notes/docs/markdown-reference/).

## One entry per day

The entry for today is always one keystroke away (**⇧⌘C**). Use **⌘[** and **⌘]** to move to yesterday's and tomorrow's entries, or pick any day from the notes list. In the list, **↑ ↓** move between days, **⏎** opens the selected one, and **⎵** jumps back to today.

## Formatting as you type

The editor highlights markdown live — bold shows bold, headings get color, code gets a chip background — while the raw characters stay in the file. By default, formatting characters (the asterisks, backticks, and friends) are hidden except on the line you're editing, so yesterday's entries read clean. Prefer to always see them? **Settings → General → Markdown delimiters → Always show**.

The editor also gives you a hand while typing:

- **Auto-pairs** — typing `(`, `[`, `{`, a quote, or a backtick inserts the closing character; backspacing an empty pair removes both.
- **Smart lists** — pressing **Return** continues bullets, numbers (incrementing), and checkboxes; pressing **Return** on an empty list item removes the marker.
- **Paste links over text** — select some text, paste a URL, and it becomes `[text](url)`.

## Emoji shortcodes

Type `:` followed by letters to insert an emoji: `:fire` matches, **⏎** inserts 🔥. Matches are fuzzy and ranked; the six you use most appear when you just type `:` alone. **⇥** and the arrow keys move through matches, and the chevron (or a wide query) expands the full grid.

## Find in this entry

**⌘F** searches within the entry you're reading. Matches highlight as you type with an "n of m" counter; **⏎** and **⇧⏎** step forward and back; **⎋** closes the bar and selects the current match. To search across every entry instead, use [search](/consistent-notes/docs/search/) (**⌘⇧F**).

## Saving

Entries autosave one and a half seconds after you stop typing, and save again when you close an entry or leave the app. **⌘S** saves immediately if you want the certainty. Every save also writes the entry's Markdown file to disk — see [where your entries live](/consistent-notes/docs/where-your-notes-live/).

## The toolbar

The formatting toolbar at the bottom of the editor has buttons for the common formats (bold, italic, code, link, underline, lists, and more). Hide it with **⌘⇧T** if you'd rather have the space.
```

- [ ] **Step 4: `todos.md`**

```markdown
---
title: Todos & rollover
description: Checkboxes that nest, cascade, and roll over to future days — todos in Consistent Notes.
---

Todos in Consistent Notes are lines in your entries that start with a checkbox. That's the whole trick — but what you can build on it is a lot.

## Making todos

Type `- [ ]` and a space, then the todo. Press **Return** to get the next checkbox automatically.

- `- [ ]` — an open todo
- `- [x]` — a done todo
- `- [-]` — a cancelled todo (dashed strikethrough; it doesn't count as open or done)

The day's header shows `N ToDo · N ToDone` so you can see the shape of the day at a glance (cancelled todos count as neither).

## Nesting and cascading

Indent a todo with **⇥** (four spaces per level) to nest it under the one above. Checking a todo checks every todo nested beneath it — clear a whole project by checking its top line. Unchecking a parent does **not** uncheck its children; re-open only what you mean to.

## The ToDos tab

The ToDos tab (**⌘3**) gathers every open todo across every entry, deduplicated and nested under its parents, with the date it was added to each. Checking a todo from this tab checks it in the entry where it lives. When it's empty: all caught up.

## Rollover — carrying todos forward

Open todos don't die at midnight. Two ways to carry them into today:

- **Automatically** — turn on **Settings → General → Roll Over Todos** and each day's open todos are copied to the end of today's entry when you open it.
- **When you say so** — with the setting off, today's entry shows a banner when previous days have open todos: *N open todos from previous days*, with **Roll over** (**⌘R**) and **View in Todos** (**⌘T**).

Rollover copies todos that are still open, from any previous day, skipping ones already in today's entry, and keeps their original nesting. Todos you cancelled or completed stay put.

## Todos and your stats

Checking todos feeds the [heatmap](/consistent-notes/docs/streaks-heatmaps/) — darker days had more list items — and writing anything at all feeds your streak.
```

- [ ] **Step 5: `streaks-heatmaps.md`**

```markdown
---
title: Streaks & heatmaps
description: The flame counts days in a row with an entry; the heatmap shows your year of writing.
---

Consistent Notes keeps two gentle scoreboards. Neither judges word count — the point is showing up.

## Your streak

The flame next to the app's name counts **days in a row with a non-empty entry — even one word counts**. Write something today and the flame appears; the count grows each consecutive day you write.

Miss a day and the streak starts over. Because the count runs through *today*, the flame reads 0 until you've written something today — yesterday's work keeps the entries, not the badge.

The heatmap's legend also shows your **longest streak** — the longest run of consecutive writing days within the current calendar year.

## The heatmap

The Heatmap tab (**⌘2**) shows the whole current year, one row per month, scrollable top to bottom. Hover any day to preview its entry; click to open it. Today gets a dot.

**Darker days had more list items** (bullets and checkboxes) — a day with three bullets is darker than a day with one, and a day of paragraphs alone is bright. The scale runs from one list item up to nineteen and beyond; it's about the shape of your day, not the word count.

Why list items? They're the cleanest signal of "what I did today" — plans, checks, and notes to self all count — without turning the heatmap into a word-count contest.

## Using them without obsessing

Streaks work best as a nudge, not a job. If the flame gets loud, remember: one word keeps it lit, and streaks reset with no ceremony. The heatmap is the calmer view — a year of days, each exactly as dark as the day deserved.
```

- [ ] **Step 6: `search.md`**

```markdown
---
title: Search
description: Find any word you've ever written — search every entry from anywhere in the app.
---

**⌘⇧F** searches every entry, from anywhere in the app. Results appear as you type: one line per match, newest entries first, with the matching words highlighted. **↑ ↓** pick a result, **⏎** opens the entry and jumps to (and briefly highlights) the match.

Search matches text anywhere in an entry — headings, todos, and body text alike — ignoring case and diacritics (searching `cafe` finds `café`).

Within the entry you're editing, **⌘F** searches just that entry: live highlighting, an "n of m" counter, **⏎**/**⇧⏎** to step through matches, **⎋** to close.

**⌘⇧F = everything. ⌘F = this entry.**
```

- [ ] **Step 7: `reminders.md`**

```markdown
---
title: Reminders
description: A once-a-day notification at the time you choose.
---

Consistent Notes can send one reminder a day — a small nudge to write, at the time you choose.

## Turning it on

**Settings → General → Reminders → Enable daily reminder**. The first time you enable it, macOS asks for permission to send notifications; the reminder won't work if you decline. You can change permission later in **System Settings → Notifications → Consistent Notes**.

## Setting the time

Pick any time of day — the default is 9:00 AM. Changing the time reschedules the reminder immediately.

## What arrives

A single notification: *"Time to write today's journal entry!"* Click it to open the app straight to today's entry. If you've already written, feel free to ignore it — the streak thanks you.

One reminder a day, no badges, no guilt cycles. If that's still too much, turn it off and let the [streak](/consistent-notes/docs/streaks-heatmaps/) do the talking.
```

- [ ] **Step 8: `vim-mode.md`**

```markdown
---
title: Vim mode
description: Vim motions in the lists and full modal editing in the editor, if that's your way.
---

If you live in vim, Consistent Notes can meet you there — in the lists, in the editor, or both. Both live in **Settings → General → Vim Mode** and both are off by default.

## Vim motions in the lists

With **Vim motions in tabs** on, the notes and ToDos lists respond to **j**/**k** (down/up), **gg**/**G** (top/bottom of the list), **o** or **⏎** (open), and the ToDos-specific **O** (open the original entry). Works everywhere the arrow keys work — which, if you enable **hardcore mode** (below), is nowhere: the point is to force the habit.

## Vim mode in the editor

With **Vim mode in editor** on, the editor becomes modal:

- **Normal mode** — motions (`h j k l w b e 0 ^ $ { } f{char} %` …), operators (`d y c`) with text objects (`iw aw i" a[` …), counts (`3j`, `5dd`), **u**/**⌃r** undo/redo, **x**, **p**/**P**, **r**, **J**, **>>**/**<<**, and **zz/zt/zb** scrolling.
- **Insert mode** — entered with **i a A o O** (or **gA** to append at the end of the visual line); type normally; **⎋** returns to Normal.
- **Visual and visual-line modes** — **v** and **V** to select, then **d**, **y**, or **c**.
- **Find** — **/** opens the find bar, `*`/`#` search the word under the cursor, **n**/**N** repeat.
- **?** shows the full keybinding reference, in place.

A couple of options tune it:

- **Move up and down by visual lines** (on by default) — **j**/**k** follow wrapped lines; counts like `5j` always use logical lines.
- **Escape sequence** — record two keystrokes (classic: `jk`) that exit Insert mode without reaching for **⎋**.
- **Show vim indicator** — the little mode badge (N / I / VISUAL) in the editor header.

## Hardcore mode

**Hardcore mode** disables arrow-key navigation in the notes and ToDos lists, filtered from the shortcut hints too. The editor is unaffected — arrows still move the cursor while you're typing. It exists to build the muscle memory; it does not exist to punish edits.

Hold **⌘** anywhere to see the shortcuts that apply where you are, vim or not.
```

- [ ] **Step 9: `themes.md`**

```markdown
---
title: Themes
description: 27 themes, from System Default to Dracula — pick one in Settings.
---

Consistent Notes ships with 27 themes — most of the classics (Dracula, Nord, Gruvbox, Monokai, Solarized, Catppuccin, Tokyo Night, Rosé Pine, Everforest, Kanagawa, Synthwave 84…) plus System Default, which follows your Mac's light or dark appearance, and forced light/dark variants.

Change it in **Settings → General → Themes**, where a live preview shows headings, body text, code, and checkboxes in the theme before you commit.

The theme touches everything in the app — editor, lists, heatmap, and the syntax highlighting in your entries. It never changes your text, only how it looks.

A few worth knowing:

- **System Default** (the default) — matches macOS light/dark automatically
- **Dracula** — the house special (it's this website's theme too)
- **Alucard** — Dracula's light side
- **Hacker** — green on black, for the terminal nostalgia

Write in whatever makes you open the app. The words don't care.
```

- [ ] **Step 10: Build and verify all 9 pages render**

Run: `npm run build && npx -y pagefind --site dist --glob 'consistent-notes/docs/**/*.html'`
Expected: 10 HTML pages in `dist/consistent-notes/docs/` (index + 9). Spot-check one in a browser.

- [ ] **Step 11: Commit**

```bash
git add src/content/docs/
git commit -m "feat(docs): getting started and using-the-app pages"
```

---

## Task 8: Content — Markdown section (2 files)

**Files:**
- Create: `src/content/docs/markdown.md`
- Create: `src/content/docs/markdown-reference.md`

- [ ] **Step 1: `markdown.md`**

```markdown
---
title: What is Markdown?
description: The writing format Consistent Notes uses — plain text that styles as you type.
---

Markdown is a way of formatting text with plain characters you already type: `*asterisks*` for italic, `#` for headings, `-` for bullets. You write `**bold**` and the app shows **bold**, while the file on disk stays plain text that any editor can read, forever.

## Why entries are Markdown

Your entries are yours. A journal written in Markdown isn't trapped in an app — every entry is a dated `.md` file you can [open anywhere](/consistent-notes/docs/markdown-export/), and the formatting travels with it. Ten years from now, any text editor on Earth will render it.

## How it works in Consistent Notes

The editor highlights as you type — italic shows italic, headings take color, code gets a chip — but the underlying characters stay in the file. By default formatting characters are hidden except on the line you're editing; see [writing entries](/consistent-notes/docs/writing-notes/) for the visibility setting and the typing conveniences (auto-pairs, smart lists, emoji shortcodes).

You never have to learn it all. **⌘B** is bold, **⌘I** is italic, and the toolbar buttons insert the rest. Markdown is just what shows up in the file when you do.

Ready for the full syntax? The [Markdown reference](/consistent-notes/docs/markdown-reference/) has every character Consistent Notes understands.
```

- [ ] **Step 2: `markdown-reference.md`**

```markdown
---
title: Markdown reference
description: Every piece of Markdown syntax Consistent Notes understands, in one page.
---

Everything below works in every entry. Keyboard-shortcut forms are listed where they exist — or find them by holding **⌘**.

## Headings

| Syntax | Result |
|---|---|
| `# Heading` | Heading level 1 |
| `## Heading` | Heading level 2 |
| `### Heading` | Heading 3+ (deeper levels render the same) |

Headings render bold, with color by level. The `#` marks are hidden except on the line you're editing.

## Text emphasis

| Syntax | Result | Shortcut |
|---|---|---|
| `**bold**` or `__bold__` | **bold** | **⌘B** |
| `*italic*` or `_italic_` | *italic* | **⌘I** |
| `~~strikethrough~~` | ~~strikethrough~~ | **⌘⇧S** |
| `~underline~` | underline | **⌘U** |
| `` `code` `` | `code` | **⌘E** |
| `[text](https://…)` | a link | **⌘L** |

Underline uses single tildes: `~like this~`. (It's not standard Markdown — it's a Consistent Notes convention that keeps your text readable while you type.)

## Lists

| Syntax | Result |
|---|---|
| `- item` or `* item` | bullet list |
| `1. item` | numbered list (auto-increments as you type) |
| `- [ ] item` | open todo |
| `- [x] item` | done todo |
| `- [-] item` | cancelled todo |

Indent with **⇥** (four spaces per level) to nest. Todos cascade: check a parent and everything nested beneath it checks too. Details in [Todos & rollover](/consistent-notes/docs/todos/).

## Blocks

| Syntax | Result |
|---|---|
| `> text` | blockquote (nests with `>>`) |
| `---` (alone on a line) | a full-width divider |

A divider line shows as a clean horizontal rule in the editor, with the raw dashes visible only on the line you're editing.

## Emoji

| Syntax | Result |
|---|---|
| `:shortcode` | emoji autocomplete — type `:fire`, press **⏎** for 🔥 |

## What about tables and images?

Deliberately missing. Consistent Notes is a journal, and journals are words: tables, images, and code fences would make entries heavier without making them better written. Anything you type that isn't in the tables above simply shows as plain text — nothing is ever stripped from your entries. If a future you wants images in entries, [say so](/consistent-notes/docs/contact-support/) — may add later if requested.
```

- [ ] **Step 3: Build and verify**

Run: `npm run build && npx -y pagefind --site dist --glob 'consistent-notes/docs/**/*.html'`
Expected: 12 pages in `dist/consistent-notes/docs/`. Check the reference page renders tables and `kbd` styled.

- [ ] **Step 4: Commit**

```bash
git add src/content/docs/markdown.md src/content/docs/markdown-reference.md
git commit -m "feat(docs): markdown pages"
```

---

## Task 9: Content — Reference section (2 files)

**Files:**
- Create: `src/content/docs/keyboard-shortcuts.md`
- Create: `src/content/docs/settings.md`

- [ ] **Step 1: `keyboard-shortcuts.md`**

```markdown
---
title: Keyboard shortcuts
description: Every shortcut in Consistent Notes, grouped the way the app groups them.
---

Hold **⌘** for three-quarters of a second, anywhere in the app, and the shortcuts overlay appears — filtered to wherever you are (list, editor, or ToDos) and to vim variants when vim is on. This page is that overlay, plus the shortcuts it doesn't show.

## The global shortcut

| Shortcut | Action |
|---|---|
| **⇧⌘C** | Show or hide Consistent Notes from anywhere (changeable in Settings → Shortcuts) |

## Notes list

| Shortcut | Action |
|---|---|
| **⎵** | Open today's entry |
| **⏎** | Open the selected day |
| **↑ / ↓** | Move between days |
| **⌘↑ / ⌘↓** | Top of list / start of month |
| **⌘1 / ⌘2 / ⌘3** | Notes / Heatmap / ToDos |
| **⌘⇧F** | Search every entry |
| **⌘,** | Settings |
| Hold **⌘** | Shortcuts overlay |

## Editor

| Shortcut | Action |
|---|---|
| **⌘B / ⌘I / ⌘E / ⌘L / ⌘U** | Bold / italic / code / link / underline |
| **⌘⇧S** | Strikethrough |
| **⌘⇧B** | Blockquote |
| **⌘⇧1 / ⌘⇧2 / ⌘⇧3** | Heading 1 / 2 / 3 |
| **⌘⇧7 / ⌘⇧8** | Ordered list / bullet list |
| **`[` then `]`** | Todo checkbox |
| **⌘F** | Find in this entry |
| **⌘⇧F** | Search every entry |
| **⌘R** | Roll over todos |
| **⌘S** | Save now |
| **⌘⏎** | Save and close |
| **⌘[ / ⌘]** | Previous / next day's entry |
| **⌘T** | View this entry's todos |
| **⌘⇧T** | Toggle the formatting toolbar |
| **⌘;** | Check spelling (with spell check on) |
| **⇥ / ⇧⇥** | Indent / outdent |
| **⎋** | Close the editor |

## ToDos tab

| Shortcut | Action |
|---|---|
| **⏎** | Open the most recent entry for a todo |
| **⌘⏎** | Open the original entry |
| **⌘⇧⏎** | Toggle the selected todo |
| **↑ / ↓** | Move between todos |
| **⌘↑ / ⌘↓** | First / last todo |

## Vim (when enabled)

With vim mode on, the lists take **j / k / gg / G / o / O**, and the editor becomes fully modal — motions, operators, text objects, visual modes, `u` / **⌃r** undo/redo, `/` find. **?** in the editor shows the complete vim reference. See [Vim mode](/consistent-notes/docs/vim-mode/).
```

- [ ] **Step 2: `settings.md`**

```markdown
---
title: Settings
description: Every setting in Consistent Notes and what it does.
---

Open Settings with **⌘,** or from the gear menu. Four tabs: General, Shortcuts, Data, and Subscription.

## General

**Editor**

| Setting | Default | What it does |
|---|---|---|
| Auto Save | on | Saves 1.5 s after you stop typing (and on close/navigate) |
| Roll Over Todos | off | Copies open todos from previous days into today's entry automatically |
| Spell Check | off | Underlines misspellings as you type |
| Autocorrect | off | Needs spell check on |
| Markdown delimiters | Current line | When formatting characters show: Always / Current line / Hidden |
| Hide formatting toolbar | off | Hides the toolbar (same as **⌘⇧T**) |

**Reminders** — enable the daily notification and set its time (default 9:00 AM). See [Reminders](/consistent-notes/docs/reminders/).

**Startup** — Launch at login (off by default).

**Themes** — all 27 themes with a live preview. See [Themes](/consistent-notes/docs/themes/).

**View** — Hide tab bar (view switching stays on **⌘1/⌘2/⌘3**); More vertical space (a taller popover).

**Vim Mode** — the two vim toggles, visual-line movement, escape sequence, indicator, and hardcore mode. See [Vim mode](/consistent-notes/docs/vim-mode/).

## Shortcuts

The global shortcut recorder (**⇧⌘C** default) and the full shortcut reference for the current mode.

## Data

The notes folder (where Markdown exports go — see [Where your entries live](/consistent-notes/docs/where-your-notes-live/)), **Show in Finder**, and Recovery's **Rescan** button, which imports dated `.md` files from the folder for days missing in the app. Rescan never touches entries that already have content.

## Subscription

Your plan status: trial days remaining, plan, renewal date, and buttons to change plans, restore purchases, or manage the subscription in your App Store account.
```

- [ ] **Step 3: Build and verify**

Run: `npm run build && npx -y pagefind --site dist --glob 'consistent-notes/docs/**/*.html'`
Expected: 14 pages in `dist/consistent-notes/docs/`.

- [ ] **Step 4: Commit**

```bash
git add src/content/docs/keyboard-shortcuts.md src/content/docs/settings.md
git commit -m "feat(docs): reference pages"
```

---

## Task 10: Content — Data section (3 files)

**Files:**
- Create: `src/content/docs/where-your-notes-live.md`
- Create: `src/content/docs/markdown-export.md`
- Create: `src/content/docs/sync.md`

- [ ] **Step 1: `where-your-notes-live.md`**

````markdown
---
title: Where your entries live
description: Your journal is plain Markdown files on your Mac — nothing hidden, nothing locked in.
---

Every entry you write is saved twice: once in the app's own store, and once as a plain Markdown file on disk, written at the same moment. This page is about the files.

## The default folder

By default the files live inside the app's sandboxed container:

```text
~/Library/Containers/io.bravewaffles.consistency/Data/Documents/Consistency Notes/
```

(Yes, that's a deep path — it's what App Store sandboxing requires. The next section is about getting out of it.)

Inside, entries are organized by year, one `.md` file per day, named by date:

```text
Consistency Notes/
├── 2026/
│   ├── 2026-08-20.md
│   └── 2026-08-21.md
└── 2027/
    └── 2027-01-01.md
```

Each file is your entry's Markdown plus a small header with created/updated timestamps and a word count.

## Choosing your own folder

Prefer the files somewhere you can see them — `~/Documents`, a Dropbox folder, wherever? **Settings → Data → Change…** picks any folder; from then on every save writes there instead. **Show in Finder** opens the current folder in Finder.

## Reading the files elsewhere

The files are ordinary Markdown. Open them in any editor, back them up with any backup tool, version them with git, sync them with whatever you like. Nothing about them is special except the date-based names.

## Bringing files back in

**Settings → Data → Rescan** (under Recovery) reads the folder and imports any `YYYY-MM-DD.md` files for dates that don't yet have an entry in the app — useful after restoring from a backup or moving between Macs. Existing entries with content are never overwritten; renamed files aren't picked up.
````

- [ ] **Step 2: `markdown-export.md`**

```markdown
---
title: Markdown export
description: How the automatic per-entry Markdown export works.
---

Export isn't a feature you run — it's a property of how Consistent Notes saves. Every entry, at the moment it's saved, is written as a dated Markdown file. Details of the folder layout and file format are in [Where your entries live](/consistent-notes/docs/where-your-notes-live/); the short version:

- One `.md` file per day, named `YYYY-MM-DD.md`, grouped in per-year folders
- A small header in each file records created/updated times and a word count
- The folder is yours to pick (Settings → Data) and yours to use: backup, sync, git — anything

## Backups

Because every entry is already a file in a folder you control, your backup story is whatever your Mac's is. Time Machine, iCloud Drive (point the notes folder at one), or rsync to a server — all just work, because there's nothing special to back up.

## Moving to another Mac

1. Point Consistent Notes on the new Mac at a folder containing your files (Settings → Data → Change…)
2. Run **Rescan** to import every dated file
3. That's it — the entries appear with their original dates

Since the files travel with their `created`/`updated` timestamps, the import preserves when things actually happened.
```

- [ ] **Step 3: `sync.md`**

```markdown
---
title: Sync
description: Syncing between your Mac and iPhone is coming soon.
---

Consistent Notes is Mac-only today. Syncing entries between your Mac and iPhone over iCloud is coming — this page will be the first place it's documented when it ships.

In the meantime, your entries aren't trapped: every entry is a plain Markdown file in [a folder you control](/consistent-notes/docs/where-your-notes-live/), so any folder-syncing tool can move them between machines today. For moving everything to a new Mac, see [Markdown export](/consistent-notes/docs/markdown-export/).
```

- [ ] **Step 4: Build and verify**

Run: `npm run build && npx -y pagefind --site dist --glob 'consistent-notes/docs/**/*.html'`
Expected: 17 pages in `dist/consistent-notes/docs/`.

- [ ] **Step 5: Commit**

```bash
git add src/content/docs/where-your-notes-live.md src/content/docs/markdown-export.md src/content/docs/sync.md
git commit -m "feat(docs): data pages"
```

---

## Task 11: Content — Help section (3 files)

**Files:**
- Create: `src/content/docs/troubleshooting.md`
- Create: `src/content/docs/contact-support.md`
- Create: `src/content/docs/changelog.md`

- [ ] **Step 1: `troubleshooting.md`**

```markdown
---
title: Troubleshooting
description: Fixes for the things that go wrong — missing entries, quiet reminders, lost shortcuts.
---

## The app won't open with ⇧⌘C

Another app may own that shortcut. Check **Settings → Shortcuts** — but if the app isn't open, that's chicken-and-egg: open Consistent Notes from the menu bar icon or Launchpad first, then rebind the shortcut. (Rebinding records any shortcut with at least one modifier key.)

## My reminder didn't arrive

- Notifications declined? **System Settings → Notifications → Consistent Notes** needs to allow them.
- Focus/Do Not Disturb was on at reminder time — the notification delivers quietly to Notification Center.
- Reminders are once-a-day at the exact time in **Settings → General → Reminders** — check the time.

## An entry seems missing

- Search for a word you remember (**⌘⇧F**) — the entry may be filed under a different date than you expect.
- Open the Heatmap and click the day's cell — it shows the entry if one exists.
- If files were restored or moved, run **Settings → Data → Rescan** to re-import dated files. (It skips days that already have content — check the counts it reports.)

## My todo didn't roll over

Rollover only copies todos that are still **open** (`- [ ]`). A todo you completed or cancelled on a previous day stays on that day forever — that's the design: the record of when you did things is part of the journal. Also check the **Roll Over Todos** setting versus the banner — see [Todos & rollover](/consistent-notes/docs/todos/).

## Formatting characters are showing / hiding at the wrong times

That's the **Markdown delimiters** setting: **Always show**, **Current line** (default), or **Hidden** — in **Settings → General**. It's a preference, not a bug, but if it changed on you, the setting is the culprit.

## The editor is in some strange mode

If there's a badge in the editor header reading N, I, or VISUAL, vim mode is on and you're seeing vim modal states. Press **⎋** to get back to Normal, or turn vim off in **Settings → General → Vim Mode**. **?** in the editor shows the full vim reference.

## Still stuck?

[Contact support](/consistent-notes/docs/contact-support/) — a real person reads it.
```

- [ ] **Step 2: `contact-support.md`**

```markdown
---
title: Contact support
description: How to get help — and how to get a feature.
---

## Bugs and help

Email [support@bravewaffles.io](mailto:support@bravewaffles.io). Include:

- What you did, what you expected, what happened
- Your macOS version (Apple menu → About This Mac)
- Whether it happens every time

A real person reads every message. Most answers go out within a day or two.

## Feature requests

Same address — [support@bravewaffles.io](mailto:support@bravewaffles.io) — with "Feature request" in the subject. Consistent Notes is deliberately small; features get added when they'd make the journal better for everyone, not just louder. Missing something? [The Markdown reference](/consistent-notes/docs/markdown-reference/) intentionally leaves out tables and images — that kind of request is exactly what changes minds.

## Managing your subscription

Billing, cancellation, refunds, and plan changes all happen through the App Store: [Manage Subscriptions](https://apps.apple.com/account/subscriptions).
```

- [ ] **Step 3: `changelog.md` (launch placeholder)**

```markdown
---
title: Changelog
description: What's new in Consistent Notes.
---

## Launch release

The first public release of Consistent Notes on the Mac App Store.

- **The whole app**: menu bar journaling with live Markdown, todos with rollover, streaks and the year heatmap, full-text search, emoji shortcodes, 27 themes, vim mode, daily reminders, and automatic Markdown export
- **Subscription** with a 14-day free trial: $1.99/month or $19.99/year

*(Before launch: replace this section with the real launch version number and highlights, written from the launch branch — see the plan's Task 13 checklist.)*

## Earlier versions

Before the App Store release, Consistent Notes was developed and dogfooded as "Consistency" through 0.9 → 0.21, picking up vim mode, the heatmap and streaks, emoji autocomplete, todo rollover, 27 themes, and the Markdown file export along the way.
```

- [ ] **Step 4: Build and verify**

Run: `npm run build && npx -y pagefind --site dist --glob 'consistent-notes/docs/**/*.html'`
Expected: 20 HTML files (index + 19 pages).

- [ ] **Step 5: Commit**

```bash
git add src/content/docs/
git commit -m "feat(docs): help pages"
```

---

## Task 12: Cross-link the site

**Files:**
- Modify: `src/components/Nav.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/pages/consistent-notes.astro`

- [ ] **Step 1: Add Docs to the main nav**

In `src/components/Nav.astro`, change the `links` array:

```ts
const links = [
  { href: '/', label: 'Home' },
  { href: '/consistent-notes', label: 'Consistent Notes' },
  { href: '/consistent-notes/docs/', label: 'Docs' },
  { href: BLOG_URL, label: 'Blog \u2192' },
];
```

- [ ] **Step 2: Add Docs to the footer**

In `src/components/Footer.astro`, add a Docs link to the `.links` span, after Blog and before GitHub:

```html
<a href="/consistent-notes/docs/">Docs</a>
```

- [ ] **Step 3: Link the product page to the Docs**

In `src/pages/consistent-notes.astro`, after the `.cta-row` div (which holds the App Store badges), add:

```html
<p class="docs-link-line" style="margin-top: 12px; font-size: 14px;">
  Questions? <a href="/consistent-notes/docs/">Read the Docs</a>.
</p>
```

(Inline style keeps this task surgical; if you prefer, add a `.docs-link-line` class to `global.css` instead.)

- [ ] **Step 4: Verify every gate**

Run: `npm run check && npm test && npm run build`
Expected: all pass. Then `npx -y serve dist` and click through: nav has Docs on every page, product page links to Docs, docs pages show the full nav/footer chrome.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.astro src/components/Footer.astro src/pages/consistent-notes.astro
git commit -m "feat(docs): cross-link docs from nav, footer, and product page"
```

---

## Task 13: Publish-at-launch checklist (manual, at launch)

Not code — the verification the docs depend on. Run when the App Store build is final.

- [ ] **Step 1: App-side wording parity.** The heatmap legend in the shipping app must say "list items" (the current legend still says "notes" and "26+"; the user has committed to fixing it before launch — verify). Docs and app must phrase the heatmap rule identically.
- [ ] **Step 2: App Store URL.** Replace the `#` placeholder in `install-and-setup.md`'s "get it here" link with the live listing URL (mirror of `APP_STORE_MAC_URL` in `src/lib/site.ts`, which the product page also needs updated at the same time).
- [ ] **Step 3: Changelog.** Rewrite the launch section of `changelog.md` with the real version number and highlights, from the final launch branch.
- [ ] **Step 4: Fact re-verification.** Spot-check the facts in the "Source-of-truth facts" section of this plan against the shipping build: defaults (rollover off, reminder 9:00, delimiters "Current line"), the paywall flow, the export container path, `~underline~`/`---` behavior, longest streak placement, and whether global search (**⌘⇧F**) really matches case- and diacritic-insensitively (verified for ⌘F, assumed for ⌘⇧F). If the app drifted during launch prep, fix the affected pages first.
- [ ] **Step 5: Full gates + publish.** `npm run check && npm test && npm run build`, merge, deploy, then verify `https://bravewaffles.io/consistent-notes/docs/` and a ⌘K search in production.

---

## Deferred (explicitly out of scope for v1)

- Versioned docs ("requires X.Y+" callouts only if ever needed — ADR 0001)
- i18n
- Site-wide search (Pagefind scope is docs-only; extend the glob later)
- Deep links from the app into docs (maybe a Settings link later)
- Edit-this-page links (repo stays private)
- Screenshots in docs (text-only unless a page proves unavoidable)
- Analytics on docs pages

---

## Self-Review Notes

- **Spec coverage:** All 19 pages from the settled IA exist as content files with complete drafts (Getting started 2, Using the app 7, Markdown 2, Reference 2, Data 3, Help 3), plus the landing index that funnels to Install → Quickstart. (The handoff's "17 pages" count didn't match its own enumeration; the enumeration won.) Sticky left nav (Task 5), collapsible groups (mobile drawer `<details>`), on-this-page rail (Task 5 + `h2` filtering in Task 4), Pagefind ⌘K docs-only (Task 6), hamburger drawer (Task 6 Step 4), "Docs" eyebrow (Task 4), stable slugs (file-stem slugs, never rename), no versioning/i18n/edit-links (Deferred). Wording contracts verbatim on streaks/heatmap pages. `<u>` dropped everywhere; `~underline~` and `---` documented as shipped (verified on `consistency-dev` @ `06e4ffb`). Container-path default + custom-folder override documented. Publish-at-launch checklist captures the timing items (legend wording, App Store URL, changelog).
- **No placeholders:** All file contents are complete, including all 19 Markdown drafts. The only deferred values are the App Store URL and the launch changelog, both explicitly gated on launch events (Task 13) and marked in-page with remove-at-publish notes.
- **Type consistency:** `docs-nav.ts` exports `DOC_NAV`/`docSlugs()`/`slugToNavItem()`/`prevNext()` — `prevNext` returns full `DocsNavItem`s, consumed by the test and available to any pager; `DocsLayout` computes pager neighbors from the same flat list via `navHref`, so hrefs can't drift. `docs-search.ts` exports `loadPagefind()`/`runSearch()`/`initSearch()` — consumed only by `DocsSearch.astro`'s script tag. CSS class names in components match `docs.css` selectors (`docs-grid`, `docs-sidebar`, `docs-rail`, `docs-pager`, `docs-card`, `docs-search-*`, `docs-drawer`, `docs-mobile-bar`). Search button mounts exactly once per page (top of `.docs-main`); the drawer is a grid sibling inside `<Base>`, not a grid child.
```
