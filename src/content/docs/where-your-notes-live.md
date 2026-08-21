---
title: Where your entries live
description: Your journal is plain Markdown files on your Mac — nothing hidden, nothing locked in.
---

Every entry you write is saved twice: once in the app's own store, and once as a plain Markdown file on disk, written at the same moment. This page is about the files.

## The default folder

By default the files live inside the app's sandboxed container:

```text
~/Library/Containers/io.bravewaffles.consistency/Data/Documents/Consistency Notes/
```

(Yes, that's a deep path — it's what App Store sandboxing requires. The next section is about getting out of it.)

Inside, entries are organized by year, one `.md` file per day, named by date:

```text
Consistency Notes/
├── 2026/
│   ├── 2026-08-20.md
│   └── 2026-08-21.md
└── 2027/
    └── 2027-01-01.md
```

Each file is your entry's Markdown plus a small header with created/updated timestamps and a word count.

## Choosing your own folder

Prefer the files somewhere you can see them — `~/Documents`, a Dropbox folder, wherever? **Settings → Data → Change…** picks any folder; from then on every save writes there instead. **Show in Finder** opens the current folder in Finder.

## Reading the files elsewhere

The files are ordinary Markdown. Open them in any editor, back them up with any backup tool, version them with git, sync them with whatever you like. Nothing about them is special except the date-based names.

## Bringing files back in

**Settings → Data → Rescan** (under Recovery) reads the folder and imports any `YYYY-MM-DD.md` files for dates that don't yet have an entry in the app — useful after restoring from a backup or moving between Macs. Existing entries with content are never overwritten; renamed files aren't picked up.
