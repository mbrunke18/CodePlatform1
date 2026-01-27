import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Zap,
  Brain,
  ArrowRight,
  Target,
  Shield,
  TrendingUp
} from 'lucide-react';

export type DecisionScenario = 
  | 'ransomware_initial' 
  | 'competitor_response' 
  | 'regulatory_disclosure'
  | 'supply_chain_action'
  | 'crisis_communication';

interface DecisionOption {
  id: string;
  label: string;
  description: string;
  isOptimal: boolean;
  consequence: string;
  reasoning: string;
}

interface DecisionConfig {
  title: string;
  context: string;
  timeLimit: number;
  options: DecisionOption[];
  mRecommendation: string;
  mReasoning: string;
}

interface InteractiveDecisionPointProps {
  scenario: DecisionScenario;
  onComplete: (selectedOption: string, wasOptimal: boolean) => void;
  decisionNumber?: number;
  totalDecisions?: number;
}

const DECISION_CONFIGS: Record<DecisionScenario, DecisionConfig> = {
  ransomware_initial: {
    title: 'Board Communication Strategy',
    context: 'Your CISO just confirmed ransomware encryption is spreading. The Board Chair is calling in 30 minutes demanding an update. You have incomplete information.',
    timeLimit: 45,
    options: [
      {
        id: 'wait',
        label: 'Wait for Full Assessment',
        description: 'Delay the board call until you have complete information',
        isOptimal: false,
        consequence: 'Board loses confidence. Rumors fill the information vacuum. Media gets the story first.',
        reasoning: 'In crisis, speed beats perfection. Stakeholders prefer honest uncertainty over silence.'
      },
      {
        id: 'brief',
        label: 'Brief with What You Know',
        description: 'Share current status, unknowns, and next steps with timeline',
        isOptimal: true,
        consequence: 'Board appreciates transparency. They provide resources and air cover. Trust maintained.',
        reasoning: 'Structured uncertainty communication builds trust. "Here\'s what we know, don\'t know, and are doing."'
      },
      {
        id: 'delegate',
        label: 'Delegate to CISO',
        description: 'Have your CISO handle board communications while you manage response',
        isOptimal: false,
        consequence: 'Board feels leadership is absent. CISO struggles with business context. Message gets confused.',
        reasoning: 'Strategic crises require C-suite presence. Delegation signals lack of gravity.'
      }
    ],
    mRecommendation: 'Brief with What You Know',
    mReasoning: 'M\'s Crisis Communication Playbook provides a pre-approved "Fog of War" template designed for exactly this situation: structured updates with explicit uncertainty acknowledgment. Your board was briefed on this protocol during onboarding.'
  },
  competitor_response: {
    title: 'Competitive Counter-Strategy',
    context: 'Your main competitor just announced 40% price cuts. Your sales team is panicking. CFO says matching prices cuts $180M from margins. You have a board meeting in 2 hours.',
    timeLimit: 60,
    options: [
      {
        id: 'match',
        label: 'Match Their Pricing',
        description: 'Immediately announce matching discounts to protect market share',
        isOptimal: false,
        consequence: '$180M margin hit. Competitor was baiting you. They have lower cost structure and win the attrition war.',
        reasoning: 'Reactive price wars favor the aggressor. You\'re playing their game.'
      },
      {
        id: 'differentiate',
        label: 'Double Down on Value',
        description: 'Launch campaign highlighting unique capabilities competitor lacks',
        isOptimal: true,
        consequence: 'Premium customers stay loyal. You lose price-sensitive segment but protect margins. Competitor\'s low-price customers become support burden.',
        reasoning: 'Differentiation breaks the commoditization trap. Your unique value justifies premium.'
      },
      {
        id: 'bundle',
        label: 'Create Bundled Offering',
        description: 'Package products with services to obscure direct price comparison',
        isOptimal: false,
        consequence: 'Adds complexity. Sales team struggles with new positioning. Implementation takes 6 weeks—too slow.',
        reasoning: 'Bundling is a long-term strategy, not a crisis response. Too slow for urgent threat.'
      }
    ],
    mRecommendation: 'Double Down on Value',
    mReasoning: 'M\'s Competitive Response Playbook #47 (Price War Defense) shows that value differentiation outperforms price matching 73% of the time in enterprise markets. Your pre-staged campaign assets are ready for immediate deployment.'
  },
  regulatory_disclosure: {
    title: 'Investor Communication Timing',
    context: 'SEC investigation notice received. Your legal team says you have 48 hours before formal disclosure required. Stock is trading normally. Insider trading rules now apply to everyone.',
    timeLimit: 45,
    options: [
      {
        id: 'immediate',
        label: 'Disclose Immediately',
        description: 'File 8-K today and get ahead of any leaks',
        isOptimal: true,
        consequence: 'Stock drops 12% but stabilizes. Investor relations team controls narrative. No insider trading issues.',
        reasoning: 'Proactive disclosure signals strong governance. Markets punish surprises, not problems.'
      },
      {
        id: 'wait',
        label: 'Wait Full 48 Hours',
        description: 'Use all available time to prepare comprehensive response',
        isOptimal: false,
        consequence: 'Word leaks. Stock drops 18% on rumors. SEC views delay as obstruction. Class action lawyers circle.',
        reasoning: 'In 48 hours, too many people know. Leaks are inevitable. Control is illusion.'
      },
      {
        id: 'partial',
        label: 'Limited Disclosure',
        description: 'Acknowledge inquiry without details, promise update when appropriate',
        isOptimal: false,
        consequence: 'SEC views as inadequate disclosure. Shareholder lawsuits multiply. Credibility damaged for years.',
        reasoning: 'Half-truths are worse than silence. Regulators and investors see through them.'
      }
    ],
    mRecommendation: 'Disclose Immediately',
    mReasoning: 'M\'s Regulatory Response Playbook includes pre-drafted 8-K templates and investor talking points. Your IR team can execute the "Proactive Disclosure" protocol within 4 hours—well within market close.'
  },
  supply_chain_action: {
    title: 'Supply Chain Continuity',
    context: 'Primary supplier filed bankruptcy. You have 3 weeks of inventory. Alternative suppliers quote 8-12 week lead times. Production halt costs $2M per day.',
    timeLimit: 60,
    options: [
      {
        id: 'premium',
        label: 'Pay Premium for Rush',
        description: 'Offer 3x premium to alternative suppliers for emergency 2-week delivery',
        isOptimal: true,
        consequence: 'Higher costs but production continues. Premium price is $8M vs $56M in halt costs. Customer commitments met.',
        reasoning: 'Premium supply costs < production halt costs. Math is clear.'
      },
      {
        id: 'negotiate',
        label: 'Negotiate Bankruptcy Claims',
        description: 'Work with bankrupt supplier to maintain shipments during restructuring',
        isOptimal: false,
        consequence: 'Legal process takes 6 weeks. Shipments stop anyway. Lost 6 critical weeks.',
        reasoning: 'Bankruptcy processes are slow and unpredictable. Not a viable contingency.'
      },
      {
        id: 'redesign',
        label: 'Emergency Redesign',
        description: 'Have engineering modify products to use available alternative components',
        isOptimal: false,
        consequence: 'Redesign takes 4 weeks minimum. Quality issues emerge. Recalls follow.',
        reasoning: 'Rushed engineering creates quality debt. "Move fast and break things" doesn\'t apply to manufacturing.'
      }
    ],
    mRecommendation: 'Pay Premium for Rush',
    mReasoning: 'M\'s Supply Chain Disruption Playbook includes pre-qualified alternative suppliers with emergency pricing agreements already negotiated. Your procurement team can activate these relationships immediately—no negotiation needed.'
  },
  crisis_communication: {
    title: 'Public Statement Strategy',
    context: 'Viral video of executive misconduct. #BoycottBrand trending. Major media requesting comment in 2 hours. Employee morale collapsing. Partners reconsidering relationships.',
    timeLimit: 45,
    options: [
      {
        id: 'swift',
        label: 'Swift Accountability',
        description: 'Immediately announce investigation and executive administrative leave',
        isOptimal: true,
        consequence: 'Narrative shifts to "company taking action." Employee morale stabilizes. Partners appreciate decisiveness.',
        reasoning: 'Action speaks louder than words. Visible accountability defuses boycott momentum.'
      },
      {
        id: 'investigate',
        label: 'Promise Investigation',
        description: 'Announce formal investigation before taking any personnel action',
        isOptimal: false,
        consequence: 'Seen as protecting the executive. Boycott intensifies. Top talent begins updating resumes.',
        reasoning: 'Public has already convicted. Due process argument falls flat in court of public opinion.'
      },
      {
        id: 'context',
        label: 'Provide Context',
        description: 'Explain circumstances, note video was edited, defend executive',
        isOptimal: false,
        consequence: 'Backfires spectacularly. "Company defends misconduct" becomes the story. Boycott goes nuclear.',
        reasoning: '"Context" sounds like excuses. Never defend the indefensible in public.'
      }
    ],
    mRecommendation: 'Swift Accountability',
    mReasoning: 'M\'s Crisis Communications Playbook #23 (Executive Misconduct) provides a decision tree and pre-approved statement templates. The "Swift Action Protocol" has an 89% success rate in containing reputational damage within 72 hours.'
  }
};

export function InteractiveDecisionPoint({ 
  scenario, 
  onComplete, 
  decisionNumber = 1, 
  totalDecisions = 3 
}: InteractiveDecisionPointProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showConsequence, setShowConsequence] = useState(false);
  const [showMRecommendation, setShowMRecommendation] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const config = DECISION_CONFIGS[scenario];
  
  useEffect(() => {
    if (!hasStarted || timeRemaining === null || timeRemaining <= 0 || selectedOption) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [hasStarted, timeRemaining, selectedOption]);
  
  useEffect(() => {
    if (timeRemaining === 0 && !selectedOption) {
      const suboptimalOption = config.options.find(o => !o.isOptimal)?.id || config.options[0].id;
      handleSelect(suboptimalOption);
    }
  }, [timeRemaining, selectedOption]);
  
  const handleStart = () => {
    setHasStarted(true);
    setTimeRemaining(config.timeLimit);
  };
  
  const handleSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowConsequence(true);
    
    setTimeout(() => {
      setShowMRecommendation(true);
    }, 2000);
  };
  
  const handleContinue = () => {
    const selected = config.options.find(o => o.id === selectedOption);
    onComplete(selectedOption || '', selected?.isOptimal || false);
  };
  
  const getTimeColor = () => {
    if (timeRemaining === null) return 'text-slate-400';
    if (timeRemaining > 30) return 'text-green-400';
    if (timeRemaining > 15) return 'text-yellow-400';
    return 'text-red-400 animate-pulse';
  };
  
  const selectedOptionData = config.options.find(o => o.id === selectedOption);

  if (!hasStarted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900/20 rounded-xl p-8" data-testid="decision-point-start">
        <div className="text-center max-w-2xl">
          <Badge className="bg-blue-600 text-white mb-6 px-4 py-1">
            Decision Point {decisionNumber} of {totalDecisions}
          </Badge>
          <h2 className="text-3xl font-bold text-white mb-4">{config.title}</h2>
          <p className="text-slate-300 text-lg mb-8">{config.context}</p>
          <div className="flex items-center justify-center gap-2 text-slate-400 mb-8">
            <Clock className="w-5 h-5" />
            <span>You have {config.timeLimit} seconds to decide</span>
          </div>
          <Button 
            onClick={handleStart}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            data-testid="button-start-decision"
          >
            <Target className="w-5 h-5 mr-2" />
            Make Your Decision
          </Button>
        </div>
      </div>
    );
  }

  if (showMRecommendation) {
    return (
      <div className="min-h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8" data-testid="decision-point-result">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Badge className={`mb-4 px-4 py-1 ${selectedOptionData?.isOptimal ? 'bg-green-600' : 'bg-orange-600'} text-white`}>
              {selectedOptionData?.isOptimal ? 'Optimal Choice' : 'Learning Opportunity'}
            </Badge>
            <h2 className="text-2xl font-bold text-white mb-2">
              You chose: {selectedOptionData?.label}
            </h2>
          </div>
          
          <div className="grid gap-6 mb-8">
            <Card className={`border-2 ${selectedOptionData?.isOptimal ? 'border-green-500 bg-green-500/10' : 'border-orange-500 bg-orange-500/10'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  {selectedOptionData?.isOptimal ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                  )}
                  Consequence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{selectedOptionData?.consequence}</p>
                <p className="text-slate-400 text-sm mt-4 italic">{selectedOptionData?.reasoning}</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-blue-500 bg-blue-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="w-6 h-6 text-blue-400" />
                  M's Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-blue-400 mb-2">{config.mRecommendation}</p>
                <p className="text-slate-300">{config.mReasoning}</p>
              </CardContent>
            </Card>
          </div>
          
          {!selectedOptionData?.isOptimal && (
            <div className="bg-slate-800/50 rounded-lg p-6 mb-8 border border-slate-700">
              <p className="text-slate-300 text-center">
                <span className="text-white font-semibold">94% of executives</span> make similar choices without M's guidance.
                <br />
                <span className="text-blue-400">The difference is preparation, not intelligence.</span>
              </p>
            </div>
          )}
          
          <div className="text-center">
            <Button 
              onClick={handleContinue}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              data-testid="button-continue-decision"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8" data-testid="decision-point-active">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Badge className="bg-blue-600 text-white px-4 py-1">
            Decision Point {decisionNumber} of {totalDecisions}
          </Badge>
          <div className={`flex items-center gap-2 font-mono text-2xl ${getTimeColor()}`}>
            <Clock className="w-6 h-6" />
            <span>{timeRemaining}s</span>
          </div>
        </div>
        
        <div className="mb-4">
          <Progress 
            value={timeRemaining ? (timeRemaining / config.timeLimit) * 100 : 0} 
            className="h-2"
          />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">{config.title}</h2>
        <p className="text-slate-300 mb-8">{config.context}</p>
        
        <div className="space-y-4">
          {config.options.map((option) => (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all duration-200 border-2 ${
                selectedOption === option.id 
                  ? 'border-blue-500 bg-blue-500/20' 
                  : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'
              }`}
              onClick={() => !selectedOption && handleSelect(option.id)}
              data-testid={`decision-option-${option.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selectedOption === option.id ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {selectedOption === option.id ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Target className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{option.label}</h3>
                    <p className="text-slate-400">{option.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {showConsequence && selectedOptionData && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom duration-500">
            <Card className={`border-2 ${selectedOptionData.isOptimal ? 'border-green-500 bg-green-500/10' : 'border-orange-500 bg-orange-500/10'}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  {selectedOptionData.isOptimal ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      {selectedOptionData.isOptimal ? 'Strong Choice' : 'Consider the Consequence'}
                    </h4>
                    <p className="text-slate-300">{selectedOptionData.consequence}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default InteractiveDecisionPoint;
