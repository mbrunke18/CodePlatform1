import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const DM = { fontFamily: "'Barlow Condensed', sans-serif" } as const;
const CG = { fontFamily: "'Cormorant Garamond', Georgia, serif" } as const;

const PARTNER_TYPES = [
  {
    title: "Management Consulting Firms",
    desc: "Bring a 12-minute execution capability to your enterprise transformation engagements. Readiness OS becomes your client's operating model — you become the firm that changed how they work.",
    fit: "Strategy, Operations, Risk",
  },
  {
    title: "Systems Integrators",
    desc: "Layer Readiness OS on top of Microsoft, SAP, Workday, or ServiceNow implementations. Your clients already have the data — we give them the pre-staged response capability that puts it to work before a trigger fires.",
    fit: "Microsoft · SAP · Workday · ServiceNow",
  },
  {
    title: "Executive Advisory Firms",
    desc: "Give your C-suite clients a platform that operates at the speed they need to make decisions. 180 protocols pre-staged. Authorization preserved. You help them use it at the moment that matters.",
    fit: "C-Suite Advisory · Board Services",
  },
  {
    title: "Risk & Resilience Specialists",
    desc: "Stop delivering playbooks that sit in folders. Deliver a live operating infrastructure that activates the moment a trigger fires — with your firm's expertise baked into every protocol.",
    fit: "Enterprise Risk · BCM · Crisis Management",
  },
];

const WHAT_PARTNERS_GET = [
  "Access to 180 pre-staged Readiness Protocols across all 3 strategic domains",
  "Co-delivery model — your expertise, our execution infrastructure",
  "Dedicated partner demo environment and industry scenario library",
  "Preferred partner economics — structured directly with the founder",
  "Executive briefing materials and client-ready proof assets",
  "Early access to new protocol packs and vertical expansions",
  "Named in Readiness OS partner directory — visible to enterprise buyers",
];

export default function ChannelPartners() {
  const [, setLocation] = useLocation();

  return (
    <PageLayout>
      <div style={{ background: NAVY, minHeight: "100vh" }}>

        {/* Hero */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 40px 72px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, padding: "5px 14px", border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.07)" }}>
            <div style={{ width: 5, height: 5, background: GOLD, flexShrink: 0 }} />
            <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: GOLD }}>Channel Partner Program</span>
          </div>

          <h1 style={{ ...CG, fontSize: "clamp(40px,4vw,60px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 12px" }}>
            Deliver the Operating Model
          </h1>
          <h2 style={{ ...CG, fontSize: "clamp(40px,4vw,60px)", fontWeight: 700, color: GOLD, lineHeight: 1.1, margin: "0 0 32px" }}>
            Your Clients Are Missing.
          </h2>

          <p style={{ ...DM, fontSize: 18, color: "rgba(255,255,255,0.88)", lineHeight: 1.7, maxWidth: 680, margin: "0 0 16px" }}>
            Enterprise work was designed for a world without AI — committees, alignment cycles, and coordination delays. Your clients know this. Now there's an infrastructure that eliminates it. Readiness OS is the channel opportunity behind your next decade of enterprise engagements.
          </p>
          <p style={{ ...DM, fontSize: 16, color: GOLD, fontWeight: 700, margin: "0 0 48px" }}>
            The response is ready before the trigger fires. You help them deploy it.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
            <button
              onClick={() => setLocation("/request-access")}
              style={{ ...DM, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13, padding: "16px 36px", border: "none", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase" as const }}
            >
              Apply for Partner Access →
            </button>
            <button
              onClick={() => setLocation("/demo-hub")}
              style={{ ...DM, background: "transparent", color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 13, padding: "16px 36px", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" as const }}
            >
              See the Full Platform Demo
            </button>
          </div>
        </div>

        {/* Who this is for */}
        <div style={{ borderTop: "1px solid rgba(201,168,76,0.12)", background: "rgba(255,255,255,0.025)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "72px 40px" }}>
            <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase" as const, marginBottom: 40 }}>
              — Who this is for
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 24 }}>
              {PARTNER_TYPES.map((p) => (
                <div key={p.title} style={{ padding: "28px 32px", border: "1px solid rgba(201,168,76,0.15)", background: "rgba(10,15,46,0.6)" }}>
                  <div style={{ ...DM, fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: "0.16em", textTransform: "uppercase" as const, marginBottom: 10 }}>{p.fit}</div>
                  <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 14 }}>{p.title}</div>
                  <p style={{ ...DM, fontSize: 15, color: "rgba(255,255,255,0.72)", lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What partners get */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "72px 40px" }}>
          <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase" as const, marginBottom: 40 }}>
            — What partners receive
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
            {WHAT_PARTNERS_GET.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 20px", background: "rgba(43,138,110,0.06)", border: "1px solid rgba(43,138,110,0.18)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0, marginTop: 6 }} />
                <span style={{ ...DM, fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The model */}
        <div style={{ borderTop: "1px solid rgba(201,168,76,0.12)", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "72px 40px" }}>
            <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase" as const, marginBottom: 32 }}>
              — The model
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, border: "1px solid rgba(201,168,76,0.18)", marginBottom: 48 }}>
              {[
                { label: "Your expertise", desc: "Industry knowledge, client relationships, and change management capability." },
                { label: "Our infrastructure", desc: "180 pre-staged protocols, 231 detection thresholds, 12-minute execution standard." },
                { label: "Client outcome", desc: "An enterprise that responds to any situation in 12 minutes — every time." },
              ].map((col, i, arr) => (
                <div key={col.label} style={{ padding: "32px 28px", borderRight: i < arr.length - 1 ? "1px solid rgba(201,168,76,0.12)" : "none" }}>
                  <div style={{ ...DM, fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 12 }}>{col.label}</div>
                  <p style={{ ...DM, fontSize: 15, color: "rgba(255,255,255,0.72)", lineHeight: 1.6, margin: 0 }}>{col.desc}</p>
                </div>
              ))}
            </div>

            {/* Built on its own platform note */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "20px 24px", background: "rgba(43,138,110,0.08)", borderLeft: `3px solid ${TEAL}`, marginBottom: 48 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0, marginTop: 7 }} />
              <div>
                <div style={{ ...DM, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.95)", marginBottom: 6 }}>VaughnMartin runs on its own platform.</div>
                <p style={{ ...DM, fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.6, margin: 0 }}>
                  Every operational situation VaughnMartin faces is handled using Readiness OS — the same 180 protocols, the same 12-minute standard, the same execution chain you'll deliver to your clients. We don't sell a platform we don't use.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA close */}
        <div style={{ borderTop: "1px solid rgba(201,168,76,0.15)", background: "rgba(201,168,76,0.04)" }}>
          <div style={{ maxWidth: 700, margin: "0 auto", padding: "72px 40px", textAlign: "center" as const }}>
            <h3 style={{ ...CG, fontSize: "clamp(32px,3vw,44px)", fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>
              Ready to bring this to your clients?
            </h3>
            <p style={{ ...DM, fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, margin: "0 0 40px" }}>
              We're currently onboarding a small cohort of Founding Partners — consulting firms, systems integrators, and advisory practices who want to be first to deploy the Readiness Infrastructure in their enterprise engagements.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" as const }}>
              <button
                onClick={() => setLocation("/request-access")}
                style={{ ...DM, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13, padding: "18px 40px", border: "none", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase" as const }}
              >
                Apply for Founding Partner Access →
              </button>
              <button
                onClick={() => window.location.href = "mailto:info@vaughnmartin.com?subject=Channel Partner Inquiry"}
                style={{ ...DM, background: "transparent", color: "rgba(255,255,255,0.75)", fontWeight: 600, fontSize: 13, padding: "18px 40px", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" as const }}
              >
                Email us directly →
              </button>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
