import { useEffect } from "react";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { updatePageMetadata } from "@/lib/seo";

const NAVY  = "#0A0F2E";
const GOLD  = "#C9A84C";
const TEAL  = "#2B8A6E";
const IVORY = "#F0EDE4";

const GEO: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const BAR: React.CSSProperties = { fontFamily: "'Barlow', sans-serif" };
const BAR_C: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

function GoldRule() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "48px 0 40px" }}>
      <div style={{ flex: 1, height: 1, background: `${GOLD}30` }} />
      <div style={{ width: 5, height: 5, background: GOLD, transform: "rotate(45deg)" }} />
      <div style={{ flex: 1, height: 1, background: `${GOLD}30` }} />
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <div style={{ width: 24, height: 1, background: GOLD }} />
      <span style={{ ...BAR_C, fontSize: 10, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD }}>
        {children}
      </span>
    </div>
  );
}

function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <SectionLabel>{label}</SectionLabel>
      <h2 style={{ ...GEO, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 28 }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Body({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ ...BAR, fontSize: 17, color: "#2A2F4A", lineHeight: 1.85, marginBottom: 20, fontWeight: 400, ...style }}>
      {children}
    </p>
  );
}

function Emphasis({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ ...GEO, fontSize: 20, fontStyle: "italic", color: NAVY, lineHeight: 1.6, marginBottom: 24, fontWeight: 600, borderLeft: `3px solid ${GOLD}`, paddingLeft: 20 }}>
      {children}
    </p>
  );
}

function EnforcedItem({ title, children }: { title: string; children: string }) {
  return (
    <div style={{ borderTop: `1px solid ${GOLD}18`, paddingTop: 24, paddingBottom: 24 }}>
      <div style={{ ...BAR_C, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 10 }}>
        Enforced
      </div>
      <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 12 }}>{title}</div>
      <p style={{ ...BAR, fontSize: 16, color: "#2A2F4A", lineHeight: 1.8 }}>{children}</p>
    </div>
  );
}

function GateField({ number, title, optional, children }: { number: string; title: string; optional?: boolean; children: string }) {
  return (
    <div style={{ display: "flex", gap: 24, borderTop: `1px solid ${GOLD}18`, paddingTop: 28, paddingBottom: 28 }}>
      <div style={{ flexShrink: 0, width: 40, height: 40, background: `${GOLD}12`, border: `1px solid ${GOLD}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ ...GEO, fontSize: 20, fontWeight: 700, color: GOLD }}>{number}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div style={{ ...GEO, fontSize: 19, fontWeight: 700, color: NAVY }}>{title}</div>
          {optional && (
            <span style={{ ...BAR_C, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: TEAL, background: `${TEAL}12`, border: `1px solid ${TEAL}30`, padding: "2px 8px" }}>
              Optional
            </span>
          )}
        </div>
        <p style={{ ...BAR, fontSize: 16, color: "#2A2F4A", lineHeight: 1.8 }}>{children}</p>
      </div>
    </div>
  );
}

export default function DesignLogic() {
  useEffect(() => {
    updatePageMetadata(
      "The Design Logic Behind Readiness OS — VaughnMartin",
      "A written account of what was decided to enforce, what was deliberately left to the human, and why. For researchers and practitioners who prefer written engagement."
    );
  }, []);

  return (
    <div style={{ background: IVORY, minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <div style={{ background: NAVY, borderBottom: `1px solid ${GOLD}20` }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <VaughnMartinLogo size="sm" variant="light" />
          <div style={{ textAlign: "right" }}>
            <div style={{ ...BAR_C, fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD, marginBottom: 4 }}>
              Research Brief
            </div>
            <div style={{ ...BAR, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              For written engagement — not for general distribution
            </div>
          </div>
        </div>
      </div>

      {/* ── TITLE BLOCK ── */}
      <div style={{ background: NAVY, paddingBottom: 72 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <div style={{ width: 32, height: 1, background: TEAL }} />
            <span style={{ ...BAR_C, fontSize: 10, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: TEAL }}>
              Design Logic
            </span>
          </div>
          <h1 style={{ ...GEO, fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>
            The Design Logic<br />
            <em style={{ color: GOLD }}>Behind Readiness OS</em>
          </h1>
          <p style={{ ...BAR, fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 560, lineHeight: 1.75, marginBottom: 32 }}>
            A written account for those who prefer to engage with the architecture before the product.
            What was decided to enforce. What was deliberately left to the human. And why.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 1, height: 36, background: `${GOLD}30` }} />
            <div>
              <div style={{ ...BAR, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>Martin Brunke</div>
              <div style={{ ...BAR, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Founder, VaughnMartin · vaughnmartin.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "72px 32px 80px" }}>

        {/* WHERE THIS CAME FROM */}
        <Section label="Origin" title="Where This Came From">
          <Body>
            This document is not a product description. It is an attempt to write honestly about the design
            decisions behind Readiness OS in the way our exchanges have earned.
          </Body>
          <Body>
            The thinking behind this platform came from two completely different environments that kept
            pointing at the same gap.
          </Body>
          <Emphasis>
            Five years coaching football at Stanford.
          </Emphasis>
          <Body>
            In that environment no situation arrived without a prepared response. Not because the program
            was smarter or better resourced. Because the preparation architecture existed before the moment
            arrived. Every scenario had been thought through during the offseason. Every role was defined.
            Every decision had been pre-committed. When the game situation arrived the response deployed
            what had already been built. The coach's job was done before the clock started.
          </Body>
          <Emphasis>
            Twenty plus years inside Fortune 1000 organizations.
          </Emphasis>
          <Body>
            In that environment I was repeatedly the person handed the ask after the floor had already
            given way. No defined outcomes. No staged response. No consideration of current capacity or
            what was already in motion. Just deliver. The organization had frameworks. It had
            methodologies. It had consultants. What it did not have was preparation that activated when
            the trigger fired.
          </Body>
          <Body>
            That contrast is the origin of every design decision in this platform. Not as a theoretical
            framework. As a direct observation from someone who lived on both sides of the gap and could
            not understand why organizations with far more resources than a football program chose not to
            prepare the way the program did.
          </Body>
        </Section>

        <GoldRule />

        {/* CORE DESIGN THESIS */}
        <Section label="Foundation" title="The Core Design Thesis">
          <Emphasis>
            The preparation architecture has to exist before the trigger fires. Not as documentation.
            Not as a trained behavior. As infrastructure that activates the moment the threshold is crossed.
          </Emphasis>
          <Body>
            That thesis produced three specific design decisions that I want to explain honestly.
          </Body>
          <Body>
            First. What the system enforces structurally versus what it leaves to human judgment.
          </Body>
          <Body>
            Second. Why the Close Out Gate exists and why those four fields specifically.
          </Body>
          <Body>
            Third. Where I drew the boundary between architecture and human capacity and why I drew it there.
          </Body>
        </Section>

        <GoldRule />

        {/* WHAT I DECIDED TO ENFORCE */}
        <Section label="Structural Enforcement" title="What I Decided to Enforce Structurally">
          <Body>
            The system enforces six things before any execution begins.
          </Body>

          <EnforcedItem title="The Signal Threshold">
            The organization defines in advance what combination of data points constitutes a trigger. Not
            a single metric. A defined threshold built from multiple data points across the organization's
            specific context. The system monitors continuously and fires when the threshold is crossed.
            This is enforced because threshold definition under pressure is impossible. The organization
            must decide what constitutes an emergency before it is in one.
          </EnforcedItem>

          <EnforcedItem title="The Protocol Match">
            When the threshold is crossed the system matches the signal to the most relevant pre-staged
            protocol from the library. This is enforced because leaving protocol selection to the moment
            of pressure produces inconsistent outcomes. The selection happens before the pressure arrives.
          </EnforcedItem>

          <EnforcedItem title="The Four Decision Options">
            Before any execution begins the executive receives exactly four choices. Execute the
            pre-staged protocol exactly as built. Adjust the protocol before executing. Choose an entirely
            different protocol. Stand down with a governance record. This is enforced because it preserves
            executive authority while eliminating the blank screen problem. The executive is not handed a
            crisis and asked to improvise. They are handed a prepared response and asked to authorize or
            modify it.
          </EnforcedItem>

          <EnforcedItem title="The Task Deployment">
            When the executive authorizes, the tasks deploy simultaneously to pre-assigned owners. Not
            sequentially. Not after a coordination meeting. Simultaneously. This is enforced because
            sequential deployment is the primary source of mobilization delay.
          </EnforcedItem>

          <EnforcedItem title="The Stakeholder Notification">
            Pre-drafted communications go to pre-defined stakeholders through existing channels
            immediately upon authorization. Teams. Outlook. Email. This is enforced because communication
            under pressure is inconsistent by design. People say different things to different
            stakeholders. The pre-staged communications ensure consistency.
          </EnforcedItem>

          <EnforcedItem title="The Close Out Gate">
            Before the debrief advances, four fields must be completed. This is enforced because without
            structural enforcement the learning disappears. More on this below.
          </EnforcedItem>
        </Section>

        <GoldRule />

        {/* WHAT I LEFT TO THE HUMAN */}
        <Section label="Human Authority" title="What I Deliberately Left to the Human">
          <Emphasis>
            The system does not decide whether to act. The executive decides. Always.
          </Emphasis>
          <Body>
            This was the most important design decision in the platform and I want to be precise about why I made it.
          </Body>
          <Body>
            I could have built the system to execute automatically when a threshold is crossed. In
            financial infrastructure that is the right design. Machine speed decisions where the
            parameters are fully definable in advance and the accountability is mathematical.
          </Body>
          <Body>
            Strategic organizational response is different in kind. When an activist investor files a 13D
            the organization does not have a capital routing decision. It has an accountability decision.
            Who owns the response. What the board is told and when. What counsel is engaged and with what
            scope. What the public communication says. Those decisions carry legal exposure, reputational
            risk, and fiduciary responsibility that cannot be pre-coded because the accountability sits
            with a named human, not a protocol.
          </Body>
          <Body>
            The boundary I drew is this. The architecture supplies everything that can be prepared in
            advance. The human carries everything that requires judgment about the specific moment. The
            four decision options preserve that boundary precisely. The preparation is complete. The
            authorization is human. The execution follows the authorization.
          </Body>
          <Body>
            Removing that executive decision moment would not make the platform faster. It would make it
            ungovernable. The organizations I spent twenty years inside did not fail because decisions
            happened too slowly. They failed because nobody owned the decision when it arrived. The four
            options ensure that one person owns it every time.
          </Body>
        </Section>

        <GoldRule />

        {/* CLOSE OUT GATE */}
        <Section label="Learning Architecture" title="The Close Out Gate — Why Those Four Fields">
          <Body>
            The Close Out Gate blocks the debrief from advancing until four fields are completed. This
            design came directly from what our exchanges named about ownership as the thing that either
            transfers or does not.
          </Body>
          <Body>
            The four fields are specific and I want to explain each one honestly.
          </Body>

          <div style={{ marginTop: 8 }}>
            <GateField number="I" title="What Held">
              This field asks which prepared response worked exactly as designed under live conditions. Not
              which tasks were completed. Which element of the preparation proved itself under actual
              pressure. This field exists because organizations have no mechanism for identifying what
              actually worked. Post-mortems describe what happened. They rarely identify what about the
              preparation was responsible for the positive outcome. Without naming what held the
              organization cannot deliberately replicate it.
            </GateField>

            <GateField number="II" title="What Did Not Hold">
              This field asks where the preparation failed or deviated under live pressure. Not where
              execution was poor. Where the preparation itself was insufficient for the actual conditions.
              This field exists because the gap between preparation and reality is the most valuable
              learning the organization can capture. Every activation reveals something the preparation
              did not anticipate. That gap has to be named explicitly before it can be closed.
            </GateField>

            <GateField number="III" title="The Preparation Gap" optional>
              This field asks what conditions, decisions, or actors the protocol did not anticipate. It is
              the only optional field in the Close Out Gate. It is optional because sometimes the
              preparation was sufficient and the gap field has nothing honest to contribute. Making it
              required when it is empty produces compliance without substance. I chose to leave it
              optional because forced completion of an empty field produces worse data than an honest blank.
            </GateField>

            <GateField number="IV" title="The One Thing to Encode">
              This field asks for the single change that gets built back into the protocol before the next
              activation. Not a list. One thing. The constraint to one is deliberate. Lists of lessons
              learned are the primary reason organizational learning disappears. They are too long to act
              on and too vague to implement. One specific change that can be built into the protocol
              before the next activation is the only form of learning that actually compounds.
            </GateField>
          </div>

          <Body style={{ marginTop: 16 }}>
            The Close Out Gate as a whole exists because the preparation architecture and the learning
            architecture have to be connected by a structural enforcement mechanism. Without the gate the
            activation ends and the learning evaporates. With the gate the activation is not complete
            until the learning has been captured in a form that can be acted on.
          </Body>
          <Emphasis>
            Architecture creates the conditions where the choice to ignore is no longer invisible.
            The Close Out Gate is that architecture applied to the learning moment.
          </Emphasis>
        </Section>

        <GoldRule />

        {/* ADVANCE LOOP */}
        <Section label="Compounding Intelligence" title="The ADVANCE Loop — Why Three Activations">
          <Body>
            The ADVANCE loop classifies every protocol update as proven, disproven, or measuring. After
            three subsequent activations on the updated protocol the system classifies the hypothesis.
          </Body>
          <Body>
            Three activations is not arbitrary. One activation produces a data point. Two produces a
            comparison. Three produces a pattern. A pattern is the minimum evidence base for a governance
            decision about whether to encode a change permanently or reverse it.
          </Body>
          <Body>
            The proven versus disproven binary is also deliberate. A scoring scale produces analysis
            paralysis. The organization spends time debating what a 6.7 out of 10 means for protocol
            design. Proven or disproven forces a binary judgment that produces action. Either the change
            improved the response or it did not. Either encode it permanently or reverse it.
          </Body>
          <Emphasis>
            Every competitor in the coordination infrastructure space can be built from scratch in
            eighteen to twenty four months given sufficient capital. What cannot be rebuilt from scratch
            is three years of proven protocol improvements encoded from real activations.
          </Emphasis>
          <Body>
            The institutional memory that compounds with every use is the only moat that is genuinely
            irreversible.
          </Body>
        </Section>

        <GoldRule />

        {/* WHERE I DREW THE BOUNDARY */}
        <Section label="The Boundary" title="Where I Drew the Boundary">
          <Body>
            The line between what architecture can supply and what only human capacity can carry sits at
            the moment of authorization.
          </Body>
          <Body>
            Everything before that moment belongs to the architecture. Signal detection. Pattern matching.
            Protocol staging. Task assignment. Communication drafting. Stakeholder mapping. Budget
            routing. All of it is built before the trigger fires and deployed the moment the threshold is
            crossed.
          </Body>
          <Body>
            The authorization moment belongs to the human. Not because the architecture could not
            automate it. Because the accountability for what follows the authorization cannot be delegated
            to a protocol. The human who authorizes the response owns the outcome. That ownership is the
            governance record the organization needs and the architecture cannot supply.
          </Body>
          <Body>
            After the authorization everything returns to the architecture. Task coordination. Stakeholder
            notification. Communication deployment. Progress tracking. Close Out Gate enforcement.
            ADVANCE loop classification. All of it runs without requiring the executive to manage the
            execution.
          </Body>
          <Emphasis>
            The boundary is narrow by design. One moment of human judgment surrounded by architecture
            that makes that judgment possible before the pressure arrives and accountable after it is made.
          </Emphasis>
        </Section>

        <GoldRule />

        {/* WHAT I HAVE NOT YET SOLVED */}
        <Section label="The Open Question" title="What I Have Not Yet Solved">
          <Body>
            I want to be honest about the gap that the product has not yet closed.
          </Body>
          <Body>
            The Close Out Gate enforces that the learning is captured. The ADVANCE loop enforces that the
            learning is classified and encoded. What neither of them yet fully addresses is whether the
            organization has developed enough operational trust in the prepared response to actually deploy
            it rather than reverting to the familiar default when the pressure arrives.
          </Body>
          <Body>
            The behavioral confidence gap is real and I have seen it repeatedly. The infrastructure
            exists. The protocol exists. The executive has the four options in front of them. And they
            still call the same person they always call and start the familiar thirty day cycle anyway
            because the old behavior feels safer under pressure than the new infrastructure.
          </Body>
          <Body>
            I believe the answer to that gap is activation history. The more times the organization
            deploys the platform under real conditions the more the institutional trust builds. The
            ADVANCE loop measures that trust indirectly through response time improvement. But the
            behavioral confidence layer is upstream of what the architecture can currently measure.
          </Body>
          <Body>
            That intersection between preparation architecture and behavioral confidence is where the next
            decade of this work sits. The boundary between what architecture can supply and what only
            human capacity can carry — that line is one I will keep building on for a long time.
          </Body>
        </Section>

        <GoldRule />

        {/* CLOSING */}
        <div style={{ textAlign: "center", paddingTop: 16, paddingBottom: 16 }}>
          <p style={{ ...GEO, fontSize: 26, fontStyle: "italic", fontWeight: 600, color: NAVY, lineHeight: 1.5, marginBottom: 8 }}>
            The response is ready before the trigger fires.
          </p>
          <p style={{ ...BAR, fontSize: 14, color: "#6B7280", marginBottom: 0 }}>
            That is not a tagline. It is the design requirement every decision in this platform was built to meet.
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: NAVY, borderTop: `1px solid ${GOLD}20`, padding: "40px 32px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 16, textAlign: "center" }}>
          <VaughnMartinLogo size="sm" variant="light" />
          <p style={{ ...BAR, fontSize: 14, color: "rgba(255,255,255,0.45)", maxWidth: 480, lineHeight: 1.7, margin: 0 }}>
            Written accounts of platform design decisions are available for researchers and practitioners
            who prefer written engagement. To send a considered response or continue the exchange:
          </p>
          <a
            href="mailto:info@vaughnmartin.com?subject=Design Logic — Response"
            style={{ ...BAR_C, fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, textDecoration: "none", border: `1px solid ${GOLD}40`, padding: "12px 28px", display: "inline-block" }}
          >
            Send a Response → info@vaughnmartin.com
          </a>
          <p style={{ ...BAR, fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>
            VaughnMartin · Readiness OS · vaughnmartin.com
          </p>
        </div>
      </div>

    </div>
  );
}
