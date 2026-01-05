import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  CheckCircle,
  Zap,
  Building2,
  DollarSign
} from 'lucide-react';

interface DemoWelcomeScreenProps {
  onStartDemo: () => void;
  onClose: () => void;
}

export default function DemoWelcomeScreen({ onStartDemo, onClose }: DemoWelcomeScreenProps) {
  const fortune1000Companies = [
    { name: "Fortune 500 Healthcare", industry: "Healthcare" },
    { name: "Global Financial Services", industry: "Finance" },
    { name: "Manufacturing Leader", industry: "Manufacturing" },
    { name: "Retail Enterprise", industry: "Retail" }
  ];

  const keyStats = [
    { 
      icon: Clock, 
      value: "12 minutes", 
      label: "Average Execution Time",
      comparison: "vs 72-hour industry standard",
      color: "text-green-400"
    },
    { 
      icon: DollarSign, 
      value: "$8.2M", 
      label: "Monthly Value Created",
      comparison: "Average per customer",
      color: "text-blue-400"
    },
    { 
      icon: CheckCircle, 
      value: "94%", 
      label: "Execution Success Rate",
      comparison: "First-time playbook activation",
      color: "text-purple-400"
    },
    { 
      icon: Zap, 
      value: "80+", 
      label: "Executive Playbooks",
      comparison: "Pre-configured scenarios",
      color: "text-orange-400"
    }
  ];

  const demoHighlights = [
    "All 5 AI Intelligence Modules in action",
    "NFL coach-level decision velocity",
    "Industry-specific crisis scenarios",
    "Real-time trigger management",
    "Interactive ROI calculations",
    "Executive War Room experience"
  ];

  return (
    <div 
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      data-testid="demo-welcome-screen"
    >
      <Card className="bg-gray-900/98 border-blue-500/70 shadow-2xl backdrop-blur-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <CardContent className="p-8 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                <Rocket className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white">
              Welcome to Bastion's Live Demo
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience how Fortune 1000 executives achieve 12-minute execution vs the 72-hour industry standard with Bastion - your strategic stronghold for proactive leadership
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyStats.map((stat, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-300">{stat.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{stat.comparison}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* What You'll See */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-400" />
              What You'll Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {demoHighlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 rounded-lg p-6 border border-blue-500/30">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-400" />
              Trusted by Fortune 1000 Leaders
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {fortune1000Companies.map((company, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-300 font-medium">{company.name}</div>
                  <Badge variant="outline" className="mt-1 text-xs">{company.industry}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Executive Testimonial */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 italic mb-3">
                  "Bastion transformed how we respond to crisis situations. What used to take 3 days of email coordination now happens in 12 minutes with one-click playbook execution. It's like having an NFL coach's playbook for business - every scenario pre-planned, every team member knows their role."
                </p>
                <div className="text-white font-semibold">Sarah Chen</div>
                <div className="text-gray-400 text-sm">Chief Operating Officer, Fortune 500 Manufacturing</div>
              </div>
            </div>
          </div>

          {/* Duration Info */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Demo Duration: 2-10 minutes (your choice)</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Interactive & Fully Automated</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
              data-testid="welcome-close-btn"
            >
              Maybe Later
            </Button>
            <Button 
              onClick={onStartDemo}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold px-8 py-6 text-lg"
              data-testid="welcome-start-demo-btn"
            >
              <Rocket className="h-5 w-5 mr-2" />
              Launch Demo Experience
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
