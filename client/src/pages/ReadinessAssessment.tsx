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
    playbooks: "56 Playbooks",
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
    playbooks: "52 Playbooks",
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
    <div className="min-h-screen bg-slate-950">
      <StandardNav />

      {phase === "select-domain" && (
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-teal-500/20 text-teal-400 border-teal-500/30">
                <Clock className="w-4 h-4 mr-2" />
                5-Minute Diagnostic
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Execution Readiness Assessment
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Discover your organization's execution gaps across strategic domains
              </p>
            </div>

            <div className="mb-8">
              <Label className="text-slate-300 text-sm mb-2 block">Company Name (optional)</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your organization's name"
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500 max-w-md mx-auto"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {(Object.entries(DOMAIN_CONFIG) as [Domain, typeof DOMAIN_CONFIG[Domain]][]).map(([domain, config]) => {
                const IconComponent = config.icon;
                return (
                  <Card
                    key={domain}
                    onClick={() => handleSelectDomain(domain)}
                    className={`bg-slate-900/80 border ${config.border} ${config.borderHover} cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg`}
                  >
                    <CardHeader className="text-center pb-3">
                      <div className={`w-16 h-16 rounded-2xl ${config.bgLight} flex items-center justify-center mx-auto mb-3`}>
                        <IconComponent className={`h-8 w-8 ${config.textLight}`} />
                      </div>
                      <CardTitle className={`text-xl font-bold ${config.textLight}`}>
                        {config.label}
                      </CardTitle>
                      <Badge className={`${config.bgLight} ${config.textLight} border-none mt-1`}>
                        {config.playbooks}
                      </Badge>
                    </CardHeader>
                    <CardContent className="text-center space-y-2 pb-6">
                      <p className="text-slate-400 text-sm font-medium">{config.categories}</p>
                      <p className="text-slate-500 text-sm italic">{config.tagline}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleSelectDomain("defense")}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
              >
                <Layers className="mr-2 h-5 w-5" />
                Assess All Three
              </Button>
            </div>
          </div>
        </section>
      )}

      {phase === "questions" && selectedDomain && domainConfig && (
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Badge className={`mb-4 ${domainConfig.bgLight} ${domainConfig.textLight} ${domainConfig.border}`}>
                {(() => { const Icon = domainConfig.icon; return <Icon className="w-4 h-4 mr-2" />; })()}
                {domainConfig.label} Assessment
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {domainConfig.label} Readiness
              </h1>
              <p className="text-slate-400">
                {companyName ? `Assessing ${companyName}'s` : "Assessing your"} {domainConfig.label.toLowerCase()} execution readiness
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
              </div>
              <Progress
                value={((currentQuestion + 1) / questions.length) * 100}
                className="h-2 bg-slate-800"
              />
            </div>

            <div className="space-y-6">
              {questions.map((q, idx) => {
                const iconDef = QUESTION_ICONS[idx];
                const IconComponent = iconDef.icon;
                return (
                  <Card
                    key={q.key}
                    className={`bg-slate-900/80 border ${iconDef.border} hover:border-opacity-60 transition-all`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${iconDef.bg} flex items-center justify-center`}>
                          <IconComponent className={`h-5 w-5 ${iconDef.color}`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg font-semibold">
                            <span className="text-slate-500 mr-2">Q{idx + 1}.</span>
                            {q.question}
                          </CardTitle>
                          {q.helper && (
                            <p className="text-slate-500 text-sm mt-1">{q.helper}</p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {q.type === "input" && (
                        <Input
                          value={answers[q.key] || ""}
                          onChange={(e) => {
                            updateAnswer(q.key, e.target.value);
                            setCurrentQuestion(Math.max(currentQuestion, idx));
                          }}
                          placeholder={q.placeholder}
                          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500"
                        />
                      )}
                      {q.type === "phone" && (
                        <Input
                          type="tel"
                          value={answers[q.key] || ""}
                          onChange={(e) => {
                            updateAnswer(q.key, e.target.value);
                            setCurrentQuestion(Math.max(currentQuestion, idx));
                          }}
                          placeholder={q.placeholder}
                          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500"
                        />
                      )}
                      {q.type === "textarea" && (
                        <Textarea
                          value={answers[q.key] || ""}
                          onChange={(e) => {
                            updateAnswer(q.key, e.target.value);
                            setCurrentQuestion(Math.max(currentQuestion, idx));
                          }}
                          placeholder={q.placeholder}
                          rows={3}
                          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500 resize-none"
                        />
                      )}
                      {q.type === "select" && (
                        <Select
                          value={answers[q.key] || ""}
                          onValueChange={(val) => {
                            updateAnswer(q.key, val);
                            setCurrentQuestion(Math.max(currentQuestion, idx));
                          }}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-teal-500">
                            <SelectValue placeholder={q.placeholder} />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            {q.options!.map((opt) => (
                              <SelectItem key={opt} value={opt} className="text-white hover:bg-slate-700">
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {q.type === "radio" && (
                        <RadioGroup
                          value={answers[q.key] || ""}
                          onValueChange={(val) => {
                            updateAnswer(q.key, val);
                            setCurrentQuestion(Math.max(currentQuestion, idx));
                          }}
                          className="space-y-2"
                        >
                          {q.options!.map((opt) => (
                            <div key={opt} className="flex items-center space-x-3">
                              <RadioGroupItem
                                value={opt}
                                id={`${q.key}-${opt}`}
                                className="border-slate-600 text-teal-500"
                              />
                              <Label htmlFor={`${q.key}-${opt}`} className="text-slate-300 cursor-pointer">
                                {opt}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
              >
                Back to Domains
              </Button>
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={loading}
                className={`text-lg px-12 py-7 ${domainConfig.bg} hover:opacity-90 text-white shadow-lg ${domainConfig.shadow}`}
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
            </div>
          </div>
        </section>
      )}

      {phase === "results" && result && selectedDomain && domainConfig && (
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className={`mb-4 ${domainConfig.bgLight} ${domainConfig.textLight} ${domainConfig.border}`}>
                {(() => { const Icon = domainConfig.icon; return <Icon className="w-4 h-4 mr-2" />; })()}
                {domainConfig.label} Assessment Complete
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
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
                  <span className="text-slate-400 text-sm mt-1">/100</span>
                </div>
              </div>
              <Badge className={`${scoreInfo!.bg} text-white border-none px-4 py-1.5 text-sm font-semibold`}>
                {scoreInfo!.label}
              </Badge>
            </div>

            <Card className="bg-slate-900/80 border border-slate-700 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-6 w-6 flex-shrink-0 ${domainConfig.textLight}`} />
                  <div>
                    <p className="text-slate-400 text-sm">{domainConfig.label} Benchmark</p>
                    <p className="text-white text-lg font-semibold">You're {result.benchmark}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {result.gaps.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-400" />
                  Gaps Found ({result.gaps.length})
                </h2>
                <div className="space-y-3">
                  {result.gaps.map((gap, i) => (
                    <Card key={i} className="bg-slate-900/80 border border-red-500/30">
                      <CardContent className="p-4 flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-300">{gap}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {result.recommendations.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  Recommendations ({result.recommendations.length})
                </h2>
                <div className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <Card key={i} className="bg-slate-900/80 border border-emerald-500/30">
                      <CardContent className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-300">{rec}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/incident-analyzer">
                <Button
                  size="lg"
                  className={`text-lg px-10 py-7 ${domainConfig.bg} hover:opacity-90 text-white shadow-lg ${domainConfig.shadow}`}
                >
                  Build Your Playbooks
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/playbooks">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-7 border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  See Our 166 Playbooks
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                className="text-lg px-10 py-7 border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
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
