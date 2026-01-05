import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Bell,
  TrendingDown,
  Shield,
  Users,
  Zap,
  Volume2,
  VolumeX
} from 'lucide-react';
import { SiSlack } from 'react-icons/si';

export type ChaosScenario = 'ransomware' | 'competitor' | 'regulatory' | 'supply_chain' | 'pr_crisis';

interface ChaosMessage {
  id: string;
  type: 'slack' | 'email' | 'text' | 'calendar' | 'call';
  sender: string;
  content: string;
  urgency: 'critical' | 'high' | 'medium';
  timestamp: Date;
}

interface ChaosSimulatorProps {
  scenario: ChaosScenario;
  companyName?: string;
  onComplete: () => void;
  autoStart?: boolean;
  autoAdvanceDelay?: number;
}

const SCENARIO_CONFIG: Record<ChaosScenario, {
  title: string;
  triggerMessage: string;
  triggerSender: string;
  revenuePerMinute: number;
  messages: Omit<ChaosMessage, 'id' | 'timestamp'>[];
}> = {
  ransomware: {
    title: 'CRITICAL: Ransomware Attack Detected',
    triggerMessage: 'URGENT: Our systems are being encrypted. Ransom note appeared on 47 servers. Customer data may be compromised. I need you in the war room NOW.',
    triggerSender: 'CISO - Marcus Chen',
    revenuePerMinute: 8500,
    messages: [
      { type: 'slack', sender: 'IT Security', content: '🚨 CRITICAL: File encryption detected on production servers. Spreading rapidly.', urgency: 'critical' },
      { type: 'email', sender: 'Legal Team', content: 'RE: Breach notification requirements - We have 72 hours under GDPR. Need incident details ASAP.', urgency: 'critical' },
      { type: 'slack', sender: 'CFO Office', content: 'Board is asking for immediate update. What do we tell them?', urgency: 'critical' },
      { type: 'calendar', sender: 'Emergency Meeting', content: 'Crisis Response - War Room A - In 15 minutes', urgency: 'critical' },
      { type: 'text', sender: 'Board Chair', content: 'Just saw the news alert. Call me immediately.', urgency: 'critical' },
      { type: 'slack', sender: 'Customer Success', content: '47 enterprise customers reporting system access issues. What do we tell them?', urgency: 'high' },
      { type: 'email', sender: 'PR Team', content: 'TechCrunch is calling. They have sources saying we\'ve been breached. Response needed in 30 min.', urgency: 'critical' },
      { type: 'slack', sender: 'HR Director', content: 'Employees are panicking. Social media posts appearing. Need comms guidance NOW.', urgency: 'high' },
      { type: 'call', sender: 'FBI Cyber Division', content: 'Incoming call regarding potential ransomware investigation', urgency: 'critical' },
      { type: 'email', sender: 'Insurance Broker', content: 'RE: Cyber policy activation - Need incident details for coverage determination', urgency: 'high' },
      { type: 'slack', sender: 'Engineering Lead', content: 'Should we shut down all systems? This will impact 200K users.', urgency: 'critical' },
      { type: 'text', sender: 'CEO', content: 'In flight to NYC. Landing in 2 hours. What\'s our status?', urgency: 'critical' },
      { type: 'slack', sender: 'SOC Team', content: 'Ransom demand received: $15M in Bitcoin. 48-hour deadline.', urgency: 'critical' },
      { type: 'email', sender: 'Investor Relations', content: 'Major shareholders demanding update call. Stock already down 8% on rumors.', urgency: 'high' },
      { type: 'calendar', sender: 'Board Emergency Session', content: 'Virtual Board Meeting - Crisis Update - 1 hour', urgency: 'critical' },
    ]
  },
  competitor: {
    title: 'URGENT: Major Competitor Price War',
    triggerMessage: 'BREAKING: TechGiant just announced 40% price cuts across their entire enterprise line. Our sales team is getting hammered with calls. This is an existential threat.',
    triggerSender: 'VP Sales - Rachel Torres',
    revenuePerMinute: 12000,
    messages: [
      { type: 'slack', sender: 'Enterprise Sales', content: '🔴 Acme Corp just put our $2.4M renewal on hold. Citing competitor pricing.', urgency: 'critical' },
      { type: 'email', sender: 'Sales Ops', content: 'Pipeline at risk: $47M in deals now reconsidering. Competitor offering 40% discounts.', urgency: 'critical' },
      { type: 'slack', sender: 'Channel Partners', content: 'Three major partners asking about our response. Threatening to switch recommendations.', urgency: 'high' },
      { type: 'text', sender: 'Board Member', content: 'Seeing the news. We need a response strategy today. Not tomorrow.', urgency: 'critical' },
      { type: 'slack', sender: 'Marketing', content: 'Should we counter with our own campaign? Need budget approval and messaging.', urgency: 'high' },
      { type: 'email', sender: 'CFO', content: 'If we match pricing, margin impact is $180M annually. Options?', urgency: 'critical' },
      { type: 'slack', sender: 'Customer Success', content: 'Renewal calls today are disasters. Customers demanding price matching.', urgency: 'high' },
      { type: 'calendar', sender: 'Emergency Pricing Committee', content: 'War Room - Competitive Response - NOW', urgency: 'critical' },
      { type: 'slack', sender: 'Product Team', content: 'Can we accelerate the Q3 feature release to differentiate?', urgency: 'medium' },
      { type: 'email', sender: 'Analyst Relations', content: 'Gartner calling for comment. They\'re updating their MQ assessment.', urgency: 'high' },
      { type: 'text', sender: 'CEO', content: 'Wall Street Journal wants a statement. What\'s our position?', urgency: 'critical' },
      { type: 'slack', sender: 'Field Sales', content: '6 demos cancelled today. Prospects saying "why bother when competitor is cheaper"', urgency: 'high' },
    ]
  },
  regulatory: {
    title: 'ALERT: SEC Investigation Notice',
    triggerMessage: 'Just received formal notice from SEC enforcement. They\'re investigating our Q3 revenue recognition. Requesting documents within 48 hours. This is serious.',
    triggerSender: 'General Counsel - Jennifer Walsh',
    revenuePerMinute: 5000,
    messages: [
      { type: 'email', sender: 'SEC Enforcement', content: 'Formal Document Preservation Notice - All employees must retain communications.', urgency: 'critical' },
      { type: 'slack', sender: 'Audit Committee Chair', content: 'Need emergency meeting with external auditors. Today.', urgency: 'critical' },
      { type: 'email', sender: 'External Counsel', content: 'Initiating investigation response protocol. $500K retainer required immediately.', urgency: 'critical' },
      { type: 'text', sender: 'CFO', content: 'Auditors want to review ALL Q3 deal documentation. Full freeze on document deletion.', urgency: 'critical' },
      { type: 'slack', sender: 'Investor Relations', content: 'Filing 8-K required within 4 business days. Draft needed.', urgency: 'high' },
      { type: 'calendar', sender: 'Legal Hold Meeting', content: 'All executives - Document preservation briefing - MANDATORY', urgency: 'critical' },
      { type: 'email', sender: 'Board Secretary', content: 'Special board session scheduled. D&O insurance review required.', urgency: 'high' },
      { type: 'slack', sender: 'Finance Team', content: 'Restatement scenarios being modeled. Potential impact: $45M-$120M.', urgency: 'critical' },
      { type: 'text', sender: 'Board Chair', content: 'WSJ has the story. Running tomorrow morning. We need to get ahead of this.', urgency: 'critical' },
      { type: 'email', sender: 'HR Legal', content: 'Executive compensation clawback provisions activated. Review required.', urgency: 'high' },
      { type: 'slack', sender: 'Communications', content: 'Employee town hall needed. Rumors spreading. Morale tanking.', urgency: 'high' },
    ]
  },
  supply_chain: {
    title: 'CRITICAL: Primary Supplier Bankruptcy',
    triggerMessage: 'AcmeParts just filed Chapter 11. They supply 67% of our critical components. We have 3 weeks of inventory. Production will halt if we don\'t act NOW.',
    triggerSender: 'VP Operations - David Kim',
    revenuePerMinute: 15000,
    messages: [
      { type: 'slack', sender: 'Supply Chain', content: '🚨 AcmeParts facilities locked. No shipments. Zero visibility on alternatives.', urgency: 'critical' },
      { type: 'email', sender: 'Manufacturing', content: 'Production line 3 will halt in 72 hours without components. $2M/day impact.', urgency: 'critical' },
      { type: 'slack', sender: 'Procurement', content: 'Called 12 alternative suppliers. Lead times are 8-12 weeks minimum.', urgency: 'critical' },
      { type: 'text', sender: 'CEO', content: 'Customer commitments at risk. What\'s our backup plan?', urgency: 'critical' },
      { type: 'calendar', sender: 'Emergency Supply Review', content: 'All hands - Supply chain crisis response - Conference Room A', urgency: 'critical' },
      { type: 'slack', sender: 'Sales', content: 'Enterprise customers asking about delivery guarantees. What do I tell them?', urgency: 'high' },
      { type: 'email', sender: 'Legal', content: 'Force majeure clause review needed for customer contracts. 47 at risk.', urgency: 'high' },
      { type: 'slack', sender: 'Finance', content: 'Cash flow impact modeling shows $180M exposure. Need board approval for emergency spending.', urgency: 'critical' },
      { type: 'text', sender: 'Board Member', content: 'Competitor just announced expanded capacity. Timing suspicious. Response?', urgency: 'high' },
      { type: 'email', sender: 'Investor Relations', content: 'Guidance revision may be needed. Material impact to Q4 projections.', urgency: 'critical' },
      { type: 'slack', sender: 'HR', content: 'If production halts, 2,400 workers affected. Union contract requires 48hr notice.', urgency: 'high' },
      { type: 'slack', sender: 'Quality Assurance', content: 'Alternative suppliers need 6-week qualification process. Can we accelerate?', urgency: 'high' },
    ]
  },
  pr_crisis: {
    title: 'VIRAL: Executive Misconduct Video',
    triggerMessage: 'A video of our COO making offensive comments at a private event is going viral. 2M views in 2 hours. #BoycottBrand is trending. This is a firestorm.',
    triggerSender: 'Chief Communications Officer',
    revenuePerMinute: 25000,
    messages: [
      { type: 'slack', sender: 'Social Media', content: '🔥 #BoycottBrand now #1 trending. 50K tweets in last hour. Growing exponentially.', urgency: 'critical' },
      { type: 'email', sender: 'PR Agency', content: 'CNN, NYT, WSJ all requesting comment. Deadline: 2 hours or they run without us.', urgency: 'critical' },
      { type: 'text', sender: 'Board Chair', content: 'Board is getting calls from major investors. We need a position. NOW.', urgency: 'critical' },
      { type: 'slack', sender: 'Employee Resource Groups', content: 'ERG leaders demanding meeting. Employees are devastated. Resignations threatened.', urgency: 'critical' },
      { type: 'calendar', sender: 'Crisis Communications War Room', content: 'Executive team only - IMMEDIATE', urgency: 'critical' },
      { type: 'email', sender: 'Legal', content: 'Employment review of COO initiated. Termination implications being assessed.', urgency: 'critical' },
      { type: 'slack', sender: 'Partnership Team', content: 'Nike and Apple pausing partnership discussions pending our response.', urgency: 'critical' },
      { type: 'text', sender: 'CEO', content: 'Do we have the full video? Context? I need facts before I make a statement.', urgency: 'critical' },
      { type: 'email', sender: 'Customer Success', content: '340 enterprise customers have emailed asking for our position. Response?', urgency: 'high' },
      { type: 'slack', sender: 'Recruiting', content: '27 candidates just withdrew applications citing the incident.', urgency: 'high' },
      { type: 'slack', sender: 'Sales', content: 'Q4 pipeline at risk. Multiple prospects asking to postpone decisions.', urgency: 'high' },
      { type: 'email', sender: 'DEI Council', content: 'Statement from DEI leadership needed. Internal trust is shattered.', urgency: 'critical' },
      { type: 'text', sender: 'COO', content: 'The video is taken out of context. I can explain. Should I release a statement?', urgency: 'critical' },
    ]
  }
};

const MESSAGE_ICONS = {
  slack: SiSlack,
  email: Mail,
  text: Phone,
  calendar: Calendar,
  call: Phone,
};

const URGENCY_COLORS = {
  critical: 'bg-red-500 border-red-600 text-white',
  high: 'bg-orange-500 border-orange-600 text-white',
  medium: 'bg-yellow-500 border-yellow-600 text-black',
};

export function ChaosSimulator({ scenario, companyName = 'Meridian Industries', onComplete, autoStart = false, autoAdvanceDelay }: ChaosSimulatorProps) {
  const [isActive, setIsActive] = useState(autoStart);
  const [messages, setMessages] = useState<ChaosMessage[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [revenueLost, setRevenueLost] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [showOverwhelm, setShowOverwhelm] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const config = SCENARIO_CONFIG[scenario];
  
  useEffect(() => {
    if (showOverwhelm && autoAdvanceDelay) {
      const timer = setTimeout(() => {
        onComplete();
      }, autoAdvanceDelay);
      return () => clearTimeout(timer);
    }
  }, [showOverwhelm, autoAdvanceDelay, onComplete]);
  
  const skipToEnd = useCallback(() => {
    setMessages(config.messages.map((msg, i) => ({
      ...msg,
      id: `msg-${i}`,
      timestamp: new Date(),
    })));
    setStressLevel(100);
    setRevenueLost(config.revenuePerMinute * 3);
    setTimeout(() => setShowOverwhelm(true), 500);
  }, [config]);
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
      setRevenueLost(prev => prev + (config.revenuePerMinute / 60));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, config.revenuePerMinute]);
  
  useEffect(() => {
    if (!isActive || messages.length >= config.messages.length) {
      if (messages.length >= config.messages.length && isActive) {
        setTimeout(() => setShowOverwhelm(true), 2000);
      }
      return;
    }
    
    const baseDelay = Math.max(800, 2500 - (messages.length * 120));
    const randomDelay = baseDelay + Math.random() * 1000;
    
    const timer = setTimeout(() => {
      const nextMessage = config.messages[messages.length];
      const newMessage: ChaosMessage = {
        ...nextMessage,
        id: `msg-${messages.length}`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setStressLevel(prev => Math.min(100, prev + 7));
      
      if (!isMuted) {
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
    }, randomDelay);
    
    return () => clearTimeout(timer);
  }, [isActive, messages.length, config.messages, isMuted]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const startSimulation = () => {
    setIsActive(true);
    setMessages([]);
    setElapsedSeconds(0);
    setRevenueLost(0);
    setStressLevel(10);
    setShowOverwhelm(false);
  };

  if (!isActive && messages.length === 0) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-8" data-testid="chaos-simulator-start">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Experience the Chaos</h2>
            <p className="text-slate-300 text-lg mb-2">
              You're the Chief Strategy Officer of <span className="text-white font-semibold">{companyName}</span>.
            </p>
            <p className="text-slate-400">
              It's 2:47 PM on a Tuesday. Your day is about to change.
            </p>
          </div>
          
          <Card className="bg-slate-800/50 border-red-500/30 mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-6 h-6 text-red-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-red-400 font-medium mb-1">{config.triggerSender}</p>
                  <p className="text-white font-medium">{config.triggerMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            onClick={startSimulation}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg"
            data-testid="button-start-chaos"
          >
            <Zap className="w-5 h-5 mr-2" />
            Begin Crisis Simulation
          </Button>
        </div>
      </div>
    );
  }

  if (showOverwhelm) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 rounded-xl p-8" data-testid="chaos-simulator-overwhelm">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <div className="grid grid-cols-4 gap-2 mb-8 opacity-30">
              {messages.slice(-8).map((msg, i) => (
                <div key={i} className="h-8 bg-slate-700 rounded animate-pulse" />
              ))}
            </div>
            
            <div className="space-y-4 mb-8">
              <h2 className="text-4xl font-bold text-white">This was 3 minutes.</h2>
              <p className="text-2xl text-red-400">{messages.length} critical messages.</p>
              <p className="text-2xl text-orange-400">{formatCurrency(revenueLost)} at risk.</p>
            </div>
            
            <div className="bg-slate-800/80 rounded-xl p-8 border border-slate-700 mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">
                How long would it take your team to get aligned?
              </h3>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {['30 min', '1 hour', '4 hours', '1 day+'].map((time, i) => (
                  <div 
                    key={time}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      i === 0 ? 'border-green-500 bg-green-500/10' : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <p className="text-white font-semibold">{time}</p>
                    {i === 0 && <p className="text-xs text-green-400 mt-1">With M</p>}
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-sm">
                The average Fortune 1000 company takes <span className="text-white font-semibold">4.2 hours</span> to coordinate a crisis response.
                <br />
                M reduces that to <span className="text-green-400 font-semibold">12 minutes</span>.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={onComplete}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            data-testid="button-continue-demo"
          >
            See How M Changes Everything
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden" data-testid="chaos-simulator-active">
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-red-500/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Badge className="bg-red-600 text-white animate-pulse px-4 py-1">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {config.title}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white"
              data-testid="button-toggle-sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-orange-400" />
              <span className="font-mono text-xl">{formatTime(elapsedSeconds)}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <span className="font-mono text-xl text-red-400">{formatCurrency(revenueLost)}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Organizational Stress Level</span>
            <span className="text-red-400 font-semibold">{stressLevel}%</span>
          </div>
          <Progress value={stressLevel} className="h-2 bg-slate-700" />
        </div>
      </div>
      
      <div className="h-[450px] overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => {
          const Icon = MESSAGE_ICONS[message.type];
          const delay = index * 50;
          
          return (
            <div 
              key={message.id}
              className={`flex items-start gap-3 animate-in slide-in-from-right duration-300`}
              style={{ animationDelay: `${delay}ms` }}
              data-testid={`chaos-message-${message.id}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${URGENCY_COLORS[message.urgency]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-300">{message.sender}</span>
                  <Badge variant="outline" className={`text-xs ${
                    message.urgency === 'critical' ? 'border-red-500 text-red-400' :
                    message.urgency === 'high' ? 'border-orange-500 text-orange-400' :
                    'border-yellow-500 text-yellow-400'
                  }`}>
                    {message.urgency.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-white text-sm">{message.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-slate-700 p-4 bg-slate-900/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {messages.length} messages
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {new Set(messages.map(m => m.sender)).size} stakeholders waiting
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-red-400 animate-pulse">More incoming...</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={skipToEnd}
              className="text-slate-400 hover:text-white"
              data-testid="button-skip-chaos"
            >
              Skip to overwhelm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChaosSimulator;
