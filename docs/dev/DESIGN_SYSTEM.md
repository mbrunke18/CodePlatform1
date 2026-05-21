# VaughnMartin Readiness OS — Design System

**Last Updated:** May 2026

---

## Brand Identity

**Platform:** VaughnMartin Readiness OS  
**Audience:** COO / CISO / CSO — startup to Fortune 500  
**Tone:** Executive, authoritative, precise. Not corporate-bland. Not startup-casual.

---

## Color Palette (Exact Hex — Do Not Approximate)

| Name | Hex | Usage |
|------|-----|-------|
| `NAVY` | `#0A0F2E` | Primary background, headings, nav |
| `NAVY_BG` | `#132558` | Secondary dark surfaces, card fills |
| `GOLD` | `#C9A84C` | Accents, rules, key labels, CTAs |
| `TEAL` | `#2B8A6E` | Secondary accent, success, compound scenarios |
| `IVORY` | `#F0EDE4` | Light panel backgrounds, section alternates |

**Prohibited:** No purple anywhere on the platform. No `purple-*`, `violet-*`, `indigo-*`, `cyan-*`, or `blue-600+` Tailwind classes.

Red is reserved for crisis/critical severity only. Yellow/orange for warnings only.

---

## Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Editorial headings | Cormorant Garamond | 600–700 | Serif — used for hero headlines, section headers |
| Labels / caps | Barlow Condensed | 700 | `letter-spacing: 0.34em`, uppercase |
| Body / UI | System sans-serif | 500 base | Global `font-weight: 500` minimum |
| Logo monogram | Georgia (serif) | Bold | "VM" in TechSeal |
| Logo arc text | Courier monospace | — | "VAUGHNMARTIN · READINESS OS" and "ANTE IGNEM PARATUS" |

**Rule:** All visible text must be at least medium weight. No light/thin text in production copy.

---

## Logo — Authoritative Definition

The logo is a **custom SVG React component**, not any PNG file.

**Source:** `client/src/components/ExecuteIQLogo.tsx` → exported as `VaughnMartinLogo`  
**Wrapper:** `client/src/components/VaughnMartinLogo.tsx`

### Visual Anatomy

1. **TechSeal** — circular badge
   - Navy radial gradient fill (`#0A0F2E` → `#1a2860`)
   - Gold outer ring (`#C9A84C`, 1px stroke)
   - Tick marks around perimeter, cardinal diamonds at N/S/E/W
   - "VM" monogram centered — Georgia serif bold, gold
   - "VAUGHNMARTIN · READINESS OS" arced top — Courier monospace, gold
   - "ANTE IGNEM PARATUS" arced bottom — Courier monospace, teal
   - Teal signal pulse dot at 6 o'clock

2. **Wordmark** (to the right of seal)
   - "VaughnMartin" — Cormorant Garamond, weight 600
   - Short gold rule
   - "READINESS OS" — Barlow Condensed, weight 700, letter-spacing 0.34em, uppercase

### Usage

```tsx
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";

<ExecuteIQLogo variant="full" color="navy" height={56} animated={true} />
<ExecuteIQLogo variant="icon-only" color="navy" height={40} />
```

**Never use** `poise-logo-official.png`, `poise-logo.png`, or any PNG from `attached_assets/` as the logo.

---

## Border Radius

`border-radius: 0.15rem` — All buttons, cards, badges. Keeps them sharp and executive. No rounded corners.

---

## Layout

- **Desktop-first.** Max content width: `max-w-7xl mx-auto px-8`
- Mobile adjustments only if non-disruptive
- All pages wrapped in `PageLayout` component

---

## Component Conventions

### Buttons

```tsx
// Primary CTA — gold background
style={{ background: GOLD, color: NAVY, fontWeight: 700, fontSize: 12,
  padding: "10px 20px", borderRadius: "0.15rem", letterSpacing: "0.04em" }}

// Secondary — navy outline
style={{ border: `1px solid ${NAVY}`, color: NAVY, background: "transparent" }}
```

### Section Labels

```tsx
import { SectionLabel } from "@/components/SectionLabel";
<SectionLabel>PLATFORM ARCHITECTURE</SectionLabel>
```

Renders in gold, Barlow Condensed, 10–11px, letter-spacing 0.14em, uppercase.

### Editorial Stats

```tsx
import { EditorialStat } from "@/components/EditorialStat";
<EditorialStat value="170" label="Pre-staged Readiness Protocols" />
```

### Gold Rule

```tsx
import { GoldRule } from "@/components/GoldRule";
<GoldRule />  // Short horizontal gold line separator
```

---

## Page Structure Pattern

```
1. Hero — navy background, white headline, gold italic subline, CTA buttons
2. Stat bar — key metrics (12 min, 3,600×, 170, 221) on ivory or navy
3. Content sections — alternate navy / ivory / white
4. CTA close — gold button + secondary outline button
```

---

## Canonical Metrics (Use Exactly These)

| Metric | Canonical Display | Never Say |
|--------|-------------------|-----------|
| Execution time | **12 minutes** | "12 min", "twelve minutes" |
| Speed advantage | **3,600× Execution Head Start** | "340×", "360×", "speed advantage", "faster" |
| Protocols | **170 Readiness Protocols** | "170 playbooks", "170 scenarios" |
| Triggers | **221 trigger patterns** | "221 signals", "248+ triggers" |
| Signal monitoring | **248+ signals monitored every 15 minutes** | — |
| Baseline comparison | **30 days compressed to 12 minutes** | "72 hours", "1 week" |

---

## Dark Mode

Light mode is default (white backgrounds). Dark mode is supported via `.dark` class on `document.documentElement`. Use explicit Tailwind variants:

```tsx
className="bg-white dark:bg-[#0A0F2E] text-[#0A0F2E] dark:text-white"
```

---

## Design Audit Checklist

- [ ] Brand colors used exactly (NAVY `#0A0F2E`, GOLD `#C9A84C`, TEAL `#2B8A6E`, IVORY `#F0EDE4`)
- [ ] No purple, violet, indigo, or cyan anywhere
- [ ] Typography: Cormorant Garamond for editorial, Barlow Condensed for labels
- [ ] All text font-weight ≥ 500
- [ ] Border radius 0.15rem on all interactive elements
- [ ] Logo is the SVG component, not a PNG
- [ ] Metric values match canonical table above
- [ ] No retired language (AI-powered, Pilot Program, football terms)
- [ ] "Request Founding Partner Access" (not "Apply for Pilot" or similar)
- [ ] Desktop-first layout tested at 1280px+
