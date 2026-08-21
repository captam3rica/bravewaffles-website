---
title: Markdown reference
description: Every piece of Markdown syntax Consistent Notes understands, in one page.
---

Everything below works in every entry. Keyboard-shortcut forms are listed where they exist — or find them by holding **⌘**.

## Headings

| Syntax | Result |
|---|---|
| `# Heading` | Heading level 1 |
| `## Heading` | Heading level 2 |
| `### Heading` | Heading 3+ (deeper levels render the same) |

Headings render bold, with color by level. The `#` marks are hidden except on the line you're editing.

## Text emphasis

| Syntax | Result | Shortcut |
|---|---|---|
| `**bold**` or `__bold__` | **bold** | **⌘B** |
| `*italic*` or `_italic_` | *italic* | **⌘I** |
| `~~strikethrough~~` | ~~strikethrough~~ | **⌘⇧S** |
| `~underline~` | underline | **⌘U** |
| `` `code` `` | `code` | **⌘E** |
| `[text](https://…)` | a link | **⌘L** |

Underline uses single tildes: `~like this~`. (It's not standard Markdown — it's a Consistent Notes convention that keeps your text readable while you type.)

## Lists

| Syntax | Result |
|---|---|
| `- item` or `* item` | bullet list |
| `1. item` | numbered list (auto-increments as you type) |
| `- [ ] item` | open todo |
| `- [x] item` | done todo |
| `- [-] item` | cancelled todo |

Indent with **⇥** (four spaces per level) to nest. Todos cascade: check a parent and everything nested beneath it checks too. Details in [Todos & rollover](/consistent-notes/docs/todos/).

## Blocks

| Syntax | Result |
|---|---|
| `> text` | blockquote (nests with `>>`) |
| `---` (alone on a line) | a full-width divider |

A divider line shows as a clean horizontal rule in the editor, with the raw dashes visible only on the line you're editing.

## Emoji

| Syntax | Result |
|---|---|
| `:shortcode` | emoji autocomplete — type `:fire`, press **⏎** for 🔥 |

## What about tables and images?

Deliberately missing. Consistent Notes is a journal, and journals are words: tables, images, and code fences would make entries heavier without making them better written. Anything you type that isn't in the tables above simply shows as plain text — nothing is ever stripped from your entries. If a future you wants images in entries, [say so](/consistent-notes/docs/contact-support/) — may add later if requested.
