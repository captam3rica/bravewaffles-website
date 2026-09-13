# Consistent Notes Screenshot Lightbox

**Date:** 2026-09-13
**Status:** Approved

## Summary

The Consistent Notes product page shows three app screenshots (editor, notes list, year view), each with a dark and a light variant, in a 3-up grid. Currently the images are static and not interactive. This change makes each screenshot clickable: clicking opens a larger, centered version in a lightbox with a darkened backdrop, with prev/next navigation between the three screenshots.

## Approach

Use a native `<dialog>` element (precedent: the docs search dialog in `DocsSearch.astro`), with both image variants inside each slide so the existing CSS theme swap applies for free.

### Markup (`src/pages/consistent-notes.astro`)

- Each grid `<figure class="shot">` becomes a clickable card opening the lightbox at that screenshot's index. The card is keyboard-accessible with an `aria-label` naming the screenshot.
- A single `<dialog class="lightbox">` is added to the page containing three slide groups — one per screenshot. Each slide has the dark + light `<img>` pair (classes `shot-dark` / `shot-light`) and a `<figcaption>`, mirroring the grid's structure.

### Behavior (`src/lib/lightbox.ts`, vanilla TS)

- Clicking a card calls `showModal()` and shows the slide for that screenshot.
- Because each slide holds both image variants, the existing `html[data-theme]` rules decide which is visible — the lightbox follows the theme with no extra JS.
- Prev/next buttons and `←`/`→` arrow keys cycle slides (wrapping at the ends).
- Esc closes natively (`<dialog>` behavior). A close button and clicking the darkened backdrop also close.
- The module exports a DOM-wiring `init()` plus a pure, testable function for slide index cycling.

### Styling (`src/styles/global.css`)

- `.lightbox` dialog: large image constrained to the viewport (`max-width`/`max-height`), caption below, prev/next buttons on either side, close button in a corner.
- Backdrop darkened via `::backdrop` (e.g. `rgba(0, 0, 0, .75)`), consistent in both themes.
- Theme swap rules for `.shot-dark` / `.shot-light` are extended to cover slides inside the dialog.

## Trade-offs accepted

- Both image variants are already in the DOM in the grid; the lightbox reuses those same `public/screenshots/` PNGs — no new assets, no extra downloads beyond what the page already loads.
- Native `<dialog>` provides focus trapping and Esc handling, but no focus-restoration customization beyond its defaults.

## Testing

- New `src/lib/lightbox.test.ts` (vitest + jsdom) covers the pure slide-cycling logic: prev/next order, wrapping at first/last slide.
- `npm test` must pass; `npm run check` (astro check) must pass.
- Manual check: open each screenshot from the grid, step prev/next with buttons and arrow keys, close via Esc/close button/backdrop click, and confirm the lightbox image follows a theme toggle while open.

## Out of scope

- Touch swipe gestures.
- Keyboard focus trapping beyond native `<dialog>` behavior.
- Image preloading or optimization (static PNGs from `public/`, unchanged).