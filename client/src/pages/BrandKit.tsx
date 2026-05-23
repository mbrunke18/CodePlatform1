import { useState, useEffect } from "react";

// ── Brand System ───────────────────────────────────────────────────────────────
const B = {
  navy:    "#0A0F2E",
  navyBg:  "#132558",
  navyMid: "#141B45",
  gold:    "#C9A84C",
  goldLt:  "#DFC178",
  teal:    "#2B8A6E",
  tealLt:  "#3BAF8A",
  ivory:   "#F8F7F4",
  border:  "#E8E4DC",
  muted:   "#6B7280",
  red:     "#C0392B",
};

// Platform-aligned font constants (Cormorant Garamond + Barlow Condensed)
const EDITORIAL = "'Cormorant Garamond', Georgia, serif";
const LABEL     = "'Barlow Condensed', sans-serif";

const grid = {
  backgroundImage: `linear-gradient(rgba(201,168,76,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.09) 1px,transparent 1px)`,
  backgroundSize: "48px 48px",
};

// ── VM Seal SVG ────────────────────────────────────────────────────────────────
function VMSeal({ size = 200, variant = "dark", animated = false }: {
  size?: number; variant?: string; animated?: boolean;
}) {
  const isDark = variant === "dark" || variant === "gold-on-dark";
  const bg   = isDark ? B.navy  : B.ivory;
  const ring = isDark ? B.goldLt : B.gold;
  const mark = isDark ? B.gold  : B.navy;
  const sub  = isDark ? B.tealLt : B.teal;
  const uid  = `${variant}-${size}`;

  return (
    <svg
      width={size} height={size} viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={animated ? { animation: "sealSpin 40s linear infinite" } : {}}
    >
      <defs>
        <radialGradient id={`rg-${uid}`} cx="50%" cy="30%" r="70%">
          <stop offset="0%"   stopColor={B.goldLt}/>
          <stop offset="50%"  stopColor={B.gold}/>
          <stop offset="100%" stopColor="#A07830"/>
        </radialGradient>
        <radialGradient id={`ig-${uid}`} cx="50%" cy="20%" r="80%">
          <stop offset="0%"   stopColor={isDark ? "#1a2860" : "#ffffff"}/>
          <stop offset="100%" stopColor={bg}/>
        </radialGradient>
        <filter id={`glow-${uid}`}>
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Rings */}
      <circle cx="100" cy="100" r="98" fill="none" stroke={ring} strokeWidth="0.5" opacity="0.3"/>
      <circle cx="100" cy="100" r="94" fill="none" stroke={`url(#rg-${uid})`} strokeWidth="2.5"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke={ring} strokeWidth="0.8" opacity="0.4"/>
      <circle cx="100" cy="100" r="82" fill="none" stroke={ring} strokeWidth="0.4" opacity="0.25"/>
      <circle cx="100" cy="100" r="80" fill={`url(#ig-${uid})`}/>
      <circle cx="100" cy="100" r="74" fill="none" stroke={ring} strokeWidth="0.5" opacity="0.15"/>

      {/* Cardinal ticks */}
      {[0, 90, 180, 270].map(a => {
        const r1 = 94, r2 = 80, rad = a * Math.PI / 180;
        return <line key={a}
          x1={100 + r1 * Math.sin(rad)} y1={100 - r1 * Math.cos(rad)}
          x2={100 + r2 * Math.sin(rad)} y2={100 - r2 * Math.cos(rad)}
          stroke={ring} strokeWidth="3" strokeLinecap="round"/>;
      })}
      {/* Diagonal ticks */}
      {[45, 135, 225, 315].map(a => {
        const r1 = 93, r2 = 84, rad = a * Math.PI / 180;
        return <line key={a}
          x1={100 + r1 * Math.sin(rad)} y1={100 - r1 * Math.cos(rad)}
          x2={100 + r2 * Math.sin(rad)} y2={100 - r2 * Math.cos(rad)}
          stroke={ring} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>;
      })}
      {/* Minor ticks */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(a => {
        const r1 = 92, r2 = 87, rad = a * Math.PI / 180;
        return <line key={a}
          x1={100 + r1 * Math.sin(rad)} y1={100 - r1 * Math.cos(rad)}
          x2={100 + r2 * Math.sin(rad)} y2={100 - r2 * Math.cos(rad)}
          stroke={ring} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>;
      })}

      {/* Diamond accents at cardinal points */}
      <polygon points="100,3 103.5,8 100,13 96.5,8"       fill={ring}/>
      <polygon points="100,187 103.5,192 100,197 96.5,192" fill={ring}/>
      <polygon points="3,100 8,96.5 13,100 8,103.5"        fill={ring}/>
      <polygon points="187,100 192,96.5 197,100 192,103.5" fill={ring}/>

      {/* Arc text — top */}
      <path id={`top-${uid}`} d="M 24,100 A 76,76 0 0,1 176,100" fill="none"/>
      <text fontSize="9" fill={mark} opacity="0.8" letterSpacing="5"
        fontFamily={LABEL} fontWeight="700">
        <textPath href={`#top-${uid}`} startOffset="8%">VAUGHNMARTIN · EST. 2023</textPath>
      </text>

      {/* Arc text — bottom: LOCKED to "READINESS OS" (never "COORDINATION INFRASTRUCTURE") */}
      <path id={`bot-${uid}`} d="M 28,100 A 72,72 0 0,0 172,100" fill="none"/>
      <text fontSize="8.5" fill={sub} opacity="0.9" letterSpacing="6"
        fontFamily={LABEL} fontWeight="700">
        <textPath href={`#bot-${uid}`} startOffset="20%">READINESS OS</textPath>
      </text>

      {/* VM monogram */}
      <text x="100" y="94" textAnchor="middle" fontFamily={EDITORIAL}
        fontSize="34" fontWeight="700" fill={mark} letterSpacing="3"
        filter={`url(#glow-${uid})`}>
        VM
      </text>

      {/* Rule */}
      <line x1="62" y1="100" x2="138" y2="100" stroke={ring} strokeWidth="1" opacity="0.5"/>

      {/* Subline */}
      <text x="100" y="116" textAnchor="middle" fontFamily={LABEL}
        fontSize="8.5" fill={sub} letterSpacing="5" fontWeight="700">
        READINESS OS
      </text>
    </svg>
  );
}

// ── Wordmark ───────────────────────────────────────────────────────────────────
function Wordmark({ size = 1, variant = "dark" }: { size?: number; variant?: string }) {
  const isDark  = variant === "dark";
  const primary = isDark ? B.ivory : B.navy;
  const sub     = isDark ? B.tealLt : B.teal;
  const base    = 48 * size;

  return (
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
      <div style={{ fontFamily: EDITORIAL, fontSize: base, fontWeight: 600, letterSpacing: "0.01em", color: primary }}>
        Vaughn<span style={{ color: B.gold }}>Martin</span>
      </div>
      <div style={{
        fontFamily: LABEL, fontSize: base * 0.3,
        letterSpacing: "0.34em", textTransform: "uppercase" as const,
        color: sub, marginTop: base * 0.06, fontWeight: 700,
      }}>
        Readiness OS
      </div>
    </div>
  );
}

// ── Full Logo Lockup ───────────────────────────────────────────────────────────
function LogoLockup({ sealSize = 100, textSize = 1, variant = "dark", gap = 24 }: {
  sealSize?: number; textSize?: number; variant?: string; gap?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap }}>
      <VMSeal size={sealSize} variant={variant}/>
      <Wordmark size={textSize} variant={variant}/>
    </div>
  );
}

// ── Section Header ─────────────────────────────────────────────────────────────
function SectionHeader({ label, title, dark = false, center = false }: {
  label: string; title: string; dark?: boolean; center?: boolean;
}) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 48 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        justifyContent: center ? "center" : "flex-start", marginBottom: 12,
      }}>
        {!center && <div style={{ width: 36, height: 2, background: B.gold }}/>}
        <span style={{ fontFamily: LABEL, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: B.gold, fontWeight: 700 }}>
          {label}
        </span>
        {center && <div style={{ width: 36, height: 2, background: B.gold }}/>}
      </div>
      <h2 style={{
        fontFamily: EDITORIAL, fontSize: "clamp(32px,4vw,56px)",
        fontWeight: 400, color: dark ? B.ivory : B.navy,
        letterSpacing: "-1px", lineHeight: 1.1, margin: 0,
      }}>
        {title}
      </h2>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────
export default function BrandKit() {
  const [activeTab, setActiveTab] = useState("identity");
  useEffect(() => {}, []);

  const tabs = [
    { id: "identity",  label: "Brand Identity"    },
    { id: "campaigns", label: "Campaign Materials" },
    { id: "digital",   label: "Digital Assets"     },
    { id: "print",     label: "Print & Media"      },
  ];

  return (
    <div style={{ background: B.ivory, minHeight: "100vh", fontFamily: EDITORIAL }}>
      <style>{`
        @keyframes sealSpin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes shimmer  { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
        .bk-tab { transition:all 0.2s; cursor:pointer; border:none; }
        .bk-tab:hover { opacity:0.8; }
        .gold-shimmer {
          background: linear-gradient(90deg, #C9A84C 0%, #DFC178 30%, #C9A84C 60%, #A07830 100%);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: B.navy, borderBottom: `1px solid rgba(201,168,76,0.2)`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 64,
      }}>
        <LogoLockup sealSize={40} textSize={0.42} variant="dark" gap={12}/>
        <div style={{ display: "flex", gap: 4 }}>
          {tabs.map(t => (
            <button key={t.id} className="bk-tab" onClick={() => setActiveTab(t.id)}
              style={{
                padding: "8px 20px", borderRadius: 2,
                background: activeTab === t.id ? B.gold : "transparent",
                color: activeTab === t.id ? B.navy : "rgba(248,247,244,0.6)",
                fontFamily: LABEL, fontSize: 12,
                letterSpacing: "0.25em", textTransform: "uppercase" as const,
                fontWeight: activeTab === t.id ? 700 : 500,
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* BRAND IDENTITY                                                        */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "identity" && (
        <div>

          {/* Hero */}
          <section style={{ background: B.navy, position: "relative", overflow: "hidden", padding: "120px 40px 100px", textAlign: "center" }}>
            <div style={{ position: "absolute", inset: 0, ...grid }}/>
            <div style={{ position: "absolute", width: 900, height: 800, borderRadius: "50%", background: `radial-gradient(ellipse,rgba(201,168,76,0.12) 0%,transparent 65%)`, top: -300, left: -200, pointerEvents: "none" }}/>
            <div style={{ position: "absolute", width: 700, height: 600, borderRadius: "50%", background: `radial-gradient(ellipse,rgba(43,138,110,0.14) 0%,transparent 65%)`, bottom: -200, right: -150, pointerEvents: "none" }}/>
            <div style={{ position: "relative", zIndex: 10 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
                <VMSeal size={180} variant="dark"/>
              </div>
              <div style={{ fontFamily: LABEL, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase" as const, color: B.gold, marginBottom: 20, fontWeight: 700 }}>
                Brand Identity System
              </div>
              <h1 style={{ fontFamily: EDITORIAL, fontSize: "clamp(48px,6vw,88px)", fontWeight: 400, color: B.ivory, letterSpacing: "-2px", lineHeight: 1.0, margin: "0 0 24px" }}>
                Vaughn<span className="gold-shimmer">Martin</span>
              </h1>
              <p style={{ fontFamily: LABEL, fontSize: 15, letterSpacing: "0.4em", color: B.tealLt, textTransform: "uppercase" as const, marginBottom: 40, fontWeight: 700 }}>
                Readiness OS
              </p>
              <p style={{ fontFamily: EDITORIAL, fontSize: 22, fontStyle: "italic", color: "rgba(248,247,244,0.7)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
                "The response is ready before the trigger fires."
              </p>
            </div>
          </section>

          {/* Logo Variations */}
          <section style={{ padding: "80px 40px", background: B.ivory }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <SectionHeader label="The Mark" title="Logo System"/>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, marginBottom: 3 }}>
                <div style={{ background: B.navy, padding: 60, display: "flex", flexDirection: "column", gap: 48, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, ...grid, opacity: 0.6 }}/>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ fontFamily: LABEL, fontSize: 10, letterSpacing: "0.3em", color: B.gold, marginBottom: 24, textTransform: "uppercase" as const, fontWeight: 700 }}>Primary — Dark</div>
                    <LogoLockup sealSize={90} textSize={0.85} variant="dark" gap={20}/>
                  </div>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ fontFamily: LABEL, fontSize: 10, letterSpacing: "0.3em", color: B.gold, marginBottom: 20, textTransform: "uppercase" as const, fontWeight: 700 }}>Seal Only</div>
                    <VMSeal size={80} variant="dark"/>
                  </div>
                </div>
                <div style={{ background: B.ivory, padding: 60, border: `1px solid ${B.border}`, display: "flex", flexDirection: "column", gap: 48 }}>
                  <div>
                    <div style={{ fontFamily: LABEL, fontSize: 10, letterSpacing: "0.3em", color: B.muted, marginBottom: 24, textTransform: "uppercase" as const, fontWeight: 700 }}>Primary — Light</div>
                    <LogoLockup sealSize={90} textSize={0.85} variant="light" gap={20}/>
                  </div>
                  <div>
                    <div style={{ fontFamily: LABEL, fontSize: 10, letterSpacing: "0.3em", color: B.muted, marginBottom: 20, textTransform: "uppercase" as const, fontWeight: 700 }}>Seal Only</div>
                    <VMSeal size={80} variant="light"/>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }}>
                {[
                  { bg: B.gold,   variant: "dark", label: "Gold Background" },
                  { bg: B.teal,   variant: "dark", label: "Teal Background"  },
                  { bg: B.navyBg, variant: "dark", label: "Navy BG"          },
                ].map((v, i) => (
                  <div key={i} style={{ background: v.bg, padding: "40px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ fontFamily: LABEL, fontSize: 10, letterSpacing: "0.3em", color: i === 0 ? B.navy : B.gold, textTransform: "uppercase" as const, fontWeight: 700 }}>{v.label}</div>
                    <LogoLockup sealSize={60} textSize={0.55} variant={v.variant} gap={14}/>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Color System */}
          <section style={{ padding: "80px 40px", background: B.navy, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, ...grid }}/>
            <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
              <SectionHeader label="Color System" title="The Locked Palette" dark/>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
                {[
                  { name: "Navy",     hex: "#0A0F2E", role: "Primary dark",     text: B.gold  },
                  { name: "Navy BG",  hex: "#132558", role: "Dark sections",     text: B.gold  },
                  { name: "Navy Mid", hex: "#141B45", role: "Hover states",      text: B.gold  },
                  { name: "Gold",     hex: "#C9A84C", role: "Accent · CTA",      text: B.navy  },
                  { name: "Gold Lt",  hex: "#DFC178", role: "Gold on dark",      text: B.navy  },
                  { name: "Teal",     hex: "#2B8A6E", role: "Success · Growth",  text: B.ivory },
                  { name: "Ivory",    hex: "#F8F7F4", role: "Light backgrounds", text: B.navy  },
                ].map((c, i) => (
                  <div key={i} style={{ overflow: "hidden" }}>
                    <div style={{ background: c.hex, height: 140, display: "flex", alignItems: "flex-end", padding: "12px 14px" }}>
                      <span style={{ fontFamily: EDITORIAL, fontSize: 22, fontWeight: 600, color: c.text, lineHeight: 1 }}>{c.name}</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.06)", padding: "12px 14px" }}>
                      <div style={{ fontFamily: LABEL, fontSize: 11, color: B.gold, letterSpacing: "0.08em", fontWeight: 700 }}>{c.hex}</div>
                      <div style={{ fontFamily: LABEL, fontSize: 10, color: "rgba(248,247,244,0.4)", marginTop: 4, letterSpacing: "0.06em", fontWeight: 500 }}>{c.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Typography */}
          <section style={{ padding: "80px 40px", background: B.ivory }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <SectionHeader label="Typography" title="Type System"/>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                <div style={{ borderLeft: `3px solid ${B.gold}`, paddingLeft: 28 }}>
                  <div style={{ fontFamily: LABEL, fontSize: 10, letterSpacing: "0.3em", color: B.muted, textTransform: "uppercase" as const, marginBottom: 16, fontWeight: 700 }}>
                    Display — Cormorant Garamond
                  </div>
                  <div style={{ fontFamily: EDITORIAL, fontSize: 64, fontWeight: 400, color: B.navy, lineHeight: 1, letterSpacing: "-2px", marginBottom: 12 }}>Aa</div>
                  <div style={{ fontFamily: EDITORIAL, fontSize: 22, color: B.navy, lineHeight: 1.5, marginBottom: 8 }}>
                    The response is ready before the trigger fires.
                  </div>
                  <div style={{ fontFamily: EDITORIAL, fontSize: 16, fontStyle: "italic", color: B.muted, lineHeight: 1.6 }}>
                    Used for: Headlines, editorial copy, hero statements, pull quotes, body text
                  </div>
                </div>
                <div style={{ borderLeft: `3px solid ${B.teal}`, paddingLeft: 28 }}>
                  <div style={{ fontFamily: LABEL, fontSize: 10, letterSpacing: "0.3em", color: B.muted, textTransform: "uppercase" as const, marginBottom: 16, fontWeight: 700 }}>
                    System — Barlow Condensed
                  </div>
                  <div style={{ fontFamily: LABEL, fontSize: 64, fontWeight: 700, color: B.teal, lineHeight: 1, letterSpacing: "-1px", marginBottom: 12 }}>Aa</div>
                  <div style={{ fontFamily: LABEL, fontSize: 16, color: B.navy, lineHeight: 1.6, letterSpacing: "0.3em", marginBottom: 8, textTransform: "uppercase" as const, fontWeight: 700 }}>
                    READINESS PROTOCOL · 9 DOMAINS
                  </div>
                  <div style={{ fontFamily: EDITORIAL, fontSize: 16, fontStyle: "italic", color: B.muted, lineHeight: 1.6 }}>
                    Used for: Labels, metrics, eyebrows, UI elements, badges, data
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 60, borderTop: `1px solid ${B.border}`, paddingTop: 48 }}>
                <div style={{ fontFamily: LABEL, fontSize: 11, letterSpacing: "0.3em", color: B.muted, textTransform: "uppercase" as const, marginBottom: 32, fontWeight: 700 }}>
                  Scale Reference
                </div>
                {[
                  { size: 72, label: "Display · 72px",  text: "Fearless."                                                                        },
                  { size: 48, label: "Hero · 48px",     text: "The response is ready."                                                           },
                  { size: 32, label: "H1 · 32px",       text: "Before the trigger fires."                                                        },
                  { size: 24, label: "H2 · 24px",       text: "180 Readiness Protocols. 9 Strategic Domains."                                    },
                  { size: 18, label: "Body · 18px",     text: "Signal monitoring. Executive authorization. Coordinated response in 12 minutes."  },
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 24, padding: "14px 0", borderBottom: `1px solid ${B.border}` }}>
                    <div style={{ fontFamily: LABEL, fontSize: 11, color: B.muted, minWidth: 148, letterSpacing: "0.1em", fontWeight: 600 }}>{t.label}</div>
                    <div style={{ fontFamily: EDITORIAL, fontSize: t.size, color: B.navy, lineHeight: 1.1, letterSpacing: t.size > 40 ? "-1.5px" : "-0.5px" }}>{t.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Brand Voice */}
          <section style={{ padding: "80px 40px", background: B.navyMid, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, ...grid }}/>
            <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
              <SectionHeader label="Brand Voice" title="Locked Language" dark center/>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }}>
                {[
                  { label: "Primary Tagline",    text: "The response is ready before the trigger fires.",                                        note: "Never change. Never paraphrase."            },
                  { label: "Primary Promise",    text: "We Make Enterprises Fearless.",                                                          note: "The emotional endpoint of the brand."       },
                  { label: "Secondary Tagline",  text: "Built on the Belief That Preparation Wins.",                                            note: "For investor and board contexts."           },
                  { label: "Category Definition",text: "Readiness Infrastructure for Strategic Trigger Response.",                              note: "How we define the market we created."       },
                  { label: "Canonical Metric",   text: "3,600× Execution Head Start. 30 days compressed to 12 minutes.",                       note: "Always both parts together."                },
                  { label: "Platform Descriptor",text: "VaughnMartin builds Readiness OS — coordination infrastructure for enterprise organizations.", note: "First sentence in any product description." },
                ].map((v, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.12)", padding: "28px 24px" }}>
                    <div style={{ fontFamily: LABEL, fontSize: 10, letterSpacing: "0.3em", color: B.gold, textTransform: "uppercase" as const, marginBottom: 14, fontWeight: 700 }}>{v.label}</div>
                    <p style={{ fontFamily: EDITORIAL, fontSize: 18, color: B.ivory, lineHeight: 1.5, fontStyle: "italic", marginBottom: 14 }}>"{v.text}"</p>
                    <p style={{ fontFamily: LABEL, fontSize: 11, color: "rgba(248,247,244,0.35)", lineHeight: 1.5, letterSpacing: "0.08em", fontWeight: 500 }}>{v.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* CAMPAIGNS                                                             */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "campaigns" && (
        <div>

          {/* Campaign 01 */}
          <section style={{ background: B.navy, position: "relative", overflow: "hidden", padding: "80px 40px" }}>
            <div style={{ position: "absolute", inset: 0, ...grid }}/>
            <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
              <SectionHeader label="Campaign 01" title={`"Both Sides of the Trigger"`} dark/>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, marginBottom: 3 }}>
                <div style={{ background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.2)", padding: "40px 36px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: B.red, animation: "pulse 2s ease-in-out infinite" }}/>
                    <span style={{ fontFamily: LABEL, fontSize: 11, color: B.red, letterSpacing: "0.3em", textTransform: "uppercase" as const, fontWeight: 700 }}>3:12 AM — Ransomware Detected</span>
                  </div>
                  <h3 style={{ fontFamily: EDITORIAL, fontSize: 32, color: B.ivory, fontWeight: 400, lineHeight: 1.2, marginBottom: 24 }}>The threat trigger fires.</h3>
                  {["0:00 — Signal detected", "0:47 — Protocol matched", "2:00 — Executive briefed", "4:15 — Executive authorizes", "8:30 — Response live", "12:00 — Executing"].map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 16, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontFamily: LABEL, fontSize: 12, color: B.tealLt, minWidth: 50, fontWeight: 600 }}>{s.split("—")[0]}</span>
                      <span style={{ fontFamily: EDITORIAL, fontSize: 14, color: "rgba(248,247,244,0.7)", fontStyle: "italic" }}>{s.split("—")[1]}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(43,138,110,0.08)", border: "1px solid rgba(43,138,110,0.2)", padding: "40px 36px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: B.tealLt }}/>
                    <span style={{ fontFamily: LABEL, fontSize: 11, color: B.tealLt, letterSpacing: "0.3em", textTransform: "uppercase" as const, fontWeight: 700 }}>9:47 AM — Competitor Launches</span>
                  </div>
                  <h3 style={{ fontFamily: EDITORIAL, fontSize: 32, color: B.ivory, fontWeight: 400, lineHeight: 1.2, marginBottom: 24 }}>The opportunity trigger fires.</h3>
                  {["0:00 — Signal detected", "0:47 — Protocol matched", "2:00 — Executive briefed", "4:15 — Executive authorizes", "8:30 — Battle card deployed", "12:00 — Top 20 accounts called"].map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 16, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontFamily: LABEL, fontSize: 12, color: B.tealLt, minWidth: 50, fontWeight: 600 }}>{s.split("—")[0]}</span>
                      <span style={{ fontFamily: EDITORIAL, fontSize: 14, color: "rgba(248,247,244,0.7)", fontStyle: "italic" }}>{s.split("—")[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: B.gold, padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: EDITORIAL, fontSize: 36, fontWeight: 400, color: B.navy, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 8 }}>
                    The response is ready.<br/>Whether the trigger is a threat or a window.
                  </div>
                  <div style={{ fontFamily: LABEL, fontSize: 12, color: B.navyMid, letterSpacing: "0.25em", textTransform: "uppercase" as const, fontWeight: 700 }}>
                    VaughnMartin · Readiness OS · Apply for Founding Partner Access
                  </div>
                </div>
                <VMSeal size={100} variant="light"/>
              </div>
            </div>
          </section>

          {/* Campaign 02 — Microsoft */}
          <section style={{ background: B.ivory, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <SectionHeader label="Campaign 02" title={`"The Operating Model Above the Stack"`}/>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3, marginBottom: 32 }}>
                {[
                  { trigger: "Competitor launches flagship", copilot: "Summarizes faster", readiness: "Pre-staged. 12 minutes."          },
                  { trigger: "Ransomware at 3 AM",           copilot: "Summarizes faster", readiness: "Pre-staged. 12 minutes."          },
                  { trigger: "Market entry window opens",    copilot: "Summarizes faster", readiness: "Automated at trigger point."      },
                  { trigger: "Activist investor files 13D",  copilot: "Summarizes faster", readiness: "Pre-staged. 12 minutes."          },
                  { trigger: "DOJ inquiry received",         copilot: "Summarizes faster", readiness: "12 minutes after detection."      },
                  { trigger: "Supply chain failure",         copilot: "Summarizes faster", readiness: "Pre-staged before trigger fires." },
                ].map((r, i) => (
                  <div key={i} style={{ border: `1px solid ${B.border}`, overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", background: B.navyMid, borderBottom: `1px solid rgba(201,168,76,0.15)` }}>
                      <span style={{ fontFamily: EDITORIAL, fontSize: 15, color: B.ivory, fontStyle: "italic" }}>{r.trigger}</span>
                    </div>
                    <div style={{ padding: "14px 20px", background: "rgba(10,15,46,0.04)", borderBottom: `1px solid ${B.border}` }}>
                      <div style={{ fontFamily: LABEL, fontSize: 10, color: B.muted, letterSpacing: "0.25em", textTransform: "uppercase" as const, marginBottom: 6, fontWeight: 700 }}>Microsoft Copilot Alone</div>
                      <div style={{ fontFamily: EDITORIAL, fontSize: 14, color: B.muted, fontStyle: "italic" }}>{r.copilot}</div>
                    </div>
                    <div style={{ padding: "14px 20px", background: "rgba(43,138,110,0.06)" }}>
                      <div style={{ fontFamily: LABEL, fontSize: 10, color: B.teal, letterSpacing: "0.25em", textTransform: "uppercase" as const, marginBottom: 6, fontWeight: 700 }}>Readiness OS</div>
                      <div style={{ fontFamily: EDITORIAL, fontSize: 14, color: B.navy, fontWeight: 600 }}>{r.readiness}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: B.navy, padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, ...grid, opacity: 0.5 }}/>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <p style={{ fontFamily: EDITORIAL, fontSize: 28, color: B.ivory, lineHeight: 1.3, fontWeight: 400, marginBottom: 16, maxWidth: 700 }}>
                    "Microsoft handles the tools.<br/><span style={{ color: B.gold }}>Readiness OS handles the response.</span>"
                  </p>
                  <div style={{ fontFamily: LABEL, fontSize: 12, color: "rgba(248,247,244,0.45)", letterSpacing: "0.25em", textTransform: "uppercase" as const, fontWeight: 600 }}>
                    Every enterprise has the AI stack. None have the operating model.
                  </div>
                </div>
                <VMSeal size={80} variant="dark"/>
              </div>
            </div>
          </section>

          {/* Campaign 03 — Three Domains */}
          <section style={{ background: B.navyBg, position: "relative", overflow: "hidden", padding: "80px 40px" }}>
            <div style={{ position: "absolute", inset: 0, ...grid }}/>
            <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
              <SectionHeader label="Campaign 03" title={`"Three Domains. One Operating Model."`} dark/>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }}>
                {[
                  { domain: "RISK & RESILIENCE",   color: B.red,    triggers: ["Ransomware confirmed","Activist stake disclosed","Regulatory inquiry opened","Supply chain collapsed","Leadership departure"],         outcome: "12 minutes from signal to response. Every time."                    },
                  { domain: "GROWTH & POSITIONING", color: B.tealLt, triggers: ["M&A opportunity identified","Competitor move detected","Market entry window opened","Competitor product launch","Partnership window"], outcome: "First mover. Every time the window opens."                           },
                  { domain: "TRANSFORMATION",       color: B.gold,   triggers: ["Technology disruption signaled","Talent exodus detected","M&A integration trigger","Organizational change","Digital transformation"], outcome: "Coordination infrastructure that holds under pressure."               },
                ].map((d, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.08)`, padding: "36px 28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, paddingBottom: 20, borderBottom: `2px solid ${d.color}` }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color }}/>
                      <span style={{ fontFamily: LABEL, fontSize: 11, color: d.color, letterSpacing: "0.3em", textTransform: "uppercase" as const, fontWeight: 700 }}>{d.domain}</span>
                    </div>
                    {d.triggers.map((t, j) => (
                      <div key={j} style={{ fontFamily: EDITORIAL, fontSize: 15, color: "rgba(248,247,244,0.72)", fontStyle: "italic", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{t}</div>
                    ))}
                    <p style={{ fontFamily: EDITORIAL, fontSize: 16, color: d.color, lineHeight: 1.5, marginTop: 20, fontStyle: "italic" }}>{d.outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* DIGITAL ASSETS                                                        */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "digital" && (
        <div>
          <section style={{ background: B.ivory, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <SectionHeader label="Digital Assets" title="Social & Digital Templates"/>

              {/* LinkedIn card */}
              <div style={{ marginBottom: 48 }}>
                <div style={{ fontFamily: LABEL, fontSize: 11, color: B.muted, letterSpacing: "0.3em", textTransform: "uppercase" as const, marginBottom: 16, fontWeight: 700 }}>
                  LinkedIn Post Card — 1200×628
                </div>
                <div style={{ width: "100%", aspectRatio: "1200/628", background: B.navyBg, position: "relative", overflow: "hidden", border: `1px solid ${B.border}` }}>
                  <div style={{ position: "absolute", inset: 0, ...grid }}/>
                  <div style={{ position: "absolute", width: "60%", height: "120%", borderRadius: "50%", background: `radial-gradient(ellipse,rgba(201,168,76,0.12) 0%,transparent 65%)`, top: "-60%", right: "-20%" }}/>
                  <div style={{ position: "absolute", width: "50%", height: "100%", borderRadius: "50%", background: `radial-gradient(ellipse,rgba(43,138,110,0.14) 0%,transparent 65%)`, bottom: "-40%", left: "-10%" }}/>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.07 }}>
                    <VMSeal size={400} variant="dark"/>
                  </div>
                  <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", padding: "5%" }}>
                    <div style={{ flex: 1, paddingRight: "5%" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "4%" }}>
                        <VMSeal size={36} variant="dark"/>
                        <span style={{ fontFamily: LABEL, fontSize: "1.2vw", color: B.gold, letterSpacing: "0.2em", textTransform: "uppercase" as const, fontWeight: 700 }}>Field Note · The Ownership Gap</span>
                      </div>
                      <h2 style={{ fontFamily: EDITORIAL, fontSize: "4.5vw", color: B.ivory, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-1.5px", marginBottom: "3%" }}>
                        Whether ownership was <em style={{ color: B.gold }}>real</em> or just <em style={{ color: B.tealLt }}>assigned</em> reveals itself in 30 minutes.
                      </h2>
                      <p style={{ fontFamily: EDITORIAL, fontSize: "1.4vw", color: "rgba(248,247,244,0.6)", fontStyle: "italic", lineHeight: 1.5 }}>
                        The architecture that closes this gap is what I built. Before the trigger fires.
                      </p>
                    </div>
                    <div style={{ flex: "0 0 42%", paddingLeft: "3%" }}>
                      <div style={{ background: "rgba(6,10,28,0.85)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 6, padding: "4%", backdropFilter: "blur(8px)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "6%" }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: B.tealLt, boxShadow: `0 0 0 3px rgba(43,138,110,0.3)` }}/>
                          <span style={{ fontFamily: LABEL, fontSize: "0.9vw", color: B.gold, letterSpacing: "0.2em", textTransform: "uppercase" as const, fontWeight: 700 }}>Coordination Infrastructure · Live</span>
                        </div>
                        {["0:00 Signal detected","0:47 Protocol matched","2:00 Executive briefed","4:15 Executive authorizes","8:30 Response live"].map((s, i) => (
                          <div key={i} style={{ display: "flex", gap: "5%", padding: "2% 0", borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
                            <span style={{ fontFamily: LABEL, fontSize: "0.9vw", color: B.tealLt, minWidth: "20%", fontWeight: 700 }}>{s.split(" ")[0]}</span>
                            <span style={{ fontFamily: EDITORIAL, fontSize: "0.9vw", color: "rgba(248,247,244,0.75)", fontStyle: "italic" }}>{s.substring(s.indexOf(" ") + 1)}</span>
                          </div>
                        ))}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4%", marginTop: "6%", paddingTop: "6%", borderTop: "1px solid rgba(201,168,76,0.2)" }}>
                          <div>
                            <div style={{ fontFamily: EDITORIAL, fontSize: "2vw", color: B.tealLt, fontWeight: 600 }}>12 min</div>
                            <div style={{ fontFamily: LABEL, fontSize: "0.7vw", color: B.gold, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginTop: 2, fontWeight: 700 }}>vs 30 days</div>
                          </div>
                          <div>
                            <div style={{ fontFamily: EDITORIAL, fontSize: "2vw", color: B.tealLt, fontWeight: 600 }}>3,600×</div>
                            <div style={{ fontFamily: LABEL, fontSize: "0.7vw", color: B.gold, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginTop: 2, fontWeight: 700 }}>Head Start</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "8%", background: "rgba(4,7,20,0.95)", borderTop: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 5%" }}>
                    <span style={{ fontFamily: LABEL, fontSize: "0.9vw", color: "rgba(201,168,76,0.6)", letterSpacing: "0.15em", textTransform: "uppercase" as const, fontWeight: 600 }}>Readiness OS · Built · In Production · startup to Fortune 500</span>
                    <span style={{ fontFamily: LABEL, fontSize: "0.9vw", color: "rgba(43,138,110,0.75)", letterSpacing: "0.1em", fontWeight: 600 }}>vaughnmartin.com</span>
                  </div>
                </div>
              </div>

              {/* Digital banner */}
              <div style={{ marginBottom: 48 }}>
                <div style={{ fontFamily: LABEL, fontSize: 11, color: B.muted, letterSpacing: "0.3em", textTransform: "uppercase" as const, marginBottom: 16, fontWeight: 700 }}>
                  Digital Banner — Leaderboard
                </div>
                <div style={{ width: "100%", height: 90, background: B.navy, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", border: `1px solid rgba(201,168,76,0.2)` }}>
                  <div style={{ position: "absolute", inset: 0, ...grid, opacity: 0.5 }}/>
                  <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 32px", position: "relative", zIndex: 1, flex: 1 }}>
                    <VMSeal size={56} variant="dark"/>
                    <div style={{ width: 1, height: 50, background: "rgba(201,168,76,0.2)" }}/>
                    <div>
                      <div style={{ fontFamily: EDITORIAL, fontSize: 20, color: B.ivory, fontWeight: 400, lineHeight: 1 }}>
                        30 days compressed to <span style={{ color: B.tealLt, fontWeight: 600 }}>12 minutes.</span>
                      </div>
                      <div style={{ fontFamily: LABEL, fontSize: 11, color: B.gold, letterSpacing: "0.25em", textTransform: "uppercase" as const, marginTop: 4, fontWeight: 700 }}>
                        3,600× Execution Head Start · Readiness OS
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "0 32px", position: "relative", zIndex: 1, borderLeft: "1px solid rgba(201,168,76,0.15)" }}>
                    <div style={{ background: B.gold, color: B.navy, fontFamily: LABEL, fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase" as const, fontWeight: 700, padding: "10px 24px", borderRadius: 2, whiteSpace: "nowrap" as const }}>
                      Apply for Access →
                    </div>
                  </div>
                </div>
              </div>

              {/* Email header */}
              <div>
                <div style={{ fontFamily: LABEL, fontSize: 11, color: B.muted, letterSpacing: "0.3em", textTransform: "uppercase" as const, marginBottom: 16, fontWeight: 700 }}>
                  Email Header Template
                </div>
                <div style={{ background: B.navyBg, padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "6px 6px 0 0", borderBottom: `3px solid ${B.gold}` }}>
                  <LogoLockup sealSize={56} textSize={0.6} variant="dark" gap={16}/>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: LABEL, fontSize: 11, color: B.gold, letterSpacing: "0.25em", textTransform: "uppercase" as const, marginBottom: 4, fontWeight: 700 }}>Founding Partner Program</div>
                    <div style={{ fontFamily: LABEL, fontSize: 10, color: "rgba(248,247,244,0.4)", letterSpacing: "0.1em", fontWeight: 500 }}>
                      vaughnmartin.com · founding@vaughnmartin.com
                    </div>
                  </div>
                </div>
                <div style={{ background: B.ivory, padding: 40, border: `1px solid ${B.border}`, borderTop: "none", borderRadius: "0 0 6px 6px" }}>
                  <p style={{ fontFamily: EDITORIAL, fontSize: 18, color: B.navy, lineHeight: 1.7, fontStyle: "italic", marginBottom: 24 }}>
                    "The response was staged before the trigger fired. That's not a faster tool — that's a different operating model."
                  </p>
                  <div style={{ display: "inline-block", background: B.gold, color: B.navy, padding: "12px 32px", borderRadius: 2, fontFamily: LABEL, fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase" as const, fontWeight: 700 }}>
                    See the 12-Minute Execution →
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* PRINT & MEDIA                                                         */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "print" && (
        <div>

          {/* Full Page Ad */}
          <section style={{ background: "#1a1a1a", padding: "60px 40px" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <div style={{ fontFamily: LABEL, fontSize: 11, color: "#888", letterSpacing: "0.3em", textTransform: "uppercase" as const, marginBottom: 20, fontWeight: 700 }}>
                Full Page Print Ad — WSJ / Fortune — 8.5×11
              </div>
              <div style={{ background: B.navy, padding: "80px 72px", position: "relative", overflow: "hidden", aspectRatio: "8.5/11", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ position: "absolute", inset: 0, ...grid }}/>
                <div style={{ position: "absolute", width: "80%", height: "80%", borderRadius: "50%", background: `radial-gradient(ellipse,rgba(201,168,76,0.1) 0%,transparent 65%)`, top: "-30%", right: "-20%" }}/>
                <div style={{ position: "absolute", width: "60%", height: "60%", borderRadius: "50%", background: `radial-gradient(ellipse,rgba(43,138,110,0.12) 0%,transparent 65%)`, bottom: "-20%", left: "-10%" }}/>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.06 }}>
                  <VMSeal size={600} variant="dark"/>
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <LogoLockup sealSize={64} textSize={0.6} variant="dark" gap={16}/>
                </div>
                <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 0" }}>
                  <div style={{ fontFamily: LABEL, fontSize: 12, color: B.gold, letterSpacing: "0.4em", textTransform: "uppercase" as const, marginBottom: 32, fontWeight: 700 }}>Readiness Infrastructure</div>
                  <h1 style={{ fontFamily: EDITORIAL, fontSize: "clamp(40px,4vw,72px)", fontWeight: 400, color: B.ivory, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 32 }}>
                    The response is ready<br/>before the trigger fires.
                  </h1>
                  <div style={{ width: 60, height: 2, background: `linear-gradient(to right, ${B.gold}, ${B.teal})`, marginBottom: 32 }}/>
                  <p style={{ fontFamily: EDITORIAL, fontSize: 20, color: "rgba(248,247,244,0.75)", lineHeight: 1.65, fontStyle: "italic", maxWidth: 560, marginBottom: 40 }}>
                    180 Readiness Protocols. 221 triggers monitored. Signal monitoring. Executive authorization. Coordinated response in 12 minutes — whether the trigger is a threat or a market window.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, marginBottom: 48 }}>
                    {[
                      { n: "12 min", l: "Mobilization",        sub: "vs 30 days"           },
                      { n: "3,600×", l: "Execution Head Start", sub: "Structural advantage" },
                      { n: "180",    l: "Readiness Protocols",  sub: "Across 9 domains"     },
                    ].map((s, i) => (
                      <div key={i} style={{ borderTop: `2px solid ${B.gold}`, paddingTop: 16 }}>
                        <div style={{ fontFamily: EDITORIAL, fontSize: 36, fontWeight: 600, color: B.tealLt, lineHeight: 1, marginBottom: 6 }}>{s.n}</div>
                        <div style={{ fontFamily: LABEL, fontSize: 10, color: B.gold, letterSpacing: "0.2em", textTransform: "uppercase" as const, fontWeight: 700 }}>{s.l}</div>
                        <div style={{ fontFamily: LABEL, fontSize: 9, color: "rgba(248,247,244,0.35)", letterSpacing: "0.1em", marginTop: 3, fontWeight: 500 }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(201,168,76,0.2)", paddingTop: 24 }}>
                  <div>
                    <div style={{ fontFamily: EDITORIAL, fontSize: 18, color: B.ivory, fontWeight: 400, marginBottom: 4 }}>We Make Enterprises Fearless.</div>
                    <div style={{ fontFamily: LABEL, fontSize: 10, color: "rgba(201,168,76,0.55)", letterSpacing: "0.2em", fontWeight: 600 }}>vaughnmartin.com · Founding Partner Program · 12 spots</div>
                  </div>
                  <div style={{ background: B.gold, color: B.navy, fontFamily: LABEL, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" as const, fontWeight: 700, padding: "14px 28px", borderRadius: 2 }}>
                    Apply for Access
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Founding Partner Brief Cover */}
          <section style={{ background: B.ivory, padding: "60px 40px" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <div style={{ fontFamily: LABEL, fontSize: 11, color: B.muted, letterSpacing: "0.3em", textTransform: "uppercase" as const, marginBottom: 20, fontWeight: 700 }}>
                Founding Partner Brief — Cover Page
              </div>
              <div style={{ background: B.ivory, border: `1px solid ${B.border}`, aspectRatio: "8.5/11", padding: "72px 64px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: B.navy }}/>
                <div style={{ position: "absolute", top: 6, left: 0, width: 200, height: 3, background: B.gold }}/>
                <div style={{ position: "absolute", top: 6, left: 200, width: 80, height: 3, background: B.teal }}/>
                <div>
                  <LogoLockup sealSize={72} textSize={0.72} variant="light" gap={18}/>
                </div>
                <div>
                  <div style={{ fontFamily: LABEL, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase" as const, color: B.gold, marginBottom: 20, fontWeight: 700 }}>
                    Confidential · Founding Partner Program
                  </div>
                  <h1 style={{ fontFamily: EDITORIAL, fontSize: 52, fontWeight: 400, color: B.navy, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 24 }}>
                    The 90-Day<br/>Validation<br/>Partnership.
                  </h1>
                  <p style={{ fontFamily: EDITORIAL, fontSize: 18, color: B.muted, lineHeight: 1.7, fontStyle: "italic", maxWidth: 480 }}>
                    Not a trial. Not a beta. A co-development partnership that turns your organization's specific trigger library into a fully staged readiness infrastructure — in 90 days.
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: `2px solid ${B.gold}`, paddingTop: 24 }}>
                  <div>
                    <div style={{ fontFamily: LABEL, fontSize: 11, color: B.navy, letterSpacing: "0.1em", marginBottom: 4, fontWeight: 700 }}>vaughnmartin.com</div>
                    <div style={{ fontFamily: LABEL, fontSize: 10, color: B.muted, letterSpacing: "0.08em", fontWeight: 500 }}>
                      founding@vaughnmartin.com · 12 spots · Applications reviewed personally
                    </div>
                  </div>
                  <div style={{ fontFamily: EDITORIAL, fontSize: 18, color: B.teal, fontStyle: "italic" }}>We Make Enterprises Fearless.</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ background: B.navy, borderTop: `3px solid ${B.gold}`, padding: "48px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <LogoLockup sealSize={48} textSize={0.5} variant="dark" gap={14}/>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: EDITORIAL, fontSize: 16, color: "rgba(248,247,244,0.7)", fontStyle: "italic", marginBottom: 4 }}>We Make Enterprises Fearless.</div>
          <div style={{ fontFamily: LABEL, fontSize: 11, color: "rgba(201,168,76,0.5)", letterSpacing: "0.2em", fontWeight: 600 }}>VaughnMartin Brand Identity System · May 2026</div>
        </div>
      </footer>
    </div>
  );
}
