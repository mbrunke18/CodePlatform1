import { useEffect } from "react";

const NAVY      = "#0A0F2E";
const NAVY_MID  = "#132558";
const GOLD      = "#C9A84C";
const GOLD_L    = "#DFC178";
const TEAL      = "#2B8A6E";
const TEAL_L    = "#3BAF8A";
const WHITE     = "#FFFFFF";
const OFF       = "#F0EDE4";

const SLIDE_SIZE = 1080;

const slideStyle: React.CSSProperties = {
  width: SLIDE_SIZE,
  height: SLIDE_SIZE,
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
  flexShrink: 0,
  pageBreakAfter: "always",
  breakAfter: "page",
};

function GoldLine({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      height: 3, background: `linear-gradient(90deg, ${GOLD}, ${TEAL_L}, transparent)`,
      width: "100%", ...style
    }} />
  );
}

function Badge({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: light ? "rgba(201,168,76,0.15)" : "rgba(201,168,76,0.18)",
      border: `1px solid ${light ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.5)"}`,
      borderRadius: 4, padding: "5px 14px",
    }}>
      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD }}>
        {label}
      </span>
    </div>
  );
}

function VMWatermark() {
  return (
    <div style={{
      position: "absolute", bottom: 28, right: 36,
      display: "flex", alignItems: "center", gap: 8, opacity: 0.55,
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: "50%",
        border: `2px solid ${GOLD}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: "0.05em" }}>VM</span>
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        vaughnmartin.com
      </span>
    </div>
  );
}

function SlideCounter({ n, total }: { n: number; total: number }) {
  return (
    <div style={{
      position: "absolute", bottom: 28, left: 36,
      fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
      color: "rgba(201,168,76,0.5)", textTransform: "uppercase",
    }}>
      {n} / {total}
    </div>
  );
}

/* ─── SLIDE 1: COVER ─────────────────────────────────────────────────────── */
function Slide01() {
  return (
    <div style={{ ...slideStyle, background: NAVY }}>
      {/* background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(201,168,76,0.07) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(201,168,76,0.07) 1px, transparent 1px)`,
        backgroundSize: "54px 54px",
      }} />
      {/* gold orb */}
      <div style={{
        position: "absolute", top: -160, right: -120,
        width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)`,
      }} />
      <div style={{
        position: "absolute", bottom: -200, left: -100,
        width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(43,138,110,0.15) 0%, transparent 70%)`,
      }} />

      <div style={{
        position: "relative", zIndex: 1, height: "100%",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 80px", textAlign: "center",
      }}>
        {/* Logo mark */}
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          border: `2px solid ${GOLD}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 40,
          background: "rgba(201,168,76,0.08)",
        }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: GOLD }}>VM</span>
        </div>

        <Badge label="Execution OS · Fortune 1000" />

        <div style={{ marginTop: 44, marginBottom: 20 }}>
          <div style={{
            fontSize: 72, fontWeight: 900, color: WHITE, lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}>
            We Redesign
          </div>
          <div style={{
            fontSize: 72, fontWeight: 900, lineHeight: 1.05,
            letterSpacing: "-0.02em",
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            How Work Flows
          </div>
          <div style={{
            fontSize: 72, fontWeight: 900, color: WHITE, lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}>
            in the Age of AI.
          </div>
        </div>

        <div style={{
          marginTop: 36, fontSize: 20, fontWeight: 500,
          color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: 680,
        }}>
          Enterprise work was designed without AI. Every committee, every alignment cycle, 
          every coordination delay exists because humans couldn't process fast enough to act decisively.
          <br /><strong style={{ color: "rgba(255,255,255,0.8)" }}>AI changed the constraint.</strong>
        </div>
      </div>
      <VMWatermark />
      <SlideCounter n={1} total={10} />
    </div>
  );
}

/* ─── SLIDE 2: THE REALITY ───────────────────────────────────────────────── */
function Slide02() {
  return (
    <div style={{ ...slideStyle, background: OFF }}>
      <GoldLine />
      <div style={{
        height: "calc(100% - 3px)",
        display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "0 90px",
      }}>
        <Badge label="The Reality" />
        <div style={{
          marginTop: 50, fontSize: 68, fontWeight: 900,
          color: NAVY, lineHeight: 1.08, letterSpacing: "-0.02em",
        }}>
          Your AI is deployed.
        </div>
        <div style={{
          fontSize: 68, fontWeight: 900, lineHeight: 1.08,
          letterSpacing: "-0.02em",
          background: `linear-gradient(135deg, ${TEAL}, ${TEAL_L})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Your operating model hasn't changed.
        </div>

        <div style={{ marginTop: 56, display: "flex", gap: 24 }}>
          {[
            { stat: "65%", label: "of enterprises report AI deployed at scale" },
            { stat: "1%", label: "report measurable execution improvements" },
            { stat: "$4.4T", label: "annual value left unrealized" },
          ].map((item) => (
            <div key={item.stat} style={{
              flex: 1, background: WHITE,
              border: `1px solid rgba(10,15,46,0.1)`,
              borderTop: `3px solid ${GOLD}`,
              borderRadius: 8, padding: "24px 20px",
            }}>
              <div style={{ fontSize: 44, fontWeight: 900, color: NAVY, lineHeight: 1 }}>{item.stat}</div>
              <div style={{ fontSize: 13, color: "#555", marginTop: 8, lineHeight: 1.4 }}>{item.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, fontSize: 11, color: "#888", letterSpacing: "0.05em" }}>
          Source: McKinsey &amp; Company — Enterprise Architecture Synthesis 2025–2026
        </div>
      </div>
      <VMWatermark />
      <SlideCounter n={2} total={10} />
    </div>
  );
}

/* ─── SLIDE 3: THE PROBLEM ───────────────────────────────────────────────── */
function Slide03() {
  return (
    <div style={{ ...slideStyle, background: NAVY_MID }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(201,168,74,0.07) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(201,168,74,0.07) 1px, transparent 1px)`,
        backgroundSize: "54px 54px",
      }} />
      <div style={{
        position: "relative", zIndex: 1, height: "100%",
        display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "0 80px",
      }}>
        <Badge label="The Real Bottleneck" />
        <div style={{
          marginTop: 44, fontSize: 52, fontWeight: 900,
          color: WHITE, lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: 820,
        }}>
          When a strategic trigger fires, the enterprise spends{" "}
          <span style={{ color: GOLD_L }}>weeks just getting the right people in the room.</span>
        </div>

        <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { phase: "Week 1–2", label: "Figuring out who needs to be in the room" },
            { phase: "Week 2–3", label: "Getting everyone aligned on a plan" },
            { phase: "Week 3–4", label: "Stakeholder sign-off and budget approval" },
            { phase: "Week 4+", label: "Execution finally begins — if it begins at all" },
          ].map((item, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderLeft: `3px solid ${i < 3 ? "rgba(201,168,76,0.4)" : GOLD}`,
              borderRadius: 8, padding: "18px 20px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: i < 3 ? "rgba(201,168,76,0.55)" : GOLD }}>{item.phase}</div>
              <div style={{ fontSize: 16, color: WHITE, marginTop: 6, fontWeight: 500 }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 36, padding: "16px 24px",
          background: "rgba(201,168,76,0.1)", border: `1px solid rgba(201,168,76,0.3)`,
          borderRadius: 8,
        }}>
          <span style={{ fontSize: 16, color: GOLD_L, fontWeight: 600 }}>
            "The bottleneck is never the technology — it is the operating model."
          </span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginLeft: 12 }}>McKinsey Global Institute, Nov 2025</span>
        </div>
      </div>
      <VMWatermark />
      <SlideCounter n={3} total={10} />
    </div>
  );
}

/* ─── SLIDE 4: THE NUMBER ────────────────────────────────────────────────── */
function Slide04() {
  return (
    <div style={{ ...slideStyle, background: NAVY }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 800px 600px at 50% 40%, rgba(201,168,76,0.14) 0%, transparent 70%)`,
      }} />
      <div style={{
        position: "relative", zIndex: 1, height: "100%",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 60px", textAlign: "center",
      }}>
        <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", marginBottom: 32 }}>
          Execution Head Start
        </div>

        <div style={{
          fontSize: 160, fontWeight: 900, lineHeight: 0.9,
          letterSpacing: "-0.04em",
          background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_L} 50%, ${TEAL_L} 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          3,600×
        </div>

        <div style={{
          marginTop: 32, fontSize: 28, fontWeight: 700, color: WHITE,
          lineHeight: 1.3,
        }}>
          30 days to mobilize.
          <br />
          <span style={{ color: GOLD_L }}>12 minutes to execute.</span>
        </div>

        <div style={{
          marginTop: 48, display: "flex", alignItems: "center", gap: 0,
          width: "100%", maxWidth: 760,
        }}>
          <div style={{
            flex: 1, background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px 0 0 8px",
            padding: "24px 28px", textAlign: "left",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Traditional Enterprise</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "rgba(255,255,255,0.35)" }}>30 days</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>just to mobilize — before execution even starts</div>
          </div>
          <div style={{
            width: 2, alignSelf: "stretch",
            background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`,
          }} />
          <div style={{
            flex: 1, background: "rgba(201,168,76,0.08)",
            border: `1px solid rgba(201,168,76,0.3)`, borderRadius: "0 8px 8px 0",
            padding: "24px 28px", textAlign: "left",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Execution OS</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: GOLD_L }}>12 minutes</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>roles assigned, tasks staged, comms drafted, execution underway</div>
          </div>
        </div>
      </div>
      <VMWatermark />
      <SlideCounter n={4} total={10} />
    </div>
  );
}

/* ─── SLIDE 5: MCKINSEY NAMED IT ─────────────────────────────────────────── */
function Slide05() {
  return (
    <div style={{ ...slideStyle, background: OFF }}>
      <GoldLine />
      <div style={{
        height: "calc(100% - 3px)",
        display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "0 80px",
      }}>
        <Badge label="Third-Party Validation" />

        <div style={{
          marginTop: 44, fontSize: 58, fontWeight: 900,
          color: NAVY, lineHeight: 1.08, letterSpacing: "-0.02em",
        }}>
          McKinsey Named the Gap.
          <br />
          <span style={{
            background: `linear-gradient(135deg, ${TEAL}, ${TEAL_L})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            We Built the Thing.
          </span>
        </div>

        <div style={{
          marginTop: 40, padding: "28px 32px",
          background: WHITE, borderLeft: `4px solid ${GOLD}`,
          borderRadius: "0 8px 8px 0", boxShadow: "0 2px 20px rgba(10,15,46,0.08)",
        }}>
          <div style={{ fontSize: 18, color: NAVY, lineHeight: 1.6, fontStyle: "italic", fontWeight: 500 }}>
            "McKinsey's enterprise architecture synthesis identifies an orchestration layer — a coordination fabric — at the center of every enterprise AI stack. They named the absence."
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: "#888", letterSpacing: "0.08em", fontWeight: 600 }}>
            McKinsey &amp; Company · Enterprise Architecture Synthesis 2025–2026
          </div>
        </div>

        <div style={{ marginTop: 40, display: "flex", gap: 20 }}>
          {[
            { stat: "90%", label: "of executives believe AI will fundamentally change their operating model" },
            { stat: "<40%", label: "have an execution framework to act on that belief" },
            { stat: "77%", label: "cite mobilization speed as their top execution barrier" },
          ].map((item) => (
            <div key={item.stat} style={{
              flex: 1, borderTop: `3px solid ${NAVY}`,
              paddingTop: 18,
            }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: NAVY }}>{item.stat}</div>
              <div style={{ fontSize: 13, color: "#555", marginTop: 8, lineHeight: 1.4 }}>{item.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 11, color: "#888" }}>
          Source: McKinsey Global Institute — "Skill Partnerships in the Age of AI," November 2025
        </div>
      </div>
      <VMWatermark />
      <SlideCounter n={5} total={10} />
    </div>
  );
}

/* ─── SLIDE 6: IDEA FRAMEWORK ────────────────────────────────────────────── */
function Slide06() {
  const steps = [
    { letter: "I", word: "Identify", desc: "221 pre-staged trigger patterns across 9 strategic domains. The system knows what to watch before the board asks.", color: GOLD },
    { letter: "D", word: "Detect",   desc: "248+ signals monitored every 15 minutes. AI surfaces the trigger before it becomes a crisis.", color: GOLD_L },
    { letter: "E", word: "Execute",  desc: "170 pre-staged playbooks deploy in 12 minutes. Roles assigned. Tasks live. Communications drafted.", color: TEAL_L },
    { letter: "A", word: "Advance",  desc: "Debrief, performance scoring, and institutional memory capture — so the next response is faster.", color: TEAL },
  ];

  return (
    <div style={{ ...slideStyle, background: NAVY }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px)`,
        backgroundSize: "54px 54px",
      }} />
      <div style={{
        position: "relative", zIndex: 1, height: "100%",
        display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "0 72px",
      }}>
        <Badge label="The IDEA Framework™" />

        <div style={{
          marginTop: 40, fontSize: 46, fontWeight: 900,
          color: WHITE, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 44,
        }}>
          Four phases. One continuous motion.
          <br />
          <span style={{ color: GOLD_L }}>Pre-staged before the trigger fires.</span>
        </div>

        <div style={{ display: "flex", gap: 18 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              flex: 1, background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderTop: `3px solid ${s.color}`,
              borderRadius: 10, padding: "28px 22px",
            }}>
              <div style={{
                fontSize: 52, fontWeight: 900, lineHeight: 1,
                color: s.color, marginBottom: 14,
              }}>{s.letter}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: WHITE, marginBottom: 10, letterSpacing: "-0.01em" }}>{s.word}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <VMWatermark />
      <SlideCounter n={6} total={10} />
    </div>
  );
}

/* ─── SLIDE 7: THE NUMBERS ───────────────────────────────────────────────── */
function Slide07() {
  const numbers = [
    { n: "170",  label: "Pre-staged playbooks",         sub: "across 9 strategic domains" },
    { n: "221",  label: "Trigger patterns armed",        sub: "continuous monitoring" },
    { n: "248+", label: "Signals monitored",             sub: "every 15 minutes" },
    { n: "12",   label: "Minutes to full execution",     sub: "from trigger detection" },
  ];

  return (
    <div style={{ ...slideStyle, background: OFF }}>
      <GoldLine />
      <div style={{
        height: "calc(100% - 3px)", display: "flex",
        flexDirection: "column", justifyContent: "center", padding: "0 72px",
      }}>
        <Badge label="The Platform in Numbers" />

        <div style={{
          marginTop: 50, fontSize: 52, fontWeight: 900, color: NAVY,
          lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 60,
        }}>
          Built for scale.<br />
          <span style={{
            background: `linear-gradient(135deg, ${GOLD}, ${TEAL})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Pre-staged before you need it.
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {numbers.map((item, i) => (
            <div key={i} style={{
              background: WHITE,
              border: "1px solid rgba(10,15,46,0.08)",
              borderLeft: `4px solid ${i % 2 === 0 ? GOLD : TEAL}`,
              borderRadius: 10, padding: "32px 28px",
            }}>
              <div style={{ fontSize: 72, fontWeight: 900, color: NAVY, lineHeight: 1 }}>{item.n}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginTop: 10 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <VMWatermark />
      <SlideCounter n={7} total={10} />
    </div>
  );
}

/* ─── SLIDE 8: MICROSOFT LAYER ───────────────────────────────────────────── */
function Slide08() {
  return (
    <div style={{ ...slideStyle, background: NAVY }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 900px 700px at 30% 60%, rgba(43,138,110,0.14) 0%, transparent 65%)`,
      }} />
      <div style={{
        position: "relative", zIndex: 1, height: "100%",
        display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "0 80px",
      }}>
        <Badge label="The Microsoft Layer" />

        <div style={{
          marginTop: 50, fontSize: 56, fontWeight: 900, color: WHITE,
          lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: 860,
        }}>
          Every enterprise has{" "}
          <span style={{ color: GOLD_L }}>Microsoft's AI stack.</span>
          <br />
          None have the{" "}
          <span style={{
            background: `linear-gradient(135deg, ${TEAL_L}, ${TEAL})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            operating model to use it.
          </span>
        </div>

        <div style={{
          marginTop: 54, padding: "32px 36px",
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
        }}>
          <div style={{ fontSize: 20, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, fontWeight: 500 }}>
            Execution OS is not a replacement for Microsoft — it is the orchestration layer above it. 
            When a strategic trigger fires, the coordinated response deploys inside Teams, Azure AI, 
            and Microsoft 365 in 12 minutes.
          </div>
          <div style={{
            marginTop: 28, display: "flex", gap: 16,
          }}>
            {["Microsoft Teams", "Azure OpenAI", "Copilot Studio", "Microsoft 365"].map(tool => (
              <div key={tool} style={{
                padding: "8px 16px", background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.3)", borderRadius: 6,
                fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: "0.06em",
              }}>
                {tool}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: 32, fontSize: 18, color: "rgba(255,255,255,0.45)",
          fontStyle: "italic",
        }}>
          "The workflow architecture that turns AI capability into AI action."
        </div>
      </div>
      <VMWatermark />
      <SlideCounter n={8} total={10} />
    </div>
  );
}

/* ─── SLIDE 9: WHO IT'S FOR ──────────────────────────────────────────────── */
function Slide09() {
  const audiences = [
    { role: "Chief Executive Officer",     trigger: "Competitive disruption detected → org mobilizes in 12 minutes, not next quarter's planning cycle" },
    { role: "Chief Strategy Officer",      trigger: "170 playbooks pre-staged → no more real-time playbook design under pressure" },
    { role: "Chief Risk Officer",          trigger: "221 triggers armed → systemic risk is detected, not reported after the fact" },
    { role: "Board of Directors",          trigger: "Board-ready snapshot → execution posture visible before the governance question is asked" },
  ];

  return (
    <div style={{ ...slideStyle, background: OFF }}>
      <GoldLine />
      <div style={{
        height: "calc(100% - 3px)", display: "flex",
        flexDirection: "column", justifyContent: "center", padding: "0 72px",
      }}>
        <Badge label="Built for the C-Suite" />

        <div style={{
          marginTop: 44, fontSize: 50, fontWeight: 900, color: NAVY,
          lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 44,
        }}>
          For executives who are responsible
          <br />
          <span style={{
            background: `linear-gradient(135deg, ${GOLD}, ${TEAL})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            for mobilizing faster than their competitors.
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {audiences.map((a, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 20,
              background: WHITE, borderRadius: 10, padding: "20px 24px",
              border: "1px solid rgba(10,15,46,0.08)",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: i % 2 === 0 ? `rgba(201,168,76,0.15)` : `rgba(43,138,110,0.15)`,
                border: `2px solid ${i % 2 === 0 ? GOLD : TEAL}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 2,
              }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: i % 2 === 0 ? GOLD : TEAL }}>
                  {a.role.split(" ").map(w => w[0]).join("")}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: NAVY, letterSpacing: "0.04em", textTransform: "uppercase" }}>{a.role}</div>
                <div style={{ fontSize: 14, color: "#555", marginTop: 4, lineHeight: 1.5 }}>{a.trigger}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <VMWatermark />
      <SlideCounter n={9} total={10} />
    </div>
  );
}

/* ─── SLIDE 10: CTA ──────────────────────────────────────────────────────── */
function Slide10() {
  return (
    <div style={{ ...slideStyle, background: NAVY }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(201,168,76,0.07) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(201,168,76,0.07) 1px, transparent 1px)`,
        backgroundSize: "54px 54px",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 700px 600px at 50% 35%, rgba(201,168,76,0.16) 0%, transparent 68%)`,
      }} />

      <div style={{
        position: "relative", zIndex: 1, height: "100%",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 80px", textAlign: "center",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          border: `2px solid ${GOLD}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 44, background: "rgba(201,168,76,0.1)",
        }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: GOLD }}>VM</span>
        </div>

        <div style={{
          fontSize: 60, fontWeight: 900, color: WHITE,
          lineHeight: 1.08, letterSpacing: "-0.02em",
        }}>
          Your competitors are still
          <br />
          <span style={{ color: "rgba(255,255,255,0.4)" }}>in the meeting.</span>
        </div>

        <div style={{
          marginTop: 28, fontSize: 34, fontWeight: 900,
          background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          You're already executing.
        </div>

        <div style={{
          marginTop: 56, padding: "24px 52px",
          background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`,
          borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: NAVY, letterSpacing: "0.04em" }}>
            Request Pilot Access
          </span>
        </div>

        <div style={{
          marginTop: 28, fontSize: 16, color: "rgba(255,255,255,0.45)",
          letterSpacing: "0.06em",
        }}>
          vaughnmartin.com
        </div>

        <div style={{
          marginTop: 60, display: "flex", gap: 32,
          fontSize: 13, color: "rgba(255,255,255,0.3)", fontWeight: 600,
        }}>
          <span>Fortune 1000</span>
          <span style={{ color: "rgba(201,168,76,0.4)" }}>·</span>
          <span>C-Suite &amp; Board</span>
          <span style={{ color: "rgba(201,168,76,0.4)" }}>·</span>
          <span>170 Playbooks Ready</span>
          <span style={{ color: "rgba(201,168,76,0.4)" }}>·</span>
          <span>12-Minute Execution</span>
        </div>
      </div>
      <SlideCounter n={10} total={10} />
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────────────── */
export default function LinkedInCarousel() {
  useEffect(() => {
    document.title = "LinkedIn Carousel — Execution OS | VaughnMartin";
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; }

        .carousel-wrapper {
          background: #1a1a2e;
          min-height: 100vh;
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        .carousel-header {
          width: ${SLIDE_SIZE}px;
          margin-bottom: 40px;
          text-align: center;
        }

        .carousel-header h1 {
          color: #fff;
          font-size: 22px;
          font-weight: 800;
          margin: 0 0 8px;
          letter-spacing: -0.01em;
        }

        .carousel-header p {
          color: rgba(255,255,255,0.45);
          font-size: 14px;
          margin: 0 0 24px;
        }

        .print-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #C9A84C;
          color: #0A0F2E;
          font-size: 14px;
          font-weight: 800;
          padding: 12px 32px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .print-btn:hover { background: #DFC178; }

        .slide-label {
          width: ${SLIDE_SIZE}px;
          padding: 10px 0 0;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: -2px;
        }

        .slide-gap {
          width: ${SLIDE_SIZE}px;
          height: 20px;
          background: transparent;
        }

        @media print {
          .carousel-wrapper {
            background: transparent !important;
            padding: 0 !important;
            gap: 0 !important;
          }
          .carousel-header, .slide-label, .slide-gap { display: none !important; }
          body { margin: 0; padding: 0; }
        }
      `}</style>

      <div className="carousel-wrapper">
        <div className="carousel-header">
          <h1>LinkedIn Carousel — Execution OS</h1>
          <p>10 slides · 1080×1080 · Print to PDF, then upload as LinkedIn document</p>
          <button className="print-btn" onClick={() => window.print()}>
            ↓ Save as PDF
          </button>
        </div>

        {[
          { label: "Slide 1 — Cover", component: <Slide01 /> },
          { label: "Slide 2 — The Reality", component: <Slide02 /> },
          { label: "Slide 3 — The Problem", component: <Slide03 /> },
          { label: "Slide 4 — The 3,600× Number", component: <Slide04 /> },
          { label: "Slide 5 — McKinsey Validation", component: <Slide05 /> },
          { label: "Slide 6 — IDEA Framework", component: <Slide06 /> },
          { label: "Slide 7 — Platform Numbers", component: <Slide07 /> },
          { label: "Slide 8 — Microsoft Layer", component: <Slide08 /> },
          { label: "Slide 9 — Who It's For", component: <Slide09 /> },
          { label: "Slide 10 — CTA", component: <Slide10 /> },
        ].map((s, i) => (
          <div key={i}>
            <div className="slide-label">{s.label}</div>
            {s.component}
            {i < 9 && <div className="slide-gap" />}
          </div>
        ))}
      </div>
    </>
  );
}
