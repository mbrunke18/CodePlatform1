================================================================================
VEXOR CODE EXPORT - README
================================================================================

This export contains the complete source code for the VEXOR Strategic Execution
Operating System as of November 7, 2025.

WHAT'S INCLUDED:
--------------------------------------------------------------------------------

1. CONFIGURATION FILES
   - package.json (all dependencies)
   - tsconfig.json (TypeScript config)
   - tailwind.config.ts (styling)
   - vite.config.ts (build config)

2. SHARED SCHEMA & DATA
   - shared/schema.ts (database models)
   - shared/demo-scenarios.ts (7 demo scenarios with stakeholder rosters)

3. BACKEND (Node.js + Express + TypeScript)
   - server/index.ts (main server)
   - server/routes.ts (all API endpoints - 4000+ lines)
   - server/storage.ts (database interface)
   - server/services/DemoOrchestrationService.ts (demo activation engine)
   - server/services/WebSocketService.ts (real-time coordination)

4. FRONTEND (React + TypeScript + Vite)
   - client/src/main.tsx (app entry point)
   - client/src/App.tsx (routing)
   - client/src/index.css (global styles)
   - client/src/pages/DemoSelector.tsx (demo selection page)
   - client/src/pages/DemoLiveActivation.tsx (unified live demo component)
   - client/src/components/NavigationBar.tsx (global nav)
   - client/src/contexts/DemoController.tsx (demo state management)

5. DEMO COMPONENTS
   - TwelveMinuteTimer.tsx (live countdown)
   - DemoCompletionScreen.tsx (finale with confetti)
   - And more...

6. UI COMPONENTS (shadcn/ui)
   - Button, Card, Dialog, Toast, and 40+ more components

KEY FEATURES IMPLEMENTED:
--------------------------------------------------------------------------------
✅ 7 Complete Interactive Demos (Ransomware, M&A, Product Launch, Supplier,
   Competitive, Regulatory, Customer Crisis)
✅ Real-time WebSocket coordination
✅ Scenario-specific stakeholder rosters (30 unique stakeholders per demo)
✅ 12-minute execution timeline
✅ 80% coordination threshold (24/30 stakeholders)
✅ Before/after metrics (48-72h → 11:47 min)
✅ Confetti celebration on completion
✅ Light color theme throughout
✅ Professional enterprise-grade UI
✅ 148 strategic playbooks
✅ 5 AI intelligence modules
✅ Full integration hub

RECENT FIXES:
--------------------------------------------------------------------------------
✅ Fixed stakeholder acknowledgment names to match scenario-specific rosters
✅ All 7 demos now use dynamic stakeholder data from shared/demo-scenarios.ts
✅ Eliminated 200,000+ lines of duplicated demo code
✅ Unified demo architecture with single DemoLiveActivation component

HOW TO USE THIS EXPORT:
--------------------------------------------------------------------------------
1. Copy the entire code-export.txt file
2. Use it as reference for understanding the architecture
3. Search for specific components/features using file headers
4. Each file is clearly marked with "FILE: path/to/file.tsx"

TECH STACK:
--------------------------------------------------------------------------------
- Frontend: React 18, TypeScript, Vite, TanStack Query, Wouter
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL with Drizzle ORM
- Real-time: Socket.IO
- UI: shadcn/ui, Radix UI, Tailwind CSS
- AI: OpenAI GPT-4o

IMPORTANT NOTES:
--------------------------------------------------------------------------------
- This export contains the CORE files
- For complete UI component library, check client/src/components/ui/
- For all pages, check client/src/pages/
- Database schema is in shared/schema.ts
- Demo data is in shared/demo-scenarios.ts

FILE SIZE: ~620KB
TOTAL LINES: ~15,000+

================================================================================
