---
title: Vim mode
description: Vim motions in the lists and full modal editing in the editor, if that's your way.
---

If you live in vim, Consistent Notes can meet you there — in the lists, in the editor, or both. Both live in **Settings → General → Vim Mode** and both are off by default.

## Vim motions in the lists

With **Vim motions in tabs** on, the Notes and ToDos lists respond to the shortcuts below. Works everywhere the arrow keys work — which, if you enable **hardcore mode** (below), is nowhere: the point is to force the habit.

### Notes list

| Shortcut   | Action                      |
| ---------- | --------------------------- |
| **⎵**      | Open today's entry          |
| **j**      | Move down the list          |
| **k**      | Move up the list            |
| **g g**    | Top of list                 |
| **G**      | Start of month              |
| **o**      | Open the selected day       |
| **⏎**      | Open the selected day       |
| **↑**      | Move up the list            |
| **↓**      | Move down the list          |
| **⌘N**     | Go to Notes List            |
| **⌘Y**     | Go to Year View             |
| **⌘T**     | Go to ToDos                 |
| **⌘,**     | Settings                    |
| **⌘⇧F**    | Search every entry          |
| Hold **⌘** | Shortcuts overlay           |

### ToDos list

| Shortcut   | Action                                |
| ---------- | ------------------------------------- |
| **⎵**      | Open today's entry                    |
| **j**      | Move down the list                    |
| **k**      | Move up the list                      |
| **g g**    | First todo                            |
| **G**      | Last todo                             |
| **o**      | Open the most recent entry for a todo |
| **⏎**      | Open the most recent entry for a todo |
| **O**      | Open the original entry               |
| **⌘⇧⏎**    | Toggle the selected todo              |
| **↑**      | Move up the list                      |
| **↓**      | Move down the list                    |
| **⌘N**     | Go to Notes List                      |
| **⌘Y**     | Go to Year View                       |
| **⌘T**     | Go to ToDos                           |
| **⌘,**     | Settings                              |
| Hold **⌘** | Shortcuts overlay                     |

## Vim mode in the editor

With **Vim mode in editor** on, the editor is fully modal. You start in **Normal mode**, where letters are commands; **i a A o O** enter **Insert mode** to type, **v V** select in visual modes, and **/** finds. **⎋** returns to Normal mode, **?** shows this whole reference in place. Operators take counts and text objects, so `3dd`, `2w`, and `ci"` all work.

### Entering modes

| Shortcut | Action                                     |
| -------- | ------------------------------------------ |
| **i**    | Insert mode                                |
| **a**    | Append (insert after cursor)               |
| **A**    | Append at end of line                      |
| **g A**  | Append at end of visual (wrapped) line     |
| **o**    | New line below                             |
| **O**    | New line above                             |
| **v**    | Visual mode                                |
| **V**    | Visual line mode                           |
| **⎋**    | Return to Normal mode                      |

### Navigation

| Shortcut | Action                                        |
| -------- | --------------------------------------------- |
| **h**    | Move left                                     |
| **j**    | Move down                                     |
| **k**    | Move up                                       |
| **l**    | Move right                                    |
| **w**    | Next word                                     |
| **b**    | Previous word                                 |
| **e**    | End of word                                   |
| **W**    | Next WORD (whitespace only)                   |
| **B**    | Previous WORD                                 |
| **E**    | End of WORD                                   |
| **0**    | Start of line                                 |
| **^**    | First non-blank                               |
| **$**    | End of line                                   |
| **g 0**  | Start of visual (wrapped) line                |
| **g ^**  | First non-blank of visual line                |
| **g $**  | End of visual (wrapped) line                  |
| **g j**  | Down one visual line                          |
| **g k**  | Up one visual line                            |
| **g g**  | Start of doc                                  |
| **G**    | End of doc                                    |
| **{**    | Previous paragraph                            |
| **}**    | Next paragraph                                |
| **f**    | Find char forward on line                     |
| **F**    | Find char backward on line                    |
| **t**    | Till char forward on line                     |
| **T**    | Till char backward on line                    |
| **%**    | Jump to matching bracket                      |
| **;**    | Repeat last f/t find                          |
| **,**    | Repeat last f/t find (reverse)                |

### Delete

| Shortcut | Action                    |
| -------- | ------------------------- |
| **x**    | Delete char               |
| **d d**  | Delete line               |
| **d w**  | Delete word               |
| **d i w** | Delete inner word        |
| **d a w** | Delete around word       |
| **d i [** | Delete inside brackets   |
| **d i "** | Delete inside quotes     |
| **d a [** | Delete around brackets   |
| **d a "** | Delete around quotes     |
| **d i p** | Delete inner paragraph   |
| **d a p** | Delete around paragraph  |
| **D**    | Delete to end of line      |

### Change

| Shortcut | Action                     |
| -------- | -------------------------- |
| **c c**  | Change line                |
| **c w**  | Change word                |
| **c i w** | Change inner word         |
| **c a w** | Change around word        |
| **c i [** | Change inside brackets    |
| **c i "** | Change inside quotes      |
| **c a [** | Change around brackets    |
| **c a "** | Change around quotes      |
| **c i p** | Change inner paragraph    |
| **c a p** | Change around paragraph   |
| **C**    | Change to end of line       |
| **S**    | Substitute line             |

### Yank

| Shortcut | Action                     |
| -------- | -------------------------- |
| **y y**  | Yank line                  |
| **y w**  | Yank word                  |
| **y i w** | Yank inner word           |
| **y a w** | Yank around word          |
| **y i [** | Yank inside brackets      |
| **y i "** | Yank inside quotes        |
| **y a [** | Yank around brackets      |
| **y a "** | Yank around quotes        |
| **y i p** | Yank inner paragraph      |
| **y a p** | Yank around paragraph     |

### Indent and other commands

| Shortcut | Action                          |
| -------- | ------------------------------- |
| **> >**  | Indent line                     |
| **< <**  | Dedent line                     |
| **r**    | Replace character               |
| **J**    | Join lines                      |

### Paste, undo, and redo

| Shortcut | Action             |
| -------- | ------------------ |
| **p**    | Paste after cursor |
| **P**    | Paste before cursor|
| **u**    | Undo               |
| **⌃r**   | Redo               |

### Find

| Shortcut | Action                                |
| -------- | ------------------------------------- |
| **/**    | Find                                  |
| **\***   | Search word under cursor forward      |
| **#**    | Search word under cursor backward     |
| **n**    | Next match                            |
| **N**    | Previous match                        |

### Scroll

| Shortcut | Action                 |
| -------- | ---------------------- |
| **z z**  | Scroll cursor to center|
| **z t**  | Scroll cursor to top   |
| **z b**  | Scroll cursor to bottom|
| **q**    | Close editor           |
| **⎋**    | Close editor           |
| **?**    | Show this help         |

A couple of options tune it:

- **Move up and down by visual lines** (on by default) — **j**/**k** follow wrapped lines; counts like `5j` always use logical lines.
- **Escape sequence** — record two keystrokes (classic: `jk`) that exit Insert mode without reaching for **⎋**.
- **Show vim indicator** — the little mode badge (N / I / VISUAL) in the editor header.

## Hardcore mode

**Hardcore mode** disables arrow-key navigation in the Notes and ToDos lists, filtered from the shortcut hints too. The editor is unaffected — arrows still move the cursor while you're typing. It exists to build the muscle memory; it does not exist to punish edits.

Hold **⌘** anywhere to see the shortcuts that apply where you are, vim or not.