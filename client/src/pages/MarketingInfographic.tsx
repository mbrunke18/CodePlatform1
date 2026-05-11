const NAVY  = "#080d24";
const GOLD  = "#C9A84C";
const GOLD2 = "#e2c068";
const TEAL  = "#4dc4a0";
const W     = "#ffffff";
const W80   = "rgba(255,255,255,0.80)";
const W55   = "rgba(255,255,255,0.55)";
const BD    = "rgba(201,168,76,0.22)";
const CBG   = "rgba(255,255,255,0.04)";
const DARK  = "#04070f";

const BC  = { fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" } as const;
const CG  = { fontFamily: "'Cormorant Garamond',Georgia,serif" } as const;
const BAR = { fontFamily: "'Barlow',sans-serif" } as const;

function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      border: `${size * 0.04}px solid ${GOLD}`,
      borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{ ...BC, fontSize: size * 0.29, fontWeight: 800, letterSpacing: "0.05em", color: GOLD }}>VM</span>
    </div>
  );
}

function IDEADiagram() {
  return (
    <svg viewBox="0 0 140 140" width={140} height={140} xmlns="http://www.w3.org/2000/svg">
      <circle cx="70" cy="70" r="64" fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="1"/>
      <circle cx="70" cy="70" r="26" fill="rgba(201,168,76,0.07)" stroke="rgba(201,168,76,0.4)" strokeWidth="1"/>
      <text x="70" y="66" textAnchor="middle" fontFamily="Barlow Condensed,sans-serif" fontSize="10" fontWeight="800" fill={GOLD} letterSpacing="1">IDEA</text>
      <text x="70" y="78" textAnchor="middle" fontFamily="Barlow Condensed,sans-serif" fontSize="7" fontWeight="500" fill="rgba(201,168,76,0.7)" letterSpacing="1">FRAMEWORK</text>
      {/* IDENTIFY — top */}
      <circle cx="70" cy="10" r="14" fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.5)" strokeWidth="1"/>
      <text x="70" y="14" textAnchor="middle" fontFamily="Barlow Condensed,sans-serif" fontSize="8" fontWeight="700" fill={GOLD}>IDENTIFY</text>
      {/* DETECT — right */}
      <circle cx="128" cy="70" r="14" fill="rgba(77,196,160,0.08)" stroke="rgba(77,196,160,0.5)" strokeWidth="1"/>
      <text x="128" y="74" textAnchor="middle" fontFamily="Barlow Condensed,sans-serif" fontSize="8" fontWeight="700" fill={TEAL}>DETECT</text>
      {/* EXECUTE — bottom */}
      <circle cx="70" cy="130" r="14" fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.5)" strokeWidth="1"/>
      <text x="70" y="134" textAnchor="middle" fontFamily="Barlow Condensed,sans-serif" fontSize="8" fontWeight="700" fill={GOLD}>EXECUTE</text>
      {/* ADVANCE — left */}
      <circle cx="12" cy="70" r="14" fill="rgba(77,196,160,0.08)" stroke="rgba(77,196,160,0.5)" strokeWidth="1"/>
      <text x="12" y="74" textAnchor="middle" fontFamily="Barlow Condensed,sans-serif" fontSize="8" fontWeight="700" fill={TEAL}>ADVANCE</text>
      {/* Connecting arcs */}
      <path d="M70 24 A50 50 0 0 1 114 70"  fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1" strokeDasharray="3 3"/>
      <path d="M114 70 A50 50 0 0 1 70 116" fill="none" stroke="rgba(77,196,160,0.3)" strokeWidth="1" strokeDasharray="3 3"/>
      <path d="M70 116 A50 50 0 0 1 26 70"  fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1" strokeDasharray="3 3"/>
      <path d="M26 70 A50 50 0 0 1 70 24"   fill="none" stroke="rgba(77,196,160,0.3)" strokeWidth="1" strokeDasharray="3 3"/>
    </svg>
  );
}

const PROBLEMS = [
  {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" width={28} height={28}>
        <circle cx="14" cy="14" r="11" stroke={GOLD} strokeWidth="1.5"/>
        <path d="M14 8v6l4 2" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    label: "30-Day Mobilization", sub: "Before execution even begins",
  },
  {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" width={28} height={28}>
        <circle cx="14" cy="14" r="11" stroke={GOLD} strokeWidth="1.5"/>
        <circle cx="14" cy="14" r="5"  stroke={GOLD} strokeWidth="1.5"/>
      </svg>
    ),
    label: "Committee Deliberation", sub: "Replacing pattern detection",
  },
  {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" width={28} height={28}>
        <rect x="6" y="6" width="16" height="16" stroke={GOLD} strokeWidth="1.5"/>
      </svg>
    ),
    label: "Reactive Posture", sub: "Assembling after the trigger fires",
  },
  {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" width={28} height={28}>
        <path d="M14 4L24 21H4L14 4z" stroke={GOLD} strokeWidth="1.5"/>
      </svg>
    ),
    label: "No Decision Rights", sub: "Weeks of coordination overhead",
  },
  {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" width={28} height={28}>
        <path d="M14 4l10 10-10 10L4 14z" stroke={GOLD} strokeWidth="1.5"/>
      </svg>
    ),
    label: "No Signal Layer", sub: "Blind to strategic triggers",
  },
  {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" width={28} height={28}>
        <line x1="14" y1="5"  x2="14" y2="23" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="5"  y1="14" x2="23" y2="14" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    label: "Execution Delays", sub: "30-day response to 12-min triggers",
  },
];

const INVESTOR_CARDS = [
  {
    icon: <svg viewBox="0 0 22 22" fill="none" width={22} height={22}><path d="M11 2l9 9-9 9-9-9z" stroke={GOLD} strokeWidth="1.5"/></svg>,
    title: "Category Creation",
    body: "Not competing with Copilot, SAP, or Workday — sits above them as the operating model layer they don't provide.",
  },
  {
    icon: <svg viewBox="0 0 22 22" fill="none" width={22} height={22}><circle cx="11" cy="11" r="9" stroke={GOLD} strokeWidth="1.5"/></svg>,
    title: "Platform Economics",
    body: "170 core protocols + 6 industry packs + 12 compound protocols. Compounding value with every activation.",
  },
  {
    icon: <svg viewBox="0 0 22 22" fill="none" width={22} height={22}><rect x="2" y="2" width="18" height="18" stroke={GOLD} strokeWidth="1.5"/></svg>,
    title: "Microsoft Amplifier",
    body: "Every Fortune 1000 has invested in Microsoft AI. None have the operating model to use it when it counts.",
  },
  {
    icon: (
      <svg viewBox="0 0 22 22" fill="none" width={22} height={22}>
        <circle cx="11" cy="11" r="9" stroke={TEAL} strokeWidth="1.5"/>
        <circle cx="11" cy="11" r="4" stroke={TEAL} strokeWidth="1.5"/>
      </svg>
    ),
    title: "Founding Partner Program",
    body: "First cohort forming now. Selective by design — validating with Fortune 1000 enterprises only.",
  },
];

export default function MarketingInfographic() {
  const border = `1px solid ${BD}`;

  return (
    <div style={{ background: DARK, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 16px 80px" }}>
      <div style={{ width: 480, background: NAVY, boxShadow: "0 0 80px rgba(201,168,76,0.07)" }}>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 28px 20px", borderBottom: border }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark size={38}/>
            <div>
              <div style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: W }}>VaughnMartin</div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.35em", color: GOLD, textTransform: "uppercase", marginTop: 1, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 18, height: 1, background: GOLD }}/>
                Readiness OS
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            {["A New Category", "For a New Era"].map(t => (
              <div key={t} style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: W55, lineHeight: 1.9 }}>{t}</div>
            ))}
            <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL, lineHeight: 1.9 }}>Pre-Staged · Always Ready</div>
          </div>
        </div>

        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <section style={{ padding: "44px 28px 36px", borderBottom: border }}>
          <h1 style={{ ...BC, fontSize: 48, fontWeight: 800, lineHeight: 1.0, color: W, marginBottom: 4, letterSpacing: "-0.01em" }}>
            Welcome to the<br/>category first.
          </h1>
          <div style={{ ...CG, fontSize: 46, fontWeight: 700, color: GOLD, lineHeight: 1.05, marginBottom: 20 }}>
            Readiness OS™
          </div>
          <div style={{ ...BC, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", color: W, marginBottom: 10, textTransform: "uppercase" }}>
            The readiness infrastructure for the Fortune 1000.
          </div>
          <p style={{ ...BAR, fontSize: 13, fontWeight: 400, color: W80, lineHeight: 1.65 }}>
            Every vendor bolted AI onto the old model. We replaced the model.<br/>
            Preparation replaces coordination. 12 minutes replaces 30 days.
          </p>
        </section>

        {/* ── METRICS ────────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: border, borderBottom: border }}>
          {[
            { num: "3,600×", title: "Execution Head Start", sub: "30 days → 12 minutes" },
            { num: "170",    title: "Readiness Protocols",  sub: "Pre-staged, not assembled" },
            { num: "221",    title: "Strategic Triggers",   sub: "Continuously monitored" },
          ].map(({ num, title, sub }, i) => (
            <div key={i} style={{ padding: "22px 18px", borderRight: i < 2 ? border : "none" }}>
              <span style={{ ...BC, fontSize: 40, fontWeight: 900, color: GOLD, lineHeight: 1, letterSpacing: "-0.02em", display: "block", marginBottom: 6 }}>{num}</span>
              <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: W, marginBottom: 3 }}>{title}</div>
              <div style={{ ...BAR, fontSize: 10, fontWeight: 400, color: W55, lineHeight: 1.4 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── OLD MODEL ──────────────────────────────────────────────────── */}
        <section style={{ padding: "36px 28px", borderBottom: border }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span style={{ display: "inline-block", width: 28, height: 1.5, background: GOLD, flexShrink: 0 }}/>
            <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: GOLD }}>
              The Old Model. Year After Year.
            </span>
          </div>
          <p style={{ ...BAR, fontSize: 13, fontWeight: 400, color: W80, lineHeight: 1.65, marginBottom: 4 }}>
            Enterprise work was designed for a world without AI — committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively.{" "}
            <strong style={{ color: W, fontWeight: 600 }}>AI changed the constraint. The operating model didn't.</strong>
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "24px 0 20px" }}>
            {PROBLEMS.map(({ icon, label, sub }, i) => (
              <div key={i} style={{ background: CBG, border: "1px solid rgba(255,255,255,0.09)", padding: "16px 12px", textAlign: "center" }}>
                <div style={{ width: 28, height: 28, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: W, marginBottom: 5, lineHeight: 1.3 }}>{label}</div>
                <div style={{ ...BAR, fontSize: 10, fontWeight: 400, color: W80, lineHeight: 1.5 }}>{sub}</div>
              </div>
            ))}
          </div>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: W55, textAlign: "center", paddingTop: 10 }}>
            Weeks to Mobilize &nbsp;·&nbsp; Months to Execute &nbsp;·&nbsp; Strategic Windows Missed
          </div>
        </section>

        {/* ── SOLUTION + INVESTOR ────────────────────────────────────────── */}
        <section style={{ padding: "36px 28px", borderBottom: border, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>

          {/* Left */}
          <div>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL, marginBottom: 10 }}>One Readiness OS</div>
            <h2 style={{ ...CG, fontSize: 24, fontWeight: 600, lineHeight: 1.25, color: W, marginBottom: 4 }}>
              The full readiness cycle.<br/><em style={{ color: GOLD }}>Pre-staged. Always ready.</em>
            </h2>
            <div style={{ margin: "20px auto", width: 140, height: 140 }}>
              <IDEADiagram/>
            </div>
            <ul style={{ listStyle: "none", marginTop: 4 }}>
              {[
                "170 Readiness Protocols pre-staged",
                "221 strategic triggers monitored",
                "12-minute execution design target",
                "Executive authority at every stage",
                "Orchestrates your Microsoft AI stack",
                "Pre-staged before the trigger fires",
              ].map((text, i) => (
                <li key={i} style={{ ...BAR, fontSize: 11, fontWeight: 400, color: W80, padding: "5px 0", display: "flex", alignItems: "flex-start", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.06)", lineHeight: 1.4 }}>
                  <span style={{ color: TEAL, fontSize: 6, flexShrink: 0, marginTop: 3 }}>◆</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Right */}
          <div>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: W55, marginBottom: 10 }}>Built for Investors</div>
            <h2 style={{ ...BC, fontSize: 26, fontWeight: 700, lineHeight: 1.15, color: W, marginBottom: 20 }}>
              Built for<br/><em style={{ ...CG, color: GOLD, fontSize: 28, fontStyle: "italic" }}>the future.</em>
            </h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {INVESTOR_CARDS.map(({ icon, title, body }, i) => (
                <div key={i} style={{ marginBottom: i < 3 ? 16 : 0, paddingBottom: i < 3 ? 16 : 0, borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none", display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, marginTop: 1 }}>{icon}</div>
                  <div>
                    <div style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", color: GOLD, marginBottom: 4, textTransform: "uppercase" }}>{title}</div>
                    <div style={{ ...BAR, fontSize: 11, fontWeight: 400, color: W80, lineHeight: 1.5 }}>{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER QUOTE ───────────────────────────────────────────────── */}
        <div style={{ padding: "36px 28px 24px", textAlign: "center", borderTop: border }}>
          <div style={{ ...CG, fontStyle: "italic", fontSize: 20, fontWeight: 400, color: W, lineHeight: 1.4, marginBottom: 10 }}>
            "The response is ready before the trigger fires."
          </div>
          <div style={{ ...BC, fontSize: 10, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: W55 }}>
            Preparation &nbsp;→&nbsp; Readiness &nbsp;→&nbsp; Fearless
          </div>
        </div>

        {/* ── FOOTER BAR ─────────────────────────────────────────────────── */}
        <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 28px", borderTop: border, background: "rgba(0,0,0,0.25)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark size={34}/>
            <div>
              <div style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: W }}>VaughnMartin</div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.35em", color: GOLD, textTransform: "uppercase", marginTop: 1, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 14, height: 1, background: GOLD }}/>
                Readiness OS
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD }}>Founding Partner Access</div>
            <div style={{ ...BC, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: W, marginTop: 2 }}>Now Forming — Apply Today</div>
          </div>
        </footer>

        {/* ── DOWNLOAD PANEL ─────────────────────────────────────────────── */}
        <div style={{ background: "#040810", padding: "20px 28px 22px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ ...BC, color: GOLD, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 14 }}>
            Download Format
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Web Preview",       sub: "480px",                  format: "web"      },
              { label: "HD Web / Email",    sub: "~1,600px",               format: "hd"       },
              { label: "LinkedIn Share",    sub: "1,200 × 628",            format: "linkedin" },
              { label: "LinkedIn Portrait", sub: "1,080 × 1,350",          format: "portrait" },
              { label: "Print Letter",      sub: "8.5\" × 11\" · 300 dpi", format: "letter"   },
              { label: "Print A4",          sub: "A4 · 300 dpi",           format: "a4"       },
            ].map(({ label, sub, format }) => (
              <a
                key={format}
                href={`/api/marketing-infographic.png?format=${format}`}
                download={`VaughnMartin-ReadinessOS-${format}.png`}
                style={{ ...BC, display: "block", background: "rgba(201,168,76,0.06)", border: `1px solid ${BD}`, padding: "10px 12px", textDecoration: "none", textAlign: "center" }}
              >
                <div style={{ color: W, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 3 }}>{label}</div>
                <div style={{ color: GOLD, fontSize: 8.5, fontWeight: 600, letterSpacing: "0.06em", opacity: 0.75 }}>{sub}</div>
              </a>
            ))}
          </div>
          <div style={{ ...BC, color: "rgba(255,255,255,0.15)", fontSize: 8, textAlign: "center", marginTop: 12, letterSpacing: "0.1em" }}>
            Print formats are 300 dpi · ready for professional printing
          </div>
        </div>

      </div>
    </div>
  );
}
