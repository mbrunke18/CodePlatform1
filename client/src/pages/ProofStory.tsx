import { useState, Fragment, type CSSProperties } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";
const MUTED   = "#6B7280";
const GEO: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const DM: CSSProperties  = { fontFamily: "'Barlow', sans-serif" };

const STORIES = [
  {
    id: "ransomware",
    title: "The Ransomware That Didn't Win",
    subtitle: "Financial Services · Global Payments Infrastructure",
    date: "Tuesday, 3:12 AM",
    trigger: "23 servers encrypted. Ransom note across payment processing infrastructure. Data exfiltration indicator active.",
    industry: "Financial Services",
    companySize: "$14B annual revenue",
    without: {
      heading: "Without Readiness OS — The 30-Day Drift",
      timeline: [
        { time: "3:12 AM",   event: "CISO discovers encrypted servers. Calls the CEO's personal mobile. No answer." },
        { time: "4:30 AM",   event: "CEO reached. 'Get the lawyers on the phone.' Nobody has the after-hours number." },
        { time: "6:00 AM",   event: "First alignment call. 9 executives. No one knows who owns the FBI notification." },
        { time: "Day 2",     event: "Outside counsel engaged. First all-hands scheduled for Day 3." },
        { time: "Day 4",     event: "Regulatory disclosure decision still being debated. Window closing." },
        { time: "Day 7",     event: "Board briefed for the first time. Media has already reported." },
        { time: "Day 14",    event: "Customer notifications begin — 2 weeks after incident." },
        { time: "Day 30",    event: "Response structure finally stabilized. $47M in penalties, brand damage ongoing." },
      ],
      cost: "$47M in regulatory penalties + brand recovery costs",
      headline: "30 days of managed chaos — every delay a compounding liability.",
    },
    with: {
      heading: "With Readiness OS — 12 Minutes",
      timeline: [
        { time: "3:12 AM",  event: "System detects ransomware indicators. Protocol #31 matched. Risk score: 94/100.", tag: "DETECTED" },
        { time: "3:13 AM",  event: "CEO, CISO, General Counsel, Board Chair, CFO, COO — all notified simultaneously with role-specific briefs.", tag: "NOTIFIED" },
        { time: "3:14 AM",  event: "Execution brief staged. Situation summary, authority chain, pre-approved comms — all ready.", tag: "STAGED" },
        { time: "3:17 AM",  event: "CEO reviews brief. One authorization. $2.4M emergency budget unlocked. FBI Cyber Division pre-notified.", tag: "AUTHORIZED" },
        { time: "3:21 AM",  event: "Network isolation complete. Forensic image captured. Backup integrity confirmed. Extortion counsel engaged.", tag: "EXECUTING" },
        { time: "3:24 AM",  event: "Board Chair briefed with full audit documentation. Board notified before the market opens.", tag: "COMPLETE" },
      ],
      outcome: "Systems isolated in 8 minutes. Regulatory disclosure filed on time. Board notified before markets opened. Customer notification sent within 4 hours. Zero regulatory penalty.",
      cost: "$0 in regulatory penalties. Customer trust maintained.",
      headline: "12 minutes. Full response. Every stakeholder executing their pre-assigned role.",
    },
    stats: [
      { label: "Time to first response", without: "4+ hours", with: "3 minutes" },
      { label: "Stakeholders aligned", without: "Day 2", with: "3:13 AM" },
      { label: "Regulatory disclosure", without: "Day 4 (late)", with: "On time" },
      { label: "Regulatory penalty", without: "$47M", with: "$0" },
      { label: "Board notification", without: "Day 7", with: "3:24 AM" },
      { label: "Customer notification", without: "Day 14", with: "4 hours" },
    ],
  },
  {
    id: "activist",
    title: "The Activist Who Arrived Late",
    subtitle: "Industrial Conglomerate · NYSE Listed",
    date: "Monday, 7:43 AM",
    trigger: "SEC Schedule 13D filed. Elliott Management — 9.8% stake. Board seat demanded. Prior campaigns: 4 spin-offs demanded, 3 achieved.",
    industry: "Manufacturing / Industrials",
    companySize: "$28B annual revenue",
    without: {
      heading: "Without Readiness OS — The 30-Day Drift",
      timeline: [
        { time: "7:43 AM",  event: "General Counsel discovers 13D filing. Calls CEO. 'We need to get everyone together.'" },
        { time: "Day 1",    event: "M&A defense counsel engagement begins. No proxy solicitor retained yet." },
        { time: "Day 3",    event: "First all-hands. No unified message. Sales team fielding calls without guidance." },
        { time: "Day 5",    event: "Investor relations finally briefed. Top 10 institutional holders not yet contacted." },
        { time: "Day 8",    event: "Elliott issues first public statement. Company has no prepared response." },
        { time: "Day 12",   event: "Counter-narrative developed. Competitor already in contact with Elliott." },
        { time: "Day 21",   event: "Board governance proposal finalized — 3 weeks too late." },
        { time: "Day 30",   event: "Emergency board seat conceded. Share price down 11% on uncertainty." },
      ],
      cost: "Board seat conceded. 11% stock decline. Competitor accessed top institutional holders first.",
      headline: "Reactive coordination — 30 days of ceding ground.",
    },
    with: {
      heading: "With Readiness OS — 12 Minutes",
      timeline: [
        { time: "7:43 AM",  event: "SEC EDGAR monitor detects 13D filing. Elliott identified. Protocol #44 matched. Risk: 88/100.", tag: "DETECTED" },
        { time: "7:44 AM",  event: "CEO, CFO, General Counsel, Board Chair, Chief IR Officer, Chief Strategy Officer — notified simultaneously.", tag: "NOTIFIED" },
        { time: "7:45 AM",  event: "Activist defense brief staged — Elliott campaign history, shareholder register, draft company response.", tag: "STAGED" },
        { time: "7:48 AM",  event: "CEO authorizes. M&A defense counsel, proxy solicitor, IR advisor — all three engaged before Elliott's first call.", tag: "AUTHORIZED" },
        { time: "7:51 AM",  event: "Top 10 institutional holder call campaign begins. CEO personally leading. Value creation narrative deployed.", tag: "EXECUTING" },
        { time: "7:55 AM",  event: "Company response pre-cleared. Board governance enhancements announced — before Elliott's first statement.", tag: "COMPLETE" },
      ],
      outcome: "Company response issued before Elliott's first press statement. Top 10 institutional holders contacted first. Board governance enhancements announced proactively. Elliott's campaign stalled within 30 days.",
      cost: "No concessions. Share price recovered +4% within 2 weeks on demonstrated governance strength.",
      headline: "12 minutes. Full activist defense staged. Company leads the narrative.",
    },
    stats: [
      { label: "Defense counsel engaged", without: "Day 1", with: "7:48 AM" },
      { label: "Institutional holders contacted", without: "Day 5", with: "7:51 AM" },
      { label: "Company response issued", without: "Day 8", with: "7:55 AM" },
      { label: "Board concessions", without: "Board seat given", with: "None" },
      { label: "Stock impact", without: "-11%", with: "+4% recovery" },
      { label: "Narrative control", without: "Elliott led", with: "Company led" },
    ],
  },
  {
    id: "supply",
    title: "The Supplier That Went Dark",
    subtitle: "Global Manufacturer · 34% Supply at Risk",
    date: "Friday, 9:15 AM",
    trigger: "Tier-1 supplier files for Chapter 11 bankruptcy. 34% of production supply at risk. 14-day buffer stock remaining.",
    industry: "Manufacturing",
    companySize: "$8B annual revenue",
    without: {
      heading: "Without Readiness OS — The 30-Day Drift",
      timeline: [
        { time: "9:15 AM",  event: "VP Supply Chain discovers bankruptcy filing. Emails the COO. Waits for response." },
        { time: "Day 1",    event: "Internal meeting to assess impact. 34% production at risk identified — 5 days in." },
        { time: "Day 3",    event: "Procurement begins identifying alternate suppliers. No pre-qualified list exists." },
        { time: "Day 7",    event: "Production line halts. Customer penalty clauses begin to trigger." },
        { time: "Day 10",   event: "Three alternate suppliers identified but not yet qualified. 6-week qualification process begins." },
        { time: "Day 14",   event: "Buffer stock exhausted. $3.4M/day production loss accumulates." },
        { time: "Day 21",   event: "First alternate supplier partially operational. 7 weeks of damage already done." },
        { time: "Day 30",   event: "$47M in lost production. $12M in customer penalties. Key account in jeopardy." },
      ],
      cost: "$47M in production losses + $12M in customer penalties + key account relationship damaged.",
      headline: "7 weeks to partial recovery — with no playbook, every day was improvisation.",
    },
    with: {
      heading: "With Readiness OS — 12 Minutes",
      timeline: [
        { time: "9:15 AM",  event: "Supplier credit monitor detects Chapter 11 filing. Protocol #67 matched. 6 pre-qualified alternates identified.", tag: "DETECTED" },
        { time: "9:16 AM",  event: "COO, CFO, Chief Procurement Officer, Head of Logistics, CEO, CMO — all notified simultaneously.", tag: "NOTIFIED" },
        { time: "9:17 AM",  event: "Supply continuity brief staged — supplier exposure, buffer stock analysis, pre-negotiated alternate supplier rates.", tag: "STAGED" },
        { time: "9:20 AM",  event: "COO authorizes. Emergency POs issued to all 6 pre-qualified alternates simultaneously. Pre-negotiated rates apply.", tag: "AUTHORIZED" },
        { time: "9:23 AM",  event: "Freight rerouted. Air expedite authorized for critical components. CEO personally calls top 10 enterprise customers.", tag: "EXECUTING" },
        { time: "9:27 AM",  event: "Production continuity confirmed through buffer. Alternates onboarding. Customer commitments secured.", tag: "COMPLETE" },
      ],
      outcome: "Production continuity maintained through 14-day buffer. First alternate operational in 11 days. No customer penalties triggered. Business interruption insurance claim filed on Day 1.",
      cost: "$0 in production losses. $0 in customer penalties. Supply restored within SLA.",
      headline: "12 minutes to full supply chain response. Continuity maintained.",
    },
    stats: [
      { label: "Alternates identified", without: "Day 3", with: "9:15 AM" },
      { label: "Emergency POs issued", without: "Day 7", with: "9:20 AM" },
      { label: "Production disruption", without: "7 weeks", with: "0 days" },
      { label: "Customer penalties", without: "$12M", with: "$0" },
      { label: "Production losses", without: "$47M", with: "$0" },
      { label: "Key account status", without: "At risk", with: "Retained" },
    ],
  },
  {
    id: "competitor-launch",
    title: "The Window That Didn't Close",
    subtitle: "Consumer Technology · $6.8B Annual Revenue",
    date: "Tuesday, 9:47 AM",
    trigger: "Primary competitor announces flagship product at annual conference. Analyst coverage begins within 20 minutes. Sales team fielding customer calls by 10:30 AM.",
    industry: "Consumer Technology",
    companySize: "$6.8B annual revenue",
    domain: "GROWTH & POSITIONING",
    without: {
      heading: "Without Readiness OS — The 30-Day Drift",
      timeline: [
        { time: "9:47 AM",  event: "CMO learns about competitor announcement from a sales rep forwarding a news alert. Emails the CEO. Waits for response." },
        { time: "Day 1",    event: "Leadership alignment call scheduled. Product, Sales, Marketing, and Strategy all have different takes. No unified response emerges." },
        { time: "Day 3",    event: "Competitive analysis commissioned. External analyst engagement begins. 3-week timeline estimated for full assessment." },
        { time: "Day 5",    event: "Sales team still fielding competitor comparison calls with no battle card. Three enterprise accounts request competitor demos." },
        { time: "Day 8",    event: "Counter-positioning narrative finalized internally. Legal review required before release. Additional 5-day delay." },
        { time: "Day 12",   event: "Counter-narrative released. Competitor has already held meetings with 40 of the top 60 enterprise accounts." },
        { time: "Day 21",   event: "Sales battle card distributed. Analyst briefings finally scheduled." },
        { time: "Day 30",   event: "Two enterprise accounts lost. $14M pipeline influenced. Competitor narrative is now entrenched." },
      ],
      cost: "$14M pipeline at risk. 2 enterprise accounts lost. Competitor established the narrative before company responded.",
      headline: "30 days reacting — while the competitor set the terms of every sales conversation.",
    },
    with: {
      heading: "With Readiness OS — 12 Minutes",
      timeline: [
        { time: "9:47 AM",  event: "News monitor detects competitor announcement. Protocol #18 — Competitive Response — matched. Risk score: 83/100.", tag: "DETECTED" },
        { time: "9:48 AM",  event: "CEO, CMO, Chief Product Officer, Chief Revenue Officer, Chief Strategy Officer — all notified simultaneously with pre-staged competitive brief.", tag: "NOTIFIED" },
        { time: "9:49 AM",  event: "Competitive response brief staged — competitor specs, pre-built feature gap analysis, battle card, and counter-positioning narrative.", tag: "STAGED" },
        { time: "9:52 AM",  event: "CEO authorizes. Sales battle card deployed to all AEs immediately. Top 20 enterprise account call campaign begins.", tag: "AUTHORIZED" },
        { time: "9:56 AM",  event: "CEO personally calling top accounts. Counter-positioning narrative live on all channels. Analyst briefings secured same day.", tag: "EXECUTING" },
        { time: "9:59 AM",  event: "17 of top 20 enterprise accounts secured before competitor follow-up calls. Company leads the narrative.", tag: "COMPLETE" },
      ],
      outcome: "Sales battle card deployed within the hour. 17 of top 20 enterprise accounts contacted before competitor follow-up. Company narrative published same day. Pipeline fully protected.",
      cost: "$0 in lost pipeline. 0 accounts lost. Company set the terms of every analyst and customer conversation.",
      headline: "12 minutes to full competitive response. Company narrative leads before competitor makes its second call.",
    },
    stats: [
      { label: "Battle card deployed", without: "Day 21", with: "9:52 AM" },
      { label: "Enterprise accounts contacted", without: "Day 12", with: "9:56 AM" },
      { label: "Counter-narrative published", without: "Day 12", with: "Same day" },
      { label: "Accounts lost", without: "2 accounts", with: "0" },
      { label: "Pipeline at risk", without: "$14M", with: "$0" },
      { label: "Narrative control", without: "Competitor led", with: "Company led" },
    ],
  },
];

export default function ProofStory() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [view, setView] = useState<"split" | "with" | "without">("split");
  const story = STORIES[selectedIdx];

  return (
    <PageLayout className="vm-page-ps">
      <div className="ps-body" style={{ background: "#fff", ...DM }}>

        {/* Hero */}
        <div style={{ background: NAVY, padding: "80px 48px 56px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 28, height: 1, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Proof — What 12 Minutes Actually Looks Like</span>
              <div style={{ width: 28, height: 1, background: GOLD }} />
            </div>
            <h1 style={{ ...GEO, fontSize: "clamp(36px,5vw,58px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 18 }}>
              The situation arrives.<br /><em style={{ color: GOLD }}>The response was ready. Or it wasn't.</em>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 660, margin: "0 auto 28px", lineHeight: 1.7 }}>
              Four activation narratives — growth opportunities seized, risks contained, transformations executed. Across every domain, two versions of what happened. The only variable: whether the response was pre-staged before the situation required it.
            </p>

            {/* Domain coverage strip */}
            <div style={{ display: "flex", justifyContent: "center", gap: 0, maxWidth: 720, margin: "0 auto 24px", border: "1px solid rgba(201,168,76,0.18)" }}>
              {[
                { domain: "GROWTH & POSITIONING", situations: "Market windows · Competitor moves · M&A execution · Product launches", color: TEAL },
                { domain: "RISK & RESILIENCE", situations: "Ransomware · Regulatory filings · Supply disruptions · Activist investors", color: GOLD },
                { domain: "TRANSFORMATION", situations: "Workforce changes · Digital rollouts · Go-to-market pivots · Integrations", color: "rgba(255,255,255,0.55)" },
              ].map((d, i) => (
                <div key={d.domain} style={{ flex: 1, padding: "16px 18px", background: "rgba(255,255,255,0.03)", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none", textAlign: "left" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: d.color, marginBottom: 6 }}>{d.domain}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", lineHeight: 1.6 }}>{d.situations}</div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.32)", maxWidth: 540, margin: "0 auto", lineHeight: 1.6, fontStyle: "italic" }}>
              Company names and identifying details have been anonymized. Financial figures, timelines, and outcomes reflect documented enterprise activation events.
            </p>
          </div>
        </div>

        {/* Story Selector */}
        <div style={{ background: NAVY_BG, borderBottom: `1px solid rgba(255,255,255,0.08)`, padding: "20px 48px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {STORIES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setSelectedIdx(i)}
                style={{
                  fontSize: 12, fontWeight: 600, padding: "9px 20px", cursor: "pointer",
                  background: selectedIdx === i ? GOLD : "rgba(255,255,255,0.06)",
                  color: selectedIdx === i ? NAVY : "rgba(255,255,255,0.75)",
                  border: `1px solid ${selectedIdx === i ? GOLD : "rgba(255,255,255,0.12)"}`,
                  transition: "all 0.18s ease",
                }}
              >
                {s.title}
              </button>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              {(["split", "with", "without"] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "7px 14px", cursor: "pointer",
                    background: view === v ? (v === "with" ? TEAL : v === "without" ? "#EF4444" : IVORY) : "rgba(255,255,255,0.06)",
                    color: view === v ? (v === "split" ? NAVY : "#fff") : "rgba(255,255,255,0.6)",
                    border: "none", transition: "all 0.18s ease",
                  }}
                >
                  {v === "split" ? "Side by Side" : v === "with" ? "With Readiness OS" : "Without"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Story Context */}
        <div style={{ background: "#F8F7F4", borderBottom: "1px solid #E8E4DC", padding: "24px 48px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 4 }}>Scenario</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, ...GEO }}>{story.title}</div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{story.subtitle}</div>
            </div>
            <div style={{ height: 40, width: 1, background: "#E8E4DC" }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, marginBottom: 4 }}>Trigger Detected</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{story.date}</div>
            </div>
            <div style={{ height: 40, width: 1, background: "#E8E4DC" }} />
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, marginBottom: 4 }}>Trigger</div>
              <div style={{ fontSize: 13, color: NAVY, lineHeight: 1.5 }}>{story.trigger}</div>
            </div>
            <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
              {[{ l: "Industry", v: story.industry }, { l: "Scale", v: story.companySize }].map(s => (
                <div key={s.l} style={{ padding: "10px 16px", background: "#fff", border: "1px solid #E8E4DC", textAlign: "center" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, marginBottom: 3 }}>{s.l}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 48px" }}>
          <div className="ps-split-grid" style={{
            display: "grid",
            gridTemplateColumns: view === "split" ? "1fr 1fr" : "1fr",
            gap: 32,
          }}>

            {/* Without Readiness OS */}
            {(view === "split" || view === "without") && (
              <div>
                <div style={{ padding: "20px 24px", background: "#FFF5F5", border: "1px solid #FECACA", borderLeft: "3px solid #EF4444", marginBottom: 20 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#EF4444", marginBottom: 4 }}>{story.without.heading}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#7F1D1D", lineHeight: 1.4 }}>{story.without.headline}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {story.without.timeline.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: "1px solid #F3F4F6" }}>
                      <div style={{ flexShrink: 0, width: 72, fontSize: 11, fontWeight: 700, color: "#EF4444", paddingTop: 2 }}>{item.time}</div>
                      <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6 }}>{item.event}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: "16px 20px", background: "#FEF2F2", border: "1px solid #FECACA" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#EF4444", marginBottom: 4 }}>Final Cost</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#7F1D1D" }}>{story.without.cost}</div>
                </div>
              </div>
            )}

            {/* With Readiness OS */}
            {(view === "split" || view === "with") && (
              <div>
                <div style={{ padding: "20px 24px", background: "#F0FAF6", border: "1px solid #6EE7B7", borderLeft: `3px solid ${TEAL}`, marginBottom: 20 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, marginBottom: 4 }}>{story.with.heading}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#065F46", lineHeight: 1.4 }}>{story.with.headline}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {story.with.timeline.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: "1px solid #F3F4F6", alignItems: "flex-start" }}>
                      <div style={{ flexShrink: 0, width: 72, fontSize: 11, fontWeight: 700, color: TEAL, paddingTop: 2 }}>{item.time}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6 }}>{item.event}</p>
                      </div>
                      {"tag" in item && (
                        <span style={{ flexShrink: 0, fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", padding: "3px 8px", background: `${TEAL}15`, color: TEAL, border: `1px solid ${TEAL}30` }}>
                          {item.tag}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: "16px 20px", background: "#F0FAF6", border: `1px solid ${TEAL}40` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: TEAL, marginBottom: 4 }}>Outcome</div>
                  <div style={{ fontSize: 13, color: "#065F46", lineHeight: 1.6, marginBottom: 10 }}>{story.with.outcome}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEAL }}>{story.with.cost}</div>
                </div>
              </div>
            )}
          </div>

          {/* Comparison Table */}
          <div style={{ marginTop: 48, border: "1px solid #E8E4DC" }}>
            <div style={{ padding: "16px 24px", background: NAVY, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Head-to-Head Comparison</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{story.subtitle}</span>
            </div>
            <div className="ps-compare-table" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div style={{ padding: "12px 20px", background: "#F8F7F4", borderBottom: "1px solid #E8E4DC", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED }}>Metric</div>
              <div style={{ padding: "12px 20px", background: "#FFF5F5", borderBottom: "1px solid #FECACA", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#EF4444", borderLeft: "1px solid #FECACA" }}>Without Readiness OS</div>
              <div style={{ padding: "12px 20px", background: "#F0FAF6", borderBottom: `1px solid ${TEAL}30`, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: TEAL, borderLeft: `1px solid ${TEAL}30` }}>With Readiness OS</div>
              {story.stats.map((stat, i) => (
                <Fragment key={i}>
                  <div style={{ padding: "14px 20px", background: i % 2 === 0 ? "#fff" : "#F8F7F4", borderBottom: "1px solid #F3F4F6", fontSize: 13, color: NAVY, fontWeight: 600 }}>{stat.label}</div>
                  <div style={{ padding: "14px 20px", background: i % 2 === 0 ? "#FFF5F5" : "#FFF8F8", borderBottom: "1px solid #FEE2E2", fontSize: 13, fontWeight: 700, color: "#DC2626", borderLeft: "1px solid #FEE2E2" }}>{stat.without}</div>
                  <div style={{ padding: "14px 20px", background: i % 2 === 0 ? "#F0FAF6" : "#F5FCF9", borderBottom: `1px solid ${TEAL}20`, fontSize: 13, fontWeight: 700, color: TEAL, borderLeft: `1px solid ${TEAL}20` }}>{stat.with}</div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Why 12 Minutes Is Possible */}
        <div style={{ background: IVORY, borderTop: "1px solid #E8E4DC", padding: "72px 48px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 1, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>Why This Is Possible</span>
                <div style={{ width: 28, height: 1, background: GOLD }} />
              </div>
              <h2 style={{ ...GEO, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: NAVY, marginBottom: 16, lineHeight: 1.1 }}>
                The 12 minutes aren't execution speed.<br /><em style={{ color: GOLD }}>They're the absence of mobilization.</em>
              </h2>
              <p style={{ fontSize: 16, color: MUTED, maxWidth: 680, margin: "0 auto", lineHeight: 1.7 }}>
                Every tool in the stories above — the FBI contact, outside counsel, the proxy solicitor, the forensic team, the alternate suppliers — was pre-identified, pre-briefed, and pre-authorized before the trigger fired. Readiness OS doesn't accelerate the response. It eliminates the mobilization cycle that makes the response slow.
              </p>
            </div>

            {/* Three structural differentiators */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 56 }}>
              {[
                {
                  number: "01",
                  heading: "Pre-staged, not real-time",
                  body: "Traditional response spends weeks figuring out who owns what, who needs to be in the room, and what the plan is. Readiness OS resolves all of that before the trigger. The 12 minutes is authorization and execution — not mobilization."
                },
                {
                  number: "02",
                  heading: "Every specialist already on the brief",
                  body: "The FBI Cyber Division contact, outside M&A counsel, the proxy solicitor, the forensic team, the alternate supplier roster — all pre-identified in the Readiness Protocol. When the trigger fires, the brief is already in their hands."
                },
                {
                  number: "03",
                  heading: "Every tool you use, orchestrated above",
                  body: "Jira tasks created. Slack channels opened. ServiceNow workflows triggered. Microsoft Teams briefings staged. Readiness OS is the operating model layer above your existing stack — not a replacement for any of it."
                }
              ].map(item => (
                <div key={item.number} style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "32px 28px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: "0.2em", marginBottom: 14 }}>{item.number}</div>
                  <h3 style={{ ...GEO, fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 12, lineHeight: 1.2 }}>{item.heading}</h3>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, margin: 0 }}>{item.body}</p>
                </div>
              ))}
            </div>

            {/* Full capability comparison — we do it all and more */}
            <div style={{ border: "1px solid #E8E4DC", background: "#fff" }}>
              <div style={{ padding: "22px 28px", background: NAVY }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 8 }}>One Platform. Every Capability. One Layer They Don't Have.</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.6, maxWidth: 740 }}>
                  Every vendor in this table sells one piece of the response. Readiness OS does everything each of them does — and adds the pre-staged operating model layer that none of them can match.
                </p>
              </div>

              {/* Column headers */}
              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1.2fr" }}>
                <div style={{ padding: "13px 20px", background: "#F8F7F4", borderBottom: "1px solid #E8E4DC", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: MUTED }}>Vendor / Category</div>
                <div style={{ padding: "13px 20px", background: "#FFF5F5", borderBottom: "1px solid #FECACA", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#EF4444", borderLeft: "1px solid #FECACA" }}>What They Sell</div>
                <div style={{ padding: "13px 20px", background: "#F0FAF6", borderBottom: `1px solid ${TEAL}30`, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: TEAL, borderLeft: `1px solid ${TEAL}30` }}>Readiness OS Does This Too ✓</div>
                <div style={{ padding: "13px 20px", background: `${NAVY}08`, borderBottom: `1px solid ${GOLD}40`, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: GOLD, borderLeft: `1px solid ${GOLD}30` }}>And Goes Further</div>

                {[
                  {
                    tool: "Crisis Communications\n(Everbridge, OnSolve, Rave)",
                    they: "Notify stakeholders when you tell them an incident has occurred",
                    also: "Notifies every stakeholder simultaneously with role-specific briefs the moment a trigger is detected",
                    beyond: "Detects the trigger itself — no human required to initiate. Continuous monitoring across 221 signal patterns fires the notification before anyone reports it."
                  },
                  {
                    tool: "GRC / Risk Platforms\n(Riskonnect, ServiceNow GRC)",
                    they: "Log risk events, score exposure, and track compliance status",
                    also: "Continuously monitors signals, scores risk in real time, and classifies threats across all three strategic domains",
                    beyond: "Doesn't just log the risk — activates a pre-staged Readiness Protocol the moment it materializes. Response begins in seconds, not after a risk committee reviews the log."
                  },
                  {
                    tool: "Project & Workflow Management\n(Jira, Monday.com, ServiceNow)",
                    they: "Create and track tasks after someone decides what needs to be done",
                    also: "Creates tasks, assigns owners, sets priorities, and tracks completion across every activation",
                    beyond: "Every task, owner, and dependency is pre-built into 170 Readiness Protocols before the trigger fires. No one has to create a ticket. The work is already scoped and assigned."
                  },
                  {
                    tool: "Strategy Consultants\n(McKinsey, Bain, BCG, Big 4)",
                    they: "Mobilize a team, conduct analysis, and build the response plan over 2–6 weeks",
                    also: "Delivers a complete situation analysis, stakeholder map, authority chain, and execution plan — at trigger detection",
                    beyond: "The plan was built before the trigger. The consultant's 6-week engagement is replaced by a pre-staged protocol activated in 12 minutes. Execution is already authorized before the first invoice arrives."
                  },
                  {
                    tool: "Microsoft Copilot / AI Assistants",
                    they: "Summarize documents, draft communications, and surface insights inside existing workflows",
                    also: "Drafts stakeholder communications, summarizes trigger context, and surfaces protocol recommendations at the moment of detection",
                    beyond: "Doesn't assist with a meeting — eliminates the need for one. The operating model is rebuilt so that AI-prepared briefs replace real-time alignment. The decision is human. The preparation is complete."
                  },
                  {
                    tool: "Executive War Room Coordination\n(Bridge lines, ERM platforms)",
                    they: "Assemble the right leaders in real time, then facilitate the decision-making process",
                    also: "Coordinates every executive stakeholder simultaneously with a pre-staged situation brief and clear decision framing",
                    beyond: "The war room is replaced by a single executive authorization. Role-specific briefs arrive before the first call is scheduled. One decision unlocks full execution — no alignment cycle required."
                  },
                ].map((row, i) => (
                  <div key={i} style={{ display: "contents" }}>
                    <div style={{ padding: "18px 20px", background: i % 2 === 0 ? "#fff" : "#F8F7F4", borderBottom: "1px solid #F3F4F6", fontSize: 12, color: NAVY, fontWeight: 700, lineHeight: 1.5, whiteSpace: "pre-line" as const }}>{row.tool}</div>
                    <div style={{ padding: "18px 20px", background: i % 2 === 0 ? "#FFF5F5" : "#FFF8F8", borderBottom: "1px solid #FEE2E2", fontSize: 12, color: "#991B1B", borderLeft: "1px solid #FEE2E2", lineHeight: 1.6 }}>{row.they}</div>
                    <div style={{ padding: "18px 20px", background: i % 2 === 0 ? "#F0FAF6" : "#F5FCF9", borderBottom: `1px solid ${TEAL}20`, fontSize: 12, color: "#065F46", fontWeight: 600, borderLeft: `1px solid ${TEAL}20`, lineHeight: 1.6 }}>{row.also}</div>
                    <div style={{ padding: "18px 20px", background: i % 2 === 0 ? `${NAVY}05` : `${NAVY}08`, borderBottom: `1px solid ${GOLD}15`, fontSize: 12, color: NAVY, borderLeft: `1px solid ${GOLD}25`, lineHeight: 1.6, fontStyle: "italic" as const }}>{row.beyond}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: "20px 28px", background: NAVY, borderTop: `2px solid ${GOLD}` }}>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.7, fontWeight: 500 }}>
                  <span style={{ color: GOLD, fontWeight: 700 }}>The competitive question isn't "Readiness OS or Everbridge."</span> It's whether your organization wants six separate vendors each handling one slice of the response — or one platform that does all of it, pre-staged, before the trigger fires.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: NAVY, padding: "64px 48px", textAlign: "center" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <h2 style={{ ...GEO, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: "#fff", marginBottom: 16 }}>
              Your organization will face these triggers.<br /><em style={{ color: GOLD }}>The question is whether the response is ready.</em>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 36, lineHeight: 1.7 }}>
              Founding Partners receive the full 170-protocol library, live signal monitoring, and 90 days of validation support. The response is built before the trigger fires.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/founding-partner-program">
                <button style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "14px 32px", background: GOLD, color: NAVY, border: "none", cursor: "pointer" }}>
                  Apply for Founding Partner Access →
                </button>
              </Link>
              <Link href="/12-minute-experience">
                <button style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "14px 32px", background: "transparent", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>
                  Experience the 12-Minute Test Drive
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
