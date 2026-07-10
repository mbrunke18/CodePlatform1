import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from "@/components/layout/PageLayout";
import { 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Shield, 
  Target, 
  Layers, 
  RefreshCw,
  BarChart3
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const MATURITY_LEVELS = [
  {
    level: 1,
    name: "Reactive",
    tagline: "Improvisation by Default",
    color: "#EF4444",
    description: "Every situation is handled as a first-time event. Response relies on heroics and long hours, not infrastructure. Mobilization takes weeks, not minutes.",
    characteristics: [
      "No pre-staged protocols or playbooks",
      "Decision rights are debated during the crisis",
      "Stakeholders are identified from scratch every time",
      "High executive burnout and 'firefighting' culture"
    ]
  },
  {
    level: 2,
    name: "Repeatable",
    tagline: "Person-Dependent Process",
    color: "#F59E0B",
    description: "Some documentation exists, but execution depends on specific individuals. If the key person is unavailable, the response collapses.",
    characteristics: [
      "Static PDFs or Word docs that are rarely updated",
      "Knowledge exists in heads, not in systems",
      "Coordination happens via manual email chains",
      "Response time varies wildly depending on the team"
    ]
  },
  {
    level: 3,
    name: "Prepared",
    tagline: "Infrastructure-Led Response",
    color: GOLD,
    description: "Core protocols are pre-staged and ownership is clear. The organization has moved from 'how do we respond' to 'executing the response'.",
    characteristics: [
      "Top 10-20 scenarios have pre-staged protocols",
      "Authority chains and budget pre-authorized",
      "Communication templates ready in advance",
      "Mobilization time reduced from weeks to days"
    ]
  },
  {
    level: 4,
    name: "Adaptive",
    tagline: "System-Orchestrated Execution",
    color: TEAL,
    description: "Live signals trigger automated notifications. Execution is tracked in real-time, and every activation feeds back into the system.",
    characteristics: [
      "Signal detection connected to protocol activation",
      "Real-time visibility into task completion",
      "Post-activation debriefs are structured and mandatory",
      "12-minute mobilization target is consistently met"
    ]
  },
  {
    level: 5,
    name: "Autonomous",
    tagline: "Continuous Readiness",
    color: "#1E3A8A",
    description: "Readiness is a core operating competency. The system identifies threats and opportunities before they manifest, and the organization is always in a state of prepared response.",
    characteristics: [
      "Predictive signal monitoring across all domains",
      "Self-updating protocols based on execution data",
      "Zero mobilization overhead; pure execution",
      "Readiness is a competitive advantage and board-level KPI"
    ]
  }
];

const QUESTIONS = [
  {
    id: 1,
    question: "How long does it typically take to assemble the full decision-making team for a new strategic situation?",
    options: [
      { text: "Weeks — We spend the first few days just identifying who needs to be in the room.", points: 1 },
      { text: "Days — We know roughly who to call, but it takes time to clear schedules and align.", points: 2 },
      { text: "Hours — We have a list of stakeholders, but notifications are manual.", points: 3 },
      { text: "Minutes — Stakeholder groups are pre-defined and auto-notified via the system.", points: 5 }
    ]
  },
  {
    id: 2,
    question: "When a crisis or opportunity hits, who has the final authority to authorize emergency budget or action?",
    options: [
      { text: "Unclear — We usually have to call an emergency board or steering committee meeting.", points: 1 },
      { text: "General — We know which exec, but their specific limits aren't set in advance.", points: 2 },
      { text: "Defined — Decision rights are documented in a policy somewhere.", points: 3 },
      { text: "Pre-Authorized — Authorization thresholds are built into the protocols for immediate sign-off.", points: 5 }
    ]
  },
  {
    id: 3,
    question: "How are your response playbooks or protocols stored and maintained?",
    options: [
      { text: "We don't have formal playbooks for most situations.", points: 1 },
      { text: "Static documents (PDF/Word) on a shared drive or SharePoint.", points: 2 },
      { text: "A digital repository that we review annually.", points: 3 },
      { text: "Living protocols that are updated automatically after every activation or drill.", points: 5 }
    ]
  },
  {
    id: 4,
    question: "How do you detect and categorize new strategic triggers (market shifts, threats, etc.)?",
    options: [
      { text: "Reactive — Someone reads it in the news or hears it from a customer.", points: 1 },
      { text: "Manual — Functional leads are responsible for monitoring their own areas.", points: 2 },
      { text: "Standardized — We have regular risk reviews and scanning sessions.", points: 3 },
      { text: "Systemic — Signal-based monitoring across 200+ categories with auto-matching to protocols.", points: 5 }
    ]
  },
  {
    id: 5,
    question: "How often does your organization practice its response to non-IT crises (e.g., activist investor, PR crisis, M&A)?",
    options: [
      { text: "Never — We only handle them when they happen for real.", points: 1 },
      { text: "Rarely — Maybe once every year or two for the very top risks.", points: 2 },
      { text: "Annually — We do a tabletop exercise for the executive team.", points: 3 },
      { text: "Quarterly — We run structured drills across multiple protocol domains.", points: 5 }
    ]
  }
];

export default function ReadinessMaturityModel() {
  const [, nav] = useLocation();
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [resultLevel, setResultLevel] = useState<typeof MATURITY_LEVELS[0] | null>(null);

  useEffect(() => {
    updatePageMetadata({
      title: "Readiness Maturity Model — Assess Your Organization | VaughnMartin",
      description: "Where does your organization sit on the path from Reactive to Autonomous? Take the self-assessment and see your readiness maturity level.",
    });
  }, []);

  const handleAnswer = (points: number) => {
    const newAnswers = [...answers, points];
    setAnswers(newAnswers);
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: number[]) => {
    const totalPoints = finalAnswers.reduce((a, b) => a + b, 0);
    const avgPoints = totalPoints / QUESTIONS.length;
    
    let levelIndex = 0;
    if (avgPoints >= 4.5) levelIndex = 4;
    else if (avgPoints >= 3.5) levelIndex = 3;
    else if (avgPoints >= 2.5) levelIndex = 2;
    else if (avgPoints >= 1.5) levelIndex = 1;
    else levelIndex = 0;
    
    setResultLevel(MATURITY_LEVELS[levelIndex]);
    setStep('result');
  };

  const reset = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setResultLevel(null);
  };

  return (
    <PageLayout>
      <div style={{ background: "#fff", minHeight: "100vh" }}>
        
        {/* HERO */}
        <div style={{ background: NAVY, padding: "80px 48px 64px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 28, height: 1, background: GOLD }} />
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>
                Readiness Self-Assessment
              </span>
              <div style={{ width: 28, height: 1, background: GOLD }} />
            </div>
            <h1 style={{ ...CG, fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
              The Readiness <em style={{ color: GOLD }}>Maturity Model.</em>
            </h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", maxWidth: 700, margin: "0 auto", lineHeight: 1.7 }}>
              Most organizations handle strategic situations with 20th-century tools. 
              The path from Reactive to Autonomous is the journey from mobilization overhead to execution advantage.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 48px" }}>
          
          {step === 'intro' && (
            <div style={{ animation: "fadeIn 0.5s ease-out" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start", marginBottom: 64 }}>
                <div>
                  <h2 style={{ ...CG, fontSize: 32, color: NAVY, fontWeight: 700, marginBottom: 20 }}>Where do you stand?</h2>
                  <p style={{ color: "#4B5563", lineHeight: 1.8, fontSize: 16, marginBottom: 24 }}>
                    Readiness is not binary. It is a maturity curve that determines how much of your executive bandwidth is 
                    consumed by the "Mobilization Gap" — the time between a trigger firing and a coordinated response in motion.
                  </p>
                  <p style={{ color: "#4B5563", lineHeight: 1.8, fontSize: 16, marginBottom: 32 }}>
                    The higher your maturity, the lower your mobilization cost, and the faster your execution velocity.
                  </p>
                  <button 
                    onClick={() => setStep('quiz')}
                    style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "16px 32px", border: "none", cursor: "pointer", borderRadius: "0.15rem" }}
                  >
                    Take the Self-Assessment <ArrowRight size={16} />
                  </button>
                </div>
                <div style={{ background: IVORY, padding: "32px", border: `1px solid ${BORDER}` }}>
                  <h3 style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>The 5 Levels of Readiness</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {MATURITY_LEVELS.map(l => (
                      <div key={l.level} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: l.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700 }}>{l.level}</div>
                        <span style={{ ...BC, fontSize: 14, fontWeight: 600, color: NAVY, letterSpacing: "0.05em" }}>{l.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 64 }}>
                <h2 style={{ ...CG, fontSize: 36, color: NAVY, fontWeight: 700, textAlign: "center", marginBottom: 48 }}>Model Deep Dive</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
                  {MATURITY_LEVELS.map(l => (
                    <div key={l.level} style={{ border: `1px solid ${BORDER}`, padding: "32px", background: "#fff" }}>
                      <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: l.color, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Level 0{l.level}</div>
                      <h3 style={{ ...CG, fontSize: 24, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{l.name}</h3>
                      <div style={{ fontSize: 12, fontStyle: "italic", color: MUTED, marginBottom: 16 }}>{l.tagline}</div>
                      <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.6, marginBottom: 20 }}>{l.description}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {l.characteristics.map((c, i) => (
                          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <CheckCircle2 size={14} color={l.color} style={{ flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.4 }}>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'quiz' && (
            <div style={{ maxWidth: 600, margin: "0 auto", animation: "fadeIn 0.4s ease-out" }}>
              <div style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.2em" }}>QUESTION {currentQuestion + 1} OF {QUESTIONS.length}</span>
                  <span style={{ fontSize: 12, color: MUTED }}>{Math.round(((currentQuestion) / QUESTIONS.length) * 100)}% Complete</span>
                </div>
                <div style={{ width: "100%", height: 4, background: "#F3F4F6" }}>
                  <div style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%`, height: "100%", background: GOLD, transition: "width 0.3s ease" }} />
                </div>
              </div>

              <h2 style={{ ...CG, fontSize: 28, color: NAVY, fontWeight: 700, lineHeight: 1.3, marginBottom: 32 }}>
                {QUESTIONS[currentQuestion].question}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {QUESTIONS[currentQuestion].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt.points)}
                    style={{ 
                      textAlign: "left", 
                      padding: "20px 24px", 
                      background: "#fff", 
                      border: `1px solid ${BORDER}`, 
                      cursor: "pointer",
                      fontSize: 15,
                      color: "#374151",
                      lineHeight: 1.5,
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = GOLD;
                      e.currentTarget.style.background = "#FDFCF9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = BORDER;
                      e.currentTarget.style.background = "#fff";
                    }}
                  >
                    <span>{opt.text}</span>
                    <ChevronRight size={18} color={GOLD} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'result' && resultLevel && (
            <div style={{ maxWidth: 800, margin: "0 auto", animation: "fadeIn 0.6s ease-out" }}>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <div style={{ ...BC, fontSize: 12, fontWeight: 700, color: MUTED, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Your Readiness Maturity Level</div>
                <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ 
                    width: 100, 
                    height: 100, 
                    borderRadius: "50%", 
                    background: resultLevel.color, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: 40, 
                    color: "#fff", 
                    fontWeight: 700,
                    marginBottom: 20,
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)"
                  }}>
                    {resultLevel.level}
                  </div>
                  <h2 style={{ ...CG, fontSize: 48, color: NAVY, fontWeight: 700, marginBottom: 8 }}>{resultLevel.name}</h2>
                  <p style={{ ...BC, fontSize: 18, color: resultLevel.color, letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase" }}>{resultLevel.tagline}</p>
                </div>
              </div>

              <div style={{ background: IVORY, padding: "40px", border: `1px solid ${BORDER}`, marginBottom: 48 }}>
                <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  <AlertCircle size={24} color={resultLevel.color} />
                  <div>
                    <h3 style={{ ...BC, fontSize: 14, fontWeight: 700, color: NAVY, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Impact on Performance</h3>
                    <p style={{ color: "#374151", lineHeight: 1.7, fontSize: 15 }}>
                      {resultLevel.description} At the <strong>{resultLevel.name}</strong> level, your organization still faces significant 
                      mobilization overhead that compounds in real-time. Speed to decision is limited by coordination friction, 
                      not executive capability.
                    </p>
                  </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                  <div>
                    <h4 style={{ ...BC, fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Key Indicators</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {resultLevel.characteristics.map((c, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <CheckCircle2 size={14} color={resultLevel.color} style={{ flexShrink: 0, marginTop: 2 }} />
                          <span style={{ fontSize: 13, color: "#374151" }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ borderLeft: `1px solid ${BORDER}`, paddingLeft: 32 }}>
                    <h4 style={{ ...BC, fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Next Steps to Level Up</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", color: TEAL, fontSize: 13, fontWeight: 600 }}>
                        <Zap size={14} /> <span>Configure your first 5 protocols</span>
                      </div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", color: TEAL, fontSize: 13, fontWeight: 600 }}>
                        <Shield size={14} /> <span>Map C-suite authority chains</span>
                      </div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", color: TEAL, fontSize: 13, fontWeight: 600 }}>
                        <RefreshCw size={14} /> <span>Schedule first governance drill</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                <button 
                  onClick={() => nav('/founding-partner-program')}
                  style={{ ...BC, background: GOLD, color: NAVY, padding: "16px 32px", fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: "0.15rem", display: "flex", alignItems: "center", gap: 8 }}
                >
                  Accelerate Your Maturity <ArrowRight size={16} />
                </button>
                <button 
                  onClick={reset}
                  style={{ ...BC, background: "transparent", color: MUTED, padding: "16px 24px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: `1px solid ${BORDER}`, cursor: "pointer", borderRadius: "0.15rem" }}
                >
                  Retake Assessment
                </button>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER CALLOUT */}
        <section style={{ background: IVORY, padding: "72px 48px", textAlign: "center", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2 style={{ ...CG, fontSize: 32, color: NAVY, fontWeight: 700, marginBottom: 20 }}>Ready to move from Reactive to Adaptive?</h2>
            <p style={{ color: "#4B5563", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
              The Readiness OS is designed to move organizations up the maturity curve in 30 days. 
              Eliminate the mobilization gap and transform preparation into your greatest competitive advantage.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
              {[
                { icon: Target, label: "180 Protocols", detail: "Pre-Staged" },
                { icon: Zap, label: "12 Minutes", detail: "To Execution" },
                { icon: BarChart3, label: "3,600x", detail: "Head Start" }
              ].map((item, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <item.icon size={24} color={GOLD} style={{ margin: "0 auto 10px" }} />
                  <div style={{ ...BC, fontSize: 14, fontWeight: 700, color: NAVY, letterSpacing: "0.05em" }}>{item.label}</div>
                  <div style={{ ...BC, fontSize: 10, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </PageLayout>
  );
}
