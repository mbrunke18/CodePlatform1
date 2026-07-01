---
name: Signal dedup org-filter bug
description: The 24-hour trigger dedup query in SignalEvaluationService must always filter by organizationId or the system org's detections silently block real org alerts.
---

## Rule

The dedup query in `evaluateAndPersistSignals` (SignalEvaluationService.ts) that checks recent trigger detections MUST include `eq(triggerDetections.organizationId, organizationId)` in its `where` clause.

**Why:** The ingestion service evaluates the `system` org first, then loops over all real UUID orgs. Without the org filter, a detection saved for the `system` org makes `hoursSince < 24` true for every real org's scan that follows — silently suppressing all alert emails for a full 24-hour window. This produces the symptom: triggers show in the UI (system org detections), but no alert emails are ever sent to real org stakeholders.

**How to apply:** Any time the dedup query is modified or copied, confirm the `where` clause is `and(eq(organizationId), eq(triggerName))` — never just `eq(triggerName)` alone.
