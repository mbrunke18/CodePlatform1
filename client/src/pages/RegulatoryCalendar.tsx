import { useState } from "react";
import { Calendar, Clock, AlertTriangle, CheckCircle2, ChevronRight, Shield, BookOpen, Filter } from "lucide-react";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG = { fontFamily: "'Cormorant Garamond', serif" };

interface RegulatoryEvent {
  id: string;
  title: string;
  category: string;
  deadline: Date;
  daysUntil: number;
  urgency: "critical" | "high" | "medium" | "upcoming";
  description: string;
  applicableSectors: string[];
  relatedPlaybooks: string[];
  action: string;
  regulatoryBody: string;
}

const today = new Date();
function daysFromNow(days: number): Date {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d;
}
function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const EVENTS: RegulatoryEvent[] = [
  {
    id: "sec-8k",
    title: "SEC Form 8-K Cyber Incident Disclosure",
    category: "Securities",
    deadline: daysFromNow(4),
    daysUntil: 4,
    urgency: "critical",
    description: "SEC requires disclosure of material cybersecurity incidents within 4 business days of determining materiality. Failure to file triggers enforcement action.",
    applicableSectors: ["All Public Companies"],
    relatedPlaybooks: ["Cybersecurity Incident Response", "SEC Disclosure Filing", "Crisis Communications"],
    action: "Activate Cybersecurity Incident Response prepared response to pre-stage disclosure workflow.",
    regulatoryBody: "U.S. Securities and Exchange Commission",
  },
  {
    id: "gdpr-breach",
    title: "GDPR Breach Notification — 72-Hour Window",
    category: "Data Privacy",
    deadline: daysFromNow(3),
    daysUntil: 3,
    urgency: "critical",
    description: "GDPR Article 33 requires notification to supervisory authority within 72 hours of becoming aware of a personal data breach. Non-compliance carries fines up to €10M or 2% of global annual turnover.",
    applicableSectors: ["All EU-Facing Operations"],
    relatedPlaybooks: ["GDPR Breach Protocol", "Data Breach Notification", "Regulatory Communications"],
    action: "Activate GDPR Breach Protocol prepared response immediately upon discovery.",
    regulatoryBody: "EU Data Protection Authorities",
  },
  {
    id: "earnings-blackout",
    title: "Q2 Earnings Blackout Period",
    category: "Securities",
    deadline: daysFromNow(18),
    daysUntil: 18,
    urgency: "high",
    description: "Insider trading blackout windows restrict executive trading activity in the 30 days preceding earnings announcements. All material non-public communications require heightened controls.",
    applicableSectors: ["Public Companies", "Financial Services"],
    relatedPlaybooks: ["Earnings Communication Protocol", "Executive Communication Restrictions", "Investor Relations Response"],
    action: "Pre-stage Earnings Communication Protocol and notify all executives of trading window closure.",
    regulatoryBody: "SEC / Internal Compliance",
  },
  {
    id: "sox-quarterly",
    title: "SOX Section 302 — CEO/CFO Quarterly Certification",
    category: "Financial Controls",
    deadline: daysFromNow(22),
    daysUntil: 22,
    urgency: "high",
    description: "Sarbanes-Oxley requires CEO and CFO to certify accuracy of quarterly financial reports. Any material weaknesses in internal controls must be disclosed. Certification is due within 40 days of quarter close.",
    applicableSectors: ["Public Companies"],
    relatedPlaybooks: ["Financial Controls Assessment", "SOX Compliance Response", "Executive Certification Protocol"],
    action: "Run Financial Controls Assessment prepared response to surface any material weakness before certification window.",
    regulatoryBody: "U.S. Securities and Exchange Commission",
  },
  {
    id: "ftc-merger",
    title: "FTC Hart-Scott-Rodino Pre-Merger Notification",
    category: "M&A Compliance",
    deadline: daysFromNow(30),
    daysUntil: 30,
    urgency: "medium",
    description: "HSR Act requires pre-merger notification filing for transactions above $119.5M threshold. Waiting period is 30 days (15 for cash acquisitions). Early termination requests available.",
    applicableSectors: ["M&A Active Organizations"],
    relatedPlaybooks: ["M&A Regulatory Filing Protocol", "Merger Integration Prepared response", "Antitrust Response"],
    action: "Activate M&A Regulatory Filing Protocol to coordinate HSR preparation and legal team staging.",
    regulatoryBody: "Federal Trade Commission / DOJ",
  },
  {
    id: "osha-incident",
    title: "OSHA Severe Injury / Fatality Reporting",
    category: "Workplace Safety",
    deadline: daysFromNow(1),
    daysUntil: 1,
    urgency: "critical",
    description: "OSHA requires employers to report workplace fatalities within 8 hours and any in-patient hospitalization, amputation, or eye loss within 24 hours of the employer learning of the incident.",
    applicableSectors: ["Manufacturing", "Energy", "Construction", "Healthcare"],
    relatedPlaybooks: ["Workplace Safety Incident Response", "OSHA Regulatory Notification", "Crisis Communications"],
    action: "Activate Workplace Safety Incident Response immediately — 8-hour reporting window is active.",
    regulatoryBody: "Occupational Safety and Health Administration",
  },
  {
    id: "fda-recall",
    title: "FDA Mandatory Recall — Class I Notification",
    category: "Product Safety",
    deadline: daysFromNow(7),
    daysUntil: 7,
    urgency: "high",
    description: "FDA Class I recalls involve products with reasonable probability of causing serious health consequences. Public notification, press releases, and retailer/consumer recall letters required within 5–10 days of FDA recall initiation.",
    applicableSectors: ["Healthcare", "Pharmaceutical", "Food & Beverage", "Medical Devices"],
    relatedPlaybooks: ["Product Recall Response", "FDA Regulatory Communications", "Supply Chain Disruption Response"],
    action: "Pre-stage Product Recall Response prepared response — all stakeholder assignments pre-loaded.",
    regulatoryBody: "U.S. Food and Drug Administration",
  },
  {
    id: "dol-eeo",
    title: "EEO-1 Component 1 Annual Reporting",
    category: "Employment",
    deadline: daysFromNow(45),
    daysUntil: 45,
    urgency: "upcoming",
    description: "Employers with 100+ employees must submit EEO-1 workforce composition data by the annual EEOC deadline. Data covers race/ethnicity and sex by job category. Non-filers risk EEOC audit.",
    applicableSectors: ["All Employers 100+ Employees"],
    relatedPlaybooks: ["HR Compliance Reporting", "Workforce Data Collection Protocol"],
    action: "Activate HR Compliance Reporting prepared response to coordinate data collection across business units.",
    regulatoryBody: "Equal Employment Opportunity Commission",
  },
  {
    id: "ccpa-audit",
    title: "CCPA Annual Privacy Practice Audit",
    category: "Data Privacy",
    deadline: daysFromNow(60),
    daysUntil: 60,
    urgency: "upcoming",
    description: "California Consumer Privacy Act requires businesses to review and update privacy notices, data mapping, and consumer rights fulfillment processes annually. Non-compliance fines up to $7,500 per intentional violation.",
    applicableSectors: ["California Operations", "Consumer-Facing Businesses"],
    relatedPlaybooks: ["Privacy Compliance Audit", "Data Governance Protocol", "Consumer Rights Response"],
    action: "Schedule Privacy Compliance Audit prepared response — coordinate legal, IT, and operations teams.",
    regulatoryBody: "California Privacy Protection Agency",
  },
];

const URGENCY_CONFIG = {
  critical: { label: "Critical", color: "#DC2626", bg: "rgba(220,38,38,0.06)", border: "#DC2626", dot: "#DC2626" },
  high:     { label: "High",     color: "#F59E0B", bg: "rgba(245,158,11,0.06)", border: "#F59E0B", dot: "#F59E0B" },
  medium:   { label: "Medium",   color: GOLD,      bg: "rgba(201,168,76,0.06)", border: GOLD,      dot: GOLD },
  upcoming: { label: "Upcoming", color: TEAL,      bg: "rgba(43,138,110,0.06)", border: TEAL,      dot: TEAL },
};

const CATEGORIES = ["All", "Securities", "Data Privacy", "Financial Controls", "M&A Compliance", "Workplace Safety", "Product Safety", "Employment"];

export default function RegulatoryCalendar() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeUrgency, setActiveUrgency] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = EVENTS.filter(e => {
    if (activeCategory !== "All" && e.category !== activeCategory) return false;
    if (activeUrgency && e.urgency !== activeUrgency) return false;
    return true;
  }).sort((a, b) => a.daysUntil - b.daysUntil);

  const criticalCount = EVENTS.filter(e => e.urgency === "critical").length;
  const highCount = EVENTS.filter(e => e.urgency === "high").length;

  return (
    <PageLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 24, height: 1, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>Readiness OS · Regulatory Intelligence</span>
          </div>
          <h1 style={{ ...CG, fontSize: "clamp(28px,3vw,40px)", fontWeight: 600, color: NAVY, margin: "0 0 8px" }}>
            Regulatory Calendar
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px" }}>
            Upcoming compliance deadlines mapped to pre-staged response playbooks. The response is ready before the deadline arrives.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Critical Deadlines", value: criticalCount, color: "#DC2626", bg: "rgba(220,38,38,0.06)", sub: "Action required now" },
              { label: "High Priority", value: highCount, color: "#F59E0B", bg: "rgba(245,158,11,0.06)", sub: "Within 30 days" },
              { label: "Prepared responses Mapped", value: EVENTS.reduce((a, e) => a + e.relatedPlaybooks.length, 0), color: TEAL, bg: "rgba(43,138,110,0.06)", sub: "Pre-staged responses" },
              { label: "Regulatory Bodies", value: new Set(EVENTS.map(e => e.regulatoryBody)).size, color: NAVY, bg: "rgba(10,15,46,0.04)", sub: "Monitored authorities" },
            ].map(({ label, value, color, bg, sub }) => (
              <div key={label} style={{ padding: "16px 18px", background: "#fff", border: "1px solid #E8E4DC", borderTop: `3px solid ${color}` }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 4 }}>{label}</div>
                <div style={{ ...CG, fontSize: 32, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>{sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Filter style={{ width: 14, height: 14, color: "#9CA3AF" }} />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{ padding: "4px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: `1px solid ${activeCategory === cat ? NAVY : "#E8E4DC"}`, background: activeCategory === cat ? NAVY : "#fff", color: activeCategory === cat ? "#fff" : "#6B7280", cursor: "pointer" }}
              >
                {cat}
              </button>
            ))}
            <div style={{ width: 1, height: 20, background: "#E8E4DC", margin: "0 4px" }} />
            {(["critical", "high", "medium", "upcoming"] as const).map(u => {
              const cfg = URGENCY_CONFIG[u];
              return (
                <button
                  key={u}
                  onClick={() => setActiveUrgency(activeUrgency === u ? null : u)}
                  style={{ padding: "4px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: `1px solid ${activeUrgency === u ? cfg.color : "#E8E4DC"}`, background: activeUrgency === u ? cfg.bg : "#fff", color: cfg.color, cursor: "pointer" }}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((event) => {
            const urgency = URGENCY_CONFIG[event.urgency];
            const isExpanded = expandedId === event.id;
            return (
              <div key={event.id} style={{ background: "#fff", border: `1px solid #E8E4DC`, borderLeft: `4px solid ${urgency.border}`, overflow: "hidden" }}>
                <div
                  style={{ padding: "18px 22px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 18 }}
                  onClick={() => setExpandedId(isExpanded ? null : event.id)}
                >
                  <div style={{ width: 56, flexShrink: 0, textAlign: "center" }}>
                    <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: urgency.color, lineHeight: 1 }}>
                      {event.daysUntil === 0 ? "NOW" : event.daysUntil === 1 ? "1" : event.daysUntil}
                    </div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF" }}>
                      {event.daysUntil === 0 ? "" : event.daysUntil === 1 ? "day" : "days"}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: urgency.color, padding: "2px 8px", background: urgency.bg }}>{urgency.label}</span>
                      <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF" }}>{event.category}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 3 }}>{event.title}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{event.regulatoryBody} · Due {fmtDate(event.deadline)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <BookOpen style={{ width: 12, height: 12, color: TEAL }} />
                      <span style={{ fontSize: 10, color: TEAL, fontWeight: 600 }}>{event.relatedPlaybooks.length} prepared response{event.relatedPlaybooks.length !== 1 ? "s" : ""}</span>
                    </div>
                    <ChevronRight style={{ width: 16, height: 16, color: "#9CA3AF", transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ borderTop: "1px solid #E8E4DC", padding: "18px 22px 18px 96px" }}>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>{event.description}</p>

                    <div style={{ padding: "12px 16px", background: "rgba(201,168,76,0.06)", borderLeft: `3px solid ${GOLD}`, marginBottom: 16 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, marginBottom: 4 }}>Recommended Action</div>
                      <p style={{ fontSize: 12, color: NAVY, margin: 0, fontWeight: 500 }}>{event.action}</p>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 8 }}>Pre-Staged Prepared responses</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {event.relatedPlaybooks.map(pb => (
                          <button
                            key={pb}
                            onClick={() => setLocation("/playbooks")}
                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#fff", border: `1px solid ${TEAL}`, color: TEAL, cursor: "pointer", fontSize: 11, fontWeight: 600 }}
                          >
                            <BookOpen style={{ width: 11, height: 11 }} />
                            {pb}
                            <ChevronRight style={{ width: 11, height: 11 }} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF" }}>Applies to:</div>
                      {event.applicableSectors.map(s => (
                        <span key={s} style={{ fontSize: 10, padding: "2px 8px", background: "#F8F7F4", color: NAVY, fontWeight: 600 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 24, padding: "16px 20px", background: "rgba(10,15,46,0.02)", border: "1px solid #E8E4DC", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>Regulatory windows are auto-calculated from today's date. Prepared response mappings reflect your active 170-prepared response library.</div>
          <button
            onClick={() => setLocation("/playbooks")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: NAVY, color: "#fff", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}
          >
            Open Prepared response Library <ChevronRight style={{ width: 12, height: 12 }} />
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
