import { useEffect, type CSSProperties } from "react";
import { updatePageMetadata } from "@/lib/seo";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";
const GEO: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BAR: CSSProperties = { fontFamily: "'Barlow Condensed', system-ui, sans-serif" };

const MS_INTEGRATIONS = [
  { name: "Microsoft Graph", role: "Organizational signal ingestion and entity data — people, groups, org structure", direction: "Pull" },
  { name: "Microsoft Teams", role: "Task assignments and stakeholder notifications pushed directly into existing channels", direction: "Push" },
  { name: "Outlook", role: "Executive authorization and status updates delivered via existing inbox — no new tool required", direction: "Push" },
  { name: "SharePoint", role: "Document staging and post-activation record storage — pre-staged documents ready at trigger", direction: "Both" },
  { name: "Microsoft Entra", role: "Identity and access governance — role-based authorization and audit trail", direction: "Pull" },
  { name: "Copilot Studio", role: "Protocol recommendation surface inside M365 — executives access Readiness OS within existing Microsoft environment", direction: "Both" },
];

const ADAPTER_INTEGRATIONS = [
  { name: "Salesforce", role: "CRM signal ingestion and account-level trigger context — customer exposure surfaced at activation", category: "CRM" },
  { name: "ServiceNow", role: "Task routing and workflow handoff — ITSM tickets created automatically at protocol activation", category: "ITSM" },
  { name: "Jira", role: "Execution task tracking and sprint staging — pre-populated boards with assigned owners ready in seconds", category: "Project" },
  { name: "Slack", role: "Stakeholder notification and real-time coordination channel — messages triggered automatically on activation", category: "Comms" },
  { name: "PagerDuty", role: "On-call escalation integration — critical trigger alerts routed through existing incident response chain", category: "Alerts" },
  { name: "Workday", role: "Workforce and org data — stakeholder roles, reporting lines, and contact information kept current", category: "HR" },
  { name: "SAP", role: "ERP signal ingestion — financial and operational data surfaced for budget and resource protocols", category: "ERP" },
  { name: "AWS / Azure", role: "Cloud infrastructure monitoring — system health signals and security alerts ingested as trigger inputs", category: "Cloud" },
];

const DIRECTION_COLORS: Record<string, string> = {
  Pull: "rgba(43,138,110,0.15)",
  Push: "rgba(201,168,76,0.15)",
  Both: "rgba(10,15,46,0.08)",
};
const DIRECTION_TEXT: Record<string, string> = {
  Pull: TEAL,
  Push: GOLD,
  Both: "rgba(10,15,46,0.5)",
};

export default function PlatformIntegrations() {
  useEffect(() => {
    updatePageMetadata({
      title: "Platform Integrations — VaughnMartin Readiness OS",
      description: "How Readiness OS integrates with the Microsoft stack and enterprise platforms. An orchestration layer above existing systems — not a replacement for any of them.",
    });
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ background: NAVY, padding: '80px 32px 72px', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ ...BAR, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>
            Technical Architecture
          </p>
          <h1 style={{ ...GEO, fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 600, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            Platform Integrations
          </h1>
          <p style={{ ...BAR, fontSize: 17, color: 'rgba(240,237,228,0.72)', lineHeight: 1.7, maxWidth: 640, margin: '0 auto 32px' }}>
            Readiness OS orchestrates across existing enterprise systems. We are the operating model layer above your Microsoft investment — not a replacement, not a competitor.
          </p>
          <div style={{ display: 'inline-block', background: 'rgba(201,168,76,0.12)', border: `1px solid rgba(201,168,76,0.3)`, padding: '10px 24px' }}>
            <span style={{ ...BAR, fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: '0.08em' }}>
              Every enterprise has Microsoft's AI stack · None have the operating model to use it
            </span>
          </div>
        </div>
      </div>

      {/* Positioning statement */}
      <div style={{ background: IVORY, padding: '48px 32px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
          {[
            { label: "We don't replace", value: "Microsoft · Salesforce · ServiceNow · Jira · Slack" },
            { label: "We orchestrate", value: "Signals in · Tasks out · Status synced · Records written" },
            { label: "The result", value: "Enterprises activate what they've already bought" },
          ].map(item => (
            <div key={item.label} style={{ background: '#fff', padding: '28px 24px', border: '1px solid rgba(10,15,46,0.07)' }}>
              <div style={{ ...BAR, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>{item.label}</div>
              <div style={{ ...GEO, fontSize: 17, fontWeight: 600, color: NAVY, lineHeight: 1.4 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Microsoft stack */}
      <div style={{ background: '#fff', padding: '72px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ ...BAR, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 8, textAlign: 'center' }}>
            Microsoft Ecosystem
          </p>
          <h2 style={{ ...GEO, fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, color: NAVY, textAlign: 'center', marginBottom: 12 }}>
            The operating model layer above your Microsoft investment
          </h2>
          <p style={{ ...BAR, fontSize: 15, color: 'rgba(10,15,46,0.55)', textAlign: 'center', marginBottom: 48, maxWidth: 580, margin: '0 auto 48px' }}>
            Every enterprise in your competitive landscape has already made the Microsoft bet. Readiness OS activates that investment by providing the execution layer it was missing.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {MS_INTEGRATIONS.map(int => (
              <div key={int.name} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 80px', gap: 24, alignItems: 'center', padding: '20px 24px', background: 'rgba(248,247,244,0.6)', border: '1px solid rgba(10,15,46,0.06)' }}>
                <div style={{ ...BAR, fontSize: 14, fontWeight: 700, color: NAVY }}>{int.name}</div>
                <div style={{ ...BAR, fontSize: 13, color: 'rgba(10,15,46,0.65)', lineHeight: 1.5 }}>{int.role}</div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    ...BAR, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    background: DIRECTION_COLORS[int.direction], color: DIRECTION_TEXT[int.direction],
                    padding: '4px 10px', display: 'inline-block',
                  }}>
                    {int.direction}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 20, justifyContent: 'flex-end', alignItems: 'center' }}>
            {[{ label: "Pull — ingests data from system", color: TEAL }, { label: "Push — sends to system", color: GOLD }, { label: "Both — bidirectional sync", color: 'rgba(10,15,46,0.4)' }].map(l => (
              <div key={l.label} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                <span style={{ ...BAR, fontSize: 11, color: 'rgba(10,15,46,0.45)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What the handoff looks like */}
      <div style={{ background: IVORY, padding: '72px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ ...BAR, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 8, textAlign: 'center' }}>
            What It Actually Looks Like
          </p>
          <h2 style={{ ...GEO, fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, color: NAVY, textAlign: 'center', marginBottom: 12 }}>
            When a Readiness Protocol fires
          </h2>
          <p style={{ ...BAR, fontSize: 14, color: 'rgba(10,15,46,0.5)', textAlign: 'center', marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
            Three simultaneous handoffs happen in the first 90 seconds. No manual routing. No coordination calls. Each surface receives exactly the information its audience needs to act.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>

            {/* Teams notification */}
            <div style={{ background: '#fff', border: '1px solid rgba(10,15,46,0.09)', borderTop: `3px solid #6264A7` }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(10,15,46,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, background: '#6264A7', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>T</span>
                </div>
                <div>
                  <div style={{ ...BAR, fontSize: 11, fontWeight: 700, color: NAVY, letterSpacing: '0.04em' }}>Microsoft Teams</div>
                  <div style={{ ...BAR, fontSize: 10, color: 'rgba(10,15,46,0.4)' }}>Stakeholder channel · 12 seconds after trigger</div>
                </div>
              </div>
              <div style={{ padding: '16px 18px' }}>
                <div style={{ background: 'rgba(98,100,167,0.06)', border: '1px solid rgba(98,100,167,0.15)', padding: '12px 14px', marginBottom: 10 }}>
                  <div style={{ ...BAR, fontSize: 10, fontWeight: 700, color: '#6264A7', letterSpacing: '0.1em', marginBottom: 6 }}>READINESS OS · PROTOCOL ACTIVATED</div>
                  <div style={{ ...BAR, fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Ransomware Response #31 — AUTHORIZED</div>
                  <div style={{ ...BAR, fontSize: 11, color: 'rgba(10,15,46,0.6)', lineHeight: 1.5 }}>Risk score: 94 · Budget unlocked: $2.4M · Your role: CISO → Network Isolation lead</div>
                </div>
                <div style={{ ...BAR, fontSize: 11, color: 'rgba(10,15,46,0.45)', lineHeight: 1.55 }}>
                  → 3 tasks assigned to your queue<br />
                  → Full brief in SharePoint<br />
                  → War room: #ransomware-response
                </div>
              </div>
            </div>

            {/* Outlook email */}
            <div style={{ background: '#fff', border: '1px solid rgba(10,15,46,0.09)', borderTop: `3px solid ${GOLD}` }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(10,15,46,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: NAVY, fontSize: 13, fontWeight: 700 }}>✉</span>
                </div>
                <div>
                  <div style={{ ...BAR, fontSize: 11, fontWeight: 700, color: NAVY, letterSpacing: '0.04em' }}>Outlook — CEO Inbox</div>
                  <div style={{ ...BAR, fontSize: 10, color: 'rgba(10,15,46,0.4)' }}>Executive authorization request · 14 seconds after trigger</div>
                </div>
              </div>
              <div style={{ padding: '16px 18px' }}>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ ...BAR, fontSize: 10, color: 'rgba(10,15,46,0.4)', marginBottom: 2 }}>From: Readiness OS · Priority: URGENT</div>
                  <div style={{ ...BAR, fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Authorization Required: Ransomware Response Protocol #31</div>
                  <div style={{ ...BAR, fontSize: 11, color: 'rgba(10,15,46,0.6)', lineHeight: 1.6, marginBottom: 10 }}>
                    23 servers encrypted · 3:12 AM detection · Protocol pre-staged · $2.4M budget awaiting sign-off. Full brief attached. Your decision unlocks 6 parallel response tracks.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ ...BAR, fontSize: 10, fontWeight: 700, padding: '6px 12px', background: NAVY, color: '#fff', letterSpacing: '0.06em' }}>AUTHORIZE</div>
                  <div style={{ ...BAR, fontSize: 10, fontWeight: 700, padding: '6px 12px', background: 'transparent', color: NAVY, border: `1px solid rgba(10,15,46,0.2)`, letterSpacing: '0.06em' }}>VIEW BRIEF</div>
                </div>
              </div>
            </div>

            {/* War room activation */}
            <div style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderTop: `3px solid ${TEAL}` }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>⚡</span>
                </div>
                <div>
                  <div style={{ ...BAR, fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>War Room Activated</div>
                  <div style={{ ...BAR, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Readiness OS platform · 3:21 AM · T+9 min</div>
                </div>
              </div>
              <div style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 7, marginBottom: 12 }}>
                  {[
                    { label: 'Network isolation', status: '✓ COMPLETE', color: TEAL },
                    { label: 'FBI Cyber Division', status: '✓ NOTIFIED', color: TEAL },
                    { label: 'Forensic image', status: '✓ CAPTURED', color: TEAL },
                    { label: 'Board briefing', status: '→ QUEUED', color: GOLD },
                    { label: 'Customer comms', status: '→ STAGED', color: GOLD },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ ...BAR, fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{item.label}</span>
                      <span style={{ ...BAR, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: item.color }}>{item.status}</span>
                    </div>
                  ))}
                </div>
                <div style={{ ...BAR, fontSize: 10, color: 'rgba(255,255,255,0.35)', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 10 }}>
                  Institutional memory recording · All decisions logged
                </div>
              </div>
            </div>

          </div>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <span style={{ ...BAR, fontSize: 11, color: 'rgba(10,15,46,0.4)' }}>All three surfaces receive their notification simultaneously — no sequential routing, no manual handoff</span>
          </div>
        </div>
      </div>

      {/* Adapter framework */}
      <div style={{ background: NAVY_BG, padding: '64px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ ...BAR, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: TEAL, marginBottom: 8, textAlign: 'center' }}>
            Adapter Framework
          </p>
          <h2 style={{ ...GEO, fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, color: '#fff', textAlign: 'center', marginBottom: 12 }}>
            Enterprise platform connectors
          </h2>
          <p style={{ ...BAR, fontSize: 15, color: 'rgba(240,237,228,0.55)', textAlign: 'center', marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
            The adapter framework connects to the platforms your teams already use — no migration required.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {ADAPTER_INTEGRATIONS.map(int => (
              <div key={int.name} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '22px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ ...BAR, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, background: 'rgba(201,168,76,0.12)', padding: '3px 8px', marginBottom: 8, display: 'inline-block' }}>{int.category}</div>
                  <div style={{ ...BAR, fontSize: 14, fontWeight: 700, color: '#fff' }}>{int.name}</div>
                </div>
                <div style={{ ...BAR, fontSize: 13, color: 'rgba(240,237,228,0.58)', lineHeight: 1.55 }}>{int.role}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ ...BAR, fontSize: 13, color: 'rgba(240,237,228,0.4)' }}>
              Additional platforms supported via webhook + REST API adapter layer
            </p>
          </div>
        </div>
      </div>

      {/* CIO conversation */}
      <div style={{ background: IVORY, padding: '64px 32px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div>
            <p style={{ ...BAR, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>Why the CIO Conversation Is Fast</p>
            <h2 style={{ ...GEO, fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 600, color: NAVY, marginBottom: 20, lineHeight: 1.2 }}>
              We're not asking anyone to rip anything out
            </h2>
            <p style={{ ...BAR, fontSize: 14, color: 'rgba(10,15,46,0.65)', lineHeight: 1.7, marginBottom: 24 }}>
              Enterprises have already spent on Microsoft, Salesforce, and ServiceNow. The integration path for Readiness OS is additive — we orchestrate what they've already bought. That means no migration risk, no platform consolidation project, and no rip-and-replace conversation with the board.
            </p>
            <p style={{ ...GEO, fontSize: 19, fontStyle: 'italic', color: NAVY, lineHeight: 1.5 }}>
              "We orchestrate across existing enterprise systems. We are the operating model layer above the Microsoft investment — not a replacement, an orchestrator."
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: "Migration risk", value: "None" },
              { label: "Platform replacement required", value: "None" },
              { label: "New tool training required", value: "Minimal — surfaces inside Teams / Outlook" },
              { label: "Implementation model", value: "Additive orchestration layer" },
              { label: "Microsoft compatibility", value: "Full M365 stack — Graph · Teams · Entra · Copilot" },
            ].map(item => (
              <div key={item.label} style={{ background: '#fff', border: '1px solid rgba(10,15,46,0.08)', padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'center' }}>
                <div style={{ ...BAR, fontSize: 12, color: 'rgba(10,15,46,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                <div style={{ ...BAR, fontSize: 13, fontWeight: 700, color: NAVY }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: NAVY, padding: '56px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ height: 1, background: 'rgba(201,168,76,0.25)', marginBottom: 36 }} />
          <h2 style={{ ...GEO, fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 600, color: '#fff', marginBottom: 12 }}>
            See the full technical architecture
          </h2>
          <p style={{ ...BAR, fontSize: 15, color: 'rgba(240,237,228,0.6)', marginBottom: 32 }}>
            The Data Fabric, Institutional Memory, and Integration layer — how they connect.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/technical-architecture" style={{ ...BAR, display: 'inline-block', background: 'transparent', color: GOLD, border: `1px solid rgba(201,168,76,0.5)`, fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 28px', textDecoration: 'none' }}>
              Full Technical Architecture →
            </a>
            <a href="/request-evaluation" style={{ ...BAR, display: 'inline-block', background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 28px', textDecoration: 'none' }}>
              Start 48-Hour Evaluation →
            </a>
            <a href="/request-access" style={{ ...BAR, display: 'inline-block', background: GOLD, color: NAVY, fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 28px', textDecoration: 'none' }}>
              Apply for Founding Partner Access
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
