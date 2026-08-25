---
title: Troubleshooting
description: Fixes for the things that go wrong — missing entries, quiet reminders, lost shortcuts.
---

## The app won't open with ⇧⌘C

Another app may own that shortcut. Check **Settings → Shortcuts** — but if the app isn't open, that's chicken-and-egg: open Consistent Notes from the menu bar icon or Launchpad first, then rebind the shortcut. (Rebinding records any shortcut with at least one modifier key.)

## My reminder didn't arrive

- Notifications declined? **System Settings → Notifications → Consistent Notes** needs to allow them.
- Focus/Do Not Disturb was on at reminder time — the notification delivers quietly to Notification Center.
- Reminders are once-a-day at the exact time in **Settings → General → Reminders** — check the time.

## An entry seems missing

- Search for a word you remember (**⌘⇧F**) — the entry may be filed under a different date than you expect.
- Open the Heatmap and click the day's cell — it shows the entry if one exists.
- If files were restored or moved, run **Settings → Data → Rescan** to re-import dated files. (It skips days that already have content — check the counts it reports.)

## My todo didn't roll over

Rollover only copies todos that are still **open** (`- [ ]`). A todo you completed or cancelled on a previous day stays on that day forever — that's the design: the record of when you did things is part of the journal. Also check the **Roll Over Todos** setting versus the banner — see [Todos & rollover](/consistent-notes/docs/todos/).

## Formatting characters are showing / hiding at the wrong times

That's the **Markdown delimiters** setting: **Always show**, **Current line** (default), or **Hidden** — in **Settings → General**. It's a preference, not a bug, but if it changed on you, the setting is the culprit.

## The editor is in some strange mode

If there's a badge in the editor header reading N, I, or VISUAL, vim mode is on and you're seeing vim modal states. Press **⎋** to get back to Normal, or turn vim off in **Settings → General → Vim Mode**. **?** in the editor shows the full vim reference.

## Still stuck?

[Contact support](/consistent-notes/docs/contact-support/) — a real person reads it.
