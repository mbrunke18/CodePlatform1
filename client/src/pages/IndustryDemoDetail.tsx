import { useEffect } from "react";
import { Link, useParams } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";
import { getBlueprintBySlug } from "@/data/industryDemoBlueprints";
import { ArrowLeft, Shield, TrendingUp, RefreshCw, CheckCircle, Clock, AlertTriangle, ChevronRight } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const BORDER = "#E2DDD5";
const RED = "#B91C1C";

const GEO: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const BAR: React.CSSProperties = { fontFamily: "'Barlow', 'Barlow Condensed', sans-serif" };
const BRC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

function domainColor(domain: string) {
  if (domain === "GROWTH & POSITIONING") return GOLD;
  if (domain === "RISK & RESILIENCE") return TEAL;
  return NAVY;
}

function DomainIcon({ domain, size = 14 }: { domain: string; size?: number }) {
  if (domain === "GROWTH & POSITIONING") return <TrendingUp size={size} />;
  if (domain === "RISK & RESILIENCE") return <Shield size={size} />;
  return <RefreshCw size={size} />;
}

export default function IndustryDemoDetail() {
  const params = useParams<{ industrySlug: string }>();
  const blueprint = params.industrySlug ? getBlueprintBySlug(params.industrySlug) : undefined;

  useEffect(() => {
    if (blueprint) {
      updatePageMetadata({
        title: `${blueprint.industry} — Readiness OS Demo | VaughnMartin`,
        description: `See how Readiness OS executes in 12 minutes for ${blueprint.industry}: ${blueprint.triggerEvent}`,
      });
    }
  }, [blueprint]);

  if (!blueprint) {
    return (
      <PageLayout>
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 40 }}>
          <div style={{ ...GEO, fontSize: 28, fontWeight: 600, color: NAVY, marginBottom: 12 }}>Industry Not Found</div>
          <p style={{ ...BAR, fontSize: 14, color: "rgba(10,15,46,0.5)", marginBottom: 28 }}>That industry demo doesn't exist or the URL may be incorrect.</p>
          <Link href="/industry-demo-library" style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", background: NAVY, color: "#fff", padding: "12px 28px", textDecoration: "none" }}>
            View All Industries
          </Link>
        </div>
      </PageLayout>
    );
  }

  const dc = domainColor(blueprint.domain);

  return (
    <PageLayout>

      {/* Back nav */}
      <div style={{ background: IVORY, borderBottom: `1px solid ${BORDER}`, padding: "14px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Link href="/industry-demo-library" style={{ display: "inline-flex", alignItems: "center", gap: 6, ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(10,15,46,0.5)", textDecoration: "none" }}>
            <ArrowLeft size={11} />
            Industry Demo Library
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: NAVY, padding: "72px 32px 56px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {/* Domain pill */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
              color: dc,
              padding: "4px 10px",
              border: `1px solid ${dc === GOLD ? "rgba(201,168,76,0.4)" : dc === TEAL ? "rgba(43,138,110,0.4)" : "rgba(255,255,255,0.2)"}`,
              background: dc === GOLD ? "rgba(201,168,76,0.1)" : dc === TEAL ? "rgba(43,138,110,0.1)" : "rgba(255,255,255,0.06)",
            }}>
              <DomainIcon domain={blueprint.domain} size={11} />
              {blueprint.domain}
            </span>
            <ChevronRight size={12} color="rgba(255,255,255,0.2)" />
            <span style={{ ...BRC, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{blueprint.sector}</span>
          </div>

          <h1 style={{ ...GEO, fontSize: "clamp(26px,4vw,48px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
            {blueprint.industry}
          </h1>
          <div style={{ width: 48, height: 2, background: GOLD, marginBottom: 20 }} />
          <p style={{ ...BAR, fontSize: "clamp(13px,1.5vw,16px)", fontWeight: 600, color: GOLD, lineHeight: 1.5, maxWidth: 760, marginBottom: 12 }}>
            {blueprint.triggerEvent}
          </p>
          <p style={{ ...BAR, fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.85, maxWidth: 760, marginBottom: 40 }}>
            {blueprint.triggerContext}
          </p>

          {/* Hero metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3, maxWidth: 760 }}>
            {blueprint.keyMetrics.map((m, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", padding: "16px 14px" }}>
                <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>{m.label}</div>
                <div style={{ ...BAR, fontSize: 15, fontWeight: 700, color: "#fff" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ background: "#fff", padding: "64px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: 40, alignItems: "start" }}>

          {/* Left column */}
          <div>

            {/* Signals Monitored */}
            <section style={{ marginBottom: 48 }}>
              <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginBottom: 8 }}>Continuous Signal Monitoring</div>
              <h2 style={{ ...GEO, fontSize: 24, fontWeight: 600, color: NAVY, marginBottom: 6 }}>What the system watches — always.</h2>
              <p style={{ ...BAR, fontSize: 13, color: "rgba(10,15,46,0.55)", lineHeight: 1.8, marginBottom: 20 }}>Before any trigger fires, Readiness OS continuously monitors these signal categories across {blueprint.industry}. Pattern detection runs 24/7 — the response is ready before you know you need it.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {blueprint.signalsMonitored.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", background: "rgba(43,138,110,0.04)", border: "1px solid rgba(43,138,110,0.12)", borderLeft: `3px solid ${TEAL}` }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, marginTop: 6, flexShrink: 0 }} />
                    <span style={{ ...BAR, fontSize: 13, color: NAVY, lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Authorization Chain */}
            <section style={{ marginBottom: 48 }}>
              <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginBottom: 8 }}>Executive Authorization</div>
              <h2 style={{ ...GEO, fontSize: 24, fontWeight: 600, color: NAVY, marginBottom: 6 }}>AI monitors. Executives authorize.</h2>
              <p style={{ ...BAR, fontSize: 13, color: "rgba(10,15,46,0.55)", lineHeight: 1.8, marginBottom: 20 }}>No Readiness Protocol activates without executive sign-off. The preparation compresses the mobilization cycle — the decision remains human. The <strong>{blueprint.executiveRole}</strong> receives a full impact brief before authorizing execution.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {blueprint.authorizationChain.map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px", background: i === 0 ? "rgba(201,168,76,0.06)" : "#fff", border: `1px solid ${i === 0 ? "rgba(201,168,76,0.25)" : BORDER}` }}>
                    <div style={{ ...BRC, fontSize: 9, fontWeight: 700, width: 20, height: 20, background: i === 0 ? GOLD : NAVY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      {i + 1}
                    </div>
                    <span style={{ ...BAR, fontSize: 13, color: NAVY, lineHeight: 1.55 }}>{step}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 12-Minute Execution Timeline */}
            <section style={{ marginBottom: 48 }}>
              <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginBottom: 8 }}>12-Minute Execution Sequence</div>
              <h2 style={{ ...GEO, fontSize: 24, fontWeight: 600, color: NAVY, marginBottom: 6 }}>The complete response — in order.</h2>
              <p style={{ ...BAR, fontSize: 13, color: "rgba(10,15,46,0.55)", lineHeight: 1.8, marginBottom: 20 }}>Every task, owner, and handoff pre-staged. When the trigger fires, the sequence executes — not in days, not in hours.</p>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 28, top: 0, bottom: 0, width: 1, background: "rgba(10,15,46,0.08)" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {blueprint.executionSteps.map((step, i) => {
                    const isLast = i === blueprint.executionSteps.length - 1;
                    const isAuth = step.owner === "CRO" || step.owner === "CEO" || step.owner === "CMO" || step.owner === "CEO/CMO" || step.owner === "CEO/CPO" || step.owner === "CEO/GC" || step.owner === "CEO/CSCO" || step.owner === "CEO/CHRO" || step.owner === "CEO/CCO" || step.owner === "CSO/VP Ops" || step.owner === "CTO" || step.owner === "CMO/GC" || step.owner === "CCO/COO" || step.owner === "MP/GC" || step.owner === "COO" || step.owner === "President/GC" || step.owner === "CEO/CDO" || step.owner === "CRO/VP Ops";
                    const isSystem = step.owner === "System";
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, paddingLeft: 0, marginBottom: isLast ? 0 : 2, position: "relative" }}>
                        {/* Timeline dot */}
                        <div style={{
                          width: 56, flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", paddingRight: 12, paddingTop: 13,
                          ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: isLast ? TEAL : "rgba(10,15,46,0.35)"
                        }}>
                          {step.minute}
                        </div>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: isLast ? TEAL : isAuth ? GOLD : isSystem ? "rgba(10,15,46,0.25)" : NAVY, flexShrink: 0, marginTop: 15, border: isLast ? `2px solid ${TEAL}` : "none", boxSizing: "border-box", zIndex: 1 }} />
                        <div style={{
                          flex: 1,
                          padding: "10px 14px",
                          background: isLast ? "rgba(43,138,110,0.06)" : isAuth ? "rgba(201,168,76,0.05)" : isSystem ? "rgba(10,15,46,0.02)" : "#fff",
                          border: `1px solid ${isLast ? "rgba(43,138,110,0.2)" : isAuth ? "rgba(201,168,76,0.2)" : BORDER}`,
                          marginBottom: 2,
                        }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                            <span style={{ ...BAR, fontSize: 13, color: NAVY, lineHeight: 1.5, fontWeight: isLast || isAuth ? 600 : 400 }}>{step.action}</span>
                            <span style={{
                              ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", flexShrink: 0,
                              color: isAuth ? GOLD : isSystem ? "rgba(10,15,46,0.35)" : TEAL,
                              padding: "2px 7px", border: `1px solid ${isAuth ? "rgba(201,168,76,0.25)" : isSystem ? "rgba(10,15,46,0.1)" : "rgba(43,138,110,0.2)"}`,
                              background: isAuth ? "rgba(201,168,76,0.06)" : isSystem ? "transparent" : "rgba(43,138,110,0.04)",
                            }}>
                              {step.owner}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Comparison: Traditional vs Readiness OS */}
            <section style={{ marginBottom: 48 }}>
              <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginBottom: 8 }}>30 Days Compressed to 12 Minutes</div>
              <h2 style={{ ...GEO, fontSize: 24, fontWeight: 600, color: NAVY, marginBottom: 20 }}>The old model vs. the ready model.</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
                {/* Traditional */}
                <div style={{ padding: "24px 22px", background: "rgba(185,28,28,0.04)", border: "1px solid rgba(185,28,28,0.15)", borderTop: `3px solid ${RED}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <AlertTriangle size={14} color={RED} />
                    <span style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: RED }}>Traditional Response</span>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginBottom: 4 }}>Time to mobilize</div>
                    <div style={{ ...BAR, fontSize: 15, fontWeight: 700, color: RED }}>{blueprint.traditionalTime}</div>
                  </div>
                  <p style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.6)", lineHeight: 1.7, marginBottom: 0 }}>{blueprint.traditionalOutcome}</p>
                </div>

                {/* Readiness OS */}
                <div style={{ padding: "24px 22px", background: "rgba(43,138,110,0.04)", border: "1px solid rgba(43,138,110,0.2)", borderTop: `3px solid ${TEAL}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <CheckCircle size={14} color={TEAL} />
                    <span style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: TEAL }}>Readiness OS</span>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginBottom: 4 }}>Time to mobilize</div>
                    <div style={{ ...BAR, fontSize: 15, fontWeight: 700, color: TEAL }}>{blueprint.readinessTime}</div>
                  </div>
                  <p style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.6)", lineHeight: 1.7, marginBottom: 0 }}>{blueprint.readinessOutcome}</p>
                </div>
              </div>
            </section>

            {/* Starter Protocols */}
            <section>
              <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginBottom: 8 }}>Pre-Staged Protocols</div>
              <h2 style={{ ...GEO, fontSize: 24, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Ready before the trigger fires.</h2>
              <p style={{ ...BAR, fontSize: 13, color: "rgba(10,15,46,0.55)", lineHeight: 1.8, marginBottom: 20 }}>These protocols are included in the core library and available to all Founding Partners. Each one is pre-staged with stakeholder assignments, budget authorities, task sequences, and communication templates.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {blueprint.starterProtocols.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "#fff", border: `1px solid ${BORDER}` }}>
                    <span style={{ ...BRC, fontSize: 9, fontWeight: 700, color: GOLD, minWidth: 36 }}>{p.number}</span>
                    <span style={{ ...BAR, fontSize: 13, color: NAVY, fontWeight: 500 }}>{p.name}</span>
                    <div style={{ marginLeft: "auto", ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: TEAL }}>Pre-staged</div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right column — sticky sidebar */}
          <div style={{ position: "sticky", top: 24 }}>

            {/* Hero stat card */}
            <div style={{ background: NAVY, padding: "28px 24px", marginBottom: 3 }}>
              <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>3,600× Execution Head Start</div>
              <div style={{ ...GEO, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 6 }}>{blueprint.heroStat}</div>
              <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>{blueprint.heroLabel}</div>
              <div style={{ ...BAR, fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
                30 days compressed to 12 minutes. The response was ready before the trigger fired.
              </div>
            </div>

            {/* Execution clock */}
            <div style={{ background: IVORY, border: `1px solid ${BORDER}`, padding: "22px 24px", marginBottom: 3 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Clock size={13} color={TEAL} />
                <span style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(10,15,46,0.5)" }}>Execution Timeline</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.5)" }}>Traditional mobilization</span>
                  <span style={{ ...BAR, fontSize: 12, fontWeight: 700, color: RED }}>{blueprint.traditionalTime.split(" ")[0]} {blueprint.traditionalTime.split(" ")[1]}</span>
                </div>
                <div style={{ width: "100%", height: 4, background: "rgba(10,15,46,0.08)", position: "relative" }}>
                  <div style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "99%", background: `rgba(185,28,28,0.25)` }} />
                  <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "0.3%", background: TEAL }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.5)" }}>Readiness OS</span>
                  <span style={{ ...BAR, fontSize: 12, fontWeight: 700, color: TEAL }}>12 minutes</span>
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div style={{ border: `1px solid ${BORDER}`, padding: "24px 22px", marginBottom: 3 }}>
              <div style={{ ...GEO, fontSize: 18, fontWeight: 600, color: NAVY, lineHeight: 1.3, marginBottom: 10 }}>Deploy this blueprint in your organization.</div>
              <p style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.55)", lineHeight: 1.75, marginBottom: 20 }}>Founding Partners receive all 170 Readiness Protocols pre-configured for their industry, risk calendar, and executive structure. Go live in 4 weeks.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a href="/founding-partner-program" style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: NAVY, color: "#fff", padding: "13px 16px", textDecoration: "none", display: "block", textAlign: "center" }}>
                  Apply for Founding Partner Access
                </a>
                <a href="/12-minute-experience" style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: NAVY, padding: "13px 16px", textDecoration: "none", display: "block", textAlign: "center", border: `1px solid ${BORDER}` }}>
                  Try the 12-Minute Experience →
                </a>
              </div>
            </div>

            {/* Other industries */}
            <div style={{ border: `1px solid ${BORDER}`, padding: "18px 20px" }}>
              <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginBottom: 12 }}>Explore More Industries</div>
              <Link href="/industry-demo-library" style={{ display: "inline-flex", alignItems: "center", gap: 6, ...BAR, fontSize: 12, color: NAVY, fontWeight: 600, textDecoration: "none" }}>
                View All 18 Industry Blueprints
                <ChevronRight size={12} />
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom proof bar */}
      <div style={{ background: IVORY, borderTop: `1px solid ${BORDER}`, padding: "32px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", gap: 40, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Readiness Protocols", value: "170" },
            { label: "Strategic Triggers", value: "221" },
            { label: "Industries Covered", value: "18" },
            { label: "Execution Head Start", value: "3,600×" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ ...GEO, fontSize: 26, fontWeight: 700, color: NAVY }}>{s.value}</div>
              <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

    </PageLayout>
  );
}
