---
name: Homepage category-clarity structure
description: Where "what is this / not a workflow tool" answer lives on Homepage.tsx and how it was surfaced earlier
---

Homepage.tsx already contains a dedicated section (`WorkflowDistinctionSection`, side-by-side "Workflow Tools" vs "Readiness Infrastructure" comparison, closing line "This is not a workflow tool. It is readiness infrastructure.") that directly answers the "what category is this" confusion executives raise in first-impression feedback (mentally testing PMO software / GRC / workflow / AI orchestration / etc.).

**Why:** That section sits late in the render order (`HeroSection` → `RealityGapSimulator` → `MicrosoftHookStrip` → `FilmSection` → `EngagementBridge` → `ScenarioCardsRow` → `IDEASection` → `PlatformScreenshotSection` → `WorkflowDistinctionSection`, i.e. 9th) — too deep for a busy exec who decides "what am I looking at" in the first screen and may not scroll that far.

**How to apply:** Rather than restructuring section order (risky in a large single-file page), a short muted one-line category clarifier was added directly in the hero itself (`HeroSection`, right after the H1/H2 canonical tagline, before the lead paragraph): "Not project management software. Not GRC. Not another AI layer on the same 30-day cycle." This does not duplicate or alter any LOCKED messaging (tagline, 3,600× framing, etc.) — it's a net-new addition. If further category-clarity work is requested, know this existing section + hero teaser both exist before adding more.
