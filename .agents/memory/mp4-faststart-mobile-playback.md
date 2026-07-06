---
name: MP4 faststart required for mobile video playback
description: Video plays/loads fine in desktop screenshots and HEAD/range curl checks but fails or hangs on phones — check moov atom position before trusting "it works" evidence.
---

When a marketing/demo `.mp4` was reported as "not working" on a user's phone, `curl -I` (200), a range request (206), and desktop screenshots of the `<video>` player all looked completely fine. None of that evidence actually proves the file plays — those checks only confirm the server can respond, not that the container is structured for progressive playback.

The real bug: the `moov` atom (the index metadata a browser needs to begin decoding) was located at the END of the file, after the full `mdat` payload, instead of at the beginning. Browsers can't start playback until they've read `moov` — without faststart, mobile browsers (especially over slower connections) must fetch nearly the entire file before playback can begin, so it hangs or silently fails, while desktop/curl checks don't reveal anything wrong since they don't attempt real playback.

**Why:** ffmpeg (and many concatenation/re-encode pipelines) write `moov` at the end by default unless told otherwise. This is invisible to HEAD requests, range requests, and static screenshots — only actual playback or atom-order inspection catches it.

**How to apply:** When a video "won't play" complaint survives file-existence and network checks, inspect atom order directly (read first ~2MB, parse box sizes/tags — `ftyp` → should be `moov` next, not `mdat`) or just always remux with `ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4` as a first-line fix for any served mp4 before deeper investigation.
