import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";

const SECTIONS = [
  { id: "identity", label: "Reviewer Info", letter: "—" },
  { id: "A", label: "The Problem Space", letter: "A" },
  { id: "B", label: "Product Clarity", letter: "B" },
  { id: "C", label: "Market Viability", letter: "C" },
  { id: "D", label: "Product Gaps", letter: "D" },
  { id: "E", label: "Competitive Landscape", letter: "E" },
  { id: "F", label: "Overall Verdict", letter: "F" },
];

const Q2_OPTIONS = [
  "Less than 2 hours",
  "2–8 hours",
  "8–24 hours",
  "1–3 days",
  "3–7 days",
  "More than a week",
  "It varied widely depending on the type of event",
];

const Q9_OPTIONS = [
  "A genuinely new category of enterprise software I have not seen before",
  "An improvement on existing project management tools",
  "An improvement on existing crisis management tools",
  "A workflow automation tool with a strategic framing",
  "A signal-based coordination infrastructure tool",
  "A coordination infrastructure layer — the missing piece between strategy and execution",
  "Something I am still not sure how to categorize",
];

const Q11_OPTIONS = [
  "CEO", "COO / Chief Operating Officer", "CFO / Chief Financial Officer",
  "Chief of Staff", "PMO Director / VP of Program Management",
  "CHRO / Chief People Officer", "CTO / Chief Technology Officer",
  "Board of Directors / Audit Committee", "I do not see a clear buyer",
];

const Q12_OPTIONS = [
  "The problem is not felt acutely enough to justify a budget",
  "The ROI is difficult to quantify or justify internally",
  "IT or procurement would block or delay the purchase process",
  "Leadership would want to solve this with existing tools (Jira, Slack, etc.)",
  "The 12-minute claim feels too good to be true",
  "Concern about the complexity of onboarding and setup",
  "Concern about whether the platform is enterprise-grade / secure",
  "The product is not differentiated enough from existing alternatives",
  "No budget category exists for this type of tool",
];

const Q13_OPTIONS = [
  "Under $10,000", "$10,000 – $25,000", "$25,000 – $50,000",
  "$50,000 – $100,000", "Over $100,000",
  "I cannot assess without knowing more about the implementation scope",
  "I would not expect an organization to pay for a pilot — it should be free",
];

const Q14_INDUSTRIES = [
  "Financial services / banking / insurance",
  "Healthcare / life sciences / pharma",
  "Manufacturing / industrial / supply chain",
  "Technology / SaaS companies",
  "Private equity portfolio companies",
  "Government / defense / public sector",
  "Gaming / hospitality / entertainment",
  "Retail / consumer / e-commerce",
  "Energy / utilities / infrastructure",
];

const Q16_DIMENSIONS = [
  "Clarity of the user interface",
  "Ease of understanding what to do first",
  "Credibility of the Readiness Protocol library",
  "Quality of the system-analyzed insights",
  "Relevance of signal monitoring to real events",
  "Depth of the post-activation (ADVANCE) experience",
  "Overall enterprise readiness / polish",
  "Confidence it would work in a real strategic event",
];

const Q20_OPTIONS = [
  "Yes — I am aware of a direct competitor",
  "I am aware of partial alternatives that overlap in some areas",
  "I am not aware of anything that does exactly this",
  "I am not sure",
];

const Q24_OPTIONS = [
  "I would purchase or pilot it immediately",
  "I would add it to the shortlist for evaluation",
  "I would monitor it and revisit in 6-12 months",
  "I would not pursue it — the fit is not strong enough",
  "I would not pursue it — the product is not mature enough",
  "I would not pursue it — the problem is not acute enough in my context",
];

const Q26_OPTIONS = [
  "Yes — I would refer it actively and enthusiastically",
  "Yes — I would mention it if the context came up naturally",
  "Maybe — I would want to see more development first",
  "No — I would not refer it in its current form",
];

function ScaleInput({ value, onChange, labels }: { value: number | null; onChange: (v: number) => void; labels: [string, string] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => onChange(n)} style={{
            width: 44, height: 44, border: `2px solid ${value === n ? GOLD : BORDER}`,
            background: value === n ? GOLD : "white", color: value === n ? NAVY : MUTED,
            fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.15s",
            borderRadius: 0,
          }}>{n}</button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: MUTED }}>
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
      </div>
    </div>
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder || "Your response..."}
      rows={rows}
      style={{
        width: "100%", padding: "10px 14px", border: `1px solid ${BORDER}`,
        borderRadius: 0, fontFamily: "'Barlow', sans-serif", fontSize: 14,
        resize: "vertical", color: NAVY, outline: "none", boxSizing: "border-box",
        lineHeight: 1.6,
      }}
    />
  );
}

function CheckboxGroup({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt];
    onChange(next);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {options.map(opt => (
        <label key={opt} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
          <div onClick={() => toggle(opt)} style={{
            width: 18, height: 18, minWidth: 18, border: `2px solid ${selected.includes(opt) ? GOLD : BORDER}`,
            background: selected.includes(opt) ? GOLD : "white", marginTop: 1,
            display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 0,
          }}>
            {selected.includes(opt) && <span style={{ color: NAVY, fontWeight: 900, fontSize: 11 }}>✓</span>}
          </div>
          <span style={{ fontSize: 14, color: NAVY, lineHeight: 1.5 }}>{opt}</span>
        </label>
      ))}
    </div>
  );
}

function RadioGroup({ options, selected, onChange }: { options: string[]; selected: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {options.map(opt => (
        <label key={opt} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
          <div onClick={() => onChange(opt)} style={{
            width: 18, height: 18, minWidth: 18, border: `2px solid ${selected === opt ? GOLD : BORDER}`,
            background: selected === opt ? GOLD : "white", marginTop: 1, borderRadius: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {selected === opt && <div style={{ width: 7, height: 7, borderRadius: 0, background: NAVY }} />}
          </div>
          <span style={{ fontSize: 14, color: NAVY, lineHeight: 1.5 }}>{opt}</span>
        </label>
      ))}
    </div>
  );
}

function QBlock({ num, question, note, children }: { num: string; question: string; note?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: GOLD, minWidth: 28 }}>{num}</span>
        <div>
          <p style={{ fontWeight: 600, fontSize: 15, color: NAVY, margin: 0, lineHeight: 1.5 }}>{question}</p>
          {note && <p style={{ fontSize: 13, color: MUTED, margin: "4px 0 0", lineHeight: 1.5 }}>{note}</p>}
        </div>
      </div>
      <div style={{ paddingLeft: 40 }}>{children}</div>
    </div>
  );
}

function FollowUp({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginTop: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</p>
      <TextArea value={value} onChange={onChange} />
    </div>
  );
}

export default function PeerReview() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [identity, setIdentity] = useState({ reviewerName: "", reviewerRole: "", reviewerOrg: "", reviewerIndustry: "", yearsExperience: "", reviewerType: "peer" });

  // Section A
  const [q1Scale, setQ1Scale] = useState<number | null>(null);
  const [q1Text, setQ1Text] = useState("");
  const [q2Selection, setQ2Selection] = useState("");
  const [q2Text, setQ2Text] = useState("");
  const [q3Scale, setQ3Scale] = useState<number | null>(null);
  const [q3Text, setQ3Text] = useState("");
  const [q4Scale, setQ4Scale] = useState<number | null>(null);
  const [q4Text, setQ4Text] = useState("");

  // Section B
  const [q5Scale, setQ5Scale] = useState<number | null>(null);
  const [q5Text, setQ5Text] = useState("");
  const [q6Text, setQ6Text] = useState("");
  const [q7Scale, setQ7Scale] = useState<number | null>(null);
  const [q7Text, setQ7Text] = useState("");
  const [q8Scale, setQ8Scale] = useState<number | null>(null);
  const [q8Text, setQ8Text] = useState("");
  const [q9Selections, setQ9Selections] = useState<string[]>([]);
  const [q9Text, setQ9Text] = useState("");

  // Section C
  const [q10Scale, setQ10Scale] = useState<number | null>(null);
  const [q10Text, setQ10Text] = useState("");
  const [q11Selection, setQ11Selection] = useState("");
  const [q11Text, setQ11Text] = useState("");
  const [q12Selections, setQ12Selections] = useState<string[]>([]);
  const [q12Text, setQ12Text] = useState("");
  const [q13Selection, setQ13Selection] = useState("");
  const [q13Text, setQ13Text] = useState("");
  const [q14Rankings, setQ14Rankings] = useState<{ industry: string; priority: string; comments: string }[]>(
    Q14_INDUSTRIES.map(i => ({ industry: i, priority: "", comments: "" }))
  );

  // Section D
  const [q15Text, setQ15Text] = useState("");
  const [q16Ratings, setQ16Ratings] = useState<Record<string, { score: number | null; comments: string }>>(() =>
    Object.fromEntries(Q16_DIMENSIONS.map(d => [d, { score: null, comments: "" }]))
  );
  const [q17Text, setQ17Text] = useState("");
  const [q18Text, setQ18Text] = useState("");
  const [q19Text, setQ19Text] = useState("");

  // Section E
  const [q20Selection, setQ20Selection] = useState("");
  const [q20Text, setQ20Text] = useState("");
  const [q21Scale, setQ21Scale] = useState<number | null>(null);
  const [q21Text, setQ21Text] = useState("");
  const [q22Text, setQ22Text] = useState("");

  // Section F
  const [q23Scale, setQ23Scale] = useState<number | null>(null);
  const [q24Selection, setQ24Selection] = useState("");
  const [q24Text, setQ24Text] = useState("");
  const [q25Scale, setQ25Scale] = useState<number | null>(null);
  const [q25Text, setQ25Text] = useState("");
  const [q26Selection, setQ26Selection] = useState("");
  const [q27Text, setQ27Text] = useState("");
  const [q28Text, setQ28Text] = useState("");

  const mutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/peer-reviews", data),
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = () => {
    const q16Flat: Record<string, any> = {};
    Object.entries(q16Ratings).forEach(([dim, val]) => { q16Flat[dim] = val; });
    mutation.mutate({
      ...identity,
      q1Scale, q1Text, q2Selection, q2Text, q3Scale, q3Text, q4Scale, q4Text,
      q5Scale, q5Text, q6Text, q7Scale, q7Text, q8Scale, q8Text, q9Selections, q9Text,
      q10Scale, q10Text, q11Selection, q11Text, q12Selections, q12Text, q13Selection, q13Text,
      q14Rankings: q14Rankings.filter(r => r.priority),
      q15Text, q16Ratings: q16Flat, q17Text, q18Text, q19Text,
      q20Selection, q20Text, q21Scale, q21Text, q22Text,
      q23Scale, q24Selection, q24Text, q25Scale, q25Text, q26Selection, q27Text, q28Text,
      sourceUrl: window.location.href,
    });
  };

  if (submitted) {
    return (
      <div style={{ background: NAVY, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
        <div style={{ maxWidth: 480 }}>
          <div style={{ width: 64, height: 64, borderRadius: 0, background: TEAL, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px", fontSize: 28 }}>✓</div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>VaughnMartin · Readiness OS</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, color: "white", marginBottom: 16 }}>Thank You</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 32 }}>
            Your candid assessment is one of the most valuable inputs a founder can receive.
            We will review your feedback carefully and may follow up if you indicated openness to further dialogue.
          </p>
          <a href="/" style={{ display: "inline-block", background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13, padding: "12px 28px", textDecoration: "none", letterSpacing: "0.05em" }}>
            Return to VaughnMartin
          </a>
        </div>
      </div>
    );
  }

  const progress = Math.round((step / (SECTIONS.length - 1)) * 100);

  return (
    <div style={{ background: OFF, minHeight: "100vh", fontFamily: "'Barlow', sans-serif" }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <a href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>VaughnMartin · Readiness OS</div>
          </a>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Independent Peer Review & Assessment</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <a href="/" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textDecoration: "none", fontWeight: 600 }}>← Return to Homepage</a>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Estimated time: 25–35 minutes</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "#E8E4DC" }}>
        <div style={{ height: "100%", background: GOLD, width: `${progress}%`, transition: "width 0.3s" }} />
      </div>

      {/* Section tabs */}
      <div style={{ background: "white", borderBottom: `1px solid ${BORDER}`, padding: "0 40px", display: "flex", gap: 0, overflowX: "auto" }}>
        {SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => i <= step && setStep(i)} style={{
            padding: "14px 20px", border: "none", background: "none", cursor: i <= step ? "pointer" : "default",
            fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
            color: step === i ? NAVY : i < step ? TEAL : MUTED,
            borderBottom: `2px solid ${step === i ? GOLD : "transparent"}`,
            whiteSpace: "nowrap",
          }}>
            {s.letter !== "—" && <span style={{ color: GOLD, marginRight: 6 }}>{s.letter}</span>}
            {s.label}
            {i < step && <span style={{ marginLeft: 6, color: TEAL }}>✓</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* IDENTITY */}
        {step === 0 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: NAVY, margin: "0 0 8px" }}>Reviewer Information</h2>
              <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                This questionnaire is designed to capture your unfiltered professional perspective. There are no right or wrong answers.
                Critical, skeptical, and negative feedback is as valuable — often more valuable — than positive feedback.
              </p>
            </div>
            {[
              { label: "Full Name", key: "reviewerName", placeholder: "Your full name" },
              { label: "Current Role / Title", key: "reviewerRole", placeholder: "e.g. Chief Operating Officer" },
              { label: "Organization / Industry", key: "reviewerOrg", placeholder: "Company name and industry" },
              { label: "Years of Executive Experience", key: "yearsExperience", placeholder: "e.g. 15 years" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }}>{f.label}</label>
                <input
                  value={(identity as any)[f.key]}
                  onChange={e => setIdentity(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ width: "100%", padding: "10px 14px", border: `1px solid ${BORDER}`, borderRadius: 0, fontSize: 14, color: NAVY, boxSizing: "border-box", fontFamily: "'Barlow', sans-serif" }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }}>You are reviewing as a…</label>
              <RadioGroup options={["Potential customer / enterprise leader", "Investor / venture capital", "Industry peer / advisor"]}
                selected={identity.reviewerType === "customer" ? "Potential customer / enterprise leader" : identity.reviewerType === "investor" ? "Investor / venture capital" : "Industry peer / advisor"}
                onChange={v => setIdentity(prev => ({ ...prev, reviewerType: v.includes("customer") ? "customer" : v.includes("investor") ? "investor" : "peer" }))} />
            </div>
          </div>
        )}

        {/* SECTION A */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Section A</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: NAVY, margin: "0 0 8px" }}>The Problem Space</h2>
              <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>Does this problem actually exist in your world? Answer before evaluating the product.</p>
            </div>
            <QBlock num="Q1" question="How significant is the gap between when a strategic event occurs and when a coordinated organizational response actually begins?"
              note="A strategic event could be: a competitor move, regulatory change, leadership disruption, supply chain failure, or M&A trigger.">
              <ScaleInput value={q1Scale} onChange={setQ1Scale} labels={["Not significant", "Highly significant"]} />
              <FollowUp label="What typically causes this gap in your experience?" value={q1Text} onChange={setQ1Text} />
            </QBlock>
            <QBlock num="Q2" question="In your current or most recent organization, roughly how long did it typically take from a strategic trigger to having the right people aligned with a clear response plan?">
              <RadioGroup options={Q2_OPTIONS} selected={q2Selection} onChange={setQ2Selection} />
              <FollowUp label="What factors most influenced that timeline?" value={q2Text} onChange={setQ2Text} />
            </QBlock>
            <QBlock num="Q3" question="How often have you observed an organization miss a strategic window because the response was too slow?">
              <ScaleInput value={q3Scale} onChange={setQ3Scale} labels={["Never", "Consistently"]} />
              <FollowUp label="Describe a situation where response speed materially affected the outcome." value={q3Text} onChange={setQ3Text} />
            </QBlock>
            <QBlock num="Q4" question="How well do organizations you have worked in or with handle pre-staged, pre-defined responses to predictable strategic situations?"
              note="For example: a documented plan that activates automatically when a competitor makes a move, rather than convening a new meeting to figure out what to do.">
              <ScaleInput value={q4Scale} onChange={setQ4Scale} labels={["Very poorly", "Very well"]} />
              <FollowUp label="What is the primary reason organizations do not pre-stage strategic responses?" value={q4Text} onChange={setQ4Text} />
            </QBlock>
          </div>
        )}

        {/* SECTION B */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Section B</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: NAVY, margin: "0 0 8px" }}>Product Clarity & Value Proposition</h2>
              <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>Does the product make sense? Is the value real?</p>
            </div>
            <QBlock num="Q5" question="After your review of Readiness OS, how clearly did you understand what the product actually does?">
              <ScaleInput value={q5Scale} onChange={setQ5Scale} labels={["Not at all clear", "Completely clear"]} />
              <FollowUp label="What was the most confusing or unclear aspect?" value={q5Text} onChange={setQ5Text} />
            </QBlock>
            <QBlock num="Q6" question="In your own words, what does Readiness OS do?" note="Write this as if explaining it to a peer who has not seen it.">
              <TextArea value={q6Text} onChange={setQ6Text} rows={5} placeholder="Your description..." />
            </QBlock>
            <QBlock num="Q7" question="How credible is the core claim that an organization can go from strategic trigger to coordinated execution in 12 minutes?"
              note="Specifically: the right Readiness Protocol is activated, roles assigned, documents staged, and execution begins — not that the full response is complete.">
              <ScaleInput value={q7Scale} onChange={setQ7Scale} labels={["Not credible", "Fully credible"]} />
              <FollowUp label="What would make this claim more credible to you?" value={q7Text} onChange={setQ7Text} />
            </QBlock>
            <QBlock num="Q8" question="How compelling is the core value proposition — reducing organizational response time from 30 days to 12 minutes through pre-staged execution Readiness Protocols?">
              <ScaleInput value={q8Scale} onChange={setQ8Scale} labels={["Not compelling", "Highly compelling"]} />
              <FollowUp label="What would make this value proposition more compelling?" value={q8Text} onChange={setQ8Text} />
            </QBlock>
            <QBlock num="Q9" question="Which of the following best describes how you see Readiness OS after your review?" note="Select all that apply.">
              <CheckboxGroup options={Q9_OPTIONS} selected={q9Selections} onChange={setQ9Selections} />
              <FollowUp label="Other / additional context" value={q9Text} onChange={setQ9Text} />
            </QBlock>
          </div>
        )}

        {/* SECTION C */}
        {step === 3 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Section C</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: NAVY, margin: "0 0 8px" }}>Market Viability</h2>
              <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>Is there a real market? Will organizations actually buy this?</p>
            </div>
            <QBlock num="Q10" question="Do you believe there is a genuine market need for a product like Readiness OS?">
              <ScaleInput value={q10Scale} onChange={setQ10Scale} labels={["Definitely not", "Definitely yes"]} />
              <FollowUp label="What is the basis for your view?" value={q10Text} onChange={setQ10Text} />
            </QBlock>
            <QBlock num="Q11" question="Who in an organization would most likely be the person to champion a purchase of Readiness OS?" note="Select the single most likely buyer.">
              <RadioGroup options={Q11_OPTIONS} selected={q11Selection} onChange={setQ11Selection} />
              <FollowUp label="Who would be the most likely blocker of a purchase?" value={q11Text} onChange={setQ11Text} />
            </QBlock>
            <QBlock num="Q12" question="What would most likely prevent an organization from purchasing Readiness OS?" note="Select all that apply.">
              <CheckboxGroup options={Q12_OPTIONS} selected={q12Selections} onChange={setQ12Selections} />
              <FollowUp label="Other barriers" value={q12Text} onChange={setQ12Text} />
            </QBlock>
            <QBlock num="Q13" question="At what price point would a 90-day pilot of Readiness OS represent good value to an enterprise organization?">
              <RadioGroup options={Q13_OPTIONS} selected={q13Selection} onChange={setQ13Selection} />
              <FollowUp label="What would need to be true for the pilot to be worth that investment?" value={q13Text} onChange={setQ13Text} />
            </QBlock>
            <QBlock num="Q14" question="Which industries or organizational types would most immediately benefit from Readiness OS?" note="Set H (High), M (Medium), or L (Low) priority for each.">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {q14Rankings.map((row, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "center", padding: "10px 14px", background: "white", border: `1px solid ${BORDER}`, borderRadius: 0 }}>
                    <span style={{ fontSize: 13, color: NAVY }}>{row.industry}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["H", "M", "L"].map(p => (
                        <button key={p} onClick={() => {
                          const next = [...q14Rankings];
                          next[i] = { ...next[i], priority: next[i].priority === p ? "" : p };
                          setQ14Rankings(next);
                        }} style={{
                          width: 32, height: 32, border: `2px solid ${row.priority === p ? (p === "H" ? TEAL : p === "M" ? GOLD : MUTED) : BORDER}`,
                          background: row.priority === p ? (p === "H" ? TEAL : p === "M" ? GOLD : "#E8E4DC") : "white",
                          color: row.priority === p ? (p === "M" ? NAVY : "white") : MUTED,
                          fontWeight: 700, fontSize: 11, cursor: "pointer", borderRadius: 0,
                        }}>{p}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </QBlock>
          </div>
        )}

        {/* SECTION D */}
        {step === 4 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Section D</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: NAVY, margin: "0 0 8px" }}>Product Gaps & Improvement Areas</h2>
              <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>What is missing? What would make this better? Diplomatic answers are less useful here than honest ones.</p>
            </div>
            <QBlock num="Q15" question="What is the single most significant gap or weakness you identified in Readiness OS?">
              <TextArea value={q15Text} onChange={setQ15Text} rows={4} />
            </QBlock>
            <QBlock num="Q16" question="Rate the following product dimensions as you experienced them." note="1 = Poor, 5 = Excellent">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {Q16_DIMENSIONS.map(dim => (
                  <div key={dim} style={{ padding: "14px 16px", background: "white", border: `1px solid ${BORDER}`, borderRadius: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: NAVY, margin: "0 0 10px" }}>{dim}</p>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} onClick={() => setQ16Ratings(prev => ({ ...prev, [dim]: { ...prev[dim], score: n } }))} style={{
                          width: 36, height: 36, border: `2px solid ${q16Ratings[dim]?.score === n ? GOLD : BORDER}`,
                          background: q16Ratings[dim]?.score === n ? GOLD : "white",
                          color: q16Ratings[dim]?.score === n ? NAVY : MUTED,
                          fontWeight: 700, fontSize: 13, cursor: "pointer", borderRadius: 0,
                        }}>{n}</button>
                      ))}
                    </div>
                    <input
                      value={q16Ratings[dim]?.comments || ""}
                      onChange={e => setQ16Ratings(prev => ({ ...prev, [dim]: { ...prev[dim], comments: e.target.value } }))}
                      placeholder="Comments (optional)"
                      style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 0, fontSize: 13, color: NAVY, boxSizing: "border-box", fontFamily: "'Barlow', sans-serif" }}
                    />
                  </div>
                ))}
              </div>
            </QBlock>
            <QBlock num="Q17" question="What features or capabilities that are currently missing would most increase the product's value to you or your organization?">
              <TextArea value={q17Text} onChange={setQ17Text} rows={4} />
            </QBlock>
            <QBlock num="Q18" question="If you were advising the founder on the single most important thing to fix or build before going to market, what would it be?">
              <TextArea value={q18Text} onChange={setQ18Text} rows={4} />
            </QBlock>
            <QBlock num="Q19" question="Are there existing tools or platforms in your organization that Readiness OS would need to displace or integrate with to be adopted?">
              <TextArea value={q19Text} onChange={setQ19Text} rows={3} />
            </QBlock>
          </div>
        )}

        {/* SECTION E */}
        {step === 5 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Section E</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: NAVY, margin: "0 0 8px" }}>Competitive Landscape</h2>
              <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>How does this compare to what already exists?</p>
            </div>
            <QBlock num="Q20" question="Are you aware of any existing product or platform that does what Readiness OS does — specifically pre-staged, AI-activated strategic execution Readiness Protocols that deploy across an organization in minutes?">
              <RadioGroup options={Q20_OPTIONS} selected={q20Selection} onChange={setQ20Selection} />
              <FollowUp label="If yes, what product(s) come closest and why?" value={q20Text} onChange={setQ20Text} />
            </QBlock>
            <QBlock num="Q21" question="How does Readiness OS compare to the tools your organization currently uses to manage strategic response situations?">
              <ScaleInput value={q21Scale} onChange={setQ21Scale} labels={["Much worse", "Much better"]} />
              <FollowUp label="What are the most meaningful differences — positive or negative?" value={q21Text} onChange={setQ21Text} />
            </QBlock>
            <QBlock num="Q22" question="What is the strongest competitive argument against Readiness OS — the reason a well-informed buyer might choose to do nothing or use an alternative?">
              <TextArea value={q22Text} onChange={setQ22Text} rows={4} />
            </QBlock>
          </div>
        )}

        {/* SECTION F */}
        {step === 6 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Section F</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: NAVY, margin: "0 0 8px" }}>Overall Verdict</h2>
              <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>Bottom line — would you buy it, recommend it, or walk away? Please be direct.</p>
            </div>
            <QBlock num="Q23" question="Overall, how would you rate Readiness OS as a product?">
              <ScaleInput value={q23Scale} onChange={setQ23Scale} labels={["Poor", "Excellent"]} />
            </QBlock>
            <QBlock num="Q24" question="If you were the decision-maker at your organization, what would you do?">
              <RadioGroup options={Q24_OPTIONS} selected={q24Selection} onChange={setQ24Selection} />
              <FollowUp label="What would need to change to move you to the next category up?" value={q24Text} onChange={setQ24Text} />
            </QBlock>
            <QBlock num="Q25" question="Do you believe Readiness OS is a viable commercial product in the real world?">
              <ScaleInput value={q25Scale} onChange={setQ25Scale} labels={["Definitely not", "Definitely yes"]} />
              <FollowUp label="What is the basis for your view?" value={q25Text} onChange={setQ25Text} />
            </QBlock>
            <QBlock num="Q26" question="Would you refer Readiness OS to a peer or colleague in a relevant role?">
              <RadioGroup options={Q26_OPTIONS} selected={q26Selection} onChange={setQ26Selection} />
            </QBlock>
            <QBlock num="Q27" question="What is the one thing the founder could do in the next 30 days that would most increase your confidence in this product and company?">
              <TextArea value={q27Text} onChange={setQ27Text} rows={4} />
            </QBlock>
            <QBlock num="Q28" question="Is there anything else you want the founder to hear — something that was not covered by the questions above?">
              <TextArea value={q28Text} onChange={setQ28Text} rows={4} />
            </QBlock>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 24, borderTop: `1px solid ${BORDER}` }}>
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} style={{ padding: "12px 28px", border: `1px solid ${BORDER}`, background: "white", color: NAVY, fontWeight: 600, fontSize: 14, cursor: "pointer", borderRadius: 0 }}>
              ← Back
            </button>
          ) : <div />}

          {step < SECTIONS.length - 1 ? (
            <button
              onClick={() => {
                if (step === 0 && (!identity.reviewerName || !identity.reviewerRole || !identity.reviewerOrg)) {
                  alert("Please complete Name, Role, and Organization before continuing.");
                  return;
                }
                setStep(s => s + 1);
                window.scrollTo(0, 0);
              }}
              style={{ padding: "12px 36px", background: NAVY, color: "white", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", borderRadius: 0, letterSpacing: "0.05em" }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              style={{ padding: "14px 40px", background: GOLD, color: NAVY, border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer", borderRadius: 0, letterSpacing: "0.05em", opacity: mutation.isPending ? 0.7 : 1 }}
            >
              {mutation.isPending ? "Submitting..." : "Submit Assessment →"}
            </button>
          )}
        </div>
        {mutation.isError && <p style={{ color: "#DC2626", fontSize: 13, marginTop: 12, textAlign: "right" }}>Submission failed. Please try again.</p>}
      </div>
    </div>
  );
}
