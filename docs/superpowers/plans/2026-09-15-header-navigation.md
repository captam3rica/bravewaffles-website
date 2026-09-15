# Header Navigation Trim & Current-Page Indicator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trim the site-wide header to Home, Consistent Notes, and Docs (removing Blog →), and highlight the current page with a purple underline via `aria-current="page"`. Footer unchanged.

**Architecture:** Two small edits — update the links array + add `aria-current` matching in `src/components/Nav.astro`, then add one CSS rule for the active state in `src/styles/global.css`. Pure presentational change; no JS, no dependencies.

**Tech Stack:** Astro 5, shared CSS in `src/styles/global.css`.

**Spec:** `docs/superpowers/specs/2026-09-15-header-navigation-design.md`

---

### Task 1: Trim header links and add current-page matching

**Files:**
- Modify: `src/components/Nav.astro:1-11`

- [ ] **Step 1: Update the frontmatter**

In `src/components/Nav.astro`, replace the entire frontmatter block (currently lines 1-10):

```astro
---
import { BLOG_URL } from '../lib/site';
import ThemeToggle from './ThemeToggle.astro';

const links = [
  { href: '/', label: 'Home' },
  { href: '/consistent-notes', label: 'Consistent Notes' },
  { href: '/consistent-notes/docs/', label: 'Docs' },
  { href: BLOG_URL, label: 'Blog \u2192' },
];
---
```

with:

```astro
---
import ThemeToggle from './ThemeToggle.astro';

// Normalize trailing slashes so '/consistent-notes' and '/consistent-notes/' match the same link.
const path = Astro.url.pathname.replace(/\/+$/, '') || '/';

const links = [
  { href: '/', label: 'Home', match: path === '/' },
  { href: '/consistent-notes', label: 'Consistent Notes', match: path === '/consistent-notes' },
  { href: '/consistent-notes/docs/', label: 'Docs', match: path.startsWith('/consistent-notes/docs') },
];
---
```

Notes:
- `BLOG_URL` import is removed; the `Blog →` link is gone (it stays in the footer).
- `match` is precomputed so the render loop stays simple.

- [ ] **Step 2: Render `aria-current` on links**

In `src/components/Nav.astro`, replace the links map (currently line 21):

```astro
        {links.map((l) => <a href={l.href}>{l.label}</a>)}
```

with:

```astro
        {links.map((l) => <a href={l.href} aria-current={l.match ? 'page' : undefined}>{l.label}</a>)}
```

Everything else in the file (brand, right side, ThemeToggle) is untouched.

- [ ] **Step 3: Verify the build and check**

Run: `npm run build && npm run check`
Expected: build completes with no errors; `astro check` reports no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: trim header links and highlight current page"
```

### Task 2: Style the active header link

**Files:**
- Modify: `src/styles/global.css:49-50` (the `nav a` rules)

- [ ] **Step 1: Add the active-link rule**

In `src/styles/global.css`, after the existing rules:

```css
nav a { color: var(--comment); text-decoration: none; }
nav a:hover { color: var(--fg); }
```

add:

```css
nav a[aria-current='page'] { color: var(--purple); border-bottom: 2px solid var(--purple); padding-bottom: 2px; }
```

- [ ] **Step 2: Verify the build, check, and tests**

Run: `npm run build && npm run check && npm test`
Expected: build completes with no errors; `astro check` reports no errors; vitest passes (31 tests).

- [ ] **Step 3: Manual checks**

Run: `npm run dev` and confirm at each page:
- `/` → Home underlined purple, others plain
- `/consistent-notes` → Consistent Notes underlined, Docs NOT underlined
- `/consistent-notes/docs/` and a nested docs page (e.g. `/consistent-notes/docs/getting-started/`) → Docs underlined
- Footer still shows Blog, Docs, GitHub, Terms, Privacy

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "style: underline active header link"
```

---

## Self-Review

**Spec coverage:**
- Header links trimmed to Home, Consistent Notes, Docs → Task 1 Step 1 (Blog removed, `BLOG_URL` import dropped)
- Current-page indicator via `aria-current="page"` → Task 1 Step 2
- Active link purple + underline → Task 2 Step 1
- Docs matches all `/consistent-notes/docs/*` paths (incl. trailing-slash normalization) → Task 1 Step 1
- Footer unchanged → no footer edits anywhere in the plan ✓
- 404 shows no highlight (path matches nothing) → implicit in `match` logic ✓

**Placeholders:** none — all edits show exact source.

**Type consistency:** `links` entries now carry a boolean `match`; used as `l.match` in the map. `path` derived from `Astro.url.pathname`. Consistent across both steps.