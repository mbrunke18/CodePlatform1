import { useEffect, useRef, useState } from "react";
import { GuestPreviewBanner } from "@/components/GuestPreviewBanner";
import { ExecutionStageGuide } from "@/components/ExecutionStageGuide";
import { Link, useLocation } from "wouter";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { ExecutionGapDiagram } from "@/components/ExecutionGapDiagram";
import ExecutionOSMicrosoftDiagram from "@/components/ExecutionOSMicrosoftDiagram";

// ─── Brand Tokens (Spec v2.0 §0) ─────────────────────────────────────────────
const NAVY        = "#0A0F2E";
const NAVY_BG     = "#132558";
const GOLD        = "#C9A84C";
const GOLD_LIGHT  = "#DFC178";
const TEAL_LIGHT  = "#3BAF8A";
const IVORY       = "#F0EDE4";
const MID_NAVY    = "#141B45";
const FOOTER_NAVY = "#060B1E";
const RED_CRISIS  = "#C0392B";
const MUTED_STACK = "#3D4A6B";
const MUTED_DARK  = "#C8D4E8";
const MUTED_LIGHT = "#6B7280";
const BORDER      = "#E8E4DC";
const TEAL        = "#2B8A6E";

const GOLD_GRID_BG: React.CSSProperties = {
  backgroundImage: `linear-gradient(rgba(201,168,76,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.09) 1px, transparent 1px)`,
  backgroundSize: "48px 48px",
};

const SECTION_DARK_BG: React.CSSProperties = {
  backgroundColor: NAVY_BG,
  backgroundImage: [
    `radial-gradient(ellipse 900px 700px at -5% 0%, rgba(43,138,110,0.15) 0%, transparent 55%)`,
    `radial-gradient(ellipse 1000px 800px at 105% 100%, rgba(201,168,76,0.11) 0%, transparent 55%)`,
    `linear-gradient(rgba(201,168,76,0.09) 1px, transparent 1px)`,
    `linear-gradient(90deg, rgba(201,168,76,0.09) 1px, transparent 1px)`,
  ].join(", "),
  backgroundSize: "100% 100%, 100% 100%, 48px 48px, 48px 48px",
};

const GEO: React.CSSProperties = { fontFamily: "Georgia, 'Times New Roman', serif" };
const DM: React.CSSProperties  = { fontFamily: "'DM Sans', 'Inter', sans-serif" };
const CONTAINER: React.CSSProperties = { maxWidth: 1280, margin: "0 auto", padding: "0 32px" };

function trackCTA(loc: string) {
  try {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: "pilot_cta_click", location: loc });
    }
  } catch (_) {}
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>
      {children}
    </div>
  );
}

function SectionMarker({ n }: { n: string }) {
  return (
    <div className="hp-section-marker" style={{
      position: "absolute", left: 24, top: 40,
      ...DM, fontSize: 12, fontWeight: 700, letterSpacing: "0.10em",
      color: GOLD, opacity: 0.75, userSelect: "none", pointerEvents: "none",
    }}>
      [{n}]
    </div>
  );
}

// ─── Live context hook ────────────────────────────────────────────────────────
interface LiveSignal {
  id: number;
  triggerName: string;
  triggerDomain: string;
  signalDescription: string;
  signalSource: string;
  confidenceScore: number;
  recommendedPlaybook: string | null;
  detectedAt: string | null;
}
interface LiveCtx {
  totalToday: number;
  domainsActive: string[];
  latestSignal: { triggerName: string; triggerDomain: string | null; signalDescription: string; detectedAt: string | null; confidenceScore: number } | null;
  recentDetections: LiveSignal[];
}
function useLiveContext() {
  const [data, setData] = useState<LiveCtx | null>(null);
  useEffect(() => {
    fetch('/api/public/live-context')
      .then(r => r.json())
      .then(d => { if (d.success !== false) setData(d); })
      .catch(() => {});
  }, []);
  return data;
}
function signalTimeAgo(dateStr: string | Date | null): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
  return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) !== 1 ? 's' : ''} ago`;
}
const DOMAIN_LABELS: Record<string, string> = {
  'Market Dynamics': 'MARKET',
  'Regulatory & Compliance': 'REGULATORY',
  'Technology & Security': 'CYBER',
  'Supply Chain & Operations': 'SUPPLY CHAIN',
  'Brand & Reputation': 'BRAND',
  'Financial': 'FINANCIAL',
  'ESG & Sustainability': 'ESG',
  'Geopolitical': 'GEOPOLITICAL',
  'Human Capital': 'TALENT',
};
const FALLBACK_SIGNALS = [
  { triggerName: 'Activist Investor Pressure', triggerDomain: 'Market Dynamics', signalDescription: 'Institutional investor filed 13D disclosing 8.7% stake in Fortune 500 consumer goods company, citing undervaluation and seeking board representation.', signalSource: 'SEC EDGAR', confidenceScore: 91, detectedAt: null, illustrative: true },
  { triggerName: 'Regulatory Inquiry Opened', triggerDomain: 'Regulatory & Compliance', signalDescription: 'Federal agency announced formal inquiry into pricing practices of major pharmaceutical distributor — disclosure obligations triggered within 48 hours.', signalSource: 'Federal Register', confidenceScore: 87, detectedAt: null, illustrative: true },
  { triggerName: 'Ransomware Attack Confirmed', triggerDomain: 'Technology & Security', signalDescription: 'Critical infrastructure provider confirmed ransomware incident affecting billing and operations systems — second major attack in sector this quarter.', signalSource: 'Reuters Business', confidenceScore: 95, detectedAt: null, illustrative: true },
];

// ─── LiveSignalFeed section ───────────────────────────────────────────────────
function LiveSignalFeedSection() {
  const liveCtx = useLiveContext();
  const hasReal = (liveCtx?.recentDetections?.length ?? 0) > 0;
  const signals: Array<{ triggerName: string; triggerDomain: string; signalDescription: string; signalSource: string; confidenceScore: number; detectedAt: string | null; illustrative?: boolean }> =
    hasReal
      ? liveCtx!.recentDetections.map(d => ({ ...d, illustrative: false }))
      : FALLBACK_SIGNALS;

  return (
    <section style={{ ...SECTION_DARK_BG, padding: '64px 0 72px', position: 'relative' }}>
      <div style={{ ...CONTAINER }}>
        {/* Header row */}
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 40, gap: 24, flexWrap: 'wrap' as const }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{
                  display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                  background: '#2B8A6E', animation: 'vm-pulse 2s ease-in-out infinite',
                }} />
                <span style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#2B8A6E' }}>
                  {hasReal ? 'System monitoring — live' : 'System monitoring — always on'}
                </span>
              </div>
              <h2 style={{ ...GEO, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: '#fff', lineHeight: 1.25, margin: 0 }}>
                {hasReal
                  ? 'What the system detected while you were reading this.'
                  : 'What the system monitors — continuously, across every domain.'}
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
              {hasReal && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ ...GEO, fontSize: 28, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{liveCtx!.totalToday}</div>
                  <div style={{ ...DM, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginTop: 4, letterSpacing: '0.04em' }}>signals detected today</div>
                </div>
              )}
              <div style={{ ...DM, fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'right' as const }}>
                248+ data points · refreshed every 15 minutes
              </div>
            </div>
          </div>
        </Reveal>

        {/* Signal cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {signals.map((sig, i) => {
            const domainLabel = DOMAIN_LABELS[sig.triggerDomain] || sig.triggerDomain.toUpperCase();
            const ago = sig.detectedAt ? signalTimeAgo(sig.detectedAt) : null;
            return (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{
                  background: 'rgba(255,255,255,0.035)',
                  border: '1px solid rgba(201,168,76,0.18)',
                  padding: '24px 24px 20px',
                  display: 'flex', flexDirection: 'column' as const, gap: 14,
                  position: 'relative' as const,
                }}>
                  {/* Top row: domain badge + time */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{
                      ...DM, fontSize: 9, fontWeight: 800, letterSpacing: '0.18em',
                      textTransform: 'uppercase' as const,
                      padding: '3px 8px',
                      background: 'rgba(201,168,76,0.12)',
                      border: '1px solid rgba(201,168,76,0.3)',
                      color: GOLD,
                    }}>{domainLabel}</span>
                    {ago && (
                      <span style={{ ...DM, fontSize: 11, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{ago}</span>
                    )}
                    {sig.illustrative && (
                      <span style={{ ...DM, fontSize: 10, color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>illustrative</span>
                    )}
                  </div>

                  {/* Trigger name */}
                  <div style={{ ...DM, fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                    {sig.triggerName}
                  </div>

                  {/* Signal description */}
                  <p style={{ ...DM, fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
                    {sig.signalDescription.length > 140 ? sig.signalDescription.slice(0, 139) + '…' : sig.signalDescription}
                  </p>

                  {/* Bottom row: source + confidence */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <span style={{ ...DM, fontSize: 10, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' as const }}>
                      {sig.signalSource}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ height: 4, width: 48, background: 'rgba(255,255,255,0.08)' }}>
                        <div style={{ height: '100%', width: `${sig.confidenceScore}%`, background: sig.confidenceScore >= 85 ? TEAL : GOLD }} />
                      </div>
                      <span style={{ ...DM, fontSize: 10, fontWeight: 700, color: sig.confidenceScore >= 85 ? '#3BAF8A' : GOLD }}>
                        {sig.confidenceScore}% match
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Footer line */}
        <Reveal delay={0.25}>
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 16 }}>
            <p style={{ ...DM, fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>
              Every signal above triggers a pre-staged playbook. When the trigger fires, the response is already built.
            </p>
            <Link href="/12-minute-experience" style={{
              ...DM, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase' as const, color: GOLD, textDecoration: 'none',
              borderBottom: `1px solid rgba(201,168,76,0.4)`, paddingBottom: 1,
            }}>
              See how the response deploys in 12 minutes →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 1: Navigation ────────────────────────────────────────────────────
function HomepageNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#fff",
        borderBottom: "1px solid rgba(10,15,46,0.10)",
        boxShadow: "0 1px 12px rgba(10,15,46,0.07)",
        height: 68,
        display: "flex", alignItems: "center",
      }}>
        <div style={{ ...CONTAINER, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <VaughnMartinLogo variant="full" height={68} color="dark" />
          </Link>

          {/* Desktop nav — hidden below 768px via CSS */}
          <div className="hp-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <Link href="/how-it-works" style={{ ...DM, color: NAVY, fontSize: 14, fontWeight: 600, textDecoration: "none", opacity: 0.75 }}>How It Works</Link>
            <Link href="/platform-overview" style={{ ...DM, color: NAVY, fontSize: 14, fontWeight: 600, textDecoration: "none", opacity: 0.75 }}>The Platform</Link>
            <Link href="/try-demo" style={{ ...DM, color: NAVY, fontSize: 14, fontWeight: 700, textDecoration: "none", opacity: 1, borderBottom: `2px solid ${GOLD}`, paddingBottom: 2 }}>See the Demos</Link>
            <Link href="/why-execution-os" style={{ ...DM, color: NAVY, fontSize: 14, fontWeight: 600, textDecoration: "none", opacity: 0.75 }}>Why Readiness OS</Link>
            <Link href="/founder-story" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: NAVY, fontSize: 15, fontWeight: 600, fontStyle: "italic", textDecoration: "none", opacity: 0.85, letterSpacing: "0.01em" }}>The Manifesto</Link>
            <Link href="/investors" style={{ ...DM, color: NAVY, fontSize: 14, fontWeight: 600, textDecoration: "none", opacity: 0.75 }}>Investors</Link>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link
                href="/request-access"
                onClick={() => trackCTA("nav_demo")}
                style={{
                  ...DM, background: "transparent", color: NAVY, fontWeight: 600, fontSize: 14,
                  padding: "9px 18px", borderRadius: 0, textDecoration: "none", letterSpacing: "0.03em",
                  border: `1.5px solid rgba(10,15,46,0.25)`,
                }}
              >
                Request Access
              </Link>
              <Link
                href="/request-access"
                onClick={() => trackCTA("nav")}
                style={{
                  ...DM, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 14,
                  padding: "10px 22px", borderRadius: 0, textDecoration: "none", letterSpacing: "0.04em",
                }}
              >
                Request a Pilot
              </Link>
            </div>
          </div>

          {/* Hamburger — shown below 768px via CSS */}
          <button
            className="hp-hamburger"
            onClick={() => setMenuOpen(v => !v)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8, flexDirection: "column", gap: 5 }}
            aria-label="Open menu"
          >
            <span style={{ display: "block", width: 24, height: 2, background: NAVY, borderRadius: 0 }} />
            <span style={{ display: "block", width: 24, height: 2, background: NAVY, borderRadius: 0 }} />
            <span style={{ display: "block", width: 24, height: 2, background: NAVY, borderRadius: 0 }} />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: NAVY_BG,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0,
        }}>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", cursor: "pointer", color: MUTED_DARK, fontSize: 28, lineHeight: 1 }}
            aria-label="Close menu"
          >
            ✕
          </button>
          {[
            { label: "How It Works",     href: "/how-it-works" },
            { label: "The Platform",     href: "/platform-overview" },
            { label: "See the Demos",    href: "/try-demo" },
            { label: "Why Readiness OS", href: "/why-execution-os" },
            { label: "Investors",        href: "/investors" },
          ].map(item =>
            <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} style={{ ...DM, color: "#fff", fontSize: 22, fontWeight: 500, padding: "16px 0", textDecoration: "none", letterSpacing: "0.02em" }}>{item.label}</Link>
          )}
          <Link href="/founder-story" onClick={() => setMenuOpen(false)} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: GOLD_LIGHT, fontSize: 24, fontWeight: 600, fontStyle: "italic", padding: "16px 0", textDecoration: "none", letterSpacing: "0.01em" }}>The Manifesto</Link>
          <Link
            href="/request-access"
            onClick={() => { setMenuOpen(false); trackCTA("nav_mobile_demo"); }}
            style={{
              ...DM, background: "transparent", color: GOLD, fontWeight: 600, fontSize: 16,
              padding: "16px 24px", borderRadius: 0, textDecoration: "none",
              textAlign: "center", marginTop: 24, width: "calc(100% - 48px)", display: "block",
              border: `1.5px solid rgba(201,168,76,0.5)`,
            }}
          >
            Request Access →
          </Link>
          <Link
            href="/request-access"
            onClick={() => { setMenuOpen(false); trackCTA("nav_mobile"); }}
            style={{
              ...DM, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 16,
              padding: "18px 24px", borderRadius: 0, textDecoration: "none",
              textAlign: "center", marginTop: 10, width: "calc(100% - 48px)", display: "block",
            }}
          >
            Request a Pilot
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hp-desktop-nav    { display: none !important; }
          .hp-hamburger      { display: flex !important; }
          .hp-stat-row       { flex-direction: column !important; gap: 24px !important; }
          .hp-stat-div       { display: none !important; }
          .hp-prob-grid      { flex-direction: column !important; }
          .hp-idea-grid      { grid-template-columns: 1fr !important; }
          .hp-footer-cols    { flex-direction: column !important; gap: 40px !important; text-align: center; }
          .hp-hero-h1        { font-size: 36px !important; }
          .hp-missing-h2     { font-size: 30px !important; }
          .hp-cta-h2         { font-size: 30px !important; }
          .hp-cta-btn        { display: block !important; width: calc(100% - 48px) !important; text-align: center; }
          .hp-sec            { padding: 64px 0 !important; }
          .hp-section-marker { display: none !important; }
          #contrast-moment   { height: 80vh !important; min-height: 480px !important; }
          .hp-ba-grid        { grid-template-columns: 1fr !important; }
          .hp-console-body   { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 375px) {
          .hp-hero-h1 { font-size: 28px !important; }
        }
        @media (min-width: 1440px) {
          .hp-hero-h1    { font-size: 56px !important; }
          .hp-missing-h2 { font-size: 52px !important; }
          .hp-cta-h2     { font-size: 52px !important; }
        }
        @media (min-width: 1920px) {
          .hp-hero-h1    { font-size: 68px !important; }
          .hp-missing-h2 { font-size: 62px !important; }
          .hp-cta-h2     { font-size: 62px !important; }
        }
      `}</style>
    </>
  );
}

// ─── SECTION 2: Hero ─────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section style={{
      ...SECTION_DARK_BG,
      position: "relative",
      minHeight: "100vh",
      display: "flex", alignItems: "center",
      paddingTop: 80, paddingBottom: 80,
    }}>
      <SectionMarker n="01" />
      <div style={{ ...CONTAINER, width: "100%", textAlign: "center" }}>
        <Reveal>
          <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(201,168,76,0.75)", marginBottom: 32 }}>
            WE REDESIGN HOW WORK FLOWS IN THE AGE OF AI
          </div>

          <h1 className="hp-hero-h1" style={{
            ...GEO, fontSize: "clamp(44px,6vw,72px)", fontWeight: 700, color: "#fff",
            lineHeight: 1.15, maxWidth: 900, margin: "0 auto 28px",
          }}>
            AI is generating signals at machine speed.
            <br />
            <span style={{ color: GOLD_LIGHT }}>Your organization is still taking 30 days to respond.</span>
          </h1>

          <p style={{ ...GEO, fontSize: "clamp(20px,2.5vw,28px)", fontStyle: "italic", color: "rgba(255,255,255,0.68)", maxWidth: 680, margin: "0 auto 40px", lineHeight: 1.4 }}>
            The response is ready before the trigger fires.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, marginTop: 40 }}>
            <Link
              href="/request-access"
              onClick={() => trackCTA("hero")}
              style={{
                ...DM, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 16,
                padding: "16px 40px", borderRadius: 0, textDecoration: "none",
                letterSpacing: "0.04em", transition: "all 0.2s ease", display: "inline-block",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = GOLD_LIGHT; el.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = GOLD; el.style.transform = "translateY(0)"; }}
            >
              Request a Pilot
            </Link>
            <Link
              href="/12-minute-experience"
              onClick={() => trackCTA("hero_testdrive")}
              style={{
                ...DM, background: "none", border: `1.5px solid rgba(201,168,76,0.45)`, color: GOLD, fontWeight: 600, fontSize: 14,
                padding: "12px 32px", borderRadius: 0, textDecoration: "none",
                letterSpacing: "0.05em", transition: "all 0.2s ease", display: "inline-block",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = GOLD; el.style.background = "rgba(201,168,76,0.07)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(201,168,76,0.45)"; el.style.background = "none"; }}
            >
              Take the 12-Minute Test Drive →
            </Link>
            <Link
              href="/request-access"
              onClick={() => trackCTA("hero_request_access")}
              style={{
                ...DM, color: "rgba(255,255,255,0.45)", fontSize: 12, textDecoration: "none",
                letterSpacing: "0.04em",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
            >
              Request executive access — no pilot commitment required →
            </Link>
          </div>
        </Reveal>

        {/* Stat strip */}
        <Reveal delay={0.2}>
          <div className="hp-stat-row" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 48,
            marginTop: 64, paddingTop: 40,
            borderTop: "1px solid rgba(201,168,76,0.15)",
          }}>
            {[
              { num: "170",    label: "Zero improvisation when the trigger fires",   sub: "Pre-staged playbooks across 9 strategic domains" },
              { num: "248+",   label: "Threats detected before they become crises",  sub: "Signals monitored every 15 minutes" },
              { num: "12 min", label: "Full organizational deployment",              sub: "Before the first emergency call ends" },
            ].map((s, i) => (
              <div key={s.num} style={{ display: "contents" }}>
                {i > 0 && <div className="hp-stat-div" style={{ width: 1, height: 40, background: "rgba(201,168,76,0.3)", flexShrink: 0 }} />}
                <div style={{ textAlign: "center", maxWidth: 200 }}>
                  <div style={{ ...GEO, fontSize: 32, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{s.num}</div>
                  <div style={{ ...DM, fontSize: 13, fontWeight: 600, color: "#fff", marginTop: 8, lineHeight: 1.4 }}>{s.label}</div>
                  <div style={{ ...DM, fontSize: 12, color: MUTED_DARK, marginTop: 4, lineHeight: 1.4 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 3: The Problem ───────────────────────────────────────────────────
function ProblemSection() {
  const RED_BORDER = "#C0392B";
  const cards = [
    {
      num: "01", title: "The Trigger Fires", time: "T+0",
      timeLabel: "Seconds",
      body: "A competitor cuts prices. A regulator issues a mandate. A key executive resigns. The strategic moment is NOW — and it won't wait.",
      accent: GOLD, terminal: false,
    },
    {
      num: "02", title: "Weeks Just to Get Everyone Aligned", time: "T+Weeks",
      timeLabel: "Weeks Lost",
      body: "Emergency calls. Competing priorities. No clear ownership. Weeks of coordination pass before anyone is aligned — and nothing has been executed.",
      accent: GOLD, terminal: false,
    },
    {
      num: "03", title: "Execution Takes Weeks to Begin", time: "T+3 weeks",
      timeLabel: "Weeks Lost",
      body: "Roles assigned manually. Documents drafted from scratch. Budgets negotiated. Tasks staged one by one. Weeks pass before a single coordinated action lands.",
      accent: RED_BORDER, terminal: false,
    },
    {
      num: "04", title: "The Window Has Already Closed", time: "T+∞",
      timeLabel: "Advantage Gone",
      body: "Competitors responded weeks ago. The market moved. The board is asking questions. The opportunity — or the crisis — has already been decided. Without you.",
      accent: RED_BORDER, terminal: true,
    },
  ];

  return (
    <section className="hp-sec" style={{ background: IVORY, padding: "100px 0", position: "relative" }}>
      <SectionMarker n="02" />
      <div style={{ ...CONTAINER }}>
        <div className="hp-prob-grid" style={{ display: "flex", gap: 60, alignItems: "flex-start" }}>

          {/* Left */}
          <Reveal style={{ flex: "0 0 calc(50% - 30px)", maxWidth: "50%" }}>
            <SectionLabel>THE PROBLEM</SectionLabel>
            <p style={{ ...GEO, fontSize: 22, fontWeight: 600, fontStyle: "italic", color: GOLD, marginBottom: 18, lineHeight: 1.3 }}>
              Your strategy isn't failing. Your mobilization is.
            </p>
            <h2 style={{ ...GEO, fontSize: 38, fontWeight: 700, color: "#0A0F2E", lineHeight: 1.2, marginBottom: 32 }}>
              The trigger fires in seconds.
              <br />
              Execution begins weeks later.
            </h2>
            <p style={{ ...DM, fontSize: 17, color: "#333", lineHeight: 1.7, marginBottom: 24 }}>
              It doesn't matter what kind of trigger it is — a cybersecurity breach, a competitor acquisition, a regulatory mandate, a market shift. The strategic moment arrives instantly and demands an immediate, coordinated response.
            </p>

            {/* Trigger category tags — condensed */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>
                Every situation. Every trigger. Same problem.
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  "Cybersecurity Breach", "Competitor Acquisition", "Regulatory Mandate",
                  "Supply Chain Failure", "Executive Departure", "ESG Crisis",
                  "Geopolitical Risk", "M&A Pressure", "Reputational Threat",
                ].map((tag) => (
                  <span key={tag} style={{
                    ...DM, fontSize: 11, fontWeight: 600, color: "#444",
                    background: "#F0EDE8", border: `1px solid ${BORDER}`,
                    padding: "3px 10px", borderRadius: 0,
                  }}>{tag}</span>
                ))}
                <span style={{
                  ...DM, fontSize: 11, fontWeight: 700, color: GOLD,
                  background: "rgba(201,168,76,0.1)", border: `1px solid rgba(201,168,76,0.3)`,
                  padding: "3px 10px", borderRadius: 0,
                }}>+ 161 more across 9 domains</span>
              </div>
            </div>

            <p style={{ ...DM, fontSize: 17, color: "#333", lineHeight: 1.7, marginBottom: 40 }}>
              Yet every time, your organization spends weeks in alignment meetings before a single coordinated action is taken. By the time execution begins, the window has already moved.
            </p>

            {/* Timeline contrast callout */}
            <div style={{ borderTop: `2px solid ${GOLD}`, paddingTop: 24 }}>
              <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
                Without Readiness OS
              </div>
              {[
                { label: "Trigger detected",    val: "Instantly" },
                { label: "Leadership aligned",    val: "2–4 weeks" },
                { label: "Execution begins",     val: "3–4 weeks" },
                { label: "Competitive window",   val: "Closed" },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, marginBottom: 10, borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ ...DM, fontSize: 14, color: "#555" }}>{row.label}</span>
                  <span style={{ ...DM, fontSize: 14, fontWeight: 700, color: row.val === "Closed" ? RED_BORDER : "#1A1A2E" }}>{row.val}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, padding: "12px 16px", background: "#0A0F2E" }}>
                <span style={{ ...DM, fontSize: 14, fontWeight: 700, color: GOLD }}>With Readiness OS</span>
                <span style={{ ...GEO, fontSize: 20, fontWeight: 700, color: "#fff" }}>12 minutes</span>
              </div>
            </div>
          </Reveal>

          {/* Right — failure cards */}
          <div style={{ flex: "0 0 calc(50% - 30px)", maxWidth: "50%", display: "flex", flexDirection: "column", gap: 12 }}>
            {cards.map((c, i) => (
              <Reveal key={c.num} delay={i * 0.1}>
                <div style={{
                  background: c.terminal ? "rgba(192,57,43,0.04)" : "#fff",
                  border: `1px solid ${c.terminal ? "rgba(192,57,43,0.25)" : BORDER}`,
                  borderLeft: `3px solid ${c.accent}`,
                  padding: "20px 24px", borderRadius: 0, position: "relative", overflow: "hidden",
                }}>
                  <div style={{ ...GEO, fontSize: 42, fontWeight: 700, color: c.terminal ? "rgba(192,57,43,0.1)" : "rgba(192,57,43,0.09)", position: "absolute", bottom: 6, right: 14, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
                    {c.num}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ ...DM, fontSize: 13, fontWeight: 700, color: c.terminal ? RED_BORDER : "#1A1A2E" }}>{c.title}</span>
                    <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: c.terminal ? RED_BORDER : GOLD, background: c.terminal ? "rgba(192,57,43,0.08)" : "rgba(201,168,76,0.12)", padding: "2px 8px", borderRadius: 0 }}>{c.timeLabel}</span>
                  </div>
                  <div style={{ ...DM, fontSize: 13, color: "#555", lineHeight: 1.6 }}>{c.body}</div>
                  {i < cards.length - 1 && (
                    <div style={{ ...DM, color: i >= 1 ? RED_BORDER : GOLD, fontSize: 14, marginTop: 10, textAlign: "center", opacity: 0.6 }}>↓</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Natural transition → demo */}
        <div style={{ textAlign: "center", paddingTop: 52, paddingBottom: 8 }}>
          <Link href="/12-minute-experience" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: NAVY, fontSize: 13, fontWeight: 700, borderBottom: `2px solid ${GOLD}`, paddingBottom: 3, textDecoration: "none" }}>
            There is a better way — experience the 12-minute alternative live →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 3b: Execution Gap Diagram ───────────────────────────────────────
function ExecutionGapSection() {
  return (
    <section style={{ background: "#F0EDE4", padding: "80px 0 60px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 12, fontFamily: "'DM Sans', Arial, sans-serif" }}>
            THE ARCHITECTURE BEHIND THE SPEED
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#0A0F2E", fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1.15 }}>
            30 Days of Mobilization. 12 Minutes to Live Execution.
          </div>
          <div style={{ fontSize: 15, color: "#6B7280", marginTop: 14, maxWidth: 620, margin: "14px auto 0", fontFamily: "'DM Sans', Arial, sans-serif", lineHeight: 1.6 }}>
            The traditional enterprise spends weeks just getting the right people in the room, aligned on a plan, and ready to act. Readiness OS delivers roles assigned, tasks staged, communications drafted, and execution already underway — in 12 minutes.
          </div>
        </div>
        <ExecutionGapDiagram />
      </div>
    </section>
  );
}

// ─── SECTION 4: The Missing Layer ────────────────────────────────────────────
function MissingLayerSection() {
  const rows = [
    { label: "STRATEGY",         sub: "Board Decisions · Planning · Vision",  hi: false },
    { label: "ERP / CRM / ITSM", sub: "SAP · Salesforce · ServiceNow",        hi: false },
    { label: "READINESS OS",     sub: "New Operating Model · AI-Native Enterprises", hi: true  },
    { label: "TASK MANAGEMENT",  sub: "Jira · Monday · Asana",                 hi: false },
    { label: "PEOPLE",           sub: "Your Organization",                     hi: false },
  ];

  return (
    <section className="hp-sec" style={{ ...SECTION_DARK_BG, padding: "120px 0", position: "relative" }}>
      <SectionMarker n="03" />
      <div style={{ ...CONTAINER, textAlign: "center" }}>
        <Reveal>
          <SectionLabel>WHY THE WORLD NEEDED THIS</SectionLabel>
          <h2 className="hp-missing-h2" style={{ ...GEO, fontSize: 44, fontWeight: 700, color: "#fff", lineHeight: 1.25, maxWidth: 860, margin: "0 auto 32px" }}>
            Enterprise work was designed for a world{" "}
            <span style={{ color: GOLD }}>without AI.</span>
            <br />
            Nobody redesigned it.
          </h2>
          <p style={{ ...DM, fontSize: 17, color: MUTED_DARK, maxWidth: 680, margin: "0 auto 16px", lineHeight: 1.7 }}>
            Committees, alignment cycles, and 30-day response times exist because humans couldn't process information fast enough to act alone. AI changed that constraint. But every vendor bolted AI onto the same 40-year-old operating model — faster spreadsheets, smarter summaries, better notes from the same slow meetings. The latency stays. The window closes anyway.
          </p>
          <div style={{ margin: "32px auto 64px", maxWidth: 660, borderLeft: `3px solid ${GOLD}`, paddingLeft: 28, textAlign: "left" }}>
            <p style={{ ...GEO, fontSize: 22, fontWeight: 700, color: GOLD, marginBottom: 6, lineHeight: 1.35 }}>
              We didn't add AI to the old model.
            </p>
            <p style={{ ...GEO, fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.35 }}>
              We redesigned how strategic work flows.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, maxWidth: 480, margin: "0 auto" }}>
            {rows.map((row, i) => (
              <div key={row.label} style={{ width: "100%" }}>
                <div style={{
                  width: "100%", padding: "14px 24px", textAlign: "center",
                  background: row.hi ? GOLD : "rgba(61,74,107,0.4)",
                  border: row.hi ? "none" : `1px solid rgba(61,74,107,0.6)`,
                  borderLeft: row.hi ? `4px solid rgba(10,15,46,0.2)` : "none",
                }}>
                  <div style={{ ...DM, fontSize: 13, fontWeight: row.hi ? 700 : 500, letterSpacing: "0.08em", textTransform: "uppercase", color: row.hi ? NAVY : MUTED_DARK }}>
                    {row.label}
                  </div>
                  <div style={{ ...DM, fontSize: 11, color: row.hi ? "rgba(10,15,46,0.65)" : "rgba(200,212,232,0.55)", marginTop: 3 }}>
                    {row.sub}
                  </div>
                </div>
                {i < rows.length - 1 && (
                  <div style={{ display: "flex", justifyContent: "center", height: 8 }}>
                    <div style={{ width: 1, height: "100%", background: MUTED_STACK }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 5: IDEA Framework ───────────────────────────────────────────────
function IDEASection() {
  const cards = [
    { letter: "I", title: "Identify", subtitle: "170 Pre-Staged Playbooks",        body: "Every scenario across all 9 strategic domains is fully mapped before the trigger fires. Roles, tasks, documents, and budget are already assigned — waiting for the moment. Nothing is improvised.", accent: TEAL, wm: "rgba(43,138,110,0.06)" },
    { letter: "D", title: "Detect",   subtitle: "248+ Signals, Every 15 Minutes",  body: "AI monitors 248+ signals around the clock and knows exactly which playbook matches each pattern. The trigger is identified — and the response is ready — before your leadership team finishes their first email.", accent: GOLD, wm: "rgba(201,168,76,0.06)" },
    { letter: "E", title: "Execute",  subtitle: "12-Minute Full Deployment",        body: "One executive authorization. The organization moves. Roles distributed, tasks assigned, war rooms opened — simultaneously, to every stakeholder. By the time the first alignment call would have been scheduled, you're already executing.", accent: TEAL, wm: "rgba(43,138,110,0.06)" },
    { letter: "A", title: "Advance",  subtitle: "Institutional Memory, Built In",   body: "Every activation writes itself into institutional memory. What worked, what didn't, what to pre-stage differently next time — each execution makes the next response faster, sharper, and more decisive.", accent: GOLD, wm: "rgba(201,168,76,0.06)" },
  ];

  return (
    <section id="how-it-works" className="hp-sec" style={{ background: "#F8F7F4", padding: "100px 0", position: "relative" }}>
      <SectionMarker n="05" />

      <div style={{ ...CONTAINER }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>HOW IT WORKS</SectionLabel>
            <h2 style={{ ...GEO, fontSize: 38, fontWeight: 700, color: "#0A0F2E", lineHeight: 1.2, marginBottom: 48 }}>
              Trigger fires. Organization deploys.
              <br />
              In 12 minutes.
            </h2>

            {/* Before / After comparison strip */}
            <div className="hp-ba-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, maxWidth: 820, margin: "0 auto", border: `1px solid ${BORDER}` }}>
              {/* Before */}
              <div style={{ background: "#fff", padding: "28px 32px", borderRight: `1px solid ${BORDER}` }}>
                <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: RED_CRISIS, marginBottom: 18 }}>Before</div>
                {[
                  "Emergency Slack threads and back-to-back calls",
                  "Improvised docs, unclear ownership, missed steps",
                  "Weeks of calls and meetings — still no coordinated execution",
                  "No memory — same crisis, same mistakes, next time",
                ].map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                    <span style={{ color: RED_CRISIS, fontSize: 14, marginTop: 2, flexShrink: 0 }}>✕</span>
                    <span style={{ ...DM, fontSize: 13, color: "#555", lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
              {/* After */}
              <div style={{ background: "#F4FBF8", padding: "28px 32px" }}>
                <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, marginBottom: 18 }}>With Readiness OS</div>
                {[
                  "Trigger detected — playbook activated automatically",
                  "Roles, tasks, and budget pre-assigned and deployed",
                  "Full org executing in under 12 minutes",
                  "Every activation feeds institutional memory forward",
                ].map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                    <span style={{ color: TEAL, fontSize: 14, marginTop: 2, flexShrink: 0 }}>✓</span>
                    <span style={{ ...DM, fontSize: 13, color: "#333", lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="hp-idea-grid" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
          maxWidth: 960, margin: "60px auto 0",
        }}>
          {cards.map((c, i) => (
            <Reveal key={c.letter} delay={i * 0.1}>
              <div
                style={{
                  background: "#fff", border: `1px solid ${BORDER}`, borderTop: `3px solid ${c.accent}`,
                  padding: 32, position: "relative", overflow: "hidden",
                }}
              >
                <div style={{ ...GEO, fontSize: 96, fontWeight: 700, color: c.wm, position: "absolute", bottom: 16, right: 24, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
                  {c.letter}
                </div>
                <div style={{ ...GEO, fontSize: 28, fontWeight: 700, color: c.accent, marginBottom: 4 }}>{c.letter}</div>
                <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>{c.title}</div>
                <div style={{ ...DM, fontSize: 12, fontWeight: 600, color: c.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>{c.subtitle}</div>
                <p style={{ ...DM, fontSize: 15, color: "#555", lineHeight: 1.65 }}>{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Flywheel — Compound Execution Advantage */}
        <Reveal delay={0.2}>
          <div style={{
            maxWidth: 900, margin: "56px auto 0", padding: "32px 40px",
            background: "linear-gradient(135deg, rgba(10,15,46,0.04) 0%, rgba(43,138,110,0.06) 100%)",
            border: `1px solid ${BORDER}`, borderLeft: `3px solid ${TEAL}`,
          }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: TEAL, marginBottom: 6 }}>The Compound Execution Advantage</div>
              <div style={{ ...GEO, fontSize: 18, fontWeight: 700, color: "#0A0F2E" }}>Every activation makes the next one faster.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }}>
              {[
                { letter: "A", step: "ADVANCE", desc: "AI writes the debrief. What worked, what to stage differently." },
                { letter: "I", step: "IDENTIFY", desc: "Playbooks update automatically. Next trigger, better positioned." },
                { letter: "D", step: "DETECT", desc: "Pattern library sharpens. Signals matched faster, fewer false reads." },
                { letter: "E", step: "EXECUTE", desc: "Response time compresses. The 12-minute clock starts earlier." },
              ].map((item, i) => (
                <div key={item.letter} style={{
                  padding: "20px 20px", borderRight: i < 3 ? `1px dashed ${BORDER}` : "none",
                  position: "relative", textAlign: "center",
                }}>
                  {i < 3 && (
                    <div style={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: GOLD, fontWeight: 700, zIndex: 1 }}>→</div>
                  )}
                  <div style={{ ...GEO, fontSize: 20, fontWeight: 800, color: i % 2 === 0 ? GOLD : TEAL, marginBottom: 4 }}>{item.letter}</div>
                  <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#0A0F2E", textTransform: "uppercase", marginBottom: 8 }}>{item.step}</div>
                  <div style={{ ...DM, fontSize: 12, color: "#666", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
              <span style={{ ...DM, fontSize: 12, color: "#888", fontStyle: "italic" }}>
                The loop closes back to ADVANCE — each execution cycle compounds organizational intelligence.
              </span>
            </div>
          </div>
        </Reveal>

        {/* Natural transition → demo */}
        <div style={{ textAlign: "center", paddingTop: 48, paddingBottom: 0 }}>
          <Link href="/12-minute-experience" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: TEAL, fontSize: 13, fontWeight: 700, borderBottom: `2px solid ${TEAL}`, paddingBottom: 3, textDecoration: "none" }}>
            Experience the IDEA Framework in real time — guided, live, no login required →
          </Link>
        </div>
      </div>
    </section>
  );
}

function PlatformPreviewSection() {
  const phases = ["IDENTIFY", "DETECT", "EXECUTE", "ADVANCE"];
  const tasks = [
    { role: "CFO", action: "Approve contingency budget release", done: true },
    { role: "COO", action: "Activate Tier-1 supplier protocol", done: true },
    { role: "General Counsel", action: "Review force majeure exposure", done: false },
    { role: "CMO", action: "Stage customer communication", done: false },
  ];
  return (
    <section style={{ background: "#F0EEE9", padding: "100px 0", position: "relative" }}>
      <SectionMarker n="06" />
      <div style={{ ...CONTAINER }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <SectionLabel>THE PLATFORM IN ACTION</SectionLabel>
            <h2 style={{ ...GEO, fontSize: 36, fontWeight: 700, color: NAVY, lineHeight: 1.25, marginBottom: 16 }}>
              What an executive sees at minute one.
            </h2>
            <p style={{ ...DM, fontSize: 16, color: "#4A5568", maxWidth: 600, margin: "0 auto" }}>
              If the playbook calls for a war room, it's already booked. If it calls for an all-hands, it's pre-distributed. Every role, task, approval, and escalation path is pre-staged — so when the trigger fires, the organization executes instead of improvises.
            </p>
          </div>
        </Reveal>

        {/* Console mockup */}
        <Reveal>
          <div style={{ maxWidth: 860, margin: "0 auto", overflow: "hidden", border: "1px solid rgba(10,15,46,0.15)" }}>
            {/* Console header */}
            <div style={{ background: NAVY, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 0, background: TEAL_LIGHT, boxShadow: `0 0 8px ${TEAL_LIGHT}` }} />
                <span style={{ ...DM, fontSize: 13, color: GOLD, fontWeight: 700, letterSpacing: "0.08em" }}>LIVE ACTIVATION — PLAYBOOK #047</span>
              </div>
              <span style={{ ...DM, fontSize: 12, color: MUTED_DARK }}>Supply Chain Disruption · Tier-1 Supplier Failure</span>
            </div>

            {/* Phase bar */}
            <div style={{ background: "#0D1A3A", padding: "0 24px", display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {phases.map((p, i) => (
                <div key={p} style={{
                  flex: 1, padding: "12px 0", textAlign: "center",
                  borderBottom: i < 2 ? `2px solid ${TEAL_LIGHT}` : i === 2 ? `2px solid ${GOLD}` : "2px solid rgba(255,255,255,0.1)",
                }}>
                  <span style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                    color: i < 2 ? TEAL_LIGHT : i === 2 ? GOLD : MUTED_DARK }}>
                    {p}
                  </span>
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="hp-console-body" style={{ background: "#0A1228", padding: "28px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Left — task assignments */}
              <div>
                <div style={{ ...DM, fontSize: 11, color: MUTED_DARK, letterSpacing: "0.08em", marginBottom: 14, textTransform: "uppercase" }}>
                  Role Assignments — Auto-staged
                </div>
                {tasks.map((t) => (
                  <div key={t.role} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14, padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderLeft: t.done ? `2px solid ${TEAL_LIGHT}` : `2px solid rgba(201,168,76,0.4)`, borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                    <div style={{ width: 18, height: 18, borderRadius: 0, flexShrink: 0, marginTop: 1, background: t.done ? TEAL_LIGHT : "transparent", border: t.done ? "none" : `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {t.done && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ ...DM, fontSize: 11, color: GOLD, fontWeight: 700, marginBottom: 3 }}>{t.role}</div>
                      <div style={{ ...DM, fontSize: 12, color: "#C8D4E8" }}>{t.action}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right — status panel */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ padding: "16px 18px", background: "rgba(43,138,110,0.12)", borderLeft: `3px solid ${TEAL_LIGHT}`, border: "1px solid rgba(43,138,110,0.3)" }}>
                  <div style={{ ...DM, fontSize: 11, color: TEAL_LIGHT, letterSpacing: "0.08em", marginBottom: 6, textTransform: "uppercase" }}>Time to Full Deployment</div>
                  <div style={{ ...GEO, fontSize: 38, fontWeight: 700, color: "#fff", lineHeight: 1 }}>9:47</div>
                  <div style={{ ...DM, fontSize: 11, color: MUTED_DARK, marginTop: 4 }}>minutes elapsed · target: 12:00</div>
                </div>
                <div style={{ padding: "16px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ ...DM, fontSize: 11, color: MUTED_DARK, letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>Stakeholder Coverage</div>
                  {[{ label: "Notified", pct: 100, color: TEAL_LIGHT }, { label: "Briefed", pct: 82, color: GOLD }, { label: "Actioned", pct: 50, color: "#fff" }].map(r => (
                    <div key={r.label} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ ...DM, fontSize: 11, color: MUTED_DARK }}>{r.label}</span>
                        <span style={{ ...DM, fontSize: 11, color: r.color, fontWeight: 700 }}>{r.pct}%</span>
                      </div>
                      <div style={{ height: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                        <div style={{ width: `${r.pct}%`, height: "100%", background: r.color, transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "12px 18px", background: "rgba(201,168,76,0.08)", borderLeft: `3px solid ${GOLD}`, border: "1px solid rgba(201,168,76,0.2)", textAlign: "center" }}>
                  <div style={{ ...DM, fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: "0.06em" }}>EXECUTIVE ACTION REQUIRED</div>
                  <div style={{ ...DM, fontSize: 12, color: MUTED_DARK, marginTop: 4 }}>1 decision · estimated 90 seconds</div>
                </div>
              </div>
            </div>

            {/* Console footer */}
            <div style={{ background: "#060F1F", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ ...DM, fontSize: 11, color: MUTED_DARK }}>AI Execution Brief generated · 4 roles deployed · 0 manual coordination</span>
              <span style={{ ...DM, fontSize: 11, color: TEAL_LIGHT, fontWeight: 700 }}>● ON TRACK</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 7: Credibility ───────────────────────────────────────────────────
const RESEARCH_FIRMS = [
  { firm: "McKinsey & Company", finding: "Fewer than 40% of companies investing in AI report measurable gains. The gap is not the technology — it is the operating model. Executive ownership is the single common factor in every measured success." },
  { firm: "IBM Institute for Business Value", finding: "60% of AI transformation failures trace to execution infrastructure gaps. The technology works. The coordination doesn't." },
  { firm: "World Economic Forum", finding: "Coordination lag — not capital constraints — is the #1 barrier to strategic agility in large enterprises globally." },
  { firm: "BCG Henderson Institute", finding: "Companies that can activate strategic responses within hours vs. days sustain 3× the competitive advantage over a 5-year horizon." },
  { firm: "Deloitte Insights", finding: "72% of C-suite leaders cite organizational responsiveness — not strategy quality — as their primary execution gap." },
  { firm: "Accenture Research", finding: "The difference between market leaders and laggards is execution velocity. Leaders respond to competitive triggers 8× faster." },
  { firm: "Gartner", finding: "By 2026, 75% of organizations that can't respond to strategic triggers within 4 hours will lose measurable market share." },
  { firm: "Google Cloud / Alphabet", finding: "Enterprise AI adoption stalls not at the model layer but at the coordination layer — the infrastructure to act on AI insight is absent." },
  { firm: "Harvard Business Review", finding: "AI doesn't reduce work — it intensifies it. In a 200-person enterprise study, AI expanded task scope 47%, blurred role boundaries, and increased multitasking 32%. The gap is not the model. It is the operating model that governs it." },
];

// ─── Microsoft Ecosystem Banner ───────────────────────────────────────────────
function MicrosoftEcosystemBanner() {
  const [, setLocation] = useLocation();
  const MONO: React.CSSProperties = { fontFamily: "'DM Mono','Geist Mono','Fira Code',monospace" };
  const msStack = [
    { name: 'Azure AI', icon: '◈', color: '#0078D4' },
    { name: 'Microsoft Teams', icon: '⬡', color: '#6264A7' },
    { name: 'Copilot Studio', icon: '◉', color: '#5BA3E8' },
    { name: 'Microsoft Entra', icon: '◎', color: '#107C10' },
    { name: 'Microsoft 365', icon: '◆', color: '#D83B01' },
    { name: 'Power Platform', icon: '◈', color: '#742774' },
  ];
  return (
    <section style={{ background: '#060B1E', padding: '72px 0 56px', borderTop: `1px solid ${GOLD}22`, borderBottom: `1px solid ${GOLD}15`, position: 'relative', overflow: 'hidden' }}>
      {/* Subtle orbs */}
      <div style={{ position: 'absolute', top: -80, right: -40, width: 500, height: 400, background: 'radial-gradient(ellipse,rgba(0,120,212,0.08) 0%,transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -40, width: 400, height: 300, background: `radial-gradient(ellipse,${GOLD}0D 0%,transparent 65%)`, pointerEvents: 'none' }} />

      <div style={{ ...CONTAINER, maxWidth: 1180 }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            {/* Eyebrow with gold dot */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18, background: `${GOLD}12`, border: `1px solid ${GOLD}30`, borderRadius: 0, padding: '5px 16px' }}>
              <span style={{ width: 5, height: 5, borderRadius: 0, background: GOLD, display: 'inline-block' }} />
              <span style={{ ...MONO, fontSize: 10, letterSpacing: 3, color: GOLD, textTransform: 'uppercase' as const, fontWeight: 700 }}>
                No rip-and-replace — deploys on what you already have
              </span>
            </div>
            <h2 style={{ ...GEO, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: IVORY, lineHeight: 1.15, marginBottom: 16 }}>
              Every enterprise has Microsoft's AI stack.
              <br />
              <em style={{ color: GOLD, fontStyle: 'italic' }}>None have the operating model to use it.</em>
            </h2>
            <p style={{ ...DM, fontSize: 16, color: 'rgba(240,237,228,0.55)', maxWidth: 620, margin: '0 auto 8px' }}>
              Readiness OS is the operating model layer above your Microsoft investment. When a strategic trigger fires, the coordinated response deploys inside Teams, Azure AI, and M365 in 12 minutes — with the workflow architecture that turns AI capability into AI action.
            </p>
            <p style={{ ...DM, fontSize: 13, color: TEAL, fontWeight: 600 }}>
              For investors: every Microsoft enterprise customer is an immediately addressable prospect.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
            {msStack.map(({ name, icon, color }) => (
              <div key={name} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 16px', borderRadius: 0,
                background: 'rgba(240,237,228,0.04)',
                border: '1px solid rgba(240,237,228,0.1)',
                transition: 'all 0.2s ease',
              }}>
                <span style={{ color, fontSize: 12 }}>{icon}</span>
                <span style={{ ...MONO, fontSize: 10, color: 'rgba(240,237,228,0.65)', letterSpacing: 0.5 }}>{name}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {[
              { label: 'Azure AI Ready', sublabel: 'Enterprise data residency + SOC 2', icon: '◆' },
              { label: 'Teams War Room', sublabel: 'Notifications on activation', icon: '◈' },
              { label: '4-Agent IDEA Framework', sublabel: '3,600× head start — in execution while others mobilize', icon: '◉' },
              { label: 'Copilot Studio Connector', sublabel: 'Query playbooks from M365', icon: '◇' },
            ].map(({ label, sublabel, icon }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 6, color: GOLD }}>{icon}</div>
                <div style={{ ...MONO, fontSize: 11, color: GOLD, letterSpacing: 1, marginBottom: 4, fontWeight: 600 }}>{label}</div>
                <div style={{ ...DM, fontSize: 12, color: 'rgba(240,237,228,0.55)' }}>{sublabel}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Architecture Diagram */}
        <Reveal delay={0.25}>
          <div style={{ marginTop: 40, padding: '0 0 4px', borderRadius: 0, overflow: 'hidden', border: `1px solid rgba(201,168,76,0.15)` }}>
            <ExecutionOSMicrosoftDiagram />
          </div>
        </Reveal>

        {/* Ecosystems link */}
        <Reveal delay={0.3}>
          <div style={{ textAlign: 'center', marginTop: 40, paddingTop: 32, borderTop: `1px solid rgba(201,168,76,0.12)` }}>
            <p style={{ ...DM, fontSize: 13, color: 'rgba(240,237,228,0.45)', letterSpacing: '0.04em' }}>
              Also integrates with Google Workspace, Salesforce, AWS, SAP, ServiceNow, and Workday —{' '}
              <a href="/ecosystems" style={{ color: GOLD, textDecoration: 'none', fontWeight: 600 }}>
                view all 7 enterprise ecosystems →
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Competitive Clarity Section ─────────────────────────────────────────────
function CompetitiveClaritySection() {
  const [, setLocation] = useLocation();
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  const comparisons = [
    {
      tag: "vs. Management Consulting",
      tagColor: "#C9A84C",
      heading: "McKinsey tells you what to do.",
      headingEm: "We make sure it happens.",
      body: "$300K–$500K buys you PDFs on SharePoint. Nobody can find them when a trigger fires. The $500K investment sits on a shelf while the organization still takes 30 days to coordinate.",
      verdict: "They documented it.",
      verdictSub: "Same 30-day mobilization cycle — with a custom PDF.",
      path: "/vs-consulting",
      cta: "See the consulting comparison",
    },
    {
      tag: "MS Project End of Life",
      tagColor: "#EF4444",
      heading: "Don't migrate your lag",
      headingEm: "to a new database.",
      body: "ServiceNow wants to become your new MS Project — a better dashboard for the same 30-day mobilization cycle. Use the transition moment to eliminate the lag, not migrate it.",
      verdict: "They moved the tool.",
      verdictSub: "Same 30-day mobilization cycle — newer interface.",
      path: "/ms-project",
      cta: "See migration vs. evolution",
    },
    {
      tag: "vs. Thought Leadership",
      tagColor: "#2B8A6E",
      heading: "They described the problem.",
      headingEm: "We shipped the solution.",
      body: "Every keynote, framework, and McKinsey deck proves the mobilization gap is real. The audience nods. The room agrees. The organization still takes 30 days to respond when a trigger fires.",
      verdict: "They talked about it.",
      verdictSub: "Same 30-day mobilization cycle — better slides.",
      path: "/platform-reality",
      cta: "See the full competitive reality",
    },
  ];

  return (
    <section style={{ background: "#F8F7F4", padding: "72px 0", borderTop: `1px solid #E8E4DC`, borderBottom: `1px solid #E8E4DC` }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 48px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40, gap: 32, flexWrap: "wrap" as const }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 2, background: NAVY }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#6B7280" }}>The Competitive Landscape</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(26px,3.5vw,38px)", color: NAVY, lineHeight: 1.1, margin: 0 }}>
              Every alternative has the same result:<br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>30 days unchanged.</em>
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", background: NAVY, flexShrink: 0 }}>
            <div>
              <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: GOLD, lineHeight: 1 }}>12</div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.45)", marginTop: 2 }}>Minutes — Readiness OS</div>
            </div>
            <div style={{ width: 1, height: 40, background: "rgba(201,168,76,0.3)" }} />
            <div>
              <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: "#6B7280", lineHeight: 1 }}>30</div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.3)", marginTop: 2 }}>Days — every alternative</div>
            </div>
          </div>
        </div>

        {/* Three cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
          {comparisons.map((item) => (
            <div key={item.path} style={{ background: "#fff", border: `1px solid #E8E4DC`, display: "flex", flexDirection: "column" as const }}>
              <div style={{ padding: "28px 28px 0" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: item.tagColor, marginBottom: 16 }}>{item.tag}</div>
                <h3 style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, lineHeight: 1.2, marginBottom: 4 }}>{item.heading}</h3>
                <h3 style={{ ...CG, fontSize: 22, fontWeight: 600, color: GOLD, lineHeight: 1.2, fontStyle: "italic", marginBottom: 16 }}>{item.headingEm}</h3>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65, marginBottom: 20 }}>{item.body}</p>
                <div style={{ padding: "12px 16px", background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.1)", marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", marginBottom: 2 }}>{item.verdict}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}>{item.verdictSub}</div>
                </div>
              </div>
              <div style={{ marginTop: "auto", borderTop: `1px solid #F3F4F6` }}>
                <button
                  onClick={() => setLocation(item.path)}
                  style={{ width: "100%", padding: "14px 28px", background: "transparent", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: NAVY, textAlign: "left" as const, display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  {item.cta}
                  <span style={{ color: GOLD }}>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CredibilitySection() {
  const outcomes = [
    { stat: "12 min", label: "Median time from trigger to full org deployment" },
    { stat: "0 hrs",  label: "Executive coordination overhead required" },
    { stat: "94%",    label: "Playbook phases completed within target window" },
  ];
  return (
    <section style={{ background: MID_NAVY, padding: "96px 0 80px", position: "relative", overflow: "hidden" }}>
      <SectionMarker n="07" />
      {/* Subtle grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
      <div style={{ ...CONTAINER }}>
        <Reveal>
          {/* Label */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
              <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.8)" }}>External Validation</span>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
            </div>
            <h2 style={{ ...GEO, fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>
              15 independent research organizations.<br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>All reached the same conclusion.</em>
            </h2>
            <p style={{ ...DM, fontSize: 15, color: MUTED_DARK, maxWidth: 560, margin: "0 auto" }}>
              The missing layer isn't better strategy. It isn't more AI. It's the infrastructure to execute — fast, coordinated, without improvisation.
            </p>
          </div>

          {/* Research firm cards — 4-column grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 64 }}>
            {RESEARCH_FIRMS.map((r) => (
              <div key={r.firm} style={{ padding: "24px 20px", background: "rgba(10,15,46,0.6)", transition: "background 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.07)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(10,15,46,0.6)"; }}>
                <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>{r.firm}</div>
                <p style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, fontStyle: "italic" }}>"{r.finding}"</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.08)", margin: "0 auto 56px" }} />

          {/* Outcome metrics */}
          <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 56, flexWrap: "wrap" }}>
            {outcomes.map((o, i) => (
              <div key={o.stat} style={{
                flex: "1 1 200px", padding: "32px 40px",
                borderRight: i < outcomes.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                textAlign: "center",
              }}>
                <div style={{ ...GEO, fontSize: 44, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 10 }}>{o.stat}</div>
                <div style={{ ...DM, fontSize: 13, color: MUTED_DARK, lineHeight: 1.5, maxWidth: 180, margin: "0 auto" }}>{o.label}</div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.08)", margin: "0 auto 48px" }} />

          {/* Founder story */}
          <div style={{ textAlign: "center" }}>
            <p style={{ ...DM, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.45)", marginBottom: 24, letterSpacing: "0.02em" }}>
              Built by someone who ran execution at Ford · Lockheed Martin · Toyota · Charles Schwab · Vantiv/Worldpay · Boyd Gaming
            </p>
            <blockquote style={{ maxWidth: 680, margin: "0 auto", padding: 0, marginBottom: 32 }}>
              <p style={{ ...GEO, fontSize: 20, fontStyle: "italic", color: "#fff", lineHeight: 1.65, marginBottom: 16 }}>
                "After the fifth company I stopped being patient.
                <br />
                I built the infrastructure nobody else would."
              </p>
              <footer style={{ ...DM, fontSize: 13, color: GOLD, fontWeight: 600 }}>
                — Martin Brunke, Founder
              </footer>
            </blockquote>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.3)" }} />
              <Link
                href="/founder-story"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 15,
                  fontWeight: 500,
                  fontStyle: "italic",
                  color: GOLD_LIGHT,
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                  opacity: 0.85,
                }}
              >
                Why this company exists — and why it's named what it is →
              </Link>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.3)" }} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 8: Primary CTA ───────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="hp-sec" style={{ ...SECTION_DARK_BG, padding: "120px 0", position: "relative" }}>
      <SectionMarker n="08" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <Reveal>
          <h2 className="hp-cta-h2" style={{ ...GEO, fontSize: 44, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 24 }}>
            At <span style={{ color: RED_CRISIS }}>week four</span>, they're
            {" "}finally in the room.
            <br />
            You've been executing for{" "}
            <span style={{ color: GOLD }}>29 days, 23 hours</span>.
          </h2>
          <p style={{ ...DM, fontSize: 17, color: MUTED_DARK, maxWidth: 580, margin: "0 auto 16px", lineHeight: 1.7 }}>
            We're selecting 3–5 pilot partners this quarter. The organizations that move first build an execution advantage their competitors will spend years trying to close.
          </p>
          <p style={{ ...DM, fontSize: 15, color: MUTED_DARK, maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.6, opacity: 0.75 }}>
            The conversation is 30 minutes.
          </p>
          <div>
            <Link
              href="/request-access"
              onClick={() => trackCTA("cta_section")}
              className="hp-cta-btn"
              style={{
                ...DM, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 18,
                padding: "20px 56px", borderRadius: 0, textDecoration: "none",
                letterSpacing: "0.04em", display: "inline-block", transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GOLD_LIGHT; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = GOLD; }}
            >
              Request a Pilot
            </Link>
          </div>
          <p style={{ ...DM, fontSize: 13, color: MUTED_LIGHT, marginTop: 20, opacity: 0.6 }}>
            Pilot pricing available · No long-term commitment required
          </p>
          <p style={{ ...DM, fontSize: 13, marginTop: 12 }}>
            <Link href="/12-minute-experience" style={{ color: GOLD, opacity: 0.7, textDecoration: "none", borderBottom: "1px solid rgba(201,168,76,0.3)", paddingBottom: 1 }}>
              Or try it yourself first — no login required →
            </Link>
          </p>
          <p style={{ ...DM, fontSize: 13, marginTop: 8 }}>
            <Link href="/request-access" onClick={() => trackCTA("cta_request_access")} style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 1 }}>
              Request executive platform access — separate from the Pilot Program →
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 8: Footer ───────────────────────────────────────────────────────
function HomepageFooter() {
  return (
    <footer style={{ background: FOOTER_NAVY, borderTop: "1px solid rgba(201,168,76,0.2)", padding: "60px 0 40px" }}>
      <div style={{ ...CONTAINER }}>
        <div className="hp-footer-cols" style={{ display: "flex", gap: 48, marginBottom: 40 }}>

          {/* Brand */}
          <div style={{ flex: "0 0 280px" }}>
            <div style={{ marginBottom: 16 }}>
              <VaughnMartinLogo variant="full" height={80} color="light" />
            </div>
            <p style={{ ...GEO, fontStyle: "italic", fontSize: 16, color: GOLD_LIGHT, marginBottom: 16 }}>We Make Enterprises Fearless.</p>
            <p style={{ ...DM, fontSize: 12, color: MUTED_LIGHT }}>© 2026 VaughnMartin. All rights reserved.</p>
          </div>

          {/* Product */}
          <div style={{ flex: 1 }}>
            <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>PRODUCT</div>
            {[
              { label: "How It Works",   href: "/how-it-works" },
              { label: "Playbooks",      href: "/playbook-library" },
              { label: "Pricing",        href: "/pricing" },
              { label: "Request a Pilot", href: "/request-access" },
              { label: "Request Access", href: "/request-access" },
            ].map(l => (
              <Link key={l.label} href={l.href} style={{ ...DM, display: "block", color: MUTED_DARK, fontSize: 14, padding: "4px 0", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>

          {/* Demos */}
          <div style={{ flex: 1 }}>
            <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>DEMOS</div>
            {[
              { label: "12-Minute Test Drive",      href: "/12-minute-experience" },
              { label: "Shadow Simulator",          href: "/simulation-studio" },
              { label: "ROI Calculator",            href: "/roi-calculator" },
            ].map(l => (
              <Link key={l.label} href={l.href} style={{ ...DM, display: "block", color: MUTED_DARK, fontSize: 14, padding: "4px 0", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>

          {/* Company */}
          <div style={{ flex: 1 }}>
            <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>COMPANY</div>
            {[
              { label: "About",              href: "/founder-story" },
              { label: "vaughnmartin.com",   href: "/" },
              { label: "LinkedIn",           href: "https://linkedin.com/company/vaughnmartin", external: true },
            ].map(l => (
              l.external
                ? <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ ...DM, display: "block", color: MUTED_DARK, fontSize: 14, padding: "4px 0", textDecoration: "none" }}>{l.label}</a>
                : <Link key={l.label} href={l.href!} style={{ ...DM, display: "block", color: MUTED_DARK, fontSize: 14, padding: "4px 0", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, textAlign: "center" }}>
          <p style={{ ...DM, fontSize: 11, color: MUTED_LIGHT }}>
            VaughnMartin · Readiness OS · Built for Fortune 1000 · Confidential
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Scroll depth analytics (Spec §11) ───────────────────────────────────────
function useScrollDepth() {
  useEffect(() => {
    const fired = new Set<number>();
    const handler = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = Math.round((window.scrollY / total) * 100);
      [25, 50, 75, 100].forEach(t => {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          try { if ((window as any).dataLayer) (window as any).dataLayer.push({ event: "scroll_depth", percent: t }); } catch (_) {}
        }
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
}

// ─── SECTION 3: Cinematic Contrast Moment ────────────────────────────────────
function ContrastMomentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAnimated(true); obs.disconnect(); }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const t = (delay: number, dur = 0.6): React.CSSProperties => ({
    transition: `opacity ${dur}s ease ${delay}s, transform ${dur}s ease ${delay}s`,
  });

  return (
    <section
      id="contrast-moment"
      ref={ref}
      style={{
        ...SECTION_DARK_BG,
        position: "relative",
        height: "100vh",
        minHeight: 520,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <SectionMarker n="04" />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 24px" }}>

        {/* 30 Days — fades out */}
        <div
          className="cm-stat-72"
          style={{
            ...GEO,
            fontSize: "clamp(60px, 15vw, 140px)",
            fontWeight: 700,
            color: RED_CRISIS,
            lineHeight: 1,
            opacity: animated ? 0.15 : 1,
            transform: animated ? "scale(0.4)" : "scale(1)",
            ...t(1.6),
          }}
        >
          30 Days
        </div>

        {/* Label for 30 days */}
        <div
          style={{
            ...DM, fontSize: 14, color: MUTED_DARK, marginTop: 12, letterSpacing: "0.06em",
            textTransform: "uppercase",
            opacity: animated ? 0 : 1,
            ...t(0.8, 0.5),
          }}
        >
          Just to mobilize. Execution hasn't started.
        </div>

        {/* 12 min — builds in */}
        <div
          className="cm-stat-12"
          style={{
            ...GEO,
            fontSize: "clamp(80px, 20vw, 180px)",
            fontWeight: 700,
            color: TEAL_LIGHT,
            lineHeight: 1,
            marginTop: 8,
            opacity: animated ? 1 : 0,
            transform: animated ? "scale(1)" : "scale(0.6)",
            ...t(2.0),
          }}
        >
          12 min
        </div>

        {/* Label for 12 */}
        <div
          style={{
            ...DM, fontSize: 14, color: MUTED_DARK, marginTop: 12, letterSpacing: "0.06em",
            textTransform: "uppercase",
            opacity: animated ? 1 : 0,
            ...t(2.4, 0.5),
          }}
        >
          Full organizational execution underway
        </div>

        {/* Tagline */}
        <div
          style={{
            ...GEO,
            fontStyle: "italic",
            fontSize: "clamp(16px, 2vw, 22px)",
            color: "#fff",
            marginTop: 48,
            opacity: animated ? 1 : 0,
            ...t(2.8, 0.5),
          }}
        >
          The difference is infrastructure.
        </div>

        {/* Scroll chevron */}
        <div
          style={{
            marginTop: 56,
            opacity: animated ? 1 : 0,
            ...t(3.4, 0.5),
          }}
        >
          <div
            className="cm-chevron"
            style={{
              display: "inline-block",
              color: GOLD,
              fontSize: 22,
              animation: animated ? "cm-pulse 1.4s ease-in-out infinite" : "none",
            }}
          >
            ↓
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cm-pulse {
          0%, 100% { opacity: 0.5; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(6px); }
        }
        @media (max-width: 768px) {
          #contrast-moment .cm-stat-72 { opacity: 0.15 !important; transform: scale(0.4) !important; transition: none !important; }
          #contrast-moment .cm-stat-12 { opacity: 1   !important; transform: scale(1)   !important; transition: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          #contrast-moment * { transition: none !important; animation: none !important; }
          #contrast-moment .cm-stat-72 { opacity: 0.15 !important; transform: scale(0.4) !important; }
          #contrast-moment .cm-stat-12 { opacity: 1   !important; transform: scale(1)   !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Shadow Simulator CTA ────────────────────────────────────────────────────
function SimulatorCTASection() {
  return (
    <section style={{ ...SECTION_DARK_BG, padding: "80px 0" }}>
      <div style={{ ...CONTAINER, maxWidth: 860, textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 24, height: 1, background: GOLD }} />
            <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>Shadow Strategy Simulator · Scenario Analysis</span>
            <div style={{ width: 24, height: 1, background: GOLD }} />
          </div>
          <h2 style={{ ...GEO, fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
            Test Your Organization Against Any Threat
          </h2>
          <p style={{ ...DM, fontSize: 16, color: MUTED_DARK, maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.65 }}>
            Describe a real scenario your company is facing. Our AI scores your Survive and Thrive probability in seconds — and maps the exact playbooks you'd need to activate.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 36 }}>
            {[
              "Competitor acquiring our largest distributor",
              "Activist investor demands board seat",
              "Primary cloud vendor breach",
              "Regulatory inquiry into pricing practices",
            ].map(s => (
              <span key={s} style={{
                ...DM, fontSize: 11, fontWeight: 600, padding: "5px 14px",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                color: MUTED_DARK,
              }}>{s}</span>
            ))}
          </div>
          <Link
            href="/simulation-studio"
            style={{
              ...DM, display: "inline-block", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em",
              padding: "15px 40px", background: GOLD, color: NAVY, textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GOLD_LIGHT; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = GOLD; }}
          >
            Run My Scenario — Free, No Login →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
export default function Homepage() {
  useScrollDepth();
  useEffect(() => {
    document.title = "VaughnMartin | Readiness OS — Enterprise Coordination Infrastructure";
  }, []);
  return (
    <div style={{ background: NAVY, margin: 0, padding: 0 }}>
      <HomepageNav />
      <GuestPreviewBanner />
      <HeroSection />
      <LiveSignalFeedSection />
      <ProblemSection />
      <ExecutionGapSection />
      <MissingLayerSection />
      <ContrastMomentSection />
      <IDEASection />
      <PlatformPreviewSection />
      <MicrosoftEcosystemBanner />
      <CompetitiveClaritySection />
      <CredibilitySection />
      <SimulatorCTASection />
      <CTASection />
      <HomepageFooter />
    </div>
  );
}
