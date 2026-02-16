import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { Link } from "wouter";

interface AssessmentResult {
  id: number;
  score: number;
  gaps: string[];
  benchmark: string;
  recommendations: string[];
}

function getScoreColor(score: number) {
  if (score <= 30) return { color: "text-red-500", bg: "bg-red-500", label: "Critical", ring: "stroke-red-500" };
  if (score <= 50) return { color: "text-orange-500", bg: "bg-orange-500", label: "At Risk", ring: "stroke-orange-500" };
  if (score <= 70) return { color: "text-yellow-500", bg: "bg-yellow-500", label: "Needs Improvement", ring: "stroke-yellow-500" };
  if (score <= 85) return { color: "text-teal-500", bg: "bg-teal-500", label: "Good", ring: "stroke-teal-500" };
  return { color: "text-emerald-500", bg: "bg-emerald-500", label: "Excellent", ring: "stroke-emerald-500" };
}

export default function ReadinessAssessment() {
  const [companyName, setCompanyName] = useState("");
  const [firstNotified, setFirstNotified] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstActions, setFirstActions] = useState("");
  const [spendingAuthority, setSpendingAuthority] = useState("");
  const [playbookLocation, setPlaybookLocation] = useState("");
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/readiness/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName || undefined,
          answers: {
            firstNotified,
            phoneNumber,
            firstActions,
            spendingAuthority,
            playbookLocation,
          },
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Assessment failed. Please try again.");
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCompanyName("");
    setFirstNotified("");
    setPhoneNumber("");
    setFirstActions("");
    setSpendingAuthority("");
    setPlaybookLocation("");
    setError("");
  };

  const scoreInfo = result ? getScoreColor(result.score) : null;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = result ? circumference - (result.score / 100) * circumference : circumference;

  const questions = [
    {
      num: 1,
      icon: Shield,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
      question: "If ransomware hit right now, who gets notified first?",
      type: "input" as const,
      value: firstNotified,
      onChange: setFirstNotified,
      placeholder: "e.g., CISO, Head of IT Security, VP of Operations",
    },
    {
      num: 2,
      icon: Phone,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/20",
      borderColor: "border-purple-500/30",
      question: "What's their direct phone number?",
      type: "input" as const,
      value: phoneNumber,
      onChange: setPhoneNumber,
      placeholder: "Direct line, not a general switchboard",
    },
    {
      num: 3,
      icon: Target,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/20",
      borderColor: "border-amber-500/30",
      question: "What are the first 3 actions your team would take?",
      type: "textarea" as const,
      value: firstActions,
      onChange: setFirstActions,
      placeholder: "e.g., 1. Isolate affected systems, 2. Alert legal team, 3. Activate incident response plan",
    },
    {
      num: 4,
      icon: DollarSign,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/20",
      borderColor: "border-emerald-500/30",
      question: "Who can authorize $500K in emergency spending without a meeting?",
      type: "input" as const,
      value: spendingAuthority,
      onChange: setSpendingAuthority,
      placeholder: "Name and title of the person with spending authority",
    },
    {
      num: 5,
      icon: FileText,
      iconColor: "text-teal-400",
      iconBg: "bg-teal-500/20",
      borderColor: "border-teal-500/30",
      question: "Where is your response playbook documented?",
      type: "select" as const,
      value: playbookLocation,
      onChange: setPlaybookLocation,
      placeholder: "Select where your playbook lives",
      options: ["Confluence", "SharePoint", "Google Doc", "Internal Wiki", "Email Thread", "Don't have one"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <StandardNav />

      {!result ? (
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-teal-500/20 text-teal-400 border-teal-500/30">
                <Clock className="w-4 h-4 mr-2" />
                5-Minute Diagnostic
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                How Prepared Is Your Organization?
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Answer 5 questions. Get your Preparedness Score and see exactly where your gaps are.
              </p>
            </div>

            <div className="mb-8">
              <Label className="text-slate-300 text-sm mb-2 block">Company Name (optional)</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your organization's name"
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500"
              />
            </div>

            <div className="space-y-6">
              {questions.map((q) => {
                const IconComponent = q.icon;
                return (
                  <Card key={q.num} className={`bg-slate-900/80 border ${q.borderColor} hover:border-opacity-60 transition-all`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${q.iconBg} flex items-center justify-center`}>
                          <IconComponent className={`h-5 w-5 ${q.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg font-semibold">
                            <span className="text-slate-500 mr-2">Q{q.num}.</span>
                            {q.question}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {q.type === "input" && (
                        <Input
                          value={q.value}
                          onChange={(e) => q.onChange(e.target.value)}
                          placeholder={q.placeholder}
                          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500"
                        />
                      )}
                      {q.type === "textarea" && (
                        <Textarea
                          value={q.value}
                          onChange={(e) => q.onChange(e.target.value)}
                          placeholder={q.placeholder}
                          rows={3}
                          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500 resize-none"
                        />
                      )}
                      {q.type === "select" && (
                        <Select value={q.value} onValueChange={q.onChange}>
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

            <div className="mt-10 text-center">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={loading}
                className="text-lg px-12 py-7 bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/25"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Get Your Score
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-teal-500/20 text-teal-400 border-teal-500/30">
                <TrendingUp className="w-4 h-4 mr-2" />
                Assessment Complete
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {companyName ? `${companyName}'s` : "Your"} Preparedness Score
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
                    className={scoreInfo!.ring}
                    style={{
                      strokeDasharray: circumference,
                      strokeDashoffset,
                      transition: "stroke-dashoffset 1s ease-in-out",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${scoreInfo!.color}`}>{result.score}</span>
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
                  <AlertTriangle className={`h-6 w-6 flex-shrink-0 ${scoreInfo!.color}`} />
                  <div>
                    <p className="text-slate-400 text-sm">Benchmark</p>
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
                  className="text-lg px-10 py-7 bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/25"
                >
                  See ExecuteIQ in Action
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                className="text-lg px-10 py-7 border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
              >
                Take Assessment Again
              </Button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
