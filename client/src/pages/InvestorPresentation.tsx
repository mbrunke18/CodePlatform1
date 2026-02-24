import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import StandardNav from '@/components/layout/StandardNav';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Shield,
  Zap,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Brain,
  Eye,
  Target,
  Swords,
  Users,
  Rocket,
  BarChart3,
  Clock,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Activity,
  Award,
  Building2,
  Mail,
  Bot,
  Layers
} from 'lucide-react';

function InvestorPresentation() {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const totalSlides = 17;

  const goToNext = useCallback(() => {
    setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goToNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goToPrev(); }
      if (e.key === 'f') { e.preventDefault(); toggleFullscreen(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, toggleFullscreen]);

  const slides = [
    () => (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="inline-block px-5 py-2 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-sm font-semibold mb-8">
          10.3% revenue impact within 12 months
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          The Strategic Execution OS<br />for Fortune 1000
        </h1>
        <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mb-12">
          170 pre-built playbooks that transform enterprise response from 72 hours to 12 minutes
        </p>
        <div className="flex items-center gap-2 text-slate-300 text-lg">
          <span className="font-semibold text-white">Martin Brunke</span>
          <span>, Founder & CEO</span>
          <span className="mx-2">|</span>
          <span className="text-teal-400">martinbrunke@executeiq.io</span>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">The Problem</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 text-center max-w-4xl">
          30% of strategic value is lost to execution gaps.
        </h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full">
          <div className="space-y-4">
            <p className="text-slate-200 text-lg leading-relaxed">
              When a strategic trigger hits — a competitor launches, regulations shift, a cyber threat emerges — enterprises descend into coordination chaos.
            </p>
            <p className="text-slate-200 text-lg leading-relaxed">
              Teams scramble across Slack, email, and ad-hoc meetings. Playbooks don't exist. Stakeholders aren't pre-identified. Budgets aren't pre-approved. The result: 72+ hours of fumbling while value evaporates.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { value: '72 hours', label: 'Average strategic response time', sub: 'Signal to coordinated action' },
              { value: '30%', label: 'Strategic value lost', sub: 'McKinsey research' },
              { value: '82%', label: 'Boards require crisis preparedness', sub: 'Post-2020 governance mandate' },
              { value: '95% / 16%', label: 'CSOs: AI will reshape priorities — but few reimagining', sub: 'Deloitte 2026 CSO Survey' },
            ].map((s, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                <div className="text-2xl font-bold text-teal-400">{s.value}</div>
                <div className="text-white font-medium">{s.label}</div>
                <div className="text-slate-300 text-sm">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">The Cost</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center max-w-4xl">
          Slow coordination is a $20M+ problem per incident.
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
          {[
            { icon: <AlertTriangle className="w-8 h-8 text-red-400" />, value: '$22-50M', label: 'Average cost per ransomware incident', sub: 'IBM Security 2025', color: 'border-red-500/30' },
            { icon: <Zap className="w-8 h-8 text-teal-400" />, value: '340x', label: 'Faster with Execution OS', sub: '72 hours → 12 minutes', color: 'border-teal-500/30' },
            { icon: <DollarSign className="w-8 h-8 text-green-400" />, value: '$21-33M', label: 'Value created per crisis averted', sub: 'Revenue protection + opportunity capture', color: 'border-green-500/30' },
          ].map((c, i) => (
            <div key={i} className={`bg-slate-900/80 border ${c.color} rounded-xl p-8 text-center`}>
              <div className="flex justify-center mb-4">{c.icon}</div>
              <div className="text-3xl font-bold text-white mb-2">{c.value}</div>
              <div className="text-slate-200 font-medium mb-1">{c.label}</div>
              <div className="text-slate-500 text-sm">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">The Solution</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Execution OS: The IDEA Framework™
        </h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl w-full mb-8">
          {[
            { letter: 'I', name: 'IDENTIFY', desc: 'AI watches 847+ signals across news, regulatory, market, and threat feeds', icon: <Eye className="w-6 h-6" />, color: 'from-violet-600 to-violet-800' },
            { letter: 'D', name: 'DETECT', desc: 'Match signals to playbooks with confidence scoring and stakeholder mapping', icon: <Brain className="w-6 h-6" />, color: 'from-blue-600 to-blue-800' },
            { letter: 'E', name: 'EXECUTE', desc: 'One-click activation. 12-minute full mobilization. Pre-approved budgets deployed.', icon: <Zap className="w-6 h-6" />, color: 'from-teal-600 to-teal-800' },
            { letter: 'A', name: 'ADVANCE', desc: 'Learn from every activation. AI refines playbooks. Institutional knowledge captured.', icon: <TrendingUp className="w-6 h-6" />, color: 'from-amber-600 to-amber-800' },
          ].map((p, i) => (
            <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
              <div className={`bg-gradient-to-b ${p.color} p-4 flex items-center gap-3`}>
                <span className="text-3xl font-black text-white/90">{p.letter}</span>
                <div>
                  <div className="text-white font-bold text-sm">{p.name}</div>
                  <div className="text-white/80">{p.icon}</div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-slate-200 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-slate-300 text-center">
          <span className="text-teal-400 font-semibold">170 playbooks</span> ready to deploy across <span className="text-teal-400 font-semibold">9 strategic domains</span>.
        </p>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">The Transformation</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Same trigger. Different outcome.
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
          <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-8">
            <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Without Execution OS
            </h3>
            <div className="space-y-4">
              {['T+0: Signal detected by random employee', 'T+4h: Escalated via email chain', 'T+12h: Leadership aware', 'T+24h: War room assembled', 'T+48h: Response plan drafted', 'T+72h: First coordinated action'].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span className="text-slate-200 text-sm">{t}</span>
                </div>
              ))}
              <div className="mt-4 p-3 bg-red-900/40 rounded-lg text-red-300 font-semibold text-center">
                Result: $22-50M in damage
              </div>
            </div>
          </div>
          <div className="bg-teal-950/30 border border-teal-500/30 rounded-xl p-8">
            <h3 className="text-xl font-bold text-teal-400 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5" /> With Execution OS
            </h3>
            <div className="space-y-4">
              {['T+0: AI detects signal automatically', 'T+2m: Playbook matched with 94% confidence', 'T+4m: Stakeholders notified, tasks assigned', 'T+8m: Budget pre-approved, resources staged', 'T+12m: Full coordinated response active', 'T+24h: Post-action review, playbook refined'].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0" />
                  <span className="text-slate-200 text-sm">{t}</span>
                </div>
              ))}
              <div className="mt-4 p-3 bg-teal-900/40 rounded-lg text-teal-300 font-semibold text-center">
                Result: $21-33M saved
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">The Platform</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          170 playbooks across three domains
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div className="bg-slate-900/80 border border-green-500/30 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Swords className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-green-400">OFFENSE</h3>
              <span className="ml-auto text-2xl font-bold text-green-400">58</span>
            </div>
            <ul className="space-y-2 text-slate-200 text-sm">
              {['Market expansion', 'Product launches', 'M&A integration', 'Competitive response', 'Revenue acceleration', 'Partnership activation'].map((item, i) => (
                <li key={i} className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-green-500 shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-900/80 border border-red-500/30 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-red-400">DEFENSE</h3>
              <span className="ml-auto text-2xl font-bold text-red-400">58</span>
            </div>
            <ul className="space-y-2 text-slate-200 text-sm">
              {['Crisis management', 'Cybersecurity response', 'Regulatory compliance', 'Reputation protection', 'Supply chain disruption', 'Legal & litigation'].map((item, i) => (
                <li key={i} className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-red-500 shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-purple-400">SPECIAL TEAMS</h3>
              <span className="ml-auto text-2xl font-bold text-purple-400">54</span>
            </div>
            <ul className="space-y-2 text-slate-200 text-sm">
              {['Digital transformation', 'Culture change', 'Talent acquisition', 'ESG & sustainability', 'Innovation pipeline', 'Board governance'].map((item, i) => (
                <li key={i} className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-purple-500 shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">Market Opportunity</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          $13-20B TAM growing 15-20% annually
        </h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Market Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: 'TAM', value: '$13-20B', desc: 'Strategic execution software' },
                { label: 'SAM', value: '$5-8B', desc: 'Fortune 1000 enterprises' },
                { label: 'SOM', value: '$500M-1B', desc: 'Year 5 target' },
              ].map((m, i) => (
                <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex items-center gap-4">
                  <span className="text-teal-400 font-bold text-sm w-12">{m.label}</span>
                  <span className="text-white font-bold text-lg">{m.value}</span>
                  <span className="text-slate-300 text-sm ml-auto">{m.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Why Now?</h3>
            <div className="space-y-3">
              {[
                'Disruptions now compound and cascade — single-domain response is obsolete',
                'McKinsey: "Operating models stretched beyond their limits" (State of Organizations 2026)',
                'Crisis frequency increasing 3x since 2020',
                'Board-level mandate for crisis preparedness (82%)',
                'AI maturity enables real-time signal processing',
                'No incumbent owns strategic execution infrastructure',
                '"Predict-and-act is dead" — enterprises need response infrastructure',
                '88% use AI, but only 1/3 scaling across enterprise (McKinsey State of AI)',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">The Paradigm Shift</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center max-w-4xl">
          From Prediction to Preparation
        </h2>
        <p className="text-slate-300 text-center max-w-3xl mb-10">
          There is no data on the future. What enterprises need is execution infrastructure built before the moment arrives.
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full mb-10">
          <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-8">
            <h3 className="text-xl font-bold text-red-400 mb-2">The Dead Model</h3>
            <p className="text-slate-400 text-sm mb-4">Predict → Plan → Execute</p>
            <div className="space-y-3">
              {['Assumes stable, linear environment', 'Ad-hoc response teams assembled after the fact', '72-hour coordination loops', 'Knowledge lost when people leave', 'Same cost, same scramble, every time'].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span className="text-slate-300 text-sm">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-teal-950/30 border border-teal-500/30 rounded-xl p-8">
            <h3 className="text-xl font-bold text-teal-400 mb-2">The Execution OS Model</h3>
            <p className="text-slate-400 text-sm mb-4">Detect → Activate → Coordinate → Execute → Advance</p>
            <div className="space-y-3">
              {['Built for compound, cascading disruptions', 'Pre-built playbooks with decision rights mapped', '12-minute coordinated execution', 'Institutional intelligence that compounds', 'Each response makes the next one faster'].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0" />
                  <span className="text-slate-300 text-sm">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-4xl w-full">
          {[
            { from: 'Signal-First', to: 'IDENTIFY', desc: 'Signal detection before cascades' },
            { from: 'Rapid Coordination', to: 'DETECT + EXECUTE', desc: '12-min coordination, pre-defined rights' },
            { from: 'Adaptive Intelligence', to: 'ADVANCE', desc: 'Grows stronger from every disruption' },
          ].map((m, i) => (
            <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-slate-400 text-xs font-semibold uppercase">{m.from}</div>
              <div className="text-teal-400 font-bold my-1">→ {m.to}</div>
              <div className="text-slate-300 text-xs">{m.desc}</div>
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-xs mt-6">Execution OS IDEA Framework™ — Built for the era of compound disruption</p>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">Competitive Landscape</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center max-w-4xl">
          No one owns strategic execution infrastructure.
        </h2>
        <div className="grid md:grid-cols-5 gap-4 max-w-5xl w-full">
          {[
            { name: 'McKinsey / BCG', type: 'Strategy Consulting', has: 'Strategy frameworks', missing: 'No software, no automation, no real-time', color: 'border-slate-700' },
            { name: 'ServiceNow / Jira', type: 'Workflow Tools', has: 'Task management', missing: 'No playbooks, no AI signals, no strategy layer', color: 'border-slate-700' },
            { name: 'PagerDuty', type: 'Incident Response', has: 'IT alerting', missing: 'IT-only, no strategic execution', color: 'border-slate-700' },
            { name: 'Palantir', type: 'Data Analytics', has: 'Data analysis', missing: 'No playbooks, no coordination, no execution', color: 'border-slate-700' },
          ].map((c, i) => (
            <div key={i} className={`bg-slate-900/80 border ${c.color} rounded-xl p-4`}>
              <div className="text-white font-bold text-sm mb-1">{c.name}</div>
              <div className="text-slate-500 text-xs mb-3">{c.type}</div>
              <div className="text-green-400 text-xs mb-1">✓ {c.has}</div>
              <div className="text-red-400 text-xs">✗ {c.missing}</div>
            </div>
          ))}
          <div className="bg-teal-950/40 border-2 border-teal-500/50 rounded-xl p-4">
            <div className="text-teal-400 font-bold text-sm mb-1">Execution OS</div>
            <div className="text-teal-300/60 text-xs mb-3">Strategic Execution OS</div>
            <div className="text-xs space-y-1">
              {['AI signal detection', 'Pre-built playbooks', 'Automated coordination', 'Learning & refinement'].map((f, i) => (
                <div key={i} className="text-teal-300">✓ {f}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">Business Model</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Enterprise SaaS with land-and-expand
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full mb-10">
          {[
            { tier: 'Starter', price: '$250K', desc: 'Single domain (Defense)', features: ['25 playbooks', '100 signals monitored', 'Standard integrations', 'Email support'] },
            { tier: 'Professional', price: '$750K', desc: 'Multi-domain expansion', features: ['100 playbooks', '500+ signals monitored', 'Full integration suite', 'Dedicated CSM'], highlight: true },
            { tier: 'Enterprise', price: '$1.5M+', desc: 'Full platform deployment', features: ['170+ playbooks', '847+ signals monitored', 'Custom AI models', 'White-glove onboarding'] },
          ].map((t, i) => (
            <div key={i} className={`rounded-xl p-6 ${t.highlight ? 'bg-teal-950/40 border-2 border-teal-500/50' : 'bg-slate-900/80 border border-slate-800'}`}>
              {t.highlight && <div className="text-teal-400 text-xs font-bold uppercase mb-2">TARGET</div>}
              <div className="text-white font-bold text-lg">{t.tier}</div>
              <div className="text-3xl font-bold text-teal-400 my-2">{t.price}</div>
              <div className="text-slate-300 text-sm mb-4">{t.desc}</div>
              <ul className="space-y-2">
                {t.features.map((f, j) => (
                  <li key={j} className="text-slate-200 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-6 max-w-4xl w-full">
          {[
            { label: 'Gross Margin', value: '90%+' },
            { label: 'Expansion Multiple', value: '3x' },
            { label: 'Payback Period', value: '3-4 mo' },
            { label: 'Target ACV', value: '$750K' },
          ].map((m, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-teal-400">{m.value}</div>
              <div className="text-slate-300 text-sm">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">Traction & Validation</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Built, validated, ready to scale.
        </h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full mb-10">
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Rocket className="w-5 h-5 text-teal-400" /> Product Built</h3>
            <div className="space-y-3">
              {['170 playbooks developed and tested', 'IDEA Framework™ fully implemented', 'AI signal detection engine live', 'Enterprise-grade security & compliance', 'Integration layer (Slack, Teams, ServiceNow)'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-teal-400" /> Market Validation</h3>
            <div className="space-y-3">
              {['F500 executive interviews confirm pain point', 'Advisory board of Fortune 1000 CxOs', 'LOIs from 3 enterprise prospects', 'Pilot program designed and ready', 'Strategic partnerships in development'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8 max-w-3xl w-full">
          {[
            { value: '10.3%', label: 'Revenue impact' },
            { value: '340x', label: 'Faster response' },
            { value: '60x', label: 'Execution improvement' },
          ].map((s, i) => (
            <div key={i} className="text-center bg-slate-900/80 border border-slate-800 rounded-xl p-6">
              <div className="text-3xl font-bold text-teal-400">{s.value}</div>
              <div className="text-slate-300 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">Platform Vision</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          The Agentic Execution Layer
        </h2>
        <p className="text-lg text-slate-300 max-w-3xl text-center mb-10">
          AI agents are getting faster. Human coordination isn't. We sit in the middle.
        </p>
        <div className="grid grid-cols-3 gap-6 max-w-4xl w-full mb-10">
          <div className="text-center p-6 bg-slate-900/80 border border-blue-500/30 rounded-xl">
            <Bot className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-white font-bold mb-1">AI Agents</div>
            <div className="text-slate-400 text-sm">Detect threats, surface insights, monitor signals</div>
          </div>
          <div className="text-center p-6 bg-indigo-900/40 border border-teal-500/40 rounded-xl">
            <Layers className="w-8 h-8 text-teal-400 mx-auto mb-3" />
            <div className="text-teal-300 font-bold mb-1">Execution OS</div>
            <div className="text-slate-300 text-sm">Activate playbooks, coordinate roles, track execution</div>
          </div>
          <div className="text-center p-6 bg-slate-900/80 border border-amber-500/30 rounded-xl">
            <Users className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <div className="text-white font-bold mb-1">Human Leaders</div>
            <div className="text-slate-400 text-sm">Decide response, approve action, own outcomes</div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 max-w-5xl w-full mb-8">
          {[
            { tier: 'Tier 1: Now', title: 'AI-Triggered Playbooks', desc: 'External AI systems trigger playbooks automatically. 400+ connectors ready.', color: 'border-green-500/30', badge: 'bg-green-500/20 text-green-400' },
            { tier: 'Tier 2: Next', title: 'AI-Assisted Coordination', desc: 'AI agents handle prep work—context, drafts, blocker detection. Humans decide.', color: 'border-purple-500/30', badge: 'bg-purple-500/20 text-purple-400' },
            { tier: 'Tier 3: Vision', title: 'Human-AI Hybrid Playbooks', desc: 'AI agents and human leaders run the same playbook. First platform to do this.', color: 'border-amber-500/30', badge: 'bg-amber-500/20 text-amber-400' },
          ].map((t, i) => (
            <div key={i} className={`bg-slate-900/80 border ${t.color} rounded-xl p-5`}>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${t.badge} mb-3`}>{t.tier}</span>
              <div className="text-white font-bold mb-1">{t.title}</div>
              <p className="text-slate-300 text-sm">{t.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-indigo-900/30 to-teal-900/30 rounded-xl p-5 border border-teal-500/20 max-w-4xl w-full text-center">
          <p className="text-slate-200 text-sm italic">
            "Execution infrastructure for humans" → <span className="text-teal-400 font-semibold not-italic">Execution infrastructure for the agentic enterprise</span>
          </p>
          <p className="text-slate-400 text-xs mt-2">New category. No direct competitor.</p>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">Team</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Built by someone who's lived this problem.
        </h2>
        <div className="max-w-4xl w-full">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <Users className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Martin Brunke</h3>
                <p className="text-teal-400 font-medium mb-4">Founder & CEO</p>
                <div className="space-y-3 text-slate-200">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
                    <span><strong>20+ years</strong> Fortune 500 leadership — Ford, Toyota, Lockheed Martin, Boyd Gaming, Churchill Downs, Charles Schwab</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
                    <span><strong>5 years</strong> college football coaching — learned playbook-driven execution under pressure</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
                    <span><strong>Currently</strong> Director of PMO at Churchill Downs Incorporated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-teal-500/20 rounded-xl p-6 italic text-slate-200 text-lg text-center">
            "I've seen this problem from the coaching box and the boardroom. When the signal hits, you either have a playbook or you're improvising. Fortune 1000 companies are still improvising."
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">Go-to-Market</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Land with Defense, expand across domains.
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full mb-10">
          {[
            { phase: 'Year 1', title: 'Account-Based Land', target: '50 F500 targets', desc: 'Land with Defense playbooks (crisis/cyber). Prove 340x speed improvement. Build case studies.', color: 'border-blue-500/30' },
            { phase: 'Year 2', title: 'Scale', target: '100+ accounts', desc: 'Expand to Offense domain. Channel partnerships. Industry-specific playbook packs.', color: 'border-teal-500/30' },
            { phase: 'Year 3+', title: 'Market Leadership', target: '500+ accounts', desc: 'Full platform adoption. International expansion. Industry standard for strategic execution.', color: 'border-purple-500/30' },
          ].map((p, i) => (
            <div key={i} className={`bg-slate-900/80 border ${p.color} rounded-xl p-6`}>
              <div className="text-teal-400 font-bold text-sm mb-1">{p.phase}</div>
              <div className="text-white font-bold text-lg mb-1">{p.title}</div>
              <div className="text-slate-300 text-sm mb-3">{p.target}</div>
              <p className="text-slate-200 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="max-w-4xl w-full">
          <h3 className="text-white font-bold mb-4 text-center">Target Verticals</h3>
          <div className="flex gap-3 flex-wrap justify-center">
            {[
              { name: 'Financial Services', pct: '35%' },
              { name: 'Healthcare', pct: '25%' },
              { name: 'Manufacturing', pct: '20%' },
              { name: 'Insurance', pct: '15%' },
              { name: 'Aerospace', pct: '5%' },
            ].map((v, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2">
                <span className="text-teal-400 font-bold">{v.pct}</span>
                <span className="text-slate-200 text-sm">{v.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">Path to Scale</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          $100M+ ARR in 5 years.
        </h2>
        <div className="max-w-5xl w-full mb-10">
          <div className="grid grid-cols-5 gap-4">
            {[
              { year: 'Year 1', arr: '$2-3M', customers: '5-8', focus: 'Prove PMF' },
              { year: 'Year 2', arr: '$10-15M', customers: '20-30', focus: 'Scale sales' },
              { year: 'Year 3', arr: '$30-40M', customers: '50-70', focus: 'Expand domains' },
              { year: 'Year 4', arr: '$60-80M', customers: '100-150', focus: 'International' },
              { year: 'Year 5', arr: '$100M+', customers: '200+', focus: 'Market leader' },
            ].map((y, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-teal-400 font-bold text-sm mb-2">{y.year}</div>
                <div className="text-2xl font-bold text-white mb-1">{y.arr}</div>
                <div className="text-slate-300 text-xs">{y.customers} customers</div>
                <div className="text-slate-500 text-xs">{y.focus}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          <div>
            <h3 className="text-white font-bold mb-3">Unit Economics</h3>
            <div className="space-y-2">
              {[
                { label: 'Target ACV', value: '$750K' },
                { label: 'Gross Margin', value: '90%+' },
                { label: 'NRR', value: '130%+' },
                { label: 'CAC Payback', value: '12-15 months' },
                { label: 'LTV:CAC', value: '>10:1' },
              ].map((e, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-300">{e.label}</span>
                  <span className="text-teal-400 font-semibold">{e.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">Exit Potential</h3>
            <div className="space-y-2">
              {[
                { label: 'Strategic acquirers', value: 'ServiceNow, Palantir, SAP' },
                { label: 'Revenue multiple', value: '15-25x ARR' },
                { label: 'IPO path', value: '$100M+ ARR milestone' },
                { label: 'Comparable exits', value: '$5-15B valuations' },
              ].map((e, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-300">{e.label}</span>
                  <span className="text-slate-200 font-medium">{e.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">The Ask</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Raising $2M Pre-Seed
        </h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full">
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Use of Funds</h3>
            <div className="space-y-4">
              {[
                { label: 'Engineering', pct: 50, color: 'bg-teal-500' },
                { label: 'Sales', pct: 25, color: 'bg-blue-500' },
                { label: 'Infrastructure', pct: 15, color: 'bg-purple-500' },
                { label: 'Marketing', pct: 10, color: 'bg-amber-500' },
              ].map((f, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-200">{f.label}</span>
                    <span className="text-white font-bold">{f.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div className={`${f.color} h-3 rounded-full`} style={{ width: `${f.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-6">18-Month Milestones</h3>
            <div className="space-y-4">
              {[
                { month: 'Month 1-6', milestone: 'Hire core engineering team. Ship v2 with enterprise SSO and advanced AI.' },
                { month: 'Month 4-9', milestone: 'Close 3-5 design partners. First paid pilots. Build case studies.' },
                { month: 'Month 9-12', milestone: 'First $1M in ARR. Prove expansion motion. Hire sales team.' },
                { month: 'Month 12-18', milestone: '$2-3M ARR run rate. Raise Series A ($10-15M). Scale GTM.' },
              ].map((m, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-teal-400 font-bold text-sm whitespace-nowrap w-24 shrink-0">{m.month}</div>
                  <p className="text-slate-200 text-sm">{m.milestone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-4xl">
          The strategic execution OS Fortune 1000 is missing.
        </h2>
        <div className="grid grid-cols-4 gap-6 max-w-3xl w-full my-10">
          {[
            { value: '340x', label: 'Faster' },
            { value: '170', label: 'Playbooks' },
            { value: '10.3%', label: 'Revenue Impact' },
            { value: '$20B', label: 'TAM' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-teal-400">{s.value}</div>
              <div className="text-slate-300 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="text-xl text-slate-200 max-w-2xl mb-10 italic">
          "Every consultancy is writing about this problem. Execution OS has the product."
        </p>
        <div className="flex items-center gap-4 text-slate-300">
          <Mail className="w-5 h-5 text-teal-400" />
          <span className="text-teal-400 font-medium">martinbrunke@executeiq.io</span>
          <span className="mx-2">|</span>
          <span className="text-teal-400 font-medium">executeiq.io</span>
        </div>
      </div>
    ),
  ];

  return (
    <div className="bg-background min-h-screen">
      <StandardNav />
      <div className="relative" style={{ scrollSnapType: 'y mandatory' }}>
        {slides.map((renderSlide, index) => (
          <div
            key={index}
            className={`min-h-screen flex items-center justify-center px-4 py-20 ${index === currentSlide ? '' : 'hidden'}`}
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="max-w-6xl w-full mx-auto">
              {renderSlide()}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-6 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrev}
            disabled={currentSlide === 0}
            className="text-slate-300 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-slate-300 text-sm font-mono min-w-[80px] text-center">
            {currentSlide + 1} / {totalSlides}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNext}
            disabled={currentSlide === totalSlides - 1}
            className="text-slate-300 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {Array.from({ length: totalSlides }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-teal-400 w-6' : 'bg-slate-600 hover:bg-slate-400'}`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="text-slate-300 hover:text-white"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}

export default InvestorPresentation;
