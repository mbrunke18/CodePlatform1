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

  const keyStats = [
    { 
      icon: Clock, 
      value: "12 min", 
      label: "Target Execution Time",
      comparison: "Design goal vs 72-hour industry standard",
      color: "text-green-400"
    },
    { 
      icon: Target, 
      value: "5 AI", 
      label: "Intelligence Modules",
      comparison: "Pulse, Flux, Prism, Echo, Nova",
      color: "text-[#0A0F2E]"
    },
    { 
      icon: CheckCircle, 
      value: "13", 
      label: "Strategic Scenarios",
      comparison: "Pre-built playbook templates",
      color: "text-[#C9A84C]"
    },
    { 
      icon: Zap, 
      value: "170", 
      label: "Playbook Templates",
      comparison: "Strategic response frameworks",
      color: "text-orange-400"
    }
  ];

  const demoHighlights = [
    "12-Minute Execution Playbooks (vs 72-hour industry standard)",
    "Strategic Work Breakdown Structure with phases & dependencies",
    "All 5 AI Intelligence Modules in action",
    "Trigger-activated coordinated execution",
    "170 strategic playbook templates across 9 operational domains",
    "Interactive ROI calculations showing 360x velocity",
    "Practice drills and strategic rehearsals"
  ];

  return (
    <div 
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      data-testid="demo-welcome-screen"
    >
      <Card className="bg-white border-[#2B8A6E]/70 shadow-2xl backdrop-blur-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <CardContent className="p-8 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0A0F2E] to-teal-600 rounded-xl flex items-center justify-center">
                <Rocket className="h-8 w-8 text-gray-900" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome to M's Live Demo
            </h1>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              See how M's elite methodology transforms 72-hour strategic coordination into 12-minute execution—the Strategic Execution Operating System in action
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyStats.map((stat, index) => (
              <Card key={index} className="bg-gray-50 border-gray-200">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-800">{stat.label}</div>
                  <div className="text-xs text-gray-700 mt-1">{stat.comparison}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* What You'll See */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="h-6 w-6 text-[#0A0F2E]" />
              What You'll Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {demoHighlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-800">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Early Access Program */}
          <div className="bg-gradient-to-r   rounded-lg p-6 border border-[#C9A84C]/30">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#C9A84C]" />
              Built for Fortune 1000 Strategic Execution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">10</div>
                <div className="text-xs text-gray-800">Pilot Program Target</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">90</div>
                <div className="text-xs text-gray-800">Day Validation Period</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">Q1</div>
                <div className="text-xs text-gray-800">2025 Planned Launch</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
                <div className="text-xs text-gray-800">Risk-Free Trial</div>
              </div>
            </div>
          </div>

          {/* Demo Disclaimer */}
          <div className="bg-yellow-900/30 rounded-lg p-6 border border-yellow-600/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-800 mb-2">
                  <strong className="text-gray-900">Interactive Demo:</strong> Sample data shown for illustration purposes. Scenarios and workflows reflect M's design capabilities and championship-level execution methodology.
                </p>
                <p className="text-gray-700 text-sm">
                  Experience how preparation-driven execution transforms 72 hours of getting the right people in the room into 12 minutes of live execution — roles assigned, tasks staged, teams already moving.
                </p>
              </div>
            </div>
          </div>

          {/* Duration Info */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-700">
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
              className="border-gray-600 text-gray-800 hover:bg-gray-800"
              data-testid="welcome-close-btn"
            >
              Maybe Later
            </Button>
            <Button 
              onClick={onStartDemo}
              className="bg-gradient-to-r from-[#0A0F2E] to-teal-600 hover:from-[#0A0F2E] hover:to-teal-700 text-gray-900 font-semibold px-8 py-6 text-lg"
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
