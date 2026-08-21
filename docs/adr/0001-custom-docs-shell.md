# Build the Docs on a custom Astro shell, not Starlight

The Consistent Notes Docs need the standard docs-site furniture — sticky left nav, on-this-page rail, search — which Starlight (used by opencode.ai and herdr.dev) provides for free. We decided to build a custom shell instead: Astro content collections, the site's existing `Base.astro` layout patterns, plain CSS, and Pagefind for search. Starlight's Tailwind-based theme system would fight the site's Dracula/monospace brand identity, and the docs would look like every Starlight site unless we heavily overrode it anyway. The docs live at `/consistent-notes/docs/` inside the marketing site, sharing its Nav, Footer, and theme tokens.

## Considered Options

- **Starlight**: free search, versioning, i18n, and rail — but a second theme system to fight, and generic-looking output.
- **Custom (chosen)**: full brand cohesion, consistent with the rest of the site; we own ~3 layout components (left nav, on-this-page rail, search drawer) and wire up Pagefind, scope docs-only for v1.

## Consequences

- No built-in versioning or i18n — deliberately unversioned ("always latest") docs; add "requires X.Y+" callouts only if ever needed.
- Search scope starts docs-only; Pagefind can extend site-wide later.
- Mobile pattern: hamburger slide-in drawer, rail collapses to an accordion (matches Starlight's own pattern).
