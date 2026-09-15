# Homepage One-Screen Minimal Layout

**Date:** 2026-09-15
**Status:** Approved

## Summary

The homepage currently shows a hero (waffle, headline, tagline) followed by a descriptive project card for Consistent Notes. On mobile the page scrolls: the hero carries a 160px top gap, the card body is tall, and nav + footer push content past one viewport. This change makes the homepage fit one screen on mobile and, at every breakpoint, replaces the descriptive project card with a minimal pill link in the spirit of thebrowser.company — while keeping the hero at its current size and keeping the "Projects" heading.

## Approach

Apply the change in `src/styles/global.css` and `src/pages/index.astro` only. No new assets, no JS.

### Markup (`src/pages/index.astro`)

- Keep the hero section exactly as-is (waffle images, `h1`, tagline).
- Keep the "Projects" heading.
- Replace the descriptive card body with a simple pill link to `/consistent-notes`:
  - Pill shows the Consistent Notes pencil icon (`/menubar-icon.svg`, the same `card-icon` treatment: white icon via `filter: invert(1)` in dark, none in light) next to the "Consistent Notes" name.
  - Pill is a bordered, rounded-full link with a purple border and purple text, matching the existing `cta-secondary`-style accents.

### Styling (`src/styles/global.css`)

- **Minimal pill link (all breakpoints):** drop the `.card` descriptive-card styles from the homepage path; the pill uses purple border/text, white icon, rounded-full shape.
- **Mobile (`@media (max-width: 720px)`):**
  - Reduce the hero's top margin (currently `160px`) and the `.projects` top margin so nav + hero + projects + footer fit one viewport.
  - Vertically center the hero + projects block in the space between nav and footer (flex centering on the `main`/`hero` container).
  - The existing breakpoint already collapses the grid to one column; the pill link keeps it centered.

## Trade-offs accepted

- The descriptive card copy ("menu bar notes app with streaks, heatmaps, todos…") is removed from the homepage; the product page at `/consistent-notes` remains the home of that detail.
- Desktop loses the descriptive card too, per the "minimal everywhere" decision. The tagline carries the pitch.
- No content is hidden via media queries — the same minimal markup renders at every size, which keeps the two-breakpoint look consistent.

## Testing

- `npm run check` (astro check) must pass.
- Manual checks:
  - Mobile viewport (~390px): nav, hero, Projects heading + pill, and footer all visible without scrolling; hero + projects vertically centered.
  - Desktop: hero unchanged in size; pill link replaces the card; page looks intentional with whitespace.
  - Light and dark themes: pill icon inverts correctly.

## Out of scope

- Changes to the `/consistent-notes` product page.
- Any new assets or JavaScript.
- Adjusting the hero's appearance at any size (kept at current size).