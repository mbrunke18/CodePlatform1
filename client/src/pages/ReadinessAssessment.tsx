import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Target,
  Clock,
  DollarSign,
  FileText,
  TrendingUp,
  BarChart3,
  Phone,
  Rocket,
  Settings,
  Users,
  Layers,
} from "lucide-react";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { Link } from "wouter";

type Domain = "offense" | "defense" | "special_teams";
type Phase = "select-domain" | "questions" | "results";

interface AssessmentResult {
  id: number;
  score: number;
  gaps: string[];
  benchmark: string;
  recommendations: string[];
}

interface QuestionDef {
  key: string;
  question: string;
  type: "input" | "textarea" | "phone" | "select" | "radio";
  placeholder?: string;
  helper?: string;
  options?: string[];
}

const DOMAIN_CONFIG = {
  offense: {
    label: "OFFENSE",
    icon: Rocket,
    color: "emerald",
    playbooks: "58 Playbooks",
    categories: "Market Entry \u2022 M&A \u2022 Product Launch",
    tagline: "How fast can you capture opportunities?",
    bg: "bg-emerald-500",
    bgLight: "bg-emerald-500/20",
    text: "text-emerald-500",
    textLight: "text-emerald-400",
    border: "border-emerald-500/30",
    borderHover: "hover:border-emerald-500/60",
    shadow: "shadow-emerald-500/25",
    ring: "stroke-emerald-500",
  },
  defense: {
    label: "DEFENSE",
    icon: Shield,
    color: "red",
    playbooks: "58 Playbooks",
    categories: "Crisis \u2022 Cyber \u2022 Regulatory",
    tagline: "How ready are you to contain threats?",
    bg: "bg-red-500",
    bgLight: "bg-red-500/20",
    text: "text-red-500",
    textLight: "text-red-400",
    border: "border-red-500/30",
    borderHover: "hover:border-red-500/60",
    shadow: "shadow-red-500/25",
    ring: "stroke-red-500",
  },
  special_teams: {
    label: "SPECIAL TEAMS",
    icon: Settings,
    color: "purple",
    playbooks: "54 Playbooks",
    categories: "Digital Transformation \u2022 AI Governance",
    tagline: "How effectively do you execute change?",
    bg: "bg-purple-500",
    bgLight: "bg-purple-500/20",
    text: "text-purple-500",
    textLight: "text-purple-400",
    border: "border-purple-500/30",
    borderHover: "hover:border-purple-500/60",
    shadow: "shadow-purple-500/25",
    ring: "stroke-purple-500",
  },
} as const;

const DOMAIN_QUESTIONS: Record<Domain, QuestionDef[]> = {
  offense: [
    {
      key: "coordinator",
      question: "When your company identifies a major market opportunity, who coordinates the go-to-market response?",
      type: "input",
      placeholder: "e.g., VP of Strategy, Chief Growth Officer",
      helper: "Be specific \u2014 name and title",
    },
    {
      key: "speed",
      question: "What is the fastest you've moved from opportunity identification to market entry decision?",
      type: "select",
      placeholder: "Select timeframe",
      options: ["Under 1 week", "1-4 weeks", "1-3 months", "3-6 months", "Over 6 months"],
    },
    {
      key: "spendingAuthority",
      question: "Who can authorize up to $5M in market entry spend without board approval?",
      type: "input",
      placeholder: "e.g., CEO, CFO, or 'No one'",
      helper: "Name and title, or 'No one'",
    },
    {
      key: "partners",
      question: "Do you have pre-qualified partners, vendors, or channels ready to activate?",
      type: "radio",
      options: ["Yes fully mapped", "Partially", "No"],
    },
    {
      key: "playbookLocation",
      question: "Where is your market entry playbook documented?",
      type: "radio",
      options: ["Dedicated system", "Confluence/SharePoint", "Spreadsheets", "Someone's head", "We don't have one"],
    },
  ],
  defense: [
    {
      key: "firstNotified",
      question: "If a major incident hit right now, who gets the first call?",
      type: "input",
      placeholder: "e.g., CISO, Head of IT Security, VP of Operations",
    },
    {
      key: "phoneNumber",
      question: "What's their direct phone number?",
      type: "phone",
      placeholder: "Direct line, not a general switchboard",
    },
    {
      key: "firstActions",
      question: "What are the first 3 actions in your incident response playbook?",
      type: "textarea",
      placeholder: "e.g., 1. Isolate affected systems, 2. Alert legal team, 3. Activate incident response plan",
    },
    {
      key: "spendingAuthority",
      question: "Who can authorize $500K in emergency spend without a meeting?",
      type: "input",
      placeholder: "Name and title of the person with spending authority",
    },
    {
      key: "playbookLocation",
      question: "Where is your incident response playbook documented?",
      type: "radio",
      options: ["Dedicated system", "Confluence/SharePoint", "Spreadsheets", "Someone's head", "We don't have one"],
    },
  ],
  special_teams: [
    {
      key: "coordinator",
      question: "Who owns cross-functional coordination for major change initiatives?",
      type: "input",
      placeholder: "e.g., Chief Transformation Officer, VP of PMO",
    },
    {
      key: "alignmentSpeed",
      question: "How long does it typically take to align all stakeholders on a transformation initiative?",
      type: "select",
      placeholder: "Select timeframe",
      options: ["Under 1 week", "1-4 weeks", "1-3 months", "3-6 months", "Over 6 months"],
    },
    {
      key: "raciMatrices",
      question: "Do you have pre-defined RACI matrices for common transformation scenarios?",
      type: "radio",
      options: ["Yes for all scenarios", "Some scenarios", "No"],
    },
    {
      key: "resourceAuthority",
      question: "Who can make resource reallocation decisions up to 20% of a program budget?",
      type: "input",
      placeholder: "e.g., Program Director, COO",
    },
    {
      key: "playbookLocation",
      question: "Where are your transformation playbooks documented?",
      type: "radio",
      options: ["Dedicated system", "Confluence/SharePoint", "Spreadsheets", "Someone's head", "We don't have one"],
    },
  ],
};

const QUESTION_ICONS = [
  { icon: Target, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" },
  { icon: Clock, color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/30" },
  { icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" },
  { icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" },
  { icon: FileText, color: "text-teal-400", bg: "bg-teal-500/20", border: "border-teal-500/30" },
];

function getScoreColor(score: number) {
  if (score <= 30) return { color: "text-red-500", bg: "bg-red-500", label: "Critical", ring: "stroke-red-500" };
  if (score <= 50) return { color: "text-orange-500", bg: "bg-orange-500", label: "At Risk", ring: "stroke-orange-500" };
  if (score <= 70) return { color: "text-yellow-500", bg: "bg-yellow-500", label: "Needs Improvement", ring: "stroke-yellow-500" };
  if (score <= 85) return { color: "text-teal-500", bg: "bg-teal-500", label: "Good", ring: "stroke-teal-500" };
  return { color: "text-emerald-500", bg: "bg-emerald-500", label: "Excellent", ring: "stroke-emerald-500" };
}

export default function ReadinessAssessment() {
  const [phase, setPhase] = useState<Phase>("select-domain");
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const domainConfig = selectedDomain ? DOMAIN_CONFIG[selectedDomain] : null;
  const questions = selectedDomain ? DOMAIN_QUESTIONS[selectedDomain] : [];

  const handleSelectDomain = (domain: Domain) => {
    setSelectedDomain(domain);
    setAnswers({});
    setCurrentQuestion(0);
    setPhase("questions");
  };

  const updateAnswer = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedDomain) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/readiness/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: selectedDomain,
          companyName: companyName || undefined,
          answers,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Assessment failed. Please try again.");
      }
      const data = await res.json();
      setResult(data);
      setPhase("results");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPhase("select-domain");
    setSelectedDomain(null);
    setResult(null);
    setCompanyName("");
    setAnswers({});
    setCurrentQuestion(0);
    setError("");
  };

  const scoreInfo = result ? getScoreColor(result.score) : null;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = result ? circumference - (result.score / 100) * circumference : circumference;

  return (
    <div className="min-h-screen bg-background">
      <StandardNav />

      {phase === "select-domain" && (
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center">
              <Badge className="mb-4 bg-teal-500/20 text-teal-400 border-teal-500/30">
                <Clock className="w-4 h-4 mr-2" />
                5-Minute Diagnostic
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                How Ready Is Your Organization<br className="hidden md:block" /> to Execute Under Pressure?
              </h1>
              <p className="text-lg text-gray-800 max-w-2xl mx-auto">
                Answer 5 targeted questions and get an instant readiness score with specific gaps and recommendations for your strategic domain.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">How It Works</h2>
              <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
                {[
                  { num: 1, label: "Choose Domain", desc: "Select your strategic focus area", icon: Target },
                  { num: 2, label: "Answer 5 Questions", desc: "Quick, targeted diagnostic", icon: FileText },
                  { num: 3, label: "Get Your Score", desc: "Gaps, benchmarks & next steps", icon: BarChart3 },
                ].map((step) => (
                  <div key={step.num} className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto mb-3">
                      <step.icon className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{step.label}</div>
                    <div className="text-xs text-gray-700 mt-1">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">Select a Strategic Domain</h2>
              <p className="text-sm text-gray-700 text-center mb-6">Choose the area you want to assess</p>

              <div className="mb-6 max-w-md mx-auto">
                <Label className="text-gray-800 text-sm mb-2 block text-center">Company Name (optional)</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your organization's name"
                  className="bg-white border-gray-200 text-gray-900 placeholder:text-slate-500 focus:border-teal-500"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {(Object.entries(DOMAIN_CONFIG) as [Domain, typeof DOMAIN_CONFIG[Domain]][]).map(([domain, config]) => {
                  const IconComponent = config.icon;
                  return (
                    <button
                      key={domain}
                      onClick={() => handleSelectDomain(domain)}
                      className={`text-left rounded-xl bg-white border ${config.border} ${config.borderHover} p-6 transition-all hover:scale-[1.02] hover:shadow-lg group`}
                    >
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-2xl ${config.bgLight} flex items-center justify-center mx-auto mb-3`}>
                          <IconComponent className={`h-8 w-8 ${config.textLight}`} />
                        </div>
                        <h3 className={`text-xl font-bold ${config.textLight} mb-1`}>
                          {config.label}
                        </h3>
                        <Badge className={`${config.bgLight} ${config.textLight} border-none mt-1`}>
                          {config.playbooks}
                        </Badge>
                        <p className="text-gray-800 text-sm font-medium mt-3">{config.categories}</p>
                        <p className="text-gray-700 text-sm italic mt-1">{config.tagline}</p>
                        <div className={`${config.textLight} text-xs font-medium mt-4 flex items-center justify-center gap-1 group-hover:gap-2 transition-all`}>
                          Start Assessment <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {phase === "questions" && selectedDomain && domainConfig && (() => {
        const q = questions[currentQuestion];
        const iconDef = QUESTION_ICONS[currentQuestion];
        const IconComponent = iconDef.icon;
        const isLastQuestion = currentQuestion === questions.length - 1;
        const hasAnswer = !!answers[q.key]?.trim();

        return (
          <section className="py-16 md:py-24 px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <Badge className={`mb-4 ${domainConfig.bgLight} ${domainConfig.textLight} ${domainConfig.border}`}>
                  {(() => { const Icon = domainConfig.icon; return <Icon className="w-4 h-4 mr-2" />; })()}
                  {domainConfig.label} Assessment
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {companyName ? `${companyName}'s` : "Your"} {domainConfig.label} Readiness
                </h1>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between text-sm text-gray-800 mb-2">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                </div>
                <Progress
                  value={((currentQuestion + 1) / questions.length) * 100}
                  className="h-2 bg-gray-50"
                />
              </div>

              <div className="flex justify-center gap-2 mb-8">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      idx === currentQuestion
                        ? `${domainConfig.bg} text-gray-900 shadow-lg ${domainConfig.shadow}`
                        : answers[questions[idx].key]?.trim()
                        ? "bg-emerald-500 text-gray-900"
                        : "bg-gray-50 text-gray-700 hover:bg-slate-700"
                    }`}
                  >
                    {answers[questions[idx].key]?.trim() && idx !== currentQuestion ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      idx + 1
                    )}
                  </button>
                ))}
              </div>

              <Card className={`bg-white border ${iconDef.border}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${iconDef.bg} flex items-center justify-center`}>
                      <IconComponent className={`h-6 w-6 ${iconDef.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-gray-900 text-xl font-semibold">
                        {q.question}
                      </CardTitle>
                      {q.helper && (
                        <p className="text-gray-700 text-sm mt-1">{q.helper}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {q.type === "input" && (
                    <Input
                      value={answers[q.key] || ""}
                      onChange={(e) => updateAnswer(q.key, e.target.value)}
                      placeholder={q.placeholder}
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-slate-500 focus:border-teal-500 text-lg py-6"
                      autoFocus
                    />
                  )}
                  {q.type === "phone" && (
                    <Input
                      type="tel"
                      value={answers[q.key] || ""}
                      onChange={(e) => updateAnswer(q.key, e.target.value)}
                      placeholder={q.placeholder}
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-slate-500 focus:border-teal-500 text-lg py-6"
                      autoFocus
                    />
                  )}
                  {q.type === "textarea" && (
                    <Textarea
                      value={answers[q.key] || ""}
                      onChange={(e) => updateAnswer(q.key, e.target.value)}
                      placeholder={q.placeholder}
                      rows={4}
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-slate-500 focus:border-teal-500 resize-none text-lg"
                      autoFocus
                    />
                  )}
                  {q.type === "select" && (
                    <Select
                      value={answers[q.key] || ""}
                      onValueChange={(val) => updateAnswer(q.key, val)}
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 focus:border-teal-500 text-lg py-6">
                        <SelectValue placeholder={q.placeholder} />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-50 border-gray-200">
                        {q.options!.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-gray-900 hover:bg-slate-700">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {q.type === "radio" && (
                    <RadioGroup
                      value={answers[q.key] || ""}
                      onValueChange={(val) => updateAnswer(q.key, val)}
                      className="space-y-3"
                    >
                      {q.options!.map((opt) => (
                        <div
                          key={opt}
                          className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                            answers[q.key] === opt
                              ? `${domainConfig.bgLight} ${domainConfig.border}`
                              : "border-gray-200 hover:border-slate-600"
                          }`}
                          onClick={() => updateAnswer(q.key, opt)}
                        >
                          <RadioGroupItem
                            value={opt}
                            id={`${q.key}-${opt}`}
                            className="border-slate-600 text-teal-500"
                          />
                          <Label htmlFor={`${q.key}-${opt}`} className="text-gray-800 cursor-pointer text-base flex-1">
                            {opt}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </CardContent>
              </Card>

              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentQuestion === 0) {
                      handleReset();
                    } else {
                      setCurrentQuestion(currentQuestion - 1);
                    }
                  }}
                  className="border-slate-600 text-gray-800 hover:bg-slate-800 bg-transparent"
                >
                  {currentQuestion === 0 ? "Back to Domains" : "Previous"}
                </Button>

                {isLastQuestion ? (
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-10 ${domainConfig.bg} hover:opacity-90 text-gray-900 shadow-lg ${domainConfig.shadow}`}
                  >
                    {loading ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="mr-2 h-5 w-5" />
                        See My Score
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    className={`${domainConfig.bg} hover:opacity-90 text-gray-900`}
                  >
                    {hasAnswer ? "Next Question" : "Skip"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {phase === "results" && result && selectedDomain && domainConfig && (
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className={`mb-4 ${domainConfig.bgLight} ${domainConfig.textLight} ${domainConfig.border}`}>
                {(() => { const Icon = domainConfig.icon; return <Icon className="w-4 h-4 mr-2" />; })()}
                {domainConfig.label} Assessment Complete
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {companyName ? `${companyName}'s` : "Your"} {domainConfig.label} Readiness Score
              </h1>
            </div>

            <div className="flex flex-col items-center mb-12">
              <div className="relative w-48 h-48 mb-6">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-800"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className={domainConfig.ring}
                    style={{
                      strokeDasharray: circumference,
                      strokeDashoffset,
                      transition: "stroke-dashoffset 1s ease-in-out",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${domainConfig.text}`}>{result.score}</span>
                  <span className="text-gray-800 text-sm mt-1">/100</span>
                </div>
              </div>
              <Badge className={`${scoreInfo!.bg} text-gray-900 border-none px-4 py-1.5 text-sm font-semibold`}>
                {scoreInfo!.label}
              </Badge>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Industry Benchmark Comparison
              </h2>
              <Card className={`bg-white border ${domainConfig.border}`}>
                <CardContent className="p-6 space-y-5">
                  {[
                    { label: companyName || "Your Score", value: result.score, color: domainConfig.bg },
                    { label: "Fortune 500 Average", value: selectedDomain === "offense" ? 62 : selectedDomain === "defense" ? 54 : 48, color: "bg-slate-500" },
                    { label: "Execution OS Clients", value: selectedDomain === "offense" ? 84 : selectedDomain === "defense" ? 78 : 75, color: "bg-teal-500" },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-gray-800 font-medium">{row.label}</span>
                        <span className="text-gray-900 font-bold">{row.value}/100</span>
                      </div>
                      <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.color} transition-all duration-700`}
                          style={{ width: `${row.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-teal-400 font-medium pt-2 border-t border-gray-200">
                    Execution OS clients score {Math.round((((selectedDomain === "offense" ? 84 : selectedDomain === "defense" ? 78 : 75) / (selectedDomain === "offense" ? 62 : selectedDomain === "defense" ? 54 : 48)) - 1) * 100)}% higher than Fortune 500 average
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border border-gray-200 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-6 w-6 flex-shrink-0 ${domainConfig.textLight}`} />
                  <div>
                    <p className="text-gray-800 text-sm">{domainConfig.label} Benchmark</p>
                    <p className="text-gray-900 text-lg font-semibold">You're {result.benchmark}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {result.gaps.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-400" />
                  Gaps Found ({result.gaps.length})
                </h2>
                <div className="space-y-3">
                  {result.gaps.map((gap, i) => (
                    <Card key={i} className="bg-white border border-red-500/30">
                      <CardContent className="p-4 flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-800">{gap}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {result.gaps.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Layers className={`h-5 w-5 ${domainConfig.textLight}`} />
                  How Execution OS Closes These Gaps
                </h2>
                <Card className={`    border ${domainConfig.border} overflow-hidden`}>
                  <CardContent className="p-6">
                    <div className="space-y-5">
                      {[
                        {
                          step: "1",
                          title: `IDENTIFY — Pre-built playbooks for ${domainConfig.label.toLowerCase()}`,
                          description: `${domainConfig.playbooks} ready to deploy across ${domainConfig.categories}. No more building from scratch — activate proven response frameworks in minutes.`,
                          icon: Target,
                        },
                        {
                          step: "2",
                          title: "DETECT — AI-powered trigger monitoring",
                          description: "Continuous signal scanning across news, regulatory filings, competitor moves, and internal metrics. Get alerted before situations escalate.",
                          icon: TrendingUp,
                        },
                        {
                          step: "3",
                          title: "EXECUTE — 12-minute coordinated response",
                          description: "From trigger detection to full team activation in under 12 minutes. Automated role assignment, stakeholder notification, and decision escalation.",
                          icon: Clock,
                        },
                      ].map((item) => {
                        const StepIcon = item.icon;
                        return (
                          <div key={item.step} className={`flex items-start gap-4 p-4 rounded-xl bg-gray-50 border ${domainConfig.border}`}>
                            <div className={`w-10 h-10 rounded-lg ${domainConfig.bgLight} flex items-center justify-center flex-shrink-0`}>
                              <StepIcon className={`h-5 w-5 ${domainConfig.textLight}`} />
                            </div>
                            <div>
                              <h3 className={`font-bold ${domainConfig.textLight} text-sm tracking-wide`}>{item.title}</h3>
                              <p className="text-gray-800 text-sm mt-1 leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {result.recommendations.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  Recommendations ({result.recommendations.length})
                </h2>
                <div className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <Card key={i} className="bg-white border border-emerald-500/30">
                      <CardContent className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-800">{rec}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <Card className={`    border ${domainConfig.border} mb-8 overflow-hidden`}>
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
                  <Rocket className={`h-6 w-6 ${domainConfig.textLight}`} />
                  Your Next Step
                </h2>
                <p className="text-gray-800 text-lg max-w-2xl mx-auto leading-relaxed">
                  Based on your score of <span className={`font-bold ${domainConfig.text}`}>{result.score}/100</span>,{" "}
                  {result.score < 60
                    ? `we recommend starting with our Founding Partner Pilot — a guided 6-week engagement to close your most critical ${domainConfig.label.toLowerCase()} gaps with dedicated support.`
                    : `we recommend starting with our playbook library — activate ${domainConfig.playbooks.toLowerCase()} for ${domainConfig.label.toLowerCase()} and begin building execution muscle immediately.`}
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <Link href="/incident-analyzer">
                <Button
                  size="lg"
                  className={`text-lg px-10 py-7 ${domainConfig.bg} hover:opacity-90 text-gray-900 shadow-lg ${domainConfig.shadow}`}
                >
                  Build Your Playbooks
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/roi-calculator">
                <Button
                  size="lg"
                  className="text-lg px-10 py-7 bg-teal-600 hover:bg-teal-700 text-gray-900 shadow-lg shadow-teal-500/25"
                >
                  <DollarSign className="mr-2 h-5 w-5" />
                  Calculate Your ROI
                </Button>
              </Link>
              <Link href="/playbooks">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-7 border-slate-600 text-gray-800 hover:bg-slate-800 bg-transparent"
                >
                  See Our 170 Playbooks
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                className="text-lg px-10 py-7 border-slate-600 text-gray-800 hover:bg-slate-800 bg-transparent"
              >
                Assess Another Domain
              </Button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
