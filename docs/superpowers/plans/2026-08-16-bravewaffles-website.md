# Bravewaffles Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the new `bravewaffles.io` marketing site (Astro, GitHub Pages) with a home page, `/consistent-notes` product page, `/terms`, `/privacy`, and a 404, all themed in Dracula (dark default) with an Alucard light-mode toggle, and cross-link it to the existing Jekyll blog.

**Architecture:** A static Astro site with a shared `Base` layout, reusable `Nav`/`Footer`/`ThemeToggle`/`WaffleMark`/`WaffleHero` components, a single `global.css` design system, and a small testable `theme.ts` module for the dark/light toggle. Nav and footer are full-width elements (their divider lines span the screen) with centered 1240px `.inner` content columns, matching mock C. Deploys to GitHub Pages via a GitHub Actions workflow using `CNAME = bravewaffles.io`.

**Tech Stack:** Astro 5, TypeScript (strict), plain CSS custom properties (no framework), Vitest + jsdom (unit tests), GitHub Pages + GitHub Actions, Cloudflare DNS.

---

## Decisions from the grill-me session

Confirmed answers (from the previous grilling session):

| # | Decision |
|---|---|
| 1 | Keep `blog.bravewaffles.io` as a separate site; cross-link between the two |
| 2 | `consistency` (macOS) + `consistency-mobile` (iOS) are **one product**: Consistent Notes. Sub-page at `/consistent-notes` |
| 3 | "Get the app" CTAs eventually link to the Mac App Store and iOS App Store respectively |
| 4 | Minimal page approach |
| 5 | Design/theme/motif flows through all pages |
| 8 | Build tool: **Astro** |
| 9 | Host on GitHub Pages; DNS via Cloudflare |
| 10 | ~~Waffle blob also appears in the footer~~ **Reversed on review** — footer matches mock C (links + copy, no mark) |
| 11 | Subscription pricing with free trial (StoreKit: $1.99/mo, $19.99/yr, 14-day trial) |
| 12 | ~~Hero from the mock set (mock C layout) + the superhero-waffle hero candidate~~ **Reversed on review** — home matches mock C exactly: text-only hero, no image |
| 15 | Develop until ready; publish when ready |
| 16 | macOS App Store first; Homebrew/direct-download package later |
| 18 | Likely more app pages later; keep Dracula background + purple accent |

**Assumptions** (answers 6, 7, 13, 14, 17 were letter-only and the options were lost — these are the plan's interpretation; flag if wrong):
- Q6 → The superhero waffle is the site motif, used on the home hero. **Reversed on review** — home is text-only per mock C (no hero image).
- Q7 → The monochrome round waffle is the nav icon and favicon. **Reversed on review** — nav brand uses the generic icon from mock C. (`WaffleMark`/`WaffleHero`/`SvgDefs` components are kept on disk but currently unused, reserved for re-enabling the motif later.) The favicon (`public/favicon.svg`) still uses the waffle mark.
- Q13 → Terms/privacy use standard Apple-recommended legal language as a reference where applicable.
- Q14 → Include favicon, OG/social metadata, and a 404 page.
- Q17 → Support **both** dark (default) and light themes via a toggle.

**Deferred:** Analytics (Q19 — the user asked what it would be for). Decision: omit third-party analytics for v1 (YAGNI, privacy). Revisit with a privacy-respecting option (e.g. Plausible) once the app is live and traffic exists.

---

## Project facts (from research, do not re-derive)

- App display name (App Store-facing): **Consistent Notes**. Current in-app name is "Consistency" (rename is part of the unmerged StoreKit branch).
- Tagline: "There when you need it, and tucked away when you don't."
- macOS menu-bar journaling app; min macOS 14.0. iOS companion planned (CloudKit sync), not built.
- Pricing: $1.99/mo, $19.99/yr, 14-day free trial (StoreKit products `io.bravewaffles.consistency.sub.monthly` / `.yearly`).
- Not yet live on any App Store. Bundle: `io.bravewaffles.consistency`. Team ID `7N4JUZ4Z6U`, Bravewaffles LLC.
- App paywall already links to `https://bravewaffles.io/privacy` and `https://bravewaffles.io/terms` — the site must host both.
- Blog repo: `https://github.com/captam3rica/blog.bravewaffles.io` (Jekyll); nav lives in `_layouts/default.html`.

---

## File Structure

New site root: `/Users/captam3rica/dev/bravewaffles-website/` (the `mocks/` directory stays as-is; scaffold the site around it).

```
package.json
astro.config.mjs
tsconfig.json
vitest.config.ts
.gitignore
.github/workflows/deploy.yml
public/
  CNAME
  favicon.svg
  og.svg
  og.png
src/
  styles/global.css
  lib/theme.ts
  lib/theme.test.ts
  lib/site.ts
  layouts/Base.astro
  components/SvgDefs.astro
  components/WaffleMark.astro
  components/WaffleHero.astro
  components/Nav.astro
  components/Footer.astro
  components/ThemeToggle.astro
  pages/index.astro
  pages/consistent-notes.astro
  pages/terms.astro
  pages/privacy.astro
  pages/404.astro
```

Responsibility: `theme.ts` owns theme state/logic (testable); `site.ts` owns site-wide constants (URLs, product facts); `global.css` owns all styling; `SvgDefs` defines shared SVG masks once; `WaffleMark`/`WaffleHero` are pure SVG components; `Nav`/`Footer`/`ThemeToggle` compose the chrome; pages compose content.

---

## Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "bravewaffles-website",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "NODE_OPTIONS=--no-experimental-webstorage vitest run"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "jsdom": "^26.0.0",
    "typescript": "^5.6.0",
    "vitest": "^4.1.10"
  }
}
```

Note: `NODE_OPTIONS=--no-experimental-webstorage` is required on Node ≥24 (where an experimental global `localStorage` shadows jsdom's and breaks the tests); it's a no-op on Node 22 (CI). Do not remove it. `vitest@^4` bundles the jsdom environment, so no separate `vitest-environment-jsdom` package is needed.

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bravewaffles.io',
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 5: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.DS_Store
```

- [ ] **Step 6: Initialize git and install dependencies**

```bash
cd /Users/captam3rica/dev/bravewaffles-website
git init
npm install
```

Expected: `node_modules/` created, `package-lock.json` written, no errors.

- [ ] **Step 7: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json vitest.config.ts .gitignore package-lock.json
git commit -m "chore: scaffold astro site"
```

---

## Task 2: Design system (`global.css`)

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Write the design system**

```css
:root {
  color-scheme: dark;
  --bg: #282a36; --cl: #44475a; --fg: #f8f8f2; --comment: #6272a4;
  --purple: #bd93f9; --cyan: #8be9fd; --green: #50fa7b; --pink: #ff79c6; --yellow: #f1fa8c;
  --outer: #191a21;
}
html[data-theme='light'] {
  color-scheme: light;
  --bg: #fffbeb; --cl: #dedccf; --fg: #1f1f1f; --comment: #6c664b;
  --purple: #644ac9; --cyan: #036a96; --green: #14710a; --pink: #a3144d; --yellow: #846e15;
  --outer: #bcbab3;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  display: flex; flex-direction: column; min-height: 100vh;
  background: var(--bg); color: var(--fg);
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  line-height: 1.6;
}

.wrap {
  max-width: 1240px; margin: 0 auto; padding: 0 40px; width: 100%; flex: 1;
  display: flex; flex-direction: column;
}

nav { border-bottom: 1px solid var(--cl); }
nav .inner {
  max-width: 1240px; margin: 0 auto; width: 100%;
  display: flex; gap: 20px; align-items: baseline; justify-content: space-between;
  padding: 28px 40px; font-size: 14px;
}
nav .brand { display: flex; align-items: center; gap: 10px; color: var(--purple); font-weight: 700; text-decoration: none; }
nav .links { display: flex; gap: 20px; }
nav .right { display: flex; align-items: baseline; gap: 20px; }
nav a { color: var(--comment); text-decoration: none; }
nav a:hover { color: var(--fg); }

.theme {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; padding: 0; flex: none;
  background: transparent; border: 1px solid var(--cl); border-radius: 999px;
  color: var(--comment); cursor: pointer;
}
.theme:hover { color: var(--purple); border-color: var(--purple); }
.theme svg { display: block; }
html[data-theme='light'] .theme .icon-moon { display: none; }
html[data-theme='dark'] .theme .icon-sun { display: none; }

main { flex: 1; display: flex; flex-direction: column; padding: 96px 48px 64px; }

h1 { font-size: 64px; font-weight: 700; margin-bottom: 16px; }
.tagline { font-size: 18px; color: var(--fg); max-width: 540px; }
.tagline .accent { color: var(--purple); }

.projects { margin-top: 72px; }
.projects h2 { font-size: 14px; color: var(--comment); text-transform: uppercase; letter-spacing: .12em; margin-bottom: 16px; }
.projects .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
.card { display: block; border: 1px solid var(--cl); border-radius: 8px; padding: 20px; text-decoration: none; color: var(--fg); transition: border-color .15s; }
.card:hover { border-color: var(--purple); }
.card h3 { font-size: 18px; margin-bottom: 6px; }
.badge { color: var(--cyan); font-size: 12px; font-weight: 400; }
.card p { color: var(--comment); font-size: 14px; margin-bottom: 10px; }
.meta { color: var(--yellow); font-size: 13px; }

footer { border-top: 1px solid var(--cl); }
footer .inner {
  max-width: 1240px; margin: 0 auto; width: 100%;
  display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap;
  font-size: 14px; padding: 24px 40px 40px;
}
footer .copy { color: var(--comment); }
footer .links { display: flex; gap: 20px; flex-wrap: wrap; }
footer a { color: var(--comment); text-decoration: none; }
footer a:hover { color: var(--purple); }

.page h1 { font-size: 48px; }
.section-title { font-size: 14px; color: var(--comment); text-transform: uppercase; letter-spacing: .12em; margin: 48px 0 8px; }
.cta-row { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 24px; }
.cta { display: inline-block; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-size: 15px; }
.cta-primary { background: var(--purple); color: #282a36; font-weight: 700; }
html[data-theme='light'] .cta-primary { color: #fff; }
.cta-primary:hover { filter: brightness(1.1); }
.cta-secondary { border: 1px solid var(--cl); color: var(--fg); }
.cta-secondary:hover { border-color: var(--purple); color: var(--purple); }

.features { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.feature { border: 1px solid var(--cl); border-radius: 8px; padding: 16px; }
.feature h3 { font-size: 15px; margin-bottom: 4px; color: var(--purple); }
.feature p { font-size: 14px; color: var(--comment); }

.pricing { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
.price-card { border: 1px solid var(--cl); border-radius: 8px; padding: 24px; }
.price-card.featured { border-color: var(--purple); }
.price-card h3 { font-size: 16px; }
.price { font-size: 32px; font-weight: 700; margin: 8px 0; }
.price .per { font-size: 14px; color: var(--comment); font-weight: 400; }
.price-note { font-size: 13px; color: var(--comment); }
.trial { display: inline-block; margin-top: 8px; font-size: 12px; color: var(--green); border: 1px solid var(--cl); border-radius: 999px; padding: 2px 10px; }

.prose { max-width: 720px; }
.prose h1 { font-size: 44px; }
.prose h2 { font-size: 20px; margin: 32px 0 8px; color: var(--purple); }
.prose p { margin: 0 0 16px; }
.prose ul { margin: 0 0 16px; padding-left: 24px; }
.prose a { color: var(--purple); }

@media (max-width: 720px) {
  .wrap { padding: 0 24px; }
  main { padding: 64px 24px 48px; }
  nav .inner { flex-wrap: wrap; padding: 20px 24px; }
  footer .inner { padding: 20px 24px 32px; }
  h1 { font-size: 44px; }
  .projects .grid { grid-template-columns: 1fr; }
  .features { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Verify it compiles (create a temporary minimal page first, or run build after Task 4)**

Verification of this CSS happens via the build in Task 4. No commit yet.

---

## Task 3: Theme logic (TDD)

**Files:**
- Create: `src/lib/theme.ts`
- Create: `src/lib/theme.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { getInitialTheme, applyTheme, toggleTheme, THEME_STORAGE_KEY } from './theme';

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('defaults to dark when nothing is stored', () => {
    expect(getInitialTheme()).toBe('dark');
  });

  it('reads the stored theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    expect(getInitialTheme()).toBe('light');
  });

  it('ignores invalid stored values', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'neon');
    expect(getInitialTheme()).toBe('dark');
  });

  it('applies the theme to the document and persists it', () => {
    applyTheme('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('toggles between themes', () => {
    expect(toggleTheme('dark')).toBe('light');
    expect(toggleTheme('light')).toBe('dark');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './theme'`

- [ ] **Step 3: Write the implementation**

```ts
export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'bravewaffles-theme';

export function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'dark';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function toggleTheme(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark';
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/theme.ts src/lib/theme.test.ts
git commit -m "feat: add theme state logic"
```

---

## Task 4: Site constants, shared SVG defs, and base layout

**Files:**
- Create: `src/lib/site.ts`
- Create: `src/components/SvgDefs.astro`
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Create `src/lib/site.ts`**

```ts
export const SITE_NAME = 'Bravewaffles';
export const SITE_DOMAIN = 'https://bravewaffles.io';
export const BLOG_URL = 'https://blog.bravewaffles.io';
export const GITHUB_URL = 'https://github.com/captam3rica';

// Replace with the live listing URLs when the app is approved for each store.
// macOS: https://apps.apple.com/app/id<MAC_ID>  ·  iOS: https://apps.apple.com/app/id<IOS_ID>
export const APP_STORE_MAC_URL = '#mac-app-store';
export const APP_STORE_IOS_URL = '#ios-app-store';

export const PRODUCT_NAME = 'Consistent Notes';
export const PRODUCT_TAGLINE =
  "There when you need it, and tucked away when you don't.";
export const PRICE_MONTHLY = '$1.99';
export const PRICE_YEARLY = '$19.99';
export const TRIAL_NOTE = '14-day free trial';
```

- [ ] **Step 2: Create `src/components/SvgDefs.astro`**

Defines the waffle-grid mask exactly once; every `WaffleMark` references the global id.

```astro
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <mask id="waffle-grid">
      <circle cx="256" cy="256" r="180" fill="#ffffff" />
      <g fill="#000000">
        <rect x="134" y="134" width="52" height="52" rx="10" />
        <rect x="198" y="134" width="52" height="52" rx="10" />
        <rect x="262" y="134" width="52" height="52" rx="10" />
        <rect x="326" y="134" width="52" height="52" rx="10" />

        <rect x="134" y="198" width="52" height="52" rx="10" />
        <rect x="198" y="198" width="52" height="52" rx="10" />
        <rect x="262" y="198" width="52" height="52" rx="10" />
        <rect x="326" y="198" width="52" height="52" rx="10" />

        <rect x="134" y="262" width="52" height="52" rx="10" />
        <rect x="198" y="262" width="52" height="52" rx="10" />
        <rect x="262" y="262" width="52" height="52" rx="10" />
        <rect x="326" y="262" width="52" height="52" rx="10" />

        <rect x="134" y="326" width="52" height="52" rx="10" />
        <rect x="198" y="326" width="52" height="52" rx="10" />
        <rect x="262" y="326" width="52" height="52" rx="10" />
        <rect x="326" y="326" width="52" height="52" rx="10" />
      </g>
    </mask>
  </defs>
</svg>
```

- [ ] **Step 3: Create `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import SvgDefs from '../components/SvgDefs.astro';

const {
  title,
  description = 'Bravewaffles builds Consistent Notes, a macOS journaling app that lives in your menubar.',
} = Astro.props;
---

<html lang="en" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={Astro.url} />
    <meta property="og:image" content={new URL('/og.png', Astro.site)} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={new URL('/og.png', Astro.site)} />
    <script is:inline>
      (function () {
        try {
          if (localStorage.getItem('bravewaffles-theme') === 'light') {
            document.documentElement.dataset.theme = 'light';
          }
        } catch (e) {}
      })();
    </script>
  </head>
  <body>
    <SvgDefs />
    <Nav />
    <div class="wrap">
      <slot />
    </div>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Verify the build works**

Run: `npm run build`
Expected: build succeeds with `Generated ... pages` (may be 0 pages yet — that's fine; it proves CSS/scaffold compiles).

- [ ] **Step 5: Commit**

```bash
git add src/lib/site.ts src/components/SvgDefs.astro src/layouts/Base.astro src/styles/global.css
git commit -m "feat: add base layout, site constants, and svg defs"
```

---

## Task 5: Waffle components

**Files:**
- Create: `src/components/WaffleMark.astro`
- Create: `src/components/WaffleHero.astro`

- [ ] **Step 1: Create `src/components/WaffleMark.astro`**

```astro
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect width="512" height="512" fill="currentColor" mask="url(#waffle-grid)" />
</svg>
```

- [ ] **Step 2: Create `src/components/WaffleHero.astro`**

The full-color superhero waffle (from `mocks/superhero-waffle-color.svg`, title updated to drop "Faceless").

```astro
<svg class="waffle-hero" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Superhero waffle">
  <path d="M176 112
           C 110 164, 62 218, 48 306
           C 38 380, 96 440, 172 440
           L 340 440
           C 416 440, 474 380, 464 306
           C 450 218, 402 164, 336 112
           C 300 88, 212 88, 176 112 Z"
        fill="#e63946" stroke="#3a2410" stroke-width="10"
        stroke-linejoin="round" stroke-linecap="round"/>
  <rect x="112" y="116" width="288" height="288" rx="56"
        fill="#f8b64c" stroke="#3a2410" stroke-width="14"/>
  <g fill="#e09a3c">
    <rect x="138" y="142" width="50" height="50" rx="12"/>
    <rect x="200" y="142" width="50" height="50" rx="12"/>
    <rect x="262" y="142" width="50" height="50" rx="12"/>
    <rect x="324" y="142" width="50" height="50" rx="12"/>
    <rect x="138" y="204" width="50" height="50" rx="12"/>
    <rect x="200" y="204" width="50" height="50" rx="12"/>
    <rect x="262" y="204" width="50" height="50" rx="12"/>
    <rect x="324" y="204" width="50" height="50" rx="12"/>
    <rect x="138" y="266" width="50" height="50" rx="12"/>
    <rect x="200" y="266" width="50" height="50" rx="12"/>
    <rect x="262" y="266" width="50" height="50" rx="12"/>
    <rect x="324" y="266" width="50" height="50" rx="12"/>
    <rect x="138" y="328" width="50" height="50" rx="12"/>
    <rect x="200" y="328" width="50" height="50" rx="12"/>
    <rect x="262" y="328" width="50" height="50" rx="12"/>
    <rect x="324" y="328" width="50" height="50" rx="12"/>
  </g>
  <ellipse cx="206" cy="220" rx="25" ry="29" fill="#fff6e3" stroke="#3a2410" stroke-width="8"/>
  <ellipse cx="306" cy="220" rx="25" ry="29" fill="#fff6e3" stroke="#3a2410" stroke-width="8"/>
  <circle cx="216" cy="209" r="13" fill="#3a2410"/>
  <circle cx="316" cy="209" r="13" fill="#3a2410"/>
  <circle cx="212" cy="205" r="4" fill="#ffffff"/>
  <circle cx="312" cy="205" r="4" fill="#ffffff"/>
  <path d="M 234 304 Q 256 320 278 304" fill="none" stroke="#3a2410" stroke-width="9" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/WaffleMark.astro src/components/WaffleHero.astro
git commit -m "feat: add waffle svg components"
```

---

## Task 6: Nav, Footer, and ThemeToggle components

**Files:**
- Create: `src/components/ThemeToggle.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create `src/components/ThemeToggle.astro`**

```astro
<button id="theme-toggle" class="theme" aria-label="Toggle theme">
  <svg class="icon-moon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M11.712 3.45a.75.75 0 0 0-.668-1.197c-5.414.494-8.436 4.752-8.764 9.105c-.328 4.361 2.037 8.975 7.451 10.166c5.686 1.25 11.472-2.837 12.016-8.646a.75.75 0 0 0-1.189-.676c-2.837 2.069-6.08 1.316-8.136-.724c-2.054-2.039-2.8-5.239-.71-8.028"/></svg>
  <svg class="icon-sun" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 19a1 1 0 0 1 .993.883L13 20v1a1 1 0 0 1-1.993.117L11 21v-1a1 1 0 0 1 1-1m6.313-2.09l.094.083l.7.7a1 1 0 0 1-1.32 1.497l-.094-.083l-.7-.7a1 1 0 0 1 1.218-1.567zm-11.306.083a1 1 0 0 1 .083 1.32l-.083.094l-.7.7a1 1 0 0 1-1.497-1.32l.083-.094l.7-.7a1 1 0 0 1 1.414 0M4 11a1 1 0 0 1 .117 1.993L4 13H3a1 1 0 0 1-.117-1.993L3 11zm17 0a1 1 0 0 1 .117 1.993L21 13h-1a1 1 0 0 1-.117-1.993L20 11zM6.213 4.81l.094.083l.7.7a1 1 0 0 1-1.32 1.497l-.094-.083l-.7-.7A1 1 0 0 1 6.11 4.74zm12.894.083a1 1 0 0 1 .083 1.32l-.083.094l-.7.7a1 1 0 0 1-1.497-1.32l.083-.094l.7-.7a1 1 0 0 1 1.414 0M12 2a1 1 0 0 1 .993.883L13 3v1a1 1 0 0 1-1.993.117L11 4V3a1 1 0 0 1 1-1m0 5a5 5 0 1 1-4.995 5.217L7 12l.005-.217A5 5 0 0 1 12 7"/></svg>
</button>

<script>
  import { applyTheme, toggleTheme } from '../lib/theme';
  const btn = document.getElementById('theme-toggle');
  btn?.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    applyTheme(toggleTheme(current));
  });
</script>
```

- [ ] **Step 2: Create `src/components/Nav.astro`**

```astro
---
import { BLOG_URL } from '../lib/site';
import ThemeToggle from './ThemeToggle.astro';

const links = [
  { href: '/', label: 'Home' },
  { href: '/consistent-notes', label: 'Consistent Notes' },
  { href: BLOG_URL, label: 'Blog \u2192' },
];
---
<nav>
  <div class="inner">
    <a class="brand" href="/">
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10s10-4.49 10-10S17.51 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8"/><path fill="currentColor" d="M16.97 8.97L15 10.94L13.06 9l1.97-1.97l-1.06-1.06L12 7.94l-1.97-1.97l-1.06 1.06L10.94 9L9 10.94L7.03 8.97l-1.06 1.06L7.94 12l-1.97 1.97l1.06 1.06L9 13.06L10.94 15l-1.97 1.97l1.06 1.06L12 16.06l1.97 1.97l1.06-1.06L13.06 15L15 13.06l1.97 1.97l1.06-1.06L16.06 12l1.97-1.97zM12 13.94L10.06 12L12 10.06L13.94 12z"/></svg>
      <span>~/bravewaffles</span>
    </a>
    <div class="right">
      <div class="links">
        {links.map((l) => <a href={l.href}>{l.label}</a>)}
      </div>
      <ThemeToggle />
    </div>
  </div>
</nav>
```

> **Revision (on review):** the brand icon reverts to the generic circle/target SVG from mock C (decision #7 reversed). `WaffleMark` is no longer imported here.

- [ ] **Step 3: Create `src/components/Footer.astro`**

```astro
---
import { BLOG_URL, GITHUB_URL, SITE_NAME } from '../lib/site';
---
<footer>
  <div class="inner">
    <span class="links">
      <a href={BLOG_URL}>Blog</a>
      <a href={GITHUB_URL}>GitHub</a>
      <a href="/terms">Terms</a>
      <a href="/privacy">Privacy</a>
    </span>
    <span class="copy">&copy; 2026 {SITE_NAME}, LLC.</span>
  </div>
</footer>
```

> **Revision (on review):** the footer reverts to the mock C structure (`.links` + `.copy`, no waffle mark, no `.foot-left`) — decision #10 reversed. `WaffleMark` is no longer imported here.

- [ ] **Step 4: Verify check passes**

Run: `npm run check`
Expected: PASS (no type errors)

- [ ] **Step 5: Commit**

```bash
git add src/components/ThemeToggle.astro src/components/Nav.astro src/components/Footer.astro
git commit -m "feat: add nav, footer, and theme toggle"
```

---

## Task 7: Public assets (CNAME, favicon, og image)

**Files:**
- Create: `public/CNAME`
- Create: `public/favicon.svg`
- Create: `public/og.svg`

- [ ] **Step 1: Create `public/CNAME`**

```
bravewaffles.io
```

- [ ] **Step 2: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#bd93f9"/>
  <mask id="m">
    <circle cx="256" cy="256" r="180" fill="#fff"/>
    <g fill="#000">
      <rect x="134" y="134" width="52" height="52" rx="10"/>
      <rect x="198" y="134" width="52" height="52" rx="10"/>
      <rect x="262" y="134" width="52" height="52" rx="10"/>
      <rect x="326" y="134" width="52" height="52" rx="10"/>
      <rect x="134" y="198" width="52" height="52" rx="10"/>
      <rect x="198" y="198" width="52" height="52" rx="10"/>
      <rect x="262" y="198" width="52" height="52" rx="10"/>
      <rect x="326" y="198" width="52" height="52" rx="10"/>
      <rect x="134" y="262" width="52" height="52" rx="10"/>
      <rect x="198" y="262" width="52" height="52" rx="10"/>
      <rect x="262" y="262" width="52" height="52" rx="10"/>
      <rect x="326" y="262" width="52" height="52" rx="10"/>
      <rect x="134" y="326" width="52" height="52" rx="10"/>
      <rect x="198" y="326" width="52" height="52" rx="10"/>
      <rect x="262" y="326" width="52" height="52" rx="10"/>
      <rect x="326" y="326" width="52" height="52" rx="10"/>
    </g>
  </mask>
  <rect width="512" height="512" fill="#bd93f9" mask="url(#m)"/>
</svg>
```

- [ ] **Step 3: Create `public/og.svg`** (1200x630 share image)

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#282a36"/>
  <circle cx="600" cy="330" r="140" fill="#bd93f9"/>
  <text x="600" y="560" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="42" font-weight="700" fill="#f8f8f2">bravewaffles</text>
</svg>
```

- [ ] **Step 3b: Create `public/og.png`** (1200x630 raster share image)

`og.svg` is the editable source, but Twitter/Facebook/Slack ignore SVG OG images, so a raster is required for share cards. Generate it from the SVG with sharp (already in the dependency tree) at 1200x630:

```bash
node -e "const sharp=require('sharp');const fs=require('fs');sharp(fs.readFileSync('public/og.svg'),{density:144}).resize(1200,630,{fit:'cover'}).png().toFile('public/og.png').then(i=>console.log('og.png',i.width+'x'+i.height))"
```

`src/layouts/Base.astro` points `og:image` and `twitter:image` at `/og.png` (with `og:image:width`/`height`/`type` and a `summary_large_image` twitter card). The `og.svg` stays as the design source; only the raster is referenced in the deployed `<head>`.

- [ ] **Step 4: Commit**

```bash
git add public/CNAME public/favicon.svg public/og.svg public/og.png
git commit -m "feat: add cname, favicon, and og image"
```

---

## Task 8: Home page

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create the page**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="bravewaffles — apps and things">
  <main>
    <h1>bravewaffles</h1>
    <p class="tagline">We build <span class="accent">Consistent Notes</span>, a macOS journaling app that lives in your menubar and syncs with your iPhone. There when you need it, and tucked away when you don't.</p>

    <section class="projects">
      <h2>Projects</h2>
      <div class="grid">
        <a class="card" href="/consistent-notes">
          <h3>Consistent Notes <span class="badge">macOS &middot; iOS</span></h3>
          <p>A menu-bar journaling app with streaks, heatmaps, todos, and vim motions. Notes sync between your Mac and iPhone over iCloud.</p>
          <span class="meta">14-day free trial &middot; $1.99/mo &middot; $19.99/yr</span>
        </a>
      </div>
    </section>
  </main>
</Base>
```

> **Revision (on review):** the home page now matches mock C exactly — text-only hero (no image), so `WaffleHero` is not imported and there is no `<section class="hero">`. The superhero-waffle motif (decisions #6/#12) was reversed by the user after seeing the built page. `WaffleHero.astro` / `WaffleMark.astro` / `SvgDefs.astro` are kept on disk but unused.

- [ ] **Step 2: Build and visually verify**

Run: `npm run dev` and open http://localhost:4321
Expected: full-width top/bottom lines, centered 1240px content, waffle hero on the right, projects grid, theme toggle works (persists across reload), light theme is Alucard.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add home page"
```

---

## Task 9: Consistent Notes product page

**Files:**
- Create: `src/pages/consistent-notes.astro`

- [ ] **Step 1: Create the page**

```astro
---
import Base from '../layouts/Base.astro';
import {
  APP_STORE_MAC_URL, APP_STORE_IOS_URL, PRODUCT_NAME, PRODUCT_TAGLINE,
  PRICE_MONTHLY, PRICE_YEARLY, TRIAL_NOTE,
} from '../lib/site';

const features = [
  { name: 'Streaks & heatmaps', body: 'Build a daily habit with streaks and a full-year heatmap view.' },
  { name: 'Todos that roll over', body: 'Hierarchical todos, cross-day rollover, and cascade checking.' },
  { name: 'Markdown editor', body: 'Syntax highlighting, auto-pairing, smart Home/End, and checkbox cascade.' },
  { name: 'Vim support', body: 'Modal editing with j/k motions, find bar, and hardcore mode.' },
  { name: 'Daily reminders', body: 'A gentle nudge via notifications when you want it.' },
  { name: '27 themes', body: 'Dracula, Solarized, Nord, Gruvbox, Monokai, and more.' },
  { name: 'Full-text search', body: 'Instant search across every note (Cmd+Shift+F).' },
  { name: 'Backup & import/export', body: 'JSON import/export with merge, and automatic backups.' },
];
---
<Base title={`${PRODUCT_NAME} — a macOS journaling app`}>
  <main class="page">
    <h1>{PRODUCT_NAME}</h1>
    <p class="tagline">{PRODUCT_TAGLINE}</p>
    <div class="cta-row">
      <a class="cta cta-primary" href={APP_STORE_MAC_URL}>Get the app for macOS</a>
      <a class="cta cta-secondary" href={APP_STORE_IOS_URL}>Get the app for iOS</a>
    </div>

    <h2 class="section-title">Features</h2>
    <div class="features">
      {features.map((f) => (
        <div class="feature">
          <h3>{f.name}</h3>
          <p>{f.body}</p>
        </div>
      ))}
    </div>

    <h2 class="section-title">Pricing</h2>
    <div class="pricing">
      <div class="price-card">
        <h3>Monthly</h3>
        <div class="price">{PRICE_MONTHLY}<span class="per">/mo</span></div>
        <span class="trial">{TRIAL_NOTE}</span>
      </div>
      <div class="price-card featured">
        <h3>Yearly</h3>
        <div class="price">{PRICE_YEARLY}<span class="per">/yr</span></div>
        <span class="trial">{TRIAL_NOTE}</span>
        <p class="price-note">Save 16% vs. monthly</p>
      </div>
    </div>

    <h2 class="section-title">Sync</h2>
    <p class="prose">Your notes live in the menu bar and sync between your Mac and iPhone over iCloud. See our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.</p>
  </main>
</Base>
```

- [ ] **Step 2: Build and verify**

Run: `npm run build` then `npm run preview`
Expected: page renders with features grid, pricing cards, CTAs; check the nav/footer are present and the theme toggle works.

- [ ] **Step 3: Commit**

```bash
git add src/pages/consistent-notes.astro
git commit -m "feat: add consistent notes product page"
```

---

## Task 10: Terms page

**Files:**
- Create: `src/pages/terms.astro`

- [ ] **Step 1: Create the page**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Terms of Service — Bravewaffles">
  <main class="prose">
    <h1>Terms of Service</h1>
    <p>Last updated: <strong>August 16, 2026</strong></p>

    <h2>1. The Service</h2>
    <p>Bravewaffles, LLC ("Bravewaffles", "we", "us") provides Consistent Notes, a macOS and iOS journaling application (the "Service"). These Terms govern your use of the Service.</p>

    <h2>2. Subscriptions and Payments</h2>
    <p>Consistent Notes is a subscription service billed through the Apple App Store. Your subscription renews automatically until cancelled in your App Store account settings. Pricing and the free-trial terms are displayed on the product page and in the App Store listing.</p>

    <h2>3. Acceptable Use</h2>
    <p>You agree not to misuse the Service, attempt to circumvent its protections, or use it to store unlawful content. Your notes are yours; you are responsible for what you write.</p>

    <h2>4. Termination</h2>
    <p>You may stop using the Service at any time. We may suspend access to prevent abuse or to comply with the law. Paid subscriptions are governed by the App Store terms.</p>

    <h2>5. Disclaimer and Limitation of Liability</h2>
    <p>The Service is provided "as is". To the maximum extent permitted by law, Bravewaffles is not liable for indirect or consequential damages arising from use of the Service.</p>

    <h2>6. Changes</h2>
    <p>We may update these Terms; we will post a revised version here with a new "Last updated" date. Continued use of the Service after a change constitutes acceptance.</p>

    <h2>7. Contact</h2>
    <p>Questions about these Terms: <a href="mailto:support@bravewaffles.io">support@bravewaffles.io</a>.</p>
  </main>
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/terms.astro
git commit -m "feat: add terms page"
```

---

## Task 11: Privacy page

**Files:**
- Create: `src/pages/privacy.astro`

- [ ] **Step 1: Create the page**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Privacy Policy — Bravewaffles">
  <main class="prose">
    <h1>Privacy Policy</h1>
    <p>Last updated: <strong>August 16, 2026</strong></p>

    <h2>1. What We Collect</h2>
    <ul>
      <li><strong>Notes you write:</strong> stored on your device and synced through iCloud using Apple's CloudKit. We cannot read your notes.</li>
      <li><strong>Purchase information:</strong> processed entirely by Apple through the App Store. We do not collect payment details.</li>
      <li><strong>Usage data:</strong> this website does not use third-party analytics or tracking scripts.</li>
    </ul>

    <h2>2. How Your Notes Are Stored</h2>
    <p>Notes live in your app's local storage and in your personal iCloud account. iCloud is governed by Apple's privacy policy and your Apple account settings.</p>

    <h2>3. What We Never Do</h2>
    <p>We do not sell your data. We do not run advertising. We do not access your notes or device data.</p>

    <h2>4. Third-Party Services</h2>
    <p>The only third party involved in the Service is Apple (App Store purchase processing and iCloud/CloudKit sync).</p>

    <h2>5. Contact</h2>
    <p>Privacy questions: <a href="mailto:support@bravewaffles.io">support@bravewaffles.io</a>.</p>
  </main>
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/privacy.astro
git commit -m "feat: add privacy page"
```

---

## Task 12: 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create the page**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="404 — not found">
  <main class="prose">
    <h1>404</h1>
    <p>That page doesn't exist. <a href="/">Go home</a>.</p>
  </main>
</Base>
```

- [ ] **Step 2: Full build + check + test pass**

Run: `npm run check && npm test && npm run build`
Expected: all pass, build emits `dist/` with all pages (index, consistent-notes, terms, privacy, 404, favicon, og, CNAME).

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: add 404 page"
```

---

## Task 13: GitHub Actions deployment workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create the workflow**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: deploy to github pages"
```

---

## Task 14: Repository, Pages settings, and DNS

Manual steps (not scriptable); run once.

- [ ] **Step 1: Create the GitHub repository and push**

```bash
cd /Users/captam3rica/dev/bravewaffles-website
gh repo create bravewaffles-website --public --source=. --push
```

Note: GitHub Pages on the free plan requires a public repo. If you want to develop privately first, create the repo as `--private`, keep the branch protected, and flip it public (and enable Pages) only when ready to publish (decision #15).

- [ ] **Step 2: Enable GitHub Pages**

In the repo → Settings → Pages → Source: **GitHub Actions**. Leave custom domain empty (the `CNAME` file in the build output sets `bravewaffles.io`). If it asks, set the custom domain to `bravewaffles.io` and enable "Enforce HTTPS".

- [ ] **Step 3: Configure Cloudflare DNS**

Add these A records for the apex `bravewaffles.io` (GitHub Pages' published IPs), proxied (orange cloud) is fine:

| Type | Name | Content |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

Leave the existing `CNAME` for `blog.bravewaffles.io` untouched.

- [ ] **Step 4: Verify**

After the workflow runs, `curl -sI https://bravewaffles.io` should return `200`. Confirm the blog cross-link still resolves (`curl -sI https://blog.bravewaffles.io` → `200`).

---

## Task 15: Cross-link the blog to the new site

Executed in the **blog repo**: `/Users/captam3rica/dev/blog.bravewaffles.io`

**Files:**
- Modify: `_layouts/default.html:29-32` (the `<nav>` block)

- [ ] **Step 1: Add the site link to the blog nav**

Change:

```html
          <nav>
            <a href="{{ site.baseurl }}/">Blog</a>
            <a href="{{ site.baseurl }}/about">About</a>
          </nav>
```

To:

```html
          <nav>
            <a href="{{ site.baseurl }}/">Blog</a>
            <a href="{{ site.baseurl }}/about">About</a>
            <a href="https://bravewaffles.io">bravewaffles.io</a>
          </nav>
```

- [ ] **Step 2: Verify locally**

Run: `bundle exec jekyll serve` in the blog repo; open the page and confirm the new link renders.

- [ ] **Step 3: Commit and push**

```bash
cd /Users/captam3rica/dev/blog.bravewaffles.io
git add _layouts/default.html
git commit -m "chore: link to bravewaffles.io"
git push
```

---

## Task 16: Store link handoff (when the app goes live)

The site is developed until ready (decision #15). Before publishing publicly, and once the macOS and iOS listings are approved:

- [ ] **Step 1: Replace the store URL constants**

In `src/lib/site.ts`, set:

```ts
export const APP_STORE_MAC_URL = 'https://apps.apple.com/app/id<MAC_ID>';
export const APP_STORE_IOS_URL = 'https://apps.apple.com/app/id<IOS_ID>';
```

- [ ] **Step 2: Re-run `npm run check && npm test && npm run build` and commit**

```bash
git add src/lib/site.ts
git commit -m "feat: link to app store listings"
git push
```

---

## Task 17: Post-launch follow-ups (deferred)

These are intentionally **not** in v1 scope:

- **Analytics (Q19):** no third-party analytics in v1. If you want numbers later, add a privacy-respecting option (e.g. Plausible) — site-visit counts and product-page click-through to the App Store are the only metrics worth tracking.
- **Homebrew / direct-download distribution (decision #16):** add a "Download for macOS" `.pkg` link on `/consistent-notes` once the packaged build process is in place.
- **More app pages (decision #18):** for each new app, copy the `index.astro` card + a product page following the `consistent-notes.astro` pattern. The grid and `Base` layout already support it.

---

## Self-Review Notes

- Spec coverage: every confirmed grill-me decision maps to a task (1→Task 15, 2/3→Task 9, 4/5→Tasks 2/8, 8→scaffold, 9→Tasks 13/14, 10→Footer, 11→Task 9, 12→Task 8, 15→Tasks 14/16, 16→Task 17, 18→Tasks 8/17). Assumptions Q6/Q7/Q13/Q14/Q17 are baked into Tasks 5/7/10/11/8. Q19 handled in Task 17.
- No placeholders: all file contents are complete. The only deferred values are the live App Store URLs in `site.ts`, which are explicitly gated on a launch event (Task 16).
- Type consistency: `theme.ts` exports `Theme`, `THEME_STORAGE_KEY`, `getInitialTheme`, `applyTheme`, `toggleTheme` — used consistently in the layout's inline script, `ThemeToggle.astro`, and tests. `site.ts` constants are the single source for product facts and URLs.
