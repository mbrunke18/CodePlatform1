import PageLayout from '@/components/layout/PageLayout';
import { Button } from "@/components/ui/button";
import {
  Target,
  Radio,
  CheckCircle,
  BookOpen,
  ArrowRight,
  Clock,
  Zap,
  Users,
  Settings,
  Layers,
  GitBranch,
  Bell,
  BarChart3,
  Shield,
  Sparkles,
  Check,
  ChevronRight,
  Building2,
  Cpu,
  PenLine,
  RefreshCw
} from "lucide-react";
import { Link } from "wouter";

const NAVY = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#DFC178";
const TEAL = "#2B8A6E";
const TEAL_LIGHT = "#3BAF8A";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

function SectionLabel({ text, color = GOLD }: { text: string; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{ width: 28, height: 2, background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color }}>{text}</span>
    </div>
  );
}

function CheckItem({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
      <div style={{ width: 20, height: 20, background: light ? "rgba(43,138,110,0.15)" : "rgba(43,138,110,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
        <Check style={{ width: 11, height: 11, color: TEAL_LIGHT }} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 500, color: light ? "rgba(255,255,255,0.85)" : "#374151", lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <PageLayout>

      {/* ── HERO ── */}
      <section style={{ background: NAVY_BG, minHeight: "56vh", display: "flex", alignItems: "center", padding: "120px 56px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${GOLD}17 1px, transparent 1px), linear-gradient(90deg, ${GOLD}17 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${TEAL}38 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "5%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}28 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div className="max-w-6xl mx-auto w-full" style={{ position: "relative", zIndex: 1 }}>
          <SectionLabel text="Your Complete Execution Roadmap" color={GOLD_LIGHT} />
          <h1 style={{ ...CG, fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 600, color: "#fff", lineHeight: 1.1, marginBottom: 24, maxWidth: 800 }}>
            How Execution OS Works — Start to Value
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.72)", maxWidth: 640, lineHeight: 1.7, marginBottom: 48, fontWeight: 500 }}>
            From your first login to a fully coordinated enterprise response in 12 minutes. This is exactly how the platform works — the setup, the 170 playbooks, how customization works, and how ongoing value builds over time.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/pilot-program">
              <Button style={{ background: GOLD, color: NAVY, fontWeight: 700, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", padding: "13px 32px", border: "none" }}>
                Request Pilot Access
              </Button>
            </Link>
            <Link href="/try-demo">
              <Button style={{ background: "transparent", color: "#fff", fontWeight: 700, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", padding: "13px 32px", border: "1.5px solid rgba(255,255,255,0.3)" }}>
                See a Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PHASE NAV BAR ── */}
      <div style={{ background: NAVY, borderBottom: `1px solid rgba(255,255,255,0.08)`, display: "flex", overflowX: "auto" }}>
        {[
          { label: "Onboarding", num: "01" },
          { label: "Your Playbooks", num: "02" },
          { label: "Customization", num: "03" },
          { label: "The Live Loop", num: "04" },
          { label: "Ongoing Value", num: "05" },
        ].map((item, i) => (
          <div key={i} style={{ padding: "20px 32px", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: "0.15em" }}>{item.num}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* ── 01: ONBOARDING ── */}
      <section style={{ background: "#fff", padding: "100px 56px" }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel text="01 — Setup & Onboarding" color={TEAL} />
          <h2 style={{ ...CG, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 600, color: NAVY, marginBottom: 16, maxWidth: 600 }}>
            From First Login to Fully Configured
          </h2>
          <p style={{ fontSize: 16, color: "#6B7280", maxWidth: 580, lineHeight: 1.7, marginBottom: 64, fontWeight: 500 }}>
            When your organization logs in for the first time, the platform automatically creates your workspace and walks you through a structured Strategic Foundation setup. No IT ticket, no manual provisioning.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
            {[
              {
                step: "Step 1",
                title: "Auto-Provisioning",
                icon: Building2,
                color: TEAL,
                desc: "Your organization is created automatically on first login. The system initializes your workspace using your authentication profile — company name, admin role, and a blank strategic slate.",
                items: ["Organization created instantly", "Admin role established", "No IT ticket required", "Workspace ready in seconds"]
              },
              {
                step: "Step 2",
                title: "Strategic Foundation Wizard",
                icon: Settings,
                color: GOLD,
                desc: "An 8-step guided wizard collects the configuration the platform actually uses — not just profile data. This is the setup that makes the 12-minute promise possible.",
                items: ["Industry & company profile", "Department mapping", "Executive role assignments", "Pre-approved budget thresholds"]
              },
              {
                step: "Step 3",
                title: "IDEA Framework Mapping",
                icon: Users,
                color: NAVY,
                desc: "The wizard maps decision rights before a crisis occurs. Who owns Regulatory Response? Who is the Financial domain executive sponsor? This is assigned now — not figured out under pressure.",
                items: ["Domain ownership assigned", "Escalation paths defined", "12-minute target window set", "Approval chains locked in advance"]
              },
              {
                step: "Step 4",
                title: "Signal Monitoring Activated",
                icon: Radio,
                color: TEAL,
                desc: "Your selected signal categories go live. The AI begins monitoring from the moment setup completes — every 15 minutes, across your chosen domains.",
                items: ["16 signal categories available", "Monitoring starts immediately", "15-minute refresh cycles", "Threshold triggers configured"]
              }
            ].map((card, i) => (
              <div key={i} style={{ background: i % 3 === 1 ? OFF : "#fff", border: `1px solid ${BORDER}`, padding: "48px 40px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, background: card.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <card.icon style={{ width: 18, height: 18, color: "#fff" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: card.color, marginBottom: 2 }}>{card.step}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: NAVY }}>{card.title}</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 24, fontWeight: 500 }}>{card.desc}</p>
                {card.items.map((item, j) => (
                  <CheckItem key={j} text={item} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02: THE 170 PLAYBOOKS ── */}
      <section style={{ background: OFF, padding: "100px 56px" }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel text="02 — Your Playbook Foundation" color={GOLD} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            <div>
              <h2 style={{ ...CG, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 600, color: NAVY, marginBottom: 24 }}>
                170 Battle-Tested Playbooks — Ready on Day One
              </h2>
              <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.7, marginBottom: 32, fontWeight: 500 }}>
                The platform comes pre-loaded with 170 playbooks across 9 strategic domains — built from real enterprise crisis patterns, M&A events, regulatory shifts, and competitive disruptions.
              </p>
              <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.7, marginBottom: 40, fontWeight: 500 }}>
                These are not generic templates. Each playbook contains a defined task sequence, role assignments, escalation logic, communication assets, and success metrics — built specifically for Fortune 1000-scale responses.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {["Competitive Movement", "M&A Response", "Crisis Management", "Regulatory Shift", "Supply Chain", "Talent Crisis", "Cyber Breach", "Market Entry", "ESG Response"].map((domain, i) => (
                  <div key={i} style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "12px 14px", fontSize: 11, fontWeight: 700, color: NAVY, letterSpacing: "0.04em" }}>
                    {domain}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { num: "170", label: "Pre-Built Playbooks", sub: "Across 9 strategic domains", color: GOLD },
                { num: "9", label: "Strategic Domains", sub: "Full enterprise coverage", color: TEAL },
                { num: "216+", label: "Signal Data Points", sub: "Monitoring your environment", color: NAVY },
                { num: "12 min", label: "Execution Window", sub: "From trigger to coordination", color: GOLD },
              ].map((stat, i) => (
                <div key={i} style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "28px 32px", display: "flex", alignItems: "center", gap: 24 }}>
                  <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: stat.color, lineHeight: 1, flexShrink: 0, minWidth: 80 }}>{stat.num}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 3 }}>{stat.label}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{stat.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 03: CUSTOMIZATION ── */}
      <section style={{ background: NAVY_BG, padding: "100px 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${GOLD}0F 1px, transparent 1px), linear-gradient(90deg, ${GOLD}0F 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-20%", right: "-5%", width: 800, height: 800, borderRadius: "50%", background: `radial-gradient(circle, ${TEAL}1C 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div className="max-w-6xl mx-auto" style={{ position: "relative", zIndex: 1 }}>
          <SectionLabel text="03 — Playbook Customization" color={GOLD_LIGHT} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start", marginBottom: 64 }}>
            <div>
              <h2 style={{ ...CG, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 600, color: "#fff", marginBottom: 24 }}>
                Start with the 170. Make It Yours.
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontWeight: 500 }}>
                Every one of the 170 playbooks is a starting point, not a ceiling. Your team can take any library playbook and configure it to match your exact org structure, approval thresholds, stakeholder names, task sequences, and success criteria — without touching the underlying template.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, marginBottom: 24, fontWeight: 500 }}>
                You can also build entirely new playbooks from scratch — using the Strategic Recorder, which turns your crisis notes, transcripts, or battle plans into a structured playbook using AI.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", border: `1px solid rgba(201,168,76,0.3)`, background: "rgba(201,168,76,0.07)" }}>
                <Sparkles style={{ width: 16, height: 16, color: GOLD_LIGHT, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: GOLD_LIGHT, fontWeight: 600 }}>The library grows with you. No playbook is ever static.</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {[
              {
                phase: "PREPARE",
                icon: Users,
                color: TEAL_LIGHT,
                title: "Configure Your Team",
                items: [
                  "Name your specific stakeholders",
                  "Set notification SLAs (e.g., CEO within 2 min)",
                  "Define pre-approved budget limits",
                  "Map your RACI to this scenario"
                ]
              },
              {
                phase: "MONITOR",
                icon: Bell,
                color: GOLD_LIGHT,
                title: "Set Your Triggers",
                items: [
                  "Choose which signals activate this playbook",
                  "Set confidence thresholds",
                  "Configure auto-activation rules",
                  "Combine conditions with AND / OR logic"
                ]
              },
              {
                phase: "EXECUTE",
                icon: GitBranch,
                color: "#A78BFA",
                title: "Design Your Response",
                items: [
                  "Define task sequence by time window",
                  "Assign owners to every action",
                  "Build decision trees for your scenarios",
                  "Attach communication templates"
                ]
              },
              {
                phase: "LEARN",
                icon: BarChart3,
                color: TEAL_LIGHT,
                title: "Define Success",
                items: [
                  "Set your outcome target metrics",
                  "Define what 'resolved' looks like",
                  "Enable AI retrospective capture",
                  "Feed learnings back into playbook"
                ]
              }
            ].map((col, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "36px 28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <col.icon style={{ width: 16, height: 16, color: col.color }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: col.color }}>{col.phase}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 20 }}>{col.title}</div>
                {col.items.map((item, j) => (
                  <CheckItem key={j} text={item} light />
                ))}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "32px 36px", display: "flex", alignItems: "flex-start", gap: 20 }}>
              <div style={{ width: 44, height: 44, background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <PenLine style={{ width: 18, height: 18, color: GOLD_LIGHT }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Build Net-New Playbooks</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontWeight: 500 }}>
                  Use the Strategic Recorder to paste in crisis notes, board transcripts, or past incident reports. GPT-4o generates a structured playbook outline from your own institutional knowledge.
                </p>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "32px 36px", display: "flex", alignItems: "flex-start", gap: 20 }}>
              <div style={{ width: 44, height: 44, background: "rgba(43,138,110,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Cpu style={{ width: 18, height: 18, color: TEAL_LIGHT }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Custom Signal Triggers</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontWeight: 500 }}>
                  The Visual Trigger Builder lets you define your own activation conditions — Spike / Drop operators, multi-condition AND/OR logic, and auto-activation rules that fire a specific playbook the moment conditions are met.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04: THE LIVE LOOP ── */}
      <section style={{ background: "#fff", padding: "100px 56px" }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel text="04 — The Live Value Loop" color={TEAL} />
          <h2 style={{ ...CG, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 600, color: NAVY, marginBottom: 24, maxWidth: 560 }}>
            What Happens Once You're Live
          </h2>
          <p style={{ fontSize: 16, color: "#6B7280", maxWidth: 600, lineHeight: 1.7, marginBottom: 72, fontWeight: 500 }}>
            The platform doesn't wait for you to log in. The IDEA Framework runs as a continuous operating loop — monitoring, detecting, coordinating, and learning — every day.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
            {[
              {
                letter: "I",
                phase: "IDENTIFY",
                color: TEAL,
                bg: OFF,
                title: "Infrastructure Built in Advance",
                desc: "Your playbooks, decision rights, domain owners, and budget thresholds are already defined. When a situation hits, the system knows exactly what to do and who to call.",
                sub: "Ready before you need it."
              },
              {
                letter: "D",
                phase: "DETECT",
                color: GOLD,
                bg: "#fff",
                title: "AI Monitoring — Every 15 Min",
                desc: "The signal engine scans 216+ data points across 16 categories — competitive shifts, regulatory changes, market signals, and more. When AI confidence crosses your threshold, an alert fires.",
                sub: "No scrambling to figure out what happened."
              },
              {
                letter: "E",
                phase: "EXECUTE",
                color: TEAL,
                bg: OFF,
                title: "Coordination in 12 Minutes",
                desc: "Playbook activates. Stakeholders notified. Tasks assigned with named owners and deadlines. Decision rights are clear — no committees to convene. Execution begins in minutes.",
                sub: "Not planning. Execution."
              },
              {
                letter: "A",
                phase: "ADVANCE",
                color: "#A78BFA",
                bg: "#fff",
                title: "Every Execution Gets Smarter",
                desc: "After each playbook closes, GPT-4o generates an executive outcome summary. Lessons feed back into the playbook. The organization's institutional knowledge compounds.",
                sub: "Your competitive moat grows with each event."
              }
            ].map((phase, i) => (
              <div key={i} style={{ background: phase.bg, borderTop: `3px solid ${phase.color}`, padding: "48px 36px", borderRight: i < 3 ? `1px solid ${BORDER}` : "none" }}>
                <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: phase.color, lineHeight: 1, marginBottom: 8 }}>{phase.letter}</div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: phase.color, marginBottom: 20 }}>{phase.phase}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 12 }}>{phase.title}</div>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, marginBottom: 20, fontWeight: 500 }}>{phase.desc}</p>
                <div style={{ fontSize: 11, fontWeight: 700, color: phase.color, letterSpacing: "0.05em" }}>{phase.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12-MINUTE TIMELINE ── */}
      <section style={{ background: NAVY, padding: "100px 56px" }}>
        <div className="max-w-4xl mx-auto">
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <SectionLabel text="The 12-Minute Proof Point" />
            <h2 style={{ ...CG, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600, color: "#fff" }}>
              From Signal Detected to Coordinated Execution
            </h2>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 8, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.08)" }} />
            {[
              { time: "0:00", label: "Signal Detected", color: GOLD_LIGHT, desc: "AI detects a strategic signal — a competitor announcement, a regulatory filing, a market move — and scores it against your configured thresholds." },
              { time: "1:00", label: "Alert Generated", color: TEAL_LIGHT, desc: "An alert fires with strategic context: what happened, why it matters for your org, affected domains, and the recommended playbook to activate." },
              { time: "2:00", label: "Playbook Activated", color: GOLD_LIGHT, desc: "The matched playbook from your library activates. Stakeholders receive coordinated notifications. The system knows who owns what — no ambiguity." },
              { time: "5:00", label: "Tasks Assigned", color: TEAL_LIGHT, desc: "Every task has a named owner, a deadline, and a clear decision-rights framework. All workstreams start simultaneously, not sequentially." },
              { time: "12:00", label: "Full Coordinated Execution", color: GOLD_LIGHT, desc: "Cross-functional teams executing in parallel. Real-time progress tracked. Every action logged. The organization is running — not preparing to run." }
            ].map((step, i) => (
              <div key={i} style={{ position: "relative", paddingLeft: 48, paddingBottom: i < 4 ? 40 : 0 }}>
                <div style={{ position: "absolute", left: 4, top: 8, width: 8, height: 8, background: step.color, borderRadius: "50%" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                  <span style={{ ...CG, fontSize: 28, fontWeight: 600, color: step.color, minWidth: 60 }}>{step.time}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>{step.label}</span>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontWeight: 500 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05: ONGOING VALUE ── */}
      <section style={{ background: OFF, padding: "100px 56px" }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel text="05 — Ongoing Value" color={GOLD} />
          <h2 style={{ ...CG, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 600, color: NAVY, marginBottom: 24, maxWidth: 540 }}>
            Value That Compounds Over Time
          </h2>
          <p style={{ fontSize: 16, color: "#6B7280", maxWidth: 580, lineHeight: 1.7, marginBottom: 72, fontWeight: 500 }}>
            The platform doesn't just respond to today's events. It learns from them. Every execution builds institutional knowledge that makes the next response faster, smarter, and better coordinated.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 2 }}>
            {[
              {
                icon: RefreshCw,
                color: TEAL,
                title: "Execution Intelligence Score",
                desc: "A normalized 0–100 maturity score based on activation frequency, ADVANCE closure rate, and trigger depth. Three levels: Emerging, Developing, Operating. Tracks your org's progression over time."
              },
              {
                icon: BarChart3,
                color: GOLD,
                title: "ROI Dashboard",
                desc: "Tracks hard value: decisions moved from days to minutes, cost-avoidance estimates based on Fortune 1000 industry benchmarks, and percentile ranking against peers in your industry."
              },
              {
                icon: BookOpen,
                color: NAVY,
                title: "Playbook Performance Fingerprints",
                desc: "For every playbook with 3+ activations: activation count, average execution time, target met rate, and recent outcome notes. Know which playbooks perform and which need refinement."
              }
            ].map((card, i) => (
              <div key={i} style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "40px 36px" }}>
                <div style={{ width: 44, height: 44, background: card.color === NAVY ? "#0A0F2E" : card.color === GOLD ? "rgba(201,168,76,0.12)" : "rgba(43,138,110,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <card.icon style={{ width: 18, height: 18, color: card.color === NAVY ? "#fff" : card.color }} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 12 }}>{card.title}</div>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, fontWeight: 500 }}>{card.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "40px 36px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, marginBottom: 16 }}>Institutional Memory</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Lessons Become the Next Playbook</div>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, fontWeight: 500, marginBottom: 20 }}>
                After every playbook closes, the ADVANCE phase captures what worked, what didn't, and what the next team should know. Those lessons feed directly back into your playbook library — so knowledge stays with the organization, not the individual.
              </p>
              <CheckItem text="GPT-4o executive outcome summary generated" />
              <CheckItem text="Lessons tagged and stored in playbook history" />
              <CheckItem text="Refinement suggestions surfaced automatically" />
            </div>
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "40px 36px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>Simulation Studio</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Test Scenarios Before They Happen</div>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, fontWeight: 500, marginBottom: 20 }}>
                Describe any hypothetical scenario and the Simulation Studio runs a dry-run against your actual playbook library. It returns Survive and Thrive scores, shows which playbooks would activate, and identifies coverage gaps — before you commit anything.
              </p>
              <CheckItem text="Survive / Thrive scores (0–100)" />
              <CheckItem text="Matched playbooks from your library" />
              <CheckItem text="Coverage gaps identified by domain" />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU CAN CUSTOMIZE ── */}
      <section style={{ background: "#fff", padding: "100px 56px", borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel text="Customization Summary" color={TEAL} />
          <h2 style={{ ...CG, fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 600, color: NAVY, marginBottom: 16, maxWidth: 520 }}>
            Three Layers of Customization
          </h2>
          <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 540, lineHeight: 1.7, marginBottom: 56, fontWeight: 500 }}>
            Everything in the platform is configurable. Here's what you control and how deep it goes.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: `1px solid ${BORDER}` }}>
            {[
              {
                num: "01",
                color: TEAL,
                title: "Playbook Layer",
                what: "The 170 library playbooks are starting points. Customize any of them — or build new ones from scratch.",
                controls: [
                  "Stakeholder names and notification SLAs",
                  "Task sequences and time windows",
                  "Decision trees and escalation logic",
                  "Pre-approved budget thresholds",
                  "Communication templates with merge fields",
                  "Net-new playbooks via Strategic Recorder"
                ]
              },
              {
                num: "02",
                color: GOLD,
                title: "Signal & Trigger Layer",
                what: "Define exactly what activates your playbooks — and how sensitive each trigger is.",
                controls: [
                  "16 signal categories to choose from",
                  "Custom activation conditions per playbook",
                  "AND / OR / Threshold multi-condition logic",
                  "Spike / Drop / Threshold operators",
                  "Auto-activation (no human required)",
                  "Per-domain sensitivity thresholds"
                ]
              },
              {
                num: "03",
                color: NAVY,
                title: "Organization Layer",
                what: "Configure your full org structure so the platform routes the right response to the right people.",
                controls: [
                  "Business units and department mapping",
                  "Role-based access control (RBAC)",
                  "Domain ownership and executive sponsors",
                  "Strategic objectives linked to playbooks",
                  "Industry-specific signal defaults",
                  "Execution window and budget limits"
                ]
              }
            ].map((layer, i) => (
              <div key={i} style={{ padding: "48px 40px", borderRight: i < 2 ? `1px solid ${BORDER}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <span style={{ ...CG, fontSize: 32, fontWeight: 600, color: layer.color }}>{layer.num}</span>
                  <div style={{ width: 1, height: 28, background: BORDER }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{layer.title}</span>
                </div>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, marginBottom: 24, fontWeight: 500 }}>{layer.what}</p>
                {layer.controls.map((item, j) => (
                  <CheckItem key={j} text={item} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: NAVY_BG, padding: "100px 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${GOLD}0F 1px, transparent 1px), linear-gradient(90deg, ${GOLD}0F 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-5%", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}1C 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div className="max-w-4xl mx-auto" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <SectionLabel text="Ready to Start" color={GOLD_LIGHT} />
          <h2 style={{ ...CG, fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 600, color: "#fff", marginBottom: 20 }}>
            We Make Enterprises Fearless.
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", marginBottom: 48, fontWeight: 500, maxWidth: 520, margin: "0 auto 48px" }}>
            Stop improvising. Start executing. The infrastructure is ready — with 170 playbooks, AI signal monitoring, and a 12-minute coordination window built before the moment arrives.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/pilot-program">
              <Button style={{ background: GOLD, color: NAVY, fontWeight: 700, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", padding: "14px 36px", border: "none" }}>
                Request Pilot Access
              </Button>
            </Link>
            <Link href="/try-demo">
              <Button style={{ background: "transparent", color: "#fff", fontWeight: 700, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", padding: "14px 36px", border: "1.5px solid rgba(255,255,255,0.25)" }}>
                Try the Demo
              </Button>
            </Link>
            <Link href="/simulation-studio">
              <Button style={{ background: "transparent", color: "rgba(255,255,255,0.65)", fontWeight: 700, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", padding: "14px 36px", border: "1.5px solid rgba(255,255,255,0.12)" }}>
                Run a Dry-Run
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
