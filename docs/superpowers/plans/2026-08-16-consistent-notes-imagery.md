# Consistent Notes Product Imagery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the official Consistent Notes app icon and three real screenshots to the `/consistent-notes` product page, so it reads like a real macOS app's product page.

**Architecture:** Copy the app's vector app icon and three screenshots into `public/` (self-contained site bag; no cross-repo references), then edit `src/pages/consistent-notes.astro` to put the icon beside the title and add a 3-up bordered "Preview" gallery, with the matching CSS appended to `src/styles/global.css`. Nothing else on the site changes.

**Tech Stack:** Astro 5, plain CSS custom properties (Dracula/Alucard tokens already in `global.css`), static `public/` assets.

**Spec:** `docs/superpowers/specs/2026-08-16-consistent-notes-product-imagery-design.md`

---

## File Structure

- **Create (copied into `public/`, self-contained):**
  - `public/app-icon.svg` — copy of the app's official `.app` bundle icon
  - `public/screenshots/editor-view.png` — renamed copy of `editor_view` screenshot
  - `public/screenshots/notes-list.png` — renamed copy of `notes_list_view` screenshot
  - `public/screenshots/year-view.png` — renamed copy of `year_view` screenshot
- **Modify:** `src/styles/global.css` — append product-header + shots-grid rules; add one responsive rule
- **Modify:** `src/pages/consistent-notes.astro` — wrap title in `.product-header` with the icon; insert the "Preview" gallery section

The reference `screenshots/` directory (sibling of `src/`) and `mocks/` stay as design artifacts; only the renamed copies under `public/screenshots/` ship in the build.

---

## Task 1: Copy assets into `public/`

**Files:**
- Create: `public/app-icon.svg`
- Create: `public/screenshots/editor-view.png`
- Create: `public/screenshots/notes-list.png`
- Create: `public/screenshots/year-view.png`

- [ ] **Step 1: Copy the app icon**

```bash
cd /Users/captam3rica/dev/bravewaffles-website
cp /Users/captam3rica/dev/consistency/Consistency/Assets.xcassets/AppIcon.appiconset/AppIcon.svg public/app-icon.svg
```

- [ ] **Step 2: Copy and rename the three screenshots**

The three source screenshots (timestamp order, labeled by the user):
- `Screenshot 2026-08-16 at 10.54.13.png` → `editor_view`
- `Screenshot 2026-08-16 at 10.54.26.png` → `notes_list_view`
- `Screenshot 2026-08-16 at 10.54.33.png` → `year_view`

```bash
mkdir -p public/screenshots
cp "screenshots/Screenshot 2026-08-16 at 10.54.13.png" public/screenshots/editor-view.png
cp "screenshots/Screenshot 2026-08-16 at 10.54.26.png" public/screenshots/notes-list.png
cp "screenshots/Screenshot 2026-08-16 at 10.54.33.png" public/screenshots/year-view.png
```

- [ ] **Step 3: Verify the copies and that the build ships them**

```bash
ls -la public/app-icon.svg public/screenshots/
npm run build
ls dist/app-icon.svg dist/screenshots/
```

Expected: four files present under `public/`; build succeeds; `dist/app-icon.svg` and `dist/screenshots/{editor-view,notes-list,year-view}.png` all exist (Astro copies `public/` verbatim).

- [ ] **Step 4: Commit**

```bash
git add public/app-icon.svg public/screenshots/
git commit -m "feat: add app icon and product screenshots to public"
```

---

## Task 2: Add the product-header and shots-grid CSS

**Files:**
- Modify: `src/styles/global.css` (insert a new block after the `.feature p { ... }` line; add one rule inside the `@media (max-width: 720px)` block)

- [ ] **Step 1: Insert the new component rules**

In `src/styles/global.css`, find this exact line (it sits just before the `.pricing` block):

```css
.feature p { font-size: 14px; color: var(--comment); }
```

Insert this block immediately after it:

```css

/* Product page: icon header + screenshot gallery */
.product-header { display: flex; gap: 24px; align-items: center; }
.app-icon { width: 64px; height: 64px; flex: none; border-radius: 14px; }
.shots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 16px; }
.shot { margin: 0; border: 1px solid var(--cl); border-radius: 8px; overflow: hidden; }
.shot img { display: block; width: 100%; height: auto; }
.shot figcaption { padding: 10px 14px; font-size: 12px; color: var(--comment); text-transform: uppercase; letter-spacing: .12em; }
```

- [ ] **Step 2: Add the responsive stacking rule**

In the same file, find the `@media (max-width: 720px)` block. It currently ends with:

```css
  .features { grid-template-columns: 1fr; }
}
```

Change it to:

```css
  .features { grid-template-columns: 1fr; }
  .shots-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify the build still passes**

```bash
npm run check && npm run build
```

Expected: `check` 0 errors; build emits 5 pages. (The new classes are defined but not yet referenced — unused CSS is harmless and expected until Task 3.)

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add product-header and shots-grid styles"
```

---

## Task 3: Wire the icon and gallery into the product page

**Files:**
- Modify: `src/pages/consistent-notes.astro`

- [ ] **Step 1: Wrap the title in a product header with the app icon**

In `src/pages/consistent-notes.astro`, find this exact block near the top of the body:

```astro
  <main class="page">
    <h1>{PRODUCT_NAME}</h1>
    <p class="tagline">{PRODUCT_TAGLINE}</p>
```

Replace it with:

```astro
  <main class="page">
    <div class="product-header">
      <img class="app-icon" src="/app-icon.svg" width="64" height="64" alt="Consistent Notes app icon" />
      <div>
        <h1>{PRODUCT_NAME}</h1>
        <p class="tagline">{PRODUCT_TAGLINE}</p>
      </div>
    </div>
```

(The `.page h1` sizing and `.tagline` rules still apply unchanged — they're descendant selectors, so nesting `h1` inside `.product-header > div` keeps them working. No other change to the `main` opening.)

- [ ] **Step 2: Insert the "Preview" gallery after the CTA row**

In the same file, find this exact block:

```astro
    <div class="cta-row">
      <a class="cta cta-primary" href={APP_STORE_MAC_URL}>Get the app for macOS</a>
      <a class="cta cta-secondary" href={APP_STORE_IOS_URL}>Get the app for iOS</a>
    </div>

    <h2 class="section-title">Features</h2>
```

Replace it with:

```astro
    <div class="cta-row">
      <a class="cta cta-primary" href={APP_STORE_MAC_URL}>Get the app for macOS</a>
      <a class="cta cta-secondary" href={APP_STORE_IOS_URL}>Get the app for iOS</a>
    </div>

    <h2 class="section-title">Preview</h2>
    <div class="shots-grid">
      <figure class="shot">
        <img src="/screenshots/editor-view.png" width="1012" height="1012" loading="lazy" decoding="async" alt="Consistent Notes editor view" />
        <figcaption>Editor view</figcaption>
      </figure>
      <figure class="shot">
        <img src="/screenshots/notes-list.png" width="1012" height="1012" loading="lazy" decoding="async" alt="Consistent Notes notes list" />
        <figcaption>Notes list</figcaption>
      </figure>
      <figure class="shot">
        <img src="/screenshots/year-view.png" width="1012" height="1012" loading="lazy" decoding="async" alt="Consistent Notes year heatmap view" />
        <figcaption>Year view</figcaption>
      </figure>
    </div>

    <h2 class="section-title">Features</h2>
```

- [ ] **Step 3: Verify the build references the assets**

```bash
npm run check && npm run build
```

Expected: `check` 0 errors; build emits 5 pages. Then confirm the wired references in the built output:

```bash
grep -o '/app-icon.svg\|/screenshots/[a-z-]*\.png' dist/consistent-notes/index.html | sort -u
```

Expected output (order may vary):
```
/app-icon.svg
/screenshots/editor-view.png
/screenshots/notes-list.png
/screenshots/year-view.png
```

- [ ] **Step 4: Visual check (user)**

Run `npm run dev` and open http://localhost:4321/consistent-notes. Confirm: the app icon sits beside the "Consistent Notes" title; the "Preview" section shows a 3-up bordered gallery of the screenshots with captions `Editor view` / `Notes list` / `Year view`; the Features / Pricing / Sync sections below are intact; the theme toggle still works. (This step is inherently the user's eyes — the model cannot view images.)

- [ ] **Step 5: Commit**

```bash
git add src/pages/consistent-notes.astro
git commit -m "feat: add app icon and screenshot gallery to consistent notes page"
```

---

## Self-Review

- **Spec coverage:** app-icon header → Task 3 Step 1 + Task 2 CSS; Preview gallery with 3 shots + captions → Task 3 Step 2 + Task 2 CSS; copy assets self-contained into `public/` → Task 1; responsive stacking → Task 2 Step 2; build verification + user visual → Task 3 Steps 3-4; "Preview" heading + caption wording match the spec. Out-of-scope items (nav/footer/favicon home-page hero) are untouched — no task touches them.
- **Placeholder scan:** none — every step has exact paths, exact code, and exact expected output.
- **Naming consistency:** `.product-header`, `.app-icon`, `.shots-grid`, `.shot`, `.shot img`, `.shot figcaption` are identical across the Task 2 CSS and the Task 3 markup. Asset filenames (`editor-view.png`, `notes-list.png`, `year-view.png`, `app-icon.svg`) are identical across Task 1 copies, Task 3 `src` attrs, and the Task 3 grep check.