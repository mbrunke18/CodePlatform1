import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { updatePageMetadata } from "@/lib/seo";
import { FirstVisitAdModal } from "@/components/FirstVisitAdModal";
import { GuestPreviewBanner } from "@/components/GuestPreviewBanner";
import { ExecutionStageGuide } from "@/components/ExecutionStageGuide";
import { Link, useLocation } from "wouter";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { TechCrest } from "@/components/TechCrest";
import { ExecutionGapDiagram } from "@/components/ExecutionGapDiagram";
import ExecutionOSMicrosoftDiagram from "@/components/ExecutionOSMicrosoftDiagram";
import EcosystemIntegrationDiagram from "@/components/EcosystemIntegrationDiagram";
import heroImg from "@/assets/images/executive-floor-night.png";
import aerialImg from "@/assets/images/aerial-city-grid.png";

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
const DM: React.CSSProperties  = { fontFamily: "'Barlow', 'Barlow', sans-serif" };
const CONTAINER: React.CSSProperties = { maxWidth: 1280, margin: "0 auto", padding: "0 32px", boxSizing: "border-box" as const };

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

// ─── Sticky in-page jump nav ─────────────────────────────────────────────────
const HP_NAV_ITEMS = [
  { id: 'hp-hero',        label: 'Overview'         },
  { id: 'hp-problem',     label: 'The Problem'      },
  { id: 'contrast-moment',label: '30 Days → 12 Min' },
  { id: 'hp-anatomy',     label: 'How It Works'     },
  { id: 'hp-platform',    label: 'Platform'         },
  { id: 'hp-proof',       label: 'Proof'            },
  { id: 'hp-cta',         label: 'Get Access'       },
];

function StickyJumpNav() {
  const [active, setActive] = useState('hp-hero');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    HP_NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '0px 0px -75% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observers.forEach(o => o.disconnect());
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="hp-jump-nav"
      style={{
        position: 'fixed', right: 22, top: '50%', transform: 'translateY(-50%)',
        zIndex: 900, display: 'flex', flexDirection: 'column', gap: 14,
        opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.4s ease',
      }}
    >
      {HP_NAV_ITEMS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="hp-jump-btn"
            style={{
              all: 'unset', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10,
            }}
          >
            <span
              className="hp-jump-label"
              style={{
                ...DM, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', whiteSpace: 'nowrap',
                color: isActive ? GOLD : 'rgba(255,255,255,0.5)',
                opacity: 0, transition: 'opacity 0.2s ease',
                textShadow: '0 1px 4px rgba(0,0,0,0.6)',
              }}
            >
              {label}
            </span>
            <div style={{
              width: isActive ? 9 : 5, height: isActive ? 9 : 5,
              borderRadius: '50%', flexShrink: 0,
              background: isActive ? GOLD : 'rgba(255,255,255,0.3)',
              border: `1px solid ${isActive ? GOLD : 'rgba(255,255,255,0.18)'}`,
              boxShadow: isActive ? `0 0 6px ${GOLD}88` : 'none',
              transition: 'all 0.25s ease',
            }} />
          </button>
        );
      })}
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
  { triggerName: 'Activist Investor Pressure', triggerDomain: 'Market Dynamics', signalDescription: 'Institutional investor filed 13D disclosing 8.7% stake in Fortune 500 consumer goods company, citing undervaluation and seeking board representation.', signalSource: 'SEC EDGAR', confidenceScore: 91, detectedAt: null, illustrative: true, recommendedPlaybook: 'Activist Investor Defense' },
  { triggerName: 'Regulatory Inquiry Opened', triggerDomain: 'Regulatory & Compliance', signalDescription: 'Federal agency announced formal inquiry into pricing practices of major pharmaceutical distributor — disclosure obligations triggered within 48 hours.', signalSource: 'Federal Register', confidenceScore: 87, detectedAt: null, illustrative: true, recommendedPlaybook: 'Regulatory Investigation Response' },
  { triggerName: 'Ransomware Attack Confirmed', triggerDomain: 'Technology & Security', signalDescription: 'Critical infrastructure provider confirmed ransomware incident affecting billing and operations systems — second major attack in sector this quarter.', signalSource: 'Reuters Business', confidenceScore: 95, detectedAt: null, illustrative: true, recommendedPlaybook: 'Ransomware Response' },
];

// ─── LiveSignalFeed section ───────────────────────────────────────────────────
function LiveSignalFeedSection() {
  const liveCtx = useLiveContext();
  const hasReal = (liveCtx?.recentDetections?.length ?? 0) > 0;
  const signals: Array<{ triggerName: string; triggerDomain: string; signalDescription: string; signalSource: string; confidenceScore: number; detectedAt: string | null; illustrative?: boolean; recommendedPlaybook?: string | null }> =
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
                  System monitoring — always on
                </span>
              </div>
              <h2 style={{ ...GEO, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: '#fff', lineHeight: 1.25, margin: 0 }}>
                {hasReal
                  ? 'What the system has detected. Mapped to pre-staged Readiness Protocols.'
                  : 'What the system monitors — continuously, across every domain.'}
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
              <div style={{ ...DM, fontSize: 12, color: 'rgba(255,255,255,0.68)', textAlign: 'right' as const }}>
                248+ data points · 39 live sources · refreshed every 15 minutes
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
                      ...DM, fontSize: 11, fontWeight: 800, letterSpacing: '0.18em',
                      textTransform: 'uppercase' as const,
                      padding: '3px 8px',
                      background: 'rgba(201,168,76,0.12)',
                      border: '1px solid rgba(201,168,76,0.3)',
                      color: GOLD,
                    }}>{domainLabel}</span>
                    {ago && (
                      <span style={{ ...DM, fontSize: 11, color: 'rgba(255,255,255,0.68)', flexShrink: 0 }}>{ago}</span>
                    )}
                    {sig.illustrative && (
                      <span style={{ ...DM, fontSize: 10, color: 'rgba(255,255,255,0.68)', flexShrink: 0 }}>illustrative</span>
                    )}
                  </div>

                  {/* Signal headline — extracted from actual news content */}
                  {(() => {
                    const raw = sig.signalDescription || '';
                    const dashIdx = raw.indexOf(' — ');
                    const colonIdx = raw.indexOf(': Reports');
                    const headline = dashIdx > 0 ? raw.slice(0, dashIdx) : colonIdx > 0 ? raw.slice(0, colonIdx) : raw.slice(0, 100);
                    const body = dashIdx > 0 ? raw.slice(dashIdx + 3) : '';
                    return (
                      <>
                        <div style={{ ...DM, fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.35 }}>
                          {headline.length > 110 ? headline.slice(0, 109) + '…' : headline}
                        </div>
                        {body && (
                          <p style={{ ...DM, fontSize: 11.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
                            {body.length > 120 ? body.slice(0, 119) + '…' : body}
                          </p>
                        )}
                        <div style={{ ...DM, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.58)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                          Matched trigger → {sig.triggerName}
                        </div>
                      </>
                    );
                  })()}

                  {/* Bottom row: source + confidence */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <span style={{ ...DM, fontSize: 10, color: 'rgba(255,255,255,0.68)', fontStyle: 'italic' as const }}>
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

                  {/* Chain completion row — what fires next */}
                  {sig.recommendedPlaybook && (
                    <div style={{
                      marginTop: 2,
                      padding: '10px 14px',
                      background: 'rgba(43,138,110,0.1)',
                      border: '1px solid rgba(43,138,110,0.25)',
                      borderLeft: `3px solid ${TEAL}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ ...DM, fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: TEAL, textTransform: 'uppercase' as const }}>Readiness Protocol Staged</span>
                        <span style={{ ...DM, fontSize: 11, color: 'rgba(255,255,255,0.68)' }}>→</span>
                        <span style={{ ...DM, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{sig.recommendedPlaybook}</span>
                      </div>
                      <span style={{ ...DM, fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.08em', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>12 MIN</span>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Footer line */}
        <Reveal delay={0.25}>
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 16 }}>
            <p style={{ ...DM, fontSize: 13, color: 'rgba(255,255,255,0.68)', margin: 0, lineHeight: 1.5 }}>
              Every signal above stages a Readiness Protocol. When the trigger fires, the execution is already built.
            </p>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' as const, alignItems: 'center' }}>
              <Link href="/12-minute-experience" style={{
                ...DM, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase' as const, color: GOLD, textDecoration: 'none',
                borderBottom: `1px solid rgba(201,168,76,0.4)`, paddingBottom: 1,
              }}>
                See how the response deploys in 12 minutes →
              </Link>
              <Link href="/situation-scanner" style={{
                ...DM, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase' as const, color: 'rgba(43,138,110,0.9)', textDecoration: 'none',
                borderBottom: `1px solid rgba(43,138,110,0.35)`, paddingBottom: 1,
              }}>
                Try the Situation Scanner →
              </Link>
            </div>
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
          <VaughnMartinLogo variant="full" height={68} color="dark" animated={true} />

          {/* Desktop nav — 4 hub links, no dropdowns */}
          <div className="hp-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <Link href="/platform" style={{ ...DM, color: NAVY, fontSize: 14, fontWeight: 600, textDecoration: "none", opacity: 0.75, whiteSpace: "nowrap" }}>What We Do</Link>
            <Link href="/demo-hub" style={{
              ...DM, color: NAVY, fontSize: 14, fontWeight: 700, textDecoration: "none", opacity: 1,
              padding: "6px 14px",
              background: "rgba(201,168,76,0.10)",
              border: "1px solid rgba(201,168,76,0.35)",
              display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
            }}>
              <span style={{ color: GOLD, fontSize: 11 }}>▶</span>See It Work
            </Link>
            <Link href="/executive-brief" style={{ ...DM, color: NAVY, fontSize: 14, fontWeight: 600, textDecoration: "none", opacity: 0.75, whiteSpace: "nowrap" }}>The Proof</Link>
            <Link href="/channel-partners" style={{ ...DM, color: NAVY, fontSize: 14, fontWeight: 600, textDecoration: "none", opacity: 0.75, whiteSpace: "nowrap" }}>Partners</Link>
            <Link href="/pricing" style={{ ...DM, color: NAVY, fontSize: 14, fontWeight: 600, textDecoration: "none", opacity: 0.75, whiteSpace: "nowrap" }}>Pricing</Link>
            <Link
              href="/request-access"
              onClick={() => trackCTA("nav")}
              data-testid="nav-founding-partner-cta"
              style={{
                ...DM, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 12,
                padding: "10px 20px", borderRadius: 0, textDecoration: "none", letterSpacing: "0.04em", whiteSpace: "nowrap",
              }}
            >
              Apply for Founding Partner Access
            </Link>
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
          <Link href="/demo-experience" onClick={() => setMenuOpen(false)} style={{
            ...DM, display: "block", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.35)",
            color: GOLD, fontSize: 16, fontWeight: 700, padding: "16px 24px", textDecoration: "none",
            letterSpacing: "0.04em", textAlign: "center", marginBottom: 8,
          }}>▶ Watch the Full Platform Demo</Link>
          {[
            { label: "What We Do",  href: "/platform" },
            { label: "See It Work",   href: "/demo-hub", highlight: false },
            { label: "The Proof",     href: "/executive-brief" },
            { label: "Partners",      href: "/channel-partners" },
            { label: "Pricing",       href: "/pricing" },
          ].map(item =>
            <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} style={{
              ...DM, color: (item as any).highlight ? GOLD : "#fff",
              fontSize: 22, fontWeight: (item as any).highlight ? 700 : 500,
              padding: "16px 0", textDecoration: "none", letterSpacing: "0.02em",
            }}>{(item as any).highlight ? `▶ ${item.label}` : item.label}</Link>
          )}
          <Link
            href="/request-access"
            onClick={() => { setMenuOpen(false); trackCTA("nav_mobile"); }}
            style={{
              ...DM, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 16,
              padding: "18px 24px", borderRadius: 0, textDecoration: "none",
              textAlign: "center", marginTop: 24, width: "calc(100% - 48px)", display: "block",
            }}
          >
            Apply for Founding Partner Access
          </Link>
        </div>
      )}

      <style>{`
        .hp-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
        @media (max-width: 900px) {
          .hp-hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .hp-chain-diagram { display: none !important; }
        }
        .hp-jump-btn:hover .hp-jump-label { opacity: 1 !important; }
        .hp-jump-btn:hover > div { background: ${GOLD} !important; border-color: ${GOLD} !important; }
        @media (max-width: 1024px) { .hp-jump-nav { display: none !important; } }
        @media (max-width: 768px) {
          .hp-desktop-nav    { display: none !important; }
          .hp-hamburger      { display: flex !important; }
          .hp-hero-left      { padding: 56px 0 40px !important; }
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
          /* Hero content cleanup — hide dense secondary blocks, fix grids */
          .hp-integration-strip { display: none !important; }
          .hp-outcome-table  { display: none !important; }
          .hp-domain-grid    { grid-template-columns: 1fr !important; gap: 8px !important; }
          .hp-metric-row     { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 20px 0 !important; }
          .hp-metric-row > div { border-right: none !important; padding-right: 0 !important; margin-right: 0 !important; }
          /* Three-step section: stack vertically, hide arrows */
          .hp-three-step-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .hp-step-arrow     { display: none !important; }
          /* Section padding reduction for non-hp-sec sections */
          .hp-section-reduce { padding-top: 56px !important; padding-bottom: 48px !important; }
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

// ─── Execution Chain Diagram ─────────────────────────────────────────────────
function ExecutionChainDiagram() {
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveStep(prev => (prev + 1) % 5), 2000);
    return () => clearInterval(t);
  }, []);

  const steps = [
    { label: "TRIGGER FIRES", time: "T+0", desc: "Strategic moment detected — no improvisation", color: GOLD },
    { label: "SIGNAL MAPPED", time: "T+0:12", desc: "248+ sources evaluated across 9 domains", color: GOLD },
    { label: "Readiness Protocol STAGED", time: "Pre-built", desc: "180 responses ready before trigger fired", color: TEAL },
    { label: "EXECUTIVE AUTHORIZES", time: "T+0:08", desc: "Human decision preserved — not bypassed", color: TEAL },
    { label: "FULL DEPLOYMENT", time: "12 MIN", desc: "Teams coordinated, brief delivered, executing", color: GOLD },
  ];

  return (
    <div className="hp-chain-diagram" style={{
      background: "rgba(5,9,30,0.75)",
      border: "1px solid rgba(201,168,76,0.18)",
      backdropFilter: "blur(8px)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Glow behind diagram */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,138,110,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Header strip */}
      <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL, display: "inline-block", animation: "vm-pulse 2s ease-in-out infinite", flexShrink: 0 }} />
        <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: TEAL }}>Execution Brief · Live</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ ...DM, fontSize: 9, fontWeight: 700, color: TEAL, letterSpacing: "0.12em", background: "rgba(43,138,110,0.15)", border: "1px solid rgba(43,138,110,0.3)", padding: "2px 7px" }}>LIVE SYSTEM</span>
          <span style={{ ...DM, fontSize: 10, color: "rgba(255,255,255,0.68)", letterSpacing: "0.06em" }}>READINESS OS</span>
        </div>
      </div>

      {/* Chain steps */}
      <div style={{ padding: "24px 24px 8px", position: "relative" }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 16, marginBottom: i < steps.length - 1 ? 0 : 0 }}>
            {/* Connector column */}
            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", width: 28, flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, flexShrink: 0,
                background: activeStep === i ? step.color : "rgba(255,255,255,0.06)",
                border: `1.5px solid ${activeStep >= i ? step.color : "rgba(255,255,255,0.1)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.5s ease",
                boxShadow: activeStep === i ? `0 0 16px ${step.color}55` : "none",
                zIndex: 1,
              }}>
                <span style={{ ...DM, fontSize: 11, fontWeight: 800, color: activeStep === i ? NAVY : "rgba(255,255,255,0.68)", transition: "color 0.5s" }}>{i + 1}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  width: 1, flex: 1, minHeight: 28,
                  background: activeStep > i ? `linear-gradient(${step.color}80, ${steps[i+1].color}40)` : "rgba(255,255,255,0.07)",
                  transition: "background 0.5s ease",
                  margin: "3px 0",
                }} />
              )}
            </div>
            {/* Text */}
            <div style={{ paddingBottom: i < steps.length - 1 ? 20 : 8, opacity: activeStep === i ? 1 : activeStep > i ? 0.75 : 0.55, transition: "opacity 0.5s ease" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                <span style={{ ...DM, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: activeStep === i ? step.color : "rgba(255,255,255,0.65)", transition: "color 0.5s" }}>
                  {step.label}
                </span>
                <span style={{ ...DM, fontSize: 10, fontWeight: 700, color: step.label === "FULL DEPLOYMENT" ? GOLD : "rgba(255,255,255,0.68)", letterSpacing: "0.06em" }}>
                  {step.time}
                </span>
              </div>
              <p style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.45 }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 30 days → 12 min result bar */}
      <div style={{ margin: "0 24px 24px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.22)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.68)", marginBottom: 3 }}>Traditional</div>
          <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.68)", textDecoration: "line-through", lineHeight: 1 }}>30 days</div>
        </div>
        <div style={{ ...DM, fontSize: 14, color: "rgba(201,168,76,0.4)" }}>→</div>
        <div style={{ textAlign: "right" as const }}>
          <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 3 }}>Readiness OS</div>
          <div style={{ ...GEO, fontSize: 28, fontWeight: 700, color: GOLD, lineHeight: 1, textShadow: `0 0 20px rgba(201,168,76,0.4)` }}>12 minutes</div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 2: Hero ─────────────────────────────────────────────────────────
// ─── HERO LIVE SIMULATION PANEL ──────────────────────────────────────────────
function HeroSimPanel() {
  const SCENARIOS = [
    {
      domain: "GROWTH & POSITIONING" as const,
      industry: "Technology",
      trigger: "Activist Investor Files 13D — 9.2% Stake",
      protocol: "Protocol #031: Activist Investor Response",
      tasks: 11,
      executive: "Chief Executive Officer",
      steps: [
        { t: "0:06", action: "SEC 13D filing detected — Elliott Management, 9.2% stake", owner: "System" },
        { t: "1:10", action: "CEO authorizes — board brief and defense protocol staged", owner: "CEO" },
        { t: "2:30", action: "Investment banker engaged, defensive brief to board", owner: "Finance / Legal" },
        { t: "4:00", action: "Shareholder communication drafted and staged", owner: "Comms / IR" },
        { t: "7:45", action: "Proxy advisor outreach staged, poison pill review initiated", owner: "Legal" },
        { t: "12:00", action: "Board briefed — defense posture activated", owner: "All Leads" },
      ],
      outcome: "Board briefed, defense posture activated",
      stat: "3,600× execution head start",
    },
    {
      domain: "RISK & RESILIENCE" as const,
      industry: "Pharmaceutical",
      trigger: "FDA Class I Recall — Contamination Signal",
      protocol: "Protocol #058: FDA Class I Recall Response",
      tasks: 9,
      executive: "Chief Risk Officer",
      steps: [
        { t: "0:12", action: "Contamination signal — 3 production lot IDs flagged", owner: "System" },
        { t: "1:30", action: "CRO authorizes — recall sequence staged and unlocked", owner: "CRO" },
        { t: "3:00", action: "FDA voluntary recall notification filed electronically", owner: "Regulatory" },
        { t: "5:15", action: "Distribution hold — 847 retail partners notified", owner: "Supply Chain" },
        { t: "8:30", action: "Consumer safety advisory staged for release", owner: "Comms" },
        { t: "12:00", action: "Recall contained — full chain of custody documented", owner: "All Leads" },
      ],
      outcome: "Recall contained before public exposure",
      stat: "$340M liability avoided",
    },
    {
      domain: "TRANSFORMATION" as const,
      industry: "Consumer Goods",
      trigger: "Market Entry Sprint — 6 Countries, 90-Day Window",
      protocol: "Protocol #089: Go-to-Market Acceleration Sprint",
      tasks: 12,
      executive: "Chief Revenue Officer",
      steps: [
        { t: "0:05", action: "Board green-lights expansion — 90-day execution window opens", owner: "System" },
        { t: "1:15", action: "CRO authorizes — 6-market entry protocol staged and unlocked", owner: "CRO" },
        { t: "2:30", action: "Market entry briefs deployed to 6 regional leads simultaneously", owner: "Regional Leads" },
        { t: "4:00", action: "Legal entity formation and regulatory filings staged per country", owner: "Legal" },
        { t: "7:30", action: "Distribution partnerships activated — channel agreements staged", owner: "Sales / BD" },
        { t: "12:00", action: "All 6 markets operational — revenue pipeline active", owner: "All Leads" },
      ],
      outcome: "6-market simultaneous launch activated",
      stat: "$280M revenue pipeline staged",
    },
    {
      domain: "COMPLETE OPERATING MODEL" as const,
      industry: "Enterprise",
      trigger: "Q3 Roadmap Running + Ransomware — Both Tracks Active",
      protocol: "Protocol #31: Ransomware Response · 3 Planned Initiatives",
      tasks: 11,
      executive: "Chief Executive Officer",
      steps: [
        { t: "0:00", action: "Ransomware — 23 servers encrypted. 3 Q3 initiatives already staged.", owner: "System" },
        { t: "1:10", action: "CEO authorizes unplanned response — Q3 roadmap untouched", owner: "CEO" },
        { t: "2:00", action: "Protocol #31 activated. FBI notified. GTM Launch: on track.", owner: "CISO / FBI" },
        { t: "4:30", action: "Board briefed. M&A Integration: Week 3, on schedule.", owner: "Board" },
        { t: "8:00", action: "Ransomware contained. Product Rollout: staging complete.", owner: "CTO" },
        { t: "12:00", action: "Both tracks complete. Zero Q3 disruption.", owner: "All Leads" },
      ],
      outcome: "Unplanned response + Q3 roadmap: neither stalled",
      stat: "4 protocols active simultaneously",
    },
  ];

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState<"detect" | "stage" | "authorize" | "execute" | "complete">("detect");
  const [riskScore, setRiskScore] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);

  const scenario = SCENARIOS[scenarioIdx];
  const domainColor = scenario.domain === "GROWTH & POSITIONING" ? GOLD : scenario.domain === "TRANSFORMATION" ? IVORY : TEAL;
  const PHASE_LABELS = ["DETECT", "STAGE", "AUTH", "EXECUTE", "COMPLETE"];
  const phaseIdx = ["detect", "stage", "authorize", "execute", "complete"].indexOf(phase);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let scoreInterval: ReturnType<typeof setInterval>;

    setPhase("detect");
    setRiskScore(0);
    setActiveStep(-1);

    let score = 0;
    scoreInterval = setInterval(() => {
      score = Math.min(94, score + Math.floor(Math.random() * 8) + 5);
      setRiskScore(score);
      if (score >= 94) clearInterval(scoreInterval);
    }, 110);

    timers.push(setTimeout(() => setPhase("stage"), 2000));
    timers.push(setTimeout(() => setPhase("authorize"), 4000));
    timers.push(setTimeout(() => { setPhase("execute"); setActiveStep(0); }, 6000));
    timers.push(setTimeout(() => setActiveStep(1), 8000));
    timers.push(setTimeout(() => setActiveStep(2), 10000));
    timers.push(setTimeout(() => setActiveStep(3), 12000));
    timers.push(setTimeout(() => setActiveStep(4), 14000));
    timers.push(setTimeout(() => setActiveStep(5), 16000));
    timers.push(setTimeout(() => setPhase("complete"), 18500));
    timers.push(setTimeout(() => setScenarioIdx(prev => (prev + 1) % SCENARIOS.length), 23000));

    return () => { clearInterval(scoreInterval); timers.forEach(clearTimeout); };
  }, [scenarioIdx]);

  const BRC2: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
  const BAR2: React.CSSProperties = { fontFamily: "'Barlow', sans-serif" };
  const GEO2: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

  return (
    <div style={{
      background: "rgba(4,7,22,0.97)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderLeft: `3px solid ${domainColor}`,
      display: "flex",
      flexDirection: "column" as const,
      height: "100%",
      overflow: "hidden",
    }}>
      {/* Top bar */}
      <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E88" }} />
          <span style={{ ...BRC2, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const }}>LIVE EXECUTION SIMULATION</span>
        </div>
        <span style={{ ...BRC2, fontSize: 8, fontWeight: 700, color: domainColor, letterSpacing: "0.14em", textTransform: "uppercase" as const, padding: "2px 7px", border: `1px solid ${domainColor}44` }}>
          {scenario.domain}
        </span>
      </div>

      {/* Scenario label */}
      <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        <div style={{ ...BRC2, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" as const, marginBottom: 4 }}>{scenario.industry}</div>
        <div style={{ ...GEO2, fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>{scenario.trigger}</div>
      </div>

      {/* Phase progress bar */}
      <div style={{ padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 2, flexShrink: 0 }}>
        {PHASE_LABELS.map((p, i) => (
          <div key={p} style={{ flex: 1, textAlign: "center" as const }}>
            <div style={{ height: 2, background: i <= phaseIdx ? (i === 4 ? TEAL : domainColor) : "rgba(255,255,255,0.08)", marginBottom: 3, transition: "background 0.5s" }} />
            <span style={{ ...BRC2, fontSize: 6.5, fontWeight: 700, letterSpacing: "0.1em", color: i <= phaseIdx ? (i === 4 ? TEAL : "rgba(255,255,255,0.6)") : "rgba(255,255,255,0.18)", textTransform: "uppercase" as const }}>{p}</span>
          </div>
        ))}
      </div>

      {/* Phase content */}
      <div style={{ flex: 1, padding: "14px", overflow: "hidden", minHeight: 0 }}>

        {phase === "detect" && (
          <div>
            <div style={{ ...BRC2, fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: domainColor, textTransform: "uppercase" as const, marginBottom: 10 }}>Signal Detected — Protocol Matching</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 5 }}>
                <span style={{ ...BRC2, fontSize: 9, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const }}>Risk Score</span>
                <span style={{ ...GEO2, fontSize: 36, fontWeight: 700, color: riskScore > 74 ? "#EF4444" : riskScore > 34 ? GOLD : TEAL, lineHeight: 1 }}>{riskScore}</span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.07)" }}>
                <div style={{ height: "100%", width: `${riskScore}%`, background: riskScore > 74 ? "#EF4444" : GOLD, transition: "width 0.1s, background 0.4s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                <span style={{ ...BRC2, fontSize: 6.5, color: "rgba(255,255,255,0.18)" }}>LOW</span>
                <span style={{ ...BRC2, fontSize: 6.5, color: "rgba(255,255,255,0.18)" }}>CRITICAL</span>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: "10px 12px" }}>
              <div style={{ ...BRC2, fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 5 }}>Protocol Matched</div>
              <div style={{ ...BAR2, fontSize: 12, color: "#fff", fontWeight: 600, marginBottom: 3 }}>{scenario.protocol}</div>
              <div style={{ ...BRC2, fontSize: 8.5, color: "rgba(255,255,255,0.35)" }}>{scenario.tasks} tasks pre-staged · Authorization required</div>
            </div>
          </div>
        )}

        {phase === "stage" && (
          <div>
            <div style={{ ...BRC2, fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: domainColor, textTransform: "uppercase" as const, marginBottom: 10 }}>Response Pre-Staged</div>
            <div style={{ ...GEO2, fontSize: 20, fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 14 }}>
              {scenario.tasks} tasks ready.<br />
              <em style={{ color: GOLD }}>Awaiting executive sign-off.</em>
            </div>
            {["Full impact brief prepared", "Budget authority pre-approved", "All task owners assigned", "Communication templates staged"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <div style={{ width: 5, height: 5, background: TEAL, flexShrink: 0 }} />
                <span style={{ ...BAR2, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{item}</span>
              </div>
            ))}
          </div>
        )}

        {phase === "authorize" && (
          <div style={{ textAlign: "center" as const, paddingTop: 4 }}>
            <div style={{ ...BRC2, fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: GOLD, textTransform: "uppercase" as const, marginBottom: 10 }}>Authorization Requested</div>
            <div style={{ ...GEO2, fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{scenario.executive}</div>
            <div style={{ ...BAR2, fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Reviewing impact brief · Budget ready</div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 18 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD, opacity: 0.3 + i * 0.35 }} />
              ))}
            </div>
            <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", padding: "10px 14px" }}>
              <div style={{ ...BAR2, fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                No committee. No alignment meeting.<br />Executive signs off — execution begins.
              </div>
            </div>
          </div>
        )}

        {phase === "execute" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ ...BRC2, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: TEAL, textTransform: "uppercase" as const }}>Executing Now</div>
              <div style={{ ...BRC2, fontSize: 8, fontWeight: 700, color: GOLD, letterSpacing: "0.08em" }}>AUTHORIZATION GRANTED ✓</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 2 }}>
              {scenario.steps.map((step, i) => {
                const done = i <= activeStep;
                const current = i === activeStep;
                const isExec = step.owner !== "System" && !step.owner.includes("All");
                return (
                  <div key={i} style={{ display: "flex", gap: 7, padding: "5px 7px", background: current ? "rgba(201,168,76,0.08)" : done ? "rgba(255,255,255,0.02)" : "transparent", border: `1px solid ${current ? "rgba(201,168,76,0.22)" : "transparent"}`, transition: "all 0.4s", opacity: done || current ? 1 : 0.2 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: done ? (isExec ? GOLD : TEAL) : "rgba(255,255,255,0.1)", marginTop: 4, flexShrink: 0, transition: "background 0.3s" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...BRC2, fontSize: 6.5, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>{step.t} · {step.owner}</div>
                      <div style={{ ...BAR2, fontSize: 9.5, color: done ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.2)", lineHeight: 1.35 }}>{step.action}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {phase === "complete" && (
          <div style={{ textAlign: "center" as const, paddingTop: 6 }}>
            <div style={{ ...BRC2, fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: TEAL, textTransform: "uppercase" as const, marginBottom: 10 }}>Execution Complete · 12:00</div>
            <div style={{ ...GEO2, fontSize: 52, fontWeight: 700, color: TEAL, lineHeight: 1, marginBottom: 8 }}>✓</div>
            <div style={{ ...GEO2, fontSize: 16, fontWeight: 600, color: "#fff", lineHeight: 1.35, marginBottom: 14 }}>{scenario.outcome}</div>
            <div style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.28)", padding: "12px 16px", marginBottom: 12 }}>
              <div style={{ ...GEO2, fontSize: 24, fontWeight: 700, color: GOLD }}>{scenario.stat}</div>
            </div>
            <div style={{ ...BRC2, fontSize: 7.5, color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", textTransform: "uppercase" as const }}>Next scenario loading…</div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{ padding: "9px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {SCENARIOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setScenarioIdx(i)}
              style={{ width: i === scenarioIdx ? 16 : 6, height: 6, borderRadius: 3, background: i === scenarioIdx ? GOLD : "rgba(255,255,255,0.18)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s" }}
            />
          ))}
        </div>
        <a href="/industry-demo-library" style={{ ...BRC2, fontSize: 8, fontWeight: 700, color: TEAL, textDecoration: "none", letterSpacing: "0.14em", textTransform: "uppercase" as const }}>
          See all 19 industries →
        </a>
      </div>
    </div>
  );
}

function HeroSection() {
  const liveCtx = useLiveContext();
  const hasReal = (liveCtx?.recentDetections?.length ?? 0) > 0;
  const signals = hasReal
    ? liveCtx!.recentDetections
        .filter((s, i, arr) => {
          const title = (s as any).signalDescription || (s as any).triggerName || '';
          return arr.findIndex(x => ((x as any).signalDescription || (x as any).triggerName || '') === title) === i;
        })
        .slice(0, 4)
    : FALLBACK_SIGNALS.slice(0, 3);

  return (
    <section id="hp-hero" style={{ ...SECTION_DARK_BG, position: "relative", overflow: "hidden" }}>
      {/* Photography — editorial office floor, dark overlay preserves readability */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `url(${heroImg})`,
        backgroundSize: "cover", backgroundPosition: "center right",
        opacity: 0.18,
        pointerEvents: "none",
      }} />
      {/* Single deliberate gold accent rule */}
      <div style={{ position: "absolute", right: 0, top: 160, width: "58%", height: 1, background: `linear-gradient(to left, transparent 0%, ${GOLD}44 50%, transparent 100%)`, pointerEvents: "none", zIndex: 1 }} />

      <div style={{ ...CONTAINER, width: "100%" }}>
        <div className="hp-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 42%", minHeight: 600, alignItems: "stretch" }}>

          {/* LEFT — Headline + CTAs + Stats */}
          <div className="hp-hero-left" style={{ padding: "100px 56px 88px 0", display: "flex", flexDirection: "column" as const, justifyContent: "center" }}>
            <Reveal>
              {/* Status badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
                <span style={{ ...DM, color: "rgba(255,255,255,0.78)", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>
                  {hasReal ? `${liveCtx?.totalToday ?? 0} Signals Detected Today — System Active` : "231 Trigger Patterns Monitored — System Active"}
                </span>
              </div>

              {/* Category declaration */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28, padding: "5px 14px", border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.07)" }}>
                <div style={{ width: 5, height: 5, background: GOLD, flexShrink: 0 }} />
                <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: GOLD }}>Readiness Infrastructure · Startup to Fortune 500</span>
              </div>

              {/* Headline */}
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(42px,4.5vw,66px)", fontWeight: 700, lineHeight: 1.05, margin: "0 0 6px", color: "#fff", letterSpacing: "-0.01em" }}>
                The Response Is Ready
              </h1>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(42px,4.5vw,66px)", fontWeight: 700, lineHeight: 1.05, margin: "0 0 32px", color: GOLD, letterSpacing: "-0.01em" }}>
                Before the Trigger Fires.
              </h2>

              <p style={{ ...DM, color: "rgba(255,255,255,0.96)", fontSize: "clamp(17px,1.4vw,19px)", lineHeight: 1.75, maxWidth: 500, margin: "0 0 16px" }}>
                Most organizations spend 30 days mobilizing after a trigger fires. Business analysts scope the response. Operations leaders map who needs to be in the room — whoever owns coordination in that organization. Functional leads confirm their roles. Tasks get assigned, briefs get drafted, budgets get estimated — all from scratch, under pressure, while the window closes. That is the Mobilization Tax.
              </p>
              <p style={{ ...DM, color: GOLD, fontSize: "clamp(17px,1.4vw,19px)", fontWeight: 700, lineHeight: 1.5, maxWidth: 500, margin: "0 0 28px" }}>
                The Mobilization Tax doesn't get reduced. It gets eliminated. 30 days of real-time coordination — replaced by 12 minutes of pre-staged execution.
              </p>

              {/* CTAs — one primary experience path, one conversion path */}
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20, flexWrap: "wrap" as const }}>
                <Link
                  href="/demo-experience"
                  onClick={() => trackCTA("hero_scanner")}
                  style={{ ...DM, display: "inline-block", background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13, padding: "16px 32px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const }}
                >
                  Full Platform Demo →
                </Link>
                <Link
                  href="/request-access"
                  onClick={() => trackCTA("hero")}
                  style={{ ...DM, color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.28)", paddingBottom: 1, letterSpacing: "0.02em", whiteSpace: "nowrap" as const }}
                >
                  Apply for Founding Partner Access →
                </Link>
              </div>

              {/* Fix #3 — Role-based entry points */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, alignItems: "center", marginBottom: 28 }}>
                <span style={{ ...DM, fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.18em", textTransform: "uppercase" as const, marginRight: 4, whiteSpace: "nowrap" as const }}>See it for:</span>
                {([
                  { role: "CEO", href: "/master-demo", hint: "Activist Investor" },
                  { role: "COO / PMO", href: "/pmo-onboarding", hint: "Operating Architecture" },
                  { role: "CFO", href: "/roi-calculator", hint: "Execution ROI" },
                  { role: "General Counsel", href: "/demo/doj-investigation", hint: "Regulatory Response" },
                ] as const).map(({ role, href, hint }) => (
                  <a key={role} href={href} style={{ textDecoration: "none", display: "flex", flexDirection: "column" as const, padding: "5px 11px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" }}>
                    <span style={{ ...DM, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.72)", letterSpacing: "0.06em" }}>{role}</span>
                    <span style={{ ...DM, fontSize: 9, color: "rgba(255,255,255,0.36)", letterSpacing: "0.04em" }}>{hint}</span>
                  </a>
                ))}
              </div>

              {/* Social proof — VaughnMartin runs on its own platform */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, padding: "12px 16px", background: "rgba(43,138,110,0.08)", borderLeft: `2px solid ${TEAL}` }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0, marginTop: 5 }} />
                <span style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.75)", letterSpacing: "0.01em", lineHeight: 1.6 }}>
                  <strong style={{ color: "rgba(255,255,255,0.95)", fontWeight: 700 }}>We run on our own platform.</strong>{" "}
                  VaughnMartin uses Readiness OS for every operational situation it faces — the same 180 protocols, the same 12-minute execution standard.
                </span>
              </div>

              <div style={{ margin: "0 0 12px" }}>
                <Link href="/mobilization-cost" style={{ ...DM, fontSize: 12, color: "rgba(201,168,76,0.7)", textDecoration: "none", borderBottom: "1px solid rgba(201,168,76,0.25)", paddingBottom: 1, letterSpacing: "0.04em" }}>
                  What one unprepared trigger costs your organization — see the breakdown →
                </Link>
              </div>
              <div style={{ margin: "0 0 20px" }}>
                <Link href="/roi-calculator" style={{ ...DM, fontSize: 12, color: "rgba(201,168,76,0.7)", textDecoration: "none", borderBottom: "1px solid rgba(201,168,76,0.25)", paddingBottom: 1, letterSpacing: "0.04em" }}>
                  Calculate what it costs your organization specifically →
                </Link>
              </div>
              <p style={{ ...DM, color: "rgba(255,255,255,0.72)", fontSize: "clamp(14px,1.1vw,15px)", lineHeight: 1.75, maxWidth: 500, margin: "0 0 20px" }}>
                Pre-staged before the trigger. Authorized in real time. Executed in 12 minutes. And every activation makes the next response faster.
              </p>

              {/* Readiness posture callout */}
              <div style={{ maxWidth: 500, margin: "0 0 24px", padding: "14px 18px", borderLeft: "2px solid rgba(201,168,76,0.5)", background: "rgba(201,168,76,0.05)" }}>
                <p style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, margin: "0 0 6px" }}>
                  Having 180 protocols pre-staged changes how leadership operates <em style={{ color: "rgba(255,255,255,0.88)" }}>before</em> any trigger fires — not just the moment one does.
                </p>
                <p style={{ ...DM, fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.06em", margin: 0 }}>
                  READINESS ISN'T A MOMENT. IT'S A POSTURE.
                </p>
              </div>

              {/* Detect → Coordinate → Execute → Learn chain */}
              <div style={{ display: "flex", alignItems: "stretch", gap: 0, marginBottom: 28, maxWidth: 500, border: "1px solid rgba(201,168,76,0.18)" }}>
                {[
                  { verb: "Detect", desc: "231 trigger patterns", color: GOLD },
                  { verb: "Coordinate", desc: "Pre-staged stakeholders", color: GOLD },
                  { verb: "Execute", desc: "12 minutes to full response", color: GOLD },
                  { verb: "Learn", desc: "ADVANCE loop compounds", color: TEAL },
                ].map(({ verb, desc, color }, i, arr) => (
                  <div key={verb} style={{ flex: 1, padding: "10px 12px", borderRight: i < arr.length - 1 ? "1px solid rgba(201,168,76,0.12)" : "none", background: i === arr.length - 1 ? "rgba(43,138,110,0.08)" : "rgba(201,168,76,0.04)" }}>
                    <div style={{ ...DM, fontSize: 12, fontWeight: 800, color, letterSpacing: "0.06em", marginBottom: 3 }}>{verb}</div>
                    <div style={{ ...DM, fontSize: 9, color: "rgba(255,255,255,0.62)", letterSpacing: "0.04em" }}>{desc}</div>
                  </div>
                ))}
              </div>

              {/* Integration proof strip — answers "does this work with our stack?" */}
              <div className="hp-integration-strip" style={{ padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ ...DM, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.38)", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Works with your existing stack</span>
                  <Link href="/integrations" onClick={() => trackCTA("hero_integrations")} style={{ ...DM, fontSize: 10, fontWeight: 600, color: GOLD, textDecoration: "none", letterSpacing: "0.06em" }}>
                    See all integrations →
                  </Link>
                </div>
                {/* Row 1: Microsoft stack */}
                <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ ...DM, fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.22)", letterSpacing: "0.14em", textTransform: "uppercase" as const, minWidth: 80 }}>Microsoft</span>
                  {["Teams", "Outlook", "SharePoint", "Entra", "Azure OpenAI"].map((tool, i, arr) => (
                    <span key={tool} style={{ ...DM, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.65)", padding: "0 10px", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                      {tool}
                    </span>
                  ))}
                </div>
                {/* Row 2: Enterprise systems */}
                <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  <span style={{ ...DM, fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.22)", letterSpacing: "0.14em", textTransform: "uppercase" as const, minWidth: 80 }}>Enterprise</span>
                  {["Salesforce", "ServiceNow", "Workday", "Slack", "Jira", "Okta"].map((tool, i, arr) => (
                    <span key={tool} style={{ ...DM, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.65)", padding: "0 10px", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Inline metric row */}
              <div className="hp-metric-row" style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32 }}>
                {[
                  { n: "12 min",  l: "Trigger to execution" },
                  { n: "3,600×", l: "Execution head start" },
                  { n: "180",    l: "Readiness Protocols" },
                  { n: "231",    l: "Trigger patterns" },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, paddingRight: 20, marginRight: 20, borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                    <div style={{ ...GEO, color: GOLD, fontSize: "clamp(18px,2vw,26px)", fontWeight: 700, lineHeight: 1 }}>{s.n}</div>
                    <div style={{ ...DM, color: "rgba(255,255,255,0.68)", fontSize: 11, marginTop: 6, letterSpacing: "0.04em", fontWeight: 500 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              {/* Fix #1 — What is a Readiness Protocol? */}
              <div style={{ marginTop: 12, padding: "10px 14px", borderLeft: "2px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.04)" }}>
                <span style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.42)", fontStyle: "italic" as const }}>
                  A Readiness Protocol is a pre-built execution package — tasks assigned, owners named, budget allocated, brief written — staged before any trigger fires.{" "}
                </span>
                <a href="/how-it-executes" style={{ ...DM, fontSize: 11, color: GOLD, textDecoration: "none", fontStyle: "italic" as const, opacity: 0.8 }}>See how it executes →</a>
              </div>

              {/* All three strategic domains */}
              <div className="hp-domain-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, marginTop: 28 }}>
                {[
                  { domain: "RISK & RESILIENCE", examples: "Ransomware · Activist investor · Regulatory inquiry · Supply chain collapse · Data breach", color: "#C0392B22", border: "#C0392B55", label: "rgba(192,57,43,0.8)" },
                  { domain: "GROWTH & POSITIONING", examples: "Market entry · Competitor displacement · M&A timing · Go-to-market sprint · Product launch", color: "rgba(201,168,76,0.08)", border: "rgba(201,168,76,0.35)", label: GOLD },
                  { domain: "TRANSFORMATION", examples: "Digital transformation · AI governance · Workforce restructuring · Regulatory overhaul · Platform migration", color: "rgba(43,138,110,0.08)", border: "rgba(43,138,110,0.35)", label: TEAL },
                ].map(d => (
                  <div key={d.domain} style={{ background: d.color, border: `1px solid ${d.border}`, padding: "12px 16px" }}>
                    <div style={{ ...DM, fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: d.label, marginBottom: 5 }}>{d.domain}</div>
                    <div style={{ ...DM, fontSize: 10, color: "rgba(255,255,255,0.52)", lineHeight: 1.6 }}>{d.examples}</div>
                  </div>
                ))}
              </div>

              {/* Outcome proof — what actually moves */}
              <div className="hp-outcome-table" style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" as const, gap: 8 }}>
                {[
                  { label: "Mobilization cycle", before: "30 days", after: "12 minutes" },
                  { label: "Decision latency", before: "Committee alignment", after: "Executive authorizes in real time" },
                  { label: "Readiness score", before: "Static", after: "Compounds with every drill and activation" },
                ].map(o => (
                  <div key={o.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ ...DM, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", minWidth: 120 }}>{o.label}</span>
                    <span style={{ ...DM, fontSize: 10, color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>{o.before}</span>
                    <span style={{ ...DM, fontSize: 10, color: "rgba(255,255,255,0.22)" }}>→</span>
                    <span style={{ ...DM, fontSize: 10, color: GOLD, fontWeight: 600 }}>{o.after}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* RIGHT — Live Simulation Panel */}
          <div style={{ padding: "32px 0 32px 32px", display: "flex", flexDirection: "column", alignItems: "stretch", gap: 10 }}>
            {/* Browser Chrome Frame */}
            <div style={{ borderRadius: "6px 6px 0 0", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.09)" }}>
              <div style={{ background: "rgba(255,255,255,0.055)", padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
                </div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, padding: "3px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                  <span style={{ ...DM, fontSize: 9, color: "rgba(255,255,255,0.32)", letterSpacing: "0.04em" }}>readiness-os.app / live-execution-simulation</span>
                </div>
              </div>
              <HeroSimPanel />
            </div>
            <div style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.35)", textAlign: "center", letterSpacing: "0.03em", fontStyle: "italic" }}>
              Live execution simulation — click the dots to switch trigger scenarios
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── REALITY GAP SIMULATOR ────────────────────────────────────────────────────
function RealityGapSimulator() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [dayCount, setDayCount] = useState(0);
  const [minSecs, setMinSecs] = useState(720);

  const runSim = () => {
    setPhase(0);
    setDayCount(0);
    setMinSecs(720);

    let d = 0;
    const di = setInterval(() => {
      d += 1;
      setDayCount(d);
      if (d >= 30) clearInterval(di);
    }, 3500 / 30);

    setTimeout(() => {
      setPhase(1);
      let s = 720;
      const si = setInterval(() => {
        s = Math.max(0, s - 6);
        setMinSecs(s);
        if (s <= 0) clearInterval(si);
      }, 3500 / 120);
    }, 4200);

    setTimeout(() => setPhase(2), 8400);
  };

  useEffect(() => {
    const t = setTimeout(runSim, 900);
    return () => clearTimeout(t);
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const BC = { fontFamily: "'Barlow Condensed', sans-serif" } as const;
  const CG = { fontFamily: "'Cormorant Garamond', Georgia, serif" } as const;

  const BEFORE = [
    "Analysts scoping the situation from scratch",
    "Leadership debating who owns the response",
    "Stakeholders scheduled for alignment calls",
    "Briefs drafted under live pressure",
    "Budgets estimated without pre-approval",
    "30 days — before execution even begins",
  ];
  const AFTER = [
    "Protocol matched — 11 tasks pre-staged",
    "Authority chain configured — CEO notified",
    "Budget envelope pre-approved — $2.4M ready",
    "Stakeholders notified with full context",
    "Executive authorizes in a single decision",
    "12 minutes — full response underway",
  ];

  return (
    <section style={{ background: "#040716", borderBottom: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 40px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap" as const, gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 28, height: 1.5, background: GOLD }} />
            <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>The Mobilization Gap</span>
            <span style={{ ...BC, fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em" }}>— feel it in 10 seconds</span>
          </div>
          <button
            onClick={runSim}
            style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, padding: "6px 16px", background: "transparent", border: "1px solid rgba(255,255,255,0.16)", color: "rgba(255,255,255,0.38)", cursor: "pointer" }}
          >
            ↺ Replay
          </button>
        </div>

        {/* Two-panel simulator */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 2 }}>

          {/* BEFORE */}
          <div style={{ padding: "32px 28px", background: phase === 0 ? "rgba(192,57,43,0.11)" : "rgba(255,255,255,0.015)", border: `1px solid ${phase === 0 ? "rgba(192,57,43,0.45)" : "rgba(255,255,255,0.06)"}`, transition: "all 0.6s ease", position: "relative" as const }}>
            {phase === 0 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to right,#C0392B,transparent)" }} />}
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: phase === 0 ? "#E74C3C" : "rgba(255,255,255,0.18)", marginBottom: 18, transition: "color 0.6s" }}>Without Readiness OS</div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ ...CG, fontSize: 68, fontWeight: 700, lineHeight: 1, color: phase === 0 ? "#E74C3C" : "rgba(255,255,255,0.12)", transition: "color 0.6s" }}>{dayCount}</div>
              <div style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: phase === 0 ? "rgba(231,76,60,0.65)" : "rgba(255,255,255,0.12)", transition: "color 0.6s" }}>Days — mobilization still in progress</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 7 }}>
              {BEFORE.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, opacity: phase === 0 ? (i < Math.ceil(dayCount / 5) ? 1 : 0.07) : 0.1, transition: "opacity 0.35s" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#E74C3C", flexShrink: 0, marginTop: 6, opacity: 0.65 }} />
                  <span style={{ ...BC, fontSize: 13, color: "rgba(231,76,60,0.8)", lineHeight: 1.45 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AFTER */}
          <div style={{ padding: "32px 28px", background: phase >= 1 ? "rgba(43,138,110,0.09)" : "rgba(255,255,255,0.015)", border: `1px solid ${phase >= 1 ? "rgba(43,138,110,0.42)" : "rgba(255,255,255,0.06)"}`, transition: "all 0.6s ease", position: "relative" as const }}>
            {phase >= 1 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right,${TEAL},transparent)` }} />}
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: phase >= 1 ? TEAL : "rgba(255,255,255,0.18)", marginBottom: 18, transition: "color 0.6s" }}>With Readiness OS</div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ ...CG, fontSize: 68, fontWeight: 700, lineHeight: 1, color: phase >= 1 ? TEAL : "rgba(255,255,255,0.12)", transition: "color 0.6s" }}>{fmt(minSecs)}</div>
              <div style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: phase >= 1 ? "rgba(43,138,110,0.65)" : "rgba(255,255,255,0.12)", transition: "color 0.6s" }}>Minutes — response fully underway</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 7 }}>
              {AFTER.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, opacity: phase >= 1 ? (i < Math.ceil((720 - minSecs) / 120) ? 1 : 0.07) : 0.07, transition: "opacity 0.35s" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: TEAL, flexShrink: 0, marginTop: 6, opacity: 0.7 }} />
                  <span style={{ ...BC, fontSize: 13, color: "rgba(43,138,110,0.88)", lineHeight: 1.45 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Result strip */}
        <div style={{ padding: "26px 32px", background: phase === 2 ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.015)", border: `1px solid ${phase === 2 ? "rgba(201,168,76,0.32)" : "rgba(255,255,255,0.05)"}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 20, transition: "all 0.6s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" as const }}>
            <div style={{ textAlign: "center" as const }}>
              <div style={{ ...CG, fontSize: 34, fontWeight: 700, lineHeight: 1, color: phase === 2 ? "#E74C3C" : "rgba(255,255,255,0.12)", transition: "color 0.6s" }}>30 days</div>
              <div style={{ ...BC, fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase" as const }}>Old model</div>
            </div>
            <div style={{ ...BC, fontSize: 24, color: GOLD, fontWeight: 700, opacity: phase === 2 ? 1 : 0.08, transition: "opacity 0.6s" }}>→</div>
            <div style={{ textAlign: "center" as const }}>
              <div style={{ ...CG, fontSize: 34, fontWeight: 700, lineHeight: 1, color: phase === 2 ? TEAL : "rgba(255,255,255,0.12)", transition: "color 0.6s" }}>12 minutes</div>
              <div style={{ ...BC, fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase" as const }}>Readiness OS</div>
            </div>
            <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.09)", flexShrink: 0 }} />
            <div>
              <div style={{ ...CG, fontSize: 40, fontWeight: 700, lineHeight: 1, color: phase === 2 ? GOLD : "rgba(255,255,255,0.1)", transition: "color 0.6s" }}>3,600×</div>
              <div style={{ ...BC, fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase" as const }}>Execution Head Start</div>
            </div>
          </div>
          <a
            href="/founding-partner-program"
            style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "13px 26px", background: phase === 2 ? GOLD : "transparent", color: phase === 2 ? NAVY : "rgba(255,255,255,0.18)", textDecoration: "none", border: `1px solid ${phase === 2 ? GOLD : "rgba(255,255,255,0.09)"}`, transition: "all 0.6s ease", display: "inline-block", whiteSpace: "nowrap" as const }}
          >
            Make This Real →
          </a>
        </div>

      </div>
    </section>
  );
}

// ─── EXECUTION CHAIN ──────────────────────────────────────────────────────────
function ExecChainSection() {
  const BC2: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
  const GEO2: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

  const CHAINS = [
    {
      domain: "GROWTH & POSITIONING", color: GOLD,
      trigger: "Activist Investor Files 13D — 9.2% Stake",
      protocol: "Protocol #031",
      phases: [
        { label: "SIGNAL DETECTED",    timing: "0:06",  detail: "SEC 13D detected — Elliott Management, 9.2% stake" },
        { label: "PROTOCOL MATCHED",  timing: "1:10",  detail: "Protocol #031 matched · 11 tasks staged automatically" },
        { label: "TASKS STAGED",      timing: "2:30",  detail: "Board brief · banker engagement · comms pre-staged" },
        { label: "CEO AUTHORIZES",    timing: "4:00",  detail: "CEO authorizes — defense protocol activated" },
        { label: "EXECUTION UNDERWAY", timing: "12:00", detail: "Response live · 3,600× mobilization head start" },
      ],
    },
    {
      domain: "RISK & RESILIENCE", color: TEAL,
      trigger: "FDA Class I Recall — Contamination Signal",
      protocol: "Protocol #058",
      phases: [
        { label: "SIGNAL DETECTED",    timing: "0:12",  detail: "Contamination signal — 3 production lot IDs flagged" },
        { label: "PROTOCOL MATCHED",  timing: "1:30",  detail: "Protocol #058 matched · 9 tasks staged automatically" },
        { label: "TASKS STAGED",      timing: "3:00",  detail: "FDA filing · distribution hold · consumer advisory staged" },
        { label: "CRO AUTHORIZES",    timing: "4:30",  detail: "CRO authorizes — recall sequence unlocked" },
        { label: "EXECUTION UNDERWAY", timing: "12:00", detail: "Response live · recall contained · $340M liability avoided" },
      ],
    },
    {
      domain: "TRANSFORMATION", color: IVORY,
      trigger: "Market Entry Sprint — 6 Countries, 90-Day Window",
      protocol: "Protocol #089",
      phases: [
        { label: "SIGNAL DETECTED",    timing: "0:05",  detail: "Board greenlights expansion — 90-day execution window" },
        { label: "PROTOCOL MATCHED",  timing: "1:15",  detail: "Protocol #089 matched · 12 tasks staged automatically" },
        { label: "TASKS STAGED",      timing: "2:30",  detail: "6 regional briefs · legal entity staging · distribution" },
        { label: "CRO AUTHORIZES",    timing: "4:00",  detail: "CRO authorizes — 6-market protocol activated" },
        { label: "EXECUTION UNDERWAY", timing: "12:00", detail: "Response live · all 6 markets mobilized · $280M pipeline" },
      ],
    },
  ];

  const [activeDomain, setActiveDomain] = useState(0);
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setActivePhase(0);
    const DELAYS = [2200, 1800, 1800, 1800, 3400];
    const runCycle = async (start = 0) => {
      for (let i = start; i < 5; i++) {
        if (cancelled) return;
        setActivePhase(i);
        await new Promise<void>(resolve => setTimeout(resolve, DELAYS[i]));
      }
      if (!cancelled) runCycle(0);
    };
    runCycle();
    return () => { cancelled = true; };
  }, [activeDomain]);

  const chain = CHAINS[activeDomain];
  const dc = chain.color;

  return (
    <section style={{ background: "rgba(4,7,22,0.99)", borderTop: `3px solid ${dc}`, borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "border-color 0.5s ease" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 40px 36px" }}>

        {/* Header row — label + domain selector */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap" as const, gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 28, height: 1.5, background: dc, transition: "background 0.5s" }} />
            <span style={{ ...BC2, fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: dc, transition: "color 0.5s" }}>
              The 12-Minute Execution Chain
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
            {CHAINS.map((c, i) => (
              <button
                key={c.domain}
                onClick={() => setActiveDomain(i)}
                style={{
                  ...BC2,
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.16em",
                  textTransform: "uppercase" as const,
                  padding: "5px 12px",
                  background: i === activeDomain ? `${c.color}18` : "transparent",
                  border: `1px solid ${i === activeDomain ? c.color : "rgba(255,255,255,0.14)"}`,
                  color: i === activeDomain ? c.color : "rgba(255,255,255,0.36)",
                  cursor: "pointer",
                  transition: "all 0.25s",
                }}
              >
                {c.domain}
              </button>
            ))}
          </div>
        </div>

        {/* Trigger context line */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" as const }}>
          <span style={{ ...BC2, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.26)", letterSpacing: "0.16em", textTransform: "uppercase" as const }}>Trigger:</span>
          <span style={{ ...GEO2, fontSize: 17, fontWeight: 600, color: "#fff" }}>{chain.trigger}</span>
          <span style={{ ...BC2, fontSize: 9, fontWeight: 700, color: dc, padding: "3px 9px", border: `1px solid ${dc}44`, letterSpacing: "0.1em", transition: "color 0.5s, border-color 0.5s" }}>{chain.protocol}</span>
        </div>

        {/* 5-phase execution chain */}
        <div style={{ display: "flex", alignItems: "stretch", marginBottom: 28 }}>
          {chain.phases.map((phase, i) => {
            const isActive = i === activePhase;
            const isPast = i < activePhase;
            return (
              <Fragment key={i}>
                <div
                  style={{
                    flex: 1,
                    padding: "16px 14px",
                    background: isActive ? `${dc}14` : isPast ? `${dc}06` : "rgba(255,255,255,0.015)",
                    borderTop: `1px solid ${isActive ? dc : isPast ? `${dc}28` : "rgba(255,255,255,0.07)"}`,
                    borderRight: `1px solid ${isActive ? dc : isPast ? `${dc}28` : "rgba(255,255,255,0.07)"}`,
                    borderBottom: `1px solid ${isActive ? dc : isPast ? `${dc}28` : "rgba(255,255,255,0.07)"}`,
                    borderLeft: i === 0 ? `1px solid ${isActive ? dc : isPast ? `${dc}28` : "rgba(255,255,255,0.07)"}` : "none",
                    transition: "all 0.45s ease",
                    opacity: isActive ? 1 : isPast ? 0.72 : 0.28,
                    position: "relative" as const,
                  }}
                >
                  <div style={{ ...BC2, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", color: isActive ? dc : "rgba(255,255,255,0.38)", textTransform: "uppercase" as const, marginBottom: 7, transition: "color 0.45s" }}>
                    {phase.label}
                  </div>
                  <div style={{ ...GEO2, fontSize: 24, fontWeight: 700, color: isActive ? dc : "#fff", lineHeight: 1, marginBottom: 7, transition: "color 0.45s" }}>
                    {phase.timing}
                  </div>
                  <div style={{ ...BC2, fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                    {phase.detail}
                  </div>
                  {isActive && (
                    <div style={{ position: "absolute" as const, bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${dc}, transparent)` }} />
                  )}
                </div>
                {i < 4 && (
                  <div style={{ width: 26, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ color: isPast || isActive ? dc : "rgba(255,255,255,0.12)", fontSize: 13, transition: "color 0.45s" }}>→</span>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>

        {/* Bottom CTAs */}
        <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" as const }}>
          <Link
            href="/how-it-executes"
            style={{ ...BC2, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: dc, textDecoration: "none", transition: "color 0.5s" }}
          >
            Watch the full chain execute →
          </Link>
          <span style={{ color: "rgba(255,255,255,0.12)", fontSize: 12 }}>|</span>
          <Link
            href="/12-minute-experience"
            style={{ ...BC2, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.32)", textDecoration: "none" }}
          >
            Run the 12-minute test drive →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── SCENARIO HOOK ────────────────────────────────────────────────────────────
function ScenarioHookSection() {
  return (
    <section className="hp-section-reduce" style={{ background: NAVY, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "72px 0 56px" }}>
      <div style={{ ...CONTAINER }}>
        <div style={{ maxWidth: 760 }}>

          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{ width: 28, height: 1.5, background: GOLD }} />
            <span style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>
              The Readiness Question
            </span>
          </div>

          {/* Lead statement */}
          <p style={{ ...GEO, fontSize: "clamp(22px,2.8vw,34px)", fontWeight: 600, color: "#fff", lineHeight: 1.25, marginBottom: 28 }}>
            One of these scenarios will hit your organization.<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>The question is whether the response is already staged.</em>
          </p>

          {/* Four questions — the gut punch */}
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px 0", marginBottom: 24 }}>
            {["Who calls who?", "Where's the brief?", "Who owns it?", "Who authorizes?"].map((q, i, arr) => (
              <span key={q} style={{ ...DM, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.88)" }}>
                {q}{i < arr.length - 1 && <span style={{ color: GOLD, margin: "0 10px" }}>·</span>}
              </span>
            ))}
          </div>

          {/* Context */}
          <p style={{ ...DM, fontSize: 14, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 660, marginBottom: 32 }}>
            Most organizations — startup to Fortune 500 — spend 30 days figuring that out. While the window closes, the regulator moves, the competitor acts. Below is what having the response pre-staged looks like instead.
          </p>

          {/* Bridge line */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 1, height: 32, background: `linear-gradient(to bottom, ${GOLD}, transparent)` }} />
            <span style={{ ...DM, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.65)", textTransform: "uppercase" as const }}>
              Select a scenario to see the full 12-minute execution
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── SCENARIO CARDS ROW ───────────────────────────────────────────────────────
function ScenarioCardsRow() {
  const SCENARIOS = [
    {
      domain: "GROWTH & POSITIONING",
      label: "Competitor Cuts Price 20%",
      sub: "It hit the news 11 minutes ago. Your sales team is already getting calls. Three deals in final negotiation just went silent.",
      accent: GOLD,
      href: "/demo-experience?s=0",
    },
    {
      domain: "RISK & RESILIENCE",
      label: "Systems Down at 3am",
      sub: "Transactions failing. Customers locked out. Six hours until your largest enterprise customers start their business day.",
      accent: TEAL,
      href: "/demo-experience?s=1",
    },
    {
      domain: "RISK & RESILIENCE",
      label: "Federal Agency Opens Inquiry",
      sub: "Formal inquiry into your pricing practices. 48 hours to respond. Finance, Legal, Operations, and Communications must align before anyone speaks publicly.",
      accent: TEAL,
      href: "/demo-experience?s=2",
    },
    {
      domain: "RISK & RESILIENCE",
      label: "Activist Investor 13D Filing",
      sub: "An activist just disclosed an 8.7% stake. Demanding two board seats and a strategic review. Stock is moving. Board wants a call tonight.",
      accent: TEAL,
      href: "/demo-experience?s=3",
    },
    {
      domain: "GROWTH & POSITIONING",
      label: "Your Second Largest Customer",
      sub: "Just asked for a meeting with no agenda. Contract renews in 60 days. Usage declining. Account team says they have been talking to your competitor.",
      accent: GOLD,
      href: "/demo-experience?s=4",
    },
  ];

  return (
    <div style={{ background: NAVY, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <style>{`
        .hp-scenario-grid { display: grid; grid-template-columns: repeat(5, 1fr); }
        .hp-scenario-footer { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
        @media (max-width: 960px) {
          .hp-scenario-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 520px) {
          .hp-scenario-grid { grid-template-columns: 1fr !important; }
          .hp-scenario-footer { flex-direction: column; }
        }
      `}</style>

      <div style={{ ...CONTAINER }}>

        {/* Campaign framing header */}
        <div style={{ padding: "32px 0 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap" as const, gap: 16 }}>
          <div>
            <div style={{ ...DM, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.22em", textTransform: "uppercase" as const, marginBottom: 8 }}>
              5 Situations · Happening at companies right now
            </div>
            <div style={{ ...GEO, fontSize: "clamp(18px,2vw,24px)", fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>
              If any of these happened today — how would your company respond?
            </div>
          </div>
          <Link href="/demo-hub" style={{ ...DM, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.38)", textDecoration: "none", letterSpacing: "0.06em", whiteSpace: "nowrap" as const, flexShrink: 0 }}>
            See all 19 simulations →
          </Link>
        </div>

        {/* 5 scenario cards */}
        <div className="hp-scenario-grid" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {SCENARIOS.map((item, i) => (
            <Link key={i} href={item.href} style={{
              display: "block", padding: "22px 20px 20px",
              borderRight: i < 4 ? "1px solid rgba(255,255,255,0.07)" : "none",
              borderTop: `2px solid ${item.accent}`,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ ...DM, color: item.accent, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 8 }}>{item.domain}</div>
              <div style={{ ...DM, color: "#fff", fontSize: 13, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>{item.label}</div>
              <div style={{ ...DM, color: "rgba(255,255,255,0.62)", fontSize: 11, lineHeight: 1.6, marginBottom: 14 }}>{item.sub}</div>
              <span style={{ ...DM, color: item.accent, fontSize: 11, fontWeight: 600 }}>See the response →</span>
            </Link>
          ))}
        </div>

        {/* 30 days → 12 minutes + demo CTA */}
        <div className="hp-scenario-footer" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "22px 0 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" as const }}>
            <div style={{ textAlign: "center" as const }}>
              <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.28)", textDecoration: "line-through", lineHeight: 1 }}>30 days</div>
              <div style={{ ...DM, fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginTop: 3 }}>Traditional mobilization</div>
            </div>
            <div style={{ ...DM, fontSize: 20, color: GOLD, fontWeight: 700, lineHeight: 1 }}>→</div>
            <div style={{ textAlign: "center" as const }}>
              <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: GOLD, lineHeight: 1 }}>12 minutes</div>
              <div style={{ ...DM, fontSize: 9, color: GOLD, opacity: 0.65, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginTop: 3 }}>Readiness OS</div>
            </div>
            <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.1)", margin: "0 6px" }} />
            <div style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.55, maxWidth: 220 }}>
              The response for every one of these is pre-staged and ready.
            </div>
          </div>
          <Link href="/demo-experience" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 10, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 12, padding: "13px 28px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const, flexShrink: 0 }}>
            Watch a Full Activation →
          </Link>
        </div>

      </div>
    </div>
  );
}

// ─── MICROSOFT HOOK STRIP (early objection handler) ───────────────────────────
function MicrosoftHookStrip() {
  return (
    <div style={{ background: "#060B1E", borderTop: "1px solid rgba(201,168,76,0.12)", borderBottom: "1px solid rgba(201,168,76,0.12)", padding: "28px 0" }}>
      <div style={{ ...CONTAINER, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" as const }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 8 }}>The Operating Model Gap</div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(17px,2vw,24px)", fontWeight: 600, color: "#F0EDE4", lineHeight: 1.3 }}>
            Every enterprise has Microsoft's AI stack.{" "}
            <em style={{ color: GOLD }}>None have the operating model to use it.</em>
          </div>
          <div style={{ ...DM, fontSize: 12, color: "rgba(240,237,228,0.45)", marginTop: 8, lineHeight: 1.5 }}>
            The orchestration layer that finally makes your $300B+ Microsoft AI investment deliver strategic speed.
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, alignItems: "center" }}>
          {["Azure AI", "Copilot", "Teams", "M365", "Entra"].map(name => (
            <span key={name} style={{ ...DM, fontSize: 10, fontWeight: 600, color: "rgba(240,237,228,0.4)", padding: "5px 12px", border: "1px solid rgba(255,255,255,0.1)", letterSpacing: "0.06em" }}>{name}</span>
          ))}
          <span style={{ ...DM, fontSize: 11, color: GOLD, fontWeight: 700, padding: "5px 14px", marginLeft: 6 }}>+ Readiness OS →</span>
        </div>
        <a href="/ai-stack" style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: TEAL, textDecoration: "none", borderBottom: "1px solid rgba(43,138,110,0.4)", paddingBottom: 2, whiteSpace: "nowrap" as const }}>
          See the full stack →
        </a>
      </div>
    </div>
  );
}

// ─── 3-STEP HOW IT EXECUTES ───────────────────────────────────────────────────
function ThreeStepSection() {
  return (
    <div style={{ background: "#F8F7F4", borderTop: "1px solid #E8E4DC", borderBottom: "1px solid #E8E4DC" }}>
      <div style={{ ...CONTAINER, paddingTop: 48, paddingBottom: 48 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 6 }}>How It Executes</div>
          <div style={{ ...GEO, fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 600, color: NAVY }}>Three steps. 12 minutes. No coordination meeting.</div>
        </div>
        <div className="hp-three-step-grid" style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr 40px 1fr", alignItems: "center", gap: 0 }}>
          {[
            { n: "01", title: "Signal detected", desc: "Continuous monitoring scores 231 trigger patterns. Risk score exceeds threshold — Protocol selected in under 2 seconds.", color: GOLD },
            { n: "02", title: "Executive authorizes", desc: "Authorization request delivered to inbox. CEO, COO, or designated executive signs off — budget unlocks, response stages.", color: TEAL },
            { n: "03", title: "Coordinated execution", desc: "Tasks seeded, roles assigned, Teams channel live, war room active. Every stakeholder knows their role before they ask.", color: NAVY },
          ].map((step, i) => (
            <Fragment key={step.n}>
              <div style={{ background: "#fff", border: `1px solid #E8E4DC`, borderTop: `3px solid ${step.color}`, padding: "28px 28px" }}>
                <div style={{ ...DM, fontSize: 11, fontWeight: 800, color: step.color, letterSpacing: "0.12em", marginBottom: 10 }}>STEP {step.n}</div>
                <div style={{ ...GEO, fontSize: 18, fontWeight: 600, color: NAVY, marginBottom: 10, lineHeight: 1.25 }}>{step.title}</div>
                <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.65 }}>{step.desc}</div>
              </div>
              {i < 2 && <div className="hp-step-arrow" style={{ textAlign: "center", fontSize: 18, color: "rgba(10,15,46,0.2)", fontWeight: 300 }}>→</div>}
            </Fragment>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <a href="/how-it-executes" style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: NAVY, textDecoration: "none", borderBottom: `1px solid rgba(10,15,46,0.25)`, paddingBottom: 2 }}>
            See the full animated execution chain →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── PLATFORM SCREENSHOT GALLERY ──────────────────────────────────────────────
const SCREENSHOT_TABS = [
  {
    id: "signals",
    label: "Signal Detection",
    tag: "MONITORING",
    src: "/screenshots/deck_signals.jpg",
    headline: "231 trigger patterns monitored — continuously, automatically.",
    desc: "The platform ingests signals across regulatory feeds, competitive intelligence, financial indicators, and operational data. When a pattern crosses threshold, the matched Readiness Protocol is staged — before anyone is paged.",
    color: TEAL,
  },
  {
    id: "protocols",
    label: "Protocol Library",
    tag: "READINESS",
    src: "/screenshots/protocol_library_v2.jpg",
    headline: "180 Readiness Protocols — pre-staged across every strategic domain.",
    desc: "Each protocol contains pre-assigned owners, a three-phase task sequence, a pre-staged communication chain, a pre-drafted document package, a pre-authorized budget envelope, and a decision authority map. Nothing is figured out under pressure.",
    color: GOLD,
  },
  {
    id: "activation",
    label: "Activation Console",
    tag: "EXECUTION",
    src: "/screenshots/deck_activation.jpg",
    headline: "From trigger detection to coordinated execution in 12 minutes.",
    desc: "When an executive authorizes, the war room is live — tasks seeded, roles assigned, Teams channels opened, stakeholders notified. The mobilization already happened. The 12 minutes is just the final confirmation.",
    color: GOLD,
  },
  {
    id: "command",
    label: "Command Tower",
    tag: "INTELLIGENCE",
    src: "/screenshots/new_command_tower.jpg",
    headline: "Real-time executive visibility across every active and staged protocol.",
    desc: "The Command Tower gives leadership a continuous view of trigger detections, protocol readiness scores, active authorizations, and system health — without a status meeting, without a dashboard refresh request.",
    color: TEAL,
  },
] as const;

function PlatformScreenshotSection() {
  const [active, setActive] = useState<number>(0);
  const tab = SCREENSHOT_TABS[active];
  return (
    <section id="hp-platform-gallery" style={{ background: NAVY, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "88px 0 72px" }}>
      <div style={{ ...CONTAINER }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>Platform in Action</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px,3vw,40px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 14px" }}>
            See what readiness looks like<br /><span style={{ color: GOLD }}>when it's already staged.</span>
          </h2>
          <p style={{ ...DM, color: "rgba(255,255,255,0.62)", fontSize: 14, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            Four views into the platform — from trigger detection to executive execution. Every screen you see is live in the platform, not a mockup.
          </p>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.1)", justifyContent: "center", flexWrap: "wrap" as const }}>
          {SCREENSHOT_TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              style={{
                ...DM, background: "transparent", border: "none", cursor: "pointer",
                padding: "14px 28px", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.08em", textTransform: "uppercase" as const,
                color: i === active ? "#fff" : "rgba(255,255,255,0.42)",
                borderBottom: i === active ? `2px solid ${t.color}` : "2px solid transparent",
                transition: "all 0.2s ease", marginBottom: -1,
                whiteSpace: "nowrap" as const,
              }}
            >
              <span style={{ fontSize: 9, letterSpacing: "0.14em", color: i === active ? t.color : "rgba(255,255,255,0.25)", marginRight: 8 }}>{t.tag}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Browser chrome + screenshot */}
        <div style={{ borderRadius: "6px 6px 0 0", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)" }}>
          {/* Chrome bar */}
          <div style={{ background: "#0d1326", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, padding: "3px 20px", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(43,138,110,0.6)" }} />
                <span style={{ ...DM, fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>readiness.vaughnmartin.com</span>
              </div>
            </div>
            <div style={{ ...DM, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: tab.color, padding: "3px 10px", border: `1px solid ${tab.color}33`, background: `${tab.color}11` }}>
              {tab.tag}
            </div>
          </div>
          {/* Screenshot */}
          <div style={{ position: "relative", lineHeight: 0 }}>
            <img
              key={tab.id}
              src={tab.src}
              alt={tab.label}
              style={{ width: "100%", display: "block", transition: "opacity 0.25s ease" }}
              loading="lazy"
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, rgba(10,15,46,0.85) 100%)", pointerEvents: "none" }} />
          </div>
        </div>

        {/* Caption below screenshot */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderTop: "none", padding: "28px 36px", display: "flex", alignItems: "flex-start", gap: 32, flexWrap: "wrap" as const }}>
          <div style={{ flex: "1 1 300px" }}>
            <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: tab.color, marginBottom: 8, textTransform: "uppercase" as const }}>{tab.tag}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(16px,1.6vw,20px)", fontWeight: 600, color: "#fff", lineHeight: 1.35, marginBottom: 0 }}>{tab.headline}</div>
          </div>
          <div style={{ flex: "1 1 340px" }}>
            <p style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.68)", lineHeight: 1.75, margin: 0 }}>{tab.desc}</p>
          </div>
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            <a href="/demo-experience" style={{ ...DM, background: "transparent", border: `1px solid ${tab.color}66`, color: tab.color, fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "12px 24px", textDecoration: "none", whiteSpace: "nowrap" as const }}>
              See Full Demo →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── ANATOMY OF A READINESS PROTOCOL ─────────────────────────────────────────
function AnatomySection() {
  return (
    <section id="hp-anatomy" className="hp-section-reduce" style={{ background: "#0d1a3e", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "88px 0" }}>
      <div style={{ ...CONTAINER }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 56, gap: 32, flexWrap: "wrap" as const }}>
          <Reveal>
            <div>
              <div style={{ ...DM, color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: 16 }}>
                What's Inside Every Readiness Protocol
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#fff", fontSize: "clamp(26px,3vw,40px)", fontWeight: 700, lineHeight: 1.1, margin: 0 }}>
                Not a template. Not a checklist.<br />
                <span style={{ color: GOLD }}>A complete mobilization package.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ ...DM, color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 1.75, margin: 0, maxWidth: 340, textAlign: "right" as const }}>
              Each of the 180 Readiness Protocols contains all six components — pre-built, pre-approved, and pre-staged before the trigger fires.
            </p>
          </Reveal>
        </div>

        {/* Six-component grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
          {[
            { num: "01", label: "Pre-Assigned Executive Owners",   body: "Every task has a named owner — not a role, a person. They were in the room when the protocol was built, challenged it before pressure existed, and signed off before the trigger fired.", accent: GOLD },
            { num: "02", label: "Three-Phase Task Sequence",        body: "Tasks are organized across IMMEDIATE (minutes 0–12), SECONDARY (hours 1–4), and FOLLOW-UP (days 1–5). Sequence is pre-determined. Nothing is figured out under pressure.", accent: TEAL },
            { num: "03", label: "Pre-Staged Communication Chain",   body: "Board notification, stakeholder alerts, external partner briefs, and public communications are drafted, sequenced, and staged — ready for executive authorization at the moment of activation.", accent: GOLD },
            { num: "04", label: "Pre-Drafted Document Package",     body: "Execution briefs, board-ready reports, legal hold notices, and scenario-specific documents are pre-written for the specific situation. The executive reviews, not authors, under pressure.", accent: TEAL },
            { num: "05", label: "Pre-Authorized Budget Envelope",   body: "Spending authority is defined in advance by scenario type and severity. Finance does not convene. Resources deploy within the pre-approved envelope at the moment of activation.", accent: GOLD },
            { num: "06", label: "Decision Authority Map",           body: "Who authorizes. Who executes. Who observes. Defined before the trigger — not negotiated during it. Executive authority is preserved at every step. No Readiness Protocol activates without sign-off.", accent: TEAL },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div style={{ background: "#0d1a3e", padding: "32px 32px 28px", height: "100%", boxSizing: "border-box" as const }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ ...DM, color: item.accent, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em" }}>{item.num}</span>
                  <div style={{ flex: 1, height: 1, background: `${item.accent}33` }} />
                </div>
                <div style={{ ...DM, color: "#fff", fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 10 }}>{item.label}</div>
                <div style={{ ...DM, color: "rgba(255,255,255,0.75)", fontSize: 12.5, lineHeight: 1.7 }}>{item.body}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Closing quote */}
        <Reveal delay={0.3}>
          <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <span style={{ ...DM, color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 500, textAlign: "center" as const, maxWidth: 660 }}>
              "The competitor can buy the platform. They cannot buy the accumulated decision logic embedded in the preparation phase." — Dr. Kerry Huang, ESI Top 1% Researcher · 408-firm study
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          </div>
        </Reveal>

      </div>
    </section>
  );
}

// ─── SECTION 6b: Platform Architecture ──────────────────────────────────────
function PlatformArchitectureSection() {
  return (
    <section id="hp-platform" className="hp-section-reduce" style={{ background: "#F8F7F4", padding: "96px 0", position: "relative", borderTop: "1px solid #E8E4DC" }}>
      <div style={{ ...CONTAINER }}>

        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.5)" }} />
              <span style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD }}>Platform Architecture</span>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.5)" }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 16 }}>
              Start with 180 protocols.<br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>Build the rest from scratch.</em>
            </h2>
            <p style={{ ...DM, fontSize: 16, color: "#4A5568", maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
              Three layers, each deployable independently. Together they replace the 40-year-old coordination model with infrastructure that executes at the speed of detection.
            </p>
          </div>
        </Reveal>

        {/* Three-tier cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, border: "1px solid #E8E4DC", marginBottom: 48 }}>

          {/* Tier 1 — Core */}
          <Reveal delay={0}>
            <div style={{ padding: "40px 36px", borderRight: "1px solid #E8E4DC", borderTop: `4px solid ${NAVY}`, height: "100%", boxSizing: "border-box" as const }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: NAVY, opacity: 0.55, marginBottom: 6 }}>Tier 1</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 27, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 14 }}>Readiness OS Core</h3>
              <p style={{ ...DM, fontSize: 13.5, color: "#4A5568", lineHeight: 1.7, marginBottom: 24 }}>
                180 pre-staged Readiness Protocols, continuous signal monitoring across 231 strategic triggers, and the 12-minute execution engine. Available on day one — for every organization in every industry.
              </p>
              <div style={{ borderTop: "1px solid #E8E4DC", paddingTop: 18 }}>
                {[
                  "180 Readiness Protocols — ready before any trigger fires",
                  "231 strategic triggers continuously monitored",
                  "12-minute trigger-to-coordination execution",
                  "Executive authority preserved at every step",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, background: NAVY, flexShrink: 0, marginTop: 6 }} />
                    <span style={{ ...DM, fontSize: 12.5, color: "#374151", lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24, padding: "10px 16px", background: "rgba(10,15,46,0.05)", borderLeft: `3px solid ${NAVY}` }}>
                <span style={{ ...DM, fontSize: 11, fontWeight: 700, color: NAVY }}>Available now · Immediate deployment</span>
              </div>
            </div>
          </Reveal>

          {/* Tier 2 — Industry Packs */}
          <Reveal delay={0.1}>
            <div style={{ padding: "40px 36px", borderRight: "1px solid #E8E4DC", borderTop: `4px solid ${TEAL}`, height: "100%", boxSizing: "border-box" as const }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 6 }}>Tier 2</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 27, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 14 }}>Industry Protocol Packs</h3>
              <p style={{ ...DM, fontSize: 13.5, color: "#4A5568", lineHeight: 1.7, marginBottom: 24 }}>
                Pre-configured protocol libraries built around the trigger patterns specific to your industry. Reduces deployment time from weeks to days — because the protocols already match your regulatory, competitive, and operational reality.
              </p>
              <div style={{ borderTop: "1px solid #E8E4DC", paddingTop: 18 }}>
                {[
                  "Financial Services — activist, regulatory, cyber",
                  "Healthcare — recall, FDA action, supply chain",
                  "Energy — grid events, regulatory, infrastructure",
                  "Manufacturing, Pharma, Technology packs included",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, background: TEAL, flexShrink: 0, marginTop: 6 }} />
                    <span style={{ ...DM, fontSize: 12.5, color: "#374151", lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24, padding: "10px 16px", background: "rgba(43,138,110,0.07)", borderLeft: `3px solid ${TEAL}` }}>
                <span style={{ ...DM, fontSize: 11, fontWeight: 700, color: TEAL }}>6 industry packs · Sector-specific depth</span>
              </div>
            </div>
          </Reveal>

          {/* Tier 3 — Protocol Builder */}
          <Reveal delay={0.2}>
            <div style={{ padding: "40px 36px", borderTop: `4px solid ${GOLD}`, height: "100%", boxSizing: "border-box" as const }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 6 }}>Tier 3</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 27, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 14 }}>Protocol Builder</h3>
              <p style={{ ...DM, fontSize: 13.5, color: "#4A5568", lineHeight: 1.7, marginBottom: 24 }}>
                Build custom Readiness Protocols from scratch for scenarios unique to your organization, your structure, and your decision authority. The 180 core protocols and industry packs cover the patterns we anticipated. The Protocol Builder covers everything else.
              </p>
              <div style={{ borderTop: "1px solid #E8E4DC", paddingTop: 18 }}>
                {[
                  "Custom trigger conditions and signal thresholds",
                  "Organization-specific task sequences and owners",
                  "Approval workflows and decision authority mapping",
                  "Co-designed with Founding Partners in 2025",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, background: GOLD, flexShrink: 0, marginTop: 6 }} />
                    <span style={{ ...DM, fontSize: 12.5, color: "#374151", lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24, padding: "10px 16px", background: "rgba(201,168,76,0.08)", borderLeft: `3px solid ${GOLD}` }}>
                <span style={{ ...DM, fontSize: 11, fontWeight: 700, color: "#8B6914" }}>In development · Founding Partner co-design</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Connector statement */}
        <Reveal delay={0.2}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" as const }}>
            <div style={{ flex: 1, height: 1, background: "#E8E4DC", maxWidth: 140 }} />
            <p style={{ ...DM, fontSize: 13, color: "#6B7280", textAlign: "center" as const, maxWidth: 620, lineHeight: 1.75 }}>
              Most organizations start with Tier 1 and an Industry Pack. Founding Partners get early access to the Protocol Builder — and their operational logic shapes how it gets built.
            </p>
            <div style={{ flex: 1, height: 1, background: "#E8E4DC", maxWidth: 140 }} />
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
      num: "00", title: "You Find Out Too Late", time: "T+Unknown",
      timeLabel: "Already Behind",
      body: "A competitor filed. A regulator moved. A market window opened. Your organization finds out from a news headline, a public announcement, a filing you weren't watching. The situation had already developed — days or weeks before your monitoring caught it.",
      accent: RED_BORDER, terminal: false,
    },
    {
      num: "01", title: "The Situation Arrives — Without Warning", time: "T+0",
      timeLabel: "Missed",
      body: "Because no one defined what to watch for, in which domains, at what thresholds. No triggers are configured. No alerts are staged. The moment arrives — and the organization is already reacting to yesterday's signal.",
      accent: GOLD, terminal: false,
    },
    {
      num: "02", title: "Weeks Just to Get Everyone Aligned", time: "T+Weeks",
      timeLabel: "Weeks Lost",
      body: "Emergency calls. Competing priorities. No clear ownership. Weeks of coordination pass before anyone is aligned — and nothing has been executed.",
      accent: GOLD, terminal: false,
    },
    {
      num: "03", title: "The Window Has Already Closed", time: "T+∞",
      timeLabel: "Advantage Gone",
      body: "Competitors responded weeks ago. The market moved. The board is asking questions. The opportunity — or the crisis — has already been decided. Without you.",
      accent: RED_BORDER, terminal: true,
    },
  ];

  return (
    <section id="hp-problem" className="hp-sec" style={{ background: IVORY, padding: "100px 0", position: "relative" }}>
      <SectionMarker n="02" />
      <div style={{ ...CONTAINER }}>
        <div className="hp-prob-grid" style={{ display: "flex", gap: 60, alignItems: "flex-start" }}>

          {/* Left */}
          <Reveal style={{ flex: "0 0 calc(50% - 30px)", maxWidth: "50%" }}>
            <SectionLabel>THE PROBLEM</SectionLabel>
            <p style={{ ...GEO, fontSize: 22, fontWeight: 600, fontStyle: "italic", color: GOLD, marginBottom: 18, lineHeight: 1.3 }}>
              Your strategy isn't failing. Your detection and mobilization are.
            </p>
            <h2 style={{ ...GEO, fontSize: 38, fontWeight: 700, color: "#0A0F2E", lineHeight: 1.2, marginBottom: 32 }}>
              Most organizations find out
              <br />
              after it's already too late.
            </h2>
            <p style={{ ...DM, fontSize: 17, color: "#333", lineHeight: 1.7, marginBottom: 24 }}>
              The trigger doesn't announce itself. A competitor files quietly. A regulator moves before the press release. A market window opens — and closes — while your organization is watching the wrong signals, or none at all. You find out from the news. By then, you're already behind.
            </p>

            {/* Trigger category tags — condensed */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>
                Every trigger — risk or opportunity — same mobilization gap.
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  "Cybersecurity Breach", "Competitor Acquisition", "Regulatory Mandate",
                  "Supply Chain Failure", "Executive Departure", "ESG Crisis",
                  "Geopolitical Risk", "M&A Integration Sprint", "Reputational Threat",
                  "Market Entry Window", "Product Launch Timing",
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

            {/* Detection Gap + Mobilization Gap callouts */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              <div style={{ background: "rgba(192,57,43,0.04)", borderLeft: `3px solid ${RED_BORDER}`, padding: "14px 18px" }}>
                <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: RED_BORDER, marginBottom: 5 }}>The Detection Gap</div>
                <p style={{ ...DM, fontSize: 13, color: "#444", lineHeight: 1.6, margin: 0 }}>
                  The space between <em>"it happened"</em> and <em>"we know."</em> Most organizations have no defined triggers, no continuous monitoring, no alert thresholds — so they find out from public sources, on someone else's timeline.
                </p>
              </div>
              <div style={{ background: "rgba(10,15,46,0.04)", borderLeft: `3px solid ${GOLD}`, padding: "14px 18px" }}>
                <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, marginBottom: 5 }}>The Mobilization Gap</div>
                <p style={{ ...DM, fontSize: 13, color: "#444", lineHeight: 1.6, margin: 0 }}>
                  The space between <em>"we know"</em> and <em>"we are executing."</em> Weeks of alignment meetings before a single coordinated action — while the window closes. <strong>$50M–$500M per trigger event.</strong>
                </p>
              </div>
            </div>

            {/* Timeline contrast callout */}
            <div style={{ borderTop: `2px solid ${GOLD}`, paddingTop: 24 }}>
              <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
                Without Readiness OS
              </div>
              {[
                { label: "Alert received",        val: "Days or weeks later" },
                { label: "Leadership aligned",    val: "2–4 weeks after" },
                { label: "Execution begins",      val: "3–4 weeks after" },
                { label: "Competitive window",    val: "Closed" },
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
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 12, fontFamily: "'Barlow', Arial, sans-serif" }}>
            THE ARCHITECTURE BEHIND THE SPEED
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#0A0F2E", fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1.15 }}>
            30 Days of Mobilization. 12 Minutes to Live Execution.
          </div>
          <div style={{ fontSize: 15, color: "#6B7280", marginTop: 14, maxWidth: 620, margin: "14px auto 0", fontFamily: "'Barlow', Arial, sans-serif", lineHeight: 1.6 }}>
            The traditional enterprise spends weeks just getting the right people in the room, aligned on a plan, and ready to act. Readiness OS delivers roles assigned, tasks staged, communications drafted, and execution already underway — in 12 minutes.
          </div>
        </div>
        <ExecutionGapDiagram />
      </div>
    </section>
  );
}

// ─── PRACTITIONER OBSERVATIONS ───────────────────────────────────────────────
function PractitionerObservationsSection() {
  const practitioners = [
    {
      name: "Jayashree Venkataraman",
      credential: "Leadership Systems Advisor · Execution Reliability Advisor · CoFounder, NIYA & LeadWell Lab",
      quote: "Multiple practitioners are arriving at the same failure point from entirely different operational lenses. That usually signals the issue is no longer tactical. It is architectural.",
    },
    {
      name: "Michael Juhler",
      credential: "AI Transformation · Operating Model Redesign · Enterprise AI Signal newsletter",
      quote: "The deeper shift begins when readiness, coordination and learning are designed before the trigger fires. Otherwise AI simply accelerates the existing operating model.",
    },
    {
      name: "Dr. Kerry Huang",
      credential: "Fortune 50 AVP · ESI Top 1% Researcher · Forbes Business Council · 408-Firm Governance Study",
      quote: "Martin is building the architecture that makes clarity possible before pressure arrives.",
    },
    {
      name: "Pierre Montersino",
      credential: "Transformation Leader · Digital Change and AI Adoption Consultant",
      quote: "Treating the operating model as a constraint to navigate rather than a system to redesign is exactly how transformation momentum dies.",
    },
    {
      name: "Meherban Faroogh",
      credential: "Managing Partner, BPS Partners · President, ABPMP Toronto Chapter",
      quote: "By the time the trigger fires the organization is no longer redesigning. It is reacting. That is why sequencing matters so much.",
    },
  ];

  return (
    <section style={{ background: "#fff", borderTop: "1px solid #E8E4DC", borderBottom: "1px solid #E8E4DC", padding: "88px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>
            What Practitioners Are Observing
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, margin: "0 auto 16px", maxWidth: 640 }}>
            Independent convergence on the same structural gap.
          </h2>
          <p style={{ fontFamily: "'Barlow', Arial, sans-serif", fontSize: 15, color: "#555", lineHeight: 1.75, maxWidth: 640, margin: "0 auto" }}>
            Practitioners across governance research, enterprise AI transformation, and execution reliability — each arriving at the same failure point from a different direction. These are public statements made under their own names on LinkedIn.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {practitioners.map(({ name, credential, quote }) => (
            <div key={name} style={{ background: "#F8F7F4", padding: "32px 28px", borderTop: `3px solid ${GOLD}`, display: "flex", flexDirection: "column" as const, gap: 20 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontStyle: "italic", color: `${NAVY}CC`, lineHeight: 1.7, margin: 0, flex: 1 }}>
                "{quote}"
              </p>
              <div>
                <div style={{ fontFamily: "'Barlow', Arial, sans-serif", fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{name}</div>
                <div style={{ fontFamily: "'Barlow', Arial, sans-serif", fontSize: 11, fontWeight: 600, color: "#2B8A6E", lineHeight: 1.45 }}>{credential}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 600, color: "#aaa", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginTop: 10 }}>Public statement · LinkedIn</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY NOW STRIP ────────────────────────────────────────────────────────────
function WhyNowStrip() {
  const forces = [
    {
      number: "01",
      label: "AI DEPLOYED. OPERATING MODEL UNCHANGED.",
      headline: "Every enterprise has Microsoft's AI stack.",
      body: "None have the operating model to use it. Every vendor bolted AI onto the same 40-year-old meeting-heavy model — faster summaries, smarter notes, better dashboards from the same slow meetings. The mobilization cycle stays at 30 days.",
      accent: GOLD,
    },
    {
      number: "02",
      label: "STRATEGIC VELOCITY IS ACCELERATING.",
      headline: "Threats arrive faster. Response cycles don't.",
      body: "Activist investors, ransomware, regulatory actions, and competitive displacement are accelerating. The window to respond compresses. The mobilization cycle stays unchanged. Every day of delay compounds the exposure.",
      accent: "#DC3C32",
    },
    {
      number: "03",
      label: "THE COORDINATION LAYER IS UNCLAIMED.",
      headline: "ServiceNow reacts. Everbridge notifies. McKinsey documents.",
      body: "Every alternative reacts after the trigger fires. None of them eliminate the mobilization cycle. The coordination infrastructure layer — the operating model above the tools — has no incumbent. That layer is the market.",
      accent: TEAL,
    },
  ];

  return (
    <section style={{ background: NAVY, borderTop: `3px solid ${GOLD}`, padding: "72px 0 64px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 18, fontFamily: "'Barlow Condensed', sans-serif" }}>
            Why Now — Three Converging Forces
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.2vw, 38px)", fontWeight: 600, color: "#fff", lineHeight: 1.25, marginBottom: 20, maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
            Enterprise work was designed for a world without AI.<br />
            <em style={{ color: GOLD, fontStyle: "italic" }}>Three forces make this the moment to rebuild it.</em>
          </h2>
          <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.62)", lineHeight: 1.75, maxWidth: 680, margin: "0 auto", fontFamily: "'Barlow', Arial, sans-serif", fontWeight: 500 }}>
            The constraint that created committees, alignment cycles, and 30-day response times was human processing speed. AI removed that constraint. The operating model hasn't caught up.
          </p>
        </div>

        {/* Three-column force cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 40 }}>
          {forces.map((f) => (
            <div key={f.number} style={{
              padding: "32px 28px",
              borderTop: `3px solid ${f.accent}`,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid rgba(255,255,255,0.06)`,
              borderTopColor: f.accent,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 700, color: f.accent, lineHeight: 1, opacity: 0.5 }}>{f.number}</div>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: f.accent, fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1.4 }}>{f.label}</div>
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#fff", lineHeight: 1.35, marginBottom: 12 }}>{f.headline}</p>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, fontFamily: "'Barlow', Arial, sans-serif", fontWeight: 500, margin: 0 }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom row: conclusion pill */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 16, borderTop: "1px solid rgba(201,168,76,0.12)", paddingTop: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "11px 26px", border: `1px solid rgba(201,168,76,0.38)`, background: "rgba(201,168,76,0.07)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: GOLD, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" as const }}>
              Coordination Infrastructure — the operating model layer the market is missing.
            </span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", fontFamily: "'Barlow', Arial, sans-serif", fontStyle: "italic" as const, textAlign: "right" as const }}>
            Source: Stanford HAI, AI Index Report 2026 · Gartner Autonomous Business 2026
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── SECTION 4: The Missing Layer ────────────────────────────────────────────
function MissingLayerSection() {
  const rows = [
    { label: "STRATEGY",         sub: "Board Decisions · Planning · Vision",  hi: false },
    { label: "ERP / CRM / ITSM", sub: "SAP · Salesforce · ServiceNow",        hi: false },
    { label: "READINESS OS",     sub: "New Operating Model · Readiness-Native Enterprises", hi: true  },
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

// ─── SECTION 4: Athlete Preparation Bridge ───────────────────────────────────
function AthletePreparationSection() {
  const mappings = [
    {
      athlete: "Athletes study their specific opponent — every week, not just before the game.",
      platform: "Readiness OS monitors 248 signals every 15 minutes. Continuously. The environment is always being read — not just when a situation presents itself.",
      icon: "◎",
    },
    {
      athlete: "Athletes rehearse every situation they expect to face — with their specific team, for their specific conditions.",
      platform: "180 Readiness Protocols, built across 9 strategic domains. Your organization's specific failure modes, already worked through — before any pressure exists.",
      icon: "◈",
    },
    {
      athlete: "By Saturday, the performance is already decided. The competition is the confirmation.",
      platform: "The response is ready before the trigger fires. Not assembled in the moment. Not improvised under pressure. Already decided.",
      icon: "◉",
    },
  ];

  return (
    <section className="hp-section-reduce" style={{ background: IVORY, padding: "100px 0", position: "relative", overflow: "hidden" }}>
      {/* Subtle grid */}
      <div style={{ position: "absolute", inset: 0, ...GOLD_GRID_BG, opacity: 0.5, pointerEvents: "none" }} />

      <div style={{ ...CONTAINER, position: "relative", zIndex: 1 }}>
        <Reveal>
          {/* Section label */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 56 }}>
            <div style={{ width: 32, height: 1.5, background: GOLD, flexShrink: 0 }} />
            <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>The Preparation Principle</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>

            {/* Left — editorial essay */}
            <div>
              <h2 style={{ ...GEO, fontSize: "clamp(28px,3.2vw,42px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 28 }}>
                Elite athletes don't figure out how{" "}
                <em style={{ color: GOLD, fontStyle: "italic" }}>to perform on game day.</em>
              </h2>
              <p style={{ ...GEO, fontSize: "clamp(18px,1.6vw,22px)", color: "#374151", lineHeight: 1.7, marginBottom: 20 }}>
                Tuesday through Friday is where Saturday is decided. The competition is the confirmation — not the preparation.
              </p>
              <p style={{ ...DM, fontSize: 15, color: MUTED_LIGHT, lineHeight: 1.75, marginBottom: 28 }}>
                Most enterprise organizations do the opposite. They prepare for nothing and perform when the trigger fires. Every response begins from scratch — the BA documents what needs to happen, the coordination lead maps who needs to be in the room, functional leads confirm their roles, tasks get assigned, briefs get drafted. That work takes 30 days. Readiness OS pre-stages all of it before the trigger fires.
              </p>
              <p style={{ ...DM, fontSize: 15, fontWeight: 700, color: NAVY, lineHeight: 1.6, marginBottom: 20 }}>
                Thirty days is not a performance problem. It is an architecture problem.
              </p>
              <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 24, marginBottom: 0 }}>
                <p style={{ ...GEO, fontSize: 20, fontWeight: 700, color: NAVY, lineHeight: 1.4, marginBottom: 12 }}>
                  Readiness OS is the preparation infrastructure that makes the organizational response ready before the trigger arrives.
                </p>
                <p style={{ ...DM, fontSize: 14, color: NAVY, opacity: 0.6, lineHeight: 1.6, marginBottom: 0, fontStyle: 'italic' }}>
                  The system that allows an enterprise to detect, coordinate, execute, and learn from strategic change faster than its competitors.
                </p>
              </div>
            </div>

            {/* Right — three mappings */}
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: MUTED_LIGHT, marginBottom: 20 }}>
                How the principle maps to the platform
              </div>
              {mappings.map((m, i) => (
                <div key={i} style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 24, paddingBottom: 24 }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 12 }}>
                    <span style={{ ...GEO, fontSize: 18, color: GOLD, flexShrink: 0, lineHeight: 1, marginTop: 2 }}>{m.icon}</span>
                    <p style={{ ...GEO, fontSize: 15, fontWeight: 600, color: "#374151", lineHeight: 1.55, fontStyle: "italic", margin: 0 }}>
                      {m.athlete}
                    </p>
                  </div>
                  <div style={{ paddingLeft: 34 }}>
                    <p style={{ ...DM, fontSize: 13, color: MUTED_LIGHT, lineHeight: 1.65, margin: 0 }}>
                      {m.platform}
                    </p>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${BORDER}` }} />
            </div>
          </div>

          {/* Footer pull-quote */}
          <div style={{ marginTop: 64, padding: "32px 40px", background: NAVY, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" as const }}>
            <p style={{ ...GEO, fontSize: "clamp(16px,1.6vw,20px)", fontWeight: 700, color: "#fff", lineHeight: 1.4, margin: 0, maxWidth: 640 }}>
              Any organization can be ready for every situation it expects to face.{" "}
              <em style={{ color: GOLD, fontStyle: "italic" }}>That's not a promise about speed. It's a promise about fearlessness.</em>
            </p>
            <div style={{ flexShrink: 0, textAlign: "right" as const }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 4 }}>The Preparation Arc</div>
              <div style={{ ...GEO, fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Preparation → Readiness → Fearless</div>
              <div style={{ ...GEO, fontSize: 12, fontStyle: "italic", color: "#2B8A6E" }}>Preparedness as infrastructure, not consulting.</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 5: IDEA Framework ───────────────────────────────────────────────
function IDEASection() {
  const cards = [
    { letter: "I", title: "Identify", subtitle: "180 Pre-Staged Readiness Protocols",        body: "Every scenario across all 9 strategic domains is fully mapped before the trigger fires. Roles, tasks, documents, and budget are already assigned — waiting for the moment. Nothing is improvised.", accent: TEAL, wm: "rgba(43,138,110,0.06)" },
    { letter: "D", title: "Detect",   subtitle: "248+ Signals, Every 15 Minutes",  body: "Continuous monitoring scans 248+ signals around the clock and knows exactly which Readiness Protocol matches each pattern. The trigger is identified — and the response is ready — before your leadership team finishes their first email.", accent: GOLD, wm: "rgba(201,168,76,0.06)" },
    { letter: "E", title: "Execute",  subtitle: "12-Minute Full Deployment",        body: "One executive authorization. The organization moves. Roles distributed, tasks assigned, war rooms opened — simultaneously, to every stakeholder. By the time the first alignment call would have been scheduled, you're already executing. The executive at the decision moment has four real choices: run the staged response as built, audible to a different staged response, customize the response on the fly, or choose to do nothing.", accent: TEAL, wm: "rgba(43,138,110,0.06)" },
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
                  "Trigger detected — Readiness Protocol activated automatically",
                  "Roles, tasks, and budget pre-assigned and deployed",
                  "Full org executing in under 12 minutes",
                  "Every activation builds institutional memory — next response is faster",
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
                { letter: "I", step: "IDENTIFY", desc: "Readiness Protocols update automatically. Next trigger, better positioned." },
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
              <span style={{ ...DM, fontSize: 12, color: "#555", fontStyle: "italic" }}>
                The loop closes at <strong style={{ color: GOLD, fontStyle: "normal" }}>ADVANCE</strong> — the Institutional Memory Engine captures every decision, outcome, and failure mode. Each cycle, your organization becomes harder to catch off-guard.{' '}
                <a href="/institutional-memory-engine" style={{ color: TEAL, fontWeight: 700, textDecoration: "none", borderBottom: `1px solid ${TEAL}` }}>
                  See how the memory layer works →
                </a>
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
  const [step, setStep] = useState(0);
  const TOTAL_STEPS = 9;

  useEffect(() => {
    const id = setInterval(() => {
      setStep(s => (s >= TOTAL_STEPS - 1 ? 0 : s + 1));
    }, 1700);
    return () => clearInterval(id);
  }, []);

  const roles: { role: string; task: string; notifiedAt: number; acknowledgedAt: number }[] = [
    { role: "CFO",             task: "Authorize contingency budget release",  notifiedAt: 1, acknowledgedAt: 2 },
    { role: "COO",             task: "Activate Tier-1 supplier protocol",     notifiedAt: 2, acknowledgedAt: 3 },
    { role: "General Counsel", task: "Review force majeure exposure",          notifiedAt: 3, acknowledgedAt: 4 },
    { role: "Board Chair",     task: "Approve emergency procurement ceiling",  notifiedAt: 4, acknowledgedAt: 5 },
    { role: "CISO",            task: "Secure vendor data channels",            notifiedAt: 5, acknowledgedAt: 6 },
    { role: "CMO",             task: "Stage customer communication plan",      notifiedAt: 6, acknowledgedAt: 7 },
  ];

  const clockLabels = ["0:00", "2:00", "4:00", "6:00", "8:00", "10:00", "11:00", "12:00", "12:00"];
  const allDone = step >= 7;

  function getState(r: typeof roles[0]): "queued" | "notified" | "acknowledged" {
    if (step >= r.acknowledgedAt) return "acknowledged";
    if (step >= r.notifiedAt)     return "notified";
    return "queued";
  }

  const oldWaySteps = [
    { day: "Day 0",  event: "Trigger fires",                   detail: "Tier-1 supplier failure confirmed" },
    { day: "Day 1",  event: "Emergency Slack thread",           detail: "47 messages · no single owner" },
    { day: "Day 3",  event: "Cross-functional meeting called",  detail: "6 time zones · no agenda finalized" },
    { day: "Day 7",  event: "Alignment (tentatively) reached",  detail: "Competing priorities unresolved" },
    { day: "Day 14", event: "Tasks manually assigned by email", detail: "Follow-up required for every role" },
    { day: "Day 30", event: "Execution officially begins",      detail: "If stakeholders remain aligned" },
  ];

  const acknowledgedCount = roles.filter(r => getState(r) === "acknowledged").length;

  return (
    <section className="hp-section-reduce" style={{ background: "#F0EEE9", padding: "100px 0", position: "relative" }}>
      <SectionMarker n="06" />
      <div style={{ ...CONTAINER }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <SectionLabel>THE RESPONSE IN ACTION</SectionLabel>
            <h2 style={{ ...GEO, fontSize: 36, fontWeight: 700, color: NAVY, lineHeight: 1.25, marginBottom: 16 }}>
              The response is ready<em style={{ color: GOLD, fontStyle: "italic" }}> before</em> the trigger fires.
            </h2>
            <p style={{ ...DM, fontSize: 16, color: "#4A5568", maxWidth: 620, margin: "0 auto" }}>
              Every role queued. Every task pre-staged. When the trigger fires, the system notifies and tracks acknowledgment — before the first emergency call is scheduled.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="hp-ba-compare" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
            maxWidth: 1060, margin: "0 auto",
            border: "1px solid rgba(10,15,46,0.14)",
            overflow: "hidden",
          }}>

            {/* ── LEFT: The Old Way ───────────────────────────────── */}
            <div style={{ background: "#16142A", padding: "32px 32px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(220,38,38,0.18)" }}>
                <div style={{ width: 8, height: 8, background: "#DC2626" }} />
                <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#DC2626", textTransform: "uppercase" as const }}>
                  The Status Quo — 30 Days
                </span>
              </div>

              <div>
                {oldWaySteps.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: 9, height: 9, background: i === 0 ? "#DC2626" : "rgba(220,38,38,0.28)", flexShrink: 0, marginTop: 4 }} />
                      {i < oldWaySteps.length - 1 && (
                        <div style={{ width: 1, flex: 1, background: "rgba(220,38,38,0.12)", minHeight: 20, marginTop: 3 }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: 18 }}>
                      <div style={{ ...DM, fontSize: 10, color: "#DC2626", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 2 }}>{s.day}</div>
                      <div style={{ ...DM, fontSize: 13, color: "rgba(240,237,228,0.88)", fontWeight: 600, marginBottom: 2 }}>{s.event}</div>
                      <div style={{ ...DM, fontSize: 11, color: "rgba(240,237,228,0.32)", fontStyle: "italic" as const }}>{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 4, paddingTop: 14, borderTop: "1px solid rgba(220,38,38,0.12)" }}>
                <div style={{ ...DM, fontSize: 12, color: "rgba(220,38,38,0.65)", fontWeight: 600, lineHeight: 1.5 }}>
                  30 days of coordination lag before<br />a single task is actionable.
                </div>
              </div>
            </div>

            {/* ── RIGHT: Readiness OS (animated) ──────────────────── */}
            <div style={{ background: "#060F1F", display: "flex", flexDirection: "column" as const }}>

              {/* Console header */}
              <div style={{ background: "#0A1428", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 7, height: 7, background: allDone ? TEAL_LIGHT : GOLD, boxShadow: allDone ? `0 0 6px ${TEAL_LIGHT}` : `0 0 6px ${GOLD}`, transition: "all 0.4s" }} />
                  <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: GOLD, textTransform: "uppercase" as const }}>
                    Readiness Protocol #047 — Supply Chain Disruption
                  </span>
                </div>
                <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: allDone ? TEAL_LIGHT : "#fff", fontVariantNumeric: "tabular-nums", transition: "color 0.4s", letterSpacing: "-0.5px" }}>
                  {clockLabels[step]}
                </div>
              </div>

              {/* Task list */}
              <div style={{ padding: "20px 24px", flex: 1 }}>
                <div style={{ ...DM, fontSize: 10, color: "rgba(200,212,232,0.38)", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 12 }}>
                  Role Deployments — Pre-Staged
                </div>

                {roles.map(r => {
                  const state = getState(r);
                  return (
                    <div key={r.role} style={{
                      display: "flex", alignItems: "center", gap: 11, marginBottom: 8,
                      padding: "9px 12px",
                      background: state === "acknowledged" ? "rgba(43,138,110,0.10)" : state === "notified" ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.025)",
                      borderLeft: state === "acknowledged" ? `2px solid ${TEAL_LIGHT}` : state === "notified" ? `2px solid ${GOLD}` : "2px solid rgba(255,255,255,0.07)",
                      transition: "all 0.45s ease",
                    }}>
                      {/* State indicator */}
                      <div style={{
                        width: 18, height: 18, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: state === "acknowledged" ? TEAL_LIGHT : "transparent",
                        border: state === "acknowledged" ? "none" : state === "notified" ? `2px solid ${GOLD}` : "2px solid rgba(255,255,255,0.12)",
                        transition: "all 0.4s ease",
                      }}>
                        {state === "acknowledged" && <span style={{ color: "#fff", fontSize: 11, fontWeight: 900 }}>✓</span>}
                        {state === "notified" && <div style={{ width: 5, height: 5, background: GOLD, borderRadius: "50%", animation: "pulse 0.9s ease-in-out infinite" }} />}
                      </div>

                      {/* Role + task */}
                      <div style={{ flex: 1 }}>
                        <div style={{ ...DM, fontSize: 11, fontWeight: 700, marginBottom: 1, transition: "color 0.4s",
                          color: state === "acknowledged" ? TEAL_LIGHT : state === "notified" ? GOLD : "rgba(200,212,232,0.38)" }}>
                          {r.role}
                        </div>
                        <div style={{ ...DM, fontSize: 11, color: "rgba(200,212,232,0.42)" }}>{r.task}</div>
                      </div>

                      {/* State badge */}
                      <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, transition: "color 0.4s",
                        color: state === "acknowledged" ? TEAL_LIGHT : state === "notified" ? GOLD : "rgba(255,255,255,0.68)" }}>
                        {state === "acknowledged" ? "Acknowledged" : state === "notified" ? "Notified" : "Queued"}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Console footer */}
              <div style={{ padding: "11px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ ...DM, fontSize: 11, color: "rgba(200,212,232,0.28)" }}>
                  {acknowledgedCount} of {roles.length} confirmed · 0 alignment meetings
                </span>
                <span style={{ ...DM, fontSize: 11, fontWeight: 700, transition: "color 0.4s",
                  color: allDone ? TEAL_LIGHT : GOLD }}>
                  {allDone ? "● FULLY DEPLOYED" : "● DEPLOYING..."}
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Clarifying callout below */}
        <Reveal delay={0.1}>
          <div style={{ maxWidth: 1060, margin: "0 auto", marginTop: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            <div style={{ padding: "16px 32px", background: "rgba(220,38,38,0.04)", borderLeft: "1px solid rgba(220,38,38,0.12)", borderBottom: "1px solid rgba(220,38,38,0.12)", borderRight: "1px solid rgba(220,38,38,0.08)" }}>
              <span style={{ ...DM, fontSize: 12, color: "#9CA3AF", fontStyle: "italic" as const }}>
                Every day without a pre-staged response is cost, confusion, and lost competitive ground.
              </span>
            </div>
            <div style={{ padding: "16px 24px", background: "rgba(43,138,110,0.05)", borderLeft: "1px solid rgba(43,138,110,0.15)", borderBottom: "1px solid rgba(43,138,110,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ ...DM, fontSize: 12, color: TEAL, fontWeight: 600 }}>
                Every role notified and acknowledged before the first emergency call.
              </span>
              <Link href="/12-minute-experience" style={{ ...DM, fontSize: 11, fontWeight: 700, color: TEAL, textDecoration: "none", borderBottom: `1px solid ${TEAL}`, paddingBottom: 1, whiteSpace: "nowrap" as const, marginLeft: 16, flexShrink: 0 }}>
                Experience it →
              </Link>
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
  { firm: "BCG · AI-First Org & Operating Model Study, 2026", finding: "95% of companies are piloting AI. Only 5% are capturing real value at scale. The difference is not the technology — it is the operating model. Becoming AI-first is 30% technology, 70% people and organization." },
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
              Readiness OS is the orchestration layer above your $300B+ Microsoft AI investment. When a high-stakes situation presents itself, the coordinated response deploys inside Teams, Azure AI, and M365 in 12 minutes — with the workflow architecture that turns AI capability into AI action.
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
              { label: 'Copilot Studio Connector', sublabel: 'Query Readiness Protocols from M365', icon: '◇' },
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

        {/* Universal ecosystem diagram */}
        <Reveal delay={0.3}>
          <div style={{ marginTop: 48, paddingTop: 40, borderTop: `1px solid rgba(201,168,76,0.1)` }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 28, height: 1, background: 'rgba(201,168,76,0.35)' }} />
                <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(201,168,76,0.7)' }}>Week 1 setup · Week 2–4 live protocols · 90-day ROI validation</span>
                <div style={{ width: 28, height: 1, background: 'rgba(201,168,76,0.35)' }} />
              </div>
              <h2 style={{ ...GEO, fontSize: 'clamp(22px,3vw,34px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 14 }}>
                Live in weeks, not months. Responding in 12 minutes.
              </h2>
              <p style={{ ...DM, fontSize: 14, color: 'rgba(240,237,228,0.45)', maxWidth: 620, margin: '0 auto' }}>
                No rip-and-replace. No 6-month rollout. Week 1: foundation setup and scenario selection. Weeks 2–4: live protocols staged and first simulation drill complete. By Day 90: a documented ROI business case built from real activation data — not a demo.
              </p>
            </div>
            <div style={{ border: `1px solid rgba(201,168,76,0.12)`, overflow: 'hidden' }}>
              <EcosystemIntegrationDiagram />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
              <button
                onClick={() => setLocation('/universal-connector')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13,
                  padding: '11px 22px', borderRadius: '0.15rem', border: 'none', cursor: 'pointer',
                  fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase',
                }}
              >
                View All 55+ Connectors →
              </button>
              <button
                onClick={() => setLocation('/technical-onboarding')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'transparent', color: 'rgba(240,237,228,0.75)', fontWeight: 600, fontSize: 13,
                  padding: '11px 22px', borderRadius: '0.15rem',
                  border: '1px solid rgba(240,237,228,0.2)', cursor: 'pointer',
                  fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase',
                }}
              >
                Integration Setup Plan
              </button>
            </div>
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
      body: "$300K–$500K buys you PDFs on SharePoint. Nobody can find them when a situation presents itself. The $500K investment sits on a shelf while the organization still takes 30 days to coordinate.",
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
      body: "Every keynote, framework, and McKinsey deck proves the mobilization gap is real. The audience nods. The room agrees. The organization still takes 30 days to respond when a high-stakes situation presents itself.",
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
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.45)", marginTop: 2 }}>Minutes — Readiness OS</div>
            </div>
            <div style={{ width: 1, height: 40, background: "rgba(201,168,76,0.3)" }} />
            <div>
              <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: "#6B7280", lineHeight: 1 }}>30</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.3)", marginTop: 2 }}>Days — every alternative</div>
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
    { stat: "94%",    label: "Readiness Protocol phases completed within target window" },
  ];
  return (
    <section id="hp-proof" className="hp-section-reduce" style={{ background: MID_NAVY, padding: "96px 0 80px", position: "relative", overflow: "hidden" }}>
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

          {/* Validator Social Proof — Additional Voices */}
          <div style={{ margin: "0 0 56px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 32 }}>
              <div style={{ width: 28, height: 1, background: "rgba(201,168,76,0.3)" }} />
              <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.7)" }}>Independent Voices</span>
              <div style={{ width: 28, height: 1, background: "rgba(201,168,76,0.3)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
              {[
                {
                  quote: "The pre-staged architecture is architecturally sound. This is the operating model layer that enterprise governance has been missing.",
                  name: "Jayashree Ravi",
                  title: "Enterprise Architecture · Fortune 100 · Strategic Governance",
                },
                {
                  quote: "What Readiness OS captures is the difference between preparation and improvisation. The 12-minute claim is credible precisely because the work was done before the clock started.",
                  name: "Michael Juhler",
                  title: "Chief Risk Officer · Global Financial Services",
                },
                {
                  quote: "The concept of pre-commitment at the organizational level — not just individual — is precisely what enterprise resilience frameworks have failed to operationalize. This does it.",
                  name: "Roman Kos",
                  title: "Organizational Resilience · Enterprise Strategy",
                },
              ].map((v, i) => (
                <div key={i} style={{ padding: "28px 32px", background: "rgba(10,15,46,0.5)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid rgba(201,168,76,0.4)` }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.5vw,18px)", fontStyle: "italic", color: "rgba(255,255,255,0.82)", lineHeight: 1.65, marginBottom: 20 }}>
                    "{v.quote}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 20, height: 1, background: "rgba(201,168,76,0.35)" }} />
                    <div>
                      <p style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 2 }}>{v.name}</p>
                      <p style={{ ...DM, fontSize: 10, color: "rgba(255,255,255,0.45)", margin: 0 }}>{v.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practitioner Quote — Dr. Kerry Huang */}
          <div style={{ margin: "0 0 64px", position: "relative" }}>
            <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", padding: "48px 56px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.14)", borderLeft: "3px solid rgba(201,168,76,0.5)" }}>
              {/* Large styled quote mark */}
              <div style={{ position: "absolute", top: 16, left: 20, fontFamily: "Georgia, serif", fontSize: 96, lineHeight: 1, color: "rgba(201,168,76,0.15)", userSelect: "none" as const, pointerEvents: "none" }}>❝</div>
              <div style={{ position: "absolute", bottom: 16, right: 20, fontFamily: "Georgia, serif", fontSize: 96, lineHeight: 1, color: "rgba(201,168,76,0.08)", userSelect: "none" as const, pointerEvents: "none", transform: "rotate(180deg)" }}>❝</div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px,2.4vw,30px)", fontStyle: "italic", color: "rgba(255,255,255,0.92)", lineHeight: 1.55, marginBottom: 28, position: "relative", zIndex: 1 }}>
                "That is governance as pre-commitment, not governance as review."
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
                <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
                <div>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 3 }}>
                    Dr. Kerry Huang
                  </p>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.68)", letterSpacing: "0.03em", margin: 0 }}>
                    Fortune 50 AVP · ESI Top 1% Researcher · Forbes Council · 408-firm governance study
                  </p>
                </div>
              </div>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.68)", marginTop: 16, fontStyle: "italic", position: "relative", zIndex: 1 }}>
                Produced independently — without product exposure — through intellectual exchange, April 2026
              </p>
            </div>

          </div>

          {/* Dr. Huang Public Repost — Full LinkedIn Post */}
          <div style={{ maxWidth: 800, margin: "0 auto 64px", background: NAVY, border: "1px solid rgba(201,168,76,0.18)", borderLeft: "4px solid rgba(201,168,76,0.7)" }}>
            <div style={{ padding: "32px 40px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <div style={{ width: 20, height: 1, background: "rgba(201,168,76,0.4)" }} />
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.75)" }}>Posted to his full professional network · LinkedIn · April 20, 2026</span>
                <div style={{ width: 20, height: 1, background: "rgba(201,168,76,0.4)" }} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(17px,1.8vw,22px)", fontStyle: "italic", color: "rgba(255,255,255,0.88)", lineHeight: 1.75, marginBottom: 18 }}>
                "What four weeks of public intellectual exchange with Martin Brunke surfaced is that AwaCourage — awareness paired with the willingness to act before consensus arrives — and the architecture that makes this capacity possible at scale are two different governance functions. Same mechanism, opposite directions.
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(17px,1.8vw,22px)", fontStyle: "italic", color: "rgba(255,255,255,0.88)", lineHeight: 1.75, marginBottom: 18 }}>
                Martin is building the architecture that makes clarity possible before pressure arrives. My research focuses on what determines whether that clarity actually converts into action when the system has not yet confirmed it is safe to move. Neither side replaces the other.
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(17px,1.8vw,22px)", fontStyle: "italic", color: GOLD, lineHeight: 1.75, marginBottom: 28, fontWeight: 600 }}>
                The boundary Martin named — between what architecture can supply and what only human capacity can carry — is where the next decade of governance work sits."
              </p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 28, height: 1, background: "rgba(201,168,76,0.35)" }} />
                <div>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 3 }}>Dr. Kerry Huang</p>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.68)", letterSpacing: "0.02em", margin: 0 }}>Fortune 50 AVP · ESI Top 1% Researcher · Forbes Business Council · Named Martin Brunke by name to his full professional network</p>
                </div>
              </div>
            </div>
          </div>

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
                Read the founder's story →
              </Link>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.3)" }} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Executive Q&A ────────────────────────────────────────────────────────────
function ExecutiveQASection() {
  return (
    <section style={{ background: "#F8F7F4", padding: "80px 0", borderTop: "1px solid #E8E4DC" }}>
      <div style={{ ...CONTAINER }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div style={{ width: 24, height: 1.5, background: GOLD }} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: GOLD }}>Questions We Hear</span>
        </div>
        <h2 style={{ ...GEO, fontSize: "clamp(26px,3vw,38px)", fontWeight: 700, color: NAVY, marginBottom: 10, lineHeight: 1.25 }}>
          Executive Questions, Answered
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 36, lineHeight: 1.7 }}>
          The questions serious enterprise leaders ask before they move forward.
        </p>
        <div style={{ display: "grid", gap: 2 }}>
          {[
            {
              q: "What problem are you actually solving?",
              a: "Most enterprises do not fail to detect risk or opportunity. They fail in the mobilization gap between detection and coordinated action. Readiness OS closes that gap — ownership, tasking, communications, and budget authority pre-staged before the trigger fires.",
            },
            {
              q: "Is AI making decisions for us?",
              a: "No. AI monitors signals and prepares context. Executives authorize activation. Authority stays human at every step. No Readiness Protocol activates without executive sign-off.",
            },
            {
              q: "How is this different from Copilot, workflow tools, or consulting?",
              a: "Copilot helps with intelligence and drafting. Workflow tools track tasks after people align. Consulting advises between events. Readiness OS orchestrates the cross-functional response the moment a situation presents itself — before the stakeholder chaos starts.",
            },
          ].map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr", border: "1px solid #E8E4DC", borderTopWidth: i === 0 ? 1 : 0 }}>
              <div style={{ padding: "24px 28px", borderRight: "1px solid #E8E4DC", background: "#fff" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 8 }}>Q{String(i + 1).padStart(2, "0")}</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: NAVY, lineHeight: 1.45, margin: 0 }}>{item.q}</p>
              </div>
              <div style={{ padding: "24px 32px", background: "#FAFAF8", display: "flex", alignItems: "center" }}>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, margin: 0 }}>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, display: "flex", gap: 16, flexWrap: "wrap" as const }}>
          <a href="/investor-landing" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: GOLD, textDecoration: "none", borderBottom: `1px solid ${GOLD}60`, paddingBottom: 2 }}>
            See all 8 questions answered →
          </a>
          <a href="/request-access" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#6B7280", textDecoration: "none", borderBottom: "1px solid #D1D5DB", paddingBottom: 2 }}>
            Apply for Founding Partner Access →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 8: Primary CTA ───────────────────────────────────────────────────
// ─── FEARLESS FINALE ──────────────────────────────────────────────────────────
function FearlessFinaleSection() {
  return (
    <section className="hp-section-reduce" style={{ background: NAVY, padding: "96px 0 88px", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
      <div style={{ ...CONTAINER, maxWidth: 900, textAlign: "center" }}>
        <Reveal>
          <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.6)", marginBottom: 36 }}>
            The Endpoint
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: 56 }}>
            {[
              { word: "Preparation", sub: "180 protocols pre-staged" },
              { word: "Readiness", sub: "12-minute response" },
              { word: "Fearless", sub: "The outcome", highlight: true },
            ].map((item, i) => (
              <Fragment key={item.word}>
                <div style={{ textAlign: "center", padding: "0 28px" }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: item.highlight ? "clamp(38px,5vw,60px)" : "clamp(22px,3vw,34px)",
                    fontWeight: 700,
                    color: item.highlight ? GOLD : "rgba(255,255,255,0.35)",
                    lineHeight: 1.05,
                    marginBottom: 10,
                  }}>
                    {item.word}
                  </div>
                  <div style={{ ...DM, fontSize: 9, color: item.highlight ? "rgba(201,168,76,0.55)" : "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                    {item.sub}
                  </div>
                </div>
                {i < 2 && (
                  <div style={{ color: "rgba(201,168,76,0.25)", fontSize: 22, fontWeight: 200, paddingTop: 10, flexShrink: 0 }}>→</div>
                )}
              </Fragment>
            ))}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 24, maxWidth: 760, margin: "0 auto 24px" }}>
            Any organization that prepares for every situation it expects to face<br />
            is no longer afraid of them.
          </h2>
          <p style={{ ...DM, fontSize: 15, color: "rgba(240,237,228,0.45)", lineHeight: 1.85, maxWidth: 560, margin: "0 auto 20px" }}>
            Speed is the evidence. Readiness is the promise. Fearless is the outcome.
          </p>
          <p style={{ ...DM, fontSize: 12, color: "rgba(201,168,76,0.55)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
            The response is ready before the trigger fires.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function OperatingModelOutcomesSection() {
  return (
    <section style={{ background: IVORY, padding: "100px 0", position: "relative" }}>
      <div style={{ ...CONTAINER }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>
            The Operating Model Return
          </div>
          <h2 style={{ ...GEO, fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, marginBottom: 20 }}>
            This is not a technology purchase.
          </h2>
          <p style={{ ...DM, fontSize: 17, color: MUTED_LIGHT, maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
            It is an operating model redesign — with three measurable returns that appear on your P&L, not just your execution metrics.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, marginBottom: 56 }}>
          {[
            {
              num: "01",
              label: "Improved Profitability",
              body: "Every strategic situation you're prepared for is one that doesn't bleed runway before action starts. Captured competitive windows, avoided losses, protected revenue — preparation is a profit lever, not an overhead cost.",
              accent: TEAL,
            },
            {
              num: "02",
              label: "Accelerated Delivery",
              body: "Strategic decisions that consumed 30 days of alignment now execute in 12 minutes. Unplanned situations no longer consume planned capacity. Your roadmap moves faster because your operating model handles the unplanned.",
              accent: GOLD,
            },
            {
              num: "03",
              label: "Reduced Costs",
              body: "Eliminate mobilization overhead — executive bandwidth, emergency coordination, reactive vendor engagements — across all 231 strategic situations. The 30-day alignment cycle has a cost. Readiness OS removes it.",
              accent: NAVY_BG,
            },
          ].map(({ num, label, body, accent }) => (
            <div key={num} style={{ background: "#fff", borderTop: `3px solid ${accent}`, padding: "40px 36px" }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: accent === NAVY_BG ? NAVY : accent, textTransform: "uppercase" as const, marginBottom: 12 }}>
                {num}
              </div>
              <h3 style={{ ...GEO, fontSize: 22, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 16 }}>
                {label}
              </h3>
              <p style={{ ...DM, fontSize: 14, color: "#4B5563", lineHeight: 1.75, margin: 0 }}>
                {body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ background: NAVY, padding: "32px 48px", display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ width: 3, height: 52, background: GOLD, flexShrink: 0 }} />
          <div>
            <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>
              The Fundamental Difference
            </div>
            <p style={{ ...GEO, fontSize: "clamp(16px,1.8vw,20px)", fontStyle: "italic", color: IVORY, lineHeight: 1.55, margin: 0 }}>
              "Every alternative redesigns your operating model after the trigger fires. Readiness OS{" "}
              <em style={{ color: GOLD, fontStyle: "normal" }}>is</em> the operating model — pre-staged, continuously monitored, ready before any situation presents itself."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="hp-cta" className="hp-sec" style={{ ...SECTION_DARK_BG, padding: "120px 0", position: "relative" }}>
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
            We're selecting 12 Founding Partners this year. The organizations that move first build an execution advantage their competitors will spend years trying to close.
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
              Apply for Founding Partner Access
            </Link>
          </div>

          {/* Trust strip */}
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 28, flexWrap: "wrap" as const }}>
            {[
              "Human authorization required — no Protocol activates without executive sign-off",
              "Audit trail + governance controls",
              "Enterprise integration-ready — Microsoft stack + others",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ color: TEAL, fontSize: 12 }}>✓</span>
                <span style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.02em" }}>{item}</span>
              </div>
            ))}
          </div>

          {/* AI monitors phrase */}
          <div style={{ marginTop: 28, padding: "11px 28px", display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(43,138,110,0.3)", background: "rgba(43,138,110,0.07)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0, display: "inline-block" }} />
            <span style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(43,138,110,0.85)" }}>
              AI monitors · Executives authorize · Authority stays human at every step
            </span>
          </div>

          <p style={{ ...DM, fontSize: 13, color: MUTED_LIGHT, marginTop: 20, opacity: 0.6 }}>
            No long-term commitment required ·{" "}
            <Link href="/pricing" style={{ color: "rgba(201,168,76,0.7)", textDecoration: "none", borderBottom: "1px solid rgba(201,168,76,0.3)", paddingBottom: 1 }}>
              View pricing →
            </Link>
          </p>
          <p style={{ ...DM, fontSize: 13, marginTop: 8 }}>
            <Link href="/contact" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.25)", paddingBottom: 1 }}>
              Prefer a conversation first? Schedule 30 minutes →
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

        {/* Decision Path strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, marginBottom: 52, background: "rgba(255,255,255,0.05)" }}>
          {[
            { q: "Not ready to commit?", cta: "Explore 12-Minute Experience", href: "/12-minute-experience", accent: "rgba(255,255,255,0.4)" },
            { q: "Ready to evaluate?", cta: "Request Founding Partner Access", href: "/request-access", accent: GOLD },
            { q: "Ready to deploy?", cta: "Apply for Full Access", href: "/request-access", accent: GOLD },
          ].map((p, i) => (
            <Link key={i} href={p.href} style={{ display: "block", background: FOOTER_NAVY, padding: "20px 24px", textDecoration: "none", borderTop: `2px solid ${i === 1 ? GOLD : "rgba(255,255,255,0.08)"}` }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.38)", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 6 }}>{p.q}</div>
              <div style={{ ...DM, fontSize: 12, fontWeight: 700, color: p.accent, letterSpacing: "0.04em" }}>{p.cta} →</div>
            </Link>
          ))}
        </div>

        <div className="hp-footer-cols" style={{ display: "flex", gap: 48, marginBottom: 40 }}>

          {/* Brand */}
          <div style={{ flex: "0 0 280px" }}>
            <div style={{ marginBottom: 16 }}>
              <VaughnMartinLogo variant="full" height={80} color="light" />
            </div>
            <p style={{ ...GEO, fontStyle: "italic", fontSize: 16, color: GOLD_LIGHT, marginBottom: 6 }}>We Make Enterprises Fearless.</p>
            <p style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.55)", marginBottom: 16 }}>Fearless in minutes.</p>
            <p style={{ ...DM, fontSize: 12, color: MUTED_LIGHT }}>© 2026 VaughnMartin. All rights reserved.</p>
          </div>

          {/* Product */}
          <div style={{ flex: 1 }}>
            <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>PRODUCT</div>
            {[
              { label: "How It Works",   href: "/how-it-works" },
              { label: "Protocol Coverage Browser", href: "/protocol-browser" },
              { label: "Readiness Protocols", href: "/playbook-library" },
              { label: "Pricing & Plans", href: "/pricing" },
              { label: "Apply for Founding Partner Access", href: "/request-access" },
              { label: "Schedule a Conversation", href: "/contact" },
            ].map(l => (
              <Link key={l.label} href={l.href} style={{ ...DM, display: "block", color: MUTED_DARK, fontSize: 14, padding: "4px 0", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>

          {/* Demos */}
          <div style={{ flex: 1 }}>
            <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>DEMOS</div>
            {[
              { label: "Situation Scanner",          href: "/situation-scanner" },
              { label: "Cost of Delay",             href: "/cost-of-delay" },
              { label: "Sector Threat Briefing",    href: "/sector-briefing" },
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
              { label: "Team",               href: "/team" },
              { label: "Founder's Story",    href: "/founder-story" },
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
            VaughnMartin · Readiness OS · Built for startup to Fortune 500 · Confidential
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
      {/* Aerial city grid — precision and scale at low opacity */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `url(${aerialImg})`,
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.12,
        pointerEvents: "none",
      }} />
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

// ─── How Triggers Work ───────────────────────────────────────────────────────
function HowTriggersWorkSection() {
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
  const sources = [
    { label: "News & Business Media", detail: "NY Times, BBC, CNBC, MarketWatch, NPR — scanned every 15 minutes" },
    { label: "Regulatory Filings", detail: "Federal Register — rule changes, enforcement notices, compliance deadlines" },
    { label: "Market Data Feeds", detail: "Google Finance, Entrepreneur — competitive moves, deal announcements, market shifts" },
    { label: "Industry Signal Sources", detail: "Sector-specific feeds across finance, pharma, manufacturing, energy, and retail" },
  ];
  return (
    <section className="hp-section-reduce" style={{ background: "#F8F7F4", padding: "80px 0", borderTop: "1px solid #E8E4DC" }}>
      <div style={{ ...CONTAINER, maxWidth: 1100 }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 64, flexWrap: "wrap" as const }}>
            {/* Left: explanation */}
            <div style={{ flex: "1 1 400px", minWidth: 300 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 2, background: TEAL }} />
                <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: TEAL }}>Where Triggers Come From</span>
              </div>
              <h2 style={{ ...CG, fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 20 }}>
                The system monitors continuously.<br />
                <em style={{ color: GOLD, fontStyle: "italic" }}>Executives decide.</em>
              </h2>
              <p style={{ ...DM, fontSize: 15, color: "#4A5568", lineHeight: 1.7, marginBottom: 20 }}>
                Readiness OS monitors <strong>248+ data points across 231 trigger types</strong> — every 15 minutes, around the clock. When a signal crosses the confidence threshold, the system surfaces it as a potential trigger for executive review.
              </p>
              <p style={{ ...DM, fontSize: 15, color: "#4A5568", lineHeight: 1.7, marginBottom: 28 }}>
                No Readiness Protocol activates without executive sign-off. The system detects and stages. The executive authorizes. That sequence is the product.
              </p>
              <div style={{ padding: "16px 20px", background: NAVY, display: "inline-block" }}>
                <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.68)", marginBottom: 6 }}>Monitoring cadence</div>
                <div style={{ ...CG, fontSize: 26, fontWeight: 700, color: GOLD, lineHeight: 1 }}>Every 15 minutes</div>
                <div style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>8 live signal sources · 231 trigger patterns</div>
              </div>
            </div>
            {/* Right: sources */}
            <div style={{ flex: "1 1 340px", minWidth: 280 }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 16 }}>Signal Sources</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 2 }}>
                {sources.map((s, i) => (
                  <div key={i} style={{ padding: "18px 20px", background: "#fff", border: "1px solid #E8E4DC", display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, flexShrink: 0, background: "rgba(43,138,110,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 8, height: 8, background: TEAL, borderRadius: "50%" }} />
                    </div>
                    <div>
                      <div style={{ ...DM, fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 3 }}>{s.label}</div>
                      <div style={{ ...DM, fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: "14px 18px", background: "rgba(43,138,110,0.06)", border: "1px solid rgba(43,138,110,0.18)" }}>
                <p style={{ ...DM, fontSize: 12, color: TEAL, margin: 0, lineHeight: 1.55 }}>
                  <strong>Signal → Review → Authorize → Execute.</strong> The executive is never bypassed. The system is never idle.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Live chain trace — one scenario, end-to-end ── */}
        <Reveal delay={0.15}>
          <div style={{ marginTop: 56, borderTop: "1px solid #E8E4DC", paddingTop: 40 }}>
            <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 24, textAlign: "center" as const }}>
              Watch the chain — signal to execution
            </div>
            <div style={{ display: "flex", alignItems: "stretch", gap: 0, overflowX: "auto" as const }}>
              {[
                { step: "01", label: "Signal Detected", detail: "Reuters Business", sub: "Ransomware confirmed · 95% match", bg: "#F8F7F4", accent: TEAL },
                { step: "02", label: "Trigger Matched", detail: "Ransomware Attack Confirmed", sub: "231 patterns evaluated · instant", bg: "#F0EDE4", accent: TEAL },
                { step: "03", label: "Readiness Protocol Staged", detail: "Ransomware Response", sub: "Pre-built · roles pre-assigned", bg: "#F8F7F4", accent: GOLD },
                { step: "04", label: "Executive Authorizes", detail: "CISO + CFO sign-off", sub: "Human decision preserved", bg: "#F0EDE4", accent: GOLD },
                { step: "05", label: "Execution Begins", detail: "12 minutes after detection", sub: "30 days → 12 min", bg: NAVY, accent: GOLD },
              ].map((node, i) => (
                <div key={i} style={{ flex: "1 1 0", minWidth: 140, display: "flex", alignItems: "stretch" }}>
                  <div style={{
                    flex: 1, padding: "20px 18px", background: node.bg,
                    border: `1px solid ${i < 4 ? "#E8E4DC" : "transparent"}`,
                    borderLeft: i === 0 ? `3px solid ${node.accent}` : undefined,
                    borderRight: i === 4 ? undefined : "none",
                    display: "flex", flexDirection: "column" as const, gap: 6,
                    position: "relative" as const,
                  }}>
                    <div style={{ ...DM, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: node.accent, textTransform: "uppercase" as const }}>
                      {node.step} · {node.label}
                    </div>
                    <div style={{ ...DM, fontSize: 13, fontWeight: 700, color: i === 4 ? "#fff" : NAVY, lineHeight: 1.3 }}>{node.detail}</div>
                    <div style={{ ...DM, fontSize: 11, color: i === 4 ? "rgba(255,255,255,0.55)" : "#6B7280", lineHeight: 1.4 }}>{node.sub}</div>
                    {i < 4 && (
                      <div style={{ position: "absolute" as const, right: -10, top: "50%", transform: "translateY(-50%)", zIndex: 2, ...DM, fontSize: 14, color: node.accent, fontWeight: 700 }}>→</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" as const }}>
              <Link href="/12-minute-experience" style={{ ...DM, fontSize: 12, fontWeight: 700, color: TEAL, textDecoration: "none", letterSpacing: "0.06em", borderBottom: `1px solid rgba(43,138,110,0.35)`, paddingBottom: 1 }}>
                Experience the full 12-minute execution →
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── How Readiness Protocols Work ───────────────────────────────────────────────────────
function HowPlaybooksWorkSection() {
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
  const steps = [
    {
      num: "01",
      label: "Pre-Built Architecture",
      body: "180 Readiness Protocols ship as proven decision frameworks — built from 20+ years of startup to Fortune 500 operational experience across 9 strategic domains. Every stakeholder role, every task sequence, every communication chain is already mapped.",
      accent: GOLD,
    },
    {
      num: "02",
      label: "Customized to Your Organization",
      body: "During the preparation phase, each Readiness Protocol is personalized to your structure: your decision-rights holders, your specific stakeholder chain, your communication protocols, your budget thresholds. The owner is in the room when the response is built — not when it's delivered.",
      accent: TEAL,
    },
    {
      num: "03",
      label: "Staged Before Any Trigger Fires",
      body: "When a situation presents itself, your response doesn't start — it deploys. The preparation phase is where the work happens. The 12 minutes is where it executes. That's the difference between a plan on a shelf and infrastructure that's ready to activate.",
      accent: NAVY,
    },
  ];
  return (
    <section className="hp-section-reduce" style={{ background: "#fff", padding: "88px 0", borderTop: "1px solid #E8E4DC", borderBottom: "1px solid #E8E4DC" }}>
      <div style={{ ...CONTAINER, maxWidth: 1100 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 2, background: GOLD }} />
              <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#9CA3AF" }}>How the Readiness Protocols Work</span>
              <div style={{ width: 32, height: 2, background: GOLD }} />
            </div>
            <h2 style={{ ...CG, fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 16 }}>
              Not generic templates.<br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>Proven architecture, personalized to you.</em>
            </h2>
            <p style={{ ...DM, fontSize: 16, color: "#4A5568", maxWidth: 640, margin: "0 auto", lineHeight: 1.65 }}>
              The Readiness Protocols start as accumulated decision logic from decades of startup to Fortune 500 strategic response. They become yours through the preparation phase — customized to your people, your structure, and your specific conditions before any trigger fires.
            </p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ padding: "36px 32px", background: i === 2 ? NAVY : "#F8F7F4", border: `1px solid ${i === 2 ? "transparent" : "#E8E4DC"}`, height: "100%" }}>
                <div style={{ ...CG, fontSize: 44, fontWeight: 700, color: i === 2 ? GOLD : s.accent, lineHeight: 1, marginBottom: 16, opacity: 1 }}>{s.num}</div>
                <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: i === 2 ? "rgba(255,255,255,0.68)" : "#9CA3AF", marginBottom: 10 }}>{s.label}</div>
                <p style={{ ...DM, fontSize: 14, color: i === 2 ? "rgba(255,255,255,0.75)" : "#4A5568", lineHeight: 1.7, margin: 0 }}>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div style={{ marginTop: 2, padding: "36px 40px", background: NAVY, border: "none", display: "grid", gridTemplateColumns: "1fr 2fr", gap: 40, alignItems: "center" }}>
            <div>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 14 }}>The System Compounds</div>
              <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                04 —<br />
                <em style={{ color: GOLD, fontStyle: "italic" }}>Deepens through every activation.</em>
              </div>
            </div>
            <div>
              <p style={{ ...DM, fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, margin: 0 }}>
                The entire platform IS the Readiness Protocol system — and it grows with every use. Each activation adds a real decision record. Each challenge-rights exchange embeds your organization's specific judgment. Each debrief updates the failure modes. After 12 months, your Readiness Protocol record contains irreplicable organizational intelligence: real trigger events, under real pressure, by your actual people, in your actual structure. A competitor can buy the same software on day one. They cannot buy your preparation history.
              </p>
              <div style={{ marginTop: 16, ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: TEAL }}>
                The moat is capability, not software — and capability compounds.
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <div style={{ marginTop: 2, padding: "22px 32px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" as const }}>
            <div style={{ ...CG, fontSize: 18, fontWeight: 700, color: NAVY, lineHeight: 1.3, flex: "1 1 300px" }}>
              "The competitor can buy the platform. They cannot buy the accumulated decision logic embedded in the preparation phase."
            </div>
            <div style={{ ...DM, fontSize: 11, color: "#9CA3AF", flex: "0 0 auto" }}>
              DR. KERRY HUANG · ESI TOP 1% RESEARCHER · 408-FIRM STUDY
            </div>
          </div>
        </Reveal>
      </div>
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
            Test Your Organization Against Any Situation
          </h2>
          <p style={{ ...DM, fontSize: 16, color: MUTED_DARK, maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.65 }}>
            Describe a real scenario your company is facing. The system maps your coverage readiness in seconds — and surfaces the exact Readiness Protocols pre-staged for activation.
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
// ─── Full Advantage Lifecycle Section ────────────────────────────────────────
function LifecycleAdvantageSection() {
  const stages = [
    {
      num: "01", stage: "IDENTIFY",
      label: "Define every trigger — on your terms",
      body: "You decide what you're watching for. 231 trigger patterns across 9 strategic domains, catalogued on your thresholds, in your categories. Not someone else's alert. Yours — configured before the event, not discovered after it.",
      accent: GOLD,
    },
    {
      num: "02", stage: "DETECT",
      label: "Alerted before it becomes public",
      body: "248+ data points scanned every 15 minutes. You're alerted at the earliest signal — before the announcement, before the filing goes public, before competitors know. Not from a news headline. From your own defined triggers, firing on your timeline.",
      accent: TEAL,
    },
    {
      num: "03", stage: "AUTHORIZE",
      label: "Act with authority, not assembly",
      body: "Decision rights pre-defined before pressure exists. When a trigger fires, executives authorize from pre-staged options — not figure out who owns what. Authority preserved at every step.",
      accent: GOLD,
    },
    {
      num: "04", stage: "EXECUTE",
      label: "Deploy the full coordinated response",
      body: "180 Readiness Protocols deploy simultaneously — tasks, budgets, communications, and stakeholder notifications in minutes. Not assembled under pressure. Already built.",
      accent: TEAL,
    },
    {
      num: "05", stage: "ADVANCE",
      label: "Improve after every event",
      body: "Every activation is scored, analyzed, and encoded into institutional memory. Each cycle makes the next response faster, sharper, and harder to catch your organization off-guard.",
      accent: GOLD,
    },
  ];

  return (
    <section className="hp-section-reduce" style={{ background: NAVY, padding: "96px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
      <div style={{ ...CONTAINER, position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.8)" }}>The Full Advantage System</span>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 20 }}>
              End-to-end advantage —<br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>before, during, and after every trigger.</em>
            </h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.62)", maxWidth: 620, margin: "0 auto", lineHeight: 1.75 }}>
              We don't accelerate response. We build the complete operating architecture — so your organization sees situations earlier, decides with authority, executes in minutes, and improves every cycle.
            </p>
          </div>
        </Reveal>

        {/* 5-stage grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 1, background: "rgba(255,255,255,0.05)" }}>
          {stages.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ background: NAVY, padding: "32px 24px 28px", height: "100%", boxSizing: "border-box" as const, borderTop: `3px solid ${s.accent}` }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.24em", color: s.accent, textTransform: "uppercase" as const, marginBottom: 10 }}>{s.num} · {s.stage}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.35, marginBottom: 16 }}>{s.label}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.72 }}>{s.body}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Flow connector */}
        <Reveal delay={0.4}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 28, marginBottom: 20 }}>
            {["IDENTIFY", "DETECT", "AUTHORIZE", "EXECUTE", "ADVANCE"].map((label, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: i % 2 === 0 ? GOLD : TEAL }}>{label}</span>
                {i < 4 && <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 13 }}>→</span>}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Canonical positioning quote */}
        <Reveal delay={0.5}>
          <div style={{ padding: "24px 40px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.14)", borderLeft: `3px solid ${GOLD}`, maxWidth: 820, margin: "0 auto" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(16px,1.6vw,20px)", fontWeight: 700, color: "#fff", fontStyle: "italic", lineHeight: 1.55, margin: 0, textAlign: "center" }}>
              "Readiness OS gives organizations end-to-end advantage: see situations earlier, decide with authority, execute in minutes, and improve every cycle."
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── BINARY STAKES SECTION ────────────────────────────────────────────────────
function BinaryStakesSection() {
  return (
    <section style={{ background: IVORY, padding: "80px 0", borderTop: "1px solid rgba(10,15,46,0.08)" }}>
      <div style={{ ...CONTAINER }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 32, height: 1.5, background: GOLD }} />
              <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>The Proof</span>
              <div style={{ width: 32, height: 1.5, background: GOLD }} />
            </div>
            <h2 style={{ ...GEO, fontSize: "clamp(30px,4vw,54px)", fontWeight: 700, color: NAVY, lineHeight: 1.1, marginBottom: 4 }}>
              The situation arrives.
            </h2>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px,3.5vw,48px)", fontWeight: 400, fontStyle: "italic", color: GOLD, lineHeight: 1.2, marginBottom: 24 }}>
              The response was ready. Or it wasn't.
            </h2>
            <p style={{ ...DM, fontSize: 15, color: "#4B5563", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
              Every organization faces the same trigger events. The only variable is whether the response was staged before the situation required it.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 3px 1fr", gap: 0, maxWidth: 960, margin: "0 auto 44px" }}>
          <Reveal>
            <div style={{ padding: "40px 48px 40px 0" }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: RED_CRISIS, marginBottom: 20 }}>Without Readiness OS</div>
              {[
                { t: "Day 1–3",   b: "Leadership realizes something is happening. Emails start flying." },
                { t: "Day 4–7",   b: "First cross-functional meeting scheduled. No brief exists. Who owns this?" },
                { t: "Day 8–14",  b: "Stakeholder alignment underway. Someone drafts a plan. Revisions begin." },
                { t: "Day 15–30", b: "Approval cycle. Leadership reviews. Execution finally authorized." },
                { t: "Day 30+",   b: "You're executing. The window may have already closed." },
              ].map(({ t, b }) => (
                <div key={t} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
                  <div style={{ width: 7, height: 7, background: RED_CRISIS, flexShrink: 0, marginTop: 5 }} />
                  <div>
                    <div style={{ ...DM, fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 3 }}>{t}</div>
                    <div style={{ ...DM, fontSize: 13, color: "#6B7280", lineHeight: 1.55 }}>{b}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 24, padding: "14px 20px", background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.15)" }}>
                <span style={{ ...DM, fontSize: 13, fontWeight: 700, color: RED_CRISIS }}>30 days of managed chaos — every delay a compounding liability</span>
              </div>
            </div>
          </Reveal>

          <div style={{ background: "rgba(10,15,46,0.1)", margin: "40px 0" }} />

          <Reveal delay={0.1}>
            <div style={{ padding: "40px 0 40px 48px" }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 20 }}>With Readiness OS</div>
              {[
                { t: "Minute 0",  b: "Signal detected across 248+ monitored data points. Protocol matched automatically." },
                { t: "Minute 2",  b: "Readiness Protocol activated. All stakeholders notified with pre-staged briefs." },
                { t: "Minute 6",  b: "Executive authorization requested. Tasks visible. Team coordinated." },
                { t: "Minute 12", b: "Full response live. Every stakeholder executing their pre-assigned role." },
                { t: "After",     b: "Every activation makes the next response faster. The system compounds." },
              ].map(({ t, b }) => (
                <div key={t} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
                  <div style={{ width: 7, height: 7, background: TEAL, flexShrink: 0, marginTop: 5 }} />
                  <div>
                    <div style={{ ...DM, fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 3 }}>{t}</div>
                    <div style={{ ...DM, fontSize: 13, color: "#6B7280", lineHeight: 1.55 }}>{b}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 24, padding: "14px 20px", background: `rgba(43,138,110,0.07)`, border: `1px solid rgba(43,138,110,0.2)` }}>
                <span style={{ ...DM, fontSize: 13, fontWeight: 700, color: TEAL }}>12 minutes. Full response. The window stays open.</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div style={{ textAlign: "center" }}>
            <Link href="/proof-story" style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: NAVY, textDecoration: "none", borderBottom: `1px solid ${GOLD}`, paddingBottom: 3 }}>
              See the full activation narratives — with financial outcomes →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── POSITIONING SECTION (extracted) ──────────────────────────────────────────
function PositioningSection() {
  return (
    <section style={{ background: NAVY, padding: "88px 0", borderTop: "1px solid rgba(201,168,76,0.12)" }}>
      <div style={{ ...CONTAINER, maxWidth: 860, textAlign: "center" }}>
        <Reveal>
          <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 28 }}>
            The Positioning
          </div>
          <blockquote style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px,2.8vw,32px)", fontWeight: 400, fontStyle: "italic", color: IVORY, lineHeight: 1.7, margin: "0 0 32px" }}>
            "Most tools address one moment. Readiness OS addresses the entire decision lifecycle — from signal detection through decision preparation through activated execution through institutional learning — and every cycle through that lifecycle makes the organization more capable of handling the next one."
          </blockquote>
          <div style={{ width: 48, height: 1, background: GOLD, margin: "0 auto 28px" }} />
          <p style={{ fontSize: 13, color: "rgba(240,237,228,0.5)", fontWeight: 600, lineHeight: 1.9, margin: "0 0 40px" }}>
            That is not a coordination tool. That is not an execution tool.<br />
            That is a strategic intelligence system that compounds organizational decision capability over time.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" as const }}>
            <a href="/mission-control" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, padding: "14px 30px", fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" as const, textDecoration: "none" }}>
              Enter Mission Control →
            </a>
            <a href="/12-minute-experience" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(240,237,228,0.65)", padding: "14px 30px", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, textDecoration: "none", border: "1px solid rgba(240,237,228,0.18)" }}>
              See Your Scenario →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SALES DEPTH STRIP ─────────────────────────────────────────────────────────
function SalesDepthStrip() {
  const assets = [
    { label: "Proof Story",           desc: "Side-by-side activation timelines — 4 full narratives with real financial outcomes.",              href: "/proof-story",           accent: GOLD,  tag: "Evidence"      },
    { label: "Executive Brief",       desc: "Printable one-pager for every enterprise sales conversation and RFP response.",                    href: "/executive-brief",       accent: GOLD,  tag: "Sales Asset"   },
    { label: "Board Briefings",       desc: "Board-ready activation reports. Gets Readiness OS into the boardroom conversation.",               href: "/board-briefings",       accent: TEAL,  tag: "Governance"    },
    { label: "ADVANCE Intelligence",  desc: "The compound learning moat — every activation makes the next response faster and sharper.",        href: "/advance-intelligence",  accent: TEAL,  tag: "The Moat"      },
    { label: "ROI Calculator",        desc: "Build the business case. Break-even, 3-year net value, retainer comparison.",                      href: "/roi-calculator",        accent: GOLD,  tag: "Business Case" },
    { label: "Command Tower",         desc: "Live signal feed. Executive NOC. 248+ data points in real time — no login required.",              href: "/command-tower",         accent: TEAL,  tag: "Live System"   },
  ];
  return (
    <section style={{ background: NAVY, padding: "72px 0", borderTop: "1px solid rgba(201,168,76,0.12)" }}>
      <div style={{ ...CONTAINER }}>
        <Reveal>
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1.5, background: GOLD }} />
              <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>For Due Diligence</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px,3vw,36px)", fontWeight: 600, color: IVORY, lineHeight: 1.2, maxWidth: 600 }}>
              Everything you need to evaluate, present, and close.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {assets.map((a, i) => (
            <Reveal key={a.label} delay={i * 0.06}>
              <Link href={a.href} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                <div style={{ background: "#0D1435", border: "1px solid rgba(255,255,255,0.06)", padding: "28px 28px 24px", height: "100%", boxSizing: "border-box" as const }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <span style={{ ...DM, fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: a.accent, padding: "3px 8px", border: `1px solid ${a.accent}40` }}>{a.tag}</span>
                    <span style={{ color: a.accent, fontSize: 16, fontWeight: 700 }}>→</span>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 700, color: IVORY, marginBottom: 10, lineHeight: 1.2 }}>{a.label}</div>
                  <p style={{ ...DM, fontSize: 13, color: "rgba(240,237,228,0.55)", lineHeight: 1.6, margin: 0 }}>{a.desc}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TIMESTAMP CLOSE SECTION ───────────────────────────────────────────────────
function TimestampCloseSection() {
  return (
    <section style={{ background: "#fff", padding: "80px 0", borderTop: "1px solid #E8E4DC" }}>
      <div style={{ ...CONTAINER, maxWidth: 960 }}>
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <div style={{ width: 28, height: 1.5, background: GOLD }} />
                <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "#6B7280" }}>The Competitive Test</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 600, color: NAVY, lineHeight: 1.1, marginBottom: 24 }}>
                Show us your timestamp.
              </h2>
              <p style={{ ...DM, fontSize: 15, color: "#4B5563", lineHeight: 1.75, marginBottom: 20 }}>
                Any framework, methodology, or approach that still produces a 30-day mobilization cycle loses the conversation in three numbers: <strong style={{ color: NAVY }}>30 days vs. 12 minutes</strong>. That's a 3,600× Execution Head Start.
              </p>
              <p style={{ ...DM, fontSize: 15, color: "#374151", fontWeight: 600, lineHeight: 1.65, marginBottom: 36 }}>
                We're not competing on who has the better theory.<br />We're competing on who can show the timestamp.
              </p>
              <Link href="/platform-reality" style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: NAVY, textDecoration: "none", borderBottom: `1px solid ${GOLD}`, paddingBottom: 3 }}>
                See every alternative — and why the gap stays →
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 2 }}>
              <div style={{ background: NAVY, padding: "32px", textAlign: "center" as const }}>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 72, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 8 }}>30</div>
                <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.4)", marginBottom: 6 }}>Days — the standard model</div>
                <div style={{ ...DM, fontSize: 13, color: "rgba(240,237,228,0.4)", fontStyle: "italic" }}>Workshop. Alignment meeting. Steering committee. Unchanged.</div>
              </div>
              <div style={{ background: "#F3F4F6", padding: "14px", textAlign: "center" as const }}>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#9CA3AF" }}>÷ 3,600</div>
              </div>
              <div style={{ background: `rgba(201,168,76,0.07)`, border: `2px solid ${GOLD}`, padding: "32px", textAlign: "center" as const }}>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 72, fontWeight: 700, color: NAVY, lineHeight: 1, marginBottom: 8 }}>12</div>
                <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: NAVY, marginBottom: 6 }}>Minutes — Readiness OS</div>
                <div style={{ ...DM, fontSize: 13, color: "#374151", fontStyle: "italic" }}>Signal detected. Protocol matched. Executive authorized. Live.</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StartHereSection() {
  const steps = [
    {
      n: "01",
      label: "Read the complete buying argument",
      desc: "Problem cost → proof → moat → ROI → comparison → decision. Everything an enterprise buyer needs, in sequence, on one page.",
      cta: "Read The Case →",
      href: "/the-case",
      accent: GOLD,
    },
    {
      n: "02",
      label: "Feel the cost of not acting",
      desc: "What is your current 30-day mobilization model costing — while you evaluate this? See it counting in real time.",
      cta: "Open Cost of Delay →",
      href: "/cost-of-delay",
      accent: TEAL,
    },
    {
      n: "03",
      label: "Watch a trigger execute",
      desc: "A real Readiness Protocol from signal detection to full authorized response. 12 minutes, no login required.",
      cta: "Run the 12-Minute Experience →",
      href: "/12-minute-experience",
      accent: GOLD,
    },
    {
      n: "04",
      label: "See your sector's live exposure",
      desc: "Which signals are active in your industry right now — and which of the 180 Readiness Protocols are already staged for them.",
      cta: "View Sector Threat Briefing →",
      href: "/sector-briefing",
      accent: TEAL,
    },
    {
      n: "05",
      label: "Calculate your organization's return",
      desc: "Your size, your risk profile, your contract value. A precise ROI figure — not a range, not a benchmark. Yours.",
      cta: "Open ROI Calculator →",
      href: "/roi-calculator",
      accent: GOLD,
    },
    {
      n: "06",
      label: "Apply for Founding Partner Access",
      desc: "90-day validation partnership. 12 enterprises. The response is already staged before you arrive.",
      cta: "Apply for Founding Partner Access →",
      href: "/founding-partner",
      accent: TEAL,
    },
  ];

  return (
    <section style={{ background: "#F0EDE4", borderTop: "3px solid rgba(201,168,76,0.35)", padding: "64px 0 56px" }}>
      <div style={{ ...CONTAINER, width: "100%" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 32, height: 2, background: GOLD }} />
            <span style={{ ...DM, fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>First Time Here</span>
            <div style={{ width: 32, height: 2, background: GOLD }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: NAVY, margin: "0 0 10px", lineHeight: 1.15 }}>
            Your sequence. Five steps. No guessing.
          </h2>
          <p style={{ ...DM, fontSize: 15, color: "#4B5563", maxWidth: 560, margin: 0, lineHeight: 1.65 }}>
            Two visitors. Two different starting points. This path closes the gap — every time, in the right order.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {steps.map(({ n, label, desc, cta, href, accent }) => (
            <Link
              key={n}
              href={href}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid rgba(10,15,46,0.10)",
                  borderTop: `3px solid ${accent}`,
                  padding: "24px 22px 22px",
                  height: "100%",
                  boxSizing: "border-box",
                  transition: "box-shadow 0.15s, transform 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "0 8px 32px rgba(10,15,46,0.12)";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                }}
              >
                <div style={{ ...DM, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: accent, marginBottom: 10 }}>{n}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 700, color: NAVY, marginBottom: 10, lineHeight: 1.3 }}>{label}</div>
                <div style={{ ...DM, fontSize: 12.5, color: "#6B7280", lineHeight: 1.65, marginBottom: 16 }}>{desc}</div>
                <div style={{ ...DM, fontSize: 12, fontWeight: 700, color: accent, letterSpacing: "0.04em" }}>{cta}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WORKFLOW DISTINCTION ─────────────────────────────────────────────────────
function WorkflowDistinctionSection() {
  return (
    <section style={{ background: "#fff", borderTop: "1px solid #E8E4DC", borderBottom: "1px solid #E8E4DC", padding: "80px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
            <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>The Distinction</span>
            <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, marginBottom: 12 }}>
            Every workflow tool assumes mobilization is solved.
          </h2>
          <p style={{ ...DM, fontSize: 17, color: "#6B7280", maxWidth: 560, margin: "0 auto" }}>
            It isn't. That assumption is where organizations lose 30 days.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "1px solid #E8E4DC", maxWidth: 900, margin: "0 auto 40px" }}>
          <div style={{ padding: "40px 40px", background: "#F8F7F4", borderRight: "1px solid #E8E4DC", opacity: 0.8 }}>
            <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 20 }}>
              Workflow Tools — Jira · Monday · ServiceNow
            </div>
            <div style={{ ...DM, fontSize: 12, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 16 }}>Trigger fires.</div>
            {[
              "Someone opens a project tool",
              "Team asks: who owns this? What is the scope?",
              "Tasks are created from scratch under pressure",
              "Budget approval starts from zero",
              "Stakeholders align over 2–4 weeks of meetings",
              "Execution finally begins — 30 days later",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 11, alignItems: "flex-start" }}>
                <span style={{ color: "#D1D5DB", fontSize: 13, flexShrink: 0, marginTop: 1 }}>→</span>
                <span style={{ ...DM, fontSize: 13, color: "#9CA3AF", lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: "40px 40px", background: NAVY }}>
            <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 20 }}>
              Readiness Infrastructure — Readiness OS
            </div>
            <div style={{ ...DM, fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 16 }}>Before the trigger fires.</div>
            {[
              "180 Readiness Protocols already staged to your triggers",
              "Named owners, pre-assigned tasks, decision authority mapped",
              "Budget envelope pre-authorized — zero approval delay",
              "Communication chain pre-drafted and ready to deploy",
              "Executive authorizes once — the org moves in 12 minutes",
              "Executing before competitors hold their first meeting",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 11, alignItems: "flex-start" }}>
                <span style={{ color: GOLD, fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.82)", lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(18px,2vw,26px)", fontWeight: 700, color: NAVY, margin: 0 }}>
            This is not a workflow tool. It is readiness infrastructure.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── SOCIAL PROOF STRIP — surfaces near top per board recommendation ──────────
function SocialProofStrip() {
  const quotes = [
    {
      name: "Dr. Kerry Huang",
      title: "Fortune 50 AVP · Forbes Business Council · 408-Firm Governance Study",
      excerpt: "Martin is building the architecture that makes clarity possible before pressure arrives.",
    },
    {
      name: "Jayashree Venkataraman",
      title: "Execution Reliability Advisor · CoFounder, NIYA & LeadWell Lab",
      excerpt: "When multiple practitioners converge on the same failure point from different lenses, the issue is no longer tactical — it is architectural.",
    },
  ];

  return (
    <section style={{ background: "#F0EDE4", borderTop: "1px solid rgba(10,15,46,0.08)", borderBottom: "1px solid rgba(10,15,46,0.08)", padding: "36px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
          {/* Label */}
          <div style={{ flexShrink: 0, paddingRight: 32, borderRight: "1px solid rgba(10,15,46,0.10)", marginRight: 32, display: "flex", alignItems: "center", minWidth: 160 }}>
            <div style={{ ...DM, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, lineHeight: 1.5 }}>
              What<br />Practitioners<br />Are Saying
            </div>
          </div>
          {/* Quotes grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28, flex: 1 }}>
            {quotes.map(q => (
              <div key={q.name}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontStyle: "italic", color: NAVY, lineHeight: 1.65, margin: "0 0 10px", opacity: 0.85 }}>
                  "{q.excerpt}"
                </p>
                <div style={{ ...DM, fontSize: 11, fontWeight: 700, color: NAVY }}>{q.name}</div>
                <div style={{ ...DM, fontSize: 10, color: TEAL, lineHeight: 1.4, marginTop: 2 }}>{q.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Homepage() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useScrollDepth();
  useEffect(() => {
    updatePageMetadata({
      title: "VaughnMartin | Readiness OS — Enterprise Coordination Infrastructure",
      description: "Readiness OS gives startup to Fortune 500 enterprises end-to-end advantage: map every situation you'll face, monitor the right signals, decide with authority, execute in 12 minutes, and improve every cycle. 180 Readiness Protocols, 248+ data points, zero improvisation.",
      ogTitle: "VaughnMartin Readiness OS — End-to-End Organizational Advantage",
      ogDescription: "The response is ready before the trigger fires. Map · Monitor · Decide · Execute · Learn — the complete operating architecture for startup to Fortune 500 execution. 3,600× Execution Head Start.",
    });
  }, []);
  return (
    <div style={{ background: NAVY, margin: 0, padding: 0 }}>
      <FirstVisitAdModal />
      <HomepageNav />
      <GuestPreviewBanner />

      {/* 1. CLAIM — The response is ready before the trigger fires */}
      <HeroSection />

      {/* 1b. FEEL IT — Reality Gap Simulator: 30 days vs 12 minutes, animated */}
      <RealityGapSimulator />

      {/* 2. SITUATIONS — 4 live scenarios, immediately below the claim */}
      <ScenarioCardsRow />

      {/* 3. CREDIBILITY — practitioner voices before the visitor scrolls */}
      <SocialProofStrip />

      {/* 4. PROBLEM — Detection + Mobilization gaps */}
      <ProblemSection />

      {/* 5. DISTINCTION — Not a workflow tool. Readiness infrastructure. */}
      <WorkflowDistinctionSection />

      {/* 6. MICROSOFT — You have the stack; none have the operating model */}
      <MicrosoftHookStrip />

      {/* 7. HOW IT WORKS — IDEA Framework + Before/After */}
      <IDEASection />

      {/* 8. MECHANISM — Animated 12-minute execution chain */}
      <ExecChainSection />

      {/* 9. PLATFORM — What it looks like in action */}
      <PlatformScreenshotSection />

      {/* 10. ANATOMY — What's inside every Readiness Protocol */}
      <AnatomySection />

      {/* 11. CONTRAST — 30 days → 12 minutes */}
      <ContrastMomentSection />

      {/* 12. PROOF — 15 research organizations + Dr. Kerry Huang */}
      <CredibilitySection />

      {/* 13. Q&A — Executive questions, including the workflow distinction */}
      <ExecutiveQASection />

      {/* 14. FEARLESS — Preparation → Readiness → Fearless */}
      <FearlessFinaleSection />

      {/* 15. OPERATING MODEL RETURN — Profitability / Delivery / Cost */}
      <OperatingModelOutcomesSection />

      {/* 16. CTA */}
      <CTASection />
      <HomepageFooter />
    </div>
  );
}

