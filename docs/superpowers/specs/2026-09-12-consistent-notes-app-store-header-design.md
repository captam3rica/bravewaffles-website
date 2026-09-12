# Consistent Notes Page — App Store-style Header

Date: 2026-09-12

## Goal

Restructure the Consistent Notes product page hero so the app icon sits on the **left** with the title, description, and store buttons stacked in a column to its **right** — matching the Mac App Store product page layout.

## Current Behavior

`src/pages/consistent-notes.astro` renders the hero as:

- `.product-header` — title + tagline on the left, and the app icon floated to the right via `margin: 24px 96px 0 auto`.
- `.cta-row` — the Mac and iOS store badges, rendered *below* the whole header.
- `.docs-link-line` — "Questions? Read the Docs." below the badges.

## Desired Layout (Desktop)

```
[icon: 160px]  Consistent Notes
               Lives in the menu bar. There when you need it, and tucked away when you don't.
               [Download on Mac App Store] [Download on App Store (Coming soon)]
               Questions? Read the Docs.
```

Icon flush-left, text column to its right. The store badges sit under the description inside the text column.

## Mobile (≤720px)

Single centered column:

```
[icon: 160px]
Consistent Notes
Lives in the menu bar…
[Mac App Store] [App Store (Coming soon)]
Questions? Read the Docs.
```

## Implementation

### 1. `src/pages/consistent-notes.astro`

Reorder the header markup so the icon and a text block become two cells of `.product-header`, keeping the existing children (h1, tagline, badge row, docs link) but moving the badge row and docs link *inside* the text column:

```html
<div class="product-header">
  <img class="app-icon" ... />
  <div class="product-info">
    <h1>...</h1>
    <p class="tagline">...</p>
    <div class="cta-row">...</div>
    <p class="docs-link-line">...</p>
  </div>
</div>
```

The `.cta-row` and `.docs-link-line` markup and their classes are unchanged.

### 2. `src/styles/global.css`

Replace the `.product-header` and `.app-icon` rules (currently lines 127–128):

```css
.product-header { display: flex; gap: 32px; align-items: flex-start; }
.app-icon { width: 160px; height: 160px; flex: none; border-radius: 36px; }
.product-info { padding-top: 8px; min-width: 0; }
```

Remove the right-margin hack that pushed the icon to the right.

In the existing `@media (max-width: 720px)` block (line 154), add:

```css
.product-header { flex-direction: column; align-items: center; text-align: center; }
.product-header .cta-row { justify-content: center; }
```

## Out of Scope

- Badge SVGs, colors, hover behavior — unchanged.
- Any other page section (Preview, Features, Pricing, Sync).
- Home page and other pages.

## Verification

- `npm run build` completes without errors (the build also runs pagefind over the docs).
- `npm run check` (`astro check`) passes.
- Desktop and ≤720px layouts match the layouts above.