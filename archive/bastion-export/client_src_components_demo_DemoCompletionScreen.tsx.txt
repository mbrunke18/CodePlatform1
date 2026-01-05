import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ArrowRight, 
  Calendar, 
  Download, 
  Share2,
  Mail,
  TrendingUp,
  Target,
  Zap,
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';

interface DemoCompletionScreenProps {
  onClose: () => void;
  onShareDemo: () => void;
  persona?: 'ceo' | 'coo' | 'chro' | 'general';
}

export default function DemoCompletionScreen({ onClose, onShareDemo, persona = 'general' }: DemoCompletionScreenProps) {
  
  const valueHighlights = [
    {
      icon: Zap,
      title: "12-Minute Execution",
      description: "vs 72-hour industry standard",
      impact: "85% faster coordination"
    },
    {
      icon: DollarSign,
      title: "$8.2M Monthly Value",
      description: "Average customer impact",
      impact: "1,847% platform ROI"
    },
    {
      icon: CheckCircle,
      title: "94% Success Rate",
      description: "First-time playbook activation",
      impact: "vs 67% industry average"
    },
    {
      icon: Target,
      title: "80+ Playbooks",
      description: "Pre-configured for your industry",
      impact: "Ready to execute today"
    }
  ];

  const nextSteps = [
    {
      icon: Calendar,
      title: "Schedule Implementation Call",
      description: "30-minute consultation with our executive team",
      action: "Schedule Now",
      variant: "default" as const,
      testId: "schedule-call-btn"
    },
    {
      icon: BarChart3,
      title: "Request Custom ROI Analysis",
      description: "Personalized value calculation for your organization",
      action: "Get ROI Report",
      variant: "outline" as const,
      testId: "roi-report-btn"
    },
    {
      icon: Download,
      title: "Download Executive Summary",
      description: "PDF presentation for board meetings",
      action: "Download PDF",
      variant: "outline" as const,
      testId: "download-pdf-btn"
    }
  ];

  const personaMessages = {
    ceo: "As CEO, you've seen how Bastion delivers strategic advantage through rapid execution. From your strategic stronghold, you protect market share and accelerate competitive response - typically delivering 6-12 month head starts over competitors.",
    coo: "As COO, you've experienced operational excellence in action. Our playbook system reduces coordination overhead by 85%, freeing your teams to focus on execution rather than email chains and status meetings.",
    chro: "As CHRO, you've seen how Bastion improves workforce stability and cultural health. Customers report 34% better retention during crisis situations and 41% higher employee morale through clear communication protocols.",
    general: "You've experienced how Bastion transforms executive decision-making. From the apex of command, your pre-configured playbooks execute in 12 minutes, mobilizing entire organizations with one click."
  };

  return (
    <div 
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      data-testid="demo-completion-screen"
    >
      <Card className="bg-gray-900/98 border-green-500/70 shadow-2xl backdrop-blur-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <CardContent className="p-8 space-y-6">
          
          {/* Success Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white">
              Demo Complete!
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {personaMessages[persona]}
            </p>
          </div>

          {/* Value Summary */}
          <div className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 rounded-lg p-6 border border-blue-500/30">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-400" />
              What You Just Experienced
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {valueHighlights.map((highlight, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <highlight.icon className="h-8 w-8 text-blue-400 mb-2" />
                  <div className="text-lg font-bold text-white mb-1">{highlight.title}</div>
                  <div className="text-sm text-gray-300 mb-2">{highlight.description}</div>
                  <Badge variant="outline" className="bg-green-600/20 text-green-300 border-green-500/50 text-xs">
                    {highlight.impact}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ArrowRight className="h-6 w-6 text-blue-400" />
              Your Next Steps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {nextSteps.map((step, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-600/20 rounded-lg">
                        <step.icon className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                        <p className="text-sm text-gray-300">{step.description}</p>
                      </div>
                    </div>
                    <Button 
                      variant={step.variant}
                      className={step.variant === 'default' ? 'w-full bg-blue-600 hover:bg-blue-700' : 'w-full border-gray-600 hover:bg-gray-800'}
                      data-testid={step.testId}
                    >
                      {step.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Share Demo */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Share2 className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Share This Demo</h3>
                  <p className="text-sm text-gray-300">
                    Send this interactive experience to your executive team or board members
                  </p>
                </div>
              </div>
              <Button 
                onClick={onShareDemo}
                variant="outline"
                className="border-purple-500 text-purple-300 hover:bg-purple-600/20"
                data-testid="share-demo-btn"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Demo
              </Button>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-blue-950/50 to-teal-950/50 rounded-lg p-6 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Users className="h-8 w-8 text-blue-400" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Ready to Transform Your Organization?</h3>
                  <p className="text-gray-300">
                    Join Fortune 1000 companies achieving 12-minute execution velocity
                  </p>
                </div>
              </div>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold px-6"
                data-testid="contact-sales-btn"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Sales
              </Button>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-gray-400 hover:text-white"
              data-testid="completion-close-btn"
            >
              Return to Platform
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
