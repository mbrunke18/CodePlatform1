import { useEffect, useRef, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Printer, ChevronRight, BookOpen, Download, Loader2 } from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const BORDER = "#E2DDD4";
const MUTED = "#5A6380";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const TOC_SECTIONS = [
  { id: "s1",  label: "Platform Vision" },
  { id: "s2",  label: "How to Use This Guide" },
  { id: "s3",  label: "Core Concepts" },
  { id: "s4",  label: "Getting Started" },
  { id: "s5",  label: "Navigation Overview" },
  { id: "s6",  label: "Signal Detection & Intelligence" },
  { id: "s7",  label: "Readiness Protocol Library" },
  { id: "s8",  label: "Activating a Protocol" },
  { id: "s9",  label: "War Room Operations" },
  { id: "s10", label: "ADVANCE 2.0 Learning System" },
  { id: "s11", label: "Dashboards & Analytics" },
  { id: "s12", label: "Organization Setup" },
  { id: "s13", label: "Practice Drills" },
  { id: "s14", label: "Command Tower" },
  { id: "s15", label: "Executive Tools" },
  { id: "s16", label: "Demo & Test Drive" },
  { id: "s17", label: "Role-Based Access Control" },
  { id: "s18", label: "Integration Hub" },
  { id: "s19", label: "Glossary" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: TEAL, marginBottom: 8 }}>
      {children}
    </div>
  );
}

function GoldRule() {
  return <div style={{ height: 1, background: GOLD, opacity: 0.4, margin: '16px 0' }} />;
}

function H1({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} style={{ ...CG, fontSize: 28, fontWeight: 700, color: NAVY, marginTop: 48, marginBottom: 4, scrollMarginTop: 80 }}>
      {children}
    </h2>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ ...CG, fontSize: 20, fontWeight: 700, color: NAVY, marginTop: 28, marginBottom: 6 }}>
      {children}
    </h3>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h4 style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: NAVY, marginTop: 20, marginBottom: 6 }}>
      {children}
    </h4>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 15, lineHeight: 1.75, color: '#2C3356', marginBottom: 14 }}>
      {children}
    </p>
  );
}

function Callout({ label, children, color = GOLD }: { label: string; children: React.ReactNode; color?: string }) {
  return (
    <div style={{ borderLeft: `3px solid ${color}`, background: color === TEAL ? '#F0F8F5' : '#FDFAF3', padding: '14px 18px', borderRadius: '0 4px 4px 0', margin: '18px 0' }}>
      <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: '#2C3356' }}>{children}</div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: 'auto', margin: '18px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: NAVY }}>
            {headers.map((h, i) => (
              <th key={i} style={{ ...BC, color: '#fff', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 11, padding: '10px 14px', textAlign: 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F8F7F4', borderBottom: `1px solid ${BORDER}` }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '9px 14px', color: '#2C3356', verticalAlign: 'top' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: '10px 0 14px 0', paddingLeft: 0, listStyle: 'none' }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8, fontSize: 14, color: '#2C3356', lineHeight: 1.65 }}>
          <span style={{ color: GOLD, fontSize: 16, flexShrink: 0, marginTop: 1 }}>›</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function StepList({ steps }: { steps: { n: string; title: string; body: string }[] }) {
  return (
    <div style={{ margin: '14px 0' }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
          <div style={{ ...BC, width: 28, height: 28, borderRadius: '50%', background: NAVY, color: GOLD, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
          <div>
            <div style={{ ...BC, fontWeight: 700, fontSize: 14, color: NAVY, marginBottom: 3 }}>{s.title}</div>
            <div style={{ fontSize: 14, color: '#4A5275', lineHeight: 1.65 }}>{s.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PageBreak() {
  return <div className="page-break" style={{ marginTop: 32 }} />;
}

function ScreenshotFigure({ src, caption }: { src: string; caption: string }) {
  return (
    <figure style={{ margin: '28px 0', padding: 0 }}>
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 12px rgba(10,15,46,0.10)' }}>
        <div style={{ background: NAVY, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD, opacity: 0.7 }} />
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Platform Screenshot</div>
        </div>
        <img
          src={src}
          alt={caption}
          style={{ width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'top center', maxHeight: 420, background: '#F0EDE4' }}
          loading="eager"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <figcaption style={{ fontSize: 12, color: MUTED, marginTop: 8, paddingLeft: 2, lineHeight: 1.6, fontStyle: 'italic' }}>
        {caption}
      </figcaption>
    </figure>
  );
}

export default function UserGuide() {
  const [activeId, setActiveId] = useState("s1");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    setIsPdfLoading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const content = document.getElementById('guide-pdf-root');
      if (!content) { window.print(); return; }

      const canvas = await html2canvas(content, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 960,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 36;
      const usableW = pageW - margin * 2;
      const imgH = (canvas.height * usableW) / canvas.width;

      let remaining = imgH;
      let srcY = 0;

      while (remaining > 0) {
        const sliceH = Math.min(pageH - margin * 2, remaining);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = (sliceH * canvas.width) / usableW;
        const ctx = sliceCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(canvas, 0, srcY * (canvas.width / usableW), canvas.width, sliceCanvas.height, 0, 0, sliceCanvas.width, sliceCanvas.height);
        }
        if (srcY > 0) pdf.addPage();
        pdf.addImage(sliceCanvas.toDataURL('image/jpeg', 0.92), 'JPEG', margin, margin, usableW, sliceH);
        srcY += sliceH;
        remaining -= sliceH;
      }

      pdf.save('VaughnMartin-Readiness-OS-User-Guide.pdf');
    } catch (err) {
      console.error('PDF generation failed, falling back to print dialog:', err);
      window.print();
    } finally {
      setIsPdfLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = TOC_SECTIONS.map(s => document.getElementById(s.id));
      let current = TOC_SECTIONS[0].id;
      for (const el of sections) {
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 120) current = el.id;
      }
      setActiveId(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <PageLayout>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .guide-layout { display: block !important; }
          .guide-toc { display: none !important; }
          .guide-content { max-width: 100% !important; padding: 0 !important; }
          .page-break { page-break-after: always; break-after: page; }
          body { font-size: 12pt; }
          @page { margin: 1.2in 1in; size: letter; }
          h2 { page-break-after: avoid; }
          table { page-break-inside: avoid; }
          figure { display: block !important; page-break-inside: avoid; break-inside: avoid; margin: 16px 0 !important; }
          figure img { display: block !important; width: 100% !important; max-height: 320px !important; object-fit: cover !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          figure > div { border: 1px solid #ccc !important; break-inside: avoid; }
          figcaption { display: block !important; font-size: 10pt !important; color: #555 !important; font-style: italic; margin-top: 4px; }
        }
        .toc-link:hover { color: ${GOLD} !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Print-only header */}
      <div className="print-only" style={{ display: 'none', borderBottom: `2px solid ${GOLD}`, paddingBottom: 16, marginBottom: 24 }}>
        <div style={{ ...CG, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: TEAL }}>VaughnMartin</div>
        <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: NAVY }}>Readiness OS — Complete User & Product Guide</div>
        <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Confidential — For Authorized Users Only</div>
      </div>

      {/* Hero */}
      <div className="no-print" style={{ background: NAVY, padding: '48px 48px 40px', borderBottom: `3px solid ${GOLD}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <SectionLabel>Complete User &amp; Product Guide</SectionLabel>
          <h1 style={{ ...CG, fontSize: 42, fontWeight: 700, color: '#fff', margin: '8px 0 6px' }}>Readiness OS</h1>
          <div style={{ ...CG, fontSize: 20, color: GOLD, fontStyle: 'italic', marginBottom: 16 }}>Everything you need to become a super user and subject matter expert</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ ...BC, fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.15em' }}>VaughnMartin · Readiness OS · Founding Partner Edition</div>
            <button
              onClick={() => window.print()}
              style={{ ...BC, display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: `1px solid rgba(255,255,255,0.25)`, color: 'rgba(255,255,255,0.65)', padding: '8px 18px', borderRadius: 2, cursor: 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              <Printer size={14} /> Print
            </button>
            <button
              onClick={generatePDF}
              disabled={isPdfLoading}
              style={{ ...BC, display: 'flex', alignItems: 'center', gap: 6, background: GOLD, border: `1px solid ${GOLD}`, color: NAVY, padding: '8px 18px', borderRadius: 2, cursor: isPdfLoading ? 'wait' : 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: isPdfLoading ? 0.75 : 1 }}
            >
              {isPdfLoading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</> : <><Download size={14} /> Download PDF</>}
            </button>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="guide-layout" style={{ display: 'flex', maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* TOC Sidebar */}
        <div className="guide-toc no-print" style={{ width: 220, flexShrink: 0, position: 'sticky', top: 80, height: 'fit-content', padding: '32px 0', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: MUTED, marginBottom: 14 }}>Contents</div>
          {TOC_SECTIONS.map(s => (
            <button
              key={s.id}
              className="toc-link"
              onClick={() => scrollTo(s.id)}
              style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '5px 0 5px 10px', borderLeft: `2px solid ${activeId === s.id ? GOLD : 'transparent'}`, fontSize: 13, color: activeId === s.id ? NAVY : MUTED, fontWeight: activeId === s.id ? 600 : 400, transition: 'all 0.15s' }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div id="guide-pdf-root" className="guide-content" ref={contentRef} style={{ flex: 1, minWidth: 0, padding: '32px 0 80px 48px', maxWidth: 820 }}>

          {/* ── SECTION 1 ── */}
          <H1 id="s1">1. Platform Vision</H1>
          <GoldRule />
          <P>
            <strong>VaughnMartin Readiness OS</strong> is an enterprise coordination infrastructure that replaces meeting-heavy operating models with pre-staged, protocol-driven execution. Enterprise work was designed for a world without AI — committees, alignment cycles, and coordination delays exist because humans could not process information fast enough to act decisively. AI changed the constraint. But most vendors bolt AI onto the old model: faster spreadsheets, smarter summaries, better notes from the same slow meetings.
          </P>
          <P>
            Readiness OS rebuilds from first principles. <strong>Pre-staged Readiness Protocols replace real-time coordination. Pattern detection replaces committee deliberation. 12-minute execution replaces 30-day alignment cycles.</strong>
          </P>
          <Callout label="The Core Promise">
            "The response is ready before the trigger fires." Every organization that prepares for every situation it will face is no longer afraid of strategic triggers — it is <strong>Fearless</strong>. The emotional endpoint of the platform is not speed. Speed is the evidence. Readiness is the promise. Fearless is the outcome.
          </Callout>

          <H2>The 3,600× Execution Head Start</H2>
          <P>
            In any organization — startup to Fortune 500 — when a strategic trigger fires, the enterprise spends weeks just to mobilize: figuring out who needs to be in the room, agreeing on a plan, aligning stakeholders — before execution even begins. Readiness OS compresses that entire cycle to 12 minutes.
          </P>
          <Table
            headers={["Metric", "Traditional Model", "Readiness OS"]}
            rows={[
              ["Mobilization", "30 days average (planning, alignment, approvals)", "12 minutes — pre-staged before the trigger fires"],
              ["Stakeholder alignment", "Multiple meetings over days or weeks", "Automated at trigger point"],
              ["Protocol readiness", "Created in response to each trigger", "Pre-staged — 180 Readiness Protocols ready"],
              ["Signal monitoring", "Manual, ad-hoc", "Automatic — continuous monitoring, 231 detection thresholds"],
              ["Execution head start", "0", "3,600× — 30 days compressed to 12 minutes"],
            ]}
          />

          <H2>The Product Thesis Arc</H2>
          <BulletList items={[
            "Preparation — Every situation the organization will face has a pre-staged protocol waiting.",
            "Readiness — The IDEA Framework ensures continuous monitoring, staged protocols, and pre-authorized resources.",
            "Fearless — An organization that has prepared for every situation it will encounter is no longer afraid of strategic situations.",
          ]} />

          <H2>Microsoft Ecosystem Positioning</H2>
          <P>
            Every enterprise has Microsoft's AI stack. None have the operating model to use it. Readiness OS is the operating model layer above the Microsoft investment — not a replacement, an orchestrator. It integrates natively with Microsoft Teams, Copilot Studio, Microsoft Entra, SharePoint, and the broader M365 ecosystem.
          </P>

          <PageBreak />

          {/* ── SECTION 2 ── */}
          <H1 id="s2">2. How to Use This Guide</H1>
          <GoldRule />
          <P>
            This guide is written for new administrators, platform operators, and executive sponsors who want a complete understanding of Readiness OS — both the product and the underlying operating philosophy. It is organized into functional areas so you can read end-to-end for full SME coverage or jump to any section as a reference.
          </P>

          <H2>Who This Guide Is For</H2>
          <Table
            headers={["Role", "Recommended Sections"]}
            rows={[
              ["Platform Administrator", "All sections — particularly Sections 4, 5, 12, 17, 18"],
              ["Executive Sponsor / C-Suite", "Sections 1, 3, 8, 10, 11, 14, 15"],
              ["Operations Lead", "Sections 3, 6, 7, 8, 9, 13"],
              ["IT / Security Lead", "Sections 12, 17, 18 and the Security & Compliance page"],
              ["New User (any role)", "Sections 2, 3, 4, 5 first — then your role-specific sections"],
            ]}
          />

          <H2>Conventions Used in This Guide</H2>
          <BulletList items={[
            "Bold text indicates a platform feature name, a required action, or a key term.",
            "Callout boxes (gold border) highlight critical concepts, warnings, or important notes.",
            "Teal callout boxes highlight tips and best practices.",
            "Screen paths are shown as /path — e.g., /playbook-library — representing the URL in the platform.",
            "All protocol counts, trigger counts, and metrics reflect the current production configuration.",
          ]} />

          <Callout label="Printing This Guide" color={TEAL}>
            Use the "Print / Save as PDF" button at the top of this page. The guide is formatted for US Letter paper (8.5 × 11 in) with 1.2-inch margins. The sidebar and navigation are automatically hidden when printing. Each major section starts on a new page.
          </Callout>

          <PageBreak />

          {/* ── SECTION 3 ── */}
          <H1 id="s3">3. Core Concepts</H1>
          <GoldRule />
          <P>
            Understanding four foundational concepts unlocks everything else in Readiness OS: the IDEA Framework, Readiness Protocols, Strategic Domains, and Triggers.
          </P>

          <H2>The IDEA Framework</H2>
          <P>
            IDEA is the four-phase operating model that structures all activity in Readiness OS. Every feature in the platform maps to one of these four phases.
          </P>
          <Table
            headers={["Phase", "What Happens", "Platform Features"]}
            rows={[
              ["I — Identify", "Define the organization's readiness posture. Map stakeholders, configure protocols, assign ownership, establish pre-approved budgets and communication channels.", "Organization Setup, Protocol Library, Protocol Builder, Getting Started Hub"],
              ["D — Detect", "Continuous, automated monitoring of 231 strategic situations across 8 signal sources. Pattern detection surfaces emerging situations before they escalate.", "Signal Detection, Intelligence Hub, Foresight Radar, Command Tower, Live Signal Feed"],
              ["E — Execute", "When a trigger fires, the pre-staged protocol activates in 12 minutes. Tasks deploy to pre-assigned owners. Executive authorization gate preserved.", "Protocol Activation, War Room, Live Activation Center, Stakeholder Notifications"],
              ["A — Advance", "Every activation generates institutional learning. Protocol version deltas, causal hypotheses, and the Learning Velocity Index compound organizational readiness over time.", "ADVANCE 2.0, Protocol Version History, Update Hypotheses, LVI Dashboard"],
            ]}
          />

          <ScreenshotFigure
            src="/screenshots/deck_how_it_executes.jpg"
            caption="The IDEA Framework in action — signal detection to 12-minute execution. Each phase maps directly to platform features: Identify (protocol staging), Detect (signal monitoring), Execute (war room launch), Advance (learning loop closure)."
          />

          <H2>Readiness Protocols</H2>
          <P>
            A <strong>Readiness Protocol</strong> is a pre-staged, fully configured response plan for a specific strategic situation. It is the fundamental unit of the platform. Each protocol contains:
          </P>
          <BulletList items={[
            "A structured task sequence with pre-assigned owners and deadlines",
            "Pre-authorized budget allocations for immediate deployment",
            "A stakeholder tree with tiered notification sequences (Tier 1: immediate call; Tier 2: secure portal; Tier 3: broadcast alert)",
            "A Commander Brief template for executive decision-making",
            "Decision gates — structured Yes/No checkpoints that branch execution based on real-time outcomes",
            "Communication templates for internal, external, media, and regulatory audiences",
            "Historical performance benchmarks from prior activations",
          ]} />

          <Callout label="Key Principle">
            A Readiness Protocol is not a checklist created at the moment of crisis. It is a fully staged execution plan that was built, reviewed, and authorized before the trigger ever fires. The difference is the 3,600× execution head start.
          </Callout>

          <H2>The 180 Readiness Protocols</H2>
          <P>
            Readiness OS ships with <strong>180 core cross-industry Readiness Protocols</strong> (IDs 1–180) covering the most common strategic situations any organization will face. An additional <strong>30 Compound Protocols</strong> (IDs 181–210) address complex, multi-domain situations where two or more triggers fire simultaneously.
          </P>
          <P>
            Protocols are organized across <strong>nine strategic domains</strong>:
          </P>
          <Table
            headers={["Strategic Category", "Strategic Domains", "Example Protocols"]}
            rows={[
              ["GROWTH & POSITIONING", "Competitive, M&A, Market Operations, Brand & Communications", "Competitor Displacement Sprint (#31), M&A Rapid Response (#58), LBO Defense (#45)"],
              ["RISK & RESILIENCE", "Regulatory, Financial, Supply Chain, Stakeholder", "Ransomware Response (#12), FDA Recall (#67), Supply Chain Collapse (#88), DOJ Investigation (#103)"],
              ["TRANSFORMATION", "Talent, Technology", "Go-to-Market Acceleration Sprint (#89), Workforce Transformation (#112), Digital Infrastructure Migration (#134)"],
            ]}
          />

          <H2>Compound Protocols</H2>
          <P>
            Compound Protocols (IDs 181–210) activate when two or more triggers fire simultaneously or in close sequence. They run <strong>two Readiness Protocols simultaneously on dual-track war rooms</strong>, with a master coordination layer that manages inter-protocol dependencies, shared resources, and unified executive reporting.
          </P>
          <BulletList items={[
            "Example: Activist Investor + Regulatory Investigation — both protocols activate simultaneously with shared stakeholder trees and a unified Commander Brief.",
            "Compound signals are detected automatically by the cross-domain detection engine (runs every 15 minutes).",
            "Compound threat analysis runs every 4 hours to surface latent compound risk before it materializes.",
          ]} />

          <H2>Triggers</H2>
          <P>
            A <strong>Trigger</strong> is a specific, detectable event or signal pattern that indicates a Readiness Protocol should be staged or activated. Readiness OS monitors <strong>231 active triggers</strong> across 9 strategic domains.
          </P>
          <Table
            headers={["Detection Threshold Category", "Examples"]}
            rows={[
              ["Competitive Intelligence", "Competitor product launch, market share shift, executive departure"],
              ["Regulatory & Legal", "DOJ subpoena, FDA warning letter, SEC investigation, class action filing"],
              ["Cybersecurity", "Ransomware detection, data breach indicator, credential exposure"],
              ["Financial Signals", "Credit rating change, earnings miss, activist investor 13D filing"],
              ["Supply Chain", "Supplier insolvency, port disruption, single-source failure"],
              ["Operational", "Key executive departure, labor action, facility failure"],
              ["Reputational", "Negative media surge, social media crisis, product recall signal"],
              ["Macroeconomic", "Interest rate shock, currency disruption, geopolitical escalation"],
            ]}
          />

          <H2>Weak Signals</H2>
          <P>
            Weak signals are early-stage indicators that do not individually constitute a trigger but in combination suggest an emerging situation. The platform aggregates weak signals using a <strong>square-root scaling formula</strong> (√signals × 8) to produce a Risk Score: LOW (&lt;35), MEDIUM (35–74), HIGH (75+). Weak signal accumulation is visible on the Signal Radar Dashboard and Foresight Radar.
          </P>

          <PageBreak />

          {/* ── SECTION 4 ── */}
          <H1 id="s4">4. Getting Started & Onboarding</H1>
          <GoldRule />
          <P>
            Readiness OS has a structured go-live path designed to make an organization fully operational within 90 days. The <strong>Getting Started Hub</strong> at <code>/getting-started</code> tracks your progress across four setup phases with a live completion score.
          </P>

          <H2>The Four Setup Phases</H2>
          <StepList steps={[
            { n: "1", title: "Foundation", body: "Complete organization profile: company name, industry, size, headquarters, and strategic objectives. Connect your primary communication channels (Microsoft Teams, Slack). Invite your platform administrator." },
            { n: "2", title: "Org Structure", body: "Map your organizational hierarchy: departments, reporting lines, and primary contacts. Assign roles (Executive, Admin, Operator, Viewer). Configure the Role Availability flags — mark roles that may be unavailable during specific scenarios." },
            { n: "3", title: "Readiness Configuration", body: "Review and customize your assigned Readiness Protocols. Assign ownership for each protocol's tasks. Set pre-approved budget thresholds. Configure escalation sequences and stakeholder notification preferences." },
            { n: "4", title: "Validation", body: "Run a Practice Drill — a simulated activation of a low-complexity protocol. Review the post-drill debrief score. Confirm signal monitoring is active. Get executive sign-off on the readiness posture." },
          ]} />

          <ScreenshotFigure
            src="/screenshots/slide_onboarding.jpg"
            caption="Getting Started Hub — the four-phase go-live tracker with live completion score. Each phase unlocks the next, guiding administrators from Foundation setup through Validation in 90 days."
          />

          <H2>Onboarding Wizard</H2>
          <P>
            First-time users are guided through a step-by-step <strong>Onboarding Wizard</strong> at <code>/onboarding</code>. The wizard collects organization profile data, imports or maps existing stakeholders, and recommends an initial set of Readiness Protocols based on your industry and size.
          </P>

          <H2>Protocol Builder</H2>
          <P>
            Founding Partners can create custom protocols using the <strong>Protocol Builder</strong> at <code>/protocol-builder</code> — a 6-step guided wizard. Custom protocols follow the same structure as core protocols: task sequence, owner assignment, budget authorization, stakeholder tree, and Commander Brief template.
          </P>

          <Callout label="Founding Partner Program">
            The pre-launch Founding Partner Program is a <strong>90-day validation partnership</strong>. Founding Partners receive full platform access, a dedicated onboarding session, and direct input into protocol development. Apply at <code>/request-access</code>.
          </Callout>

          <PageBreak />

          {/* ── SECTION 5 ── */}
          <H1 id="s5">5. Navigation Overview</H1>
          <GoldRule />
          <P>
            Readiness OS has three synchronized navigation systems, each serving a different context. Understanding how they work together is essential for efficient operation.
          </P>

          <H2>Homepage Navigation (HomepageNav)</H2>
          <P>
            Displayed on public-facing pages (homepage, investor pages, marketing content). Provides access to platform overview, product tour, demo hub, ROI calculator, and executive brief. This navigation is visible before login.
          </P>

          <H2>Standard Navigation (StandardNav)</H2>
          <P>
            The primary navigation for authenticated users. Organized into mega-menu categories:
          </P>
          <BulletList items={[
            "Platform — Core dashboards, mission control, command tower, workspace hub",
            "Protocols — Readiness Protocol Library, Protocol Builder, Compound Threats, Practice Drills",
            "Intelligence — Signal Radar, Foresight Dashboard, Intelligence Hub, Trigger Management",
            "Analytics — Enterprise Metrics, ADVANCE 2.0, ROI Dashboard, Audit Logs",
            "Organization — Setup, Stakeholders, Integrations, Role Configuration",
          ]} />

          <H2>IDEA Sidebar (IDEASidebar)</H2>
          <P>
            A persistent left-rail sidebar available in the main workspace. Organized by IDEA phase, it provides one-click access to phase-specific tools and shows a live status indicator for each phase (number of active signals, active protocols, pending close-outs, and open hypotheses).
          </P>

          <H2>Workspace Hub (/workspace)</H2>
          <P>
            The unified daily operating surface. The Workspace Hub surfaces all four IDEA phases in a single view, shows active executions at the top via a <strong>JIT Context Banner</strong>, and displays a <strong>My Actions</strong> panel filtered to the logged-in user's assigned tasks and pending decisions.
          </P>

          <PageBreak />

          {/* ── SECTION 6 ── */}
          <H1 id="s6">6. Signal Detection & Intelligence</H1>
          <GoldRule />
          <P>
            The Detect phase is the engine of the platform. Readiness OS performs continuous monitoring of signal sources to surface emerging situations before they require emergency response.
          </P>

          <H2>Live Signal Ingestion</H2>
          <P>
            The platform ingests live signals from <strong>8 primary RSS and API sources</strong> every 15 minutes — these are the external data feeds (regulatory wires, financial services, news aggregators, industry-specific monitors). Each ingestion cycle scores incoming content against the 231 detection thresholds to determine whether a Readiness Protocol should be staged. Source count and threshold count are separate concepts: 8 is how many feeds are monitored; 231 is how many distinct detection thresholds are evaluated against each feed.
          </P>
          <BulletList items={[
            "Fetches new content from configured signal sources (regulatory feeds, financial wire services, news aggregators, industry-specific monitors)",
            "Scores each signal against all 231 detection thresholds across 9 strategic domains",
            "Persists matched signals and associated trigger detections",
            "Updates the organization's Risk Score and Readiness Score in real time",
          ]} />

          <H2>Intelligence Hub (/intelligence-hub)</H2>
          <P>
            The primary interface for signal review. Displays all recent signal detections, categorized by domain and urgency level. Each signal entry shows:
          </P>
          <BulletList items={[
            "Signal source and ingestion timestamp",
            "Matched detection threshold category and confidence classification",
            "Associated Readiness Protocols (pre-staged and ready)",
            "Escalation recommendation (Monitor / Stage / Activate)",
          ]} />

          <ScreenshotFigure
            src="/screenshots/deck_signals.jpg"
            caption="Intelligence Hub — live signal detections scored against 231 detection thresholds across 8 data sources. Each signal shows domain classification, urgency level, matched protocol, and escalation recommendation."
          />

          <H2>Foresight Radar (/foresight-radar)</H2>
          <P>
            A forward-looking dashboard that aggregates weak signals into emerging patterns. Uses a radar visualization to show signal velocity across all nine strategic domains. The Foresight Radar is the early-warning system — it surfaces situations that are building before they become trigger-level events.
          </P>

          <H2>Signal Radar Dashboard (/ai-radar)</H2>
          <P>
            A real-time 360° view of the organization's signal environment. Compares current signal volume and response velocity against industry benchmarks and the organization's own historical performance. Includes a <strong>Response Velocity Gauge</strong> showing average activation time vs. the 12-minute benchmark.
          </P>

          <H2>Prism Insights</H2>
          <P>
            Cross-domain trend analysis engine. Identifies correlations between signals from different strategic domains — for example, a pattern where regulatory pressure in RISK & RESILIENCE consistently precedes competitive displacement in GROWTH & POSITIONING for a given industry. Prism surfaces these cross-domain patterns to inform proactive protocol staging.
          </P>

          <H2>Command Tower (/command-tower)</H2>
          <P>
            The executive wall-display dashboard. Designed for high-visibility screens in executive floors or operations centers. Shows live trigger detections, protocols currently in flight, active war rooms, system readiness score, and incoming signal feed — all in a full-screen, auto-refreshing layout. See Section 14 for full detail.
          </P>

          <H2>Regulatory Calendar</H2>
          <P>
            Displays upcoming compliance deadlines, regulatory reporting windows, and known industry trigger dates. Automatically recommends staging the relevant Readiness Protocol 30, 14, and 7 days before each deadline. Reduces reactive activation by converting known calendar triggers into pre-staged preparation.
          </P>

          <PageBreak />

          {/* ── SECTION 7 ── */}
          <H1 id="s7">7. Readiness Protocol Library</H1>
          <GoldRule />
          <P>
            The Protocol Library at <code>/playbook-library</code> is the central repository of all 180 core protocols and 30 compound protocols. It is the most frequently used area of the platform for administrators and operations leads.
          </P>

          <H2>Browsing the Library</H2>
          <P>
            Protocols are displayed in a searchable, filterable grid. Filtering options:
          </P>
          <BulletList items={[
            "Strategic Category — GROWTH & POSITIONING, RISK & RESILIENCE, TRANSFORMATION",
            "Strategic Domain — Competitive, M&A, Regulatory, Financial, Supply Chain, Talent, Technology, Market Operations, Stakeholder",
            "Readiness Status — Fully Staged, Partially Configured, Needs Attention",
            "Activation History — Never Activated, Activated 1–3×, Activated 4+× (battle-tested)",
            "Protocol Type — Core (1–180), Compound (181–210), Custom (user-created)",
          ]} />

          <H2>Protocol Detail View</H2>
          <P>
            Clicking any protocol opens its detail view, which contains:
          </P>
          <Table
            headers={["Tab", "Contents"]}
            rows={[
              ["Overview", "Strategic rationale, detection thresholds, domain classification, protocol version, last activation date, average response time"],
              ["Task Sequence", "All pre-staged tasks in order, with assigned owners, expected duration, decision gates, and dependency chain"],
              ["Stakeholders", "Full stakeholder tree: Tier 1 (direct call), Tier 2 (secure portal notification), Tier 3 (broadcast alert)"],
              ["Resources", "Pre-approved budget envelope, required tools, external contacts, vendor agreements"],
              ["Commander Brief", "Executive decision brief template — auto-populated with live signal data at activation"],
              ["History", "All prior activations: start time, close-out time, elapsed minutes, outcome score, debrief classification"],
              ["ADVANCE", "All applied protocol updates, version deltas, and proven/disproven hypotheses from the ADVANCE 2.0 learning loop"],
            ]}
          />

          <ScreenshotFigure
            src="/screenshots/protocol_library_v2.jpg"
            caption="Readiness Protocol Library — 180 core protocols and 30 compound protocols in a searchable, filterable grid. Each card shows domain, readiness status, activation history, and last-modified date."
          />

          <H2>Protocol Readiness Audit (/playbook-readiness-audit)</H2>
          <P>
            A systematic review tool that scores every protocol in your library against a readiness rubric. Each protocol receives a score from 0–100 across five dimensions: Owner Coverage (all tasks assigned), Budget Authorization (envelope set), Stakeholder Completeness (Tier 1–3 populated), Communication Templates (ready), and Signal Calibration (triggers mapped). The audit generates a prioritized remediation list so administrators know exactly what to fix and in what order.
          </P>

          <H2>Industry Protocol Packs</H2>
          <P>
            In addition to the 180 cross-industry core protocols, Readiness OS offers six <strong>Industry Protocol Packs</strong> with sector-specific configurations:
          </P>
          <BulletList items={[
            "Financial Services — Banking regulation, trading halt, liquidity events, FDIC scenarios",
            "Life Sciences & Pharma — FDA recalls, clinical trial holds, regulatory submissions, post-market safety",
            "Energy & Utilities — Grid failure, NERC compliance, pipeline incidents, ESG reporting triggers",
            "Manufacturing & Supply Chain — Tier-1 supplier failure, quality recall, labor action, ISO audit",
            "Retail & Consumer — Food safety recall, product liability, seasonal demand collapse, data breach",
            "Technology — Cybersecurity incident, SLA breach, infrastructure migration, talent flight risk",
          ]} />

          <PageBreak />

          {/* ── SECTION 8 ── */}
          <H1 id="s8">8. Activating a Protocol</H1>
          <GoldRule />
          <P>
            Protocol activation is the moment the platform delivers its core value — the transformation from a detected signal into a coordinated, authorized, 12-minute execution. Understanding every step of this flow is essential for all platform users.
          </P>

          <H2>Activation Entry Points</H2>
          <BulletList items={[
            "Automatic staging — the platform detects a trigger and recommends staging a protocol. The executive receives a notification to review and authorize.",
            "Manual activation — any user with Admin or Executive role can activate a protocol directly from the Protocol Library or from the Live Activation Center.",
            "Drill activation — from the Practice Drills module, any authorized user can run a simulated activation without triggering real notifications or budget draws.",
          ]} />

          <H2>The Activation Flow (Step by Step)</H2>
          <StepList steps={[
            { n: "1", title: "Trigger Detection", body: "The signal monitoring engine detects a situation forming. The Intelligence Hub creates a Trigger Detection record, scoring the signal against all 231 detection thresholds. If the signal matches a staged protocol, an escalation alert is generated." },
            { n: "2", title: "Commander Brief Generation", body: "The platform generates a Commander Brief — a decision-ready executive summary that includes: signal source and classification, matched protocol recommendation, expected response window, pre-authorized budget envelope, key stakeholders on standby, and recommended decision: Stage / Activate / Monitor." },
            { n: "3", title: "Executive Authorization", body: "No activation proceeds without explicit executive sign-off. The designated executive receives the Commander Brief via their configured notification channel (in-app, Teams, Slack, or email). They review and authorize with a single action. Authorization is logged as an immutable governance record." },
            { n: "4", title: "War Room Launch", body: "Immediately on authorization, a War Room is instantiated. All Tier 1 stakeholders are notified simultaneously via their configured channels. The war room centralizes all communication, task tracking, and decision logging for the duration of the activation." },
            { n: "5", title: "Task Deployment", body: "All pre-staged tasks are deployed to their assigned owners. Each owner receives an immediate notification requiring acknowledgment. The first acknowledgment response is called the 'First Signal' — silence at this stage is the earliest indicator of execution risk." },
            { n: "6", title: "Decision Gates", body: "At pre-defined checkpoints, the activation flow pauses for a Yes/No executive decision gate. Gates branch the task sequence based on real-time conditions. This preserves human judgment at every critical juncture while keeping the broader execution moving." },
            { n: "7", title: "Real-Time Coordination", body: "The War Room displays live task completion rates, elapsed time against the 12-minute benchmark, stakeholder acknowledgment status, and incoming signal updates. The Crisis Communications Generator produces audience-specific messages (board, employees, media, regulators) in under 18 seconds." },
            { n: "8", title: "Close-Out Gate", body: "When the situation is contained, the lead executive completes the Ownership Close-Out Gate — a formal 4-field structured debrief that records what held, what failed, timeline, and recommended protocol updates. This is required to close the activation and unlock the ADVANCE learning loop." },
          ]} />

          <ScreenshotFigure
            src="/screenshots/deck_activation.jpg"
            caption="Live Activation Console — the 8-step activation flow from trigger detection through executive authorization to war room launch. The elapsed clock tracks against the 12-minute benchmark in real time."
          />

          <H2>Key Activation Metrics</H2>
          <Table
            headers={["Metric", "Definition", "Target"]}
            rows={[
              ["Time to First Signal", "Elapsed time from activation to first task acknowledgment", "< 2 minutes"],
              ["Activation Velocity", "Elapsed time from trigger detection to war room launch", "< 12 minutes"],
              ["Task Completion Rate", "% of pre-staged tasks completed within target window", "> 90%"],
              ["Decision Gate Response Time", "Time for executive to respond to each decision gate", "< 5 minutes"],
              ["Close-Out Score", "Post-debrief quality score (0–100)", "> 80"],
            ]}
          />

          <H2>Debrief Classification</H2>
          <P>
            Every completed activation is automatically classified into one of three debrief categories based on close-out data:
          </P>
          <BulletList items={[
            "Optimization — The protocol performed as designed. Minor calibration updates recommended.",
            "Mixed-Signal — Some elements performed well, others did not. Specific task or stakeholder updates required.",
            "Recovery — Significant execution gaps identified. Protocol requires substantive revision before next activation.",
          ]} />

          <PageBreak />

          {/* ── SECTION 9 ── */}
          <H1 id="s9">9. War Room Operations</H1>
          <GoldRule />
          <P>
            The War Room is the real-time coordination environment for an active protocol execution. Every activation automatically launches a War Room that remains open until the formal Close-Out Gate is completed.
          </P>

          <H2>War Room Dashboard</H2>
          <P>
            The War Room dashboard displays in real time:
          </P>
          <BulletList items={[
            "Elapsed activation time vs. 12-minute benchmark with a live clock",
            "Task board — all pre-staged tasks with status (Pending, In Progress, Complete, Blocked)",
            "Stakeholder acknowledgment matrix — who has responded, who is silent, who is unreachable",
            "Decision gate queue — upcoming gates with recommended decisions",
            "Live signal feed — any new signals detected during the activation",
            "Financial Exposure Estimator — real-time dollar-at-risk calculation based on elapsed time and situation type",
          ]} />

          <ScreenshotFigure
            src="/screenshots/slide_execution.jpg"
            caption="War Room — the real-time coordination environment. Task board, stakeholder acknowledgment matrix, elapsed clock against the 12-minute benchmark, and live signal feed all visible in a single command view."
          />

          <H2>Crisis Communications Generator</H2>
          <P>
            One of the highest-value tools in the War Room. On demand, generates <strong>five audience-specific communications in under 18 seconds</strong>:
          </P>
          <Table
            headers={["Audience", "Format", "Tone"]}
            rows={[
              ["Board of Directors", "Formal brief, 200 words", "Measured, factual, action-oriented"],
              ["All Employees", "Broadcast message", "Reassuring, clear, transparent"],
              ["External Media", "Press statement", "Controlled, minimal detail, factual"],
              ["Regulatory Bodies", "Formal notification letter", "Precise, legally appropriate, documented"],
              ["Key Customers / Partners", "Direct communication", "Relationship-preserving, honest, action-clear"],
            ]}
          />
          <P>
            All generated communications are logged as activation artifacts and versioned for compliance records.
          </P>

          <H2>Financial Exposure Estimator</H2>
          <P>
            Calculates the real-time dollar-at-risk value based on situation type, elapsed time, organizational revenue metrics, and historical cost-per-minute benchmarks by scenario category. Used to communicate urgency to executives and justify resource deployment decisions.
          </P>

          <H2>Stakeholder Coordination</H2>
          <P>
            The War Room integrates with Slack and Microsoft Teams to push real-time task assignments, decision gate requests, and status updates directly to stakeholders in their native tools. No stakeholder needs to log into Readiness OS to participate — the platform brings the coordination to them.
          </P>

          <H2>Live Activation Center (/live-activation-center)</H2>
          <P>
            An operations-level view showing all currently active war rooms across the organization. Enables the Operations Lead to monitor multiple simultaneous activations, triage resource conflicts, and escalate or close individual war rooms as needed.
          </P>

          <PageBreak />

          {/* ── SECTION 10 ── */}
          <H1 id="s10">10. ADVANCE 2.0 — Closed-Loop Learning System</H1>
          <GoldRule />
          <P>
            ADVANCE 2.0 is the institutional memory engine of Readiness OS. It turns every activation into a compound organizational advantage that no competitor can quickly replicate. Access the full dashboard at <code>/advance-intelligence</code>.
          </P>

          <Callout label="The Strategic Moat">
            The ADVANCE 2.0 system quantifies how many months it would take a competitor to rebuild your organization's encoded decision logic. This is the core moat metric — it compounds with every activation.
          </Callout>

          <H2>How the Learning Loop Works</H2>
          <StepList steps={[
            { n: "1", title: "Activation Close-Out", body: "When an executive completes the Close-Out Gate, the structured debrief data (what held, what failed, timeline, recommended changes) is captured as the raw material for the learning loop." },
            { n: "2", title: "Update Generation", body: "The ADVANCE Loop Service analyzes the close-out data and generates specific protocol updates: signal keyword additions, owner reassignments, task sequence refinements, budget adjustments, and stakeholder tier changes." },
            { n: "3", title: "Authorization Queue", body: "Updates are classified as Low-Risk (auto-applied: minor signal calibrations) or High-Risk (requires executive authorization: ownership changes, protocol restructuring). All changes appear in the Authorization Queue for review." },
            { n: "4", title: "Protocol Version Delta", body: "When an update is applied, an immutable Protocol Version Delta is created. This records the exact change (versionBefore → versionAfter), the rationale, and the expected outcome. All deltas are permanently preserved for audit and governance." },
            { n: "5", title: "Causal Hypothesis", body: "Each applied update generates a measurable Causal Hypothesis. Example: 'Adding signal keyword X is expected to reduce detection lag by 4 minutes.' The hypothesis records the expected outcome, the measurement window (3 activations), and a confidence score baseline." },
            { n: "6", title: "Hypothesis Measurement", body: "After the measurement window completes, the system compares actual response time against the pre-update baseline and classifies the hypothesis as Proven (improvement confirmed), Disproven (no improvement), or Pending (insufficient data)." },
          ]} />

          <H2>Learning Velocity Index Dashboard</H2>
          <P>
            The LVI Dashboard (/advance-intelligence) displays the organization's cumulative learning performance:
          </P>
          <Table
            headers={["Metric", "Definition"]}
            rows={[
              ["Updates Applied", "Total protocol updates applied to date"],
              ["Proven Improvements", "Updates confirmed as effective by causal measurement"],
              ["Total Minutes Saved", "Aggregate activation time reduction from proven updates"],
              ["Protocol Coverage", "% of the 180-protocol library with at least one evidence-backed change"],
              ["Top 10 Updates by Impact", "Ranked list of the highest-impact proven improvements"],
              ["6-Month Velocity Trend", "Rate of learning acceleration over the prior 6 months"],
              ["Moat Metric", "Estimated months for a competitor to rebuild this organization's encoded decision logic"],
            ]}
          />

          <ScreenshotFigure
            src="/screenshots/deck_learning.jpg"
            caption="ADVANCE 2.0 Learning Velocity Index — every activation generates measurable improvements. The dashboard shows proven updates, total minutes saved, protocol coverage %, and the moat metric (months to rebuild on any competitor)."
          />

          <H2>Protocol Version History</H2>
          <P>
            Every protocol maintains a complete, immutable version history. Each delta record contains: version numbers (before/after), change type, applied date, applied by (user), expected impact, and the hypothesis classification result. This history is accessible in the ADVANCE tab of each Protocol's detail view.
          </P>

          <PageBreak />

          {/* ── SECTION 11 ── */}
          <H1 id="s11">11. Dashboards & Analytics</H1>
          <GoldRule />
          <P>
            Readiness OS provides role-specific dashboards for every level of the organization — from individual operators to the board of directors.
          </P>

          <H2>Core Dashboards</H2>
          <Table
            headers={["Dashboard", "Path", "Primary User", "Key Information"]}
            rows={[
              ["Mission Control", "/mission-control", "Operations Lead", "Live alert feed, domain status board, 12-minute execution clock for active activations"],
              ["Executive Hub", "/executive-hub", "C-Suite", "Domain coverage score, decision velocity, high-level risk heatmap, protocol readiness %"],
              ["Command Tower", "/command-tower", "All executives", "Wall-display: live triggers, active war rooms, system readiness score, signal feed"],
              ["Executive Analytics", "/executive-analytics", "Executive Sponsor", "Trend analysis, KPI history, performance vs. benchmark"],
              ["AI Radar Dashboard", "/ai-radar", "Operations", "Signal velocity, response time benchmarks, readiness posture index"],
              ["Foresight Radar", "/foresight-radar", "Strategy Lead", "Weak signal patterns, emerging situation forecasts, domain risk velocity"],
              ["Future Readiness", "/future-readiness", "Strategy Lead", "Forward-looking readiness score, scenario probability modeling"],
            ]}
          />

          <ScreenshotFigure
            src="/screenshots/deck_mission_control.jpg"
            caption="Mission Control — the operational command surface. Live alert feed, domain status board, active execution clock, and Executive Readiness Score updated in real time across all nine strategic domains."
          />

          <H2>ROI Dashboard</H2>
          <P>
            Displays the financial value generated by Readiness OS across all activations. Tracks:
          </P>
          <BulletList items={[
            "Actual costs logged per activation vs. estimated cost without Readiness OS",
            "Time saved vs. 30-day mobilization baseline — translated to dollar value",
            "Outcome classification breakdown: fully mitigated, partially mitigated, recovery required",
            "Consulting retainer equivalent: total platform value vs. equivalent external advisory spend",
          ]} />

          <H2>ROI Calculator (/roi-calculator)</H2>
          <P>
            The interactive ROI Calculator allows prospective and current customers to model the platform's financial impact. Inputs include:
          </P>
          <BulletList items={[
            "Annual revenue and operating cost base",
            "Number of anticipated strategic situations per year",
            "Platform cost (slider: $60K–$240K/year, default $120K)",
            "Consulting retainer cost for comparison",
          ]} />
          <P>
            Outputs: first-year ROI %, 3-year net value, break-even calculation, consulting retainer comparison, and value-at-risk preservation estimate.
          </P>

          <H2>Enterprise Metrics (/enterprise-metrics)</H2>
          <P>
            Board-level aggregate KPIs across all 9 strategic domains. Designed for quarterly board reporting and executive performance reviews. Exportable as a Board-Ready Activation Report.
          </P>

          <H2>Decision Velocity Dashboard</H2>
          <P>
            Tracks how quickly executives respond to decision gates, authorization requests, and close-out requirements. Identifies decision bottlenecks and patterns in executive response time that could compromise the 12-minute benchmark.
          </P>

          <H2>Audit Logging Center (/audit)</H2>
          <P>
            Complete, immutable governance history for every action taken in the platform: activations, close-outs, protocol updates, user access changes, authorization decisions, and system configuration changes. Supports SOC 2, ISO 27001, and internal compliance requirements.
          </P>

          <H2>Executive Readiness Score</H2>
          <P>
            A 0–100 composite score derived from four components: live signal volume (25%), active trigger detections (25%), protocol library readiness (25%), and historical activation performance (25%). Displayed prominently on the Executive Hub and Mission Control. Updates continuously as new signals are detected and protocols are updated.
          </P>

          <PageBreak />

          {/* ── SECTION 12 ── */}
          <H1 id="s12">12. Organization Setup & Configuration</H1>
          <GoldRule />
          <P>
            Organization Setup at <code>/organization-setup</code> is the administrative backbone of the platform. Complete, accurate configuration here directly determines the quality and speed of all future activations.
          </P>

          <H2>Organization Profile</H2>
          <BulletList items={[
            "Company name, industry classification, employee size, headquarters location",
            "Subscription tier (Founding Partner or Enterprise)",
            "Onboarding completion status",
            "Primary executive contacts",
          ]} />

          <H2>Stakeholder Management (/stakeholder-management)</H2>
          <P>
            The most critical configuration area in the platform. Stakeholders drive every notification, task assignment, and decision gate. For each stakeholder, configure:
          </P>
          <Table
            headers={["Field", "Description"]}
            rows={[
              ["Name & Title", "Full name and organizational role"],
              ["Notification Tier", "Tier 1 (immediate call), Tier 2 (secure portal), Tier 3 (broadcast)"],
              ["Contact Method", "Direct Call, Microsoft Teams, Slack, Secure Portal, Emergency Alert"],
              ["Protocol Assignment", "Which protocols this stakeholder is a task owner or decision gate holder"],
              ["Backup Contact", "Designated backup if primary is unavailable — role availability flag"],
              ["Availability", "Role availability configuration — mark roles as limited during specific periods"],
            ]}
          />

          <H2>Role Availability Flags</H2>
          <P>
            Organizations can flag specific roles as <strong>limited</strong> during known high-risk periods (e.g., CISO on international travel, CFO in earnings blackout). When a role is flagged limited, the platform automatically routes tasks to the designated backup owner and notes the limitation in the Commander Brief. Configure at <code>/organization-setup</code> under the Role Availability section.
          </P>

          <H2>Communication Channel Configuration</H2>
          <BulletList items={[
            "Microsoft Teams — workspace and channel mapping for war room notifications",
            "Slack — workspace token and channel configuration",
            "Email — SMTP configuration for secure notification delivery",
            "Webhook endpoints — custom integration points for enterprise systems",
          ]} />

          <H2>Escalation Policy</H2>
          <P>
            Configure the platform's default escalation behavior: how long to wait for task acknowledgment before escalating, who receives the escalation, and whether silence triggers an automatic backup notification.
          </P>

          <H2>Success Metrics Configuration</H2>
          <P>
            Define the organization's target performance benchmarks: target activation velocity (default 12 minutes), target close-out score (default 80+), acceptable debrief classification distribution, and ROI targets. These benchmarks drive the performance charts on all analytics dashboards.
          </P>

          <PageBreak />

          {/* ── SECTION 13 ── */}
          <H1 id="s13">13. Practice Drills</H1>
          <GoldRule />
          <P>
            Practice Drills at <code>/practice-drills</code> enable organizations to simulate full protocol activations without triggering live notifications or drawing from pre-approved budget envelopes. Think of them as fire drills for strategic situations.
          </P>

          <H2>Scheduling a Drill</H2>
          <StepList steps={[
            { n: "1", title: "Select a Protocol", body: "Choose any protocol from the library to simulate. Compound protocols can be run as drills to practice dual-track war room coordination." },
            { n: "2", title: "Configure Participants", body: "Select which stakeholders will receive simulated notifications. Simulation mode clearly marks all notifications as drills to prevent real-world confusion." },
            { n: "3", title: "Set Scenario Parameters", body: "Optionally inject specific signal conditions to test particular protocol branches or decision gates." },
            { n: "4", title: "Run the Drill", body: "The platform runs the full activation sequence — Commander Brief, war room, task deployment, decision gates — in simulation mode. Participants respond as they would in a real activation." },
            { n: "5", title: "Post-Drill Debrief", body: "A structured debrief dialog captures performance data. The platform scores the drill and generates a Debrief Report with specific improvement recommendations." },
          ]} />

          <H2>Drill Scoring</H2>
          <P>
            Each drill is scored across five dimensions: Velocity (time to first task acknowledgment), Coverage (% of stakeholders who responded), Decision Quality (gate response appropriateness), Communication (if crisis communications were generated), and Debrief Depth (quality of close-out notes). The combined score (0–100) is benchmarked against prior drill scores to show improvement over time.
          </P>

          <H2>Drill Tracking System</H2>
          <P>
            The Drill Tracking System at <code>/drill-tracking</code> shows the full history of all practice drills: date, protocol, participants, score, debrief classification, and any protocol updates that resulted from the drill. The ADVANCE 2.0 learning loop applies equally to drill outcomes as to live activations.
          </P>

          <PageBreak />

          {/* ── SECTION 14 ── */}
          <H1 id="s14">14. Command Tower</H1>
          <GoldRule />
          <P>
            The Command Tower at <code>/command-tower</code> is a full-screen executive wall-display dashboard designed for high-visibility screens in executive floors, operations centers, or boardrooms. It requires no interaction — it is a live, auto-refreshing read-only display.
          </P>

          <H2>Display Panels</H2>
          <Table
            headers={["Panel", "What It Shows"]}
            rows={[
              ["Executive Readiness Score", "Live 0–100 composite score with trend indicator"],
              ["Active Protocols", "Count of protocols currently in active war rooms"],
              ["Live Signal Feed", "Real-time incoming signal detections with domain classification and urgency"],
              ["Trigger Detection Counter", "Total triggers detected in the last 24 hours, 7 days, 30 days"],
              ["Domain Status Board", "GROWTH & POSITIONING / RISK & RESILIENCE / TRANSFORMATION — risk level and active protocol count per domain"],
              ["Execution Velocity", "Average time-to-close across recent activations vs. 12-minute benchmark"],
              ["War Room Pulse Map", "Visual map of active war rooms with elapsed time and status indicators"],
            ]}
          />

          <ScreenshotFigure
            src="/screenshots/deck_command_tower.jpg"
            caption="Command Tower — full-screen executive wall display. Live trigger detections, active war rooms, domain risk status, and system readiness score — designed for high-visibility screens in executive floors and operations centers."
          />

          <H2>Setup for Executive Display</H2>
          <P>
            Navigate to <code>/command-tower</code> on a dedicated display device (large screen TV, digital signage display). The page auto-refreshes every 60 seconds. For always-on display, configure the device to load the URL on startup and disable screen sleep. No login interaction is required once authenticated.
          </P>

          <PageBreak />

          {/* ── SECTION 15 ── */}
          <H1 id="s15">15. Executive Tools & Sales Assets</H1>
          <GoldRule />
          <P>
            Readiness OS includes a suite of board-ready and procurement-ready documents that can be accessed directly within the platform.
          </P>

          <H2>Executive Brief (/executive-brief)</H2>
          <P>
            A printable one-page executive summary of the platform for board presentations and executive briefings. Contains:
          </P>
          <BulletList items={[
            "Platform thesis: The 3,600× execution head start",
            "Side-by-side comparison: Traditional Model vs. Readiness OS",
            "Proof numbers: average activation velocity, protocol coverage, Learning Velocity Index",
            "ROI case: break-even analysis and 3-year net value",
            "Founding Partner Program CTA",
          ]} />

          <H2>Security & Compliance (/security-compliance)</H2>
          <P>
            A procurement-ready one-page overview for IT and security teams. Covers:
          </P>
          <BulletList items={[
            "Authentication: OIDC / SSO via Microsoft Entra and Replit Identity",
            "Data governance: tenant isolation, encryption at rest and in transit",
            "Access control: Role-Based Access Control with fail-closed defaults",
            "Compliance readiness: SOC 2 Type II roadmap, ISO 27001 alignment",
            "AI safety controls: human-in-the-loop gate on every activation, no autonomous action",
            "Audit trail: complete, immutable event log for all system actions",
          ]} />

          <H2>Proof Story (/proof-story)</H2>
          <P>
            Three full activation narratives — Ransomware, Activist Investor, Supply Chain Collapse — with side-by-side timelines (With vs. Without Readiness OS), head-to-head comparison tables, and specific financial outcomes. Toggle between "Side by Side," "With Readiness OS," and "Without" views. Used for prospect presentations and board briefings.
          </P>

          <H2>Board-Ready Activation Report</H2>
          <P>
            Generated from any completed activation. Includes: activation summary, elapsed time, task completion rate, decision gate log, close-out debrief, financial exposure estimate, and recommended next steps. Formatted for direct presentation in board meetings. Export from the activation's detail page.
          </P>

          <H2>Buyer Decision Packet (/buyer-decision-packet)</H2>
          <P>
            A comprehensive procurement package for organizations in formal vendor evaluation. Includes the Executive Brief, Security & Compliance overview, ROI analysis, Proof Stories, and Founding Partner Program terms.
          </P>

          <PageBreak />

          {/* ── SECTION 16 ── */}
          <H1 id="s16">16. Demo & Test Drive Features</H1>
          <GoldRule />
          <P>
            Readiness OS includes a full suite of interactive demonstration experiences for prospects, executive briefings, and internal training.
          </P>

          <H2>12-Minute Test Drive (/12-minute-experience)</H2>
          <P>
            A public, 4-step interactive simulation designed for first-time visitors. Runs a complete trigger-to-execution chain in an accelerated format. Seven available scenarios:
          </P>
          <BulletList items={[
            "Ransomware Attack (RISK & RESILIENCE)",
            "Activist Investor (GROWTH & POSITIONING)",
            "FDA Recall (RISK & RESILIENCE)",
            "Supply Chain Collapse (RISK & RESILIENCE)",
            "Competitor Displacement (GROWTH & POSITIONING)",
            "Workforce Transformation (TRANSFORMATION)",
            "Activist Investor + Regulatory Investigation (Compound — dual-track war room)",
          ]} />

          <ScreenshotFigure
            src="/screenshots/deck_12min_experience.jpg"
            caption="12-Minute Test Drive — public 4-step simulation showing the full trigger-to-execution chain. Seven scenario options across all three strategic categories, including a compound dual-track war room scenario."
          />

          <H2>Demo Hub (/demo-hub)</H2>
          <P>
            A curated library of 12 full scenario simulations across all three strategic categories. Each scenario runs the complete 4-phase IDEA chain with real protocol content, realistic task sequences, and live Commander Brief generation. Designed for 30-minute executive demonstrations.
          </P>

          <H2>Master Demo (/master-demo)</H2>
          <P>
            The flagship demonstration — a 7-phase complete walkthrough of an Activist Investor scenario from first signal detection through ADVANCE 2.0 learning loop closure. Designed for board-level presentations and investor briefings.
          </P>

          <H2>How It Executes (/how-it-executes)</H2>
          <P>
            An animated, interactive visualization of the full execution chain: signal → protocol match → tasks staged → stakeholders notified → executive authorizes → 12 minutes complete. Features 5 scenario selectors and an Old Model comparison panel. Auto-plays on load.
          </P>

          <H2>Simulation Studio</H2>
          <P>
            An advanced simulation environment for power users and administrators. Allows injection of custom signal scenarios, simulation of edge cases, and testing of newly created protocols before their first live activation.
          </P>

          <PageBreak />

          {/* ── SECTION 17 ── */}
          <H1 id="s17">17. Role-Based Access Control</H1>
          <GoldRule />
          <P>
            Readiness OS enforces strict Role-Based Access Control (RBAC) on all routes and data operations. Access fails closed — in the event of any authentication or authorization ambiguity, the system denies access rather than granting it.
          </P>

          <H2>Platform Roles</H2>
          <Table
            headers={["Role", "Access Level", "Typical Users"]}
            rows={[
              ["Platform Admin", "Full system access including user management, allowlist, admin panel", "IT Administrator, Platform Owner"],
              ["Executive", "Full operational access: activate protocols, authorize decisions, close activations, view all analytics", "CEO, CFO, CISO, COO, CTO, CHRO, CMO"],
              ["Admin", "Protocol configuration, stakeholder management, organization setup, drill scheduling", "Operations Lead, Chief of Staff"],
              ["Operator", "View all data, execute assigned tasks, participate in war rooms, acknowledge task assignments", "Department Lead, Functional Manager"],
              ["Viewer", "Read-only access to dashboards, protocol library, and analytics", "Board Member, Investor, Observer"],
            ]}
          />

          <H2>Access Control Architecture</H2>
          <BulletList items={[
            "All API routes are protected by authentication middleware. Unauthenticated requests return 401 Unauthorized.",
            "Mutable operations (activations, close-outs, protocol updates) require minimum Operator role.",
            "Executive authorization gates require the Executive role — cannot be bypassed or delegated in the API.",
            "Organization membership is validated on every mutable route — users can only modify data within their own organization.",
            "Platform Admin role is keyed to the PLATFORM_ADMIN_EMAIL environment secret — it cannot be assigned via the UI.",
          ]} />

          <H2>User Management (/admin/users)</H2>
          <P>
            Platform Admins access the User Management panel at <code>/admin/users</code>. Functions available:
          </P>
          <BulletList items={[
            "View all registered users with their organization, role, and last active date",
            "Delete users (removes from system; does not delete organization data)",
            "Manage the email allowlist — restrict platform access to approved email addresses",
            "View login history and access audit trail",
          ]} />

          <H2>Email Allowlist</H2>
          <P>
            The platform supports an email allowlist that gates all logins. When the allowlist is empty, any authenticated user can access the platform. Once any email is added to the allowlist, only listed emails (plus the Platform Admin) can log in. Users not on the list are redirected to <code>/access-denied</code>.
          </P>

          <H2>Role Selector</H2>
          <P>
            New users who join without a pre-assigned role are shown a Role Selector at their first login. They choose their primary organizational role, which determines their default access level until a Platform Admin assigns a formal RBAC role.
          </P>

          <PageBreak />

          {/* ── SECTION 18 ── */}
          <H1 id="s18">18. Integration Hub</H1>
          <GoldRule />
          <P>
            Readiness OS is built to integrate with the enterprise tooling stack that organizations already use. The Integration Hub at <code>/integrations</code> manages all external connections.
          </P>

          <H2>Microsoft Ecosystem</H2>
          <Table
            headers={["Integration", "Function in Readiness OS"]}
            rows={[
              ["Microsoft Teams", "War room notifications, task assignment alerts, decision gate requests pushed directly to Teams channels"],
              ["Microsoft Entra (Azure AD)", "SSO authentication — users log in with their existing enterprise Microsoft credentials"],
              ["Copilot Studio", "Readiness OS acts as the operating model layer above the Microsoft AI investment"],
              ["SharePoint", "Protocol document storage and Commander Brief archive"],
            ]}
          />

          <H2>Communication & Collaboration</H2>
          <BulletList items={[
            "Slack — Real-time war room notifications and task assignments delivered to configured Slack channels. Webhook-based, no bot installation required.",
            "Email (Resend / SMTP) — Fallback and backup notification delivery. Commander Briefs and activation summaries sent via email when Slack/Teams are unavailable.",
          ]} />

          <H2>Operations & ITSM</H2>
          <BulletList items={[
            "Jira — Bidirectional sync: Readiness OS tasks can be created as Jira issues; Jira status changes reflected back in the war room task board.",
            "ServiceNow — Incident creation and status sync for IT-related protocol activations (ransomware, infrastructure failure).",
            "PagerDuty / OpsGenie — Alert escalation integration for on-call stakeholder notification.",
          ]} />

          <H2>CRM & Sales Intelligence</H2>
          <BulletList items={[
            "Salesforce — Deal risk signals from CRM data (deal stage changes, contact silence) can trigger GROWTH & POSITIONING protocols.",
            "HubSpot — Marketing and customer signal ingestion for early detection of brand or customer retention triggers.",
          ]} />

          <H2>HR & Workforce</H2>
          <BulletList items={[
            "Workday — Workforce signal detection: executive departure, headcount threshold triggers, compliance filing deadlines.",
            "Okta — Identity and access management integration for automated user provisioning and deprovisioning.",
          ]} />

          <H2>Cloud & Infrastructure</H2>
          <BulletList items={[
            "AWS CloudWatch — Infrastructure health signals for operational continuity protocols.",
            "Google Workspace / Google Calendar — Calendar-based trigger detection (regulatory deadlines, earnings dates, board meeting cycles).",
          ]} />

          <H2>Configuring an Integration</H2>
          <StepList steps={[
            { n: "1", title: "Navigate to Integration Hub", body: "Go to /integrations. All available integrations are displayed with connection status (Connected, Needs Setup, Available)." },
            { n: "2", title: "Select Integration", body: "Click the integration tile. Review the required permissions and data access scope." },
            { n: "3", title: "Authenticate", body: "Click Connect. You will be redirected to the OAuth flow for the selected service. Authorize with your organizational credentials." },
            { n: "4", title: "Configure Channels", body: "Map the integration to specific protocol domains, war room events, or signal sources. Set which events trigger notifications to this channel." },
            { n: "5", title: "Test", body: "Use the built-in integration test to send a test notification and confirm the connection is working before relying on it in a live activation." },
          ]} />

          <PageBreak />

          {/* ── SECTION 19 ── */}
          <H1 id="s19">19. Glossary</H1>
          <GoldRule />
          <P>The following terms have specific meanings within Readiness OS.</P>

          <Table
            headers={["Term", "Definition"]}
            rows={[
              ["3,600× Execution Head Start", "The ratio expressing 30 days (standard mobilization cycle) compressed to 12 minutes. The canonical label for the platform's core velocity advantage. Never referred to as 'speed advantage.'"],
              ["ADVANCE 2.0", "The closed-loop learning system that turns every activation close-out into protocol improvements, version deltas, and causal hypotheses. Accessed at /advance-intelligence."],
              ["Causal Hypothesis", "A measurable prediction generated by ADVANCE 2.0 after an update is applied to a protocol. Classified as Proven, Disproven, or Pending after a 3-activation measurement window."],
              ["Close-Out Gate", "The formal, 4-field executive action required to close a protocol activation. Captures what held, what failed, timeline, and recommended protocol updates. Triggers the ADVANCE learning loop."],
              ["Commander Brief", "The decision-ready executive summary generated at activation time. Synthesizes signal data, protocol recommendation, budget authorization, and stakeholder readiness into a single authorization document."],
              ["Compound Protocol", "A Readiness Protocol (IDs 181–210) that activates when two or more triggers fire simultaneously. Runs two protocols in parallel on dual-track war rooms."],
              ["Decision Gate", "A structured Yes/No checkpoint within an active protocol. Pauses execution for an executive decision that branches the task sequence based on real-time conditions."],
              ["Debrief Classification", "The automated post-activation classification: Optimization (minor calibration), Mixed-Signal (specific updates needed), or Recovery (substantive revision required)."],
              ["Executive Readiness Score", "A 0–100 composite score combining live signal volume, trigger detections, protocol readiness, and activation performance. Updated continuously."],
              ["IDEA Framework", "The four-phase operating model: Identify (prepare), Detect (monitor), Execute (activate), Advance (learn). All platform features map to one of these four phases."],
              ["JIT Context Banner", "Just-In-Time banner on the Workspace Hub that surfaces active execution context for the logged-in user — tasks requiring action, pending decision gates, and war room status."],
              ["Learning Velocity Index (LVI)", "The composite metric showing the organization's rate of protocol improvement over time. Tracked on the ADVANCE 2.0 dashboard."],
              ["Moat Metric", "The estimated time (in months) it would take a competitor to rebuild the organization's encoded decision logic from scratch. Generated by the ADVANCE 2.0 system."],
              ["Protocol Version Delta", "An immutable record of a specific change to a Readiness Protocol. Stores versionBefore, versionAfter, change type, rationale, and applied date."],
              ["Readiness Protocol", "The fundamental unit of the platform. A pre-staged, fully configured response plan for a specific strategic situation. Contains task sequence, stakeholder tree, budget authorization, Commander Brief template, and decision gates."],
              ["Risk Score", "Derived from the formula √(signal count) × 8. Classified as LOW (<35), MEDIUM (35–74), or HIGH (75+). Drives escalation recommendations."],
              ["Signal", "A single detectable event from an external source (news feed, regulatory API, CRM data, infrastructure monitor) that matches one of the 231 detection thresholds."],
              ["Trigger", "A specific, classifiable detection threshold that indicates a Readiness Protocol should be staged or activated. 231 active detection thresholds across 9 strategic domains are monitored continuously."],
              ["War Room", "The real-time coordination environment launched automatically on protocol activation. Centralizes task tracking, stakeholder coordination, decision logging, and crisis communications generation."],
              ["Weak Signal", "An early-stage signal that does not individually constitute a trigger but in combination with others suggests an emerging situation. Visible on the Foresight Radar and Signal Radar Dashboard."],
            ]}
          />

          {/* Footer */}
          <div style={{ marginTop: 64, paddingTop: 24, borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ ...CG, fontSize: 16, fontWeight: 700, color: NAVY }}>VaughnMartin · Readiness OS</div>
              <div style={{ ...BC, fontSize: 11, color: MUTED, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 }}>Complete User &amp; Product Guide — Confidential</div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => window.print()}
                className="no-print"
                style={{ ...BC, display: 'flex', alignItems: 'center', gap: 6, background: NAVY, border: 'none', color: GOLD, padding: '10px 20px', borderRadius: 2, cursor: 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}
              >
                <Printer size={14} /> Print / Save as PDF
              </button>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
