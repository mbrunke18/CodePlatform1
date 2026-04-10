import { useEffect } from "react";
import { Link } from "wouter";
import {
  Shield, Zap, Eye, BookOpen, Radio, Clock, CheckCircle, ArrowRight,
  Target, BarChart3, AlertTriangle, Users, Globe, Lock, TrendingUp,
  FileText, Monitor, Layers, Activity
} from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

const RED = "#DC2626";
const GREEN = "#059669";

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return <section id={id} style={{ marginBottom: 64 }}>{children}</section>;
}

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "inline-block", background: `${GOLD}18`, border: `1px solid ${GOLD}40`, borderRadius: 0, padding: "4px 12px", fontSize: 10, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase" as const, color: GOLD, marginBottom: 12 }}>
        {label}
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: NAVY, margin: "0 0 8px", letterSpacing: "-0.5px" }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 15, color: "#4B5563", margin: 0, lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

function ScreenPreview({ title, children, accent = NAVY }: { title: string; children: React.ReactNode; accent?: string }) {
  return (
    <div style={{ borderRadius: 0, overflow: "hidden", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px rgba(10,15,46,0.08)" }}>
      <div style={{ background: accent, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: 0, background: "rgba(255,255,255,0.2)" }} />)}
        <span style={{ marginLeft: 8, fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: "0.5px" }}>{title}</span>
      </div>
      <div style={{ background: "#F8FAFC", padding: 20 }}>{children}</div>
    </div>
  );
}

function StatPill({ value, label, color = NAVY }: { value: string; label: string; color?: string }) {
  return (
    <div style={{ textAlign: "center" as const, padding: "20px 16px", background: "#fff", border: "1px solid #E5E7EB", borderTop: `3px solid ${color}`, borderRadius: 0 }}>
      <div style={{ fontSize: 28, fontWeight: 900, color, letterSpacing: "-1px", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" as const, letterSpacing: "1px", marginTop: 6 }}>{label}</div>
    </div>
  );
}

function StepCard({ number, title, description, path, icon: Icon }: { number: number; title: string; description: string; path: string; icon: React.ElementType }) {
  return (
    <div style={{ display: "flex", gap: 20, padding: "24px 0", borderBottom: "1px solid #F3F4F6" }}>
      <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 0, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 18, fontWeight: 900, color: GOLD }}>{number}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" as const }}>
          <Icon size={16} color={TEAL} />
          <span style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>{title}</span>
          <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "monospace", background: "#F3F4F6", padding: "2px 8px", borderRadius: 0 }}>{path}</span>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: "#4B5563", lineHeight: 1.7 }}>{description}</p>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon: Icon, path, color = NAVY }: { title: string; description: string; icon: React.ElementType; path: string; color?: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 0, padding: 24, borderLeft: `4px solid ${color}` }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 0, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={18} color={color} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" as const }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: NAVY }}>{title}</span>
            <span style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "monospace", background: "#F3F4F6", padding: "2px 6px", borderRadius: 0 }}>{path}</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#4B5563", lineHeight: 1.7 }}>{description}</p>
        </div>
      </div>
    </div>
  );
}

function FlowStep({ icon: Icon, title, detail, color }: { icon: React.ElementType; title: string; detail: string; color: string }) {
  return (
    <div style={{ textAlign: "center" as const, flex: 1 }}>
      <div style={{ width: 52, height: 52, borderRadius: 0, background: `${color}14`, border: `2px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
        <Icon size={20} color={color} />
      </div>
      <div style={{ fontSize: 12, fontWeight: 800, color: NAVY, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.5, whiteSpace: "pre-line" as const }}>{detail}</div>
    </div>
  );
}

function FeatureRow({ title, description, icon: Icon, path, color = NAVY }: { title: string; description: string; icon: React.ElementType; path: string; color?: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 0, padding: "16px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div style={{ width: 36, height: 36, borderRadius: 0, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={16} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" as const }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: NAVY }}>{title}</span>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "#9CA3AF", background: "#F3F4F6", padding: "2px 6px", borderRadius: 0 }}>{path}</span>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "#4B5563", lineHeight: 1.6 }}>{description}</p>
      </div>
    </div>
  );
}

export default function OnboardingGuide() {
  useEffect(() => {
    document.title = "Executive Onboarding Guide — VaughnMartin Readiness OS";
  }, []);

  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh", fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* Top bar */}
      <div className="print:hidden" style={{ background: NAVY, padding: "10px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>← Return to Platform</Link>
        <button
          onClick={() => window.print()}
          style={{ fontSize: 12, fontWeight: 700, color: GOLD, background: "transparent", border: `1px solid ${GOLD}40`, borderRadius: 0, padding: "6px 16px", cursor: "pointer", letterSpacing: "0.5px" }}
        >
          Save as PDF
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 40px 80px" }}>

        {/* Cover */}
        <div style={{ background: NAVY, borderRadius: "0 0 16px 16px", padding: "64px 56px 56px", marginBottom: 56, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: 0, background: `${GOLD}08`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: 0, background: `${TEAL}0A`, pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
              <div style={{ width: 48, height: 48, borderRadius: 0, background: `linear-gradient(135deg, ${GOLD}, #A8873A)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 2px ${GOLD}40` }}>
                <Shield size={22} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: "2.5px", textTransform: "uppercase" as const }}>VaughnMartin</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>Readiness OS</div>
              </div>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, color: "#fff", margin: "0 0 12px", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
              Executive Onboarding Guide
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", margin: "0 0 40px", maxWidth: 520, lineHeight: 1.6 }}>
              Everything you need to understand, activate, and operate your Readiness OS from day one.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[["12 min", "Execution Time"], ["3,600×", "Execution Head Start"], ["170", "Pre-Built Playbooks"], ["221", "Live Triggers"]].map(([v, l]) => (
                <div key={l} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 0, padding: "16px 12px", textAlign: "center" as const }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: GOLD, letterSpacing: "-0.5px" }}>{v}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "1px", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 01 — Platform Overview */}
        <Section id="overview">
          <SectionHeader
            label="01 — Platform Overview"
            title="What You Now Have Access To"
            subtitle="Readiness OS is not a reporting tool or a dashboard. It is the operating infrastructure that compresses your mobilization cycle from 30 days to 12 minutes — before a strategic trigger fires, not after."
          />
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 0, padding: 32, marginBottom: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 800, color: NAVY, margin: "0 0 16px", textTransform: "uppercase" as const, letterSpacing: "1px" }}>What AI Does</h3>
                {[
                  "Monitors 248+ data points across 9 strategic domains",
                  "Detects patterns across 221 configured trigger scenarios",
                  "Scores signal confidence and fires alerts above 72% threshold",
                  "Pre-stages the right playbook before you are asked to act",
                  "Logs every detection for audit and board reporting",
                ].map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                    <CheckCircle size={14} color={TEAL} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 800, color: NAVY, margin: "0 0 16px", textTransform: "uppercase" as const, letterSpacing: "1px" }}>What You Do</h3>
                {[
                  "Review trigger alerts and confidence scores",
                  "Authorize playbook activation with one decision",
                  "Monitor live execution progress in the Command Tower",
                  "Track team acknowledgments and task completion",
                  "Review Board Readiness reports and ROI metrics",
                ].map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                    <ArrowRight size={14} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ background: `${GOLD}0C`, border: `1px solid ${GOLD}30`, borderRadius: 0, padding: 24 }}>
            <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.8 }}>
              <strong style={{ color: NAVY }}>The core principle:</strong> No playbook activates without your explicit authorization. AI monitors, detects, and pre-stages. You decide. The preparation compresses the mobilization cycle from weeks to minutes — the authority remains yours.
            </p>
          </div>
        </Section>

        {/* 02 — Quick Start */}
        <Section id="quickstart">
          <SectionHeader
            label="02 — Quick Start"
            title="Your First 15 Minutes"
            subtitle="Follow these five steps in order. By the end, you will have a live view of your threat environment, your playbooks, and your organization's execution readiness."
          />
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 0, padding: "8px 32px" }}>
            <StepCard number={1} icon={Monitor} title="Mission Control" path="/mission-control"
              description="Your operational hub. Start here. You will see active trigger detections, playbook status, execution dividend (real-time ROI counter), and a live signal activity feed. This is the page you return to daily." />
            <StepCard number={2} icon={Radio} title="Command Tower" path="/command-tower"
              description="Full-screen executive display. Shows live trigger detections as they fire, system pulse stats, your 12-minute execution clock, and a signal ticker in real time. Designed for war room situations and leadership reviews." />
            <StepCard number={3} icon={BookOpen} title="Playbook Library" path="/playbooks"
              description="Browse all 170 pre-built strategic playbooks across 9 domains. Each contains 4 execution phases, role-specific task assignments, decision gates, and expert content. Three are publicly accessible; 167 are pilot-exclusive." />
            <StepCard number={4} icon={Activity} title="Simulation Studio" path="/simulation-studio"
              description="Model any strategic scenario before it happens. Input a threat, select your industry, and receive a Survive vs. Thrive score with recommended playbooks. Use this in board preparation and executive planning sessions." />
            <StepCard number={5} icon={FileText} title="Board Readiness Snapshot" path="/board-readiness"
              description="A print-ready executive report showing your domain coverage, response time statistics, readiness score (0–100), and recent trigger detections. Export as PDF for board and audit committee presentations." />
          </div>
        </Section>

        {/* 03 — Platform Map */}
        <Section id="platform-map">
          <SectionHeader
            label="03 — Platform Map"
            title="The IDEA Framework — How the Platform is Organized"
            subtitle="Every page and feature maps to one of four execution phases: Identify, Detect, Execute, Advance. Together they form a continuous cycle, not a one-time response."
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <FeatureCard icon={Target} title="IDENTIFY" path="/workspace?tab=identify" color={NAVY}
              description="Configure your strategic triggers, risk thresholds, and monitoring scope. Define which signals matter to your organization and how sensitive the detection should be." />
            <FeatureCard icon={Radio} title="DETECT" path="/command-tower" color={TEAL}
              description="Live monitoring dashboard. Real-time RSS ingestion from 8 sources every 15 minutes. Signal confidence scoring. Trigger detection with deduplication and email alerts." />
            <FeatureCard icon={Zap} title="EXECUTE" path="/mission-control" color={GOLD}
              description="Activate playbooks, assign tasks to role-specific teams, track acknowledgments, and monitor the 12-minute execution clock. Full audit trail on every action." />
            <FeatureCard icon={BarChart3} title="ADVANCE" path="/board-readiness" color={TEAL}
              description="Board Readiness Snapshot, Execution Dividend ROI counter, historical detection logs, and performance analytics. Turn every incident into institutional memory." />
          </div>

          <ScreenPreview title="vaughnmartin.com/mission-control" accent={NAVY}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
              {[["221", "Triggers Armed"], ["170", "Playbooks Ready"], ["248+", "Data Points"], ["12 min", "Response Time"]].map(([v, l]) => (
                <div key={l} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 0, padding: "12px 8px", textAlign: "center" as const }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: NAVY }}>{v}</div>
                  <div style={{ fontSize: 10, color: "#6B7280", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginTop: 3 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 2, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 0, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: 10 }}>Live Signal Feed</div>
                {[
                  { label: "AI Competitive Disruption · 94% confidence · CNBC", dot: "#EF4444" },
                  { label: "Supply Chain Stress · 81% confidence · Reuters", dot: GOLD },
                  { label: "Regulatory Shift Detected · 76% confidence · SEC", dot: TEAL },
                ].map(({ label, dot }, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i < 2 ? "1px solid #F3F4F6" : "none" }}>
                    <div style={{ width: 6, height: 6, borderRadius: 0, background: dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "#374151" }}>{label}</span>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 0, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: 10 }}>Readiness Dividend</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: TEAL }}>$2.4M</div>
                <div style={{ fontSize: 10, color: "#6B7280", marginTop: 4 }}>Value preserved vs. 30-day baseline</div>
              </div>
            </div>
          </ScreenPreview>
        </Section>

        {/* 04 — Detection Flow */}
        <Section id="detection">
          <SectionHeader
            label="04 — How It Works"
            title="The Detection & Execution Flow"
            subtitle="From signal ingestion to playbook activation — this is what happens automatically in the background while you run your business."
          />
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 0, padding: "32px 24px", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <FlowStep icon={Globe} title="Signal Ingestion" detail={"8 RSS sources\nEvery 15 minutes\n248+ data points"} color={NAVY} />
              <div style={{ paddingTop: 24, color: "#D1D5DB", fontWeight: 300, fontSize: 18, flexShrink: 0 }}>→</div>
              <FlowStep icon={Activity} title="Pattern Scoring" detail={"16 trigger patterns\n3+ keyword match\n72%+ confidence"} color={TEAL} />
              <div style={{ paddingTop: 24, color: "#D1D5DB", fontWeight: 300, fontSize: 18, flexShrink: 0 }}>→</div>
              <FlowStep icon={AlertTriangle} title="Alert Fired" detail={"Email notification\nCommand Tower alert\n4-hr deduplication"} color={GOLD} />
              <div style={{ paddingTop: 24, color: "#D1D5DB", fontWeight: 300, fontSize: 18, flexShrink: 0 }}>→</div>
              <FlowStep icon={BookOpen} title="Playbook Staged" detail={"Right playbook\npre-selected\nawaiting your call"} color={TEAL} />
              <div style={{ paddingTop: 24, color: "#D1D5DB", fontWeight: 300, fontSize: 18, flexShrink: 0 }}>→</div>
              <FlowStep icon={Lock} title="You Authorize" detail={"One decision\nfull team mobilized\n12-min clock starts"} color={RED} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <StatPill value="8" label="Signal Sources" color={NAVY} />
            <StatPill value="72%+" label="Confidence Threshold" color={TEAL} />
            <StatPill value="4 hrs" label="Deduplication Window" color={GOLD} />
          </div>
        </Section>

        {/* 05 — Playbook Library */}
        <Section id="playbooks">
          <SectionHeader
            label="05 — Playbook Library"
            title="170 Pre-Built Readiness Playbooks"
            subtitle="Every playbook contains 4 structured phases, role-specific task assignments, decision gates, escalation protocols, and expert content — pre-built before the trigger fires."
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {[
              { domain: "Competitive Intelligence", count: 19, examples: ["Aggressive Pricing Disruption", "AI Competitive Disruption", "Market Share Erosion"] },
              { domain: "Crisis & Resilience", count: 21, examples: ["Data Breach Response", "CEO Sudden Departure", "Financial Ransomware"] },
              { domain: "Regulatory & Compliance", count: 18, examples: ["Financial Services Compliance Breach", "AI Data Privacy Breach", "Third-Party Breach"] },
              { domain: "Supply Chain & Operations", count: 20, examples: ["Compound: Geopolitical + Supply Chain", "SLA Mass Breach", "Supplier Failure"] },
              { domain: "Market & Growth", count: 17, examples: ["Competitive Acquisition", "Market Entry Disruption", "Revenue Protection"] },
              { domain: "Technology & Cyber", count: 22, examples: ["Compound: Cyber + Regulatory", "Infrastructure Failure", "Zero-Day Response"] },
              { domain: "Talent & Organization", count: 16, examples: ["Executive Succession", "Mass Workforce Disruption", "Culture Crisis"] },
              { domain: "Financial & Investor", count: 19, examples: ["Activist Investor Response", "Credit Downgrade", "Liquidity Stress"] },
              { domain: "Geopolitical & Macro", count: 18, examples: ["Trade War Escalation", "Energy Disruption", "Pandemic Continuity"] },
            ].map(({ domain, count, examples }) => (
              <div key={domain} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 0, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: NAVY }}>{domain}</span>
                  <span style={{ fontSize: 12, fontWeight: 900, color: GOLD, background: `${GOLD}12`, padding: "2px 8px", borderRadius: 0 }}>{count}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
                  {examples.map(e => (
                    <span key={e} style={{ fontSize: 10, color: "#6B7280", background: "#F3F4F6", padding: "3px 8px", borderRadius: 0 }}>{e}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: NAVY, borderRadius: 0, padding: 24, display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: GOLD, marginBottom: 8 }}>Flagship Playbooks — Fully Enriched</div>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>23 playbooks contain the full expert treatment: detailed task owners, time targets, decision gates with escalation paths, and role-specific restrictions. These are the highest-priority scenarios your organization is most likely to face.</p>
            </div>
            <div style={{ flexShrink: 0, textAlign: "center" as const }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: GOLD, lineHeight: 1 }}>23</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "1px", marginTop: 4 }}>Flagship</div>
            </div>
          </div>
        </Section>

        {/* 06 — Feature Reference */}
        <Section id="features">
          <SectionHeader
            label="06 — Feature Reference"
            title="Complete Feature Reference"
            subtitle="A quick-reference guide to every major capability in the platform."
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
            <FeatureRow icon={Monitor} color={NAVY} title="Mission Control" path="/mission-control"
              description="Primary operational hub. Live signal feed, trigger detections, execution dividend counter, playbook status, and 12-minute clock tracking." />
            <FeatureRow icon={Radio} color={TEAL} title="Command Tower" path="/command-tower"
              description="Full-screen executive display with live WebSocket updates. Real-time trigger alerts, signal ticker, system pulse, and execution log. Ideal for war rooms and leadership reviews." />
            <FeatureRow icon={BookOpen} color={GOLD} title="Playbook Library" path="/playbooks"
              description="All 170 playbooks with search and domain filters. Authenticated users can deploy playbooks and use the Task Editor to customize phases and assignments." />
            <FeatureRow icon={Activity} color={TEAL} title="Simulation Studio" path="/simulation-studio"
              description="Strategic scenario modeling. Input any threat, select industry, and receive Survive vs. Thrive scores with recommended playbooks and recommended actions." />
            <FeatureRow icon={FileText} color={RED} title="Board Readiness Snapshot" path="/board-readiness"
              description="Print-ready board report with domain coverage ring, readiness score, Execution Dividend, and recent detections. Export as PDF in one click." />
            <FeatureRow icon={TrendingUp} color={TEAL} title="Readiness Dividend" path="/mission-control"
              description="Real-time ROI counter showing value preserved vs. a 30-day manual response baseline. Formula: trigger count × hours saved × $500/hr executive time." />
            <FeatureRow icon={Users} color={NAVY} title="Stakeholder Registry" path="/stakeholders"
              description="Contact directory for rapid mobilization. Role-matched notification routing ensures the right people are reached at trigger activation." />
            <FeatureRow icon={Target} color={GOLD} title="Trigger Configuration" path="/triggers"
              description="Configure which of the 221 triggers are active for your organization. Set sensitivity thresholds, evaluation modes, and notification recipients." />
            <FeatureRow icon={Globe} color={GREEN} title="Signal Activity Feed" path="/command-tower"
              description="Live log of every signal evaluation cycle: scanning status, partial matches, and confirmed detections. Full transparency into what the system is monitoring." />
            <FeatureRow icon={Layers} color={NAVY} title="IDEA Workspace" path="/workspace"
              description="Four-tab workspace (Identify, Detect, Execute, Advance) organizing your strategic configuration, active monitoring, execution coordination, and performance analytics." />
          </div>
        </Section>

        {/* 07 — Demos */}
        <Section id="demos">
          <SectionHeader
            label="07 — Demos & Simulations"
            title="Shareable Interactive Experiences"
            subtitle="These pages require no login. Share them with board members, stakeholders, or team members to demonstrate Readiness OS before they have platform access."
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { title: "12-Minute Test Drive", path: "/try-demo", desc: "Public 4-step simulation of a live trigger-to-execution cycle. No login required. Ideal as a first introduction." },
              { title: "Industry Demos (9)", path: "/demos", desc: "Sector-specific crisis simulations: Energy, Pharma, Finance, Retail, Luxury, Manufacturing, and more." },
              { title: "Role Experience", path: "/role-selector", desc: "CEO, CFO, CMO, CISO, COO and 7 other role-specific 13-stage simulations showing the exact experience for each executive." },
              { title: "Simulation Studio", path: "/simulation-studio", desc: "Open-ended scenario modeling. Any strategic threat, any industry. Survive vs. Thrive scoring with playbook recommendations." },
              { title: "IDEA Framework", path: "/idea-framework", desc: "Full walkthrough of the Identify → Detect → Execute → Advance framework with the NFL coaching analogy." },
              { title: "Investor Presentation", path: "/investor", desc: "Investor-grade deck with market thesis, McKinsey validation, competitive comparison, and ROI model." },
            ].map(({ title, path, desc }) => (
              <div key={title} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 0, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" as const }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: NAVY }}>{title}</span>
                  <span style={{ fontSize: 10, fontFamily: "monospace", color: "#9CA3AF", background: "#F3F4F6", padding: "2px 6px", borderRadius: 0 }}>{path}</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#4B5563", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 08 — First 30 Days */}
        <Section id="first-month">
          <SectionHeader
            label="08 — Pilot Roadmap"
            title="Recommended First 30 Days"
            subtitle="A suggested schedule for getting maximum value from your Readiness OS pilot."
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { period: "Day 1", color: NAVY, tasks: ["Complete platform walkthrough (this guide)", "Explore Mission Control and Command Tower", "Review 3 flagship playbooks relevant to your sector", "Share the 12-Minute Test Drive link with your leadership team"] },
              { period: "Days 2–7", color: TEAL, tasks: ["Configure trigger sensitivity for your top 3 risk domains", "Add your stakeholder contacts to the registry", "Run a Simulation Studio scenario on your highest-priority threat", "Monitor live signal feed daily (5 minutes each morning)"] },
              { period: "Days 8–14", color: GOLD, tasks: ["Review your first Board Readiness Snapshot", "Check Execution Dividend ROI counter", "Activate one playbook drill using Practice Drills", "Share role-specific demos with CISO, CFO, or COO"] },
              { period: "Days 15–30", color: TEAL, tasks: ["Review trigger detection history in Command Tower", "Export Board Readiness PDF for an upcoming committee meeting", "Customize playbook task assignments for your team structure", "Evaluate Execution Dividend vs. baseline for pilot ROI summary"] },
            ].map(({ period, color, tasks }) => (
              <div key={period} style={{ background: "#fff", border: "1px solid #E5E7EB", borderLeft: `4px solid ${color}`, borderRadius: 0, padding: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color, textTransform: "uppercase" as const, letterSpacing: "1.5px", marginBottom: 16 }}>{period}</div>
                {tasks.map((task, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 16, height: 16, borderRadius: 0, border: `1.5px solid ${color}50`, flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{task}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Section>

        {/* 09 — Quick Reference */}
        <Section id="reference">
          <SectionHeader label="09 — Quick Reference" title="Key URLs & Reference" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 0, padding: 24 }}>
              <h3 style={{ fontSize: 12, fontWeight: 800, color: NAVY, textTransform: "uppercase" as const, letterSpacing: "1px", margin: "0 0 16px" }}>Platform Pages</h3>
              {[
                ["Mission Control", "/mission-control"],
                ["Command Tower", "/command-tower"],
                ["Playbook Library", "/playbooks"],
                ["Simulation Studio", "/simulation-studio"],
                ["Board Readiness", "/board-readiness"],
                ["IDEA Workspace", "/workspace"],
                ["Practice Drills", "/practice-drills"],
                ["Request Access", "/request-access"],
              ].map(([label, path]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</span>
                  <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "monospace" }}>{path}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ background: NAVY, borderRadius: 0, padding: 24, marginBottom: 16 }}>
                <h3 style={{ fontSize: 12, fontWeight: 800, color: GOLD, textTransform: "uppercase" as const, letterSpacing: "1px", margin: "0 0 16px" }}>Pilot Contact</h3>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>VaughnMartin Pilot Team</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>pilot@vaughnmartin.com</div>
                <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>For platform questions, configuration support, or to schedule your executive walkthrough session.</p>
              </div>
              <div style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}30`, borderRadius: 0, padding: 24 }}>
                <h3 style={{ fontSize: 12, fontWeight: 800, color: NAVY, textTransform: "uppercase" as const, letterSpacing: "1px", margin: "0 0 14px" }}>Data Glossary</h3>
                {[
                  ["3,600×", "Execution head start vs. 30-day mobilization baseline"],
                  ["12 minutes", "Time from trigger detection to full team mobilization"],
                  ["72%+", "Minimum confidence score before an alert fires"],
                  ["4 hours", "Signal deduplication window (prevents repeat alerts)"],
                  ["248+", "Data points monitored across signal categories"],
                  ["221", "Configured trigger scenarios across 9 domains"],
                ].map(([term, def]) => (
                  <div key={term} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: NAVY, flexShrink: 0, minWidth: 64 }}>{term}</span>
                    <span style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.5 }}>{def}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: NAVY }}>VaughnMartin Readiness OS</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Executive Onboarding Guide · pilot@vaughnmartin.com</div>
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "right" as const }}>
            <div>vaughnmartin.com/onboarding-guide</div>
            <div style={{ marginTop: 2 }}>Confidential — Pilot Access Only</div>
          </div>
        </div>

      </div>

      <style>{`
        @media print {
          body { background: #fff !important; }
          .print\\:hidden { display: none !important; }
          @page { margin: 20mm; }
        }
      `}</style>
    </div>
  );
}
