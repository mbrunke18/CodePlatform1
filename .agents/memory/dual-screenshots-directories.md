---
name: Dual screenshots directories
description: Two separate screenshots folders exist with overlapping filenames but different content — must check both when auditing marketing images.
---

There are TWO separate `screenshots/` directories in this project, not one:

1. **Root `screenshots/`** (project root, outside `client/`) — served by an explicit Express static route (`app.use('/screenshots', express.static(path.join(process.cwd(), 'screenshots')))` in `server/index.ts`). This is what the React app resolves when a component uses `/screenshots/<file>.jpg` (leading slash, absolute from server root).
2. **`client/public/screenshots/`** — served by Vite as a public asset folder. Standalone static HTML files that live in `client/public/` (e.g. investor pitch-deck HTML exports) use relative paths like `screenshots/<file>.jpg`, which resolve against this folder, NOT the root one.

**Why this matters:** the two folders have overlapping filenames (e.g. both have a `new_mission_control.jpg`) but the content can differ, and each folder is missing files the other has (e.g. `protocol_library_v2.jpg` and `fresh_*.jpg` variants only exist in `client/public/screenshots/`; `deck_*` and `new_protocol_library.jpg` variants used by the React app live in the root folder). A filename existing in one folder does NOT mean it exists or is correct in the other.

**How to apply:** when auditing or fixing a "wrong/missing screenshot" bug, identify which folder is actually in play by checking whether the reference is an absolute `/screenshots/...` path (root folder, React app) or a relative `screenshots/...` path inside a file under `client/public/` (public folder, static HTML). Verify file existence AND visually inspect content in the correct folder — don't assume parity between the two.
