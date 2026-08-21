# Theme-Aware Screenshots

**Date:** 2026-08-19
**Status:** Approved

## Summary

The Consistent Notes product page shows three app screenshots (editor, notes list, year view). The site supports dark (default) and light themes via a `data-theme` attribute on `<html>`. Currently the screenshots are dark-only. This change shows light-theme screenshots when light mode is active.

## Assets

Six new 1012×1012 screenshots (three light, three dark) live in `images/`. They replace the existing dark-only set in `public/screenshots/`.

Naming (in `public/screenshots/`):

- `editor-view-dark.png` / `editor-view-light.png`
- `notes-list-dark.png` / `notes-list-light.png`
- `year-view-dark.png` / `year-view-light.png` (source file `year_veiw_light.png` has a typo; corrected on copy)

The three old screenshots (`editor-view.png`, `notes-list.png`, `year-view.png`) are deleted.

## Approach

CSS-only swap using the existing `data-theme` pattern (same as the brand waffle white/black swap in `src/styles/global.css`):

- Each `<figure class="shot">` in `src/pages/consistent-notes.astro` renders two `<img>` elements with classes `shot-dark` and `shot-light`. Both carry the same `width`, `height`, `loading="lazy"`, `decoding="async"`, and `alt` text as today.
- Global CSS hides the inactive variant:

```css
html[data-theme='light'] .shot-dark { display: none; }
html[data-theme='dark'] .shot-light { display: none; }
```

No JavaScript. Toggle is instant since both images are in the DOM (the theme toggle only changes `data-theme`).

## Trade-offs accepted

- Both variants download regardless of active theme (~100–215 KB each). Acceptable for a marketing page.
- If an image fails to load, the other variant still renders after a theme toggle (same failure mode as the brand waffle swap).

## Testing

- `src/lib/theme.test.ts` is unaffected (no theme logic changes).
- Manual check: toggle theme on `/consistent-notes` and confirm all three figures swap; verify lazy loading and layout (no CLS) in both themes.
