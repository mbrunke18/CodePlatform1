---
name: Terminology find-replace can corrupt literal route paths
description: A "playbook" → "Readiness Protocol(s)" copy pass changed literal URL slugs embedded in JSX, not just visible text, producing broken links with spaces in the path.
---

Found during a full customer/investor link audit: several pages had `<Link href="...">` / `setLocation(...)` targets like `/living-Readiness Protocols` and `/identify/Readiness Protocols` — the registered routes were actually `/living-playbooks` and `/identify/playbooks`. A prior locked-terminology pass (retiring "playbook" in visible copy) had also rewritten the string literal used as a route slug in the same line, not just the display label.

**Why:** Terminology enforcement in this codebase is content-level (labels, headings, button text) but slugs/route paths that happen to contain the same word are stored as plain string literals in the same JSX attributes/objects, so a text-based find-replace pass can't distinguish "user-visible word" from "URL path segment" without route-aware checking.

**How to apply:** After any global terminology rename pass, re-run a route/link audit (extract all `<Route path="...">` + `renderRoutes`/`renderRedirects` registrations, extract all `href=`/`setLocation`/`navigate` targets, normalize dynamic segments, diff for unmatched) rather than trusting that a terminology-only test suite caught everything — terminology tests check words, not whether the word appears in a place where it breaks navigation.
