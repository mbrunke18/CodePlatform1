import { useState, useMemo } from 'react';
import StandardNav from '@/components/layout/StandardNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Activity, 
  Target, 
  Building2, 
  Network, 
  Crown, 
  Scale, 
  Workflow, 
  Cpu, 
  Users, 
  Award, 
  MapPin, 
  GraduationCap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  Zap,
  BookOpen,
  Play,
  RotateCcw,
  Lightbulb,
  ExternalLink
} from "lucide-react";
import { OPERATING_MODEL_ELEMENTS, OperatingModelElement } from "@shared/scenarios";
import { Link } from 'wouter';

const elementIcons: Record<string, any> = {
  'Purpose': Activity,
  'Value Agenda': Target,
  'Structure': Building2,
  'Ecosystem': Network,
  'Leadership': Crown,
  'Governance': Scale,
  'Processes': Workflow,
  'Technology': Cpu,
  'Behaviors': Users,
  'Rewards': Award,
  'Footprint': MapPin,
  'Talent': GraduationCap
};

const elementCategories: Record<string, { name: string; color: string; elements: OperatingModelElement[] }> = {
  'foundation': { name: 'Foundation', color: 'blue', elements: ['Purpose', 'Value Agenda'] },
  'organization': { name: 'Organization', color: 'purple', elements: ['Structure', 'Ecosystem'] },
  'governance': { name: 'Governance', color: 'amber', elements: ['Leadership', 'Governance'] },
  'execution': { name: 'Execution', color: 'green', elements: ['Processes', 'Technology'] },
  'people': { name: 'People', color: 'rose', elements: ['Behaviors', 'Rewards', 'Footprint', 'Talent'] }
};

const operatingModelQuestions: Record<OperatingModelElement, { questions: string[]; playbookDomains: string[] }> = {
  'Purpose': {
    questions: [
      'Is your purpose clearly articulated and understood across the organization?',
      'Does your purpose guide strategic decision-making?',
      'How well does your purpose resonate with employees and stakeholders?'
    ],
    playbookDomains: ['transformation', 'market-entry']
  },
  'Value Agenda': {
    questions: [
      'Is your value creation strategy clearly defined?',
      'Are resources optimally allocated to highest-value activities?',
      'How well do you measure value creation across business units?'
    ],
    playbookDomains: ['competitive-response', 'ma-integration', 'product-launch']
  },
  'Structure': {
    questions: [
      'Is accountability clear across the organization?',
      'Are spans of control appropriate for your strategy?',
      'How effectively does your structure support cross-functional work?'
    ],
    playbookDomains: ['transformation', 'ma-integration']
  },
  'Ecosystem': {
    questions: [
      'Do you have strategic partnerships that extend your capabilities?',
      'How well do you integrate external partners into your operations?',
      'Is your partner ecosystem a source of competitive advantage?'
    ],
    playbookDomains: ['market-entry', 'product-launch', 'competitive-response']
  },
  'Leadership': {
    questions: [
      'Are decision rights clear across leadership levels?',
      'Is your leadership style aligned to strategy?',
      'How quickly can leaders mobilize resources for new initiatives?'
    ],
    playbookDomains: ['crisis-response', 'transformation', 'ma-integration']
  },
  'Governance': {
    questions: [
      'Are governance mechanisms effective at setting enterprise priorities?',
      'Is resource allocation transparent and aligned to strategy?',
      'How well does your governance support rapid reallocation when needed?'
    ],
    playbookDomains: ['crisis-response', 'regulatory-change', 'transformation']
  },
  'Processes': {
    questions: [
      'Are core processes standardized where appropriate?',
      'How well do your processes balance control with agility?',
      'Are workflows optimized for speed and quality?'
    ],
    playbookDomains: ['product-launch', 'regulatory-change', 'ma-integration']
  },
  'Technology': {
    questions: [
      'Is your technology stack enabling or constraining your strategy?',
      'How well are you leveraging AI and automation?',
      'Is data accessible and actionable across the organization?'
    ],
    playbookDomains: ['cyber-incidents', 'product-launch', 'competitive-response']
  },
  'Behaviors': {
    questions: [
      'Is there a distinctive culture that creates competitive advantage?',
      'Are desired behaviors consistently reinforced?',
      'How well does your culture support change and adaptation?'
    ],
    playbookDomains: ['transformation', 'ma-integration']
  },
  'Rewards': {
    questions: [
      'Are incentives aligned to strategic priorities?',
      'Do rewards support collaboration or individual performance?',
      'How well do rewards drive desired behaviors?'
    ],
    playbookDomains: ['transformation', 'competitive-response']
  },
  'Footprint': {
    questions: [
      'Is your geographic footprint optimized for your strategy?',
      'How effectively do you deploy talent across locations?',
      'Are location decisions supporting cost and capability goals?'
    ],
    playbookDomains: ['market-entry', 'ma-integration', 'transformation']
  },
  'Talent': {
    questions: [
      'Do you have the capabilities needed for your strategy?',
      'How effective is your talent development pipeline?',
      'Are you winning the competition for critical skills?'
    ],
    playbookDomains: ['transformation', 'competitive-response', 'market-entry']
  }
};

const playbookDomainInfo: Record<string, { name: string; count: number; description: string }> = {
  'crisis-response': { name: 'Crisis Response', count: 24, description: 'Rapid mobilization for unexpected events' },
  'cyber-incidents': { name: 'Cyber Incidents', count: 18, description: 'Security threat detection and recovery' },
  'market-entry': { name: 'Market Entry', count: 22, description: 'Entering new markets or segments' },
  'ma-integration': { name: 'M&A Integration', count: 16, description: 'Post-merger integration and synergy' },
  'product-launch': { name: 'Product Launch', count: 20, description: 'Bringing products to market' },
  'competitive-response': { name: 'Competitive Response', count: 18, description: 'Responding to market threats' },
  'regulatory-change': { name: 'Regulatory Change', count: 14, description: 'Adapting to new regulations' },
  'transformation': { name: 'Transformation', count: 16, description: 'Large-scale organizational change' }
};

const structureTypes = [
  {
    id: 'business-unit',
    name: 'Business Unit / Holding Company',
    category: 'traditional',
    description: 'Decentralized units with high autonomy',
    strengths: ['Clear P&L accountability', 'Entrepreneurial culture', 'Fast local decisions'],
    challenges: ['Duplication of capabilities', 'Limited synergies']
  },
  {
    id: 'matrix',
    name: 'Matrix Management',
    category: 'traditional',
    description: 'Dual reporting lines balancing priorities',
    strengths: ['Balances local and global', 'Shares resources', 'Develops broad talent'],
    challenges: ['Slow decisions', 'Unclear accountability']
  },
  {
    id: 'functional',
    name: 'Functional Organization',
    category: 'traditional',
    description: 'Organized by specialized functions',
    strengths: ['Deep expertise', 'Economies of scale', 'Clear career paths'],
    challenges: ['Siloed thinking', 'Slow cross-functional work']
  },
  {
    id: 'product-platform',
    name: 'Product Platform Model',
    category: 'emerging',
    description: 'Platform teams provide shared capabilities',
    strengths: ['Reusable components', 'Fast iteration', 'Clear ownership'],
    challenges: ['Platform/product tension', 'Requires strong architecture']
  },
  {
    id: 'enterprise-agile',
    name: 'Enterprise Agile',
    category: 'emerging',
    description: 'Cross-functional squads around outcomes',
    strengths: ['Speed to market', 'Customer focus', 'High engagement'],
    challenges: ['Scaling coordination', 'Enterprise governance']
  },
  {
    id: 'decentralized-network',
    name: 'Decentralized Network',
    category: 'emerging',
    description: 'Autonomous nodes with shared purpose',
    strengths: ['Maximum agility', 'Resilience', 'Innovation at edges'],
    challenges: ['Coherence', 'Quality control']
  }
];

type AssessmentAnswers = Record<OperatingModelElement, number[]>;

function RadarChart({ scores, targetScores }: { scores: Record<OperatingModelElement, number>; targetScores?: Record<OperatingModelElement, number> }) {
  const elements = Object.keys(scores) as OperatingModelElement[];
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;
  
  const angleStep = (2 * Math.PI) / elements.length;
  
  const getPoint = (index: number, value: number) => {
    const angle = (index * angleStep) - (Math.PI / 2);
    const radius = (value / 100) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };
  
  const currentPath = elements.map((_, i) => {
    const point = getPoint(i, scores[elements[i]]);
    return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ') + ' Z';
  
  const targetPath = targetScores ? elements.map((_, i) => {
    const point = getPoint(i, targetScores[elements[i]]);
    return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ') + ' Z' : null;
  
  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-md mx-auto">
      {[20, 40, 60, 80, 100].map(level => (
        <polygon
          key={level}
          points={elements.map((_, i) => {
            const point = getPoint(i, level);
            return `${point.x},${point.y}`;
          }).join(' ')}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.1}
          className="text-slate-400"
        />
      ))}
      
      {elements.map((_, i) => {
        const point = getPoint(i, 100);
        return (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={point.x}
            y2={point.y}
            stroke="currentColor"
            strokeOpacity={0.1}
            className="text-slate-400"
          />
        );
      })}
      
      {targetPath && (
        <path
          d={targetPath}
          fill="rgba(59, 130, 246, 0.1)"
          stroke="rgb(59, 130, 246)"
          strokeWidth={2}
          strokeDasharray="4 2"
        />
      )}
      
      <path
        d={currentPath}
        fill="rgba(16, 185, 129, 0.2)"
        stroke="rgb(16, 185, 129)"
        strokeWidth={2}
      />
      
      {elements.map((element, i) => {
        const labelPoint = getPoint(i, 115);
        const Icon = elementIcons[element];
        return (
          <g key={element}>
            <circle
              cx={getPoint(i, scores[element]).x}
              cy={getPoint(i, scores[element]).y}
              r={4}
              fill="rgb(16, 185, 129)"
            />
            <foreignObject
              x={labelPoint.x - 12}
              y={labelPoint.y - 12}
              width={24}
              height={24}
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800">
                <Icon className="w-3 h-3 text-slate-600 dark:text-slate-400" />
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
}

function AssessmentStep({ 
  element, 
  answers, 
  onAnswer,
  onNext,
  onPrevious,
  currentIndex,
  totalElements
}: { 
  element: OperatingModelElement;
  answers: number[];
  onAnswer: (questionIndex: number, value: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalElements: number;
}) {
  const Icon = elementIcons[element];
  const questions = operatingModelQuestions[element].questions;
  const allAnswered = answers.length === questions.length && answers.every(a => a > 0);
  
  const category = Object.entries(elementCategories).find(([_, cat]) => 
    cat.elements.includes(element)
  );
  
  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className={`text-${category?.[1].color}-600`}>
            {category?.[1].name}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} of {totalElements}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-${category?.[1].color}-500/10 flex items-center justify-center`}>
            <Icon className={`w-6 h-6 text-${category?.[1].color}-500`} />
          </div>
          <div>
            <CardTitle className="text-xl">{element}</CardTitle>
            <CardDescription>
              {OPERATING_MODEL_ELEMENTS.find(e => e.id === element)?.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="space-y-3">
            <p className="font-medium text-foreground">{question}</p>
            <RadioGroup
              value={answers[qIndex]?.toString() || ''}
              onValueChange={(value) => onAnswer(qIndex, parseInt(value))}
              className="flex gap-2"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex items-center">
                  <RadioGroupItem
                    value={value.toString()}
                    id={`${element}-${qIndex}-${value}`}
                    className="peer sr-only"
                    data-testid={`radio-${element.toLowerCase().replace(/\s+/g, '-')}-q${qIndex}-${value}`}
                  />
                  <Label
                    htmlFor={`${element}-${qIndex}-${value}`}
                    data-testid={`label-${element.toLowerCase().replace(/\s+/g, '-')}-q${qIndex}-${value}`}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 cursor-pointer transition-all
                      ${answers[qIndex] === value 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-muted/30 border-muted-foreground/20 hover:border-primary/50'
                      }`}
                  >
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
          </div>
        ))}
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            data-testid="button-assessment-previous"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={!allAnswered}
            data-testid="button-assessment-next"
          >
            {currentIndex === totalElements - 1 ? 'Complete Assessment' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OperatingModelAlignment() {
  const [activeTab, setActiveTab] = useState('overview');
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({} as AssessmentAnswers);
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  
  const elements = OPERATING_MODEL_ELEMENTS.map(e => e.id) as OperatingModelElement[];
  
  const scores = useMemo(() => {
    if (!assessmentComplete) return null;
    const result: Record<OperatingModelElement, number> = {} as Record<OperatingModelElement, number>;
    elements.forEach(element => {
      const elementAnswers = answers[element] || [];
      const avg = elementAnswers.length > 0 
        ? elementAnswers.reduce((a, b) => a + b, 0) / elementAnswers.length 
        : 0;
      result[element] = Math.round((avg / 5) * 100);
    });
    return result;
  }, [assessmentComplete, answers]);
  
  const targetScores = useMemo(() => {
    const result: Record<OperatingModelElement, number> = {} as Record<OperatingModelElement, number>;
    elements.forEach(element => {
      result[element] = 85;
    });
    return result;
  }, []);
  
  const overallScore = scores 
    ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length)
    : 0;
  
  const priorityElements = scores
    ? elements.filter(e => scores[e] < 70).sort((a, b) => scores[a] - scores[b]).slice(0, 3)
    : [];
  
  const recommendedPlaybooks = useMemo(() => {
    if (!scores) return [];
    const domainScores: Record<string, number> = {};
    
    elements.forEach(element => {
      const domains = operatingModelQuestions[element].playbookDomains;
      const gap = 85 - scores[element];
      domains.forEach(domain => {
        domainScores[domain] = (domainScores[domain] || 0) + gap;
      });
    });
    
    return Object.entries(domainScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain, score]) => ({
        domain,
        info: playbookDomainInfo[domain],
        relevance: Math.min(100, Math.round(score / 3))
      }));
  }, [scores]);
  
  const handleAnswer = (questionIndex: number, value: number) => {
    const element = elements[currentElementIndex];
    setAnswers(prev => ({
      ...prev,
      [element]: [...(prev[element] || []).slice(0, questionIndex), value, ...(prev[element] || []).slice(questionIndex + 1)]
    }));
  };
  
  const handleNext = () => {
    if (currentElementIndex < elements.length - 1) {
      setCurrentElementIndex(prev => prev + 1);
    } else {
      setAssessmentComplete(true);
      setAssessmentStarted(false);
      setActiveTab('fingerprint');
    }
  };
  
  const handlePrevious = () => {
    if (currentElementIndex > 0) {
      setCurrentElementIndex(prev => prev - 1);
    }
  };
  
  const resetAssessment = () => {
    setAnswers({} as AssessmentAnswers);
    setAssessmentComplete(false);
    setCurrentElementIndex(0);
    setAssessmentStarted(false);
    setActiveTab('overview');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <StandardNav />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/executive-dashboard" className="hover:text-foreground" data-testid="link-breadcrumb-dashboard">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Operating Model Alignment</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Operating Model Alignment</h1>
              <p className="text-muted-foreground max-w-2xl">
                Map your operating model to execution playbooks using McKinsey's 12-element "Organize to Value" framework.
              </p>
            </div>
            {assessmentComplete && (
              <Button variant="outline" onClick={resetAssessment} data-testid="button-retake-assessment">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Assessment
              </Button>
            )}
          </div>
        </div>
        
        {assessmentStarted ? (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Progress value={((currentElementIndex + 1) / elements.length) * 100} className="h-2" />
            </div>
            <AssessmentStep
              element={elements[currentElementIndex]}
              answers={answers[elements[currentElementIndex]] || []}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onPrevious={handlePrevious}
              currentIndex={currentElementIndex}
              totalElements={elements.length}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card data-testid="card-alignment-score">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold" data-testid="text-alignment-score">{assessmentComplete ? `${overallScore}%` : '—'}</p>
                      <p className="text-xs text-muted-foreground">Alignment Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card data-testid="card-priority-elements">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold" data-testid="text-priority-count">{assessmentComplete ? priorityElements.length : '—'}</p>
                      <p className="text-xs text-muted-foreground">Priority Elements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card data-testid="card-recommended-playbooks">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold" data-testid="text-playbook-count">{assessmentComplete ? recommendedPlaybooks.reduce((sum, p) => sum + (p.info?.count || 0), 0) : '—'}</p>
                      <p className="text-xs text-muted-foreground">Recommended Playbooks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card data-testid="card-industry-gap">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold" data-testid="text-industry-gap">30%</p>
                      <p className="text-xs text-muted-foreground">Industry Gap Avg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="fingerprint" disabled={!assessmentComplete} data-testid="tab-fingerprint">Fingerprint</TabsTrigger>
                <TabsTrigger value="playbooks" disabled={!assessmentComplete} data-testid="tab-playbooks">Playbook Recommendations</TabsTrigger>
                <TabsTrigger value="gap" disabled={!assessmentComplete} data-testid="tab-gap">Gap Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Play className="w-5 h-5 text-primary" />
                        Start Assessment
                      </CardTitle>
                      <CardDescription>
                        Answer questions about your operating model across 12 elements to generate your organizational fingerprint.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">12 elements, 3 questions each</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">Takes approximately 10-15 minutes</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">Generates personalized playbook recommendations</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => setAssessmentStarted(true)}
                        data-testid="button-begin-assessment"
                      >
                        Begin Assessment
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                        McKinsey's 12 Elements
                      </CardTitle>
                      <CardDescription>
                        The "Organize to Value" framework transforms strategy into execution.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(elementCategories).map(([key, category]) => (
                          <div key={key} className="flex items-center gap-3">
                            <Badge variant="outline" className={`text-${category.color}-600 border-${category.color}-200`}>
                              {category.name}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {category.elements.join(', ')}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground italic">
                          "Companies achieve only 70% of their strategies' potential—largely due to operating model shortcomings."
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">— McKinsey Research, 2024</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Structure Types</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {structureTypes.map(structure => (
                      <Card 
                        key={structure.id}
                        className={`cursor-pointer transition-all hover:border-primary/50 ${selectedStructure === structure.id ? 'border-primary' : ''}`}
                        onClick={() => setSelectedStructure(structure.id)}
                        data-testid={`card-structure-${structure.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{structure.name}</h4>
                            <Badge variant={structure.category === 'emerging' ? 'default' : 'secondary'} className="text-xs">
                              {structure.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{structure.description}</p>
                          <div className="space-y-1">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                              <span className="text-xs text-muted-foreground">{structure.strengths[0]}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                              <span className="text-xs text-muted-foreground">{structure.challenges[0]}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="fingerprint">
                {scores && (
                  <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Operating Model Fingerprint</CardTitle>
                        <CardDescription>
                          Current state (green) vs. target state (blue dashed)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RadarChart scores={scores} targetScores={targetScores} />
                        <div className="flex justify-center gap-6 mt-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-sm text-muted-foreground">Current</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-dashed border-blue-500" />
                            <span className="text-sm text-muted-foreground">Target</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Element Scores</CardTitle>
                        <CardDescription>
                          Detailed breakdown by element
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {elements.map(element => {
                            const score = scores[element];
                            const Icon = elementIcons[element];
                            const elementId = element.toLowerCase().replace(/\s+/g, '-');
                            return (
                              <div key={element} className="flex items-center gap-3" data-testid={`row-element-${elementId}`}>
                                <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="text-sm w-24 shrink-0">{element}</span>
                                <Progress value={score} className="flex-1 h-2" data-testid={`progress-${elementId}`} />
                                <span className={`text-sm font-medium w-12 text-right ${
                                  score >= 80 ? 'text-green-600' :
                                  score >= 60 ? 'text-amber-600' : 'text-red-600'
                                }`} data-testid={`score-${elementId}`}>
                                  {score}%
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="playbooks">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-primary" />
                          Recommended Playbook Domains
                        </CardTitle>
                        <CardDescription>
                          Based on your operating model gaps, these playbook domains will have the highest impact
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recommendedPlaybooks.map(({ domain, info, relevance }, index) => (
                            <div 
                              key={domain}
                              className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                              data-testid={`card-recommendation-${domain}`}
                            >
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{info?.name}</h4>
                                  <Badge variant="secondary">{info?.count} playbooks</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{info?.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">{relevance}%</div>
                                <p className="text-xs text-muted-foreground">relevance</p>
                              </div>
                              <Link href="/playbook-library" data-testid={`link-playbook-${domain}`}>
                                <Button variant="ghost" size="sm" data-testid={`button-view-${domain}`}>
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-2">McKinsey → M Connection</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          "McKinsey gives you the operating model fingerprint. M gives you the playbooks to execute it."
                        </p>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-sm">Strategy → Execution bridge</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-sm">12-minute activation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-sm">Pre-built playbooks</span>
                          </div>
                        </div>
                        <Link href="/playbook-library" data-testid="link-explore-playbooks">
                          <Button className="w-full" data-testid="button-explore-playbooks">
                            Explore Playbooks
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="gap">
                {scores && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Strategy-Execution Gap Analysis</CardTitle>
                        <CardDescription>
                          Elements requiring attention to close the gap between strategy and execution
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {priorityElements.map(element => {
                            const Icon = elementIcons[element];
                            const gap = 85 - scores[element];
                            const domains = operatingModelQuestions[element].playbookDomains;
                            return (
                              <Card key={element} className="border-amber-500/30" data-testid={`card-gap-${element.toLowerCase().replace(/\s+/g, '-')}`}>
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                      <Icon className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{element}</h4>
                                      <p className="text-xs text-muted-foreground">{gap}% gap to close</p>
                                    </div>
                                  </div>
                                  <Progress value={scores[element]} className="h-2 mb-3" />
                                  <div className="flex flex-wrap gap-1">
                                    {domains.map(domain => (
                                      <Badge key={domain} variant="outline" className="text-xs">
                                        {playbookDomainInfo[domain]?.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                        
                        {priorityElements.length === 0 && (
                          <div className="text-center py-8">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <h3 className="font-semibold text-lg mb-2">Excellent Alignment</h3>
                            <p className="text-muted-foreground">
                              All elements are scoring above 70%. Your operating model is well-aligned.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Quick Wins</CardTitle>
                          <CardDescription>Improvements achievable in 30 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5">
                              <Zap className="w-5 h-5 text-green-500 mt-0.5" />
                              <div>
                                <p className="font-medium text-sm">Clarify decision rights</p>
                                <p className="text-xs text-muted-foreground">Map RACI for top 10 cross-functional processes</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5">
                              <Zap className="w-5 h-5 text-green-500 mt-0.5" />
                              <div>
                                <p className="font-medium text-sm">Activate 3 priority playbooks</p>
                                <p className="text-xs text-muted-foreground">Start with highest-relevance domain recommendations</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5">
                              <Zap className="w-5 h-5 text-green-500 mt-0.5" />
                              <div>
                                <p className="font-medium text-sm">Run a tabletop exercise</p>
                                <p className="text-xs text-muted-foreground">Test one playbook with executive team</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Strategic Initiatives</CardTitle>
                          <CardDescription>90-day transformation roadmap</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5">
                              <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                              <div>
                                <p className="font-medium text-sm">Operating model redesign</p>
                                <p className="text-xs text-muted-foreground">Address lowest-scoring elements systematically</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5">
                              <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                              <div>
                                <p className="font-medium text-sm">Build playbook library</p>
                                <p className="text-xs text-muted-foreground">Customize 20+ playbooks to your context</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5">
                              <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                              <div>
                                <p className="font-medium text-sm">Leadership alignment program</p>
                                <p className="text-xs text-muted-foreground">Train executives on playbook activation</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
