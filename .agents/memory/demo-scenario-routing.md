---
name: Demo scenario routing — two incompatible systems
description: /demo-experience?s=N (DemoExperience.tsx) vs /demo/:scenarioId (MasterDemo.tsx) are separate scenario systems with different id schemes; mixing them silently breaks links.
---

`/demo-experience?s=N` reads `DEMO_SCENARIOS[N]` in `DemoExperience.tsx` and clamps out-of-range `N` to a default index (currently 1) instead of erroring — so an invalid `?s=5` silently renders the wrong scenario rather than failing loudly. Always check `DEMO_SCENARIOS.length` before adding a new numeric-index link.

Separately, `/demo/:scenarioId` (MasterDemo.tsx, scenario data in `client/src/pages/demos/scenarioData.ts`) uses string ids (`"product-launch"`, `"workforce"`, `"market-entry"`, etc.) covering all 3 strategic domains including TRANSFORMATION, which `DEMO_SCENARIOS` does not.

**How to apply:** when adding scenario cards/links anywhere in the app, prefer the string-id `/demo/:scenarioId` system — it has broader domain coverage (including Transformation) and won't silently mis-route. Only use `/demo-experience?s=N` for the 5 scenarios it already defines.
