import { useState } from "react";
import { Link } from "wouter";
import { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";
import { INDUSTRY_DEMO_BLUEPRINTS } from "@/data/industryDemoBlueprints";
import { Search, ArrowRight, Shield, TrendingUp, RefreshCw } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const BORDER = "#E2DDD5";

const GEO: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const BAR: React.CSSProperties = { fontFamily: "'Barlow', 'Barlow Condensed', sans-serif" };
const BRC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const DOMAIN_CONFIG = {
  "all": { label: "All Industries", color: NAVY },
  "GROWTH & POSITIONING": { label: "Growth & Positioning", color: GOLD },
  "RISK & RESILIENCE": { label: "Risk & Resilience", color: TEAL },
  "TRANSFORMATION": { label: "Transformation", color: NAVY },
};

const DOMAIN_ICONS = {
  "GROWTH & POSITIONING": TrendingUp,
  "RISK & RESILIENCE": Shield,
  "TRANSFORMATION": RefreshCw,
};

export default function IndustryDemoLibrary() {
  const [activeDomain, setActiveDomain] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    updatePageMetadata({
      title: "Industry Demo Library — VaughnMartin Readiness OS",
      description: "Full-spectrum industry demo blueprints showing exactly how Readiness OS executes in 12 minutes across 18 major industries — from financial services to aerospace.",
    });
  }, []);

  const filtered = INDUSTRY_DEMO_BLUEPRINTS.filter(b => {
    const domainMatch = activeDomain === "all" || b.domain === activeDomain;
    const q = search.toLowerCase();
    const textMatch = !q || [b.industry, b.triggerEvent, b.sector, b.businessValue].some(
      t => t.toLowerCase().includes(q)
    );
    return domainMatch && textMatch;
  });

  const domainColor = (domain: string) => {
    if (domain === "GROWTH & POSITIONING") return GOLD;
    if (domain === "RISK & RESILIENCE") return TEAL;
    return NAVY;
  };

  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ background: NAVY, padding: "80px 32px 64px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
            <span style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.75)" }}>Industry Demo Library</span>
            <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
          </div>
          <h1 style={{ ...GEO, fontSize: "clamp(30px,4.5vw,54px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
            18 Industries.<br />
            <em style={{ color: GOLD }}>One response time: 12 minutes.</em>
          </h1>
          <p style={{ ...BAR, fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, maxWidth: 600, marginBottom: 40 }}>
            Every industry faces strategic triggers. The question is whether the response is staged before they fire. Select your industry to see the exact execution sequence — signals monitored, executive authorization, tasks deployed, outcomes delivered.
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 480 }}>
            <Search size={15} color="rgba(255,255,255,0.3)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search by industry, scenario, or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 40px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: 13,
                fontFamily: "'Barlow', sans-serif",
                outline: "none",
                boxSizing: "border-box" as const,
              }}
            />
          </div>
        </div>
      </div>

      {/* Domain Filter */}
      <div style={{ background: IVORY, borderBottom: `1px solid ${BORDER}`, padding: "20px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", gap: 8, flexWrap: "wrap" as const }}>
          {Object.entries(DOMAIN_CONFIG).map(([key, cfg]) => {
            const Icon = key !== "all" ? DOMAIN_ICONS[key as keyof typeof DOMAIN_ICONS] : null;
            const active = activeDomain === key;
            return (
              <button
                key={key}
                onClick={() => setActiveDomain(key)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 18px",
                  background: active ? NAVY : "#fff",
                  border: `1px solid ${active ? NAVY : BORDER}`,
                  color: active ? "#fff" : "rgba(10,15,46,0.65)",
                  cursor: "pointer",
                  ...BRC,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase" as const,
                  transition: "all 0.15s",
                }}
              >
                {Icon && <Icon size={12} color={active ? GOLD : "rgba(10,15,46,0.4)"} />}
                {cfg.label}
                <span style={{
                  ...BRC, fontSize: 9, fontWeight: 700,
                  padding: "1px 6px",
                  background: active ? "rgba(201,168,76,0.2)" : "rgba(10,15,46,0.07)",
                  color: active ? GOLD : "rgba(10,15,46,0.4)",
                  marginLeft: 2,
                }}>
                  {key === "all"
                    ? INDUSTRY_DEMO_BLUEPRINTS.length
                    : INDUSTRY_DEMO_BLUEPRINTS.filter(b => b.domain === key).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{ background: "#fff", padding: "56px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(10,15,46,0.4)" }}>
              <div style={{ ...GEO, fontSize: 22, fontWeight: 600, marginBottom: 8 }}>No matching industries</div>
              <div style={{ ...BAR, fontSize: 13 }}>Try a different search term or domain filter.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
              {filtered.map((b) => {
                const dc = domainColor(b.domain);
                return (
                  <Link key={b.slug} href={`/industry-demo/${b.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      background: "#fff",
                      border: `1px solid ${BORDER}`,
                      borderTop: `3px solid ${dc}`,
                      padding: "24px 22px",
                      cursor: "pointer",
                      height: "100%",
                      boxSizing: "border-box" as const,
                      transition: "box-shadow 0.15s",
                      display: "flex",
                      flexDirection: "column" as const,
                    }}>
                      {/* Domain badge */}
                      <div style={{ marginBottom: 14 }}>
                        <span style={{
                          ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.16em",
                          textTransform: "uppercase" as const,
                          padding: "3px 8px",
                          background: dc === GOLD ? "rgba(201,168,76,0.1)" : dc === TEAL ? "rgba(43,138,110,0.1)" : "rgba(10,15,46,0.06)",
                          border: `1px solid ${dc === GOLD ? "rgba(201,168,76,0.3)" : dc === TEAL ? "rgba(43,138,110,0.3)" : "rgba(10,15,46,0.15)"}`,
                          color: dc,
                        }}>
                          {b.domain}
                        </span>
                      </div>

                      {/* Industry */}
                      <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(10,15,46,0.4)", marginBottom: 8 }}>{b.sector}</div>

                      {/* Industry name */}
                      <div style={{ ...GEO, fontSize: 18, fontWeight: 600, color: NAVY, lineHeight: 1.25, marginBottom: 10 }}>{b.industry}</div>

                      {/* Trigger */}
                      <div style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.6)", lineHeight: 1.65, marginBottom: 16, flex: 1 }}>{b.triggerEvent}</div>

                      {/* Key metrics row */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16 }}>
                        <div style={{ background: "rgba(10,15,46,0.03)", border: `1px solid ${BORDER}`, padding: "10px 12px" }}>
                          <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(10,15,46,0.35)", marginBottom: 4 }}>Value Protected</div>
                          <div style={{ ...BAR, fontSize: 13, fontWeight: 700, color: NAVY }}>{b.heroStat}</div>
                        </div>
                        <div style={{ background: "rgba(10,15,46,0.03)", border: `1px solid ${BORDER}`, padding: "10px 12px" }}>
                          <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(10,15,46,0.35)", marginBottom: 4 }}>Execution</div>
                          <div style={{ ...BAR, fontSize: 13, fontWeight: 700, color: TEAL }}>12 minutes</div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: NAVY }}>
                        See full execution sequence
                        <ArrowRight size={11} color={NAVY} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ background: NAVY, padding: "64px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.6)", marginBottom: 16 }}>Ready to deploy in your industry?</div>
          <h2 style={{ ...GEO, fontSize: "clamp(22px,3vw,36px)", fontWeight: 600, color: "#fff", lineHeight: 1.3, marginBottom: 20 }}>
            The response is ready<br />before the trigger fires.
          </h2>
          <p style={{ ...BAR, fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: 36 }}>
            Every blueprint above can be deployed in your organization within 4 weeks. Founding Partners receive all 170 Readiness Protocols pre-configured for their industry, risk calendar, and executive authorization structure.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const }}>
            <a href="/founding-partner-program" style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, background: GOLD, color: NAVY, padding: "14px 32px", textDecoration: "none" }}>
              Apply for Founding Partner Access
            </a>
            <a href="/12-minute-experience" style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.6)", padding: "14px 32px", border: "1px solid rgba(255,255,255,0.15)", textDecoration: "none" }}>
              Try the 12-Minute Experience →
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
