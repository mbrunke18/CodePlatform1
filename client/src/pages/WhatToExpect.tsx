import { useEffect } from "react";
import { Link } from "wouter";
import { CheckCircle, ArrowRight, Clock, Shield, TrendingUp, Users, Zap, BookOpen } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";

function GoldRule() {
  return <div style={{ width: 40, height: 2, background: GOLD, margin: "1rem 0" }} />;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      fontWeight: 700,
      fontSize: "0.7rem",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: GOLD,
      marginBottom: "0.75rem",
    }}>
      {children}
    </div>
  );
}

export default function WhatToExpect() {
  useEffect(() => {
    updatePageMetadata(
      "What to Expect | VaughnMartin Readiness OS",
      "Three questions every serious enterprise buyer asks before engaging: What is it, what does it deliver, and what does success require from us?"
    );
  }, []);

  return (
    <PageLayout>
      <div style={{ background: "#fff", minHeight: "100vh" }}>

        {/* Hero */}
        <div style={{ background: NAVY, padding: "5rem 2rem 4rem" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <SectionLabel>Before You Engage</SectionLabel>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
              margin: "0 0 1.25rem",
            }}>
              What to Expect
            </h1>
            <p style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: "1.15rem",
              color: "rgba(255,255,255,0.72)",
              maxWidth: 620,
              lineHeight: 1.7,
              margin: 0,
            }}>
              Three questions every serious enterprise buyer asks before engaging.
              Here are the direct answers — no marketing language.
            </p>
          </div>
        </div>

        {/* Q1 — Purpose */}
        <div style={{ padding: "5rem 2rem", borderBottom: `1px solid ${IVORY}` }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: NAVY, display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 4,
              }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: GOLD, fontSize: "1.1rem" }}>1</span>
              </div>
              <div>
                <SectionLabel>The First Question</SectionLabel>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                  fontWeight: 700,
                  color: NAVY,
                  lineHeight: 1.15,
                  margin: "0 0 0.5rem",
                }}>
                  What is the purpose of Readiness OS?
                </h2>
              </div>
            </div>

            <div style={{ paddingLeft: "4rem" }}>
              <GoldRule />
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "1.1rem", color: NAVY, lineHeight: 1.75, fontWeight: 500, marginBottom: "1.5rem" }}>
                When a strategic trigger fires — an activist investor takes a position, ransomware hits at 2 a.m., a key supplier collapses, an FDA recall lands on a Friday — your enterprise spends the next 30 days just <em>mobilizing</em>.
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "1.05rem", color: "#374151", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                Not executing. Mobilizing. Figuring out who needs to be in the room, aligning stakeholders, agreeing on a plan, getting the right documents drafted, securing budget approvals. All of that happens in real time, under pressure, starting from zero.
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "1.05rem", color: "#374151", lineHeight: 1.75, marginBottom: "2rem" }}>
                Readiness OS eliminates that 30-day window by doing all of it <strong style={{ color: NAVY }}>before the trigger fires</strong>. 180 Readiness Protocols — each one pre-staged with assigned owners, task sequences, document packages, communication chains, and pre-authorized budget envelopes — sit ready across every scenario your organization is likely to face.
              </p>

              <div style={{
                background: NAVY, borderRadius: "0.15rem",
                padding: "2rem 2.5rem", display: "grid",
                gridTemplateColumns: "1fr auto 1fr", gap: "1.5rem",
                alignItems: "center", marginBottom: "2rem",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 8 }}>Without Readiness OS</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", fontWeight: 700, color: "#fff" }}>30 days</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", marginTop: 4 }}>to mobilize before execution begins</div>
                </div>
                <div style={{ width: 1, height: 60, background: "rgba(255,255,255,0.15)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 8 }}>With Readiness OS</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", fontWeight: 700, color: GOLD }}>12 minutes</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", marginTop: 4 }}>from trigger detection to full coordination</div>
                </div>
              </div>

              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "1.05rem", color: "#374151", lineHeight: 1.75 }}>
                The preparation was already done. The response is ready before the trigger fires. That is the purpose.
              </p>
            </div>
          </div>
        </div>

        {/* Q2 — Value */}
        <div style={{ padding: "5rem 2rem", background: "#FAFAF8", borderBottom: `1px solid ${IVORY}` }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: NAVY, display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 4,
              }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: GOLD, fontSize: "1.1rem" }}>2</span>
              </div>
              <div>
                <SectionLabel>The Second Question</SectionLabel>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                  fontWeight: 700,
                  color: NAVY,
                  lineHeight: 1.15,
                  margin: "0 0 0.5rem",
                }}>
                  What value does it deliver to our organization?
                </h2>
              </div>
            </div>

            <div style={{ paddingLeft: "4rem" }}>
              <GoldRule />
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "1.05rem", color: "#374151", lineHeight: 1.75, marginBottom: "2.5rem" }}>
                Six concrete outcomes that change how your organization responds to strategic pressure.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.25rem" }}>
                {[
                  {
                    icon: Zap,
                    title: "3,600× Execution Head Start",
                    body: "30 days of mobilization compressed to 12 minutes. When a trigger fires, your coordination infrastructure is already staged — not assembled in real time.",
                  },
                  {
                    icon: Shield,
                    title: "Executive Authority Preserved",
                    body: "No Readiness Protocol activates without executive sign-off. The preparation compresses the mobilization cycle. The decision remains human, every time.",
                  },
                  {
                    icon: BookOpen,
                    title: "180 Pre-Staged Protocols",
                    body: "Core cross-industry protocols covering Growth & Positioning, Risk & Resilience, and Transformation — ready before you need them.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Continuous Signal Monitoring",
                    body: "231 trigger patterns scanned every 15 minutes from live intelligence feeds. You know a threat is emerging before your stakeholders hear about it from the news.",
                  },
                  {
                    icon: Clock,
                    title: "Closed-Loop Learning",
                    body: "Every activation close-out generates preparation improvements. The protocols get sharper after every real-world use. The organizational knowledge is never lost.",
                  },
                  {
                    icon: Users,
                    title: "Board-Ready Reporting",
                    body: "Every activation produces a timestamped after-action record with elapsed time, decisions made, and outcome classification — ready for board review.",
                  },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} style={{
                    background: "#fff",
                    border: `1px solid ${IVORY}`,
                    borderTop: `3px solid ${GOLD}`,
                    borderRadius: "0.15rem",
                    padding: "1.5rem",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.75rem" }}>
                      <Icon size={16} color={TEAL} />
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: NAVY, letterSpacing: "0.02em" }}>{title}</div>
                    </div>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.9rem", color: "#4B5563", lineHeight: 1.65, margin: 0 }}>{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Q3 — What success requires */}
        <div style={{ padding: "5rem 2rem", borderBottom: `1px solid ${IVORY}` }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: NAVY, display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 4,
              }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: GOLD, fontSize: "1.1rem" }}>3</span>
              </div>
              <div>
                <SectionLabel>The Third Question</SectionLabel>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                  fontWeight: 700,
                  color: NAVY,
                  lineHeight: 1.15,
                  margin: "0 0 0.5rem",
                }}>
                  What do we need to do to make this successful?
                </h2>
              </div>
            </div>

            <div style={{ paddingLeft: "4rem" }}>
              <GoldRule />
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "1.05rem", color: "#374151", lineHeight: 1.75, marginBottom: "2rem" }}>
                The honest answer. Most platforms bury this. Here it is directly.
              </p>

              {/* What you bring */}
              <div style={{ background: IVORY, borderRadius: "0.15rem", padding: "2rem 2.5rem", marginBottom: "2.5rem" }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.18em", color: TEAL, textTransform: "uppercase", marginBottom: "1.25rem" }}>What You Bring to the Partnership</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                  {[
                    { label: "Executive Sponsor", detail: "A C-suite principal who holds authorization authority and can sign off on protocol activations. Without this, the platform cannot function as designed." },
                    { label: "PMO Director or Chief of Staff", detail: "The person who will own the preparation architecture — mapping stakeholders, configuring protocols, and running the quarterly readiness rhythm." },
                    { label: "2–3 Priority Scenarios", detail: "You do not configure all 180 protocols on day one. Start with the 2–3 situations your organization is most likely to face. Everything else stages from there." },
                    { label: "Stakeholder Participation", detail: "4–6 hours across your functional leads in the first two weeks to map ownership roles. This is the most important investment you will make." },
                  ].map(({ label, detail }) => (
                    <div key={label} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <CheckCircle size={15} color={TEAL} style={{ marginTop: 3, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: NAVY, marginBottom: 4 }}>{label}</div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.85rem", color: "#4B5563", lineHeight: 1.6 }}>{detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4-phase path */}
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase", marginBottom: "1.5rem" }}>The 90-Day Go-Live Path</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
                {[
                  {
                    phase: "Phase 1", days: "Days 1–14", label: "Foundation",
                    tasks: ["Organization setup and stakeholder mapping", "3 priority protocols configured end-to-end", "Executive sponsor authorization workflow confirmed"],
                  },
                  {
                    phase: "Phase 2", days: "Days 15–45", label: "Calibration",
                    tasks: ["Signal monitoring calibrated to your sector and risk profile", "First live protocol test — timed, with debrief", "Team trained on activation and authorization flow"],
                  },
                  {
                    phase: "Phase 3", days: "Days 46–75", label: "Full Deployment",
                    tasks: ["Full protocol library activated across all three domains", "First formal practice drill completed", "Compound threat protocols configured for your top multi-domain risks"],
                  },
                  {
                    phase: "Phase 4", days: "Days 76–90", label: "Close-Out & Learning",
                    tasks: ["90-day close-out review with outcome classification", "ADVANCE learning loop active — protocols update from real activations", "Readiness score baseline established for board reporting"],
                  },
                ].map(({ phase, days, label, tasks }, i) => (
                  <div key={phase} style={{
                    display: "grid", gridTemplateColumns: "160px 1fr",
                    gap: "1.5rem", alignItems: "flex-start",
                    padding: "1.25rem 1.5rem",
                    background: "#fff",
                    border: `1px solid ${IVORY}`,
                    borderLeft: `4px solid ${i === 3 ? TEAL : GOLD}`,
                    borderRadius: "0 0.15rem 0.15rem 0",
                  }}>
                    <div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase" }}>{phase}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "1.15rem", color: NAVY, margin: "2px 0 4px" }}>{label}</div>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.8rem", color: "#9CA3AF" }}>{days}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {tasks.map(t => (
                        <div key={t} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                          <CheckCircle size={13} color={TEAL} style={{ marginTop: 3, flexShrink: 0 }} />
                          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.875rem", color: "#374151", lineHeight: 1.55 }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: NAVY, borderRadius: "0.15rem",
                padding: "1.75rem 2rem",
                display: "flex", alignItems: "flex-start", gap: "1rem",
              }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  <div style={{ width: 3, height: 48, background: GOLD, borderRadius: 2 }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: "1rem", color: "#fff", lineHeight: 1.7, fontWeight: 500 }}>
                    Most organizations reach a full readiness posture within the first 90 days. The preparation is not a project — it is a new operating rhythm. Once the infrastructure is staged, maintaining it requires roughly 2–4 hours per week from your PMO Director, plus quarterly calibration sessions.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "5rem 2rem", background: NAVY }}>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <SectionLabel>Ready to Move Forward</SectionLabel>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.75rem, 3vw, 2.6rem)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
              margin: "0 0 1.25rem",
            }}>
              The Founding Partner Program is a 90-day validation partnership.
            </h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.65)", maxWidth: 580, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
              A limited number of organizations are selected each cohort. If this matches where you are and where you need to go, apply now.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/request-access" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.875rem 2rem",
                background: GOLD, color: NAVY,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700, fontSize: "0.85rem",
                letterSpacing: "0.12em", textTransform: "uppercase" as const,
                borderRadius: "0.15rem", textDecoration: "none",
              }}>
                Apply for Founding Partner Access <ArrowRight size={14} />
              </Link>
              <Link href="/executive-brief" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.875rem 2rem",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700, fontSize: "0.85rem",
                letterSpacing: "0.12em", textTransform: "uppercase" as const,
                borderRadius: "0.15rem", textDecoration: "none",
              }}>
                Read the Executive Brief
              </Link>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
