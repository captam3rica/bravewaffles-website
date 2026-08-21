---
title: Vim mode
description: Vim motions in the lists and full modal editing in the editor, if that's your way.
---

If you live in vim, Consistent Notes can meet you there — in the lists, in the editor, or both. Both live in **Settings → General → Vim Mode** and both are off by default.

## Vim motions in the lists

With **Vim motions in tabs** on, the notes and ToDos lists respond to **j**/**k** (down/up), **gg**/**G** (top/bottom of the list), **o** or **⏎** (open), and the ToDos-specific **O** (open the original entry). Works everywhere the arrow keys work — which, if you enable **hardcore mode** (below), is nowhere: the point is to force the habit.

## Vim mode in the editor

With **Vim mode in editor** on, the editor becomes modal:

- **Normal mode** — motions (`h j k l w b e 0 ^ $ { } f{char} %` …), operators (`d y c`) with text objects (`iw aw i" a[` …), counts (`3j`, `5dd`), **u**/**⌃r** undo/redo, **x**, **p**/**P**, **r**, **J**, **>>**/**<<**, and **zz/zt/zb** scrolling.
- **Insert mode** — entered with **i a A o O** (or **gA** to append at the end of the visual line); type normally; **⎋** returns to Normal.
- **Visual and visual-line modes** — **v** and **V** to select, then **d**, **y**, or **c**.
- **Find** — **/** opens the find bar, `*`/`#` search the word under the cursor, **n**/**N** repeat.
- **?** shows the full keybinding reference, in place.

A couple of options tune it:

- **Move up and down by visual lines** (on by default) — **j**/**k** follow wrapped lines; counts like `5j` always use logical lines.
- **Escape sequence** — record two keystrokes (classic: `jk`) that exit Insert mode without reaching for **⎋**.
- **Show vim indicator** — the little mode badge (N / I / VISUAL) in the editor header.

## Hardcore mode

**Hardcore mode** disables arrow-key navigation in the notes and ToDos lists, filtered from the shortcut hints too. The editor is unaffected — arrows still move the cursor while you're typing. It exists to build the muscle memory; it does not exist to punish edits.

Hold **⌘** anywhere to see the shortcuts that apply where you are, vim or not.
