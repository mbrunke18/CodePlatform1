---
name: Deleting large functions from big TSX files
description: Reliable technique when the edit tool's exact-string match fails on large/multi-hundred-line blocks
---

The `edit` tool's exact-string matching becomes unreliable (silent mismatches, usually from subtle whitespace) when the `old_string` spans many hundreds of lines — common when removing an entire large React component function from a monolithic page file (e.g. a homepage with dozens of section components in one file).

**Why:** Large multi-line `old_string` blocks are prone to whitespace/formatting drift between what was read and what's actually in the file, causing repeated failed match attempts and wasted turns.

**How to apply:** 1) Use a small, targeted `edit` to rename the target function to a unique marker (e.g. `FooSectionDELETE_ME_START`). 2) `grep -n` for that marker and the next function's start to get exact line boundaries. 3) Run `sed -i '<start>,<end>d' <file>` via bash to delete the exact line range. 4) Re-`grep -n` for fresh line numbers before the next deletion — line numbers shift after every `sed` delete. Also re-check the bottom-of-file render/JSX block afterward: deleting a function does not remove its call sites, so the render block must be rewritten separately to drop references to deleted components (and any now-unused imports/icons should be pruned too).
