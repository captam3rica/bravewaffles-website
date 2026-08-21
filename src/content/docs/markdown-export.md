---
title: Markdown export
description: How the automatic per-entry Markdown export works.
---

Export isn't a feature you run — it's a property of how Consistent Notes saves. Every entry, at the moment it's saved, is written as a dated Markdown file. Details of the folder layout and file format are in [Where your entries live](/consistent-notes/docs/where-your-notes-live/); the short version:

- One `.md` file per day, named `YYYY-MM-DD.md`, grouped in per-year folders
- A small header in each file records created/updated times and a word count
- The folder is yours to pick (Settings → Data) and yours to use: backup, sync, git — anything

## Backups

Because every entry is already a file in a folder you control, your backup story is whatever your Mac's is. Time Machine, iCloud Drive (point the notes folder at one), or rsync to a server — all just work, because there's nothing special to back up.

## Moving to another Mac

1. Point Consistent Notes on the new Mac at a folder containing your files (Settings → Data → Change…)
2. Run **Rescan** to import every dated file
3. That's it — the entries appear with their original dates

Since the files travel with their `created`/`updated` timestamps, the import preserves when things actually happened.
