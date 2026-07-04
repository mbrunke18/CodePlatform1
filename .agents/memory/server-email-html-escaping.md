---
name: Server-side email HTML needs explicit escaping
description: Lead-capture endpoints that build HTML emails via template literals have no JSX auto-escaping; user-controlled fields must be escaped manually
---

Any Express route that builds an HTML email body via a template literal (not JSX) must manually HTML-escape every user-supplied field before interpolation, and must validate/allowlist any URL field (e.g. a "shareUrl" the user echoes back) against the app's own origin before putting it in an `<a href>`.

**Why:** Client-side React components (e.g. `ProspectBrief.tsx`) are safe by default because JSX auto-escapes interpolated values — but server-side email HTML strings get zero such protection. A field like `companyName`, `scenarioTitle`, or `situationName` taken straight from `req.body` and dropped into an email template is a direct HTML-injection vector (phishing-relay / brand-abuse risk), confirmed via architect code review on this project's 3 lead-capture endpoints (test-drive, situation-scanner, roi-calculator).

**How to apply:** When adding or reviewing any endpoint that sends email (Resend, SendGrid, etc.) with an HTML body built from request data: (1) escape every interpolated string field, (2) validate/reconstruct any echoed URL against `req.get('host')` rather than trusting it verbatim, (3) rate-limit the endpoint since it triggers real outbound sends and has no auth gate, (4) don't leak `err.message` in the JSON error response.
