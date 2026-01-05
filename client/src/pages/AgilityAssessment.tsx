import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3
} from "lucide-react";
import { useLocation } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";

interface Question {
  id: string;
  question: string;
  context: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: "response_time",
    question: "How long does it typically take your organization to mount a coordinated response to an unexpected event?",
    context: "Think about the last time a competitor launched something, a crisis emerged, or an opportunity appeared.",
    options: [
      { value: "hours", label: "Within hours", score: 100 },
      { value: "1-3_days", label: "1-3 days", score: 75 },
      { value: "1-2_weeks", label: "1-2 weeks", score: 50 },
      { value: "3-4_weeks", label: "3-4 weeks", score: 25 },
      { value: "months", label: "More than a month", score: 0 }
    ]
  },
  {
    id: "governance_blocks",
    question: "When was the last time a governance process blocked something time-sensitive?",
    context: "Governance is necessary, but when it becomes a bottleneck, speed suffers.",
    options: [
      { value: "never", label: "Rarely or never—our governance enables speed", score: 100 },
      { value: "occasionally", label: "Occasionally, but we work around it", score: 75 },
      { value: "monthly", label: "Monthly—it's a regular friction point", score: 50 },
      { value: "weekly", label: "Weekly—it slows us down constantly", score: 25 },
      { value: "daily", label: "Daily—governance is our biggest blocker", score: 0 }
    ]
  },
  {
    id: "agility_position",
    question: "The average organization takes 3.8 years to improve agility by 10%. Where would you estimate you fall?",
    context: "Based on the 2025 Business Agility Report across 244 organizations.",
    options: [
      { value: "faster", label: "We improve much faster than average", score: 100 },
      { value: "somewhat_faster", label: "Somewhat faster than average", score: 75 },
      { value: "average", label: "About average (3-4 years for 10%)", score: 50 },
      { value: "slower", label: "Slower than average", score: 25 },
      { value: "stagnant", label: "We haven't measurably improved", score: 0 }
    ]
  },
  {
    id: "playbook_readiness",
    question: "Does your organization have pre-defined playbooks for strategic scenarios?",
    context: "Pre-staged responses with predetermined stakeholders, tasks, and budgets.",
    options: [
      { value: "comprehensive", label: "Yes, comprehensive playbooks for most scenarios", score: 100 },
      { value: "some", label: "Some playbooks for major scenarios", score: 75 },
      { value: "crisis_only", label: "Only for crisis situations", score: 50 },
      { value: "informal", label: "Informal, undocumented processes", score: 25 },
      { value: "none", label: "No predefined playbooks—we figure it out each time", score: 0 }
    ]
  },
  {
    id: "coordination_method",
    question: "How does your executive team coordinate during strategic events?",
    context: "The method of coordination directly impacts response speed.",
    options: [
      { value: "automated", label: "Automated system triggers tasks and assigns stakeholders", score: 100 },
      { value: "structured", label: "Structured process with clear roles and workflows", score: 75 },
      { value: "meetings", label: "Schedule meetings to discuss and assign tasks", score: 50 },
      { value: "email_slack", label: "Email and Slack threads", score: 25 },
      { value: "ad_hoc", label: "Ad hoc—whoever is available figures it out", score: 0 }
    ]
  }
];

const getScoreCategory = (score: number) => {
  if (score >= 80) return { label: "Agility Leader", color: "text-emerald-400", bg: "bg-emerald-500/20" };
  if (score >= 60) return { label: "Above Average", color: "text-blue-400", bg: "bg-blue-500/20" };
  if (score >= 40) return { label: "Industry Average", color: "text-amber-400", bg: "bg-amber-500/20" };
  if (score >= 20) return { label: "Below Average", color: "text-orange-400", bg: "bg-orange-500/20" };
  return { label: "Significant Opportunity", color: "text-red-400", bg: "bg-red-500/20" };
};

export default function AgilityAssessment() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [QUESTIONS[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let total = 0;
    let count = 0;
    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const question = QUESTIONS.find(q => q.id === questionId);
      if (question) {
        const option = question.options.find(o => o.value === answerValue);
        if (option) {
          total += option.score;
          count++;
        }
      }
    });
    return count > 0 ? Math.round(total / count) : 0;
  };

  const calculateRevenueImpact = (score: number) => {
    const baselineGrowth = 3.5;
    const maxGrowth = 10.3;
    const currentGrowth = baselineGrowth + ((score / 100) * (maxGrowth - baselineGrowth));
    const potentialGrowth = maxGrowth - currentGrowth;
    return { currentGrowth: currentGrowth.toFixed(1), potentialGrowth: potentialGrowth.toFixed(1) };
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  const currentQ = QUESTIONS[currentQuestion];
  const currentAnswer = answers[currentQ.id];

  if (showResults) {
    const score = calculateScore();
    const category = getScoreCategory(score);
    const revenueImpact = calculateRevenueImpact(score);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <StandardNav />
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <CheckCircle className="h-4 w-4 mr-2" />
                Assessment Complete
              </Badge>
              <h1 className="text-4xl font-bold text-white mb-4">
                Your Agility Score
              </h1>
            </div>

            <Card className="bg-slate-900/50 border-slate-800 mb-8" data-testid="card-score-result">
              <CardContent className="p-8 text-center">
                <div className="mb-8">
                  <div 
                    className={`text-8xl font-bold ${category.color} mb-4`}
                    data-testid="text-score-value"
                  >
                    {score}
                  </div>
                  <Badge 
                    className={`${category.bg} ${category.color} border-current text-lg px-4 py-1`}
                    data-testid="badge-score-category"
                  >
                    {category.label}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-800/50 rounded-lg p-6" data-testid="result-current-growth">
                    <div className="text-3xl font-bold text-white mb-2">{revenueImpact.currentGrowth}%</div>
                    <p className="text-slate-400 text-sm">Estimated Current Revenue/Employee Growth</p>
                  </div>
                  <div className="bg-emerald-900/30 rounded-lg p-6 border border-emerald-500/30" data-testid="result-potential-growth">
                    <div className="text-3xl font-bold text-emerald-400 mb-2">+{revenueImpact.potentialGrowth}%</div>
                    <p className="text-slate-400 text-sm">Potential Additional Growth with M Platform</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-6" data-testid="result-benchmark">
                    <div className="text-3xl font-bold text-amber-400 mb-2">10.3%</div>
                    <p className="text-slate-400 text-sm">Top Performer Benchmark (BAI 2025)</p>
                  </div>
                </div>

                <Card className="bg-slate-800/50 border-slate-700 mb-8">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">What This Means</h3>
                    {score < 60 ? (
                      <div className="text-left space-y-3">
                        <p className="text-slate-300">
                          Your organization is likely taking <span className="text-red-400 font-semibold">longer than 3.8 years</span> to see meaningful agility improvements.
                        </p>
                        <p className="text-slate-300">
                          Based on the 2025 BAI Report, organizations at your level see approximately <span className="text-amber-400 font-semibold">{revenueImpact.currentGrowth}% revenue per employee growth</span>.
                        </p>
                        <p className="text-slate-300">
                          With M Platform, you could close the gap to top performers and capture an additional <span className="text-emerald-400 font-semibold">{revenueImpact.potentialGrowth}% growth potential</span>.
                        </p>
                      </div>
                    ) : (
                      <div className="text-left space-y-3">
                        <p className="text-slate-300">
                          You're performing <span className="text-emerald-400 font-semibold">above industry average</span>. Your organization is making progress on agility.
                        </p>
                        <p className="text-slate-300">
                          However, there's still room to reach the <span className="text-emerald-400 font-semibold">10.3% benchmark</span> that top performers achieve.
                        </p>
                        <p className="text-slate-300">
                          M Platform can help you close the remaining gap with <span className="text-emerald-400 font-semibold">pre-staged playbooks and 12-minute execution</span>.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={() => setLocation('/roi-calculator')}
                    className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
                    data-testid="button-calculate-full-roi"
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Calculate Full ROI
                  </Button>
                  <Button 
                    size="lg"
                    onClick={() => setLocation('/contact')}
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-800"
                    data-testid="button-get-consultation"
                  >
                    Get Expert Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-slate-500 text-sm">
              Based on data from the 2025 Business Agility Report across 244 organizations
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <StandardNav />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
              <BarChart3 className="h-4 w-4 mr-2" />
              Agility Assessment
            </Badge>
            <h1 className="text-3xl font-bold text-white mb-2">
              Where Does Your Organization Stand?
            </h1>
            <p className="text-slate-400">
              Answer 5 questions to benchmark against 244 organizations from the 2025 Business Agility Report
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="bg-slate-900/50 border-slate-800" data-testid="card-question">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                {currentQ.question}
              </CardTitle>
              <p className="text-sm text-slate-400 mt-2">
                {currentQ.context}
              </p>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={currentAnswer || ""} 
                onValueChange={handleAnswer}
                className="space-y-3"
                data-testid="radio-group-options"
              >
                {currentQ.options.map((option) => (
                  <div 
                    key={option.value}
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                      currentAnswer === option.value 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                    onClick={() => handleAnswer(option.value)}
                    data-testid={`option-${option.value}`}
                  >
                    <RadioGroupItem 
                      value={option.value} 
                      id={option.value}
                      data-testid={`radio-${option.value}`}
                    />
                    <Label 
                      htmlFor={option.value} 
                      className="flex-1 cursor-pointer text-slate-200"
                      data-testid={`label-${option.value}`}
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentQuestion === 0}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  data-testid="button-back"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  data-testid="button-next"
                >
                  {currentQuestion === QUESTIONS.length - 1 ? 'See Results' : 'Next'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
