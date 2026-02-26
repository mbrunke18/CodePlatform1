# VaughnMartin — Execution Operating System

## Overview
VaughnMartin's Execution OS is a Strategic Execution platform for Fortune 1000 companies. Its primary purpose is to automate project creation, task assignment, document staging, and budget allocation within 12 minutes of a strategic trigger. This platform aims to eliminate organizational lag after strategic events. It integrates AI-driven trigger monitoring with a library of 170 strategic playbooks across 9 domains. Operating on the IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE), it fosters a human-AI partnership where AI handles monitoring, pattern detection, and recommendations, while human executives retain ultimate decision-making authority. The project's vision is to become "The Execution Infrastructure Enterprises Are Missing."

## User Preferences
- Preferred communication style: Simple, everyday language
- Valued prioritization approach with phase-by-phase implementation
- Maintain core product vision of human-AI partnership for strategic velocity
- Executive professional language required across UI/UX
- All text must be clearly and boldly readable — medium weight minimum, deep navy or dark gray
- Brand placement and visual memory is a priority — logo should appear on every key page

## System Architecture

**UI/UX Decisions:**
- **Default Theme:** Fully light mode with pure white backgrounds. Dark mode is supported via localStorage.
- **Color Palette:** Features gold (`#C9A84C`), teal/emerald (`#2B8A6E`), midnight navy (`#0A0F2E`), and off-white (`#F0EDE4` - now pure white). Gold is reserved for accents, labels, and metrics, never as a background.
- **Typography:** Global base font-weight 500. Headings are font-weight 700 in midnight navy. A specific text color scale is enforced, avoiding light gray variants. Custom utility classes define text styles for titles, subtitles, body, captions, and labels.
- **Branding:** Uses `VaughnMartin` (company) and `Execution OS` (product). Specific logo variants (`full`, `icon-only`, `text-only`) and color rules (`navy` on light, `white` on dark) are defined. A `BrandStamp` component is used for consistent brand placement across pages.
- **Navigation:** Streamlined 5-item navigation with a "More" dropdown and CTAs for "Try Demo" and "Start Pilot."
- **Layout:** `PageLayout` component wraps all pages, incorporating a `StandardNav` header and `Footer`.
- **Homepage Video Intro:** A 13-scene video intro (`VideoIntro.tsx`) plays on every homepage load, designed with white/gray backgrounds and specific progress dot styling.

**Technical Implementations:**
- **Frontend:** Built with React 18, TypeScript, Vite, Radix UI + shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter for routing, React Hook Form + Zod for validation, Framer Motion for animations, and Lucide React/react-icons for icons.
- **Backend:** Developed using Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL (Neon serverless) managed with Drizzle ORM.
- **Real-time:** Socket.IO WebSocket server for real-time collaboration.
- **Asynchronous Tasks:** PostgreSQL-backed background job queue for async AI tasks.
- **Live Signal Ingestion:** A service for real-time signal monitoring operating in 15-minute cycles.
- **Authentication:** Replit OIDC with Passport.js for session management. New users automatically get an organization created on first login (`onboardingCompleted: false`).
- **Onboarding Guard:** `requireOrgAccess` middleware enforces org-scoped access. Authenticated users without completed onboarding are redirected to `/onboarding` (5-step wizard). The "default" org ID placeholder is accepted as shorthand for the user's own org.
- **Role-Based Access:** `requireRole()` middleware factory enforces role checks on write routes (admin, executive, strategist). Users with no assigned role get read-only access.
- **AI Services:** Integrates OpenAI GPT-4o for pulse analysis, risk assessment, executive summaries, and opportunity detection.
- **Email:** Resend (`RESEND_API_KEY`) used for transactional email from `noreply@executeiq.io`. Falls back to console logging when key is absent.
- **IDEA Framework:** The system supports the IDEA Framework (IDENTIFY, DETECT, EXECUTE, ADVANCE) with features like Playbook customization, AI-powered pattern matching, coordinated response orchestration, and outcome analysis.
- **Key Features:** Includes an Executive Summary Generator, a 5-step New User Onboarding Wizard, an Enterprise Task Library, Execution Plan Sync, and a Pilot Demo showcasing the full trigger-to-execution loop.

## Customer & Deployment
- **Custom Domain:** executeiq.io
- **First Customer:** martybrunke — org ID `aa9d3bf3-ab20-4fb6-a1da-e91aabbfb576`
- **Contact Email:** mbrunke@vaughnmartin.com

## External Dependencies
- **AI:** OpenAI GPT-4o
- **Database:** Neon PostgreSQL
- **Authentication:** Replit OIDC
- **Email:** Resend (RESEND_API_KEY) — previously SendGrid, now migrated
- **Enterprise Integrations (planned):** Salesforce, HubSpot, ServiceNow, Jira, Slack, Microsoft Teams, Google Workspace, Outlook/Exchange, AWS CloudWatch, Workday, Okta, Microsoft Active Directory
