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
    icon: Shield,
    title: 'IDENTIFY — Playbook Depth Chart',
    description: 'Build your strategic arsenal. Browse 170 pre-built playbooks across 9 domains — ready to deploy instantly.',
    color: 'text-[#2B8A6E]',
    bg: 'bg-[#2B8A6E]/10',
  },
  {
    icon: Zap,
    title: 'DETECT — Signal Intelligence',
    description: 'See AI-powered monitoring detect competitive threats, regulatory shifts, and market opportunities in real time.',
    color: 'text-[#0A0F2E]',
    bg: 'bg-[#C9A84C]/10',
  },
  {
    icon: Target,
    title: 'EXECUTE — 12-Minute Coordination',
    description: 'From trigger detection to full team mobilization in under 12 minutes — the platform enforces this standard.',
    color: 'text-[#C9A84C]',
    bg: 'bg-[#0A0F2E]/10',
  },
  {
    icon: BarChart3,
    title: 'ADVANCE — Outcome tracking',
    description: 'Every execution feeds back into your playbooks. AI suggests refinements. Your organization gets smarter.',
    color: 'text-[#2B8A6E]',
    bg: 'bg-[#2B8A6E]/10',
  },
  {
    icon: Bell,
    title: 'Real-Time Orchestration',
    description: 'Activate a playbook and your stakeholders get instant notifications with their assigned tasks and contextual briefs.',
    color: 'text-[#0A0F2E]',
    bg: 'bg-[#0A0F2E]/10',
  },
  {
    icon: Users,
    title: 'Command Center',
    description: 'Manage your response team, track task completion, and coordinate across functions in real time.',
    color: 'text-[#C9A84C]',
    bg: 'bg-[#C9A84C]/10',
  },
];

const steps = [
  { step: '01', label: 'Sign in', description: 'Continue with Google, GitHub, or Apple — instant access' },
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
        <section className="py-20 px-6 border-b border-[#E8E4DC]">
          <div className="max-w-4xl mx-auto text-center">
            <BrandStamp variant="dual" size="md" className="mb-8" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C" }}>Product Experience</span>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
            </div>
            <h1 className="text-5xl font-bold text-[#0A0F2E] mb-6 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Experience the Platform<br />
              <span className="text-[#C9A84C] italic">as a Real Customer</span>
            </h1>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Sign in, set up your workspace, and walk through an actual playbook activation — complete with real email notifications and a live command center.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#0A0F2E] hover:bg-[#141B45] text-white px-10 py-8 text-sm font-bold rounded-none gap-3 uppercase tracking-widest shadow-xl"
                onClick={() => { window.location.href = '/api/login'; }}
              >
                <LogIn className="h-4 w-4" />
                Sign In to Explore
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#0A0F2E] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white px-10 py-8 text-sm font-bold rounded-none gap-3 uppercase tracking-widest transition-colors shadow-sm"
                onClick={() => setLocation('/contact')}
              >
                Apply for Pilot Program
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <p className="mt-6 text-[10px] text-[#6B7280] uppercase tracking-widest font-bold">
              No credit card required. Your workspace is private and under your control.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-6 bg-[#F8F7F4] border-b border-[#E8E4DC]">
          <div className="max-w-4xl mx-auto">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C" }}>The Journey</span>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
            </div>
            <h2 className="text-4xl font-bold text-[#0A0F2E] text-center mb-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>What happens when you sign in</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {steps.map((s) => (
                <div key={s.step} className="bg-white rounded-none p-6 border border-[#E8E4DC] flex gap-4 items-start shadow-sm">
                  <div className="w-10 h-10 rounded-none bg-[#0A0F2E] text-[#C9A84C] flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <div className="font-bold text-[#0A0F2E] mb-1 uppercase tracking-widest text-[10px]">{s.label}</div>
                    <div className="text-[#6B7280] text-sm leading-relaxed">{s.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-[#0A0F2E] text-center mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Everything you'll have access to</h2>
            <p className="text-[#6B7280] text-center mb-16 uppercase tracking-widest text-[10px] font-bold">The full platform. No watered-down version.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f) => (
                <div key={f.title} className="bg-white rounded-none p-8 border border-[#E8E4DC] hover:border-[#0A0F2E] transition-all duration-300">
                  <div className={`w-10 h-10 rounded-none ${f.bg} flex items-center justify-center mb-6`}>
                    <f.icon className={`h-5 w-5 ${f.color}`} />
                  </div>
                  <h3 className="font-bold text-[#0A0F2E] mb-3 text-[10px] uppercase tracking-widest">{f.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Difference between paths */}
        <section className="py-24 px-6 bg-[#F8F7F4] border-t border-[#E8E4DC]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-[#0A0F2E] text-center mb-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Two ways to get started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-none p-8 border border-[#E8E4DC] shadow-sm">
                <div className="w-12 h-12 rounded-none bg-[#0A0F2E] flex items-center justify-center mb-6">
                  <Layers className="h-6 w-6 text-[#C9A84C]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A0F2E] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Explore the Product</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
                  Sign in and experience the full platform immediately. Ideal for evaluators, decision-makers, and teams doing due diligence.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Instant access', 'Full feature set', 'Sample data available', 'No commitment'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#6B7280]">
                      <ChevronRight className="h-4 w-4 text-[#C9A84C]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-[#0A0F2E] hover:bg-[#141B45] text-white rounded-none font-bold uppercase tracking-widest text-[10px] h-12"
                  onClick={() => { window.location.href = '/api/login'; }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In to Explore
                </Button>
              </div>

              <div className="bg-white rounded-none p-8 border border-[#C9A84C] shadow-lg relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-[#0A0F2E] text-[9px] font-bold uppercase tracking-widest px-3 py-1">Recommended for F1000</div>
                <div className="w-12 h-12 rounded-none bg-[#C9A84C] flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-[#0A0F2E]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A0F2E] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Apply for Pilot Program</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
                  A structured 90-day partnership for Fortune 1000 companies ready to validate execution velocity at enterprise scale.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Dedicated onboarding', 'Up to 25 users', 'Custom playbook configuration', 'Executive readout at 90 days'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#6B7280]">
                      <ChevronRight className="h-4 w-4 text-[#C9A84C]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0F2E] rounded-none font-bold uppercase tracking-widest text-[10px] h-12"
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
