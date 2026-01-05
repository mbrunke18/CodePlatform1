import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ArrowRight, 
  Calendar, 
  Share2,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  BarChart3,
  Clock,
  Trophy,
  Play
} from 'lucide-react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

interface DemoCompletionScreenProps {
  onClose: () => void;
  onShareDemo?: () => void;
  onRestart?: () => void;
  persona?: 'ceo' | 'coo' | 'chro' | 'cto' | 'cio' | 'cdo' | 'ciso' | 'cfo' | 'general';
  elapsedTime?: number;
  stakeholdersReached?: number;
  totalStakeholders?: number;
  scenarioTitle?: string;
  valueSaved?: string;
}

export default function DemoCompletionScreen({ 
  onClose, 
  onShareDemo,
  onRestart, 
  persona = 'general',
  elapsedTime = 720,
  stakeholdersReached = 47,
  totalStakeholders = 50,
  scenarioTitle = "Strategic Response",
  valueSaved = "$283K"
}: DemoCompletionScreenProps) {
  const [, setLocation] = useLocation();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completionRate = Math.round((stakeholdersReached / totalStakeholders) * 100);
  
  const valueHighlights = [
    {
      icon: Clock,
      value: formatTime(elapsedTime),
      title: "Execution Time",
      description: "vs 72 hours traditional",
      color: "text-emerald-400"
    },
    {
      icon: Users,
      value: stakeholdersReached.toString(),
      title: "Stakeholders Aligned",
      description: `${completionRate}% completion rate`,
      color: "text-blue-400"
    },
    {
      icon: TrendingUp,
      value: "360x",
      title: "Speed Increase",
      description: "Faster than manual coordination",
      color: "text-purple-400"
    },
    {
      icon: DollarSign,
      value: valueSaved,
      title: "Value Protected",
      description: "Executive time + opportunity cost",
      color: "text-amber-400"
    }
  ];

  const nextSteps = [
    {
      icon: Calendar,
      title: "Schedule Implementation Call",
      description: "30-minute consultation with our executive team",
      action: "Schedule Now",
      variant: "default" as const,
      testId: "schedule-call-btn",
      onClick: () => setLocation('/contact')
    },
    {
      icon: BarChart3,
      title: "Custom ROI Calculator",
      description: "Calculate your organization's potential savings",
      action: "Calculate ROI",
      variant: "outline" as const,
      testId: "roi-report-btn",
      onClick: () => setLocation('/calculator')
    },
    {
      icon: Target,
      title: "Explore Playbook Library",
      description: "Browse 166 pre-built strategic playbooks",
      action: "View Playbooks",
      variant: "outline" as const,
      testId: "explore-playbooks-btn",
      onClick: () => setLocation('/playbook-library')
    }
  ];

  const personaMessages: Record<NonNullable<typeof persona>, string> = {
    ceo: "As CEO, you've seen how M delivers strategic advantage through rapid execution. From your strategic stronghold, you protect market share and accelerate competitive response.",
    coo: "As COO, you've experienced operational excellence in action. Our playbook system reduces coordination overhead by 85%, freeing your teams to focus on execution.",
    chro: "As CHRO, you've seen how M improves workforce stability and cultural health. Customers report 34% better retention during crisis situations.",
    cto: "As CTO, you've experienced how M ensures technical resilience and accelerates innovation. Our platform protects your architecture while enabling rapid response.",
    cio: "As CIO, you've seen how M ensures digital continuity and compliance. Our playbook system maintains operational reliability while reducing incident response time.",
    cdo: "As CDO, you've experienced how M protects data integrity and accelerates analytics. Our platform ensures data governance while enabling rapid insight delivery.",
    ciso: "As CISO, you've seen how M strengthens security posture and reduces risk. Our playbook system provides instant threat response while maintaining compliance.",
    cfo: "As CFO, you've experienced how M protects financial stability and optimizes costs. Our platform reduces risk exposure while delivering measurable ROI.",
    general: "You've experienced the M difference. Pre-configured playbooks executed in minutes, mobilizing entire organizations with coordinated precision."
  };

  return (
    <motion.div 
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      data-testid="demo-completion-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/10">
          <CardContent className="p-6 md:p-8 space-y-6">
            
            <div className="text-center space-y-3">
              <motion.div 
                className="flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-2">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              <Badge className="bg-emerald-500 text-white text-sm px-3 py-1">
                Demo Complete
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Execution Successful
              </h1>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                {personaMessages[persona]}
              </p>
            </div>

            <div className="bg-gradient-to-r from-emerald-950/60 to-teal-950/60 rounded-xl p-6 border border-emerald-500/30">
              <div className="flex items-center justify-center gap-6 text-center flex-wrap">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-red-400/70 line-through">72 hours</div>
                  <div className="text-sm text-slate-500">Traditional Response</div>
                </div>
                <ArrowRight className="h-8 w-8 text-emerald-400 hidden md:block" />
                <div className="text-2xl text-emerald-400 md:hidden">→</div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-emerald-400">{formatTime(elapsedTime)}</div>
                  <div className="text-sm text-emerald-300">With M Platform</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {valueHighlights.map((highlight, index) => (
                <motion.div 
                  key={index} 
                  className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <highlight.icon className={`h-6 w-6 ${highlight.color} mx-auto mb-2`} />
                  <div className={`text-2xl font-bold ${highlight.color}`}>{highlight.value}</div>
                  <div className="text-sm font-medium text-white">{highlight.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{highlight.description}</div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-emerald-400" />
                Ready to Get Started?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {nextSteps.map((step, index) => (
                  <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-emerald-600/20 rounded-lg flex-shrink-0">
                          <step.icon className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                          <p className="text-xs text-slate-400">{step.description}</p>
                        </div>
                      </div>
                      <Button 
                        variant={step.variant}
                        size="sm"
                        className={step.variant === 'default' 
                          ? 'w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white' 
                          : 'w-full border-slate-600 hover:bg-slate-700 text-slate-300'}
                        onClick={step.onClick}
                        data-testid={step.testId}
                      >
                        {step.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-700">
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => setLocation('/demo')}
                data-testid="try-another-demo-btn"
              >
                <Play className="h-4 w-4 mr-2" />
                Try Another Demo
              </Button>
              
              {onShareDemo && (
                <Button 
                  onClick={onShareDemo}
                  variant="outline"
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20"
                  data-testid="share-demo-btn"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Demo
                </Button>
              )}
              
              {onRestart && (
                <Button
                  onClick={onRestart}
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                  data-testid="restart-demo-btn"
                >
                  Restart This Demo
                </Button>
              )}
              
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-slate-500 hover:text-white"
                data-testid="completion-close-btn"
              >
                Return to Platform
              </Button>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
