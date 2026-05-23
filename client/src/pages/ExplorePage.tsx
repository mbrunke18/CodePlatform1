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
    title: 'IDENTIFY — Readiness Protocol Depth Chart',
    description: 'Build your strategic arsenal. Browse 170 pre-built Readiness Protocols across 9 domains — ready to deploy instantly.',
    color: 'text-[#2B8A6E]',
    bg: 'bg-[#F8F7F4]',
  },
  {
    icon: Zap,
    title: 'DETECT — Signal Intelligence',
    description: 'See Continuous monitoring detect competitive threats, regulatory shifts, and market opportunities in real time.',
    color: 'text-[#0A0F2E]',
    bg: 'bg-[#F8F7F4]',
  },
  {
    icon: Target,
    title: 'EXECUTE — 12-Minute Coordination',
    description: 'From trigger detection to full team mobilization in under 12 minutes — the platform enforces this standard.',
    color: 'text-[#C9A84C]',
    bg: 'bg-[#F8F7F4]',
  },
  {
    icon: BarChart3,
    title: 'ADVANCE — Outcome tracking',
    description: 'Every execution feeds back into your Readiness Protocols. AI suggests refinements. Your organization gets smarter.',
    color: 'text-[#2B8A6E]',
    bg: 'bg-[#F8F7F4]',
  },
  {
    icon: Bell,
    title: 'Real-Time Orchestration',
    description: 'Activate a Readiness Protocol and your stakeholders get instant notifications with their assigned tasks and contextual briefs.',
    color: 'text-[#0A0F2E]',
    bg: 'bg-[#F8F7F4]',
  },
  {
    icon: Users,
    title: 'Command Center',
    description: 'Manage your response team, track task completion, and coordinate across functions in real time.',
    color: 'text-[#C9A84C]',
    bg: 'bg-[#F8F7F4]',
  },
];

const steps = [
  { step: '01', label: 'Sign in', description: 'Continue with Google, GitHub, or Apple — instant access' },
  { step: '02', label: 'Set up your workspace', description: 'Walk through a 7-step configuration wizard in under 5 minutes' },
  { step: '03', label: 'Explore with sample data', description: 'Opt in to pre-populate your workspace so you can see the platform in action' },
  { step: '04', label: 'Activate a Readiness Protocol', description: 'Pick a scenario, launch it, and experience the full execution loop' },
];

export default function ExplorePage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: 'Explore Readiness OS — Experience the Full Platform',
      description: 'Sign in and experience VaughnMartin Readiness OS as a real customer. Browse 180 Readiness Protocols, activate a scenario, and see a coordinated response unfold.',
    });
  }, []);

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F7F4]">

        {/* ─── Dark Hero ─────────────────────────────────────────────── */}
        <section style={{ background: '#0A0F2E', padding: '64px 24px 56px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />
          <div className="max-w-4xl mx-auto text-center" style={{ position: 'relative', zIndex: 1 }}>
            <BrandStamp variant="dual" size="md" className="mb-8" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C" }}>Product Experience</span>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#F0EDE4' }}>
              Experience the Platform<br />
              <em style={{ color: '#C9A84C' }}>as a Real Customer</em>
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light" style={{ color: 'rgba(240,237,228,0.6)' }}>
              Sign in, set up your workspace, and walk through an actual Readiness Protocol activation — complete with real email notifications and a live command center.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] px-10 py-8 text-sm font-bold rounded-none gap-3 uppercase tracking-widest"
                onClick={() => { window.location.href = '/founding-partner-program'; }}
              >
                <LogIn className="h-4 w-4" />
                Sign In to Explore
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white px-10 py-8 text-sm font-bold rounded-none gap-3 uppercase tracking-widest transition-colors"
                onClick={() => setLocation('/contact')}
              >
                Apply for Founding Partner Access
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <p className="mt-6 text-[10px] uppercase tracking-widest font-bold" style={{ color: 'rgba(240,237,228,0.35)' }}>
              No credit card required. Your workspace is private and under your control.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-6 bg-[#F8F7F4] border-b border-[#E8E4DC]">
          <div className="max-w-4xl mx-auto">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C" }}>The Journey</span>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
            </div>
            <h2 className="text-4xl font-bold text-[#0A0F2E] text-center mb-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>What happens when you sign in</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {steps.map((s) => (
                <div key={s.step} className="bg-white rounded-none p-6 border border-[#E8E4DC] flex gap-4 items-start">
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: '#C9A84C', lineHeight: 1, flexShrink: 0, minWidth: 24 }}>
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
                  <div style={{ width: 20, height: 1.5, background: '#C9A84C', marginBottom: 20 }} />
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
              <div className="bg-white rounded-none p-8 border border-[#E8E4DC]">
                <div style={{ width: 48, height: 2, background: '#0A0F2E', marginBottom: 24 }} />
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
                  onClick={() => { window.location.href = '/founding-partner-program'; }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In to Explore
                </Button>
              </div>

              <div className="bg-white rounded-none p-8 border border-[#C9A84C] relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-[#0A0F2E] text-[9px] font-bold uppercase tracking-widest px-3 py-1">Recommended for F1000</div>
                <div style={{ width: 48, height: 2, background: '#C9A84C', marginBottom: 24 }} />
                <h3 className="text-2xl font-bold text-[#0A0F2E] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Founding Partner Program</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
                  A structured 90-day partnership for enterprise organizations ready to validate execution velocity at enterprise scale.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Dedicated onboarding', 'Up to 25 users', 'Custom Readiness Protocol configuration', 'Executive readout at 90 days'].map(item => (
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
                  Apply for Founding Partner Access
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
