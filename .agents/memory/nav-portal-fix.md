---
name: Nav Portal Fix
description: What caused the nav to be invisible in production and what definitively fixed it
---

## The Problem
StandardNav was invisible in production (all CSS positioning attempts failed).

## Root Cause
`html, body, #root { overflow-x: clip; }` in `index.css` — applying `overflow-x: clip`
to `#root` caused browsers to treat `#root` as a scroll/stacking context, trapping
both `position: sticky` and `position: fixed` elements inside it instead of the viewport.

## The Fix (Two Parts)

**1. index.css** — Remove `#root` from the overflow-x rule:
```css
html, body {   /* ← #root removed */
  overflow-x: clip;
  max-width: 100%;
}
```

**2. StandardNav.tsx** — Render the `<nav>` via React portal into `document.body`:
```tsx
import { createPortal } from "react-dom";

return (
  <>
  {createPortal(
    <nav ref={navRef} className="fixed top-0 left-0 right-0 w-full" style={{ zIndex: 9999, ... }}>
      {/* nav content */}
    </nav>,
    document.body
  )}
  <div aria-hidden="true" style={{ height: navHeight, flexShrink: 0 }} />
  </>
);
```

The spacer div stays outside the portal in normal flow (for content offset).
The ResizeObserver on navRef still works with portaled elements.

**Why:** Portal renders the nav DOM node directly into `document.body`, bypassing
ALL ancestor CSS (overflow, transform, filter, stacking context). z-index: 9999
ensures it's above every other element.
