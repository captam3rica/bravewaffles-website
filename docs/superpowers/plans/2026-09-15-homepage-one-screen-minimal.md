# Homepage One-Screen Minimal Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage fit one mobile screen and adopt a minimal, thebrowser.company-style project link everywhere, while keeping the hero at its current size and keeping the "Projects" heading.

**Architecture:** Two presentational edits — replace the descriptive project card in `src/pages/index.astro` with a bordered pill link carrying the pencil icon, then update `src/styles/global.css` (pill styles, drop unused card/grid rules, and mobile spacing + vertical centering). No logic, data, or component interfaces change.

**Tech Stack:** Astro 5, shared CSS in `src/styles/global.css`, no new dependencies.

**Spec:** `docs/superpowers/specs/2026-09-15-homepage-one-screen-minimal-design.md`

---

### Task 1: Replace the project card with a minimal pill link

**Files:**
- Modify: `src/pages/index.astro:14-22`

- [ ] **Step 1: Replace the projects section markup**

In `src/pages/index.astro`, replace the entire `<section class="projects">...</section>` block (currently lines 14-22) with:

```astro
    <section class="projects">
      <h2>Projects</h2>
      <a class="project-pill" href="/consistent-notes">
        <img src="/menubar-icon.svg" width="18" height="18" alt="" class="pill-icon" />
        Consistent Notes
      </a>
    </section>
```

The `.hero` section above it (lines 6-13) is untouched. The `.grid` wrapper, the `h3`, the `.badge` span, and the descriptive paragraph are all removed.

- [ ] **Step 2: Verify the page still builds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: replace homepage project card with minimal pill link"
```

### Task 2: Style the pill and remove the now-unused card rules

**Files:**
- Modify: `src/styles/global.css:76-86` (projects/card block)

- [ ] **Step 1: Replace the projects/card CSS block**

In `src/styles/global.css`, replace the current block at lines 76-86:

```css
.projects { margin-top: 72px; }
.projects h2 { font-size: 14px; color: var(--comment); text-transform: uppercase; letter-spacing: .12em; margin-bottom: 16px; text-align: center; }
.projects .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 20px; max-width: 540px; margin: 0 auto; }
.card { display: block; border: 1px solid var(--cl); border-radius: 8px; padding: 20px; text-decoration: none; color: var(--fg); transition: border-color .15s; }
.card:hover { border-color: var(--purple); }
.card h3 { font-size: 18px; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
.card-icon { filter: invert(1); }
html[data-theme='light'] .card-icon { filter: none; }
.badge { color: var(--cyan); font-size: 12px; font-weight: 400; }
.card p { color: var(--comment); font-size: 14px; margin-bottom: 10px; }
```

with:

```css
.projects { margin-top: 72px; text-align: center; }
.projects h2 { font-size: 14px; color: var(--comment); text-transform: uppercase; letter-spacing: .12em; margin-bottom: 16px; }
.project-pill {
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid var(--purple); border-radius: 999px;
  padding: 10px 22px; color: var(--purple); text-decoration: none;
  font-size: 15px; transition: background .15s;
}
.project-pill:hover { background: color-mix(in srgb, var(--purple) 12%, transparent); }
.pill-icon { filter: invert(1); }
html[data-theme='light'] .pill-icon { filter: none; }
```

The `.meta` rule below (currently line 86) is unrelated and stays.

- [ ] **Step 2: Verify the build and check**

Run: `npm run build && npm run check`
Expected: build completes with no errors; `astro check` reports no errors.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: style homepage project pill and remove unused card styles"
```

### Task 3: Fit the homepage to one mobile screen and center it

**Files:**
- Modify: `src/styles/global.css:200-211` (the `@media (max-width: 720px)` block)

- [ ] **Step 1: Update the mobile breakpoint rules**

In `src/styles/global.css`, replace the entire `@media (max-width: 720px)` block (currently lines 200-211) with:

```css
@media (max-width: 720px) {
  .wrap { padding: 0 24px; }
  main { padding: 24px 24px 16px; justify-content: center; }
  nav .inner { flex-wrap: wrap; padding: 20px 24px; }
  footer .inner { padding: 20px 24px 32px; }
  h1 { font-size: 44px; }
  .hero { margin-top: 0; gap: 20px; }
  .projects { margin-top: 28px; }
  .features { grid-template-columns: 1fr; }
  .shots-grid { grid-template-columns: 1fr; }
  .product-header { flex-direction: column; align-items: center; text-align: center; }
  .product-header .cta-row { justify-content: center; }
}
```

Notes:
- `main { justify-content: center; }` vertically centers the hero + projects in the space between nav and footer (main is already `flex: 1` inside `.wrap`).
- `.hero { margin-top: 0; gap: 20px; }` removes the 160px desktop gap and tightens hero spacing; the waffle and text sizes are unchanged (`.hero-text h1` keeps its 30px override).
- `.projects { margin-top: 28px; }` tightens the gap above the Projects heading.
- The old `.projects .grid { grid-template-columns: 1fr; }` line is removed because the grid no longer exists.

- [ ] **Step 2: Verify the build, check, and tests**

Run: `npm run build && npm run check && npm test`
Expected: build completes with no errors; `astro check` reports no errors; vitest passes.

- [ ] **Step 3: Manual mobile viewport check**

Run: `npm run dev`, open the site, and use the browser device toolbar at ~390×844 (and ~360×640).
Expected: nav, hero (current waffle + "bravewaffles" + tagline), "Projects" heading + pill, and footer are all visible with no scrolling; the hero + projects block is vertically centered between nav and footer. Toggle the theme and confirm the pill icon inverts (white in dark, black in light).

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: fit homepage to one mobile screen and center content"
```

---

## Self-Review

**Spec coverage:**
- Replace descriptive card with minimal pill link → Task 1 Step 1
- Keep "Projects" heading → Task 1 Step 1 (heading retained)
- Keep hero at current size → Task 3 Step 1 (only margin/gap changed; `.hero-text h1` 30px and 125px waffle untouched)
- Pill shows pencil icon with existing invert treatment → Task 1 Step 1 (`pill-icon`) + Task 2 Step 1
- Minimal everywhere (no breakpoint-gated content) → same markup at all sizes; only spacing/centering changes on mobile
- Mobile one-screen fit + vertical centering → Task 3 Step 1
- Out of scope: product page, new assets/JS, hero appearance → not touched

**Placeholders:** none — all edits show exact source and exact CSS.

**Type consistency:** Class names `.projects`, `.project-pill`, `.pill-icon`, `.hero`, `.hero-text` are used consistently between markup (Task 1) and CSS (Tasks 2-3) and match the spec.
