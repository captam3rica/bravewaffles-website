# Consistent Notes Product Imagery — Design

> **Context:** This is a design addendum to the site plan in `docs/superpowers/plans/2026-08-16-bravewaffles-website.md`. The `/consistent-notes` product page (Task 9) shipped as text-only. The user reviewed the built site and asked to add real app imagery. The home-page mock-C motif reversal (decisions #6/#7/#10/#12 reversed) is already done and committed; this spec is scoped to the **product page only**.

## Goal

Make `/consistent-notes` read like a real macOS app's product page by adding the official app icon and three real screenshots, without touching the rest of the site or the home page's mock-C layout.

## Assets

Source assets already present on disk:

- **App icon (vector):** `/Users/captam3rica/dev/consistency/Consistency/Assets.xcassets/AppIcon.appiconset/AppIcon.svg` — a cream/parchment squircle (rx 229 in a 1024 viewBox) with a checklist (three lines) and a diagonal pen stroke, the official `.app` bundle icon. PNGs up to `Icon-512@2x.png` (1024px) also exist if a raster is ever needed; the SVG is the source of truth.
- **Screenshots (PNG, 1012×1012, square):** `/Users/captam3rica/dev/bravewaffles-website/screenshots/`:
  - `Screenshot 2026-08-16 at 10.54.13.png` → **editor_view**
  - `Screenshot 2026-08-16 at 10.54.26.png` → **notes_list_view**
  - `Screenshot 2026-08-16 at 10.54.33.png` → **year_view**

## Design decisions (locked)

- **Layout approach:** A — app icon beside the title in the page's header, plus a 3-up bordered screenshot gallery in a new "Preview" section. (Big-banner and gallery-only approaches were considered and rejected: square screenshots crop awkwardly into a wide banner; a gallery with no app icon reads less like "an app".)
- **Where the icon goes:** the product page header only. It is **not** added to the nav brand, favicon, or footer (those stayed mock-C after the recent reversal).
- **Copy:** Section heading `"Preview"`. Captions: `Editor view`, `Notes list`, `Year view` (title-case, the existing `--comment` uppercase treatment handles styling).
- **No mock-ups:** these are the user's real screenshots; they will not be edited, filtered, or restyled.

## File changes

### New, copied into `public/`
- `public/app-icon.svg` — copy of the app's `AppIcon.svg`.
- `public/screenshots/editor-view.png` — renamed copy of `Screenshot 2026-08-16 at 10.54.13.png`.
- `public/screenshots/notes-list.png` — renamed copy of `Screenshot 2026-08-16 at 10.54.26.png`.
- `public/screenshots/year-view.png` — renamed copy of `Screenshot 2026-08-16 at 10.54.33.png`.

All four are copied (not referenced across repo boundaries) so the site is self-contained and the deploy bag is predictable. The original `screenshots/` directory (sibling of `src/`, outside `public/`) stays for reference; the site build only ships `public/`.

### Edit: `src/pages/consistent-notes.astro`
New section order:
1. `<div class="product-header">` containing `<img class="app-icon" src="/app-icon.svg" width="64" height="64" alt="Consistent Notes app icon">` then the existing `<h1>{PRODUCT_NAME}</h1>` and `<p class="tagline">…</p>` (the `h1` and tagline move **inside** `.product-header`; the `main.page` wrapper is unchanged).
2. `.cta-row` CTAs — unchanged.
3. **New** `<h2 class="section-title">Preview</h2>` + `<div class="shots-grid">` with three `<figure class="shot">`:
   ```astro
   <div class="shots-grid">
     <figure class="shot">
       <img src="/screenshots/editor-view.png" width="1012" height="1012" loading="lazy" decoding="async" alt="Consistent Notes editor view">
       <figcaption>Editor view</figcaption>
     </figure>
     <figure class="shot">
       <img src="/screenshots/notes-list.png" width="1012" height="1012" loading="lazy" decoding="async" alt="Consistent Notes notes list">
       <figcaption>Notes list</figcaption>
     </figure>
     <figure class="shot">
       <img src="/screenshots/year-view.png" width="1012" height="1012" loading="lazy" decoding="async" alt="Consistent Notes year heatmap view">
       <figcaption>Year view</figcaption>
     </figure>
   </div>
   ```
4. Features · Pricing · Sync — unchanged.

### Edit: `src/styles/global.css` (appended near the product-page rules)
- `.product-header { display:flex; gap:24px; align-items:center; }` — icon left, title block right.
- `.app-icon { width:64px; height:64px; flex:none; border-radius:14px; }` — the squircle is already in the SVG; the radius is harmless polish and keeps corners consistent with the rounded UI elsewhere.
- `.shots-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:20px; margin-top:16px; }` — same `minmax` pattern as `.features` so the two grids share rhythm.
- `.shot { margin:0; border:1px solid var(--cl); border-radius:8px; overflow:hidden; }` — inherits the card border language.
- `.shot img { display:block; width:100%; height:auto; }` — square images scale to the column; original 1012×1012 + explicit `width`/`height` attrs prevent layout shift.
- `.shot figcaption { padding:10px 14px; font-size:12px; color:var(--comment); text-transform:uppercase; letter-spacing:.12em; }` — matches the `.section-title`/`.projects h2` caption styling already in `global.css`.

### Edit: responsive — the existing `@media (max-width:720px)` block
- Add `.shots-grid { grid-template-columns:1fr; }` so the gallery stacks on small phones (mirrors the `.projects .grid` / `.features` stacking already there).
- The `.product-header` keeps its row layout at small widths (64px icon + stacked title fits at 320px); no change needed.

## What stays the same

- Nav, footer, home page, theme tabs, favicon, OG image, deploy workflow — untouched.
- `src/lib/site.ts`, all pricing/features copy, all tokens.
- `<h1>` still gets `.page h1` sizing (48px). The CTA row, Features grid, Pricing cards, and Sync prose are unchanged.
- `mocks/` and the reference `screenshots/` dir (outside `public/`) stay as design artifacts; only the renamed copies under `public/screenshots/` ship in the build.

## Verification

- `npm run check` → 0 errors (the new `img` attrs are standard Astro HTML).
- `npm run build` → succeeds; `dist/consistent-notes/index.html` references `/app-icon.svg` and the three `/screenshots/*.png`; `dist/app-icon.svg` and `dist/screenshots/*.png` exist (Astro copies `public/`).
- Visual: open `/consistent-notes` on the dev server and confirm the icon+title header, the 3-up Preview gallery, and that Features/Pricing/Sync are intact below. (This step is inherently the user's eyes — I cannot view images.)

## Plan integration

A new task is appended to the implementation plan as **Task 9b: Product-page imagery** (the existing Task 9 stays as the text-only base; Task 9b layers the icon + gallery on top, editing the same files). Task 9b: copy the 4 assets into `public/`, edit `consistent-notes.astro` + `global.css`, verify build, commit.

## Out of scope (explicitly)

- Adding the app icon to nav/footer/favicon (the motif was deliberately removed from those — reversal stands).
- Home-page hero image (deliberately removed to match mock C).
- An OG image that uses the app icon — the current `og.png` stays until a branded OG is consciously designed.
- Editing or restyling the screenshots themselves.
- More than 3 screenshots / a lightbox / a carousel (YAGNI; a responsive 3-up grid is enough).