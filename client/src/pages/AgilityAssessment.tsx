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
  if (score >= 80) return { label: "Agility Leader", color: "text-[#2B8A6E]", bg: "bg-[#2B8A6E]/10" };
  if (score >= 60) return { label: "Above Average", color: "text-[#2B8A6E]", bg: "bg-[#2B8A6E]/10" };
  if (score >= 40) return { label: "Industry Average", color: "text-[#C9A84C]", bg: "bg-[#C9A84C]/10" };
  if (score >= 20) return { label: "Below Average", color: "text-[#0A0F2E]", bg: "bg-[#0A0F2E]/10" };
  return { label: "Significant Opportunity", color: "text-[#0A0F2E]", bg: "bg-[#0A0F2E]/10" };
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
      <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0A0F2E]">
        <StandardNav />
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-[#2B8A6E] text-white border-none font-bold">
                <CheckCircle className="h-4 w-4 mr-2" />
                Assessment Complete
              </Badge>
              <h1 className="text-4xl font-bold text-[#0A0F2E] dark:text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Your Agility Score
              </h1>
            </div>

            <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10 mb-8" data-testid="card-score-result">
              <CardContent className="p-8 text-center">
                <div className="mb-8">
                  <div 
                    className={`text-8xl font-bold ${category.color} mb-4`}
                    data-testid="text-score-value"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
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
                  <div className="bg-[#F8F7F4] dark:bg-white/5 rounded-lg p-6" data-testid="result-current-growth">
                    <div className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-2">{revenueImpact.currentGrowth}%</div>
                    <p className="text-[#6B7280] dark:text-white/60 text-sm">Estimated Current Revenue/Employee Growth</p>
                  </div>
                  <div className="bg-[#2B8A6E]/10 rounded-lg p-6 border border-[#2B8A6E]/30" data-testid="result-potential-growth">
                    <div className="text-3xl font-bold text-[#0A0F2E] mb-2">+{revenueImpact.potentialGrowth}%</div>
                    <p className="text-[#0A0F2E] dark:text-[#C9A84C] text-sm">Potential Additional Growth with Execution OS</p>
                  </div>
                  <div className="bg-[#F8F7F4] dark:bg-white/5 rounded-lg p-6" data-testid="result-benchmark">
                    <div className="text-3xl font-bold text-[#C9A84C] mb-2">10.3%</div>
                    <p className="text-[#6B7280] dark:text-white/60 text-sm">Top Performer Benchmark (BAI 2025)</p>
                  </div>
                </div>

                <Card className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10 mb-8">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-[#0A0F2E] dark:text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>What This Means</h3>
                    {score < 60 ? (
                      <div className="text-left space-y-3">
                        <p className="text-[#0A0F2E] dark:text-[#C9A84C]">
                          Your organization is likely taking <span className="text-[#0A0F2E] dark:text-[#C9A84C] font-semibold">longer than 3.8 years</span> to see meaningful agility improvements.
                        </p>
                        <p className="text-[#0A0F2E] dark:text-[#C9A84C]">
                          Based on the 2025 BAI Report, organizations at your level see approximately <span className="text-[#C9A84C] font-semibold">{revenueImpact.currentGrowth}% revenue per employee growth</span>.
                        </p>
                        <p className="text-[#0A0F2E] dark:text-[#C9A84C]">
                          With Execution OS, you could close the gap to top performers and capture an additional <span className="text-[#2B8A6E] font-semibold">{revenueImpact.potentialGrowth}% growth potential</span>.
                        </p>
                      </div>
                    ) : (
                      <div className="text-left space-y-3">
                        <p className="text-[#0A0F2E] dark:text-[#C9A84C]">
                          You're performing <span className="text-[#2B8A6E] font-semibold">above industry average</span>. Your organization is making progress on agility.
                        </p>
                        <p className="text-[#0A0F2E] dark:text-[#C9A84C]">
                          However, there's still room to reach the <span className="text-[#2B8A6E] font-semibold">10.3% benchmark</span> that top performers achieve.
                        </p>
                        <p className="text-[#0A0F2E] dark:text-[#C9A84C]">
                          Execution OS can help you close the remaining gap with <span className="text-[#2B8A6E] font-semibold">pre-staged playbooks and 12-minute execution</span>.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={() => setLocation('/roi-calculator')}
                    className="bg-[#2B8A6E] hover:bg-[#2B8A6E]/90 text-white"
                    data-testid="button-calculate-full-roi"
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Calculate Full ROI
                  </Button>
                  <Button 
                    size="lg"
                    onClick={() => setLocation('/contact')}
                    variant="outline"
                    className="border-[#0A0F2E] dark:border-white text-[#0A0F2E] dark:text-white hover:bg-[#F8F7F4] dark:hover:bg-white/5"
                    data-testid="button-get-consultation"
                  >
                    Get Expert Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-[#6B7280] dark:text-white/60 text-sm">
              Based on data from the 2025 Business Agility Report across 244 organizations
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0A0F2E]">
      <StandardNav />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-[#C9A84C] text-[#0A0F2E] border-none font-bold">
              <BarChart3 className="h-4 w-4 mr-2" />
              Agility Assessment
            </Badge>
            <h1 className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Where Does Your Organization Stand?
            </h1>
            <p className="text-[#6B7280] dark:text-white/60">
              Answer 5 questions to benchmark against 244 organizations from the 2025 Business Agility Report
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-[#6B7280] dark:text-white/60 mb-2">
              <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-[#E8E4DC] dark:bg-white/10 [&>div]:bg-[#C9A84C]" />
          </div>

          <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10" data-testid="card-question">
            <CardHeader>
              <CardTitle className="text-xl text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {currentQ.question}
              </CardTitle>
              <p className="text-sm text-[#6B7280] dark:text-white/60 mt-2">
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
                        ? 'border-[#2B8A6E] bg-[#2B8A6E]/10' 
                        : 'border-[#E8E4DC] dark:border-white/10 bg-[#F8F7F4] dark:bg-white/5 hover:border-[#6B7280]'
                    }`}
                    onClick={() => handleAnswer(option.value)}
                    data-testid={`option-${option.value}`}
                  >
                    <RadioGroupItem 
                      value={option.value} 
                      id={option.value}
                      className="border-[#6B7280] text-[#C9A84C] data-[state=checked]:bg-[#C9A84C] data-[state=checked]:border-[#C9A84C]"
                      data-testid={`radio-${option.value}`}
                    />
                    <Label 
                      htmlFor={option.value} 
                      className="flex-1 cursor-pointer text-[#0A0F2E] dark:text-white"
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
                  className="border-[#E8E4DC] dark:border-white/10 text-[#0A0F2E] dark:text-white hover:bg-[#F8F7F4] dark:hover:bg-white/5 bg-transparent"
                  data-testid="button-back"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className="bg-[#0A0F2E] hover:bg-[#141B45] text-white"
                  data-testid="button-next"
                  style={{ background: "#0A0F2E" }}
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
