import { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";
const BORDER  = "#E2DDD5";

const GEO: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const BAR: React.CSSProperties = { fontFamily: "'Barlow', 'Barlow Condensed', sans-serif" };
const BRC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const STACK_LAYERS = [
  {
    num: "5",
    label: "Business Impact Layer",
    sub: "Where AI creates measurable value",
    items: ["Operations", "Customer Experience", "Employees & Productivity", "Strategy & Decision Making", "New Business Models"],
    readinessRole: "Primary deployment layer. Readiness OS delivers measurable Business Impact specifically in Strategy & Decision Making and Operations — the two domains where 30-day alignment cycles cause the most financial damage.",
    readinessItems: ["170 cross-industry Readiness Protocols", "221 pre-mapped trigger scenarios", "12-minute mobilization vs. 30-day baseline", "3,600× execution head start"],
    highlight: true,
    color: GOLD,
    badge: "PRIMARY LAYER",
    badgeBg: "rgba(201,168,76,0.15)",
    badgeBorder: "rgba(201,168,76,0.4)",
  },
  {
    num: "4",
    label: "Agent Layer",
    sub: "Intelligent agents that execute and orchestrate work",
    items: ["AI Employees (Digital Workers)", "Workflow Agents", "Voice Agents", "Multi-Agent Systems", "Autonomous Workflows"],
    readinessRole: "Orchestration layer. Readiness OS directs when agents fire, what they execute, and who must authorize — turning generic autonomous agents into governed, pre-staged execution instruments.",
    readinessItems: ["8-tier signal evaluation pipeline", "IDEA Framework: IDENTIFY → DETECT → AUTHORIZE → EXECUTE → ADVANCE", "Parallel tier execution (Tiers 6/7/8 concurrent)", "ConsequencePreview with Stand Down authority"],
    highlight: false,
    color: TEAL,
    badge: "ORCHESTRATION",
    badgeBg: "rgba(43,138,110,0.1)",
    badgeBorder: "rgba(43,138,110,0.35)",
  },
  {
    num: "3",
    label: "Intelligence Layer",
    sub: "Context, memory and knowledge that power intelligence",
    items: ["RAG (Retrieval)", "Vector Databases", "Memory (Short & Long Term)", "Knowledge Graphs", "Context Orchestration"],
    readinessRole: "Signal intelligence layer. Continuous monitoring of 39 live feeds scored against 221 trigger patterns, with semantic embedding-based similarity scoring augmenting keyword evaluation. Activation history forms the long-term institutional memory layer.",
    readinessItems: ["39 pre-configured signal sources, every 15 minutes", "221 trigger patterns — keyword + semantic embedding scoring", "Semantic similarity via text-embedding-3-small cosine match", "Institutional memory: activation records, debriefs, outcome data"],
    highlight: false,
    color: TEAL,
    badge: "INTELLIGENCE",
    badgeBg: "rgba(43,138,110,0.1)",
    badgeBorder: "rgba(43,138,110,0.35)",
  },
  {
    num: "2",
    label: "Model Layer",
    sub: "The brain: Models that understand and generate",
    items: ["Proprietary Models", "Open Source Models", "Small Language Models (SLMs)", "Multimodal Models", "Fine-Tuned Models"],
    readinessRole: "Azure OpenAI primary with OpenAI fallback. Used for executive summaries, signal narrative generation, risk assessment, and protocol recommendations across the IDEA Framework.",
    readinessItems: ["Azure OpenAI — primary (enterprise-native)", "OpenAI — automatic fallback", "Multi-agent parallel inference across IDEA phases", "Prompt-engineered for executive-grade output"],
    highlight: false,
    color: "rgba(10,15,46,0.25)",
    badge: "LEVERAGED",
    badgeBg: "rgba(10,15,46,0.05)",
    badgeBorder: "rgba(10,15,46,0.15)",
  },
  {
    num: "1",
    label: "Infrastructure Layer",
    sub: "The foundation that makes everything run",
    items: ["Cloud (AWS, Azure, GCP)", "GPUs / TPUs & Accelerators", "Edge Devices & IoT", "Data Centers & On-Prem", "AI PCs & On-Device AI"],
    readinessRole: "Azure cloud infrastructure — deliberate alignment with the enterprise Microsoft investment. Neon serverless PostgreSQL with no cold-start latency. TLS 1.2+ on all API and WebSocket connections.",
    readinessItems: ["Azure (OpenAI endpoint, enterprise-native)", "Neon serverless PostgreSQL", "Socket.IO real-time WebSocket", "OIDC / SSO authentication"],
    highlight: false,
    color: "rgba(10,15,46,0.25)",
    badge: "ALIGNED",
    badgeBg: "rgba(10,15,46,0.05)",
    badgeBorder: "rgba(10,15,46,0.15)",
  },
];

const GAP_ITEMS = [
  {
    label: "Every enterprise has Layers 1–4",
    desc: "Cloud, models, RAG pipelines, and Copilot agents are becoming table stakes. Within 24 months, these will be as commoditized as email.",
    icon: "✓",
    color: "rgba(43,138,110,0.7)",
  },
  {
    label: "None have the Layer 4 → 5 bridge",
    desc: "Agents can act. But which action? Authorized by whom? Using which pre-staged plan? Against which budget? The operating model gap is structural — it doesn't close with more infrastructure.",
    icon: "✗",
    color: "rgba(201,168,76,0.8)",
  },
  {
    label: "Readiness OS is that bridge",
    desc: "Pre-staged Readiness Protocols replace real-time coordination. Pattern detection replaces committee deliberation. 12-minute execution replaces 30-day alignment cycles. The response is ready before the trigger fires.",
    icon: "→",
    color: GOLD,
  },
];

const CROSS_CUTTING = [
  { label: "Data Quality & Governance", desc: "Org-scoped queries, allowlist access control, immutable activation records", present: true },
  { label: "Security & Privacy", desc: "OIDC / SSO, RBAC with requireRole(), fail-closed on errors, TLS 1.2+", present: true },
  { label: "Observability & Monitoring", desc: "Signal activity log, real-time detection feed, execution timeline with T+0 clock", present: true },
  { label: "Evaluation & Guardrails", desc: "ConsequencePreview gate, Stand Down option, Close-Out governance verdict", present: true },
  { label: "Human in the Loop", desc: "No Readiness Protocol activates without executive sign-off. AI monitors, executives authorize.", present: true, highlight: true },
  { label: "Prompting & Fine-Tuning", desc: "Executive-grade prompt engineering. Domain fine-tuning planned for Founding Partner data.", present: false },
];

export default function AIStackPositioning() {
  useEffect(() => {
    updatePageMetadata({
      title: "Enterprise AI Stack Positioning — VaughnMartin Readiness OS",
      description: "Where Readiness OS fits in the 2026 Enterprise AI Stack — the operating model layer between Agent Layer and Business Impact that every enterprise is missing.",
    });
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ background: NAVY, padding: "88px 32px 72px", textAlign: "center" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 1, background: `rgba(201,168,76,0.4)` }} />
            <span style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(201,168,76,0.75)" }}>Enterprise AI Stack · 2026</span>
            <div style={{ width: 40, height: 1, background: `rgba(201,168,76,0.4)` }} />
          </div>
          <h1 style={{ ...GEO, fontSize: "clamp(34px,5vw,60px)", fontWeight: 700, color: "#fff", lineHeight: 1.08, marginBottom: 24 }}>
            Every enterprise has<br />
            <em style={{ color: GOLD }}>Layers 1 through 4.</em><br />
            None have what comes next.
          </h1>
          <p style={{ ...BAR, fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, maxWidth: 640, margin: "0 auto 40px" }}>
            The 2026 Enterprise AI Stack describes the infrastructure every organization is building. Readiness OS is not another layer in that stack — it is the operating model that makes Layer 5 executable.
          </p>
          <div style={{ display: "inline-flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
            {["Layer 5 operating model", "180 Readiness Protocols", "12-minute execution", "Human-authorized"].map(tag => (
              <span key={tag} style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", padding: "6px 16px", border: "1px solid rgba(201,168,76,0.18)", background: "rgba(201,168,76,0.04)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* The gap — three-panel callout */}
      <div style={{ background: IVORY, padding: "64px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
            {GAP_ITEMS.map((item, i) => (
              <div key={i} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderTop: `3px solid ${item.color}`, padding: "28px 24px" }}>
                <div style={{ fontSize: 20, color: item.color, marginBottom: 12, fontWeight: 700 }}>{item.icon}</div>
                <div style={{ ...BAR, fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 10, lineHeight: 1.4 }}>{item.label}</div>
                <div style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.6)", lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stack layer breakdown */}
      <div style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>Layer by Layer</div>
            <h2 style={{ ...GEO, fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 600, color: NAVY, marginBottom: 12 }}>How Readiness OS maps to each layer</h2>
            <p style={{ ...BAR, fontSize: 14, color: "rgba(10,15,46,0.5)", lineHeight: 1.75, maxWidth: 600 }}>
              Readiness OS is not a replacement for any layer. It orchestrates across all five — using the infrastructure enterprises already have.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {STACK_LAYERS.map((layer, i) => (
              <div key={i} style={{
                border: `1px solid ${layer.highlight ? "rgba(201,168,76,0.35)" : BORDER}`,
                borderLeft: `4px solid ${layer.color}`,
                background: layer.highlight ? "rgba(201,168,76,0.03)" : "#fff",
                overflow: "hidden",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0 }}>
                  {/* Left: stack context */}
                  <div style={{ padding: "28px 28px", borderRight: `1px solid ${BORDER}`, background: layer.highlight ? "rgba(201,168,76,0.05)" : "rgba(10,15,46,0.02)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ ...GEO, fontSize: 28, fontWeight: 700, color: layer.highlight ? GOLD : "rgba(10,15,46,0.2)" }}>{layer.num}</span>
                      <div>
                        <div style={{ ...BAR, fontSize: 12, fontWeight: 700, color: layer.highlight ? NAVY : "rgba(10,15,46,0.6)" }}>{layer.label}</div>
                        <span style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "2px 7px", background: layer.badgeBg, border: `1px solid ${layer.badgeBorder}`, color: layer.highlight ? GOLD : "rgba(10,15,46,0.4)" }}>
                          {layer.badge}
                        </span>
                      </div>
                    </div>
                    <div style={{ ...BAR, fontSize: 10, color: "rgba(10,15,46,0.4)", marginBottom: 12, fontStyle: "italic" }}>{layer.sub}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {layer.items.map(item => (
                        <span key={item} style={{ ...BRC, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", background: "rgba(10,15,46,0.04)", border: "1px solid rgba(10,15,46,0.08)", padding: "3px 8px" }}>{item}</span>
                      ))}
                    </div>
                  </div>
                  {/* Right: Readiness OS role */}
                  <div style={{ padding: "28px 32px" }}>
                    <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: layer.highlight ? GOLD : TEAL, marginBottom: 10 }}>Readiness OS at this layer</div>
                    <p style={{ ...BAR, fontSize: 13, color: "rgba(10,15,46,0.65)", lineHeight: 1.75, marginBottom: 18 }}>{layer.readinessRole}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {layer.readinessItems.map(item => (
                        <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <span style={{ color: layer.highlight ? GOLD : TEAL, fontSize: 10, flexShrink: 0, paddingTop: 3 }}>▸</span>
                          <span style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.7)", lineHeight: 1.6 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-cutting foundations */}
      <div style={{ background: IVORY, padding: "72px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>Cross-Cutting Foundations</div>
            <h2 style={{ ...GEO, fontSize: "clamp(24px,3vw,38px)", fontWeight: 600, color: NAVY, marginBottom: 10 }}>Every layer depends on these</h2>
            <p style={{ ...BAR, fontSize: 14, color: "rgba(10,15,46,0.5)", lineHeight: 1.7, maxWidth: 560 }}>
              The 2026 stack identifies six foundations required at every level. Readiness OS is fully implemented on five of them — and uniquely strong on the one that matters most.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
            {CROSS_CUTTING.map((item, i) => (
              <div key={i} style={{
                background: item.highlight ? "rgba(201,168,76,0.06)" : "#fff",
                border: `1px solid ${item.highlight ? "rgba(201,168,76,0.3)" : BORDER}`,
                borderTop: `3px solid ${item.present ? (item.highlight ? GOLD : TEAL) : "rgba(10,15,46,0.15)"}`,
                padding: "24px 22px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ ...BAR, fontSize: 12, fontWeight: 700, color: item.highlight ? NAVY : "rgba(10,15,46,0.7)", lineHeight: 1.35 }}>{item.label}</div>
                  <span style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", flexShrink: 0, marginLeft: 8, padding: "2px 7px",
                    background: item.present ? (item.highlight ? "rgba(201,168,76,0.15)" : "rgba(43,138,110,0.1)") : "rgba(10,15,46,0.05)",
                    color: item.present ? (item.highlight ? GOLD : TEAL) : "rgba(10,15,46,0.3)",
                    border: `1px solid ${item.present ? (item.highlight ? "rgba(201,168,76,0.3)" : "rgba(43,138,110,0.3)") : "rgba(10,15,46,0.1)"}`,
                  }}>
                    {item.present ? "BUILT" : "ROADMAP"}
                  </span>
                </div>
                <div style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.55)", lineHeight: 1.65 }}>{item.desc}</div>
                {item.highlight && (
                  <div style={{ marginTop: 12, ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD }}>
                    Core architectural differentiator
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Agent Controls — Customer Questions */}
      <div style={{ background: "#fff", padding: "80px 32px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>Enterprise AI Agent Controls</div>
            <h2 style={{ ...GEO, fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 600, color: NAVY, marginBottom: 12 }}>Questions every enterprise buyer is asking</h2>
            <p style={{ ...BAR, fontSize: 14, color: "rgba(10,15,46,0.5)", lineHeight: 1.75, maxWidth: 620 }}>
              As AI agents scale across organizations, three questions have become standard in every procurement conversation. Here is exactly how Readiness OS answers them.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
            {[
              {
                q: "What is your human-in-the-loop model?",
                color: GOLD,
                badge: "HUMAN-IN-THE-LOOP",
                badgeBg: "rgba(201,168,76,0.1)",
                badgeBorder: "rgba(201,168,76,0.3)",
                answer: "Every Readiness Protocol requires explicit executive sign-off before execution begins. The system detects the trigger, selects the protocol, stages the response, and delivers an authorization request — but nothing executes until a designated executive approves. Budget does not unlock. Tasks do not seed. Stakeholders are not notified. The human decision is not optional and cannot be bypassed.",
                highlight: true,
              },
              {
                q: "What guardrails are in place?",
                color: TEAL,
                badge: "GUARDRAILS",
                badgeBg: "rgba(43,138,110,0.1)",
                badgeBorder: "rgba(43,138,110,0.3)",
                answer: "Three layers. First, ConsequencePreview — before any executive authorizes, the platform displays a full impact summary: tasks that will be seeded, budget that will be released, stakeholders who will be notified. Second, Stand Down authority — any executive can halt execution at any point before or during a response. Third, fail-closed authorization — any error in role validation or permissions defaults to deny, never permit.",
                highlight: false,
              },
              {
                q: "How does orchestration work?",
                color: TEAL,
                badge: "ORCHESTRATION",
                badgeBg: "rgba(43,138,110,0.1)",
                badgeBorder: "rgba(43,138,110,0.3)",
                answer: "The IDEA Framework routes every signal through five stages: IDENTIFY the threat category, DETECT the matching trigger pattern, present for executive AUTHORIZATION, EXECUTE the pre-staged protocol, and ADVANCE with a structured debrief. Each stage is pre-built — the orchestration runs in the background continuously, so when a trigger fires, the routing is already complete. Execution takes 12 minutes because the coordination happened before the crisis.",
                highlight: false,
              },
            ].map((item, i) => (
              <div key={i} style={{
                background: item.highlight ? "rgba(201,168,76,0.03)" : "#fff",
                border: `1px solid ${item.highlight ? "rgba(201,168,76,0.3)" : BORDER}`,
                borderTop: `3px solid ${item.color}`,
                padding: "28px 26px",
              }}>
                <span style={{ ...BRC, display: "inline-block", fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, padding: "3px 8px", background: item.badgeBg, border: `1px solid ${item.badgeBorder}`, color: item.color, marginBottom: 14 }}>{item.badge}</span>
                <div style={{ ...GEO, fontSize: 16, fontWeight: 600, color: NAVY, marginBottom: 14, lineHeight: 1.35 }}>{item.q}</div>
                <div style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.6)", lineHeight: 1.75 }}>{item.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The Microsoft framing */}
      <div style={{ background: NAVY, padding: "72px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <div style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", marginBottom: 20 }}>The Microsoft Framing</div>
          <blockquote style={{ ...GEO, fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 600, color: "#fff", lineHeight: 1.35, margin: "0 auto 28px", maxWidth: 760, fontStyle: "italic" }}>
            "Every enterprise has Microsoft's AI stack.<br />None have the operating model to use it."
          </blockquote>
          <p style={{ ...BAR, fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 640, margin: "0 auto 48px" }}>
            Copilot surfaces insights. Azure OpenAI processes language. Microsoft Fabric moves data. None of these tools tell the organization what to do when the trigger fires, who must authorize it, or which of 170 pre-staged responses is the right one. Readiness OS is the decision layer that sits above the Microsoft investment and makes it executable in 12 minutes.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, maxWidth: 720, margin: "0 auto 48px" }}>
            {[
              { label: "Old model", value: "30 days", sub: "Committee → alignment → mobilization → execution" },
              { label: "With Readiness OS", value: "12 minutes", sub: "Trigger → protocol → authorized → executed" },
              { label: "Execution head start", value: "3,600×", sub: "30 days vs. 12 minutes" },
            ].map((stat, i) => (
              <div key={i} style={{ padding: "24px 20px", border: `1px solid rgba(255,255,255,0.08)`, background: i === 1 ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)" }}>
                <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>{stat.label}</div>
                <div style={{ ...GEO, fontSize: 28, fontWeight: 700, color: i === 1 ? GOLD : "#fff", marginBottom: 8 }}>{stat.value}</div>
                <div style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.55 }}>{stat.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/contact" style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", background: GOLD, color: NAVY, padding: "14px 32px", textDecoration: "none" }}>
              Apply for Founding Partner Access
            </a>
            <a href="/technical-architecture" style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", padding: "14px 32px", border: "1px solid rgba(255,255,255,0.15)", textDecoration: "none" }}>
              Technical Architecture →
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
