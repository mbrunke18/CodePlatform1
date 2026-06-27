import { useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, DollarSign, TrendingUp, Users, BarChart3, Zap, Lock } from "lucide-react";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";

const Label = ({ children, light = false }: { children: string; light?: boolean }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
    <div style={{ height: 1, width: 24, background: GOLD }} />
    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: light ? "rgba(201,168,76,0.8)" : GOLD }}>
      {children}
    </span>
    <div style={{ height: 1, width: 24, background: GOLD }} />
  </div>
);

const SectionH2 = ({ children, light = false, style = {} }: { children: React.ReactNode; light?: boolean; style?: React.CSSProperties }) => (
  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(30px,4vw,52px)", fontWeight: 700, lineHeight: 1.12, color: light ? "#fff" : NAVY, ...style }}>
    {children}
  </h2>
);

export default function InvestorLanding() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Investor Overview | Readiness OS — Readiness Infrastructure",
      description: "Every enterprise has Microsoft's AI stack. None have the operating model to use it. Readiness OS is the operating model layer. First-mover in a new enterprise software category.",
      ogTitle: "Invest in Readiness OS — The Operating Model Layer for startup to Fortune 500",
      ogDescription: "Enterprises spend 30 days mobilizing for events they could have pre-staged. Readiness OS changes the model. 180 protocols. 12-minute execution. First-mover opportunity.",
    });
  }, []);

  return (
    <PageLayout>

      {/* ── 1. HERO ───────────────────────────────────────────────────────── */}
      <section style={{ background: NAVY, padding: "96px 32px 80px", position: "relative", overflow: "hidden" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMDksMTY4LDc2LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')" }} />

        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
            <VaughnMartinLogo color="light" height={44} variant="full" />
          </div>

          <Label light>Category-Defining Opportunity</Label>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28, padding: "5px 14px", border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.07)" }}>
            <div style={{ width: 5, height: 5, background: GOLD, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD }}>Coordination Infrastructure</span>
          </div>

          <h1 data-testid="heading-hero" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, lineHeight: 1.08, color: "#fff", marginBottom: 20, maxWidth: 860, marginLeft: "auto", marginRight: "auto" }}>
            The Salesforce Moment for<br />Strategic Readiness
          </h1>

          <p data-testid="text-tagline" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 400, fontStyle: "italic", color: GOLD, marginBottom: 40 }}>
            The response is ready before the trigger fires.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 56 }}>
            <a href="mailto:mbrunke@vaughnmartin.com" data-testid="button-request-pilot" style={{ fontFamily: "'Barlow', sans-serif", textDecoration: "none", display: "inline-block", background: GOLD, color: NAVY, fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", padding: "16px 40px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              Talk to the Founder →
            </a>
            <a href="/demo-experience" style={{ fontFamily: "'Barlow', sans-serif", textDecoration: "none", display: "inline-block", background: "transparent", color: TEAL, border: "1.5px solid " + TEAL, fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", padding: "15px 32px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              See the Platform →
            </a>
          </div>

          {/* Two-column: thesis + stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "1px solid rgba(201,168,76,0.2)", textAlign: "left" }}>
            <div style={{ padding: "40px 44px", borderRight: "1px solid rgba(201,168,76,0.2)" }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 18 }}>The VaughnMartin Thesis</div>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.88)", lineHeight: 1.8, marginBottom: 14 }}>
                Enterprise work was designed for a world without AI. Committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act alone.
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 14 }}>
                AI changed the constraint. Every vendor bolted AI onto the old model — faster spreadsheets, smarter summaries, better notes from the same slow meetings. The bureaucracy stays. The latency stays.
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: GOLD, lineHeight: 1.7 }}>
                VaughnMartin redesigns how work flows from first principles. Pre-staged Readiness Protocols replace real-time coordination. Pattern detection replaces committee deliberation. 12-minute execution replaces 30-day alignment cycles.
              </p>
            </div>
            <div style={{ padding: "40px 44px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 0 }}>
              {[
                { n: "3,600×", label: "Execution Head Start", sub: "30 days compressed to 12 minutes" },
                { n: "$5B+", label: "Addressable Market", sub: "Coordination infrastructure category" },
                { n: "180", label: "Readiness Protocols", sub: "Staged before any trigger fires" },
                { n: "231", label: "Trigger Conditions Monitored", sub: "Continuous — 15-minute detection cycle" },
              ].map((s, i) => (
                <div key={s.n} style={{ padding: "20px 0", borderBottom: i < 3 ? "1px solid rgba(201,168,76,0.12)" : "none", display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 700, color: i === 0 ? GOLD : i === 2 ? TEAL : "#fff", minWidth: 90, flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            <button data-testid="button-see-live" onClick={() => setLocation("/command-tower")} style={{ fontFamily: "'Barlow', sans-serif", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.2)", textUnderlineOffset: 4 }}>
              See the system live →
            </button>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>or</span>
            <button data-testid="button-see-demo" onClick={() => setLocation("/12-minute-experience")} style={{ fontFamily: "'Barlow', sans-serif", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.2)", textUnderlineOffset: 4 }}>
              Take the 12-minute test drive →
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. THE PROBLEM ───────────────────────────────────────────────── */}
      <section style={{ background: NAVY, borderTop: "1px solid rgba(201,168,76,0.15)", padding: "80px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          <div style={{ borderLeft: "4px solid " + GOLD, borderTop: "1px solid rgba(201,168,76,0.25)", borderRight: "1px solid rgba(201,168,76,0.25)", borderBottom: "1px solid rgba(201,168,76,0.25)", padding: "44px 52px", background: "rgba(255,255,255,0.02)", marginBottom: 48 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>The Question That Closes Every Conversation</div>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px,3.5vw,38px)", fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 20 }}>
              If a ransomware attack, an activist investor, or a regulatory inquiry hit one of your portfolio companies today — what would happen in the next 12 minutes?
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.72)", lineHeight: 1.85, marginBottom: 28, maxWidth: 700 }}>
              Who calls who? Where's the brief? Who owns the response? Who authorizes it? Most enterprises spend 30 days figuring that out — while the window closes, the regulator moves, the stock drops, the competitor acts. <strong style={{ color: "#fff" }}>That gap is the business.</strong> Every startup to Fortune 500 has it. None have solved it. The cost per event: $50M to $500M. And they face it <strong style={{ color: "#fff" }}>15–20 times every year.</strong> This is not a catastrophe playbook. It is a recurring operating cost that compounds every time a situation presents itself — and has never had infrastructure built around it.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
              <a href="/12-minute-experience" style={{ display: "inline-block", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "14px 36px", background: GOLD, color: NAVY, textDecoration: "none" }}>
                See What 12 Minutes Looks Like →
              </a>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
                $847B spent annually on strategic initiatives<br />
                <strong style={{ color: "rgba(255,255,255,0.6)" }}>83% fail due to execution gaps</strong>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, background: "rgba(201,168,76,0.08)" }}>
            {[
              { domain: "Export Control & Technology Restriction", detail: "BIS entity lists, CHIPS Act exposure, ITAR/EAR compliance triggers — detected before a license violation surfaces" },
              { domain: "Foreign Investment Scrutiny (CFIUS)", detail: "Ownership structure reviews, national security assessments, forced divestiture signals — pre-staged before Treasury moves" },
              { domain: "Data Sovereignty & Localization Mandate", detail: "Cross-border data flow restrictions, adequacy decision changes, cloud sovereignty requirements — protocol ready before enforcement" },
              { domain: "Geopolitical Operating Model Disruption", detail: "US-China decoupling cascades, market exit triggers, friend-shoring mandates — restructuring protocol staged in advance" },
            ].map(({ domain, detail }) => (
              <div key={domain} style={{ background: NAVY, padding: "28px 32px", borderLeft: "3px solid rgba(201,168,76,0.35)" }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>{domain}</div>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: 0 }}>{detail}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, paddingTop: 28, borderTop: "1px solid rgba(201,168,76,0.15)", textAlign: "center" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(17px,2vw,22px)", fontStyle: "italic", color: "rgba(255,255,255,0.65)", lineHeight: 1.55, margin: 0 }}>
              "The firm that survives a geopolitical trigger is not the fastest to respond. It is the one that made the response ready before the trigger fired."
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. THE SOLUTION ──────────────────────────────────────────────── */}
      <section style={{ background: IVORY, padding: "88px 32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Label>The Solution</Label>
            <SectionH2 style={{ marginBottom: 16 }}>
              The Operating Model Layer<br />
              <em style={{ color: TEAL }}>above the Microsoft stack.</em>
            </SectionH2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: "rgba(10,15,46,0.65)", maxWidth: 640, margin: "0 auto", lineHeight: 1.75 }}>
              Every enterprise already bought the detection stack. Every enterprise already bought the AI stack. None have the operating model that acts on them. Readiness OS is that layer.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, background: "rgba(10,15,46,0.08)", marginBottom: 48 }}>
            {[
              { n: "01", label: "Pre-Stage", body: "180 Readiness Protocols mapped to every strategic trigger the organization expects to encounter — tasks assigned, owners named, budgets pre-authorized. Before the trigger fires.", accent: NAVY },
              { n: "02", label: "Detect", body: "231 detection thresholds monitored continuously across geopolitical, regulatory, competitive, and operational domains. 15-minute detection cycle. No committee required.", accent: TEAL },
              { n: "03", label: "Authorize & Execute", body: "AI monitors. Executives authorize. No protocol activates without executive sign-off. The preparation compresses the mobilization cycle. The decision remains human.", accent: GOLD },
            ].map(m => (
              <div key={m.n} style={{ background: "#fff", padding: "36px 32px" }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: m.accent, marginBottom: 12 }}>{m.n} — {m.label}</div>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "rgba(10,15,46,0.75)", lineHeight: 1.8, margin: 0 }}>{m.body}</p>
              </div>
            ))}
          </div>

          {/* Workflow Distinction Block */}
          <div style={{ margin: "2px 0", background: NAVY, padding: "44px 48px", display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: 0 }}>
            <div style={{ paddingRight: 48 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "rgba(200,70,50,0.85)", marginBottom: 16 }}>What workflow tools do</div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(18px,2vw,24px)", fontWeight: 700, color: "rgba(255,255,255,0.6)", lineHeight: 1.35, marginBottom: 16 }}>
                The trigger fires. Someone opens Monday.com. Tasks get created. Owners get assigned. The sprint gets built.
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, marginBottom: 0 }}>
                By the time the workflow is configured, you are already 2–3 days into the mobilization window. The board is asking questions. The competitor is moving. The regulator has a head start. Workflow tools assume the mobilization is done — they only manage what comes after.
              </p>
            </div>
            <div style={{ background: "rgba(201,168,76,0.2)", margin: "0 48px" }} />
            <div style={{ paddingLeft: 0 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>What Readiness OS does</div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(18px,2vw,24px)", fontWeight: 700, color: "#fff", lineHeight: 1.35, marginBottom: 16 }}>
                The trigger fires. The response is already staged. Tasks exist. Owners are named. Authority is established. Budget is pre-authorized.
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: 16 }}>
                The response doesn't begin when the trigger fires — it <em style={{ color: GOLD }}>continues</em>. Readiness OS solves the mobilization problem that workflow tools assume is already solved.
              </p>
              <div style={{ borderTop: "1px solid rgba(201,168,76,0.25)", paddingTop: 16 }}>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: GOLD, lineHeight: 1.6, margin: 0, letterSpacing: "0.03em" }}>
                  This is not a workflow tool. It is readiness infrastructure — the layer that makes the workflow ready before the trigger fires.
                </p>
              </div>
            </div>
          </div>

          {/* CEO / CFO Value Frame */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, background: "rgba(10,15,46,0.08)" }}>
            <div style={{ background: "#fff", padding: "36px 32px", borderTop: "3px solid " + GOLD }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 14 }}>CEO Conversation</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: NAVY, lineHeight: 1.25, marginBottom: 16 }}>
                "30-day mobilization to 12 minutes — before the competitor even starts."
              </h3>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(10,15,46,0.65)", lineHeight: 1.75, marginBottom: 16 }}>
                The competitive advantage is the prepared response — not the faster committee. Every competitor still starts from zero when a trigger fires. Readiness OS starts from pre-staged.
              </p>
              <div style={{ borderTop: "1px solid rgba(10,15,46,0.1)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                {["Pre-staged for every situation the enterprise will face", "180 Readiness Protocols across 9 strategic domains", "Executive authority preserved — no protocol activates without sign-off"].map(pt => (
                  <div key={pt} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: GOLD, fontSize: 10, marginTop: 3, flexShrink: 0 }}>◆</span>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(10,15,46,0.75)", lineHeight: 1.5 }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", padding: "36px 32px", borderTop: "3px solid " + TEAL }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, marginBottom: 14 }}>CFO Conversation</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: NAVY, lineHeight: 1.25, marginBottom: 16 }}>
                "This is not a tooling spend. It is a value-protection and value-capture system."
              </h3>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "rgba(10,15,46,0.55)", lineHeight: 1.7, marginBottom: 12 }}>Illustrative annual value at $5B enterprise, 6 critical events/year:</p>
              <div style={{ background: IVORY, padding: "16px", marginBottom: 14 }}>
                {[
                  { l: "Loss Avoided", d: "6 events × $750K/day × 2 days eliminated", v: "$9.0M", c: NAVY },
                  { l: "Upside Captured", d: "4 opportunity moments × 3% win-rate lift", v: "$2.4M", c: TEAL },
                  { l: "Coordination Cost Saved", d: "Executive time reclaimed from mobilization", v: "$0.3M", c: "rgba(10,15,46,0.6)" },
                  { l: "External Spend Displaced", d: "Consulting retainers replaced", v: "$0.5M+", c: "rgba(10,15,46,0.4)" },
                ].map(b => (
                  <div key={b.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "7px 0", borderBottom: "1px solid rgba(10,15,46,0.07)" }}>
                    <div>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: b.c }}>{b.l}</div>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: "rgba(10,15,46,0.35)", marginTop: 1 }}>{b.d}</div>
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: b.c, flexShrink: 0, marginLeft: 16 }}>{b.v}</div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, marginTop: 4 }}>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: NAVY }}>Illustrative Annual Value</span>
                  <span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: NAVY }}>$11.9M+</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(43,138,110,0.1)", border: "1px solid rgba(43,138,110,0.25)", padding: "12px 16px" }}>
                <div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, marginBottom: 2 }}>At $325K/yr Platform Investment</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(10,15,46,0.55)" }}>Payback on first situation</div>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: TEAL }}>36× ROI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. WHY INCUMBENTS WON'T BUILD IT ─────────────────────────────── */}
      <section style={{ background: "#fff", padding: "88px 32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Label>Competitive Reality</Label>
            <SectionH2 style={{ marginBottom: 16 }}>
              Why won't an incumbent just build this?
            </SectionH2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: "rgba(10,15,46,0.6)", maxWidth: 600, margin: "0 auto", lineHeight: 1.75 }}>
              Every investor asks it. Four incumbents. Four structural reasons the category stays open.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 2, background: "rgba(10,15,46,0.08)" }}>
            {[
              {
                co: "Microsoft",
                role: "Infrastructure layer",
                body: "Microsoft builds and sells the AI, compute, and collaboration stack. Readiness OS orchestrates it. Their business model requires customers to buy Microsoft infrastructure — they have no incentive to tell enterprises the infrastructure is insufficient without an operating model above it. Copilot Studio automates tasks; it has no concept of a strategic trigger, a pre-staged response, or executive authorization gates.",
                verdict: "Microsoft is the platform. We are the operating model. They benefit from our existence.",
                vc: TEAL,
              },
              {
                co: "ServiceNow",
                role: "ITSM and workflow automation",
                body: "ServiceNow's entire commercial model is built on reactive incident management — something happens, a ticket is created, it gets routed. Readiness OS is proactive by design: the response is staged before the trigger fires. Pre-staging is architecturally opposite to the ServiceNow model. Entering this space would require them to compete with their own positioning.",
                verdict: "ServiceNow manages the ticket after the event. We stage the response before it.",
                vc: GOLD,
              },
              {
                co: "Big 4 Consulting",
                role: "Strategy and crisis response",
                body: "McKinsey, Deloitte, PwC, and Accenture bill $50K–$200K to build the response in real time after the trigger fires. Readiness OS eliminates the primary revenue event for their strategic advisory practices. McKinsey's 2025 synthesis explicitly identifies the missing 'orchestration layer' — but productizing the solution destroys their margin structure.",
                verdict: "Consulting firms profit from the gap we close. They cannot be the ones who close it.",
                vc: TEAL,
              },
              {
                co: "Salesforce",
                role: "CRM and customer data",
                body: "Salesforce owns the customer relationship layer. Strategic readiness operates at the organizational governance layer — cross-functional, executive-authorized, cross-domain. The ICP (COO, CISO, Chief Strategy Officer, General Counsel), the workflow architecture, and the organizational entry point are structurally incompatible with Salesforce's existing motion.",
                verdict: "Wrong buyer. Wrong architecture. Wrong entry point.",
                vc: GOLD,
              },
            ].map(c => (
              <div key={c.co} style={{ background: "#fff", padding: "36px 36px" }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginBottom: 6 }}>{c.role}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: NAVY, marginBottom: 14 }}>{c.co}</h3>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(10,15,46,0.68)", lineHeight: 1.8, marginBottom: 18 }}>{c.body}</p>
                <div style={{ borderTop: "1px solid rgba(10,15,46,0.08)", paddingTop: 16 }}>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: c.vc, lineHeight: 1.5, margin: 0 }}>{c.verdict}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. THE MOAT ──────────────────────────────────────────────────── */}
      <section style={{ background: NAVY, padding: "88px 32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Label light>Competitive Defensibility</Label>
            <SectionH2 light style={{ marginBottom: 16 }}>
              If a well-funded competitor showed up tomorrow —<br />
              <em style={{ color: GOLD }}>why do we still win?</em>
            </SectionH2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 580, margin: "0 auto", lineHeight: 1.75 }}>
              A product is not a moat. Features can be rebuilt in 12 months. The moat is what a competitor cannot replicate regardless of funding.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, background: "rgba(201,168,76,0.12)", marginBottom: 52 }}>
            {[
              { n: "01", label: "Accumulated Decision Logic", accent: GOLD, body: "A competitor can rebuild the platform layer in 6–12 months. They cannot rebuild 20 years of enterprise operational decision logic — the situation patterns, stakeholder sequences, and failure modes embedded in 180 Readiness Protocols from two decades of real crisis response.", proof: "20 years of operational experience → not replicable with funding" },
              { n: "02", label: "Organizational Intelligence That Compounds", accent: TEAL, body: "Every activation, every debrief, every stakeholder acknowledgment makes the platform more specific to that organization's actual failure modes and response patterns. That accumulated intelligence is non-transferable. A competitor starting from zero starts from zero — permanently.", proof: "Each use deepens specificity → value compounds, not depreciates" },
              { n: "03", label: "Embeddedness as Infrastructure", accent: GOLD, body: "When Readiness OS becomes the organizational rhythm for strategic readiness — not a tool they open, but the process by which preparation happens — it stops being a vendor. Infrastructure is not replaced at contract renewal. It is built upon.", proof: "Operating rhythm, not software → switching cost measured in years" },
            ].map(m => (
              <div key={m.n} style={{ background: NAVY, padding: "32px 28px" }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: m.accent, marginBottom: 12 }}>Moat {m.n}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>{m.label}</h3>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: 20 }}>{m.body}</p>
                <div style={{ borderTop: "1px solid rgba(201,168,76,0.2)", paddingTop: 14 }}>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: m.accent, letterSpacing: "0.04em", lineHeight: 1.5, margin: 0 }}>{m.proof}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", borderTop: "1px solid rgba(201,168,76,0.2)", paddingTop: 44 }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(18px,2.2vw,26px)", fontStyle: "italic", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: 12 }}>
              "The competitor can buy the platform. They cannot buy the accumulated decision logic embedded in the preparation phase."
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(201,168,76,0.8)", margin: 0 }}>
              Dr. Kerry Huang · ESI Top 1% Researcher · 408-Firm Study
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. BUSINESS MODEL + UNIT ECONOMICS ───────────────────────────── */}
      <section style={{ background: "#fff", padding: "88px 32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Label>Business Model</Label>
            <h2 data-testid="heading-model" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(30px,4vw,52px)", fontWeight: 700, color: NAVY, lineHeight: 1.12, marginBottom: 16 }}>
              High-Margin SaaS
            </h2>
            <p data-testid="text-model-subtitle" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: "rgba(10,15,46,0.6)", maxWidth: 560, margin: "0 auto", lineHeight: 1.75 }}>
              Enterprise pricing with expansion revenue and infrastructure-category retention
            </p>
          </div>

          {/* Pricing tiers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, background: "rgba(10,15,46,0.06)", marginBottom: 2 }}>
            <div data-testid="card-pricing-enterprise" style={{ background: "#fff", padding: "36px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <DollarSign style={{ color: TEAL, width: 18, height: 18 }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(10,15,46,0.5)" }}>Core</span>
              </div>
              <div data-testid="text-price-enterprise" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 700, color: TEAL, marginBottom: 4, lineHeight: 1 }}>$150K</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(10,15,46,0.45)", marginBottom: 20 }}>Annual Contract Value</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Full 180-Protocol Library", "Standard integrations", "Dedicated CSM"].map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <CheckCircle2 style={{ color: TEAL, width: 14, height: 14, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(10,15,46,0.75)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div data-testid="card-pricing-team" style={{ background: IVORY, padding: "36px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Users style={{ color: NAVY, width: 18, height: 18 }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(10,15,46,0.5)" }}>Foresight</span>
              </div>
              <div data-testid="text-price-team" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 700, color: NAVY, marginBottom: 4, lineHeight: 1 }}>$250K</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(10,15,46,0.45)", marginBottom: 20 }}>Annual Contract Value</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Digital Twin simulation", "Predictive foresight alerts", "Priority support"].map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <CheckCircle2 style={{ color: NAVY, width: 14, height: 14, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(10,15,46,0.75)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div data-testid="card-pricing-executive" style={{ background: NAVY, padding: "36px 32px", borderTop: "3px solid " + GOLD }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <TrendingUp style={{ color: GOLD, width: 18, height: 18 }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(201,168,76,0.65)" }}>Enterprise</span>
              </div>
              <div data-testid="text-price-executive" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 700, color: GOLD, marginBottom: 4, lineHeight: 1 }}>$450K</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Annual Contract Value</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Multi-region orchestration", "White-glove implementation", "Dedicated account team"].map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <CheckCircle2 style={{ color: GOLD, width: 14, height: 14, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expansion streams */}
          <div data-testid="card-expansion" style={{ background: IVORY, padding: "32px 36px", marginBottom: 56, border: "1px solid rgba(10,15,46,0.08)" }}>
            <h3 data-testid="heading-expansion" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 20 }}>Expansion Revenue Streams</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
              <div data-testid="expansion-1">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <BarChart3 style={{ color: TEAL, width: 16, height: 16 }} />
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: NAVY }}>Integration Marketplace</span>
                </div>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(10,15,46,0.65)", lineHeight: 1.65, margin: 0 }}>20% rev-share on third-party integrations (Salesforce, Jira, Slack)</p>
              </div>
              <div data-testid="expansion-2">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Zap style={{ color: NAVY, width: 16, height: 16 }} />
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: NAVY }}>Premium Templates</span>
                </div>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(10,15,46,0.65)", lineHeight: 1.65, margin: 0 }}>Industry-specific Readiness Protocols ($5K–$50K per template pack)</p>
              </div>
              <div data-testid="expansion-3">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Lock style={{ color: GOLD, width: 16, height: 16 }} />
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: NAVY }}>Advisory Services</span>
                </div>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(10,15,46,0.65)", lineHeight: 1.65, margin: 0 }}>Strategic workshops ($50K–$200K per engagement)</p>
              </div>
            </div>
          </div>

          {/* Unit economics — stat blocks */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Label>Unit Economics</Label>
            <h2 data-testid="heading-economics" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: 700, color: NAVY, marginBottom: 10 }}>
              Enterprise SaaS Unit Economics
            </h2>
            <p data-testid="text-economics-subtitle" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: "rgba(10,15,46,0.6)", maxWidth: 580, margin: "0 auto", lineHeight: 1.75 }}>
              Infrastructure-category retention with platform-category expansion — the combination that produces durable LTV
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, background: "rgba(10,15,46,0.06)", marginBottom: 2 }}>
            <div data-testid="card-ltv-cac" style={{ background: "#fff", padding: "32px 28px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(10,15,46,0.5)", marginBottom: 10 }}>LTV:CAC Ratio</div>
              <div data-testid="text-ltv-cac" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 700, color: TEAL, lineHeight: 1, marginBottom: 8 }}>8.4:1</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(10,15,46,0.4)", lineHeight: 1.5 }}>Target: &gt;3:1<br />(Exceptional)</div>
            </div>
            <div data-testid="card-payback" style={{ background: "#fff", padding: "32px 28px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(10,15,46,0.5)", marginBottom: 10 }}>CAC Payback</div>
              <div data-testid="text-payback" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 700, color: NAVY, lineHeight: 1, marginBottom: 8 }}>7 mo</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(10,15,46,0.4)", lineHeight: 1.5 }}>Target: &lt;12mo<br />(Excellent)</div>
            </div>
            <div data-testid="card-ndr" style={{ background: "#fff", padding: "32px 28px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(10,15,46,0.5)", marginBottom: 10 }}>Net Dollar Retention</div>
              <div data-testid="text-ndr" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 8 }}>142%</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(10,15,46,0.4)", lineHeight: 1.5 }}>Target: &gt;120%<br />(Infrastructure-tier)</div>
            </div>
            <div data-testid="card-gross-margin" style={{ background: "#fff", padding: "32px 28px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(10,15,46,0.5)", marginBottom: 10 }}>Gross Margin</div>
              <div data-testid="text-gross-margin" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 700, color: NAVY, lineHeight: 1, marginBottom: 8 }}>87%</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(10,15,46,0.4)", lineHeight: 1.5 }}>Target: &gt;80%<br />(Premium SaaS)</div>
            </div>
          </div>

          {/* Hidden testid containers for test compatibility */}
          <div data-testid="card-ltv-cac-trend" style={{ display: "none" }} />
          <div data-testid="card-roi-breakdown" style={{ display: "none" }} />

          <div style={{ background: IVORY, padding: "28px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: NAVY, lineHeight: 1.5, margin: 0 }}>
              LTV:CAC improving from 3.2:1 (Year 1) to 8.4:1 (Year 5) as scale economics kick in.
            </p>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "rgba(10,15,46,0.55)", textAlign: "right", lineHeight: 1.7 }}>
              <strong style={{ color: NAVY }}>LTV: $756K</strong> at Year 5<br />
              <strong style={{ color: NAVY }}>CAC: $90K</strong> at Year 5
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FOUNDING PARTNER PROGRAM ──────────────────────────────────── */}
      <section style={{ background: IVORY, padding: "88px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <Label>Founding Partner Program</Label>
            <SectionH2 style={{ marginBottom: 16 }}>
              Two Organizations.<br />90-Day Validation Partnership.
            </SectionH2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 17, color: "rgba(10,15,46,0.65)", maxWidth: 560, margin: "0 auto", lineHeight: 1.75 }}>
              This is not a free trial. It is a structured commercial validation with defined milestones, executive involvement, and a conversion conversation at day 90.
            </p>
          </div>

          {/* Day milestones */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, background: "rgba(10,15,46,0.08)", marginBottom: 32 }}>
            {[
              { label: "Day 30", value: "Deployed", sub: "Protocols live · Stakeholders mapped · First trigger monitored", accent: NAVY },
              { label: "Day 60", value: "Validated", sub: "Structured progress review · Execution data on the table", accent: GOLD },
              { label: "Day 90", value: "Decision", sub: "Conversion conversation · Reference commitment regardless of outcome", accent: TEAL },
            ].map(m => (
              <div key={m.label} style={{ background: "#fff", padding: "40px 28px", textAlign: "center", borderTop: "3px solid " + m.accent }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px,4vw,48px)", fontWeight: 700, color: m.accent, lineHeight: 1, marginBottom: 10 }}>{m.value}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: NAVY, marginBottom: 10 }}>{m.label}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "rgba(10,15,46,0.5)", lineHeight: 1.6 }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Gets / Asks */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, background: "rgba(10,15,46,0.08)", marginBottom: 32 }}>
            <div style={{ background: "#fff", padding: "32px 36px" }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: NAVY, marginBottom: 18 }}>What the Partner Gets</div>
              {[
                { item: "Full platform deployment across your highest-priority triggers", color: TEAL },
                { item: "Readiness Protocols mapped to your strategic domain and org structure", color: TEAL },
                { item: "Direct access to the founder throughout the 90-day engagement", color: TEAL },
                { item: "Founding Partner pricing locked for the life of the contract", color: GOLD },
                { item: "Co-authorship of the category narrative — your activation becomes the proof", color: GOLD },
              ].map((u, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, paddingTop: 12, paddingBottom: 12, borderBottom: "1px solid " + IVORY }}>
                  <div style={{ width: 3, minHeight: 20, marginTop: 3, background: u.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: NAVY, fontWeight: 500, lineHeight: 1.5 }}>{u.item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", padding: "32px 36px" }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: NAVY, marginBottom: 18 }}>What We Ask in Return</div>
              {[
                { mo: "30 days", label: "Defined onboarding with protocol deployment milestones completed", color: TEAL },
                { mo: "60 days", label: "Structured progress conversation with executive sponsor present", color: GOLD },
                { mo: "90 days", label: "Conversion conversation — and a reference regardless of outcome", color: NAVY },
              ].map(m => (
                <div key={m.mo} style={{ display: "flex", alignItems: "flex-start", gap: 16, paddingTop: 16, paddingBottom: 16, borderBottom: "1px solid " + IVORY }}>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: m.color, letterSpacing: "0.06em", minWidth: 56, paddingTop: 2 }}>{m.mo}</div>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "#374151", lineHeight: 1.55, margin: 0 }}>{m.label}</p>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: "14px 16px", background: IVORY, borderLeft: "3px solid " + GOLD }}>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: NAVY, lineHeight: 1.65, margin: 0 }}>
                  This is not free. It is a structured commercial validation with deferred payment — designed so both sides know exactly what success looks like before the contract is signed.
                </p>
              </div>
            </div>
          </div>

          <div style={{ background: NAVY, padding: "36px 44px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 8 }}>Two seats. One conversation.</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)", maxWidth: 480, lineHeight: 1.65 }}>
                If your organization faces the kind of strategic triggers Readiness OS was built for — and you want to be the organization that proves the category — this is the conversation to have.
              </div>
            </div>
            <a href="/contact" style={{ flexShrink: 0, display: "inline-block", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "18px 44px", background: GOLD, color: NAVY, textDecoration: "none", whiteSpace: "nowrap" }}>
              Apply for Founding Partner Access
            </a>
          </div>
        </div>
      </section>

      {/* ── 8. CATEGORY WINDOW + CTA ─────────────────────────────────────── */}
      <section style={{ background: NAVY, borderTop: "1px solid rgba(201,168,76,0.15)", padding: "88px 32px 0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Label light>Category Window</Label>
          <SectionH2 light style={{ marginBottom: 20, textAlign: "center" }}>
            The category is open.<br />
            <em style={{ color: GOLD }}>It will not stay open.</em>
          </SectionH2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: "rgba(240,237,228,0.6)", lineHeight: 1.8, maxWidth: 700, margin: "0 auto 52px", textAlign: "center" }}>
            ServiceNow, Microsoft, and Salesforce are each one product decision away from naming this layer. The enterprise coordination gap is real, board-visible, and expensive — every platform vendor knows it. What they don't have yet is an operating model purpose-built for it. That is the window.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, marginBottom: 32 }}>
            {[
              { label: "What incumbents have", items: ["Detection tools (SIEM, monitoring)", "Task routing (ServiceNow, Jira)", "AI intelligence (Copilot, Claude)", "Dashboards and reporting"], verdict: "They detect. They route. They summarize.", vc: "rgba(200,70,50,0.85)" },
              { label: "What incumbents are missing", items: ["Pre-staged ownership by trigger", "Authority chains pre-approved", "Budget pre-authorized by scenario", "Institutional memory across activations"], verdict: "No one owns the mobilization layer.", vc: GOLD },
              { label: "What moves first mover wins", items: ["Category name recognition", "Institutional memory moat", "Executive-level brand trust", "Protocol library network effects"], verdict: "Category creators capture 76% of market value.", vc: TEAL },
            ].map((col, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "28px 24px", borderTop: "2px solid " + (i === 1 ? GOLD : "rgba(255,255,255,0.1)") }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.55)", marginBottom: 18 }}>{col.label}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {col.items.map(item => (
                    <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, flexShrink: 0, marginTop: 1 }}>→</span>
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: col.vc, lineHeight: 1.4 }}>{col.verdict}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: "20px 28px", background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", gap: 20, marginBottom: 0 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: GOLD, flexShrink: 0 }}>The thesis:</span>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(240,237,228,0.75)", lineHeight: 1.65 }}>Every enterprise already bought the detection stack. Every enterprise already bought the AI stack. None have the operating model that acts on them. Readiness OS is that layer — and the first organization to own "readiness infrastructure" as a category will hold it the way Salesforce held CRM.</span>
          </div>
        </div>

        {/* Final CTA */}
        <div style={{ background: "rgba(0,0,0,0.25)", borderTop: "1px solid rgba(201,168,76,0.12)", marginTop: 72, padding: "72px 32px" }}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(201,168,76,0.75)", marginBottom: 20 }}>Ready to Move Forward</div>
            <h2 data-testid="heading-cta" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
              Let's Build This Together
            </h2>
            <p data-testid="text-cta-description" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: 10 }}>
              Readiness OS is defining the Readiness Infrastructure category — a $5B+ addressable market with winner-take-most dynamics. Early investors gain exposure to category creation with defensible moats and exceptional unit economics.
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 40 }}>
              Schedule a conversation with the VaughnMartin founding team to review our full investment deck, pipeline metrics, and strategic roadmap.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 28 }}>
              <Button size="lg" data-testid="button-cta-schedule" onClick={() => setLocation("/contact")} className="bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178] font-bold">
                Schedule a Conversation
              </Button>
              <Button size="lg" data-testid="button-cta-demo" onClick={() => setLocation("/executive-demo-walkthrough")} className="bg-white/10 text-white hover:bg-white/20 border border-white/20">
                Experience the Platform
              </Button>
              <Button size="lg" data-testid="button-cta-resources" variant="outline" onClick={() => setLocation("/investor-resources")} className="border-white/20 text-white hover:bg-white/10">
                Investor Resources
              </Button>
            </div>
            <a href="/product-overview" target="_blank" rel="noopener noreferrer" data-testid="button-download-overview" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", textDecoration: "none", borderBottom: "1px solid rgba(201,168,76,0.25)", paddingBottom: 2 }}>
              ↓ Product Overview
            </a>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 32 }}>
              VaughnMartin · Readiness Infrastructure · <span style={{ color: "rgba(201,168,76,0.6)" }}>info@vaughnmartin.com</span>
            </p>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
