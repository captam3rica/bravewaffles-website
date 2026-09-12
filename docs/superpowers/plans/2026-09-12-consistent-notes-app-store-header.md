# App Store-style Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the Consistent Notes page hero so the app icon sits on the left with the title, tagline, store badges, and docs link in a column to its right, stacking to a centered column on mobile.

**Architecture:** Two small, independent edits — restructure the hero markup in `consistent-notes.astro` (wrap icon + text in `.product-header` with a `.product-info` column), and replace the `.product-header`/`.app-icon` CSS with a left-aligned flex row plus mobile column rules in `global.css`. This is a presentational change; no logic, data, or component interfaces change.

**Tech Stack:** Astro 5, scoped CSS in `src/styles/global.css`, no new dependencies.

**Spec:** `docs/superpowers/specs/2026-09-12-consistent-notes-app-store-header-design.md`

---

### Task 1: Restructure the hero markup

**Files:**
- Modify: `src/pages/consistent-notes.astro:23-37`

- [ ] **Step 1: Reorder the hero markup**

In `src/pages/consistent-notes.astro`, replace the `.product-header` block (the `<div class="product-header">...</div>`, the `.cta-row` div, and the `.docs-link-line` paragraph — currently lines 24-37) so the icon is the first child of `.product-header` and the text sits in a `.product-info` column containing the `h1`, tagline, badge row, and docs link:

```astro
<div class="product-header">
  <img class="app-icon" src="/app-icon.png" width="128" height="128" alt="Consistent Notes app icon" />
  <div class="product-info">
    <h1>{PRODUCT_NAME}</h1>
    <p class="tagline">{PRODUCT_TAGLINE}</p>
    <div class="cta-row">
      <AppStoreBadge platform="mac" href={APP_STORE_MAC_URL} />
      <AppStoreBadge platform="ios" href={APP_STORE_IOS_URL} comingSoon />
    </div>
    <p class="docs-link-line" style="margin-top: 12px; font-size: 14px;">
      Questions? <a href="/consistent-notes/docs/">Read the Docs</a>.
    </p>
  </div>
</div>
```

The exact imports, feature data, and all sections below the docs link (Preview, Features, Pricing, Sync) are untouched.

- [ ] **Step 2: Verify the page still builds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/consistent-notes.astro
git commit -m "feat: restructure Consistent Notes hero markup for App Store-style layout"
```

### Task 2: Style the left-aligned header (desktop + mobile)

**Files:**
- Modify: `src/styles/global.css:127-128` (`.product-header` / `.app-icon` rules)
- Modify: `src/styles/global.css:154-163` (the `@media (max-width: 720px)` block)

- [ ] **Step 1: Replace the desktop header rules**

In `src/styles/global.css`, replace the current block at lines 127-128:

```css
/* Product page: icon header + screenshot gallery */
.product-header { display: flex; gap: 24px; align-items: flex-start; }
.app-icon { width: 160px; height: 160px; flex: none; border-radius: 36px; margin: 24px 96px 0 auto; }
```

with:

```css
/* Product page: icon header + screenshot gallery */
.product-header { display: flex; gap: 32px; align-items: flex-start; }
.app-icon { width: 160px; height: 160px; flex: none; border-radius: 36px; }
.product-info { padding-top: 8px; min-width: 0; }
```

Note: the right-margin hack (`margin: 24px 96px 0 auto`) that pushed the icon rightward is removed.

- [ ] **Step 2: Add the mobile column rules**

In the same file, inside the existing `@media (max-width: 720px)` block (currently lines 154-163), add these two rules after the `.shots-grid { grid-template-columns: 1fr; }` line:

```css
.product-header { flex-direction: column; align-items: center; text-align: center; }
.product-header .cta-row { justify-content: center; }
```

- [ ] **Step 3: Verify the build and check**

Run: `npm run build && npm run check`
Expected: build completes with no errors; `astro check` reports no errors.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: left-align Consistent Notes hero with App Store-style column layout"
```

---

## Self-Review

**Spec coverage:**
- Desktop icon-left / text-right layout → Task 1 Step 1 + Task 2 Step 1
- Store badges under the description inside the text column → Task 1 Step 1 (badges moved into `.product-info`)
- Docs link retained under badges → Task 1 Step 1
- 160px icon, 36px radius preserved → Task 2 Step 1
- Mobile centered column (≤720px) → Task 2 Step 2
- Out-of-scope items (badge SVG, other sections) not touched ✓

**Placeholders:** none — all edits show exact source and exact CSS.

**Type consistency:** Only Astro markup and CSS class names; `.product-header`, `.app-icon`, `.product-info`, `.cta-row` used consistently across tasks and matching the spec.