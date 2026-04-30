export default function PodcastPrep() {
  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600&display=swap');
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          @page { margin: 0.45in; size: letter; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="no-print" style={{ background: "#111", padding: "12px", textAlign: "center" }}>
        <button
          onClick={() => window.print()}
          style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", background: NAVY, color: GOLD, border: "none", padding: "9px 24px", cursor: "pointer" }}
        >
          Print / Save as PDF
        </button>
      </div>

      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11.5, color: NAVY, background: "#fff", padding: "28px 32px", maxWidth: 720, margin: "0 auto", lineHeight: 1.5 }}>

        {/* Header */}
        <div style={{ borderBottom: `2px solid ${NAVY}`, paddingBottom: 10, marginBottom: 14 }}>
          <div style={{ ...BC, fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 4 }}>VaughnMartin · April 2026</div>
          <div style={{ ...BC, fontSize: 20, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: NAVY }}>Podcast Prep — The Digital Exchange</div>
          <div style={{ fontSize: 10.5, color: "#6B7280", marginTop: 3 }}>Wayne D. Roye · Founder/CIO, OpixIQ · 15-minute prep call</div>
        </div>

        <div style={{ width: 40, height: 2, background: GOLD, marginBottom: 14 }} />

        {/* Frame */}
        <Section label="The Frame">
          <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.6 }}>
            Wayne wants a <strong>business strategy conversation about Microsoft</strong> — not technical, not a product demo. That's your lane. Stay in it.
          </p>
          <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.6, marginTop: 6 }}>
            Side note: he runs OpixIQ, a Microsoft Resource Intelligence Platform. He's building in the same ecosystem you position above. Don't push on it. But don't miss it either.
          </p>
        </Section>

        <HR />

        {/* Opening */}
        <Section label="How to Open · Say this. Then stop.">
          <Quote>
            "The conversation I can carry for your audience is the gap most Microsoft customers don't realize they have. The AI stack is live — Copilot, Azure, Teams, M365. But when a strategic trigger fires — a competitive move, a regulatory action, an activist, an M&A — the organization still takes thirty days to mobilize. The technology is ready. The operating model isn't. I've watched that pattern at Ford, Toyota, Lockheed, Schwab. That's the conversation."
          </Quote>
          <p style={{ fontSize: 10, color: "#9CA3AF", marginTop: 5 }}>~90 seconds spoken. Stop talking. Let him ask the next question.</p>
        </Section>

        <HR />

        {/* Q&A */}
        <Section label="When He Asks...">
          <QA q="Can you give me an example?">
            "I spent five years coaching at Stanford. Major college football is a billion-dollar operation that solved a coordination problem Fortune 1000 companies are still wrestling with. Signal fires. They're executing across eleven roles in forty seconds. The mechanism is preparation — every situation they'll face has already been built, practiced, and owned before Saturday. Most enterprises don't have that. Every trigger, they start from scratch."
          </QA>
          <QA q="What's the takeaway for your audience?">
            "The Microsoft investment isn't the problem. The operating model above it is. Most enterprises are running 2026 AI capability through a coordination model designed before AI existed. The fix isn't more technology. It's redesigning how the stack gets activated when a trigger fires."
          </QA>
          <QA q="What do you do / what's your company?">
            "I run a small company called VaughnMartin. But the episode isn't about the product — it's about the pattern."
          </QA>
          <QA q="What format are you comfortable with?">
            "Whatever works for your show — structured or open conversation, your call."
          </QA>
        </Section>

        <HR />

        {/* Do not / Do */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <SectionLabel>Do Not</SectionLabel>
            {[
              "Mention VaughnMartin or Readiness OS unless he asks directly",
              "Repeat Ford / Toyota / Lockheed — lands once, naturally, then stop",
              "Bring up Stanford more than once",
              "Ask about audience size, downloads, or sponsors",
              "Pitch anything on this call",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 7, padding: "3px 0", fontSize: 10.5, color: "#374151" }}>
                <span style={{ color: "#EF4444", fontWeight: 800, fontSize: 11, flexShrink: 0, paddingTop: 2 }}>✕</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div>
            <SectionLabel>One Thing To Do</SectionLabel>
            <div style={{ background: NAVY, padding: "10px 14px" }}>
              <div style={{ ...BC, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 5 }}>Near the end — after he's got what he needs</div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
                "I noticed you're building OpixIQ in the Microsoft Resource Intelligence space — is that shaping the kinds of conversations you're trying to have on the show?"
              </p>
            </div>
            <p style={{ fontSize: 10, color: "#6B7280", marginTop: 5 }}>Peer question, not a pitch. He'll remember it. Most guests don't ask.</p>
          </div>
        </div>

        <HR />

        {/* Prep + Close */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <SectionLabel>Prep (10 min total)</SectionLabel>
            <PrepItem time="5 min">Scan his LinkedIn + OpixIQ site. Know one specific thing about Microsoft Resource Intelligence before you get on.</PrepItem>
            <PrepItem time="5 min">Listen to 2 minutes of any recent Digital Exchange episode. Get his pacing. That's enough — don't over-prepare or you'll sound stiff.</PrepItem>
          </div>
          <div>
            <SectionLabel>Close the Call</SectionLabel>
            <div style={{ background: "#F0EDE4", border: "1px solid #E5E7EB", borderLeft: `3px solid ${NAVY}`, padding: "10px 14px" }}>
              <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.6 }}>Get a recording date before you hang up. If he offers one, take it. If he doesn't:</p>
              <div style={{ background: "#fff", borderLeft: `3px solid ${GOLD}`, padding: "6px 12px", margin: "7px 0", fontSize: 11.5, fontWeight: 600, color: NAVY }}>
                "What's a good week for you to record?"
              </div>
              <p style={{ fontSize: 10, color: "#6B7280" }}>Hosts schedule fast. Slow guests slip.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 20, paddingTop: 8, borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY }}>VaughnMartin · Readiness OS</span>
          <span style={{ ...BC, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF" }}>The Digital Exchange · Prep Reference · April 2026</span>
        </div>
      </div>
    </>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: 6 }}>
      {children}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <SectionLabel>{label}</SectionLabel>
      {children}
    </div>
  );
}

function HR() {
  return <div style={{ borderTop: "1px solid #E5E7EB", margin: "12px 0" }} />;
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#F0EDE4", borderLeft: "3px solid #C9A84C", padding: "8px 14px", fontSize: 11.5, fontWeight: 500, color: "#0A0F2E", lineHeight: 1.65 }}>
      {children}
    </div>
  );
}

function QA({ q, children }: { q: string; children: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#2B8A6E", marginBottom: 3 }}>{q}</div>
      <Quote>{`"${children}"`}</Quote>
    </div>
  );
}

function PrepItem({ time, children }: { time: string; children: string }) {
  return (
    <div style={{ padding: "7px 10px", border: "1px solid #E5E7EB", borderLeft: "2px solid #2B8A6E", marginBottom: 6 }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#2B8A6E", marginBottom: 3 }}>{time}</div>
      <p style={{ fontSize: 10.5, color: "#374151", lineHeight: 1.4 }}>{children}</p>
    </div>
  );
}
