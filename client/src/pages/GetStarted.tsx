import { useEffect, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { updatePageMetadata } from '@/lib/seo';
import { VaughnMartinLogo } from '@/components/VaughnMartinLogo';
import PageLayout from '@/components/layout/PageLayout';
import {
  ArrowRight, CheckCircle, BookOpen, Radar, Zap, BarChart3,
  Users, Shield, Clock, LogIn, Compass
} from 'lucide-react';

const NAVY = "#0A0F2E";
const NAVY_MID = "#141B45";
const GOLD = "#C9A84C";
const GOLD_LT = "#DFC178";
const TEAL = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const BORDER = "#E8E4DC";
const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const WHAT_YOU_GET = [
  { icon: BookOpen, label: "170 Strategic Readiness Protocols", desc: "Full library across 9 domains — ready to activate" },
  { icon: Radar, label: "Signal Intelligence Dashboard", desc: "Real-time monitoring across 12 enterprise systems" },
  { icon: Zap, label: "Trigger Detection", desc: "Pattern matching surfaces the right Readiness Protocol in seconds" },
  { icon: BarChart3, label: "Executive Analytics", desc: "Live performance metrics, ROI tracking, risk scoring" },
  { icon: Users, label: "Stakeholder Coordination", desc: "Task assignment, escalation paths, approvals built-in" },
  { icon: Shield, label: "Crisis Response Center", desc: "Pre-wired Readiness Protocols for every threat scenario" },
];

const ICON_STYLES = [
  { bg: "#0A0F2E", color: "#C9A84C" },
  { bg: "#2B8A6E", color: "#fff" },
  { bg: "rgba(201,168,76,0.12)", color: "#C9A84C" },
];

const STEPS = [
  { num: "01", label: "Sign In", desc: "Authenticate securely — no password required" },
  { num: "02", label: "Set Up Your Org", desc: "2-minute setup: name, industry, key departments" },
  { num: "03", label: "Pick Your Readiness Protocols", desc: "Choose the 3–5 most relevant to your role" },
  { num: "04", label: "Run the Platform", desc: "Real signals, real AI, real execution — fully live" },
];

export default function GetStarted() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Sign In — Readiness OS | VaughnMartin",
      description: "Access the full Readiness OS platform. Real protocols, real execution.",
    });
  }, []);

  const handleStart = () => {
    if (isAuthenticated) {
      setLocation("/command-center");
    } else {
      login("/command-center");
    }
  };

  return (
    <PageLayout>

      {/* HERO */}
      <section style={{ background: NAVY, padding: "80px 56px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: `radial-gradient(circle, ${GOLD} 1px, transparent 1px)`,
          backgroundSize: "32px 32px"
        }} />
        <div style={{ position: "absolute", top: -120, right: -120, width: 500, height: 500, background: `radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", border: `1px solid rgba(201,168,76,0.3)`, marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: 0, background: TEAL_LT }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase" }}>Live Platform Access</span>
          </div>

          <h1 style={{ ...CG, fontSize: "clamp(40px,5vw,68px)", fontWeight: 600, lineHeight: 1.05, color: "#fff", marginBottom: 20 }}>
            Try Readiness OS.<br />
            <em style={{ fontStyle: "italic", color: GOLD_LT }}>For Real.</em>
          </h1>

          <p style={{ fontSize: 17, fontWeight: 400, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto 40px" }}>
            This is not a simulation. Sign in to access the full live platform — 170 playbooks, AI signal monitoring, real-time execution coordination.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            {isLoading ? (
              <div style={{ height: 52, width: 240, background: "rgba(255,255,255,0.1)", borderRadius: 0 }} />
            ) : (
              <button
                onClick={handleStart}
                style={{
                  background: GOLD, color: NAVY, fontWeight: 700, fontSize: 15,
                  padding: "16px 40px", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 10,
                  letterSpacing: "0.03em", transition: "background 0.2s"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = GOLD_LT)}
                onMouseLeave={e => (e.currentTarget.style.background = GOLD)}
              >
                {isAuthenticated ? (
                  <><Compass size={18} /> Open the Platform</>
                ) : (
                  <><LogIn size={18} /> Sign In to Platform</>
                )}
                <ArrowRight size={16} />
              </button>
            )}
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.68)", letterSpacing: "0.05em" }}>
              Existing pilot customers — sign in to access your platform.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "72px 56px", background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: TEAL, textTransform: "uppercase", marginBottom: 12 }}>How It Works</p>
            <h2 style={{ ...CG, fontSize: "clamp(28px,3vw,42px)", fontWeight: 600, color: NAVY, lineHeight: 1.1 }}>
              Up and running in under 12 minutes.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, background: BORDER }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ background: "#fff", padding: "36px 28px" }}>
                <div style={{ ...CG, fontSize: 40, fontWeight: 300, color: i === 1 ? GOLD : i === 2 ? TEAL : NAVY, lineHeight: 1, marginBottom: 12 }}>{s.num}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section style={{ padding: "72px 56px", background: "#F8F7F4" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: 12 }}>Full Platform Access</p>
            <h2 style={{ ...CG, fontSize: "clamp(28px,3vw,42px)", fontWeight: 600, color: NAVY, lineHeight: 1.1 }}>
              Everything included from day one.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: BORDER }}>
            {WHAT_YOU_GET.map((item, i) => (
              <div key={i} style={{ background: "#fff", padding: "32px 28px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 40, height: 40, background: ICON_STYLES[i % 3].bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <item.icon size={18} style={{ color: ICON_STYLES[i % 3].color }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFFERENTIATION — Demo vs Pilot */}
      <section style={{ padding: "72px 56px", background: "#fff" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ ...CG, fontSize: "clamp(28px,3vw,42px)", fontWeight: 600, color: NAVY }}>
              Two ways to experience Readiness OS
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: BORDER }}>
            {/* Interactive Demo */}
            <div style={{ background: "#fff", padding: "40px 36px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: TEAL, textTransform: "uppercase", marginBottom: 16 }}>Interactive Demo</div>
              <h3 style={{ ...CG, fontSize: 26, fontWeight: 600, color: NAVY, marginBottom: 12 }}>See It in Action</h3>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 24 }}>
                Walk through a live scenario — signal fires, Readiness Protocol activates, stakeholders mobilize. No commitment, no sales call. Ideal for initial evaluation before engaging your executive team.
              </p>
              {["Live 7-phase walkthrough", "Real Supply Chain scenario", "AI brief + role assignments", "Stakeholder coordination view", "No sign-in required"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <CheckCircle size={14} style={{ color: TEAL, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#374151" }}>{f}</span>
                </div>
              ))}
              <button
                onClick={() => setLocation("/try-demo")}
                style={{
                  marginTop: 28, background: NAVY, color: "#fff", fontWeight: 600, fontSize: 13,
                  padding: "12px 28px", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = NAVY_MID)}
                onMouseLeave={e => (e.currentTarget.style.background = NAVY)}
              >
                <Compass size={14} />
                Try the Demo
              </button>
            </div>

            {/* Founding Partner Program */}
            <div style={{ background: NAVY, padding: "40px 36px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: 16 }}>Founding Partner Program</div>
              <h3 style={{ ...CG, fontSize: 26, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Founding Partner Program</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 24 }}>
                A structured 12-week engagement with dedicated support, custom Readiness Protocol configuration, integration setup, and executive reporting. For Fortune 1000 deployment.
              </p>
              {["Dedicated VaughnMartin team", "Custom integration setup", "Executive sponsor alignment", "12-week structured program", "Guaranteed ROI measurement"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <CheckCircle size={14} style={{ color: GOLD, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{f}</span>
                </div>
              ))}
              <button
                onClick={() => setLocation("/request-access")}
                style={{
                  marginTop: 28, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13,
                  padding: "12px 28px", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = GOLD_LT)}
                onMouseLeave={e => (e.currentTarget.style.background = GOLD)}
              >
                <Clock size={14} />
                Apply for Founding Partner Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ padding: "64px 56px", background: "#F8F7F4", borderTop: `1px solid ${BORDER}`, textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: 12 }}>Ready?</p>
          <h2 style={{ ...CG, fontSize: "clamp(28px,3vw,40px)", fontWeight: 600, color: NAVY, marginBottom: 16 }}>
            The platform is waiting.
          </h2>
          <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7, marginBottom: 32 }}>
            Founding Partners can sign in to access your organization's platform. New to Readiness OS? Apply for Founding Partner Access below.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <button
              onClick={handleStart}
              style={{
                background: GOLD, color: NAVY, fontWeight: 700, fontSize: 15,
                padding: "16px 40px", border: "none", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 10, transition: "background 0.2s"
              }}
              onMouseEnter={e => (e.currentTarget.style.background = GOLD_LT)}
              onMouseLeave={e => (e.currentTarget.style.background = GOLD)}
            >
              <LogIn size={18} />
              {isAuthenticated ? "Open the Platform" : "Sign In to Platform"}
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setLocation("/request-access")}
              style={{
                background: "transparent", color: NAVY, fontWeight: 600, fontSize: 15,
                padding: "16px 40px", border: `1px solid ${BORDER}`, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 10, transition: "border-color 0.2s"
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = NAVY)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
            >
              Apply for Founding Partner Access
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
