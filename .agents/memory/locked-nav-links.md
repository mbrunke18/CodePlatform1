---
name: Locked nav links
description: StandardNav links that are documented as locked in developer-reference.md — never change without explicit founder approval
---

# Locked Nav Links

## The Rule
Before changing ANY nav link destination, check developer-reference.md. Several links are explicitly documented as locked.

## Known Locked Links (as of July 2026)

| Nav Label | Locked Destination | Source |
|---|---|---|
| "How It Works" | `/how-it-works` | developer-reference.md line 754 — marked CRITICAL |

## How It Works — Why It's Locked
- `HowItWorks.tsx` at `/how-it-works` is the "Full Advantage System" hub page: Identify. Detect. Authorize. Execute. Advance.
- It has: hero → phase nav bar → ExecutionProcessDiagram → sections 01–05
- The `#how-it-works` anchor also exists on the homepage but the nav link goes to the standalone page — they are different
- `/how-it-executes` is a DIFFERENT page (animated chain visualization) — do not conflate

**Why:** developer-reference.md line 754 says: *"CRITICAL: 'How It Works' MUST use `<Link href='/how-it-works'>` — never `onClick={() => scrollTo('how-it-works')}` or scrollIntoView."*

## Source of Truth
- Always use Replit files as source of truth, not git (git is periodically pushed and may be days behind)
- developer-reference.md is the authoritative spec for page structure and nav wiring
- Check it before changing any nav destination
