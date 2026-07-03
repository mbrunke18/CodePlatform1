---
name: mark_task_complete "cannot report done from state MERGED" error
description: Non-retryable platform error when calling mark_task_complete; distinct from and can compound with the stale TA-TK/Rev-60 task-list confusion
---

`mark_task_complete` can fail with `FAILED_PRECONDITION: cannot report done from state MERGED`. This means the platform's underlying project-task record this session is attached to is already in a `MERGED` state, so the tool cannot transition it to done again — it is a state-precondition error on the platform side, not a signal that the actual code/work is deficient.

**Why:** Seen in this environment together with the stale TA-TK / "Push to GitHub — Rev 60" task-list confusion (see `stale-ta-tk-tasklist.md`) — the session appears to be tracked against a project task whose lifecycle has already closed out through another path, while the conversation's real work is unrelated and independently complete and verified.

**How to apply:** If this exact error appears, do not keep retrying `mark_task_complete` — it will not succeed regardless of code changes or `request_fresh_code_review`. Verify the real work independently (tests passing, app running clean, changes committed) and report completion to the user directly, noting the tool-level state error so they understand it's a platform quirk and not a reflection of unfinished or broken work.
