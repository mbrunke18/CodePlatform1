import { useState, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import PptxGenJS from 'pptxgenjs';
import { jsPDF } from 'jspdf';
import { VaughnMartinLogo } from '@/components/ExecuteIQLogo';

const NAVY = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const GRID_BG: React.CSSProperties = {
  backgroundImage: `linear-gradient(rgba(201,168,76,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.08) 1px, transparent 1px)`,
  backgroundSize: "48px 48px",
};

function SlideLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <div style={{ width: 18, height: 1.5, background: GOLD, opacity: 0.7 }} />
      <span style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.26em", textTransform: "uppercase" as const, color: light ? "rgba(255,255,255,0.5)" : GOLD }}>{children}</span>
      <div style={{ width: 18, height: 1.5, background: GOLD, opacity: 0.7 }} />
    </div>
  );
}

function GoldRule() {
  return <div style={{ width: 40, height: 2, background: GOLD, margin: "20px 0" }} />;
}

// ─── Slide 1: Cover ──────────────────────────────────────────────────────────
function CoverSlide() {
  return (
    <div style={{ ...GRID_BG, background: NAVY_BG, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* orb top-right */}
      <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(43,138,110,0.18) 0%, transparent 70%)`, pointerEvents: "none" }} />
      {/* orb bottom-left */}
      <div style={{ position: "absolute", bottom: -150, left: -150, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(201,168,76,0.13) 0%, transparent 70%)`, pointerEvents: "none" }} />
      {/* Large watermark seal — centered, very low opacity */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.06, pointerEvents: "none" }}>
        <VaughnMartinLogo color="white" height={560} variant="icon-only" />
      </div>

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 820, padding: "0 48px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
          <div style={{ width: 24, height: 1, background: GOLD, opacity: 0.5 }} />
          <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)" }}>a16z SpeedRun 007 · April 2026</span>
          <div style={{ width: 24, height: 1, background: GOLD, opacity: 0.5 }} />
        </div>

        <h1 style={{ ...CG, fontSize: 64, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 28, letterSpacing: "-0.01em" }}>
          The strategic response is ready<br />before the trigger fires.
        </h1>

        <div style={{ width: 56, height: 2, background: GOLD, margin: "0 auto 28px" }} />

        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontWeight: 400, marginBottom: 52, lineHeight: 1.6 }}>
          Coordination infrastructure for the Fortune 1000.
        </p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)", textTransform: "uppercase" as const }}>Martin Brunke</span>
            <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Founder & CEO</span>
            <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 13, color: GOLD, opacity: 0.8 }}>vaughnmartin.com</span>
          </div>
        </div>
      </div>

      {/* bottom wordmark with logo */}
      <div style={{ position: "absolute", bottom: 24, left: 44, opacity: 0.55 }}>
        <VaughnMartinLogo color="white" height={36} variant="full" />
      </div>
      <div style={{ position: "absolute", bottom: 32, right: 48 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>April 2026</span>
      </div>
    </div>
  );
}

// ─── Slide 2: The Problem ─────────────────────────────────────────────────────
function ProblemSlide() {
  const triggers = ["Cyber incidents", "M&A integrations", "Regulatory actions", "Activist campaigns", "Leadership transitions", "Competitive disruptions", "Market opportunity windows", "Supply chain disruptions"];
  return (
    <div style={{ background: "#FFFFFF", width: "100%", height: "100%", display: "flex", position: "relative" }}>
      {/* Left — dark panel with 30-day stat */}
      <div style={{ ...GRID_BG, background: NAVY_BG, width: "38%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "36px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)" }} />
        <SlideLabel light>The Problem</SlideLabel>
        <div style={{ ...CG, fontSize: 96, fontWeight: 700, color: "#FFFFFF", lineHeight: 0.9, marginBottom: 12 }}>30</div>
        <div style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 20 }}>days</div>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, marginBottom: 28 }}>
          to mobilize a response inside the average Fortune 1000 enterprise when a strategic trigger fires.
        </p>
        <GoldRule />
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
          By the time they move, the competitor has acted, the regulator has moved, or the window has closed.
        </p>
        <div style={{ marginTop: 20, padding: "14px 18px", border: `1px solid rgba(201,168,76,0.3)`, background: "rgba(201,168,76,0.06)" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 5 }}>Real-world trigger costs</div>
          <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: "#FFFFFF", lineHeight: 1 }}>$5M – $575M+</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 7, lineHeight: 1.6 }}>
            Equifax breach: $575M settlement · Target cyber: $292M · Boeing 737 MAX: $20B+ · M&A failure avg: $277M destroyed (McKinsey)
          </div>
        </div>
      </div>

      {/* Right — trigger types */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "36px 48px" }}>
        <p style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 20 }}>The Problem</p>
        <h2 style={{ ...CG, fontSize: 34, fontWeight: 600, color: NAVY, lineHeight: 1.15, marginBottom: 16, maxWidth: 540 }}>
          Enterprise work was designed for a world without AI.<br />Nobody redesigned it.
        </h2>
        <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}>
          The 30-day mobilization cycle is not a bug. It is the operating model Fortune 1000 enterprises built before AI existed.
        </p>

        <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 16 }}>Every Fortune 1000 faces multiple triggers per year</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
          {triggers.map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 4, height: 4, background: TEAL, borderRadius: "50%", flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>{t}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "auto", paddingTop: 14, borderTop: `1px solid ${BORDER}` }}>
          <div style={{ ...BC, fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 5 }}>Sources</div>
          <span style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.7 }}>
            McKinsey Global Resilience Report 2025 · Gartner Enterprise Risk Monitor 2025 · Equifax SEC Filing 2019 · Boeing Annual Report 2020
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 3: The Insight ─────────────────────────────────────────────────────
function InsightSlide() {
  return (
    <div style={{ background: OFF, width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "24px 48px" }}>
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <SlideLabel>The Insight</SlideLabel>
        <h2 style={{ ...CG, fontSize: 30, fontWeight: 600, color: NAVY, lineHeight: 1.1, maxWidth: 740, margin: "0 auto" }}>
          Championship football programs close the same gap every Saturday in 40 seconds.
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, flex: 1, width: "100%" }}>
        {/* Fortune 1000 column */}
        <div style={{ border: `1px solid ${BORDER}`, borderRight: "none", background: "#FFFFFF", padding: "20px 30px" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 16 }}>Fortune 1000</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Trigger fires.", body: "The organization spends 30 days figuring out who should be in the room." },
              { label: "Zero preparation.", body: "Building a response from scratch. Every time. For every trigger. Across every domain." },
              { label: "Response begins.", body: "At week four, they're finally in the room. You've been executing for 29 days, 23 hours." },
              { label: "Result:", body: "The window closes before the response begins." },
            ].map((r, i) => (
              <div key={i}>
                <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 3 }}>{r.label}</div>
                <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.55 }}>{r.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Championship Football column */}
        <div style={{ ...GRID_BG, background: NAVY, border: `2px solid ${GOLD}`, padding: "20px 30px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,138,110,0.2) 0%, transparent 70%)" }} />
          <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>Championship Football</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Trigger fires.", body: "The response is already built. Every situation owned. Every role rehearsed at full speed by Thursday." },
              { label: "Pre-staged execution.", body: "40 seconds from signal to coordinated execution across 11 roles." },
              { label: "Immediate deployment.", body: "The response was built during the preparation phase — it deploys in the first seconds." },
              { label: "Result:", body: "The preparation decided Saturday on Tuesday. The window opens and closes on your timeline." },
            ].map((r, i) => (
              <div key={i}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF", marginBottom: 3 }}>{r.label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>{r.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 10 }}>
        <div style={{ display: "inline-block", padding: "9px 28px", background: GOLD, color: NAVY }}>
          <span style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>At week four, they're finally in the room. You've been executing for 29 days, 23 hours.</span>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 4: The Product ─────────────────────────────────────────────────────
function ProductSlide() {
  const phases = [
    { key: "I", name: "IDENTIFY", stat: "248", statLabel: "data points", body: "Monitored every 15 minutes across 9 strategic domains. Nothing is improvised. Everything is pre-staged." },
    { key: "D", name: "DETECT", stat: "221", statLabel: "triggers", body: "Pattern recognition surfaces classified signals before peak pressure. Pre-wired to every strategic domain." },
    { key: "E", name: "EXECUTE", stat: "170", statLabel: "Readiness Protocols", body: "Pre-staged protocols deploy in 12 minutes — team, tasks, communications, decision rights." },
    { key: "A", name: "ADVANCE", stat: "100%+", statLabel: "net retention", body: "Close-out gate encodes learning. By activation 12, the Readiness Protocol is organization-authored — the mechanism behind net retention above 100%." },
  ];
  return (
    <div style={{ ...GRID_BG, background: NAVY_BG, width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "28px 52px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -200, right: -200, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,138,110,0.15) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: -200, left: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <SlideLabel light>The Product</SlideLabel>
          <h2 style={{ ...CG, fontSize: 36, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 6 }}>
            We didn't add AI to the old model.<br />We redesigned how strategic work flows.
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", maxWidth: 600, margin: "0 auto" }}>
            Readiness OS is the operating model above the AI stack every enterprise already owns.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginBottom: 10 }}>
          {phases.map((p, i) => (
            <div key={i} style={{ background: i === 0 ? "rgba(255,255,255,0.06)" : i === 3 ? "rgba(43,138,110,0.15)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderTop: `2px solid ${i === 3 ? TEAL : GOLD}`, padding: "18px 18px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 10 }}>
                <span style={{ ...BC, fontSize: 26, fontWeight: 900, color: GOLD, lineHeight: 1 }}>{p.key}</span>
                <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", paddingBottom: 2 }}>{p.name}</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>{p.stat}</div>
                <div style={{ ...BC, fontSize: 8, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: GOLD, marginTop: 2 }}>{p.statLabel}</div>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{p.body}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 6 }}>
          {["GROWTH & POSITIONING", "RISK & RESILIENCE", "TRANSFORMATION"].map((d, i) => (
            <div key={i} style={{ padding: "9px 14px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", textAlign: "center" }}>
              <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.11em", color: i === 0 ? GOLD : i === 1 ? TEAL : "rgba(255,255,255,0.5)" }}>{d}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
          <div style={{ padding: "10px 14px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", textAlign: "center" }}>
            <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.11em", color: GOLD }}>30 DAYS → 12 MINUTES</span>
          </div>
          <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
            <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.11em", color: "rgba(255,255,255,0.7)" }}>3,600× EXECUTION HEAD START</span>
          </div>
          <div style={{ padding: "10px 14px", background: "rgba(43,138,110,0.1)", border: "1px solid rgba(43,138,110,0.25)", textAlign: "center" }}>
            <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.11em", color: TEAL }}>ABOVE YOUR MICROSOFT STACK</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 5: Platform Depth ──────────────────────────────────────────────────
function PlatformDepthSlide() {
  const HUB_CX = 480;
  const HUB_CY = 222;
  const HUB_R = 68;
  const SPOKE_R = 152;
  const CARD_W = 168;
  const CARD_H = 72;
  const spokes = [
    { angle: -90, label: "Command Tower", outcome: "Leadership never operates blind", color: TEAL },
    { angle: -18, label: "Executive War Room", outcome: "Response teams assemble at trigger point", color: GOLD },
    { angle: 54,  label: "Shadow Simulator", outcome: "Rehearse before the pressure arrives", color: TEAL },
    { angle: 126, label: "Regulatory Calendar", outcome: "Zero compliance surprises — ever", color: GOLD },
    { angle: 198, label: "Integration Hub", outcome: "Runs on the Microsoft stack you already own", color: "#6B7280" },
  ];
  return (
    <div style={{ background: OFF, width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "28px 40px 16px" }}>
      <div style={{ marginBottom: 10 }}>
        <SlideLabel>Platform Depth</SlideLabel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <h2 style={{ ...CG, fontSize: 27, fontWeight: 600, color: NAVY, lineHeight: 1.15 }}>
            One score. Five systems. One platform for executive authority.
          </h2>
          <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#9CA3AF", flexShrink: 0, marginLeft: 16 }}>170 PROTOCOLS · 221 TRIGGERS</span>
        </div>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        {/* Spoke connector lines */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>
          {spokes.map((s, i) => {
            const rad = s.angle * Math.PI / 180;
            const sx = HUB_CX + Math.cos(rad) * HUB_R;
            const sy = HUB_CY + Math.sin(rad) * HUB_R;
            const ex = HUB_CX + Math.cos(rad) * (SPOKE_R - CARD_W / 2 + 6);
            const ey = HUB_CY + Math.sin(rad) * (SPOKE_R - CARD_H / 2 + 6);
            return <line key={i} x1={sx} y1={sy} x2={ex} y2={ey} stroke={s.color} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 3" />;
          })}
        </svg>

        {/* Hub — Readiness Score */}
        <div style={{
          position: "absolute",
          left: HUB_CX - HUB_R,
          top: HUB_CY - HUB_R,
          width: HUB_R * 2,
          height: HUB_R * 2,
          borderRadius: "50%",
          background: NAVY,
          border: `2.5px solid ${GOLD}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          zIndex: 10,
          boxShadow: "0 0 0 8px rgba(201,168,76,0.08)",
        }}>
          <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: GOLD, lineHeight: 1 }}>0–100</div>
          <div style={{ ...BC, fontSize: 6.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)", marginTop: 5, textAlign: "center" as const, lineHeight: 1.5 }}>EXECUTIVE<br/>READINESS SCORE</div>
        </div>

        {/* Spoke cards */}
        {spokes.map((s, i) => {
          const rad = s.angle * Math.PI / 180;
          const cx = HUB_CX + Math.cos(rad) * SPOKE_R;
          const cy = HUB_CY + Math.sin(rad) * SPOKE_R;
          return (
            <div key={i} style={{
              position: "absolute",
              left: cx - CARD_W / 2,
              top: cy - CARD_H / 2,
              width: CARD_W,
              height: CARD_H,
              background: "#FFFFFF",
              border: `1px solid ${BORDER}`,
              borderTop: `2px solid ${s.color}`,
              padding: "10px 14px",
              display: "flex", flexDirection: "column", justifyContent: "center",
              zIndex: 10,
            }}>
              <div style={{ ...BC, fontSize: 7.5, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: s.color, marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: NAVY, lineHeight: 1.4 }}>{s.outcome}</div>
            </div>
          );
        })}

        {/* Bottom strip */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 18px", background: `rgba(10,15,46,0.05)`, border: `1px solid rgba(10,15,46,0.08)`, textAlign: "center" as const }}>
          <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: NAVY }}>151 PAGES · LIVE IN PRODUCTION AT VAUGHNMARTIN.COM · NOT A PROTOTYPE</span>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 6: Independent Validation ─────────────────────────────────────────
function ValidationSlide() {
  const researchers = [
    {
      initials: "KH",
      name: "Dr. Kerry Huang",
      credentials: "Fortune 50 AVP · ESI Top 1% Researcher · Forbes Business Council · 408-firm governance study",
      color: TEAL,
      quote: "\"Martin is building the architecture that makes clarity possible before pressure arrives. The boundary Martin named — between what architecture can supply and what only human capacity can carry — is where the next decade of governance work sits.\"",
      source: "Public LinkedIn repost, April 2026",
    },
    {
      initials: "SD",
      name: "Scott DeJarnette, PhD",
      credentials: "Cybersecurity Strategist · CIO Advisor · Triple CCIE · Incident Response · M&A Integration",
      color: NAVY,
      quote: "\"Coordination speed is a precommitment problem, not a communication problem. The organization did not execute a plan. It assembled one under stress.\"",
      source: "Independent assessment",
    },
    {
      initials: "JH",
      name: "Jim Highsmith",
      credentials: "Co-author, Agile Manifesto · 40+ years of management thinking",
      color: GOLD,
      quote: "\"Process ran the last era. Judgment runs the next. The cycle reinforces itself until the organization needs judgment that is no longer there.\"",
      source: "Independent assessment",
    },
    {
      initials: "KS",
      name: "Dr. Kulneet Suri",
      credentials: "Harvard Alumna · Oxford Research Reviewer · Applied Behavioral Scientist",
      color: "#6B7280",
      quote: "\"Control produces compliance. Capability produces ownership. Performative governance is more dangerous than no governance at all.\"",
      source: "Independent assessment",
    },
  ];
  return (
    <div style={{ background: OFF, width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "16px 48px" }}>
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <SlideLabel>Independent Validation · April 2026</SlideLabel>
        <h2 style={{ ...CG, fontSize: 26, fontWeight: 600, color: NAVY, lineHeight: 1.1, marginBottom: 2 }}>
          Four researchers. Four disciplines. One conclusion.
        </h2>
        <p style={{ fontSize: 12, color: "#6B7280" }}>That does not happen with a weak thesis.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, flex: 1 }}>
        {researchers.map((r, i) => (
          <div key={i} style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderTop: `3px solid ${r.color}`, padding: "11px 16px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: r.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ ...BC, fontSize: 11, fontWeight: 800, color: r.color === GOLD ? NAVY : "#FFFFFF", letterSpacing: "0.06em" }}>{r.initials}</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 1 }}>{r.name}</div>
                <div style={{ fontSize: 9, color: "#9CA3AF", lineHeight: 1.4 }}>{r.credentials}</div>
              </div>
            </div>
            <p style={{ ...CG, fontSize: 12, fontStyle: "italic", color: "#374151", lineHeight: 1.5, flex: 1 }}>{r.quote}</p>
            <div style={{ ...BC, fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9CA3AF", marginTop: 6 }}>{r.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 6: Why Now ─────────────────────────────────────────────────────────
function WhyNowSlide() {
  const reasons = [
    {
      label: "Decision Density",
      headline: "The bottleneck shifted from speed to calibration.",
      body: "AI has simultaneously increased decision density and arrival speed for every Fortune 1000. Executives face more consequential decisions, faster, with less preparation time than any prior era. The bottleneck is no longer speed. It is calibration.",
      stat: "+47%", statLabel: "task scope increase with AI (McKinsey Global Institute, 2025)",
      color: TEAL,
    },
    {
      label: "The Microsoft Gap",
      headline: "Every enterprise has the AI stack. None have the operating model.",
      body: "Every Fortune 1000 has the Microsoft AI stack live. Copilot, Azure, Teams, M365. None have the operating model to use it at the speed it now operates. Readiness OS is the layer above your Microsoft investment — the architecture that turns AI capability into AI action.",
      stat: "0%", statLabel: "of enterprises have the coordination layer",
      color: GOLD,
    },
    {
      label: "Category Window",
      headline: "No category leader exists. The window is 18 months.",
      body: "No category leader exists for strategic coordination infrastructure. The window for category ownership is 18 months. We are already in it.",
      stat: "18mo", statLabel: "to define the category",
      color: NAVY,
    },
  ];
  return (
    <div style={{ ...GRID_BG, background: NAVY_BG, width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "28px 48px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -200, left: "30%", width: 800, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(43,138,110,0.12) 0%, transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <SlideLabel light>Why Now</SlideLabel>
          <h2 style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.1 }}>
            AI did not create our product.<br />AI created the market for our product.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, flex: 1 }}>
          {reasons.map((r, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderTop: `3px solid ${r.color}`, padding: "20px 20px", display: "flex", flexDirection: "column" }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: r.color, marginBottom: 10 }}>{r.label}</div>
              <h3 style={{ ...CG, fontSize: 20, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.2, marginBottom: 10 }}>{r.headline}</h3>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, flex: 1 }}>{r.body}</p>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: r.color, lineHeight: 1 }}>{r.stat}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{r.statLabel}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, padding: "11px 20px", background: "rgba(255,255,255,0.04)", borderLeft: `3px solid rgba(201,168,76,0.5)` }}>
          <p style={{ ...CG, fontSize: 14, fontStyle: "italic", color: "rgba(255,255,255,0.55)" }}>
            Jim Highsmith, co-author of the Agile Manifesto: "Process ran the last era. Judgment runs the next."
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 8: The Market ─────────────────────────────────────────────────────
function MarketSlide() {
  return (
    <div style={{ background: "#FFFFFF", width: "100%", height: "100%", display: "flex", position: "relative" }}>
      {/* Left — bottom-up land-and-expand model */}
      <div style={{ ...GRID_BG, background: NAVY_BG, width: "45%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "36px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)" }} />
        <SlideLabel light>The Market</SlideLabel>

        {/* Land → Expand → Compound stages */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 16 }}>
          {[
            { stage: "LAND", acv: "$75K ACV", detail: "3 domains · 60 protocols · pilot scope", color: GOLD },
            { stage: "EXPAND", acv: "$150–250K ACV", detail: "Full platform · 170 protocols · 12–18 months post-land", color: TEAL },
            { stage: "COMPOUND", acv: "NRR 100%+", detail: "Org-encoded intelligence · Ownership Close-Out Gate", color: "rgba(255,255,255,0.5)" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "9px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: `3px solid ${s.color}` }}>
              <div style={{ flexShrink: 0, width: 72 }}>
                <div style={{ ...BC, fontSize: 7.5, fontWeight: 800, letterSpacing: "0.14em", color: s.color }}>{s.stage}</div>
                <div style={{ ...CG, fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginTop: 2 }}>{s.acv}</div>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, paddingTop: 2 }}>{s.detail}</div>
            </div>
          ))}
        </div>

        {/* Realistic 3-year ARR path */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Realistic 3-Year ARR Path</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { yr: "Yr 1", math: "8 accounts × $87K avg", arr: "~$700K ARR", note: "3 founding pilots + 5 new lands" },
              { yr: "Yr 2", math: "18 accounts × $140K avg", arr: "~$2.5M ARR", note: "expand momentum + new lands" },
              { yr: "Yr 3", math: "38 accounts × $165K avg", arr: "~$6.3M ARR", note: "7% F1000 penetration" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 0, paddingBottom: 4, borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ ...BC, fontSize: 8, fontWeight: 800, color: GOLD, width: 28 }}>{r.yr}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", flex: 1 }}>{r.math}</div>
                <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: "#FFFFFF", marginRight: 6 }}>{r.arr}</div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)" }}>({r.note})</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "10px 14px", border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.07)" }}>
          <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 2 }}>Long-term TAM</div>
          <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>$5B+</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>Global strategic coordination infrastructure · 537 US F1000 + 400 global + PE mid-market</div>
        </div>
      </div>

      {/* Right — Microsoft distribution wedge */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "44px 44px" }}>
        <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 14 }}>The Distribution Wedge</div>
        <h3 style={{ ...CG, fontSize: 28, fontWeight: 600, color: NAVY, lineHeight: 1.2, marginBottom: 16 }}>
          Every Fortune 1000 has Microsoft's AI stack.<br />None have the operating model to use it.
        </h3>
        <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, marginBottom: 18 }}>
          Copilot, Azure, Teams, M365 — live in every Fortune 1000. The coordination layer above that investment doesn't exist. Readiness OS is that layer. Every Microsoft enterprise partner conversation leads here.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
          {[
            "Microsoft Teams — protocol activation notifications live",
            "Azure AD / Entra — SSO across the enterprise",
            "Copilot Studio — signal analysis and summarization layer",
            "SharePoint / M365 — documentation staging and distribution",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div style={{ width: 4, height: 4, background: TEAL, borderRadius: "50%", flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontSize: 12, color: NAVY, fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 18px", background: `rgba(43,138,110,0.06)`, border: `1px solid rgba(43,138,110,0.2)`, borderLeft: `3px solid ${TEAL}` }}>
          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>
            <strong style={{ color: NAVY }}>Category:</strong> Strategic Coordination Infrastructure — no category leader exists. The window to define it is 18 months. We are already in it.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 9: The Moat ────────────────────────────────────────────────────────
function MoatSlide() {
  const moats = [
    {
      num: "01",
      title: "20 years of Fortune 1000 decision logic",
      body: "170 Readiness Protocols encoding operational decision architecture from Ford, Toyota, Lockheed Martin, Charles Schwab, Vantiv/Worldpay, Boyd Gaming, and Churchill Downs Incorporated. A competitor cannot buy the twenty years.",
      note: "Cannot be replicated with capital or compute",
    },
    {
      num: "02",
      title: "Compounding organizational intelligence",
      body: "Every activation encodes failure modes and decision preferences via the Ownership Close-Out Gate. Transfer rate ≥70% = Confirmed. <35% = Silence Detected. Built from Dr. Huang's 408-firm governance research. After 12 activations, no two organizations produce the same platform — the mechanism behind net retention above 100%.",
      note: "Ownership Close-Out Gate shipped April 2026",
    },
    {
      num: "03",
      title: "Embeddedness in the preparation rhythm",
      body: "When Readiness OS becomes the organizational rhythm of Fortune 1000 strategic preparation, it is not a vendor relationship. It is infrastructure. Infrastructure does not get replaced.",
      note: "Not a tool. An operating model.",
    },
  ];
  return (
    <div style={{ background: "#FFFFFF", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "20px 52px", overflow: "hidden" }}>
      <div style={{ marginBottom: 12 }}>
        <SlideLabel>The Moat</SlideLabel>
        <h2 style={{ ...CG, fontSize: 28, fontWeight: 600, color: NAVY, lineHeight: 1.1, maxWidth: 720 }}>
          A competitor can rebuild the software in 12 months.<br />They cannot rebuild any of these.
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {moats.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 22, padding: "13px 20px", border: `1px solid ${BORDER}`, borderLeft: `3px solid ${i === 0 ? GOLD : i === 1 ? TEAL : NAVY}`, background: "#FAFAF9", flex: 1, overflow: "hidden" }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ ...BC, fontSize: 26, fontWeight: 900, color: i === 0 ? GOLD : i === 1 ? TEAL : NAVY, lineHeight: 1, opacity: 0.25 }}>{m.num}</div>
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 5 }}>{m.title}</h3>
              <p style={{ fontSize: 10.5, color: "#374151", lineHeight: 1.6, marginBottom: 5 }}>{m.body}</p>
              <div style={{ ...BC, fontSize: 8.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9CA3AF" }}>{m.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 8: The Model ───────────────────────────────────────────────────────
function ModelSlide() {
  const growthTiers = [
    { name: "READY", price: "$75K/yr", scope: "3 domains · 60 Readiness Protocols" },
    { name: "RESPONSIVE", price: "$150K/yr", scope: "6 domains · 120 Readiness Protocols" },
    { name: "ORCHESTRATED", price: "$250K/yr", scope: "Full platform · 170 Readiness Protocols" },
  ];
  return (
    <div style={{ background: OFF, width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "24px 48px" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <SlideLabel>The Model</SlideLabel>
        <h2 style={{ ...CG, fontSize: 30, fontWeight: 600, color: NAVY, lineHeight: 1.1 }}>
          One platform. Two deployment paths.<br />No per-seat pricing.
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1 }}>
        {/* Enterprise Pilot */}
        <div style={{ ...GRID_BG, background: NAVY, padding: "22px 28px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)" }} />
          <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
            <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Enterprise Pilot · Fortune 1000</div>
            <div style={{ ...CG, fontSize: 40, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 3 }}>$75K</div>
            <div style={{ ...BC, fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>FLAT FEE · 90-DAY DEPLOYMENT</div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 8 }}>Delivers</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {["Full platform across selected domains", "Signal pipeline live — 248 data points", "Readiness Protocol library activated", "Executive team trained"].map(d => (
                  <div key={d} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 3, height: 3, background: TEAL, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 6 }}>Converts to</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Annual license at $150K–$250K/yr based on scope</div>
              <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}>
                <div style={{ fontSize: 10, color: GOLD, fontWeight: 600 }}>3 pilot targets identified · Outreach initiating · No signed LOI</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Gaming · Finance · Manufacturing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Deployment */}
        <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, padding: "22px 28px", display: "flex", flexDirection: "column" }}>
          <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 14 }}>Growth Deployment · PE-Backed & Mid-Market</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            {growthTiers.map((t, i) => (
              <div key={i} style={{ padding: "14px 18px", border: `1px solid ${BORDER}`, borderLeft: `3px solid ${i === 2 ? TEAL : i === 1 ? GOLD : NAVY}`, background: i === 2 ? `rgba(43,138,110,0.03)` : "#FAFAF9" }}>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ ...BC, fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", color: NAVY, paddingBottom: 2 }}>{t.name}</div>
                  <div style={{ ...CG, fontSize: 20, fontWeight: 700, color: i === 2 ? TEAL : NAVY }}>{t.price}</div>
                </div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{t.scope}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, padding: "12px 16px", background: OFF, border: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.55 }}>
              Priced on deployment scope. The platform covers the organization or it doesn't. No per-seat pricing at any tier.
            </p>
          </div>
        </div>
      </div>

      {/* Unit Economics strip */}
      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 2 }}>
        {[
          { label: "Pilot ACV", value: "$75K", note: "Self-liquidating CAC — pilot fee covers activation" },
          { label: "Year 2+ ACV", value: "$150–250K", note: "Expansion to full platform after proof" },
          { label: "5-Year LTV", value: "$1.25M+", note: "Per Fortune 1000 account at $250K × 5 years" },
          { label: "Target NRR", value: "100%+", note: "Org-encoded intelligence drives expansion, not churn" },
        ].map(u => (
          <div key={u.label} style={{ padding: "8px 12px", background: `rgba(10,15,46,0.05)`, border: `1px solid rgba(10,15,46,0.1)` }}>
            <div style={{ ...BC, fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 2 }}>{u.label}</div>
            <div style={{ ...CG, fontSize: 17, fontWeight: 700, color: NAVY }}>{u.value}</div>
            <div style={{ fontSize: 8.5, color: "#6B7280", lineHeight: 1.4, marginTop: 2 }}>{u.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 9: Traction ────────────────────────────────────────────────────────
function TractionSlide() {
  const productMetrics = [
    "Live in production — 151 pages, fully operational at vaughnmartin.com",
    "170 Readiness Protocols · 221 triggers · 248 signal data points · 15-min cycles",
    "Command Tower · War Room · Shadow Simulator · Readiness Score · Regulatory Calendar",
    "7 Microsoft-stack integrations · 6 industry sector packs · 3 strategic domains",
    "12-Minute Test Drive — public funnel. Any VC can run it before the meeting ends.",
  ];
  const pipeline = [
    {
      stageBadge: "IDENTIFICATION",
      badgeColor: NAVY,
      stage: "Fortune 1000 Targets",
      count: "15+",
      color: NAVY,
      sub: "Gaming · Finance · Manufacturing · Retail · Energy",
    },
    {
      stageBadge: "INITIAL OUTREACH",
      badgeColor: GOLD,
      stage: "Founding Partner Pilot Targets",
      count: "3",
      color: GOLD,
      sub: "5K–50K employees · Profile aligned · Outreach initiating · No LOI",
    },
    {
      stageBadge: "STAGE 1 GATE",
      badgeColor: TEAL,
      stage: "Target ACV at Pilot Close",
      count: "$225K",
      color: TEAL,
      sub: "$75K per pilot · No signed revenue yet · SpeedRun closes this gap",
    },
  ];
  return (
    <div style={{ background: "#FFFFFF", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "22px 48px" }}>
      <div style={{ marginBottom: 12 }}>
        <SlideLabel>Traction</SlideLabel>
        <h2 style={{ ...CG, fontSize: 28, fontWeight: 600, color: NAVY, lineHeight: 1.1 }}>
          Platform built. Thesis validated. Pilots are the gap SpeedRun closes.
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1 }}>
        {/* Left: Product + Pipeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ flexShrink: 0, border: `1px solid ${BORDER}`, padding: "8px 14px" }}>
            <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 5 }}>What's Built</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {productMetrics.map(m => (
                <div key={m} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                  <div style={{ width: 3, height: 3, background: TEAL, flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontSize: 10, color: "#374151", lineHeight: 1.35 }}>{m}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0, border: `1px solid ${BORDER}`, padding: "10px 14px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 7 }}>Enterprise Pipeline · Pilot Status</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
              {pipeline.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "7px 10px", background: "#FAFAF9", border: `1px solid ${BORDER}`, borderLeft: `3px solid ${p.color}`, alignItems: "center" }}>
                  <div style={{ flexShrink: 0, minWidth: 62, textAlign: "right" as const }}>
                    <div style={{ ...CG, fontSize: 19, fontWeight: 700, color: p.color, lineHeight: 1 }}>{p.count}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <div style={{ ...BC, fontSize: 7, fontWeight: 800, letterSpacing: "0.1em", color: p.badgeColor, background: `rgba(10,15,46,0.06)`, padding: "1px 5px", borderRadius: 1 }}>{p.stageBadge}</div>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: NAVY, marginBottom: 1 }}>{p.stage}</div>
                    <div style={{ fontSize: 9, color: "#6B7280", lineHeight: 1.35, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 5, padding: "5px 8px", background: "rgba(10,15,46,0.03)", border: `1px solid rgba(10,15,46,0.07)` }}>
              <span style={{ fontSize: 8.5, color: "#9CA3AF" }}>4 independent researchers · Kerry Huang Fortune 50 network repost · 5 Fortune 500 advisors</span>
            </div>
          </div>
        </div>

        {/* Right: Why a16z — simplified */}
        <div style={{ ...GRID_BG, background: NAVY_BG, padding: "22px 26px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)" }} />
          <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>Why a16z · Not Just Any Program</div>

            <div style={{ ...CG, fontSize: 22, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.2, marginBottom: 12 }}>
              12 weeks to close what the platform cannot close alone.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {[
                { head: "Enterprise introduction velocity", body: "Fortune 1000 CXO access the a16z portfolio provides cannot be bought with capital alone." },
                { head: "Category-defining signal", body: "a16z backing names the 'Strategic Coordination Infrastructure' category before anyone else does." },
                { head: "Commercial co-founder catalyst", body: "SpeedRun is the structural moment to bring on the equity-based commercial co-founder vetting is already underway for." },
              ].map((u, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "9px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: `2px solid rgba(201,168,76,0.4)` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF", marginBottom: 3 }}>{u.head}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{u.body}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, padding: "9px 14px", border: `1px solid rgba(255,255,255,0.1)`, background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>
                <strong style={{ color: "rgba(255,255,255,0.65)" }}>What isn't done yet:</strong> No signed pilot. No signed LOI. SpeedRun closes the commercial gap the platform cannot close alone.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 10: The Founder ────────────────────────────────────────────────────
function FounderSlide() {
  const fortune1000 = ["Ford Motor Company", "Toyota", "Lockheed Martin", "Charles Schwab", "Vantiv / Worldpay", "Boyd Gaming", "Churchill Downs Incorporated"];
  return (
    <div style={{ background: "#FFFFFF", width: "100%", height: "100%", display: "flex", position: "relative" }}>
      {/* Left — dark panel */}
      <div style={{ ...GRID_BG, background: NAVY, width: "42%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "36px 44px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -100, right: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,138,110,0.2) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <SlideLabel light>The Founder</SlideLabel>
          <div style={{ ...CG, fontSize: 42, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 6 }}>Martin Brunke</div>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 18 }}>Founder, CEO & Chief Architect · VaughnMartin</div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Fortune 1000 · 20 Years</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {fortune1000.map(c => (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 3, height: 3, background: TEAL, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>Major College Football · 5 Years</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              Coaching at Stanford. The practice field where preparation architecture compressed 30-day organizational decisions into 40 seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Right — the pattern */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "36px 48px" }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 12 }}>The Pattern</div>
        <h3 style={{ ...CG, fontSize: 23, fontWeight: 600, color: NAVY, lineHeight: 1.15, marginBottom: 10 }}>
          Same coordination failure across 7 industries. Same solution already proven on the practice field.
        </h3>
        <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 10 }}>
          The infrastructure nobody built for the boardroom.
        </p>

        <div style={{ padding: "12px 18px", background: OFF, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, marginBottom: 12 }}>
          <p style={{ ...CG, fontSize: 15, fontStyle: "italic", color: NAVY, lineHeight: 1.5 }}>
            "VaughnMartin is named for my father, Vaughn. The product carries his standard."
          </p>
          <div style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#9CA3AF", marginTop: 6 }}>Martin Brunke</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
          {[
            { label: "Fortune 1000 experience", value: "20 yrs" },
            { label: "Industries spanned", value: "7" },
            { label: "Stanford football", value: "5 yrs" },
            { label: "Protocols encoded", value: "170" },
          ].map(s => (
            <div key={s.label} style={{ padding: "8px 14px", border: `1px solid ${BORDER}`, background: "#FFFFFF" }}>
              <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Team composition — de-risk the solo narrative */}
        <div style={{ border: `1px solid ${BORDER}`, padding: "10px 14px" }}>
          <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 10 }}>Team Composition</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[
              { role: "Founder, CEO & Chief Architect", name: "Martin Brunke — builder, architect, 20-yr operator", status: "NOW" },
              { role: "Commercial Co-Founder", name: "Fortune 1000 sales DNA · CXO access required", status: "RECRUITING" },
              { role: "Strategic Communications Lead", name: "Enterprise narrative, media access, thought leadership", status: "IN NETWORK" },
            ].map(t => (
              <div key={t.role} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: NAVY }}>{t.role} </span>
                  <span style={{ fontSize: 10, color: "#6B7280" }}>— {t.name}</span>
                </div>
                <span style={{ ...BC, fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: t.status === "NOW" ? TEAL : t.status === "IN NETWORK" ? GOLD : "#9CA3AF", flexShrink: 0 }}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 11: Close ──────────────────────────────────────────────────────────
function CloseSlide() {
  return (
    <div style={{ ...GRID_BG, background: NAVY_BG, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,138,110,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 860, padding: "0 48px" }}>
        {/* Seal above the headline */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <VaughnMartinLogo color="white" height={80} variant="icon-only" />
        </div>

        <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>Preparation · Readiness · Fearless</div>

        <h1 style={{ ...CG, fontSize: 68, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.05, marginBottom: 24, letterSpacing: "-0.01em" }}>
          We make enterprises<br />
          <span style={{ color: GOLD }}>fearless.</span>
        </h1>

        <div style={{ width: 56, height: 2, background: GOLD, margin: "0 auto 32px" }} />

        <p style={{ ...CG, fontSize: 22, fontStyle: "italic", color: "rgba(255,255,255,0.65)", marginBottom: 52, lineHeight: 1.5 }}>
          The strategic response is ready before the trigger fires.
        </p>

        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)", textTransform: "uppercase" as const }}>Martin Brunke</span>
            <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Founder & CEO</span>
          </div>
          <a href="mailto:pilot@vaughnmartin.com" style={{ fontSize: 14, color: GOLD, textDecoration: "none", opacity: 0.9 }}>pilot@vaughnmartin.com</a>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>vaughnmartin.com · April 2026</span>
        </div>
      </div>
    </div>
  );
}

// ─── Slide: Live Product Screenshot ──────────────────────────────────────────
function LiveProductSlide() {
  const stats = [
    { value: "221", label: "Triggers Armed", color: GOLD },
    { value: "248", label: "Signal Data Points", color: GOLD },
    { value: "170", label: "Protocols Ready", color: TEAL },
    { value: "15 min", label: "Scan Cycle", color: TEAL },
    { value: "9 / 9", label: "Domains Monitored", color: "rgba(255,255,255,0.6)" },
  ];
  return (
    <div style={{ background: "#020816", width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      {/* Top label strip */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 28px 8px", borderBottom: "1px solid rgba(201,168,76,0.3)", background: "rgba(2,8,22,0.97)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 18, height: 1.5, background: GOLD, opacity: 0.7 }} />
          <span style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.26em", textTransform: "uppercase" as const, color: GOLD }}>Live Product</span>
          <div style={{ width: 18, height: 1.5, background: GOLD, opacity: 0.7 }} />
        </div>
        <div style={{ ...CG, fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>
          Command Tower — live at vaughnmartin.com
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: TEAL, boxShadow: `0 0 8px ${TEAL}` }} />
          <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: TEAL }}>LIVE · AUTO-REFRESHING</span>
        </div>
      </div>

      {/* Screenshot — clean, no overlays */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <img
          src="/deck-assets/command-tower.jpg"
          alt="Command Tower live view"
          crossOrigin="anonymous"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top left", display: "block" }}
        />
        {/* Bottom gradient so stat bar reads cleanly */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 65%, rgba(2,8,22,0.88) 100%)", pointerEvents: "none" }} />
      </div>

      {/* Stat bar — below image, no overlays on screenshot */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 28px", background: "rgba(2,8,22,0.97)", borderTop: `1px solid rgba(201,168,76,0.2)` }}>
        <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)" }}>THE PLATFORM IS NOT A PROTOTYPE. THIS IS PRODUCTION.</span>
        <div style={{ display: "flex", gap: 24 }}>
          {stats.map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "flex-end", gap: 5 }}>
              <span style={{ ...BC, fontSize: 11, fontWeight: 800, color: s.color }}>{s.value}</span>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide: Platform in Action ────────────────────────────────────────────────
function PlatformInActionSlide() {
  const signals = [
    { label: "Activist Campaign", score: 84, level: "HIGH", color: "#EF4444" },
    { label: "Regulatory Inquiry", score: 71, level: "MED", color: GOLD },
    { label: "Supply Chain Disruption", score: 63, level: "MED", color: GOLD },
    { label: "M&A Integration Signal", score: 41, level: "LOW", color: TEAL },
  ];
  const tasks = [
    { role: "General Counsel", task: "Legal hold initiated", done: true },
    { role: "CFO", task: "Financial exposure memo", done: true },
    { role: "CHRO", task: "Comms cascade prepared", done: false },
    { role: "CRO", task: "Stakeholder brief staged", done: false },
  ];
  return (
    <div style={{ background: "#FFFFFF", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "20px 44px" }}>
      <div style={{ marginBottom: 12 }}>
        <SlideLabel>Platform in Action</SlideLabel>
        <h2 style={{ ...CG, fontSize: 24, fontWeight: 600, color: NAVY, lineHeight: 1.1 }}>
          Command Tower · Live Signal Detection · War Room Activation
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, flex: 1 }}>
        {/* Panel 1: Command Tower */}
        <div style={{ background: NAVY, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: "0.15rem", padding: "14px 16px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ ...BC, fontSize: 8, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: GOLD }}>Command Tower</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>LIVE</span>
            </div>
          </div>
          <div style={{ marginBottom: 8, padding: "8px 10px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>READINESS SCORE</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
              <span style={{ ...CG, fontSize: 32, fontWeight: 700, color: GOLD, lineHeight: 1 }}>78</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", paddingBottom: 3 }}>/100 · READY</span>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 2 }}>Live Signals · 248 monitored</div>
            {signals.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 8px", background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.06)` }}>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.65)" }}>{s.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 36, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 1, overflow: "hidden" }}>
                    <div style={{ width: `${s.score}%`, height: "100%", background: s.color }} />
                  </div>
                  <span style={{ ...BC, fontSize: 7, fontWeight: 700, color: s.color, width: 20, textAlign: "right" as const }}>{s.level}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, padding: "6px 8px", background: "rgba(43,138,110,0.12)", border: "1px solid rgba(43,138,110,0.3)", textAlign: "center" as const }}>
            <span style={{ fontSize: 8, color: TEAL, fontWeight: 600 }}>1 PROTOCOL READY TO ACTIVATE</span>
          </div>
        </div>

        {/* Panel 2: War Room */}
        <div style={{ background: OFF, border: `1px solid ${BORDER}`, borderTop: `2px solid ${TEAL}`, borderRadius: "0.15rem", padding: "14px 16px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ ...BC, fontSize: 8, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: TEAL }}>Executive War Room</span>
            <span style={{ fontSize: 8, color: "#9CA3AF" }}>Activist Campaign ·  Protocol #47</span>
          </div>
          <div style={{ padding: "6px 10px", background: "#FFFFFF", border: "1px solid #E5E7EB", marginBottom: 8 }}>
            <div style={{ fontSize: 8, color: "#9CA3AF", marginBottom: 2 }}>TIME TO EXECUTION</div>
            <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY }}>11:42</div>
            <div style={{ fontSize: 7, color: TEAL }}>of 12:00 target — on pace</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 2 }}>Task Ownership</div>
            {tasks.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 8px", background: "#FFFFFF", border: "1px solid #F3F4F6" }}>
                <div>
                  <div style={{ fontSize: 8, fontWeight: 600, color: NAVY }}>{t.role}</div>
                  <div style={{ fontSize: 7, color: "#9CA3AF" }}>{t.task}</div>
                </div>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: t.done ? TEAL : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {t.done && <span style={{ fontSize: 7, color: "#fff", fontWeight: 700 }}>✓</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, padding: "6px 10px", background: "rgba(10,15,46,0.04)", border: "1px solid rgba(10,15,46,0.08)", textAlign: "center" as const }}>
            <span style={{ fontSize: 7, color: NAVY, fontWeight: 600 }}>OWNERSHIP CLOSE-OUT GATE: 2/4 CONFIRMED</span>
          </div>
        </div>

        {/* Panel 3: 12-Minute Test Drive + Protocols */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ flex: 1, background: NAVY_BG, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.15rem", padding: "14px 16px", display: "flex", flexDirection: "column" }}>
            <span style={{ ...BC, fontSize: 8, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 8, display: "block" }}>Readiness Protocol · #47</span>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>ACTIVIST CAMPAIGN RESPONSE</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
              {["Board brief — pre-staged", "Legal response framework — staged", "Proxy advisor outreach — queued", "Shareholder letter — templated", "Media holding statement — live"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0" }}>
                  <div style={{ width: 3, height: 3, background: i < 2 ? GOLD : "rgba(255,255,255,0.2)", borderRadius: "50%", flexShrink: 0 }} />
                  <span style={{ fontSize: 8, color: i < 2 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)" }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, padding: "5px 8px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", textAlign: "center" as const }}>
              <span style={{ fontSize: 8, color: GOLD, fontWeight: 600 }}>170 PROTOCOLS · ALL PRE-STAGED</span>
            </div>
          </div>
          <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, borderRadius: "0.15rem", padding: "10px 14px" }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: GOLD, marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Live at vaughnmartin.com</div>
            <div style={{ fontSize: 9, color: NAVY, fontWeight: 600, marginBottom: 2 }}>12-Minute Test Drive</div>
            <div style={{ fontSize: 8, color: "#6B7280", lineHeight: 1.5 }}>Public conversion funnel — any VC can run the simulation before the meeting ends.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide: Competitive Landscape ─────────────────────────────────────────────
function CompetitiveSlide() {
  const rows = [
    {
      cat: "Readiness OS",
      desc: "Strategic Coordination Infrastructure",
      pre: true, speed: true, signal: true, compound: true, noSeat: true,
      highlight: true,
    },
    {
      cat: "McKinsey / BCG",
      desc: "Strategy consulting",
      pre: false, speed: false, signal: false, compound: false, noSeat: false,
    },
    {
      cat: "Asana / Monday",
      desc: "Project management",
      pre: false, speed: false, signal: false, compound: false, noSeat: true,
    },
    {
      cat: "Copilot / ChatGPT",
      desc: "AI productivity tools",
      pre: false, speed: true, signal: false, compound: false, noSeat: true,
    },
    {
      cat: "GRC / Compliance SW",
      desc: "Governance & risk platforms",
      pre: false, speed: false, signal: true, compound: false, noSeat: false,
    },
  ];
  const cols = ["Pre-Staged Protocols", "12-Min Execution", "Signal Detection", "Compounds w/ Use", "No Per-Seat Cost"];
  const keys: (keyof typeof rows[0])[] = ["pre", "speed", "signal", "compound", "noSeat"];

  const Check = ({ v, gold }: { v: boolean; gold?: boolean }) => (
    <div style={{ width: 18, height: 18, borderRadius: "50%", background: v ? (gold ? GOLD : "rgba(43,138,110,0.15)") : "rgba(0,0,0,0.05)", border: `1px solid ${v ? (gold ? GOLD : TEAL) : "#E5E7EB"}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
      {v && <span style={{ fontSize: 10, color: gold ? NAVY : TEAL, fontWeight: 700 }}>✓</span>}
      {!v && <span style={{ fontSize: 10, color: "#D1D5DB", fontWeight: 700 }}>—</span>}
    </div>
  );

  return (
    <div style={{ background: "#FFFFFF", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "24px 48px" }}>
      <div style={{ marginBottom: 16 }}>
        <SlideLabel>Competitive Landscape</SlideLabel>
        <h2 style={{ ...CG, fontSize: 28, fontWeight: 600, color: NAVY, lineHeight: 1.1 }}>
          No one is building coordination infrastructure.<br />Everyone is bolting AI onto the old model.
        </h2>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: 0, marginBottom: 4 }}>
          <div style={{ padding: "0 0 8px 0" }} />
          {cols.map(c => (
            <div key={c} style={{ padding: "0 4px 8px", textAlign: "center" as const }}>
              <span style={{ ...BC, fontSize: 7.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#9CA3AF", lineHeight: 1.4 }}>{c}</span>
            </div>
          ))}
        </div>

        {/* Data rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", alignItems: "center", padding: "10px 14px", background: r.highlight ? NAVY : i % 2 === 0 ? "#FAFAF9" : "#FFFFFF", border: `1px solid ${r.highlight ? "transparent" : BORDER}`, ...(r.highlight ? { borderLeft: `3px solid ${GOLD}` } : { borderLeft: `1px solid ${BORDER}` }) }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: r.highlight ? GOLD : NAVY }}>{r.cat}</div>
                <div style={{ fontSize: 9, color: r.highlight ? "rgba(255,255,255,0.4)" : "#9CA3AF" }}>{r.desc}</div>
              </div>
              {keys.map(k => (
                <Check key={k} v={!!r[k]} gold={r.highlight} />
              ))}
            </div>
          ))}
        </div>

        {/* Bottom insight */}
        <div style={{ marginTop: 12, padding: "12px 20px", background: `rgba(10,15,46,0.04)`, border: `1px solid rgba(10,15,46,0.08)`, borderLeft: `3px solid ${GOLD}` }}>
          <p style={{ fontSize: 12, color: NAVY, lineHeight: 1.55 }}>
            <strong>The real competition is the 30-day mobilization cycle itself.</strong> Every alternative either speeds up the old model or audits it after the fact. Only Readiness OS replaces it — with pre-staged execution that deploys before the trigger fully matures.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Slide: The Ask ───────────────────────────────────────────────────────────
function TheAskSlide() {
  const uses = [
    { alloc: "40%", label: "Platform Infrastructure", desc: "1–2 contract engineers — feature velocity, reliability, SOC 2 pathway, integration depth, and multi-tenant pilot scaling.", color: TEAL },
    { alloc: "30%", label: "Pilot Sales & Onboarding", desc: "1 enterprise account executive — pilot landing, hands-on onboarding, and account expansion from $75K pilot to full ACV.", color: GOLD },
    { alloc: "20%", label: "Market Presence", desc: "Lock the 'Strategic Coordination Infrastructure' category name and convert pipeline into signed contracts.", color: NAVY },
    { alloc: "10%", label: "SOC 2 & Security", desc: "SOC 2 Type II, enterprise SSO, audit logging — procurement table stakes for every Fortune 1000 deal.", color: "#6B7280" },
  ];
  return (
    <div style={{ background: OFF, width: "100%", height: "100%", display: "flex", position: "relative" }}>
      {/* Left panel */}
      <div style={{ ...GRID_BG, background: NAVY_BG, width: "40%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -100, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <VaughnMartinLogo color="white" height={48} variant="icon-only" />
            <SlideLabel light>The Ask</SlideLabel>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>SpeedRun Selection</div>
            <div style={{ ...CG, fontSize: 28, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.15, marginBottom: 8 }}>12 weeks to close what the platform cannot close alone.</div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
              Program access, network, and the signal that converts Fortune 1000 conversations into signed pilots.
            </p>
          </div>

          <div style={{ paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.1)", marginBottom: 14 }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>Capital Structure</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Stage 1 — explicitly Speedrun SAFE structure */}
              <div style={{ padding: "10px 14px", border: "1px solid rgba(201,168,76,0.5)", background: "rgba(201,168,76,0.08)" }}>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: GOLD, paddingBottom: 3 }}>SPEEDRUN SAFE · PROGRAM CAPITAL</span>
                  <span style={{ ...CG, fontSize: 20, fontWeight: 700, color: GOLD }}>$1M</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>SpeedRun SAFE — upfront at program start</span>
                    <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: GOLD }}>$500K</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>Follow-on participation option at SpeedRun close</span>
                    <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: GOLD }}>$500K</span>
                  </div>
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", borderTop: "1px solid rgba(201,168,76,0.2)", paddingTop: 4 }}>Success gate: 3 signed pilots · $225K ARR · Commercial co-founder on board</div>
              </div>

              {/* Stage 2 — post-Speedrun seed, not additional Speedrun capital */}
              <div style={{ padding: "10px 14px", border: "1px solid rgba(43,138,110,0.3)", background: "rgba(43,138,110,0.05)" }}>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 4 }}>
                  <div>
                    <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: TEAL }}>POST-SPEEDRUN SEED ROUND</span>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>Triggered by pilot success — not additional SpeedRun capital</div>
                  </div>
                  <span style={{ ...CG, fontSize: 20, fontWeight: 700, color: TEAL }}>$2M</span>
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>10 pilots · $500K+ ARR · SOC 2 complete · Category leadership locked</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 44px" }}>
        <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>Use of Funds</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {uses.map((u, i) => (
            <div key={i} style={{ display: "flex", gap: 16, padding: "14px 18px", border: `1px solid ${BORDER}`, borderLeft: `3px solid ${u.color}`, background: "#FFFFFF" }}>
              <div style={{ flexShrink: 0, textAlign: "center" as const, paddingTop: 2 }}>
                <div style={{ ...BC, fontSize: 16, fontWeight: 900, color: u.color, lineHeight: 1 }}>{u.alloc}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 3 }}>{u.label}</div>
                <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.55 }}>{u.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "14px 18px", background: `rgba(10,15,46,0.05)`, border: `1px solid rgba(10,15,46,0.1)`, borderLeft: `3px solid ${GOLD}` }}>
          <p style={{ ...CG, fontSize: 14, fontStyle: "italic", color: NAVY, lineHeight: 1.55 }}>
            "The platform is built. The category is defined. The commercial co-founder is equity, not a budget line. Every dollar goes toward growth."
          </p>
          <div style={{ ...BC, fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9CA3AF", marginTop: 6 }}>Martin Brunke · Founder & CEO</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Deck ────────────────────────────────────────────────────────────────
const SLIDES = [
  { component: CoverSlide, label: "Cover" },
  { component: ProblemSlide, label: "The Problem" },
  { component: FounderSlide, label: "The Founder" },
  { component: InsightSlide, label: "The Insight" },
  { component: ProductSlide, label: "The Product" },
  { component: PlatformDepthSlide, label: "Platform Depth" },
  { component: LiveProductSlide, label: "Live Product" },
  { component: PlatformInActionSlide, label: "Platform in Action" },
  { component: ValidationSlide, label: "Validation" },
  { component: WhyNowSlide, label: "Why Now" },
  { component: MarketSlide, label: "The Market" },
  { component: MoatSlide, label: "The Moat" },
  { component: CompetitiveSlide, label: "Competitive" },
  { component: ModelSlide, label: "The Model" },
  { component: TractionSlide, label: "Traction" },
  { component: TheAskSlide, label: "The Ask" },
  { component: CloseSlide, label: "Close" },
];

const SLIDE_W = 960;
const SLIDE_H = 540;
const NAV_H = 44;

export default function A16ZPitch() {
  const [current, setCurrent] = useState(0);
  const [scale, setScale] = useState(1);
  const [exportMode, setExportMode] = useState<'pptx' | 'pdf' | null>(null);
  const [exportStep, setExportStep] = useState(0);
  const [pdfReadyUrl, setPdfReadyUrl] = useState<string | null>(null);
  const total = SLIDES.length;
  const exporting = exportMode !== null;

  const prev = useCallback(() => setCurrent(p => Math.max(0, p - 1)), []);
  const next = useCallback(() => setCurrent(p => Math.min(total - 1, p + 1)), [total]);

  // Shared slide-rendering helper: captures all slides as JPEG data URLs
  const renderAllSlides = useCallback(async (onProgress: (step: number) => void): Promise<string[]> => {
    // Pre-load all custom fonts so html2canvas captures correct metrics
    await Promise.allSettled([
      document.fonts.load('400 16px "Cormorant Garamond"'),
      document.fonts.load('600 16px "Cormorant Garamond"'),
      document.fonts.load('700 16px "Cormorant Garamond"'),
      document.fonts.load('400 16px "Barlow Condensed"'),
      document.fonts.load('600 16px "Barlow Condensed"'),
      document.fonts.load('700 16px "Barlow Condensed"'),
      document.fonts.load('800 16px "Barlow Condensed"'),
      document.fonts.load('900 16px "Barlow Condensed"'),
    ]);
    await document.fonts.ready;

    const images: string[] = [];
    for (let i = 0; i < SLIDES.length; i++) {
      onProgress(i + 1);
      const container = document.createElement('div');
      // transform:translateX(-9999px) moves the container visually off-screen so
      // the user never sees it, but the browser still fully paints and lays it out
      // (transforms don't suppress layout or paint — unlike left:-9999px which can).
      // z-index:1 (positive) avoids paint-suppression from deeply-negative stacking.
      // The onclone callback below resets the transform in html2canvas's clone so
      // it captures at position 0,0 and produces the correct image.
      container.setAttribute('data-pdf-render', 'true');
      container.style.cssText = [
        'position:fixed', 'left:0', 'top:0',
        `width:${SLIDE_W}px`, `height:${SLIDE_H}px`,
        'overflow:hidden', 'z-index:1',
        'transform:translateX(-9999px)', 'pointer-events:none',
      ].join(';');
      document.body.appendChild(container);
      const SlideComp = SLIDES[i].component;
      const root = createRoot(container);
      // Render and wait for fonts + layout to fully settle
      await new Promise<void>(resolve => {
        root.render(<SlideComp />);
        setTimeout(resolve, 1000);
      });
      // Wait for any images inside the slide to load
      const imgs = Array.from(container.querySelectorAll('img'));
      if (imgs.length > 0) {
        await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })));
        await new Promise(r => setTimeout(r, 150));
      }

      const canvas = await html2canvas(container, {
        width: SLIDE_W, height: SLIDE_H, scale: 2,
        useCORS: true, allowTaint: false, logging: false,
        backgroundColor: '#ffffff',
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        imageTimeout: 10000,
        x: 0, y: 0,
        // Reset the off-screen transform in the clone so html2canvas captures at 0,0
        onclone: (_doc: Document, el: HTMLElement) => {
          el.style.transform = 'none';
        },
      });
      images.push(canvas.toDataURL('image/jpeg', 0.95));
      root.unmount();
      document.body.removeChild(container);
    }
    return images;
  }, []);

  const exportToPPTX = useCallback(async () => {
    if (exporting) return;
    setExportMode('pptx');
    setExportStep(0);
    const images = await renderAllSlides(step => setExportStep(step));
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    for (const img of images) {
      const slide = pptx.addSlide();
      slide.addImage({ data: img, x: 0, y: 0, w: 10, h: 5.625 });
    }
    await pptx.writeFile({ fileName: 'VaughnMartin-ReadinessOS-a16z-SpeedRun007.pptx' });
    setExportMode(null);
    setExportStep(0);
  }, [exporting, renderAllSlides]);

  const exportToPDF = useCallback(async () => {
    if (exporting) return;
    setExportMode('pdf');
    setExportStep(0);
    try {
      const images = await renderAllSlides(step => setExportStep(step));
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [SLIDE_W, SLIDE_H] });
      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage([SLIDE_W, SLIDE_H], 'landscape');
        pdf.addImage(images[i], 'JPEG', 0, 0, SLIDE_W, SLIDE_H);
      }
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      setPdfReadyUrl(url);
    } catch (err) {
      console.error('[PDF Export] Failed:', err);
      // Clean up any orphaned render containers left by a crashed slide
      document.querySelectorAll('[data-pdf-render]').forEach(el => el.remove());
      alert('PDF generation encountered an error. Please try again.');
    } finally {
      setExportMode(null);
      setExportStep(0);
    }
  }, [exporting, renderAllSlides]);

  useEffect(() => {
    const updateScale = () => {
      const availW = window.innerWidth;
      const availH = window.innerHeight - NAV_H;
      setScale(Math.min(availW / SLIDE_W, availH / SLIDE_H));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const SlideComponent = SLIDES[current].component;

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
      {/* Export loading overlay */}
      {exporting && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(10,15,46,0.88)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
          <div style={{ ...CG, fontSize: 18, color: "#fff", marginBottom: 20 }}>{exportMode === 'pdf' ? 'Generating PDF…' : 'Generating PPTX…'}</div>
          <div style={{ width: 280, height: 4, background: "rgba(255,255,255,0.12)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(exportStep / total) * 100}%`, background: GOLD, borderRadius: 2, transition: "width 0.3s ease" }} />
          </div>
          <div style={{ ...BC, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: GOLD, marginTop: 12 }}>
            SLIDE {exportStep} OF {total}
          </div>
        </div>
      )}

      {/* PDF Ready overlay — universal: works on mobile, desktop, and inside iframes */}
      {pdfReadyUrl && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,15,46,0.95)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}
          onClick={() => setPdfReadyUrl(null)}
        >
          <div style={{ ...CG, fontSize: 22, color: "#fff", textAlign: "center" }}>Your PDF is ready</div>
          <a
            href={pdfReadyUrl}
            target="_blank"
            rel="noopener noreferrer"
            download="VaughnMartin-ReadinessOS-a16z-SpeedRun007.pdf"
            onClick={e => e.stopPropagation()}
            style={{ display: "flex", alignItems: "center", gap: 10, background: TEAL, color: "#fff", textDecoration: "none", padding: "14px 32px", borderRadius: "0.15rem", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}
          >
            <FileText size={18} /> Tap to Open / Download PDF
          </a>
          <div style={{ ...BC, fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
            Tap anywhere else to dismiss
          </div>
        </div>
      )}

      {/* Slide stage — centers the scaled 16:9 canvas */}
      <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div
          style={{
            width: SLIDE_W,
            height: SLIDE_H,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            position: "relative",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <SlideComponent />
        </div>
      </div>

      {/* Prev / Next — positioned relative to full viewport */}
      <button
        onClick={prev}
        disabled={current === 0}
        style={{ position: "fixed", left: 20, top: `calc(50% - ${NAV_H / 2}px)`, transform: "translateY(-50%)", zIndex: 100, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: current === 0 ? "default" : "pointer", opacity: current === 0 ? 0.2 : 0.8, backdropFilter: "blur(8px)", transition: "opacity 0.2s" }}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} color="#fff" />
      </button>
      <button
        onClick={next}
        disabled={current === total - 1}
        style={{ position: "fixed", right: 20, top: `calc(50% - ${NAV_H / 2}px)`, transform: "translateY(-50%)", zIndex: 100, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: current === total - 1 ? "default" : "pointer", opacity: current === total - 1 ? 0.2 : 0.8, backdropFilter: "blur(8px)", transition: "opacity 0.2s" }}
        aria-label="Next slide"
      >
        <ChevronRight size={20} color="#fff" />
      </button>

      {/* Bottom bar — fixed height, always at bottom */}
      <div style={{ width: "100%", height: NAV_H, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", background: "rgba(10,15,46,0.92)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.08)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.3)" }}>VaughnMartin</span>
          <div style={{ width: 1, height: 10, background: "rgba(255,255,255,0.15)" }} />
          <span style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: GOLD }}>{SLIDES[current].label}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{ width: i === current ? 20 : 6, height: 6, borderRadius: 3, background: i === current ? GOLD : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s" }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={exportToPDF}
            disabled={exporting}
            title="Download as PDF"
            style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(43,138,110,0.15)", border: "1px solid rgba(43,138,110,0.4)", borderRadius: "0.15rem", padding: "5px 12px", cursor: exporting ? "not-allowed" : "pointer", opacity: exporting ? 0.5 : 1, transition: "opacity 0.2s" }}
          >
            <FileText size={13} color={TEAL} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: TEAL }}>
              {exportMode === 'pdf' ? `${exportStep}/${total}` : "Download PDF"}
            </span>
          </button>
          <button
            onClick={exportToPPTX}
            disabled={exporting}
            title="Download as PowerPoint"
            style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.35)", borderRadius: "0.15rem", padding: "5px 12px", cursor: exporting ? "not-allowed" : "pointer", opacity: exporting ? 0.5 : 1, transition: "opacity 0.2s" }}
          >
            <Download size={13} color={GOLD} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: GOLD }}>
              {exportMode === 'pptx' ? `${exportStep}/${total}` : "Download PPTX"}
            </span>
          </button>
          <div style={{ ...BC, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>
            {current + 1} / {total}
          </div>
        </div>
      </div>
    </div>
  );
}
