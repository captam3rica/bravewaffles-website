# Header Navigation Trim & Current-Page Indicator

**Date:** 2026-09-15
**Status:** Approved

## Summary

The site-wide header (`src/components/Nav.astro`) currently lists Home, Consistent Notes, Docs, and Blog → plus the theme toggle. This change trims the header to Home, Consistent Notes, and Docs (Blog moves out of the header — it remains in the footer), and adds a current-page indicator: the active link gets a purple underline via `aria-current="page"`. The footer is unchanged.

## Approach

A pure presentational/markup change in `Nav.astro` plus a small CSS rule in `src/styles/global.css`. No new dependencies, no JS.

### Markup (`src/components/Nav.astro`)

- Links array becomes: `{ href: '/', label: 'Home' }`, `{ href: '/consistent-notes', label: 'Consistent Notes' }`, `{ href: '/consistent-notes/docs/', label: 'Docs' }`. The `Blog →` entry (currently `{ href: BLOG_URL, ... }`) is removed.
- Each link renders `aria-current="page"` when its section is the current page, computed from `Astro.url.pathname`:
  - Home: `pathname === '/'`
  - Consistent Notes: `pathname === '/consistent-notes'` (exact — docs pages are a different section)
  - Docs: `pathname.startsWith('/consistent-notes/docs/')` (covers `/consistent-notes/docs/` and every nested docs page)
- The theme toggle stays in place.

### Styling (`src/styles/global.css`)

- Add a rule for the active link next to the existing `nav a` rules:
  - `nav a[aria-current='page'] { color: var(--purple); border-bottom: 2px solid var(--purple); padding-bottom: 2px; }`
  - Inactive links keep their current `--comment` color; hover unchanged.

## Trade-offs accepted

- Blog is no longer reachable from the header; it remains in the footer, which is the intended simplification.
- Docs is now duplicated in both header and footer (unchanged footer). Acceptable: header serves primary navigation, footer serves full site links.
- The 404 page shows no highlighted header link (its path matches no section) — expected.

## Testing

- `npm run check` (astro check) and `npm run build` must pass; `npm test` (vitest) must still pass.
- Manual checks at each page:
  - `/` → Home underlined
  - `/consistent-notes` → Consistent Notes underlined (not Docs)
  - `/consistent-notes/docs/` and a nested docs page → Docs underlined
  - Footer unchanged; Blog still present there.

## Out of scope

- Changing the footer links.
- The docs sidebar/drawer navigation (unchanged).
- The theme toggle behavior.