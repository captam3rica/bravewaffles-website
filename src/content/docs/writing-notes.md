---
title: Writing entries
description: The day-by-day editor — markdown as you type, emoji shortcodes, find in entry, and how saving works.
---

Each day in Consistent Notes is one entry, dated and saved automatically. This page covers the editor itself; formatting syntax lives in the [Markdown reference](/consistent-notes/docs/markdown-reference/).

## One entry per day

The entry for today is always one keystroke away (**⇧⌘C**). Use **⌘[** and **⌘]** to move to yesterday's and tomorrow's entries, or pick any day from the notes list. In the list, **↑ ↓** move between days, **⏎** opens the selected one, and **⎵** jumps back to today.

## Formatting as you type

The editor highlights markdown live — bold shows bold, headings get color, code gets a chip background — while the raw characters stay in the file. By default, formatting characters (the asterisks, backticks, and friends) are hidden except on the line you're editing, so yesterday's entries read clean. Prefer to always see them? **Settings → General → Markdown delimiters → Always show**.

The editor also gives you a hand while typing:

- **Auto-pairs** — typing `(`, `[`, `{`, a quote, or a backtick inserts the closing character; backspacing an empty pair removes both.
- **Smart lists** — pressing **Return** continues bullets, numbers (incrementing), and checkboxes; pressing **Return** on an empty list item removes the marker.
- **Paste links over text** — select some text, paste a URL, and it becomes `[text](url)`.

## Emoji shortcodes

Type `:` followed by letters to insert an emoji: `:fire` matches, **⏎** inserts 🔥. Matches are fuzzy and ranked; the six you use most appear when you just type `:` alone. **⇥** and the arrow keys move through matches, and the chevron (or a wide query) expands the full grid.

## Find in this entry

**⌘F** searches within the entry you're reading. Matches highlight as you type with an "n of m" counter; **⏎** and **⇧⏎** step forward and back; **⎋** closes the bar and selects the current match. To search across every entry instead, use [search](/consistent-notes/docs/search/) (**⌘⇧F**).

## Saving

Entries autosave one and a half seconds after you stop typing, and save again when you close an entry or leave the app. **⌘S** saves immediately if you want the certainty. Every save also writes the entry's Markdown file to disk — see [where your entries live](/consistent-notes/docs/where-your-notes-live/).

## The toolbar

The formatting toolbar at the bottom of the editor has buttons for the common formats (bold, italic, code, link, underline, lists, and more). Hide it with **⌘⇧T** if you'd rather have the space.
