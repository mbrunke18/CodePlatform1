import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import InvestorGate from '@/components/InvestorGate';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { BrandStamp } from "@/components/BrandStamp";
import { motion, AnimatePresence } from "framer-motion";

const NAVY = "#0A0F2E";
const NAVY_MID = "#141B45";
const GOLD = "#C9A84C";
const GOLD_LT = "#DFC178";
const TEAL = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";

function InvestorPresentation() {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const totalSlides = 18;

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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <div style={{ width: 24, height: 1, background: '#2B8A6E', opacity: 0.6 }} />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#2B8A6E' }}>10.3% revenue impact within 12 months</span>
          <div style={{ width: 24, height: 1, background: '#2B8A6E', opacity: 0.6 }} />
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(36px,6vw,72px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.1, marginBottom: 20, maxWidth: 860 }}>
          We redesign how work flows<br />in the age of AI
        </h1>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 'clamp(15px,1.5vw,20px)', color: '#0A0F2E', maxWidth: 680, marginBottom: 16, lineHeight: 1.65, fontWeight: 400 }}>
          The new operating model for Fortune 1000 enterprises — 170 pre-staged Readiness Protocols that compress 30 days of mobilization into 12 minutes of live execution
        </p>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#6B7280', maxWidth: 560, marginBottom: 48, lineHeight: 1.65 }}>
          Not another AI tool bolted onto the old workflow. A fundamental redesign of how strategic work flows from first principles for the AI era.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#0A0F2E' }}>
          <span style={{ fontWeight: 600 }}>Martin Brunke</span>
          <span style={{ color: '#9CA3AF' }}>, Founder & CEO</span>
          <span style={{ color: '#D1D5DB', marginLeft: 4, marginRight: 4 }}>|</span>
          <span style={{ color: '#2B8A6E' }}>info@vaughnmartin.com</span>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">The Problem</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-10 text-center max-w-4xl">
          30% of strategic value is lost to execution gaps.
        </h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full">
          <div className="space-y-4">
            <p className="text-[#0A0F2E] text-lg leading-relaxed">
              Enterprise work was designed for a world without AI. Committees exist because humans couldn't process information fast enough to act alone. Alignment cycles exist because coordination was expensive. AI changed the constraint.
            </p>
            <p className="text-[#0A0F2E] text-lg leading-relaxed">
              But every vendor bolted AI onto the old model — faster spreadsheets, smarter summaries, better notes from the same slow meetings. The bureaucracy stays. The latency stays. We're not competing with Copilot. We're competing with the 40-year-old operating model itself.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { value: 'Weeks–Months', label: 'Typical mobilization time', sub: 'Signal to first coordinated action' },
              { value: '30%', label: 'Strategic value lost', sub: 'McKinsey research' },
              { value: '$250M', label: 'Annual decision tax per Fortune 500', sub: '58% of exec time used ineffectively · McKinsey' },
              { value: '82%', label: 'Boards require crisis preparedness', sub: 'Post-2020 governance mandate' },
              { value: '95% / 16%', label: 'CSOs: AI will reshape priorities — but few reimagining', sub: 'Deloitte 2026 CSO Survey' },
                        ].map((s, i) => (
                <div key={i} className="bg-white border border-[#E8E4DC] p-5 hover:border-[#C9A84C]/50 transition-colors">
                  <div className="text-2xl font-bold text-[#C9A84C]">{s.value}</div>
                  <div className="text-[#0A0F2E] font-medium">{s.label}</div>
                  <div className="text-[#6B7280] text-sm">{s.sub}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">The Cost</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-12 text-center max-w-4xl">
          Slow coordination is a $20M+ problem per incident.
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
          {[
            { icon: <AlertTriangle className="w-8 h-8 text-[#0A0F2E]" />, value: '$22-50M', label: 'Average cost per ransomware incident', sub: 'IBM Security 2025', color: 'border-[#0A0F2E]/30' },
            { icon: <Zap className="w-8 h-8 text-[#2B8A6E]" />, value: '3,600×', label: 'Execution Head Start', sub: '30 days compressed to 12 minutes', color: 'border-[#2B8A6E]/30' },
            { icon: <DollarSign className="w-8 h-8 text-[#2B8A6E]" />, value: '$21-33M', label: 'Value created per crisis averted', sub: 'Revenue protection + opportunity capture', color: 'border-[#2B8A6E]/30' },
          ].map((c, i) => (
            <div key={i} className={`bg-white border ${c.color} p-8 text-center`}>
              <div className="flex justify-center mb-4">{c.icon}</div>
              <div className="text-3xl font-bold text-[#0A0F2E] mb-2">{c.value}</div>
              <div className="text-[#0A0F2E] font-medium mb-1">{c.label}</div>
              <div className="text-[#6B7280] text-sm">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">Independent Validation</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2E] mb-3 text-center max-w-4xl">
          McKinsey Named the Gap. We Built the Infrastructure.
        </h2>
        <p className="text-[#6B7280] text-base mb-8 text-center max-w-2xl">McKinsey's 2025–2026 enterprise architecture synthesis identifies an "orchestration layer · coordination fabric · shared source of truth" at the center of every enterprise AI stack — and leaves it unnamed.</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full mb-8">
          {[
            { value: '65%', label: 'Still piloting AI', sub: 'Not yet scaling across the enterprise — the activation gap Readiness OS closes', color: 'border-[#C9A84C]/40 bg-[#C9A84C]/5' },
            { value: '1%', label: 'Fully mature', sub: 'Leaders — not employees — are the bottleneck. 221 executive triggers solve this.', color: 'border-[#2B8A6E]/40 bg-[#2B8A6E]/5' },
            { value: '$4.4T', label: 'AI productivity potential', sub: 'Locked behind the missing coordination layer — the layer Readiness OS provides', color: 'border-[#0A0F2E]/20 bg-[#0A0F2E]/5' },
          ].map((s, i) => (
            <div key={i} className={`border ${s.color} p-6 text-center`}>
              <div className="text-4xl font-black text-[#0A0F2E] mb-2">{s.value}</div>
              <div className="text-[#0A0F2E] font-bold mb-2">{s.label}</div>
              <div className="text-[#6B7280] text-sm leading-relaxed">{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="max-w-5xl w-full bg-[#0A0F2E] p-6 flex items-center justify-between gap-6 mb-4">
          <div>
            <div className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-2">The Agentic Mesh Layer — McKinsey's term for what we built</div>
            <div className="text-white font-semibold text-lg">"Orchestration layer · coordination fabric · shared source of truth"</div>
            <div className="text-white/50 text-sm mt-1">McKinsey drew the architecture diagram with this box in the middle. Readiness OS is the product that fills it.</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[#C9A84C] font-black text-2xl">VAUGHNMARTIN</div>
            <div className="text-white/40 text-xs">Readiness OS</div>
          </div>
        </div>
        {/* MGI Nov 2025 second report */}
        <div className="max-w-5xl w-full border border-[#2B8A6E]/25 overflow-hidden mb-3">
          <div className="bg-[#2B8A6E]/8 border-b border-[#2B8A6E]/15 px-5 py-2.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#2B8A6E] shrink-0" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2B8A6E]/70">McKinsey Global Institute · Skill Partnerships in the Age of AI · November 2025 · 80 Cases · 190 Workflows</span>
          </div>
          <div className="p-5 grid md:grid-cols-2 gap-6 bg-[#060B1E]">
            <div>
              <div className="flex gap-6 mb-4">
                {[{ v: "90%", l: "Invested in AI" }, { v: "<40%", l: "See measurable returns" }, { v: "77%", l: "Value from agents" }].map(({ v, l }) => (
                  <div key={v}>
                    <div className="text-[#2B8A6E] font-mono font-bold text-xl leading-none mb-1">{v}</div>
                    <div className="text-white/40 text-[10px] leading-tight">{l}</div>
                  </div>
                ))}
              </div>
              <blockquote className="border-l-2 border-[#2B8A6E] pl-4">
                <p className="text-white font-semibold text-sm italic leading-relaxed mb-1">"The CEO who delegates AI to IT will lose this decade to the one who does not."</p>
                <p className="text-white/30 text-[10px]">McKinsey Global Institute — November 2025</p>
              </blockquote>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { s: "Global Tech", r: "7–12% revenue lift", d: "Workflow redesign → sales specialists freed for negotiation" },
                { s: "Global Pharma", r: "60% faster · 50% fewer errors", d: "Clinical reporting redesigned from the ground up" },
                { s: "Large Utility", r: "40% AI-resolved · 50% cost cut · +6 NPS", d: "7M annual calls — CEO owned the redesign" },
              ].map(({ s, r, d }) => (
                <div key={s} className="bg-[#2B8A6E]/5 border border-[#2B8A6E]/15 px-3 py-2">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-[#2B8A6E] font-mono text-[9px] font-bold uppercase tracking-wider">{s}</span>
                    <span className="text-white text-[11px] font-semibold">{r}</span>
                  </div>
                  <p className="text-white/35 text-[10px] leading-snug">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-[#6B7280] text-xs">Sources: McKinsey &amp; Company — Enterprise Architecture Synthesis 2025–2026 · McKinsey Global Institute — "Skill Partnerships in the Age of AI" November 2025 · World Economic Forum × Accenture — March 2026</div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">Research Consensus — 2026</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2E] mb-2 text-center max-w-4xl">
          Four Independent Sources. One Conclusion.
        </h2>
        <p className="text-[#6B7280] text-sm mb-7 text-center max-w-2xl">McKinsey, WEF, Accenture, and Harvard Business Review — publishing independently — have converged on the same diagnosis: AI without an operating model intensifies the problem, not the solution.</p>
        <div className="grid md:grid-cols-2 gap-5 max-w-5xl w-full mb-6">
          {[
            {
              org: "McKinsey & Company",
              report: "Enterprise Architecture Synthesis · 2025–2026",
              quote: "\"Orchestration layer · coordination fabric · shared source of truth\" — the box at the center of every enterprise AI architecture, left unnamed.",
              bridge: "Readiness OS is the product that fills it.",
              color: "border-[#C9A84C]/40 bg-[#C9A84C]/5",
              dot: "bg-[#C9A84C]",
            },
            {
              org: "McKinsey Global Institute",
              report: "Skill Partnerships in the Age of AI · November 2025",
              quote: "\"The CEO who delegates AI to IT will lose this decade to the one who does not.\" 90% of enterprises invested in AI. <40% see measurable returns.",
              bridge: "221 triggers make the CEO the signal, not the bottleneck.",
              color: "border-[#2B8A6E]/40 bg-[#2B8A6E]/5",
              dot: "bg-[#2B8A6E]",
            },
            {
              org: "World Economic Forum × Accenture",
              report: "Organizational Transformation in the Age of AI · March 2026",
              quote: "\"Those that do not risk falling behind — not because AI fails them, but because organizational change does.\"",
              bridge: "Readiness OS is the operating model layer AI requires.",
              color: "border-[#0A0F2E]/20 bg-[#0A0F2E]/5",
              dot: "bg-[#0A0F2E]",
            },
            {
              org: "Harvard Business Review",
              report: "AI Doesn't Reduce Work — It Intensifies It · February 2026",
              quote: "\"AI tools don't reduce work, they consistently intensify it. Without an AI practice, the natural tendency of AI-assisted work is not contraction but intensification — with implications for burnout, decision quality, and long-term sustainability.\"",
              bridge: "Readiness OS is the AI practice at the enterprise coordination layer — pre-staged, gate-driven, and human-authorized.",
              color: "border-[#dc2626]/30 bg-[#dc2626]/5",
              dot: "bg-[#dc2626]",
            },
          ].map(({ org, report, quote, bridge, color, dot }) => (
            <div key={org} className={`border ${color} p-5 flex flex-col gap-3`}>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 shrink-0 ${dot}`} />
                <span className="text-[#0A0F2E] font-bold text-sm leading-tight">{org}</span>
              </div>
              <div className="text-[#6B7280] text-[10px] uppercase tracking-wider font-mono">{report}</div>
              <p className="text-[#374151] text-sm italic leading-relaxed flex-1">{quote}</p>
              <div className="border-t border-[#E8E4DC] pt-3">
                <p className="text-[#2B8A6E] text-xs font-semibold leading-snug">→ {bridge}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-5xl w-full bg-[#0A0F2E] p-5 flex items-center gap-6">
          <div className="flex-1">
            <div className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-1">The Unified Thesis</div>
            <div className="text-white font-semibold text-base leading-snug">The constraint is never the AI. It is always the operating model. Readiness OS is the infrastructure that closes that gap.</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[#C9A84C] font-black text-xl">VAUGHNMARTIN</div>
            <div className="text-white/40 text-xs">Readiness OS · 3,600× Head Start</div>
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">The Solution</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-12 text-center">
          Readiness OS: The IDEA Framework™
        </h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl w-full mb-8">
          {[
            { letter: 'I', name: 'IDENTIFY', desc: 'AI watches 847+ signals across news, regulatory, market, and threat feeds', icon: <Eye className="w-6 h-6" />, color: 'from-[#0A0F2E] to-[#141B45]' },
            { letter: 'D', name: 'DETECT', desc: 'Match signals to Readiness Protocols with confidence scoring and stakeholder mapping', icon: <Brain className="w-6 h-6" />, color: 'from-[#0A0F2E] to-[#141B45]' },
            { letter: 'E', name: 'EXECUTE', desc: 'One-click activation. 12-minute full mobilization. Pre-approved budgets deployed.', icon: <Zap className="w-6 h-6" />, color: 'from-[#C9A84C] to-[#DFC178]' },
            { letter: 'A', name: 'ADVANCE', desc: 'Learn from every activation. AI refines Readiness Protocols. Institutional knowledge captured.', icon: <TrendingUp className="w-6 h-6" />, color: 'from-[#2B8A6E] to-[#3BAF8A]' },
          ].map((p, i) => (
            <div key={i} className="bg-white border border-[#E8E4DC] overflow-hidden">
              <div className={`bg-gradient-to-b ${p.color} p-4 flex items-center gap-3`}>
                <span className="text-3xl font-black text-white/90">{p.letter}</span>
                <div>
                  <div className="text-white font-bold text-sm">{p.name}</div>
                  <div className="text-white/80">{p.icon}</div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-[#0A0F2E] text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[#0A0F2E] text-center">
          <span className="text-[#2B8A6E] font-semibold">170 Readiness Protocols</span> ready to deploy across <span className="text-[#2B8A6E] font-semibold">9 strategic domains</span>.
        </p>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">The Transformation</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-12 text-center">
          Same trigger. Different outcome.
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
          <div className="bg-[#0A0F2E]/5 border border-[#0A0F2E]/10 p-8">
            <h3 className="text-xl font-bold text-[#0A0F2E] mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Without Readiness OS
            </h3>
            <div className="space-y-4">
              {['T+0: Signal detected by random employee', 'T+4h: Escalated via email chain', 'T+12h: Leadership aware', 'T+24h: War room assembled', 'T+48h: Response plan drafted', 'T+72h: First coordinated action'].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#0A0F2E] mt-2 shrink-0" />
                  <span className="text-[#0A0F2E] text-sm">{t}</span>
                </div>
              ))}
              <div className="mt-4 p-3 bg-[#0A0F2E]/10 text-[#0A0F2E] font-semibold text-center">
                Result: $22-50M in damage
              </div>
            </div>
          </div>
          <div className="bg-[#2B8A6E]/5 border border-[#2B8A6E]/10 p-8">
            <h3 className="text-xl font-bold text-[#2B8A6E] mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5" /> With Readiness OS
            </h3>
            <div className="space-y-4">
              {['T+0: AI detects signal automatically', 'T+2m: Readiness Protocol matched with 94% confidence', 'T+4m: Stakeholders notified, tasks assigned', 'T+8m: Budget pre-approved, resources staged', 'T+12m: Full coordinated response active', 'T+24h: Post-action review, Readiness Protocol refined'].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#2B8A6E] mt-2 shrink-0" />
                  <span className="text-[#0A0F2E] text-sm">{t}</span>
                </div>
              ))}
              <div className="mt-4 p-3 bg-[#2B8A6E]/10 text-[#2B8A6E] font-semibold text-center">
                Result: $21-33M saved
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">The Platform</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-12 text-center">
          170 Readiness Protocols across three domains
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div className="bg-white border border-[#E8E4DC] p-8">
            <div className="flex items-center gap-3 mb-4">
              <Swords className="w-6 h-6 text-[#2B8A6E]" />
              <h3 className="text-xl font-bold text-[#2B8A6E]">GROWTH & POSITIONING</h3>
              <span className="ml-auto text-2xl font-bold text-[#2B8A6E]">58</span>
            </div>
            <ul className="space-y-2 text-[#0A0F2E] text-sm">
              {['Market expansion', 'Product launches', 'M&A integration', 'Competitive response', 'Revenue acceleration', 'Partnership activation'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-[#0A0F2E] font-medium"><ArrowRight className="w-3 h-3 text-[#2B8A6E] shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-[#E8E4DC] p-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-[#0A0F2E]" />
              <h3 className="text-xl font-bold text-[#0A0F2E]">RISK & RESILIENCE</h3>
              <span className="ml-auto text-2xl font-bold text-[#0A0F2E]">58</span>
            </div>
            <ul className="space-y-2 text-[#0A0F2E] text-sm">
              {['Crisis management', 'Cybersecurity response', 'Regulatory compliance', 'Reputation protection', 'Supply chain disruption', 'Legal & litigation'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-[#0A0F2E] font-medium"><ArrowRight className="w-3 h-3 text-[#0A0F2E] shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-[#E8E4DC] p-8">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-[#C9A84C]" />
              <h3 className="text-xl font-bold text-[#C9A84C]">TRANSFORMATION</h3>
              <span className="ml-auto text-2xl font-bold text-[#C9A84C]">54</span>
            </div>
            <ul className="space-y-2 text-[#0A0F2E] text-sm">
              {['Digital transformation', 'Culture change', 'Talent acquisition', 'ESG & sustainability', 'Innovation pipeline', 'Board governance'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-[#0A0F2E] font-medium"><ArrowRight className="w-3 h-3 text-[#C9A84C] shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">Market Opportunity</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-12 text-center">
          $13-20B TAM growing 15-20% annually
        </h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full">
          <div>
            <h3 className="text-xl font-bold text-[#0A0F2E] mb-4">Market Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: 'TAM', value: '$13-20B', desc: 'Strategic execution software' },
                { label: 'SAM', value: '$5-8B', desc: 'Fortune 1000 enterprises' },
                { label: 'SOM', value: '$500M-1B', desc: 'Year 5 target' },
              ].map((m, i) => (
                <div key={i} className="bg-white border border-[#E8E4DC] p-4 flex items-center gap-4">
                  <span className="text-[#2B8A6E] font-bold text-sm w-12">{m.label}</span>
                  <span className="text-[#0A0F2E] font-bold text-lg">{m.value}</span>
                  <span className="text-[#6B7280] text-xs font-bold uppercase tracking-wider ml-auto">{m.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0A0F2E] mb-4">Why Now?</h3>
            <div className="space-y-3">
              {[
                'Disruptions now compound and cascade — single-domain response is obsolete',
                'McKinsey: "Operating models stretched beyond their limits"',
                'Crisis frequency increasing 3x since 2020',
                'Board-level mandate for crisis preparedness (82%)',
                'AI maturity enables real-time signal processing',
                'No incumbent owns strategic execution infrastructure',
                '"Predict-and-act is dead" — enterprises need response infrastructure',
                '88% use AI, but only 1/3 scaling across enterprise',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-[#0A0F2E] font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#2B8A6E] mt-0.5 shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">The Paradigm Shift</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-4 text-center max-w-4xl">
          From Prediction to Preparation
        </h2>
        <p className="text-[#0A0F2E] text-center max-w-3xl mb-10 font-medium">
          There is no data on the future. What enterprises need is execution infrastructure built before the moment arrives.
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full mb-10">
          <div className="bg-[#0A0F2E]/5 border border-[#0A0F2E]/10 p-8">
            <h3 className="text-xl font-bold text-[#0A0F2E] mb-2 uppercase tracking-tight">The Dead Model</h3>
            <p className="text-[#6B7280] text-xs font-bold uppercase mb-4 tracking-widest">Predict → Plan → Execute</p>
            <div className="space-y-3">
              {['Assumes stable, linear environment', 'Ad-hoc response teams assembled after the fact', 'Weeks of coordination loops before action', 'Knowledge lost when people leave', 'Same cost, same scramble, every time'].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#0A0F2E] mt-2 shrink-0" />
                  <span className="text-[#0A0F2E] text-sm font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#2B8A6E]/5 border border-[#2B8A6E]/10 p-8">
            <h3 className="text-xl font-bold text-[#2B8A6E] mb-2 uppercase tracking-tight">The Readiness OS Model</h3>
            <p className="text-[#2B8A6E]/60 text-xs font-bold uppercase mb-4 tracking-widest">Detect → Activate → Coordinate → Execute → Advance</p>
            <div className="space-y-3">
              {['Built for compound, cascading disruptions', 'Pre-built Readiness Protocols with decision rights mapped', '12-minute coordinated execution', 'Institutional intelligence that compounds', 'Each response makes the next one faster'].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#2B8A6E] mt-2 shrink-0" />
                  <span className="text-[#0A0F2E] text-sm font-medium">{t}</span>
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
            <div key={i} className="bg-white border border-[#E8E4DC] p-4 text-center">
              <div className="text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">{m.from}</div>
              <div className="text-[#2B8A6E] font-bold text-sm my-1 tracking-tighter">→ {m.to}</div>
              <div className="text-[#0A0F2E] text-xs font-medium">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">Competitive Landscape</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-12 text-center max-w-4xl">
          No one owns strategic execution infrastructure.
        </h2>
        <div className="grid md:grid-cols-5 gap-4 max-w-5xl w-full">
          {[
            { name: 'McKinsey / BCG', type: 'Strategy Consulting', has: 'Strategy frameworks', missing: 'No software, no automation', color: 'border-[#E8E4DC]' },
            { name: 'ServiceNow / Jira', type: 'Workflow Tools', has: 'Task management', missing: 'No Readiness Protocols, no strategy layer', color: 'border-[#E8E4DC]' },
            { name: 'PagerDuty', type: 'Incident Response', has: 'IT alerting', missing: 'IT-only, no strategic execution', color: 'border-[#E8E4DC]' },
            { name: 'Palantir', type: 'Data Analytics', has: 'Data analysis', missing: 'No coordination, no execution', color: 'border-[#E8E4DC]' },
          ].map((c, i) => (
            <div key={i} className={`bg-white border ${c.color} p-4`}>
              <div className="text-[#0A0F2E] font-bold text-sm mb-1">{c.name}</div>
              <div className="text-[#6B7280] text-[10px] font-bold uppercase tracking-wider mb-3">{c.type}</div>
              <div className="text-[#2B8A6E] text-xs font-bold mb-1">✓ {c.has}</div>
              <div className="text-[#0A0F2E] text-xs font-medium">✗ {c.missing}</div>
            </div>
          ))}
          <div className="bg-[#0A0F2E] border-2 border-[#C9A84C] p-4 text-white">
            <div className="text-[#C9A84C] font-bold text-sm mb-1">Readiness OS</div>
            <div className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-3">Strategic Readiness Platform</div>
            <div className="text-xs space-y-1">
              {['AI signal detection', 'Pre-built Readiness Protocols', 'Automated coordination', 'Learning & refinement'].map((f, i) => (
                <div key={i} className="text-[#C9A84C] font-bold">✓ {f}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">Business Model</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-12 text-center">
          Enterprise SaaS with land-and-expand
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full mb-10">
          {[
            { tier: 'Starter', price: '$250K', desc: 'Single domain — Risk & Resilience', features: ['25 Readiness Protocols', '100 signals monitored', 'Standard integrations', 'Email support'] },
            { tier: 'Professional', price: '$750K', desc: 'Multi-domain expansion', features: ['100 Readiness Protocols', '500+ signals monitored', 'Full integration suite', 'Dedicated CSM'], highlight: true },
            { tier: 'Enterprise', price: '$1.5M+', desc: 'Full platform deployment', features: ['170+ Readiness Protocols', '847+ signals monitored', 'Custom AI models', 'White-glove onboarding'] },
          ].map((t, i) => (
            <div key={i} className={`rounded-none p-6 ${t.highlight ? 'bg-[#0A0F2E] border-2 border-[#C9A84C] text-white' : 'bg-white border border-[#E8E4DC]'}`}>
              {t.highlight && <div className="text-[#C9A84C] text-xs font-bold uppercase mb-2">TARGET</div>}
              <div className={`${t.highlight ? 'text-white' : 'text-[#0A0F2E]'} font-bold text-lg`}>{t.tier}</div>
              <div className="text-3xl font-bold text-[#C9A84C] my-2">{t.price}</div>
              <div className={`${t.highlight ? 'text-white/80' : 'text-[#6B7280]'} text-sm mb-4`}>{t.desc}</div>
              <ul className="space-y-2">
                {t.features.map((f, j) => (
                  <li key={j} className={`${t.highlight ? 'text-white/80' : 'text-[#0A0F2E]'} text-sm flex items-center gap-2`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${t.highlight ? 'text-[#C9A84C]' : 'text-[#2B8A6E]'} shrink-0`} />{f}
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
              <div className="text-2xl font-bold text-[#2B8A6E]">{m.value}</div>
              <div className="text-[#6B7280] text-sm">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">Traction & Validation</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-12 text-center">
          Built, validated, ready to scale.
        </h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full mb-10">
          <div>
            <h3 className="text-lg font-bold text-[#0A0F2E] mb-4 flex items-center gap-2"><Rocket className="w-5 h-5 text-[#2B8A6E]" /> Product Built</h3>
            <div className="space-y-3">
              {['170 Readiness Protocols developed and tested', 'IDEA Framework™ fully implemented', 'AI signal detection engine live', 'Enterprise-grade security & compliance', 'Integration layer (Slack, Teams, ServiceNow)'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[#0A0F2E]">
                  <CheckCircle2 className="w-5 h-5 text-[#2B8A6E] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0A0F2E] mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-[#C9A84C]" /> Market Validation</h3>
            <div className="space-y-3">
              {['F500 executive interviews confirm pain point', 'Advisory board of Fortune 1000 CxOs', 'LOIs from 3 enterprise prospects', 'Pilot program designed and ready', 'Strategic partnerships in development'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[#0A0F2E]">
                  <CheckCircle2 className="w-5 h-5 text-[#C9A84C] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8 max-w-3xl w-full">
          {[
            { value: '10.3%', label: 'Revenue impact' },
            { value: '3,600×', label: 'Execution Head Start' },
            { value: '60x', label: 'Execution improvement' },
          ].map((s, i) => (
            <div key={i} className="text-center bg-white border border-[#E8E4DC] p-6">
              <div className="text-3xl font-bold text-[#2B8A6E]">{s.value}</div>
              <div className="text-[#6B7280] text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">Platform Vision</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-4 text-center">
          The Operating Model Layer
        </h2>
        <p className="text-lg text-[#0A0F2E] max-w-3xl text-center mb-10">
          Every enterprise has Microsoft's AI stack. None have the operating model to use it. Readiness OS is the coordination infrastructure that sits between strategy and action.
        </p>
        <div className="grid grid-cols-3 gap-6 max-w-4xl w-full mb-10">
          <div className="text-center p-6 bg-white border border-[#0A0F2E]/30">
            <Bot className="w-8 h-8 text-[#0A0F2E] mx-auto mb-3" />
            <div className="text-[#0A0F2E] font-bold mb-1">AI Agents</div>
            <div className="text-[#6B7280] text-sm">Detect threats, surface insights, monitor signals</div>
          </div>
          <div className="text-center p-6 bg-[#0A0F2E]/40 border border-[#2B8A6E]/40">
            <Layers className="w-8 h-8 text-[#2B8A6E] mx-auto mb-3" />
            <div className="text-[#2B8A6E] font-bold mb-1">Readiness OS</div>
            <div className="text-[#0A0F2E] text-sm">Pre-stage responses before the trigger fires. Activate in 12 minutes.</div>
          </div>
          <div className="text-center p-6 bg-white border border-[#C9A84C]/30">
            <Users className="w-8 h-8 text-[#C9A84C] mx-auto mb-3" />
            <div className="text-[#0A0F2E] font-bold mb-1">Human Leaders</div>
            <div className="text-[#6B7280] text-sm">Decide response, approve action, own outcomes</div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 max-w-5xl w-full mb-8">
          {[
            { tier: 'Tier 1: Now', title: 'AI-Triggered Readiness Protocols', desc: 'External AI systems trigger Readiness Protocols automatically. 400+ connectors ready.', color: 'border-[#2B8A6E]/30', badge: 'bg-[#2B8A6E]/20 text-[#2B8A6E]' },
            { tier: 'Tier 2: Next', title: 'AI-Assisted Coordination', desc: 'AI agents handle prep work—context, drafts, blocker detection. Humans decide.', color: 'border-[#C9A84C]/30', badge: 'bg-[#C9A84C]/20 text-[#C9A84C]' },
            { tier: 'Tier 3: Vision', title: 'Executive-Led AI Readiness Protocols', desc: 'AI monitors and stages. Executives authorize and lead. First platform built this way from the ground up.', color: 'border-[#C9A84C]/30', badge: 'bg-[#C9A84C]/20 text-[#C9A84C]' },
          ].map((t, i) => (
            <div key={i} className={`bg-white border ${t.color} p-5`}>
              <span className={`inline-block px-2 py-0.5 text-[10px] font-bold ${t.badge} mb-3`}>{t.tier}</span>
              <div className="text-[#0A0F2E] font-bold mb-1">{t.title}</div>
              <p className="text-[#6B7280] text-sm">{t.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r p-5 border border-[#2B8A6E]/20 max-w-4xl w-full text-center">
          <p className="text-[#0A0F2E] text-sm italic">
            "Readiness infrastructure for humans" → <span className="text-[#2B8A6E] font-semibold not-italic">The operating model for the AI-era enterprise</span>
          </p>
          <p className="text-[#6B7280] text-xs mt-2">New category. No direct competitor.</p>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">Team</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-12 text-center">
          Built by someone who's lived this problem.
        </h2>
        <div className="max-w-4xl w-full">
          <div className="bg-white border border-[#E8E4DC] p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-24 h-24 bg-gradient-to-br from-[#2B8A6E] to-[#141B45] flex items-center justify-center shrink-0">
                <Users className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#0A0F2E] mb-1">Martin Brunke</h3>
                <p className="text-[#2B8A6E] font-medium mb-4">Founder & CEO</p>
                <div className="space-y-3 text-[#0A0F2E]">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-[#2B8A6E] mt-0.5 shrink-0" />
                    <span><strong>20+ years</strong> Fortune 500 leadership — Ford, Toyota, Lockheed Martin, Boyd Gaming, Churchill Downs, Charles Schwab</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-[#2B8A6E] mt-0.5 shrink-0" />
                    <span><strong>5 years</strong> college football coaching — learned Readiness Protocol-driven execution under pressure</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-[#2B8A6E] mt-0.5 shrink-0" />
                    <span><strong>Currently</strong> Director of PMO at Churchill Downs Incorporated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-[#2B8A6E]/20 p-6 italic text-[#0A0F2E] text-lg text-center">
            "I've seen this problem from the coaching box and the boardroom. When the signal hits, you either have a Readiness Protocol or you're improvising. Fortune 1000 companies are still improvising."
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">Go-to-Market</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-12 text-center">
          Land with Risk & Resilience, expand across domains.
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full mb-10">
          {[
            { phase: 'Year 1', title: 'Account-Based Land', target: '50 F500 targets', desc: 'Land with Risk & Resilience Readiness Protocols (crisis/cyber). Prove 3,600× Execution Head Start. Build case studies.', color: 'border-[#0A0F2E]/30' },
            { phase: 'Year 2', title: 'Scale', target: '100+ accounts', desc: 'Expand to Growth & Positioning domain. Channel partnerships. Industry-specific Readiness Protocol packs.', color: 'border-[#2B8A6E]/30' },
            { phase: 'Year 3+', title: 'Market Leadership', target: '500+ accounts', desc: 'Full platform adoption. International expansion. Industry standard for strategic execution.', color: 'border-[#C9A84C]/30' },
          ].map((p, i) => (
            <div key={i} className={`bg-white border ${p.color} p-6`}>
              <div className="text-[#2B8A6E] font-bold text-sm mb-1">{p.phase}</div>
              <div className="text-[#0A0F2E] font-bold text-lg mb-1">{p.title}</div>
              <div className="text-[#6B7280] text-sm mb-3">{p.target}</div>
              <p className="text-[#0A0F2E] text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="max-w-4xl w-full">
          <h3 className="text-[#0A0F2E] font-bold mb-4 text-center">Target Verticals</h3>
          <div className="flex gap-3 flex-wrap justify-center">
            {[
              { name: 'Financial Services', pct: '35%' },
              { name: 'Healthcare', pct: '25%' },
              { name: 'Manufacturing', pct: '20%' },
              { name: 'Insurance', pct: '15%' },
              { name: 'Aerospace', pct: '5%' },
            ].map((v, i) => (
              <div key={i} className="bg-white border border-[#E8E4DC] px-4 py-2 flex items-center gap-2">
                <span className="text-[#2B8A6E] font-bold">{v.pct}</span>
                <span className="text-[#0A0F2E] text-sm">{v.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">Path to Scale</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-12 text-center">
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
              <div key={i} className="bg-white border border-[#E8E4DC] p-4 text-center">
                <div className="text-[#2B8A6E] font-bold text-sm mb-2">{y.year}</div>
                <div className="text-2xl font-bold text-[#0A0F2E] mb-1">{y.arr}</div>
                <div className="text-[#6B7280] text-xs">{y.customers} customers</div>
                <div className="text-[#0A0F2E] text-xs">{y.focus}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          <div>
            <h3 className="text-[#0A0F2E] font-bold mb-3">Unit Economics</h3>
            <div className="space-y-2">
              {[
                { label: 'Target ACV', value: '$750K' },
                { label: 'Gross Margin', value: '90%+' },
                { label: 'NRR', value: '130%+' },
                { label: 'CAC Payback', value: '12-15 months' },
                { label: 'LTV:CAC', value: '>10:1' },
              ].map((e, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">{e.label}</span>
                  <span className="text-[#2B8A6E] font-semibold">{e.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[#0A0F2E] font-bold mb-3">Exit Potential</h3>
            <div className="space-y-2">
              {[
                { label: 'Strategic acquirers', value: 'ServiceNow, Palantir, SAP' },
                { label: 'Revenue multiple', value: '15-25x ARR' },
                { label: 'IPO path', value: '$100M+ ARR milestone' },
                { label: 'Comparable exits', value: '$5-15B valuations' },
              ].map((e, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">{e.label}</span>
                  <span className="text-[#0A0F2E] font-medium">{e.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-[#2B8A6E] font-semibold text-sm uppercase tracking-widest mb-3">The Ask</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-12 text-center">
          Raising $2M Pre-Seed
        </h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full">
          <div>
            <h3 className="text-[#0A0F2E] font-bold text-lg mb-6">Use of Funds</h3>
            <div className="space-y-4">
              {[
                { label: 'Engineering', pct: 50, color: 'bg-[#2B8A6E]' },
                { label: 'Sales', pct: 25, color: 'bg-[#0A0F2E]' },
                { label: 'Infrastructure', pct: 15, color: 'bg-[#0A0F2E]' },
                { label: 'Marketing', pct: 10, color: 'bg-[#C9A84C]' },
              ].map((f, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#6B7280]">{f.label}</span>
                    <span className="text-[#0A0F2E] font-bold">{f.pct}%</span>
                  </div>
                  <div className="w-full bg-[#F8F7F4] h-3">
                    <div className={`${f.color} h-3`} style={{ width: `${f.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[#0A0F2E] font-bold text-lg mb-6">18-Month Milestones</h3>
            <div className="space-y-4">
              {[
                { month: 'Month 1-6', milestone: 'Hire core engineering team. Ship v2 with enterprise SSO and advanced AI.' },
                { month: 'Month 4-9', milestone: 'Close 3-5 design partners. First paid pilots. Build case studies.' },
                { month: 'Month 9-12', milestone: 'First $1M in ARR. Prove expansion motion. Hire sales team.' },
                { month: 'Month 12-18', milestone: '$2-3M ARR run rate. Raise Series A ($10-15M). Scale GTM.' },
              ].map((m, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-[#2B8A6E] font-bold text-sm whitespace-nowrap w-24 shrink-0">{m.month}</div>
                  <p className="text-[#0A0F2E] text-sm">{m.milestone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),

    () => (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="w-20 h-20 bg-gradient-to-br from-[#2B8A6E] to-[#141B45] flex items-center justify-center mb-8">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-6 max-w-4xl">
          The strategic Readiness OS Fortune 1000 is missing.
        </h2>
        <div className="grid grid-cols-4 gap-6 max-w-3xl w-full my-10">
          {[
            { value: '3,600×', label: 'Head Start' },
            { value: '170', label: 'Readiness Protocols' },
            { value: '10.3%', label: 'Revenue Impact' },
            { value: '$20B', label: 'TAM' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-[#2B8A6E]">{s.value}</div>
              <div className="text-[#6B7280] text-sm">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="text-xl text-[#0A0F2E] max-w-2xl mb-10 italic">
          "Every consultancy is writing about this problem. Readiness OS has the product."
        </p>
        <div className="flex items-center gap-4 text-[#0A0F2E]">
          <Mail className="w-5 h-5 text-[#2B8A6E]" />
          <span className="text-[#2B8A6E] font-medium">info@vaughnmartin.com</span>
          <span className="mx-2">|</span>
          <span className="text-[#2B8A6E] font-medium">vaughnmartin.com</span>
        </div>
      </div>
    ),
  ];

  return (
    <InvestorGate pageName="/investor-presentation">
    <PageLayout embedded={isFullscreen}>
      
      <main className={`relative ${isFullscreen ? 'h-screen w-screen overflow-hidden' : 'max-w-7xl mx-auto px-6 py-12 h-[calc(100vh-200px)]'}`}>
        <Card className={`h-full border-[#E8E4DC] bg-white overflow-hidden relative transition-all duration-700 rounded-none ${isFullscreen ? 'border-0' : ''}`}>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0A0F2E 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="h-full relative z-10"
            >
              <div className="h-full w-full flex items-center justify-center">
                {slides[currentSlide]()}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrev}
              disabled={currentSlide === 0}
              className="border-[#E8E4DC] hover:bg-[#F8F7F4] h-12 w-12 rounded-none"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 transition-all duration-300 ${
                    i === currentSlide ? 'w-8 bg-[#0A0F2E]' : 'w-2 bg-[#E8E4DC]'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              disabled={currentSlide === totalSlides - 1}
              className="border-[#E8E4DC] hover:bg-[#F8F7F4] h-12 w-12 rounded-none"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute top-8 right-8 flex items-center gap-2 z-20">
            <BrandStamp variant="dual" size="sm" />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-[#6B7280] hover:text-[#0A0F2E] hover:bg-[#F8F7F4]"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
          </div>
          
          <div className="absolute bottom-8 left-8 text-xs font-bold uppercase tracking-[0.2em] text-[#6B7280]">
            {currentSlide + 1} / {totalSlides}
          </div>
        </Card>
      </main>
      
      {!isFullscreen && (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="flex items-center justify-between text-[#6B7280] text-sm font-medium border-t border-[#E8E4DC] pt-8">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" /> Use Arrow Keys to Navigate</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" /> Press 'F' for Fullscreen</span>
            </div>
            <div>© 2026 VaughnMartin. All rights reserved. Confidential.</div>
          </div>
        </div>
      )}
    </PageLayout>
    </InvestorGate>
  );
}

export default InvestorPresentation;