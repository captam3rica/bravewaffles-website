# Consistent Notes Screenshot Lightbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the three screenshots on the Consistent Notes product page clickable, opening a larger centered view in a lightbox with a darkened backdrop, prev/next navigation, and theme-aware image variants.

**Architecture:** A single native `<dialog>` on `consistent-notes.astro` holds three slides, one per screenshot, each containing the dark + light `<img>` pair. The existing `html[data-theme]` CSS rules in `global.css` decide which variant shows, so the lightbox follows the theme with no extra JS. A small vanilla TS module (`src/lib/lightbox.ts`, same pattern as `theme.ts`) wires open/close/navigation; pure slide-cycling functions are exported for vitest.

**Tech Stack:** Astro 5, vanilla TypeScript in `<script>` blocks, native `<dialog>`, hand-written CSS (no framework), vitest + jsdom.

**Files:**
- Create: `src/lib/lightbox.ts`
- Create: `src/lib/lightbox.test.ts`
- Modify: `src/pages/consistent-notes.astro`
- Modify: `src/styles/global.css`
- Test: `src/lib/lightbox.test.ts`

---

### Task 1: Write the failing test for slide navigation

**Files:**
- Create: `src/lib/lightbox.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { nextSlideIndex, prevSlideIndex } from './lightbox';

describe('lightbox slide navigation', () => {
  const count = 3;

  it('advances forward and wraps to the first slide', () => {
    expect(nextSlideIndex(0, count)).toBe(1);
    expect(nextSlideIndex(1, count)).toBe(2);
    expect(nextSlideIndex(2, count)).toBe(0);
  });

  it('goes backward and wraps to the last slide', () => {
    expect(prevSlideIndex(0, count)).toBe(2);
    expect(prevSlideIndex(2, count)).toBe(1);
    expect(prevSlideIndex(1, count)).toBe(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/lib/lightbox.test.ts`
Expected: FAIL — import fails because `./lightbox` does not exist yet.

- [ ] **Step 3: Commit the failing test**

```bash
git add src/lib/lightbox.test.ts
git commit -m "test: failing test for lightbox slide navigation"
```

---

### Task 2: Implement the pure navigation functions

**Files:**
- Create: `src/lib/lightbox.ts`

- [ ] **Step 1: Write the minimal implementation**

```ts
export function nextSlideIndex(current: number, count: number): number {
  return (current + 1) % count;
}

export function prevSlideIndex(current: number, count: number): number {
  return (current - 1 + count) % count;
}
```

- [ ] **Step 2: Run the test to verify it passes**

Run: `npm test -- src/lib/lightbox.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 3: Commit**

```bash
git add src/lib/lightbox.ts
git commit -m "feat: add lightbox slide navigation helpers"
```

---

### Task 3: Add the lightbox init wiring

**Files:**
- Modify: `src/lib/lightbox.ts` (append `initLightbox`)

The full module after this task:

```ts
export function nextSlideIndex(current: number, count: number): number {
  return (current + 1) % count;
}

export function prevSlideIndex(current: number, count: number): number {
  return (current - 1 + count) % count;
}

export function initLightbox(): void {
  const dialog = document.getElementById('lightbox') as HTMLDialogElement | null;
  const slides = Array.from(dialog?.querySelectorAll<HTMLElement>('.lightbox-slide') ?? []);
  const openers = Array.from(document.querySelectorAll<HTMLElement>('.shot-open'));
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  if (!dialog || !slides.length || !openers.length) return;

  let current = 0;

  function show(index: number) {
    current = index;
    slides.forEach((slide, i) => {
      slide.hidden = i !== index;
    });
  }

  openers.forEach((btn) => {
    btn.addEventListener('click', () => {
      show(Number(btn.dataset.index ?? 0));
      dialog.showModal();
    });
  });

  prevBtn?.addEventListener('click', () => show(prevSlideIndex(current, slides.length)));
  nextBtn?.addEventListener('click', () => show(nextSlideIndex(current, slides.length)));

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      show(prevSlideIndex(current, slides.length));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      show(nextSlideIndex(current, slides.length));
    }
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  closeBtn?.addEventListener('click', () => dialog.close());
}
```

- [ ] **Step 1: Implement `initLightbox`**

Replace the contents of `src/lib/lightbox.ts` with the full module above (the two pure functions plus `initLightbox`).

- [ ] **Step 2: Run the tests**

Run: `npm test -- src/lib/lightbox.test.ts`
Expected: PASS — the pure-function tests are unaffected by the new wiring code.

- [ ] **Step 3: Commit**

```bash
git add src/lib/lightbox.ts
git commit -m "feat: wire up lightbox open, close, and navigation"
```

---

### Task 4: Make the grid cards clickable and add the dialog markup

**Files:**
- Modify: `src/pages/consistent-notes.astro`

- [ ] **Step 1: Wrap each figure's images in a button**

Replace the `<div class="shots-grid">` block (lines 37–53) with:

```astro
    <div class="shots-grid">
      <figure class="shot">
        <button type="button" class="shot-open" data-index="0" aria-label="Open the editor view screenshot in a larger view">
          <img class="shot-dark" src="/screenshots/editor-view-dark.png" width="1012" height="1012" loading="lazy" decoding="async" alt="Consistent Notes editor view" />
          <img class="shot-light" src="/screenshots/editor-view-light.png" width="1012" height="1012" loading="lazy" decoding="async" alt="Consistent Notes editor view" />
        </button>
        <figcaption>Editor view</figcaption>
      </figure>
      <figure class="shot">
        <button type="button" class="shot-open" data-index="1" aria-label="Open the notes list screenshot in a larger view">
          <img class="shot-dark" src="/screenshots/notes-list-dark.png" width="1012" height="1012" loading="lazy" decoding="async" alt="Consistent Notes notes list" />
          <img class="shot-light" src="/screenshots/notes-list-light.png" width="1012" height="1012" loading="lazy" decoding="async" alt="Consistent Notes notes list" />
        </button>
        <figcaption>Notes list</figcaption>
      </figure>
      <figure class="shot">
        <button type="button" class="shot-open" data-index="2" aria-label="Open the year view screenshot in a larger view">
          <img class="shot-dark" src="/screenshots/year-view-dark.png" width="1012" height="1012" loading="lazy" decoding="async" alt="Consistent Notes year heatmap view" />
          <img class="shot-light" src="/screenshots/year-view-light.png" width="1012" height="1012" loading="lazy" decoding="async" alt="Consistent Notes year heatmap view" />
        </button>
        <figcaption>Year view</figcaption>
      </figure>
    </div>
```

- [ ] **Step 2: Add the lightbox dialog and the init script**

Immediately after the closing `</div>` of `shots-grid` (before `<h2 class="section-title">Core Features</h2>`), add:

```astro
    <dialog id="lightbox" class="lightbox" aria-label="Screenshot viewer">
      <div class="lightbox-stage">
        <div class="lightbox-slide">
          <img class="shot-dark" src="/screenshots/editor-view-dark.png" width="1012" height="1012" alt="Consistent Notes editor view" />
          <img class="shot-light" src="/screenshots/editor-view-light.png" width="1012" height="1012" alt="Consistent Notes editor view" />
          <p class="lightbox-caption">Editor view</p>
        </div>
        <div class="lightbox-slide" hidden>
          <img class="shot-dark" src="/screenshots/notes-list-dark.png" width="1012" height="1012" alt="Consistent Notes notes list" />
          <img class="shot-light" src="/screenshots/notes-list-light.png" width="1012" height="1012" alt="Consistent Notes notes list" />
          <p class="lightbox-caption">Notes list</p>
        </div>
        <div class="lightbox-slide" hidden>
          <img class="shot-dark" src="/screenshots/year-view-dark.png" width="1012" height="1012" alt="Consistent Notes year heatmap view" />
          <img class="shot-light" src="/screenshots/year-view-light.png" width="1012" height="1012" alt="Consistent Notes year heatmap view" />
          <p class="lightbox-caption">Year view</p>
        </div>
        <button id="lightbox-prev" class="lightbox-nav lightbox-prev" type="button" aria-label="Previous screenshot">‹</button>
        <button id="lightbox-next" class="lightbox-nav lightbox-next" type="button" aria-label="Next screenshot">›</button>
        <button id="lightbox-close" class="lightbox-close" type="button" aria-label="Close screenshot viewer">×</button>
      </div>
    </dialog>
```

- [ ] **Step 3: Add the init script at the end of the file**

At the end of `consistent-notes.astro` (after the closing `</main>` and before `</Base>`), add:

```astro
<script>
  import { initLightbox } from '../lib/lightbox';
  initLightbox();
</script>
```

Note: the script must be a child of the component so Astro bundles it. Place it right after the `</main>` tag, inside `<Base>`.

- [ ] **Step 4: Typecheck**

Run: `npm run check`
Expected: PASS — no type or markup errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/consistent-notes.astro
git commit -m "feat: add lightbox dialog and clickable screenshot cards"
```

---

### Task 5: Style the lightbox and clickable cards

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add card-button styles**

In `global.css`, after the `.shot` rules (after line 139, the `html[data-theme='dark'] .shot-light { display: none; }` rule), add:

```css
.shot-open {
  display: block; width: 100%; padding: 0; border: 0;
  background: none; cursor: pointer;
}
.shot-open:focus-visible { outline: 2px solid var(--purple); outline-offset: -2px; }
```

- [ ] **Step 2: Add the lightbox styles**

Append the lightbox block (a new section after the card-button rules):

```css
/* Product page: screenshot lightbox */
.lightbox {
  position: fixed; inset: 0; margin: auto;
  width: min(92vw, 1000px); padding: 0; border: 0; background: transparent;
}
.lightbox::backdrop { background: rgba(0, 0, 0, 0.75); }
.lightbox-stage { position: relative; }
.lightbox-slide { text-align: center; }
.lightbox-slide[hidden] { display: none; }
.lightbox-slide img {
  display: block; margin: 0 auto; width: auto; height: auto;
  max-width: 100%; max-height: 82vh;
  border: 1px solid var(--cl); border-radius: 8px;
}
.lightbox-caption {
  margin-top: 12px; font-size: 12px; color: var(--fg);
  text-transform: uppercase; letter-spacing: .12em;
}
.lightbox-nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  display: flex; align-items: center; justify-content: center;
  width: 44px; height: 44px; padding: 0;
  border: 1px solid var(--cl); border-radius: 999px;
  background: var(--outer); color: var(--fg); font-size: 24px; cursor: pointer;
}
.lightbox-prev { left: 8px; }
.lightbox-next { right: 8px; }
.lightbox-nav:hover { border-color: var(--purple); color: var(--purple); }
.lightbox-close {
  position: absolute; top: 8px; right: 8px;
  width: 36px; height: 36px; padding: 0;
  border: 1px solid var(--cl); border-radius: 999px;
  background: var(--outer); color: var(--fg); font-size: 18px; line-height: 1; cursor: pointer;
}
.lightbox-close:hover { border-color: var(--purple); color: var(--purple); }
```

The `html[data-theme='light'] .shot-dark { display: none; }` and `html[data-theme='dark'] .shot-light { display: none; }` rules already exist and match any `.shot-dark`/`.shot-light` in the document, so the lightbox slides follow the theme automatically — no extra rules needed.

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: PASS — static site builds and the styles are inlined.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "style: add lightbox and clickable card styles"
```

---

### Task 6: Full verification and manual check

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS — all existing tests plus the new `lightbox.test.ts`.

- [ ] **Step 2: Run the typecheck**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 3: Manual check**

Run: `npm run dev` and open `http://localhost:4321/consistent-notes`. Verify:

1. Clicking each of the three cards opens the lightbox centered on a darkened backdrop, showing the correct screenshot.
2. Prev/next buttons step through all three screenshots (wrapping from last → first and first → last).
3. Arrow keys `←`/`→` also navigate while the dialog is open.
4. Esc, the `×` close button, and clicking the darkened backdrop all close the lightbox.
5. Toggle the theme while the lightbox is open: the image swaps dark ↔ light, matching the grid.
6. On a narrow viewport (~375px), the image stays within the screen and navigation/close buttons remain usable.