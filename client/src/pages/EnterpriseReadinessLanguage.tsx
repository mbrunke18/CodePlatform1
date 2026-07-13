import { useEffect } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";
const BORDER  = "#E8E4DC";
const MUTED   = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
const BAR: React.CSSProperties = { fontFamily: "'Barlow', sans-serif" };

const TERMS = [
  {
    term: "Strategic Situation",
    pronunciation: "Primary Entity",
    definition: "Any event, opportunity, disruption, or initiative that requires coordinated executive decision-making and cross-functional enterprise response.",
    extended: "Acquisitions, cyberattacks, activist investor filings, executive departures, regulatory investigations, go-to-market accelerations, leadership transitions — each is a Strategic Situation. Organizations face 15–20 per year. The defining characteristic is that a Strategic Situation cannot be resolved by a single function acting alone. It requires authority, coordination, sequencing, and governance across the enterprise. Most organizations encounter every one from scratch.",
    color: GOLD,
    primary: true,
  },
  {
    term: "Enterprise Readiness",
    pronunciation: "Company Category",
    definition: "The organizational capability to recognize a Strategic Situation, align the right people, and execute without first organizing yourself.",
    extended: "Readiness is not a meeting, a project, or a playbook. It is an operating capability that can be designed, measured, institutionalized, and continuously improved. Organizations have optimized execution for decades. Enterprise Readiness is the next generation of competitive advantage — the capability layer that determines whether execution is possible at all when the situation arrives.",
    color: TEAL,
    primary: false,
  },
  {
    term: "Readiness Protocol",
    pronunciation: "Primary Artifact",
    definition: "A pre-staged, owned response to a specific Strategic Situation — containing work packages, ownership, authority, budget authorization, dependencies, stakeholder sequencing, and governance documentation — completed before any trigger fires.",
    extended: "The Readiness Protocol is the unit of preparation in Readiness OS. There are 180 cross-industry Readiness Protocols in the core library, each containing all the preparation an organization needs to respond to that situation without improvising. Readiness Protocols replace the 30-day mobilization cycle that organizations currently run after a situation presents itself.",
    color: GOLD,
    primary: false,
  },
  {
    term: "Mobilization Tax",
    pronunciation: "Structural Cost",
    definition: "The hidden cost of organizing under pressure. Every organization pays it, twice — once to assemble the response, then again to execute. It has no line item on any budget.",
    extended: "The Mobilization Tax averages $1.7M per Strategic Situation — leadership attention diverted, outside counsel engaged cold at emergency rates, revenue at risk during the window, operational disruption, and decision delays that compound. Across 15 to 20 situations per year, the aggregate Mobilization Tax for a mid-market enterprise ranges from $25.5M to $34M annually — with no budget line, no owner, and no platform designed to eliminate it. Until now.",
    color: TEAL,
    primary: false,
  },
  {
    term: "Mobilization Window",
    pronunciation: "Competitive Concept",
    definition: "The period in which speed creates competitive advantage. Sometimes measured in hours. Sometimes days. Preparation determines who captures it.",
    extended: "Every Strategic Situation creates a Mobilization Window — the interval during which organized action produces disproportionate results. Organizations that have pre-staged their response enter the window already executing. Organizations that have not spend the window organizing themselves. The window does not stay open while you mobilize.",
    color: GOLD,
    primary: false,
  },
  {
    term: "Mobilization Gap",
    pronunciation: "Diagnostic Layer",
    definition: "One of 12 specific organizational failure points where enterprise response slows, stalls, or fails under pressure — from detection through to learning.",
    extended: "The 12 Mobilization Gaps are: Detection, Recognition, Authority, Team Assembly, Budget, External Resources, Sequencing, Systems, Communication, Compliance, Governance Record, and Learning. These are not theoretical. They are the documented points at which organizations lose the Mobilization Window, incur the Mobilization Tax, and fail to reach a state of Enterprise Readiness. Readiness OS closes all 12 before the trigger fires.",
    color: TEAL,
    primary: false,
  },
  {
    term: "Situation Intake",
    pronunciation: "Preparation Process",
    definition: "The preparation completed before a Strategic Situation occurs — ownership defined, authority established, dependencies mapped, budget authorized, risks documented, stakeholders sequenced, governance in place.",
    extended: "Situation Intake is to Strategic Situations what onboarding is to customers and due diligence is to acquisitions. It is the structured process of completing preparation before the event. Once Situation Intake is complete, the Readiness Protocol is ready. The organization is no longer vulnerable to the Mobilization Tax because the mobilization work is already done.",
    color: GOLD,
    primary: false,
  },
  {
    term: "Preparation Architecture",
    pronunciation: "Organizational Design",
    definition: "The organizational design that makes rapid mobilization possible — owned, maintained, and continuously improved through every activation before any trigger fires.",
    extended: "Preparation Architecture is the sum of an organization's Readiness Protocols, ownership structures, decision authorities, and institutional learning — the complete readiness capability layer. It is the answer to 'What exists before the situation arrives?' Building Preparation Architecture is the work of the PMO Director in Readiness OS, maintained with executive authorization and improved automatically after every activation.",
    color: TEAL,
    primary: false,
  },
];

const ARCHITECTURE = [
  {
    layer: "Company",
    subtitle: "The Category",
    center: "Enterprise Readiness",
    role: "The management discipline being created. Readiness is an organizational capability, not a tool — the same way \"Customer Relationship\" is a discipline, not just a CRM.",
    color: GOLD,
  },
  {
    layer: "Product",
    subtitle: "The Organizing Object",
    center: "Strategic Situations",
    role: "The primary record through which readiness is measured, prepared, activated, and improved. Everything in the platform is organized around situations — not tasks, not workflows.",
    color: TEAL,
  },
  {
    layer: "Technology",
    subtitle: "The Platform",
    center: "Readiness OS",
    role: "The operating infrastructure that makes Enterprise Readiness executable — 180 Readiness Protocols, 231 detection thresholds, 12-minute mobilization.",
    color: GOLD,
  },
];

export default function EnterpriseReadinessLanguage() {
  useEffect(() => {
    updatePageMetadata({
      title: "Enterprise Readiness Language — Canonical Glossary | VaughnMartin Readiness OS",
      description: "The canonical definitions of all owned terms in the Enterprise Readiness category: Strategic Situation, Mobilization Tax, Mobilization Window, Readiness Protocol, and more.",
      ogTitle: "The Language of Enterprise Readiness — VaughnMartin",
      ogDescription: "Categories are defined by vocabulary. These are the terms that define Enterprise Readiness — the management discipline for strategic mobilization.",
    });
  }, []);

  return (
    <PageLayout>

      {/* ── BACK ── */}
      <div style={{ background: NAVY, borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "10px 48px" }}>
        <button
          onClick={() => window.history.back()}
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 6, ...BC, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", padding: 0 }}
        >
          ← Back
        </button>
      </div>

      {/* ── HERO ── */}
      <section style={{ background: NAVY, padding: "72px 0 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.05) 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 40, height: 1, background: GOLD }} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase" as const, color: GOLD }}>VaughnMartin · Enterprise Readiness</span>
            <div style={{ width: 40, height: 1, background: GOLD }} />
          </div>
          <h1 style={{ ...CG, color: "#fff", fontSize: "clamp(36px,5.5vw,60px)", fontWeight: 600, lineHeight: 1.05, marginBottom: 20 }}>
            The Language of<br /><em style={{ color: GOLD }}>Enterprise Readiness</em>
          </h1>
          <p style={{ ...BAR, color: "rgba(240,237,228,0.65)", fontSize: 15, lineHeight: 1.75, maxWidth: 660, marginBottom: 28 }}>
            Categories are not defined by features. They are defined by vocabulary. When executives begin asking — "What is our readiness for this situation?" "Have we completed situation intake?" "What is our Mobilization Tax?" — the category exists. These are the canonical definitions.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" as const }}>
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.65)" }}>
              8 Owned Terms · 1 Primary Entity · 1 Category
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY VOCABULARY MATTERS ── */}
      <section style={{ background: IVORY, borderBottom: `1px solid ${BORDER}`, padding: "44px 48px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <p style={{ ...BC, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, marginBottom: 14 }}>Why Vocabulary Creates Categories</p>
          <p style={{ ...CG, color: NAVY, fontSize: 22, fontWeight: 600, lineHeight: 1.45, marginBottom: 16 }}>
            People adopt language before they buy products.
          </p>
          <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
            Before "Customer Relationship Management" was a software category, it was a management concept. Before "Enterprise Resource Planning" was a purchase decision, it was a way of thinking about organizational resources. The vocabulary preceded the market.
          </p>
          <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.8 }}>
            Enterprise Readiness follows the same pattern. The terms on this page are not marketing language. They are diagnostic tools — the vocabulary executives need to identify a problem they already have but have never named. When a CISO says "our Mobilization Window was 11 days," the diagnosis is complete. The conversation that follows is about the platform, not about whether the problem is real.
          </p>
        </div>
      </section>

      {/* ── PRIMARY ENTITY ── */}
      <section style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "64px 48px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 3, height: 40, background: GOLD, flexShrink: 0 }} />
            <div>
              <p style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, margin: 0 }}>Primary Entity</p>
              <p style={{ ...BC, color: MUTED, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" as const, margin: "2px 0 0" }}>The organizing object of the platform</p>
            </div>
          </div>

          <h2 style={{ ...CG, color: NAVY, fontSize: "clamp(32px,4vw,48px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 16 }}>
            Strategic Situation
          </h2>
          <p style={{ ...CG, color: NAVY, fontSize: 20, fontStyle: "italic", fontWeight: 500, lineHeight: 1.5, borderLeft: `3px solid ${GOLD}`, paddingLeft: 20, marginBottom: 24 }}>
            "Any event, opportunity, disruption, or initiative that requires coordinated executive decision-making and cross-functional enterprise response."
          </p>
          <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
            Acquisitions. Cyberattacks. Activist investor filings. Executive departures. Regulatory investigations. Go-to-market accelerations. Leadership transitions. Each is a Strategic Situation. The defining characteristic is that none can be resolved by a single function acting alone — each requires authority, coordination, sequencing, and governance across the enterprise.
          </p>
          <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
            Most organizations face 15 to 20 Strategic Situations every year. Most encounter each one from scratch — assembling the team, defining ownership, establishing authority, mapping dependencies, and identifying risks under pressure while the response window closes. That is the problem Enterprise Readiness solves.
          </p>

          <div style={{ background: NAVY, padding: "24px 28px", borderLeft: `3px solid ${GOLD}` }}>
            <div style={{ ...BC, color: GOLD, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, marginBottom: 10 }}>Why This Is the Primary Object</div>
            <p style={{ ...CG, color: "#E8E4DC", fontSize: 16, fontWeight: 500, lineHeight: 1.6, margin: "0 0 12px" }}>
              Systems of record are organized around entities, not attributes. CRM organizes around Customers. ERP organizes around Resources. HRIS organizes around Employees. Readiness OS organizes around Strategic Situations — with readiness score, Readiness Protocol, activation history, decisions, and lessons all as properties of that object.
            </p>
            <p style={{ ...CG, color: "rgba(201,168,76,0.8)", fontSize: 15, fontStyle: "italic", fontWeight: 400, lineHeight: 1.6, margin: 0 }}>
              Readiness OS is the first enterprise system of record for Strategic Situations.
            </p>
          </div>
        </div>
      </section>

      {/* ── FULL LEXICON ── */}
      <section style={{ background: IVORY, borderBottom: `1px solid ${BORDER}`, padding: "72px 48px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <p style={{ ...BC, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, marginBottom: 8 }}>The Full Lexicon</p>
          <p style={{ ...CG, color: NAVY, fontSize: 20, fontWeight: 600, lineHeight: 1.4, marginBottom: 8 }}>
            Eight terms. One category.
          </p>
          <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7, maxWidth: 620, marginBottom: 40 }}>
            Each term addresses a specific gap in how organizations currently think about strategic mobilization. Together they constitute the vocabulary of Enterprise Readiness.
          </p>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: "1px", background: BORDER }}>
            {TERMS.filter(t => !t.primary).map((item) => (
              <div key={item.term} style={{ background: "#fff", padding: "32px 36px", display: "grid", gridTemplateColumns: "280px 1fr", gap: 40, alignItems: "start" }}>
                <div>
                  <div style={{ ...BC, color: item.color, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, marginBottom: 6 }}>
                    {item.pronunciation}
                  </div>
                  <h3 style={{ ...CG, color: NAVY, fontSize: "clamp(20px,2.2vw,26px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 0" }}>
                    {item.term}
                  </h3>
                </div>
                <div>
                  <p style={{ ...CG, color: NAVY, fontSize: 17, fontStyle: "italic", fontWeight: 500, lineHeight: 1.55, marginBottom: 14, borderLeft: `2px solid ${item.color}`, paddingLeft: 16 }}>
                    {item.definition}
                  </p>
                  <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                    {item.extended}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE-ARCHITECTURE BLOCK ── */}
      <section style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "72px 48px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <p style={{ ...BC, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, marginBottom: 8 }}>How the Vocabulary Maps to the Company</p>
          <p style={{ ...CG, color: NAVY, fontSize: 20, fontWeight: 600, lineHeight: 1.4, marginBottom: 8 }}>
            Three architectures. Three distinct terms. One coherent model.
          </p>
          <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7, maxWidth: 640, marginBottom: 40 }}>
            The most common confusion in explaining Readiness OS is conflating the company, the product, and the platform. These are distinct and should be described differently in every context.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: BORDER }}>
            {ARCHITECTURE.map((arch, i) => (
              <div key={arch.layer} style={{ background: "#fff", padding: "32px 28px", position: "relative" as const }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: arch.color }} />
                <div style={{ ...BC, color: arch.color, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, marginBottom: 4 }}>
                  {arch.layer}
                </div>
                <div style={{ ...BC, color: MUTED, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 20 }}>
                  {arch.subtitle}
                </div>
                <h3 style={{ ...CG, color: NAVY, fontSize: "clamp(18px,2vw,24px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 16 }}>
                  {arch.center}
                </h3>
                <p style={{ color: "#374151", fontSize: 13.5, lineHeight: 1.75, margin: 0 }}>
                  {arch.role}
                </p>
                {i < ARCHITECTURE.length - 1 && (
                  <div style={{ position: "absolute", right: -14, top: "50%", transform: "translateY(-50%)", ...BC, fontSize: 18, color: "rgba(201,168,76,0.3)", zIndex: 1 }}>→</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, background: NAVY, padding: "24px 28px", borderLeft: `3px solid ${TEAL}` }}>
            <p style={{ ...CG, color: "#E8E4DC", fontSize: 16, fontWeight: 500, lineHeight: 1.65, margin: 0 }}>
              Enterprise Readiness is the category. Strategic Situations are what the product organizes around. Readiness OS is the platform that makes it executable. These three terms should never be used interchangeably — each carries distinct meaning in every conversation with executives, investors, and partners.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW TERMS ARE USED ── */}
      <section style={{ background: IVORY, borderBottom: `1px solid ${BORDER}`, padding: "64px 48px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...BC, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, marginBottom: 8 }}>Language in Practice</p>
          <p style={{ ...CG, color: NAVY, fontSize: 20, fontWeight: 600, lineHeight: 1.4, marginBottom: 32 }}>
            How these terms enter executive conversations.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
            {[
              {
                context: "Board Meeting",
                quote: "Our readiness score for the ERP replacement fell 11 points this quarter. We've identified three Mobilization Gaps we haven't closed.",
                note: "Readiness Score + Mobilization Gap as board-level diagnostic language",
              },
              {
                context: "Investor Conversation",
                quote: "Every enterprise faces 15 to 20 Strategic Situations per year. Each one carries a Mobilization Tax. We eliminate the tax and compress the Mobilization Window from 30 days to 12 minutes.",
                note: "Strategic Situation + Mobilization Tax + Mobilization Window as investor framing",
              },
              {
                context: "CISO Briefing",
                quote: "Situation Intake for the ransomware scenario is complete — ownership, authority, and FBI coordination are pre-staged. The Readiness Protocol activates in 12 minutes from detection.",
                note: "Situation Intake + Readiness Protocol as operational precision language",
              },
              {
                context: "PMO Kickoff",
                quote: "Our Preparation Architecture covers 87% of the situations we've historically encountered. The remaining 13% go through Protocol Builder.",
                note: "Preparation Architecture as the PMO Director's primary ownership frame",
              },
            ].map(item => (
              <div key={item.context} style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "24px 24px 20px" }}>
                <div style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: 12 }}>{item.context}</div>
                <p style={{ ...CG, color: NAVY, fontSize: 15, fontStyle: "italic", fontWeight: 500, lineHeight: 1.6, marginBottom: 12 }}>
                  "{item.quote}"
                </p>
                <p style={{ ...BC, color: MUTED, fontSize: 10, letterSpacing: "0.08em", lineHeight: 1.5, margin: 0 }}>{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED ── */}
      <section style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "48px 48px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...BC, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, marginBottom: 20 }}>Related Resources</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {[
              { label: "The Readiness Manifesto", desc: "Four Laws of Readiness — the philosophical and operational foundation for this vocabulary.", href: "/readiness-manifesto", cta: "Read the Manifesto" },
              { label: "The 12 Mobilization Gaps", desc: "Detailed breakdown of each of the 12 gaps — where every enterprise response slows, stalls, or fails.", href: "/the-gap", cta: "See the 12 Gaps" },
              { label: "Mobilization Tax Calculator", desc: "Model your organization's annual Mobilization Tax based on situation frequency and mobilization time.", href: "/roi-calculator", cta: "Calculate the Tax" },
              { label: "Founding Partner Program", desc: "The 90-day validation partnership — applying this vocabulary to your specific situation portfolio.", href: "/founding-partner", cta: "Apply for Access" },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none", display: "block", border: `1px solid ${BORDER}`, padding: "22px 22px 18px", background: IVORY, transition: "border-color 0.15s" }}>
                <div style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: 8 }}>{item.label}</div>
                <p style={{ color: "#374151", fontSize: 13.5, lineHeight: 1.7, marginBottom: 14 }}>{item.desc}</p>
                <div style={{ ...BC, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>{item.cta} →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ background: "#0F1629", padding: "64px 0", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 48px", textAlign: "center" }}>
          <div style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, marginBottom: 16 }}>The Category Starts Here</div>
          <h2 style={{ ...CG, color: "#fff", fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 20 }}>
            The vocabulary only matters<br />if the platform exists.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 36px" }}>
            Every term on this page has a corresponding capability in Readiness OS — 180 Readiness Protocols, 12 Mobilization Gaps closed, Situation Intake complete, Preparation Architecture operational, and the Mobilization Window compressed from 30 days to 12 minutes.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" as const }}>
            <Link href="/request-access" style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, textDecoration: "none", background: GOLD, color: NAVY, padding: "13px 28px", display: "inline-block" }}>
              Apply for Founding Partner Access →
            </Link>
            <Link href="/how-it-executes" style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, textDecoration: "none", border: "1px solid rgba(201,168,76,0.4)", color: GOLD, padding: "13px 28px", display: "inline-block" }}>
              See It Execute →
            </Link>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
