---
name: ProtocolActivationConsole vs LiveActivationCenter
description: Two similarly-named activation pages exist; only one is wired to real DB-backed playbook data.
---

`client/src/pages/ProtocolActivationConsole.tsx` (route `/playbook-activation/:triggerId/:playbookId`) is the real, DB-backed activation flow — it uses actual `playbookLibrary` UUIDs and persists activation state server-side. This is the correct target for any backend-integrated activation feature (authorization gates, admissibility/re-verification checks, task-state-driven mutations, etc.).

`client/src/pages/LiveActivationCenter.tsx` is a client-only demo simulation — it drives task/stakeholder progression via `setTimeout` and a lightweight `/api/activation/activate` + `liveActivationService`, not tied to real playbook records. It's referenced from sales narrative (`ProductScreenPanel` in `full-experience/chapters/Ch5WarRoom.tsx`) as a screenshot/route pointer, but should not be the target of real feature wiring.

**Why:** the names are easy to confuse and both "look" like the activation UI; picking the wrong one silently produces a feature that only works in the simulated demo, not in the real product.

**How to apply:** before wiring any new activation-time feature (authorization, admissibility, task lifecycle hooks), confirm which page owns the real DB flow by checking for `playbookId`/`activationDbId`-style state tied to actual API calls — that's `ProtocolActivationConsole.tsx`.
