import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageLayout from '@/components/layout/PageLayout';
import { BrandStamp } from '@/components/BrandStamp';
import { updatePageMetadata } from '@/lib/seo';
import {
  LogIn,
  Zap,
  Shield,
  Target,
  BarChart3,
  Users,
  Clock,
  ChevronRight,
  ArrowRight,
  Layers,
  Bell,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'DETECT — Signal Intelligence',
    description: 'See AI-powered monitoring detect competitive threats, regulatory shifts, and market opportunities in real time.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Target,
    title: 'EXECUTE — Playbook Activation',
    description: 'Browse 170 pre-built playbooks and activate a coordinated response across your org within 12 minutes.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: BarChart3,
    title: 'ADVANCE — Live Analytics',
    description: 'Track execution velocity, decision timing, and stakeholder coverage across every activation.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Bell,
    title: 'Real Email Notifications',
    description: 'Activate a playbook and your stakeholders get a real-time email with their assigned tasks and actions.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Users,
    title: 'Command Center',
    description: 'Manage your response team, track task completion, and coordinate across functions in real time.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    icon: Clock,
    title: '12-Minute Activation',
    description: 'From trigger detection to full team mobilization in under 12 minutes — the platform enforces this standard.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
];

const steps = [
  { step: '01', label: 'Sign in', description: 'Use your existing account or create one instantly' },
  { step: '02', label: 'Set up your workspace', description: 'Walk through a 7-step configuration wizard in under 5 minutes' },
  { step: '03', label: 'Explore with sample data', description: 'Opt in to pre-populate your workspace so you can see the platform in action' },
  { step: '04', label: 'Activate a playbook', description: 'Pick a scenario, launch it, and experience the full execution loop' },
];

export default function ExplorePage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: 'Explore Execution OS — Experience the Full Platform',
      description: 'Sign in and experience VaughnMartin Execution OS as a real customer. Browse 170 playbooks, activate a scenario, and see a coordinated response unfold.',
    });
  }, []);

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">

        {/* Hero */}
        <section className="py-20 px-6 border-b border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <BrandStamp variant="dual" size="md" className="mb-8" />
            <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-200 font-semibold uppercase tracking-widest text-xs px-4 py-2">
              Product Experience
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Experience the Platform<br />
              <span className="text-blue-600">as a Real Customer</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed">
              Sign in, set up your workspace, and walk through an actual playbook activation — complete with real email notifications and a live command center.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#0A0F2E] hover:bg-[#1a2040] text-white px-10 py-6 text-lg font-semibold rounded-lg gap-3"
                onClick={() => { window.location.href = '/api/login'; }}
              >
                <LogIn className="h-5 w-5" />
                Sign In to Explore
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-6 text-lg font-semibold rounded-lg gap-3"
                onClick={() => setLocation('/contact')}
              >
                Apply for Pilot Program
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              No credit card required. Your workspace is private and under your control.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">What happens when you sign in</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {steps.map((s) => (
                <div key={s.step} className="bg-white rounded-xl p-6 border border-gray-200 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#0A0F2E] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">{s.label}</div>
                    <div className="text-gray-600 text-sm leading-relaxed">{s.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Everything you'll have access to</h2>
            <p className="text-gray-600 text-center mb-12">The full platform. No watered-down version.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center mb-4`}>
                    <f.icon className={`h-5 w-5 ${f.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Difference between paths */}
        <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Two ways to get started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-8 border-2 border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <Layers className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Explore the Product</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Sign in and experience the full platform immediately. Ideal for evaluators, decision-makers, and teams doing due diligence.
                </p>
                <ul className="space-y-2 mb-8">
                  {['Instant access', 'Full feature set', 'Sample data available', 'No commitment'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <ChevronRight className="h-4 w-4 text-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-[#0A0F2E] hover:bg-[#1a2040] text-white"
                  onClick={() => { window.location.href = '/api/login'; }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In to Explore
                </Button>
              </div>

              <div className="bg-white rounded-xl p-8 border-2 border-[#C9A84C]">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-4">
                  <Shield className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Apply for Pilot Program</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  A structured 90-day partnership for Fortune 1000 companies ready to validate execution velocity at enterprise scale.
                </p>
                <ul className="space-y-2 mb-8">
                  {['Dedicated onboarding', 'Up to 25 users', 'Custom playbook configuration', 'Executive readout at 90 days'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <ChevronRight className="h-4 w-4 text-amber-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full border-[#C9A84C] text-[#C9A84C] hover:bg-amber-50"
                  onClick={() => setLocation('/contact')}
                >
                  Apply for Pilot
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
