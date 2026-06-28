import { useParams, Link } from "wouter";
import { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";

const DM: React.CSSProperties = { fontFamily: "'DM Sans', 'Inter', sans-serif" };
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const CONTAINER: React.CSSProperties = { maxWidth: 1160, margin: "0 auto", padding: "0 40px" };

type SituationData = {
  id: string;
  domain: string;
  domainColor: string;
  protocolNumber: string;
  headline: string;
  subhead: string;
  moment: string;
  withoutSteps: { time: string; what: string; cost: string }[];
  withSteps: { time: string; what: string }[];
  tasks: string[];
  demoHref: string;
  demoLabel: string;
  metaTitle: string;
  metaDescription: string;
};

const SITUATIONS: Record<string, SituationData> = {
  "activist-investor": {
    id: "activist-investor",
    domain: "GROWTH & POSITIONING",
    domainColor: GOLD,
    protocolNumber: "#031",
    headline: "An activist investor just filed a 13D.",
    subhead: "Your board convenes in 48 hours. Your advisors are waiting for direction. Your communications team has no approved statement. Most organizations spend 30 days just deciding who's in charge.",
    moment: "When a Schedule 13D hits EDGAR, the clock starts. Activist investors file because they've already built their case — the thesis, the narrative, the board pressure points. They are prepared. The question is whether you are.",
    withoutSteps: [
      { time: "Hour 1–6",   what: "General counsel and CEO on phone — no response framework in place. Advisors being assembled from scratch.", cost: "Strategic window opening" },
      { time: "Day 1–3",    what: "Investment bank retained, IR firm identified, legal strategy debated in multiple calls. No unified position yet.", cost: "$340K+ in advisory fees begun" },
      { time: "Day 4–14",   what: "Board materials being drafted. Competing stakeholder opinions. Communications strategy still unresolved.", cost: "Activist narrative dominating the story" },
      { time: "Day 15–30",  what: "First coordinated response possible — if alignment reached. Activist has had 30 days to build shareholder support.", cost: "$3.2M in avoidable concessions" },
    ],
    withSteps: [
      { time: "Minute 1",   what: "SEC EDGAR signal detected — 13D/13G filing matched against monitored entities. Protocol #031 activated automatically." },
      { time: "Minute 3",   what: "Legal, IR, communications, and board liaison notified simultaneously. Response framework already staged — no assembly required." },
      { time: "Minute 8",   what: "Executive brief generated: activist thesis summary, board pressure analysis, stakeholder map, approved holding statement." },
      { time: "Minute 12",  what: "Executive authorization requested. 11 tasks pre-staged, owners assigned, budget parameters set. Coordinated response executing." },
    ],
    tasks: [
      "Notify General Counsel and CEO — activist filing confirmed",
      "Activate investor relations response framework",
      "Draft and stage board communication",
      "Engage external M&A counsel via pre-authorized retainer",
      "Prepare shareholder register analysis",
      "Stage approved holding statement for media",
      "Initiate activist thesis review (pre-built template)",
      "Schedule emergency board call — calendar blocks pre-staged",
      "Activate strategic communications firm via pre-staged engagement",
      "Begin board director outreach — contact list pre-populated",
      "Monitor EDGAR for follow-on filings — alert protocol active",
    ],
    demoHref: "/master-demo",
    demoLabel: "See Protocol #031 Execute — Full 7-Phase Walkthrough",
    metaTitle: "Activist Investor Response | VaughnMartin Readiness OS",
    metaDescription: "When an activist investor files a 13D, most organizations spend 30 days just mobilizing. Readiness OS pre-stages Protocol #031 — full response in 12 minutes, before they set the narrative.",
  },

  "ransomware": {
    id: "ransomware",
    domain: "RISK & RESILIENCE",
    domainColor: "#C0392B",
    protocolNumber: "#027",
    headline: "Ransomware detected across your environment.",
    subhead: "Every hour without a coordinated response compounds the exposure. Most organizations spend 72 hours assembling the right people before any coordinated action begins.",
    moment: "Ransomware events are not surprises to the attackers. The average dwell time before encryption is 21 days — meaning they've been in your environment while you operated normally. When encryption triggers, the attackers are prepared. The only variable is how quickly your organization can respond with authority.",
    withoutSteps: [
      { time: "Hour 1–4",   what: "IT team isolating systems. Executive team being called. No response framework — improvising containment.", cost: "$247K average hourly exposure" },
      { time: "Hour 4–24",  what: "Incident response firm being retained. Legal team notified. Cyber insurance carrier contacted. No unified command.", cost: "Regulatory clock started — 72-hour notification window" },
      { time: "Day 2–7",    what: "Forensics underway. Communications team drafting statements without legal clearance. Board not yet briefed with authority.", cost: "$4.1M average breach cost at this stage" },
      { time: "Day 7–30",   what: "Full response still improvised. Regulatory notifications delayed. Recovery timeline uncertain.", cost: "$47M+ regulatory exposure for late notification" },
    ],
    withSteps: [
      { time: "Minute 1",   what: "Endpoint detection signal matched against ransomware pattern library. Protocol #027 activated. Containment tasks pre-staged." },
      { time: "Minute 3",   what: "CISO, General Counsel, CEO, and Board Chair notified simultaneously. Cyber insurance carrier auto-notified via pre-staged template." },
      { time: "Minute 8",   what: "Regulatory notification framework staged — GDPR, HIPAA, SEC timelines pre-calculated. Legal holds initiated. Forensics firm pre-authorized." },
      { time: "Minute 12",  what: "Executive authorization received. Coordinated response executing — containment, communications, legal, and regulatory streams running in parallel." },
    ],
    tasks: [
      "Initiate network isolation — pre-authorized containment protocol",
      "Notify CISO and executive team — ransomware confirmed",
      "Activate cyber insurance carrier — pre-staged notification template",
      "Engage pre-authorized incident response firm",
      "Begin regulatory notification timeline calculation (GDPR 72h / HIPAA 60d / SEC 4d)",
      "Stage external communications holding statement",
      "Notify Board Chair — briefing materials pre-staged",
      "Initiate legal hold on all relevant systems and communications",
      "Activate backup recovery protocol — pre-staged runbook",
      "Begin threat actor attribution process via pre-authorized forensics",
      "Stage customer notification templates pending legal clearance",
    ],
    demoHref: "/demo/ransomware",
    demoLabel: "See Protocol #027 Execute — Ransomware Response Walkthrough",
    metaTitle: "Ransomware Response Protocol | VaughnMartin Readiness OS",
    metaDescription: "When ransomware hits, the response window is minutes, not days. Readiness OS Protocol #027 pre-stages full containment, legal, regulatory, and communications response — coordinated execution in 12 minutes.",
  },

  "regulatory-inquiry": {
    id: "regulatory-inquiry",
    domain: "RISK & RESILIENCE",
    domainColor: "#C0392B",
    protocolNumber: "#044",
    headline: "A regulatory inquiry letter arrived this morning.",
    subhead: "The agency has been building its case for months. Your organization has days to respond with a coordinated, legally defensible position. Most spend those days figuring out who's even in charge.",
    moment: "Regulatory inquiries — from the DOJ, SEC, FTC, CFPB, or state attorneys general — arrive after months of agency preparation. The letter is not the beginning of their process. It is the beginning of yours. How quickly you can present a unified, prepared response determines whether this stays an inquiry or becomes an enforcement action.",
    withoutSteps: [
      { time: "Day 1–3",   what: "General counsel reviewing letter alone. External counsel being selected — 3 firms being evaluated. No coordinated response yet.", cost: "Response deadline clock running" },
      { time: "Day 4–10",  what: "External counsel engaged. Document hold issued but not fully implemented. Business units being briefed individually.", cost: "$380K+ in initial legal fees" },
      { time: "Day 11–21", what: "Response strategy still being debated. Communications team not yet briefed. Board not yet informed in coordinated fashion.", cost: "Agency narrative advantage growing" },
      { time: "Day 22–30", what: "First unified response possible — if alignment reached. Agency has had 30 days to advance its position.", cost: "Enforcement risk elevated by delay" },
    ],
    withSteps: [
      { time: "Minute 1",   what: "Regulatory inquiry signal detected (or manually entered). Protocol #044 activated. Response framework staged." },
      { time: "Minute 3",   what: "General Counsel, CEO, Chief Compliance Officer, and pre-authorized external counsel notified simultaneously." },
      { time: "Minute 8",   what: "Legal hold initiated across all relevant systems. Document preservation protocol executing. Response deadline calculated and tracked." },
      { time: "Minute 12",  what: "Executive authorization received. Legal, compliance, communications, and board notification executing in parallel — unified from the first minute." },
    ],
    tasks: [
      "Notify General Counsel, CEO, and Chief Compliance Officer",
      "Engage pre-authorized external regulatory counsel",
      "Issue legal hold — pre-staged document preservation protocol",
      "Calculate response deadline — regulatory clock started",
      "Brief Board Chair with pre-staged inquiry summary template",
      "Initiate business unit data preservation across relevant functions",
      "Stage approved external communications holding statement",
      "Activate pre-configured inquiry response work stream",
      "Schedule internal coordination call — calendar pre-staged",
      "Begin privilege log framework — pre-built template",
      "Establish secure communications channel for inquiry team",
    ],
    demoHref: "/demo/doj-investigation",
    demoLabel: "See Protocol #044 Execute — Regulatory Inquiry Walkthrough",
    metaTitle: "Regulatory Inquiry Response | VaughnMartin Readiness OS",
    metaDescription: "When a regulatory inquiry arrives, speed and coordination determine outcome. Readiness OS Protocol #044 stages legal, compliance, and communications response in 12 minutes — before the agency sets the agenda.",
  },
};

const OTHER_SITUATIONS: Record<string, { label: string; href: string; domain: string; color: string }[]> = {
  "activist-investor": [
    { label: "Ransomware Attack",     href: "/situation/ransomware",          domain: "RISK & RESILIENCE",    color: "#C0392B" },
    { label: "Regulatory Inquiry",    href: "/situation/regulatory-inquiry",   domain: "RISK & RESILIENCE",    color: "#C0392B" },
  ],
  "ransomware": [
    { label: "Activist Investor",     href: "/situation/activist-investor",    domain: "GROWTH & POSITIONING", color: GOLD },
    { label: "Regulatory Inquiry",    href: "/situation/regulatory-inquiry",   domain: "RISK & RESILIENCE",    color: "#C0392B" },
  ],
  "regulatory-inquiry": [
    { label: "Activist Investor",     href: "/situation/activist-investor",    domain: "GROWTH & POSITIONING", color: GOLD },
    { label: "Ransomware Attack",     href: "/situation/ransomware",           domain: "RISK & RESILIENCE",    color: "#C0392B" },
  ],
};

export default function SituationPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const situation = SITUATIONS[id];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (situation) {
      updatePageMetadata({
        title: situation.metaTitle,
        description: situation.metaDescription,
      });
    }
  }, [id, situation]);

  if (!situation) {
    return (
      <PageLayout>
        <div style={{ ...CONTAINER, paddingTop: 120, paddingBottom: 120, textAlign: "center" as const }}>
          <h1 style={{ ...CG, fontSize: 36, color: NAVY, marginBottom: 16 }}>Situation not found</h1>
          <p style={{ ...DM, color: "#4B5563", marginBottom: 32 }}>We don't have a page for that situation yet.</p>
          <Link href="/demo-hub" style={{ ...DM, background: GOLD, color: NAVY, padding: "14px 32px", textDecoration: "none", fontWeight: 700, fontSize: 13, letterSpacing: "0.07em", textTransform: "uppercase" as const }}>
            Browse All Situations →
          </Link>
        </div>
      </PageLayout>
    );
  }

  const others = OTHER_SITUATIONS[id] ?? [];

  return (
    <PageLayout>
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <section style={{ background: NAVY, borderBottom: `3px solid ${situation.domainColor}`, padding: "80px 0 64px" }}>
        <div style={{ ...CONTAINER }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 28, height: 1.5, background: situation.domainColor }} />
            <span style={{ ...DM, fontSize: 10, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: situation.domainColor }}>
              {situation.domain} · Protocol {situation.protocolNumber}
            </span>
          </div>

          <h1 style={{ ...CG, fontSize: "clamp(36px,4vw,60px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 24px", maxWidth: 780 }}>
            {situation.headline}
          </h1>

          <p style={{ ...DM, fontSize: "clamp(15px,1.2vw,18px)", color: "rgba(255,255,255,0.72)", lineHeight: 1.7, maxWidth: 660, margin: "0 0 36px" }}>
            {situation.subhead}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const, alignItems: "center" }}>
            <Link
              href={situation.demoHref}
              style={{ ...DM, display: "inline-block", background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13, padding: "14px 28px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" as const }}
            >
              {situation.demoLabel} →
            </Link>
            <Link
              href="/request-access"
              style={{ ...DM, display: "inline-block", background: "transparent", color: "rgba(255,255,255,0.78)", fontWeight: 600, fontSize: 13, padding: "13px 22px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)", letterSpacing: "0.04em" }}
            >
              Apply for Founding Partner Access
            </Link>
          </div>
        </div>
      </section>

      {/* ── THE MOMENT ─────────────────────────────────────────────────────── */}
      <section style={{ background: IVORY, padding: "52px 0" }}>
        <div style={{ ...CONTAINER }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <div style={{ ...DM, fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 12 }}>The Reality</div>
              <p style={{ ...CG, fontSize: "clamp(18px,1.6vw,24px)", fontWeight: 600, color: NAVY, lineHeight: 1.5, margin: 0 }}>
                {situation.moment}
              </p>
            </div>
            <div style={{ padding: "28px 32px", background: NAVY, borderLeft: `3px solid ${situation.domainColor}` }}>
              <div style={{ ...DM, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>The Readiness Outcome</div>
              <div style={{ ...CG, fontSize: "clamp(28px,2.8vw,42px)", fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 8 }}>12 Minutes</div>
              <div style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 20 }}>
                From situation signal to full team executing — {situation.tasks.length} tasks pre-staged, all owners named, budget parameters set, executive authorization received.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                <span style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.55)" }}>Protocol {situation.protocolNumber} — pre-staged before this situation arrives</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ─────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "72px 0" }}>
        <div style={{ ...CONTAINER }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <div style={{ width: 28, height: 1.5, background: NAVY }} />
            <span style={{ ...DM, fontSize: 10, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: NAVY }}>Two Organizations. Same Situation. Different Outcomes.</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {/* Without */}
            <div>
              <div style={{ padding: "16px 24px", background: "#FEF2F2", borderBottom: "2px solid #C0392B" }}>
                <span style={{ ...DM, fontSize: 11, fontWeight: 800, color: "#C0392B", letterSpacing: "0.16em", textTransform: "uppercase" as const }}>Without Readiness OS</span>
              </div>
              {situation.withoutSteps.map((step, i) => (
                <div key={i} style={{ padding: "24px", borderBottom: "1px solid #F3F4F6", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                  <div style={{ ...DM, fontSize: 10, fontWeight: 800, color: "#C0392B", letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 8 }}>{step.time}</div>
                  <div style={{ ...DM, fontSize: 13, color: "#374151", lineHeight: 1.65, marginBottom: 10 }}>{step.what}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "#FEF2F2", border: "1px solid #FECACA" }}>
                    <span style={{ ...DM, fontSize: 10, fontWeight: 700, color: "#C0392B" }}>{step.cost}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* With */}
            <div>
              <div style={{ padding: "16px 24px", background: `${TEAL}15`, borderBottom: `2px solid ${TEAL}` }}>
                <span style={{ ...DM, fontSize: 11, fontWeight: 800, color: TEAL, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>With Readiness OS — Protocol {situation.protocolNumber}</span>
              </div>
              {situation.withSteps.map((step, i) => (
                <div key={i} style={{ padding: "24px", borderBottom: "1px solid #F3F4F6", background: i % 2 === 0 ? "#fff" : "#F8FFFE" }}>
                  <div style={{ ...DM, fontSize: 10, fontWeight: 800, color: TEAL, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 8 }}>{step.time}</div>
                  <div style={{ ...DM, fontSize: 13, color: "#374151", lineHeight: 1.65 }}>{step.what}</div>
                </div>
              ))}
              <div style={{ padding: "24px", background: `${TEAL}08`, border: `1px solid ${TEAL}30`, borderTop: `2px solid ${TEAL}` }}>
                <div style={{ ...DM, fontSize: 13, fontWeight: 700, color: TEAL }}>Full team coordinated and executing — 3,600× ahead of the unprepared response.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROTOCOL TASKS ─────────────────────────────────────────────────── */}
      <section style={{ background: NAVY, padding: "72px 0" }}>
        <div style={{ ...CONTAINER }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <div>
              <div style={{ ...DM, fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>Protocol {situation.protocolNumber} — Pre-Staged Tasks</div>
              <h2 style={{ ...CG, fontSize: "clamp(28px,2.5vw,40px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "0 0 20px" }}>
                {situation.tasks.length} tasks pre-staged.<br />
                <span style={{ color: GOLD }}>All owners named before the situation arrives.</span>
              </h2>
              <p style={{ ...DM, fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 32px" }}>
                Every task in this protocol is pre-assigned to a named owner, with budget parameters set and escalation paths defined — configured before the situation ever arrives. When the signal fires, there's nothing to decide. Only to authorize and execute.
              </p>
              <Link
                href={situation.demoHref}
                style={{ ...DM, display: "inline-block", background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13, padding: "14px 28px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" as const }}
              >
                See It Execute →
              </Link>
            </div>

            <div>
              {situation.tasks.map((task, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 0", borderBottom: i < situation.tasks.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, background: `${GOLD}20`, border: `1px solid ${GOLD}44`, flexShrink: 0, marginTop: 1 }}>
                    <span style={{ ...DM, fontSize: 9, fontWeight: 800, color: GOLD }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <span style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}>{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDING PARTNER CTA ───────────────────────────────────────────── */}
      <section style={{ background: IVORY, borderTop: `3px solid ${GOLD}`, padding: "64px 0" }}>
        <div style={{ ...CONTAINER }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 32 }}>
            <div style={{ maxWidth: 560 }}>
              <div style={{ ...DM, fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 12 }}>Ready to pre-stage your response?</div>
              <h2 style={{ ...CG, fontSize: "clamp(26px,2.4vw,38px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, margin: "0 0 16px" }}>
                The Founding Partner Program<br />pre-stages all 180 protocols — including this one.
              </h2>
              <p style={{ ...DM, fontSize: 14, color: "#4B5563", lineHeight: 1.7, margin: 0 }}>
                A 90-day validated partnership. VaughnMartin configures Readiness OS against your actual situation library — then operates it live. When the next situation arrives, your response is already waiting.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, flexShrink: 0 }}>
              <Link
                href="/request-access"
                style={{ ...DM, display: "inline-block", background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13, padding: "16px 36px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" as const, textAlign: "center" as const }}
              >
                Apply for Founding Partner Access →
              </Link>
              <Link
                href={situation.demoHref}
                style={{ ...DM, display: "inline-block", background: "transparent", color: NAVY, fontWeight: 600, fontSize: 13, padding: "13px 36px", textDecoration: "none", border: `1px solid ${NAVY}30`, textAlign: "center" as const }}
              >
                {situation.demoLabel} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── OTHER SITUATIONS ───────────────────────────────────────────────── */}
      {others.length > 0 && (
        <section style={{ background: "#fff", borderTop: "1px solid #E8E4DC", padding: "48px 0" }}>
          <div style={{ ...CONTAINER }}>
            <div style={{ ...DM, fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 20 }}>Other situations with pre-staged protocols</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
              {others.map((o) => (
                <Link
                  key={o.href}
                  href={o.href}
                  style={{ textDecoration: "none", padding: "16px 24px", border: "1px solid #E8E4DC", background: "#FAFAFA", display: "flex", flexDirection: "column" as const, gap: 6, minWidth: 200 }}
                >
                  <span style={{ ...DM, fontSize: 13, fontWeight: 700, color: NAVY }}>{o.label}</span>
                  <span style={{ ...DM, fontSize: 9, fontWeight: 700, color: o.color, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>{o.domain} →</span>
                </Link>
              ))}
              <Link
                href="/demo-hub"
                style={{ textDecoration: "none", padding: "16px 24px", border: `1px solid ${GOLD}44`, background: `${GOLD}06`, display: "flex", flexDirection: "column" as const, gap: 6, minWidth: 200 }}
              >
                <span style={{ ...DM, fontSize: 13, fontWeight: 700, color: NAVY }}>Browse All Situations</span>
                <span style={{ ...DM, fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>12 full simulations →</span>
              </Link>
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
