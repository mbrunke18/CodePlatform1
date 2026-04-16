import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, User, ChevronDown, BarChart3, TrendingUp, Zap, ClipboardList, Radar, Compass, Globe, Users, Calculator, Shield, Layers, ArrowLeft, Brain, Target, Lightbulb, BookOpen, FileText, Settings, Building, Presentation, Video, Eye, Rocket, AlertCircle, ClipboardCheck, FlaskConical, Radio, Play, Search, Activity, Scale, MessageSquare, DollarSign, LayoutGrid } from "lucide-react";
import { SiGoogle, SiGithub, SiApple } from "react-icons/si";
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { scrollToTop } from "@/components/ScrollToTop";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

function useNavLogoHeight() {
  const [h, setH] = useState(68);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setH(w >= 1920 ? 80 : w >= 1440 ? 72 : 68);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return h;
}

const SEARCH_ITEMS = [
  { label: 'Mission Control', path: '/mission-control', category: 'Platform', icon: Compass },
  { label: 'Command Tower', path: '/command-tower', category: 'Platform', icon: Radio },
  { label: 'Execution Workspace', path: '/workspace', category: 'Platform', icon: Layers },
  { label: 'Intelligence Control Center', path: '/intelligence-hub', category: 'Platform', icon: Brain },
  { label: 'Intelligence Hub', path: '/ai-intelligence', category: 'Platform', icon: Brain },
  { label: 'Settings Hub', path: '/settings-hub', category: 'Platform', icon: Settings },
  { label: 'Organization Setup', path: '/organization-setup', category: 'Platform', icon: Building },
  { label: 'Playbook Library', path: '/playbooks', category: 'Identify', icon: BookOpen },
  { label: 'Strategic Planning Hub', path: '/strategic', category: 'Identify', icon: Target },
  { label: 'What-If Analyzer', path: '/what-if-analyzer', category: 'Identify', icon: Lightbulb },
  { label: 'Playbook Customization', path: '/playbook-customization', category: 'Identify', icon: ClipboardCheck },
  { label: 'Preparedness Report', path: '/preparedness-report', category: 'Identify', icon: Shield },
  { label: 'Signal Radar Dashboard', path: '/ai-radar', category: 'Detect', icon: Radar },
  { label: 'Foresight Radar', path: '/foresight-radar', category: 'Detect', icon: Eye },
  { label: 'Signal Intelligence', path: '/signal-intelligence', category: 'Detect', icon: Radio },
  { label: 'Incident Analyzer', path: '/incident-analyzer', category: 'Detect', icon: AlertCircle },
  { label: 'Live Activation Center', path: '/live-activation', category: 'Execute', icon: Zap },
  { label: 'Strategic Monitoring', path: '/strategic-monitoring', category: 'Execute', icon: AlertCircle },
  { label: 'Decision Velocity', path: '/decision-velocity', category: 'Execute', icon: TrendingUp },
  { label: 'War Room', path: '/war-room', category: 'Execute', icon: Globe },
  { label: 'Concurrent Situation Board', path: '/concurrent-situations', category: 'Execute', icon: LayoutGrid },
  { label: 'Crisis Communications Generator', path: '/crisis-communications', category: 'Execute', icon: MessageSquare },
  { label: 'Financial Exposure Estimator', path: '/financial-exposure', category: 'Execute', icon: DollarSign },
  { label: 'Advanced Analytics', path: '/advanced-analytics', category: 'Advance', icon: BarChart3 },
  { label: 'Execution History', path: '/execution-history', category: 'Advance', icon: BarChart3 },
  { label: 'Stakeholder Management', path: '/stakeholder-management', category: 'Advance', icon: Users },
  { label: 'Workforce Intelligence', path: '/workforce-intelligence', category: 'Advance', icon: Users },
  { label: 'Strategic Innovation Pipeline', path: '/strategic-innovation', category: 'Advance', icon: Lightbulb },
  { label: 'Board Readiness Snapshot', path: '/board-readiness', category: 'Advance', icon: ClipboardList },
  { label: 'Readiness Dividend', path: '/mission-control', category: 'Advance', icon: TrendingUp },
  { label: 'Command Tower', path: '/command-tower', category: 'Execute', icon: Radio },
  { label: 'Live Signal Activity Feed', path: '/command-tower', category: 'Execute', icon: Activity },
  { label: 'Execution Clock', path: '/mission-control', category: 'Execute', icon: Activity },
  { label: '12-Minute Test Drive', path: '/12-minute-experience', category: 'Demo', icon: Play },
  { label: 'Industry Scenarios', path: '/industry-demos', category: 'Demo', icon: Globe },
  { label: 'How It Works', path: '/how-it-works', category: 'Learn', icon: Play },
  { label: 'Research & Validation', path: '/research', category: 'Learn', icon: FileText },
  { label: 'Onboarding Guide', path: '/onboarding-guide', category: 'Learn', icon: BookOpen },
  { label: 'Request a Pilot', path: '/request-access', category: 'Action', icon: Target },
  { label: 'Executive Brief', path: '/executive-brief', category: 'Action', icon: FileText },
  { label: 'Why Readiness OS?', path: '/why-execution-os', category: 'Learn', icon: Scale },
  { label: 'Investor Resources', path: '/investor-resources', category: 'Investors', icon: Building },
  { label: 'Investor Presentation', path: '/investor-presentation', category: 'Investors', icon: Presentation },
];

export default function StandardNav() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(o => !o);
        setSearchQuery('');
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);
  const navLogoHeight = useNavLogoHeight();

  const navigateTo = (path: string) => {
    setLocation(path);
    setMobileMenuOpen(false);
    scrollToTop();
  };

  const isActivePath = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  type NavLink = { label: string; path: string; icon: any; description: string; featured?: boolean };
  type NavSection = { heading: string; links: NavLink[] };

  // THE PLATFORM — merges former "Product" + "Platform" dropdowns into one clear destination
  const platformSections: NavSection[] = [
    {
      heading: "The Operating Model",
      links: [
        { label: "How It Works", path: "/how-it-works", icon: Play, description: "From trigger to full execution — the complete 12-minute sequence", featured: true },
        { label: "Platform Overview", path: "/platform-overview", icon: Eye, description: "Every capability, connected in one view" },
        { label: "IDEA Framework", path: "/idea-framework", icon: Layers, description: "Identify · Detect · Execute · Advance" },
        { label: "Why Readiness OS", path: "/why-execution-os", icon: Shield, description: "The 30-day mobilization gap — and how we close it" },
      ],
    },
    {
      heading: "Core Capabilities",
      links: [
        { label: "Playbook Library", path: "/playbooks", icon: ClipboardList, description: "170 pre-staged playbooks across 9 strategic domains" },
        { label: "Trigger Monitoring", path: "/triggers-management", icon: Zap, description: "Automated detection across 248+ data points" },
        { label: "Signal Intelligence", path: "/signal-intelligence", icon: Radar, description: "221 triggers — monitored every 15 minutes" },
        { label: "Enterprise Ecosystems", path: "/ecosystems", icon: Globe, description: "Microsoft · Google · Salesforce · AWS · SAP · ServiceNow · Workday", featured: true },
      ],
    },
    {
      heading: "Inside the Platform",
      links: [
        { label: "Mission Control", path: "/mission-control", icon: Compass, description: "Your interactive operations center — configure your OS, review detections, activate playbooks", featured: true },
        { label: "Command Tower", path: "/command-tower", icon: Radio, description: "Executive wall display — auto-refreshing live feed designed for conference rooms & NOC screens", featured: true },
        { label: "Onboarding Guide", path: "/onboarding-guide", icon: BookOpen, description: "Step-by-step guide for new pilot customers — platform map, quick start, and first 30 days", featured: true },
        { label: "Situation Intents", path: "/identify/situation-intents", icon: Target, description: "Define what your org is watching for — the starting point of your IDEA configuration", featured: true },
        { label: "Workspace", path: "/workspace", icon: Layers, description: "Execute across all 4 IDEA phases" },
        { label: "9-Domain Coverage Board", path: "/situations-hub", icon: Shield, description: "Exposure & readiness across all 9 strategic domains — M&A, Competitive, Regulatory, Supply Chain & more" },
        { label: "Regulatory Calendar", path: "/regulatory-calendar", icon: Shield, description: "Upcoming compliance deadlines mapped to pre-staged response playbooks — SEC, GDPR, SOX, FDA & more" },
        { label: "Coordination Intelligence", path: "/coordination-intelligence", icon: Activity, description: "Your real coordination speed vs. the 12-minute benchmark", featured: true },
        { label: "Intelligence Hub", path: "/intelligence-hub", icon: Brain, description: "Signal radar, monitoring & compound situation synthesis" },
      ],
    },
    {
      heading: "Execute Phase Tools",
      links: [
        { label: "Strategic Monitoring", path: "/strategic-monitoring", icon: AlertCircle, description: "Active trigger monitoring — 15+ pre-staged response protocols, real-time coordination", featured: true },
        { label: "Concurrent Situation Board", path: "/concurrent-situations", icon: LayoutGrid, description: "Command view when multiple triggers compete for C-suite bandwidth", featured: true },
        { label: "Crisis Communications", path: "/crisis-communications", icon: MessageSquare, description: "5 audience-specific communications generated in 18 seconds" },
        { label: "Financial Exposure Estimator", path: "/financial-exposure", icon: DollarSign, description: "Instant dollar-range exposure when a trigger fires — CFO's first question answered" },
      ],
    },
  ];

  // EXPERIENCE — self-serve paths for first-time visitors
  const experienceSections: NavSection[] = [
    {
      heading: "Try It Now",
      links: [
        { label: "Real-Company Scenarios", path: "/try-demo", icon: Rocket, description: "HPE · Target · Clorox · ServiceNow · Alphabet — live 12-minute execution simulations", featured: true },
        { label: "12-Minute Test Drive", path: "/12-minute-experience", icon: Play, description: "Feel a trigger fire and reach full execution in 12 minutes — no login required", featured: true },
        { label: "Industry Scenarios", path: "/industry-demos", icon: Globe, description: "Finance · Pharma · Manufacturing · Luxury — vertical deep dives" },
      ],
    },
    {
      heading: "Go Deeper",
      links: [
        { label: "Executive Scenario Suite", path: "/executive-scenarios", icon: Target, description: "Your industry. Your trigger. Full IDEA chain walk-through — Technology, Finance, Manufacturing, Healthcare", featured: true },
        { label: "Shadow Simulator", path: "/simulation-studio", icon: FlaskConical, description: "Dry-run any scenario — AI scores Survive vs. Thrive" },
        { label: "By Your Role", path: "/role-selector", icon: Users, description: "Playbooks filtered for your C-suite function" },
        { label: "Strategic Analyzer", path: "/incident-analyzer", icon: AlertCircle, description: "Analyze any strategic situation with AI" },
        { label: "Executive Brief", path: "/executive-brief", icon: FileText, description: "One-page board summary — shareable in 60 seconds" },
      ],
    },
  ];

  // EVIDENCE — research, proof, and ROI validation
  const evidenceLinks: NavLink[] = [
    { label: "Why Readiness OS?", path: "/why-execution-os", icon: Scale, description: "Why not Copilot, ServiceNow, Palantir, or Everbridge — the honest answer", featured: true },
    { label: "Executive Brief", path: "/executive-brief", icon: FileText, description: "Board-ready one-pager — thesis, 3,600× metric, ROI case", featured: true },
    { label: "Research & Validation", path: "/research", icon: FileText, description: "McKinsey, Gartner, IBM, PwC — the evidence behind Readiness OS" },
    { label: "ROI Calculator", path: "/roi-calculator", icon: Calculator, description: "See the competitive window you're leaving open" },
    { label: "Readiness Score", path: "/readiness-assessment", icon: ClipboardCheck, description: "Score your org's execution readiness across all 9 domains" },
    { label: "Pricing & Plans", path: "/growth", icon: TrendingUp, description: "Accessible entry — full platform, grow as you scale", featured: true },
    { label: "Customer Journey", path: "/customer-journey", icon: Users, description: "See how Fortune 1000 teams onboard & scale" },
    { label: "Why Not Consulting?", path: "/vs-consulting", icon: Scale, description: "McKinsey charges $300K–$500K for PDFs. We deliver infrastructure that executes." },
    { label: "MS Project EOL → Don't Just Migrate", path: "/ms-project", icon: Scale, description: "ServiceNow moves your lag to a new database. Readiness OS eliminates the 30-day mobilization cycle.", featured: true },
    { label: "Platform Reality — They Talked. We Built.", path: "/platform-reality", icon: Scale, description: "Every conference keynote proves the problem. None of them shipped the solution. Readiness OS did.", featured: true },
  ];

  const investorsLinks: NavLink[] = [
    { label: "Investor Resources", path: "/investor-resources", icon: FileText, description: "Full materials — frameworks, thesis & deck", featured: true },
    { label: "Platform Capabilities", path: "/capabilities", icon: Layers, description: "Every capability across the full decision lifecycle" },
    { label: "Investment Thesis", path: "/investors", icon: TrendingUp, description: "Market opportunity, research validation & ROI case" },
    { label: "Pitch Deck", path: "/pitch-deck", icon: Presentation, description: "Pre-seed investor presentation" },
    { label: "Board Briefings", path: "/board-briefings", icon: FileText, description: "Executive-ready board reporting" },
    { label: "Founder's Story", path: "/founder-story", icon: Video, description: "The vision behind Readiness OS" },
  ];

  const isHomePage = location === "/" || location === "/home";

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo("/");
    }
  };

  const renderDropdownButton = (label: string, highlighted?: boolean) => (
    <button
      className="px-3 py-2 text-sm font-semibold transition-all duration-150 flex items-center gap-1.5"
      style={{
        color: highlighted ? GOLD : NAVY,
        background: 'transparent',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = highlighted ? 'rgba(201,168,76,0.10)' : 'rgba(10,15,46,0.07)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
      data-testid={`nav-${label.toLowerCase().replace(/\s+/g, '-')}-dropdown`}
    >
      {label}
      <ChevronDown className="h-3 w-3 opacity-60" />
    </button>
  );


  // ── Shared mega-menu item renderer ──────────────────────────────────────────
  const megaItem = (
    { path, icon: Icon, label, sub, featured }: { path: string; icon: any; label: string; sub: string; featured?: boolean },
    colBg: 'light' | 'dark' = 'light',
  ) => (
    <div
      key={path}
      onClick={() => navigateTo(path)}
      style={{
        display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 10px', marginBottom: 2, borderRadius: 0,
        cursor: 'pointer', transition: 'all 0.14s',
        background: featured ? 'linear-gradient(135deg,rgba(201,168,76,0.11),rgba(43,138,110,0.07))' : 'transparent',
        border: featured ? '1px solid rgba(201,168,76,0.28)' : '1px solid transparent',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = featured
          ? 'linear-gradient(135deg,rgba(201,168,76,0.2),rgba(43,138,110,0.13))'
          : colBg === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(10,15,46,0.05)';
        el.style.borderColor = featured ? 'rgba(201,168,76,0.5)' : 'transparent';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = featured ? 'linear-gradient(135deg,rgba(201,168,76,0.11),rgba(43,138,110,0.07))' : 'transparent';
        el.style.borderColor = featured ? 'rgba(201,168,76,0.28)' : 'transparent';
      }}
    >
      <div style={{
        width: 28, height: 28, flexShrink: 0, borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: featured ? GOLD : colBg === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(43,138,110,0.10)',
      }}>
        <Icon size={13} style={{ color: featured ? NAVY : colBg === 'dark' ? 'rgba(255,255,255,0.75)' : TEAL }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: colBg === 'dark' ? '#fff' : NAVY, margin: '0 0 2px', lineHeight: 1.3 }}>{label}</p>
        <p style={{ fontSize: 10.5, color: colBg === 'dark' ? 'rgba(255,255,255,0.45)' : '#6B7280', margin: 0, lineHeight: 1.45 }}>{sub}</p>
      </div>
    </div>
  );

  const megaColHeading = (text: string, light = false) => (
    <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: light ? 'rgba(255,255,255,0.35)' : GOLD, margin: '0 0 6px 2px' }}>
      {text}
    </p>
  );

  const megaShadow = '0 24px 64px rgba(10,15,46,0.22), 0 4px 20px rgba(10,15,46,0.10)';
  const megaBorder = '1px solid rgba(10,15,46,0.14)';

  // ── WHAT WE DO mega-menu ─────────────────────────────────────────────────
  const renderPlatformDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {renderDropdownButton("What We Do")}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="p-0 overflow-hidden"
        style={{ width: 700, background: '#fff', border: megaBorder, boxShadow: megaShadow }}
      >
        {/* Header bar */}
        <div style={{ background: NAVY, padding: '11px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <div>
              <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 2px' }}>Old Operating Model</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#f87171', margin: 0, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>Committees. Alignment. Delay.</p>
            </div>
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.2)', padding: '0 4px' }}>→</div>
            <div>
              <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 2px' }}>Readiness OS</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: GOLD, margin: 0, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>170 Playbooks. 12 minutes.</p>
            </div>
          </div>
          <div style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 0, padding: '5px 12px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: GOLD, margin: 0, lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>9 Domains</p>
            <p style={{ fontSize: 8, fontWeight: 700, color: 'rgba(201,168,76,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '2px 0 0' }}>248+ Data Points</p>
          </div>
        </div>

        {/* Two-column body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          {/* Left: The Model + Core Capabilities */}
          <div style={{ padding: '12px 12px 12px 16px', borderRight: '1px solid rgba(10,15,46,0.07)' }}>
            {megaColHeading("The Operating Model")}
            {[
              { path: '/how-it-works', icon: Play, label: 'How It Works', sub: 'From trigger to full execution — the 12-minute sequence', featured: true },
              { path: '/platform-overview', icon: Eye, label: 'Platform Overview', sub: 'Every capability, connected in one view' },
              { path: '/idea-framework', icon: Layers, label: 'IDEA Framework', sub: 'Identify · Detect · Execute · Advance' },
              { path: '/why-execution-os', icon: Shield, label: 'Why Readiness OS', sub: 'The 30-day mobilization gap — and how we close it' },
            ].map(l => megaItem(l))}
            <div style={{ margin: '6px 0 5px', height: 1, background: 'rgba(10,15,46,0.07)' }} />
            {megaColHeading("Core Capabilities")}
            {[
              { path: '/playbooks', icon: ClipboardList, label: 'Playbook Library', sub: '170 pre-staged playbooks across 9 strategic domains', featured: true },
              { path: '/triggers-management', icon: Zap, label: 'Trigger Monitoring', sub: 'Automated detection across 248+ data points' },
              { path: '/signal-intelligence', icon: Radar, label: 'Signal Intelligence', sub: '221 triggers — monitored every 15 minutes' },
              { path: '/ecosystems', icon: Globe, label: 'Enterprise Ecosystems', sub: 'Microsoft · Salesforce · AWS · SAP · Workday' },
            ].map(l => megaItem(l))}
          </div>

          {/* Right: Inside the Platform + Execute Tools */}
          <div style={{ padding: '12px 16px 12px 12px', background: 'rgba(248,247,244,0.55)' }}>
            {megaColHeading("Inside the Platform")}
            {[
              { path: '/mission-control', icon: Compass, label: 'Mission Control', sub: 'Your interactive operations center — configure, detect, activate', featured: true },
              { path: '/identify/situation-intents', icon: Target, label: 'Situation Intents', sub: 'Define what your org is watching for — start here', featured: true },
              { path: '/workspace', icon: Layers, label: 'Workspace', sub: 'Execute across all 4 IDEA phases' },
              { path: '/situations-hub', icon: Shield, label: '9-Domain Coverage Board', sub: 'Exposure & readiness across all 9 strategic domains' },
              { path: '/coordination-intelligence', icon: Activity, label: 'Coordination Intelligence', sub: 'Your real speed vs. the 12-minute benchmark', featured: true },
              { path: '/intelligence-hub', icon: Brain, label: 'Intelligence Hub', sub: 'Signal radar, monitoring & compound situation synthesis' },
            ].map(l => megaItem(l))}
            <div style={{ margin: '6px 0 5px', height: 1, background: 'rgba(10,15,46,0.09)' }} />
            {megaColHeading("Execute Phase Tools")}
            {[
              { path: '/command-tower', icon: Radio, label: 'Command Tower', sub: 'Executive wall display — auto-refreshing live feed for conference rooms', featured: true },
              { path: '/concurrent-situations', icon: LayoutGrid, label: 'Concurrent Situation Board', sub: 'Command view — multiple situations at once' },
              { path: '/crisis-communications', icon: MessageSquare, label: 'Crisis Communications', sub: '5 audience-specific messages in 18 seconds' },
              { path: '/financial-exposure', icon: DollarSign, label: 'Financial Exposure Estimator', sub: 'Instant dollar-range exposure when a trigger fires' },
            ].map(l => megaItem(l))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // ── THE PROOF mega-menu ────────────────────────────────────────────────────
  const renderEvidenceDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {renderDropdownButton("The Proof")}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="p-0 overflow-hidden"
        style={{ width: 620, background: '#fff', border: megaBorder, boxShadow: megaShadow }}
      >
        {/* Header bar */}
        <div style={{ background: NAVY, padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 3px' }}>Research-Backed · Independently Validated</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>McKinsey · Gartner · IBM · PwC · Forrester</p>
          </div>
          <div style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 0, padding: '5px 12px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: GOLD, margin: 0, lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>3,600×</p>
            <p style={{ fontSize: 8, fontWeight: 700, color: 'rgba(201,168,76,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '2px 0 0' }}>Execution Head Start</p>
          </div>
        </div>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ padding: '16px 14px 16px 18px', borderRight: '1px solid rgba(10,15,46,0.07)' }}>
            {megaColHeading("The Case for Readiness OS")}
            {[
              { path: '/why-execution-os', icon: Scale, label: 'Why Readiness OS?', sub: 'vs. Copilot, ServiceNow, Palantir, Everbridge — the honest answer', featured: true },
              { path: '/executive-brief', icon: FileText, label: 'Executive Brief', sub: 'Board-ready one-pager — thesis, 3,600× metric, ROI case', featured: true },
              { path: '/research', icon: FileText, label: 'Research & Validation', sub: 'McKinsey, Gartner, IBM, PwC — the evidence behind Readiness OS' },
              { path: '/vs-consulting', icon: Scale, label: 'Why Not Consulting?', sub: 'McKinsey charges $300K–$500K for PDFs. We deliver execution.' },
              { path: '/vs-bcp', icon: Scale, label: 'Readiness OS vs. BCP', sub: 'Your BCP covers catastrophe. We cover the triggers that happen every year.' },
            ].map(l => megaItem(l))}
          </div>
          <div style={{ padding: '16px 18px 16px 14px', background: 'rgba(248,247,244,0.55)' }}>
            {megaColHeading("Tools & Proof")}
            {[
              { path: '/roi-calculator', icon: Calculator, label: 'ROI Calculator', sub: 'See the competitive window you\'re leaving open', featured: true },
              { path: '/readiness-assessment', icon: ClipboardCheck, label: 'Readiness Score', sub: 'Score your org\'s execution readiness across all 9 domains' },
              { path: '/growth', icon: TrendingUp, label: 'Pricing & Plans', sub: 'Accessible entry — full platform, grow as you scale', featured: true },
              { path: '/customer-journey', icon: Users, label: 'Customer Journey', sub: 'See how Fortune 1000 teams onboard & scale' },
            ].map(l => megaItem(l))}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(10,15,46,0.08)' }}>
              <div
                onClick={() => navigateTo('/12-minute-experience')}
                style={{ background: NAVY, borderRadius: 0, padding: '10px 14px', cursor: 'pointer', transition: 'background 0.12s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#141B45'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = NAVY; }}
              >
                <p style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 2px' }}>See It In Action</p>
                <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.4 }}>Run the 12-Minute Test Drive — no login required →</p>
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // ── INVESTORS mega-menu ───────────────────────────────────────────────────
  const renderInvestorsDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {renderDropdownButton("Investors", true)}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="p-0 overflow-hidden"
        style={{ width: 560, background: '#fff', border: megaBorder, boxShadow: megaShadow }}
      >
        {/* Header bar */}
        <div style={{ background: NAVY, padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 3px' }}>Pre-Seed · Category-Defining Infrastructure</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: GOLD, margin: 0, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>The Readiness Infrastructure Enterprises Are Missing</p>
          </div>
        </div>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ padding: '16px 14px 16px 18px', borderRight: '1px solid rgba(10,15,46,0.07)' }}>
            {megaColHeading("Investor Materials")}
            {[
              { path: '/investor-resources', icon: FileText, label: 'Investor Resources', sub: 'Full materials — frameworks, thesis & deck', featured: true },
              { path: '/capabilities', icon: Layers, label: 'Platform Capabilities', sub: 'Every capability across the full decision lifecycle — product depth for buyers & investors' },
              { path: '/investors', icon: TrendingUp, label: 'Investment Thesis', sub: 'Market opportunity, research validation & ROI case' },
              { path: '/pitch-deck', icon: Presentation, label: 'Pitch Deck', sub: 'Pre-seed investor presentation' },
            ].map(l => megaItem(l))}
          </div>
          <div style={{ padding: '16px 18px 16px 14px', background: 'rgba(248,247,244,0.55)' }}>
            {megaColHeading("Board & Founder")}
            {[
              { path: '/board-briefings', icon: FileText, label: 'Board Briefings', sub: 'Executive-ready board reporting' },
              { path: '/founder-story', icon: Video, label: "Founder's Story", sub: 'The vision behind Readiness OS', featured: true },
            ].map(l => megaItem(l))}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(10,15,46,0.08)' }}>
              <div
                onClick={() => navigateTo('/request-access')}
                style={{ background: `linear-gradient(135deg,rgba(201,168,76,0.12),rgba(43,138,110,0.08))`, border: '1px solid rgba(201,168,76,0.3)', borderRadius: 0, padding: '10px 14px', cursor: 'pointer', transition: 'all 0.12s' }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'linear-gradient(135deg,rgba(201,168,76,0.22),rgba(43,138,110,0.14))';
                  el.style.borderColor = 'rgba(201,168,76,0.5)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'linear-gradient(135deg,rgba(201,168,76,0.12),rgba(43,138,110,0.08))';
                  el.style.borderColor = 'rgba(201,168,76,0.3)';
                }}
              >
                <p style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 2px' }}>Request a Pilot</p>
                <p style={{ fontSize: 10.5, color: '#374151', margin: 0, lineHeight: 1.4 }}>Deploy Readiness OS inside your portfolio company →</p>
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderExperienceDropdown = () => {
    const primaryDemos = [
      {
        path: '/industry-demos',
        icon: Globe,
        label: 'See Your Scenario',
        sub: 'Pick your industry and concern. LVMH · Toyota · LoanDepot · Glenmark — real triggers, real playbooks, real outcomes.',
        featured: true,
      },
      {
        path: '/12-minute-experience',
        icon: Play,
        label: '12-Minute Test Drive',
        sub: 'A trigger fires. Your C-suite mobilizes in 12 minutes — watch every role, every task, live. No login required.',
        featured: true,
      },
    ];
    const deeperDemos = [
      { path: '/executive-scenarios', icon: Target, label: 'Executive Scenario Suite', sub: 'Your industry. Your trigger. Full IDEA chain walk-through — Technology, Finance, Manufacturing, Healthcare.' },
      { path: '/capabilities', icon: Layers, label: 'Platform Capabilities', sub: 'Every capability across the full decision lifecycle — preparation, activation, coordination, and learning.' },
      { path: '/role-selector', icon: Users, label: 'By Your Role', sub: 'CEO · CISO · CFO · CMO — playbooks built for your exact function' },
      { path: '/incident-analyzer', icon: AlertCircle, label: 'Analyze Your Situation', sub: 'Describe any event — AI maps it to the right playbook in 60 seconds' },
      { path: '/executive-brief', icon: FileText, label: 'One-Page Board Brief', sub: 'The full thesis, 3,600× metric, and ROI case — shareable in 60 seconds' },
    ];
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="px-3 py-2 text-sm font-bold transition-all duration-150 flex items-center gap-1.5"
            style={{
              color: NAVY,
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.3)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.18)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.55)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)';
            }}
          >
            <span style={{ color: GOLD, fontSize: 10 }}>▶</span>
            See It Work
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="p-0 overflow-hidden"
          style={{
            width: 660,
            background: '#fff',
            border: '1px solid rgba(10,15,46,0.14)',
            boxShadow: '0 24px 64px rgba(10,15,46,0.22), 0 4px 20px rgba(10,15,46,0.10)',
          }}
        >
          {/* Top bar — the core contrast */}
          <div style={{ background: NAVY, padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 0, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              <div>
                <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 2px' }}>Traditional Enterprise</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#f87171', margin: 0, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>30 days to mobilize</p>
              </div>
              <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.2)', padding: '0 4px' }}>→</div>
              <div>
                <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 2px' }}>Readiness OS</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: 0, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>12 minutes to execution</p>
              </div>
            </div>
            <div style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 0, padding: '5px 12px', textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: GOLD, margin: 0, lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>3,600×</p>
              <p style={{ fontSize: 8, fontWeight: 700, color: 'rgba(201,168,76,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '2px 0 0' }}>Execution Head Start</p>
            </div>
          </div>

          {/* Two-column content area */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {/* Left column: primary demo paths */}
            <div style={{ padding: '18px 14px 18px 18px', borderRight: '1px solid rgba(10,15,46,0.07)' }}>
              <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, margin: '0 0 12px 2px' }}>Live Demos — No Login Required</p>
              {primaryDemos.map(({ path, icon: Icon, label, sub, featured }) => (
                <div
                  key={path}
                  onClick={() => navigateTo(path)}
                  style={{
                    display: 'flex', gap: 11, alignItems: 'flex-start', padding: '10px 11px', marginBottom: 6, borderRadius: 0,
                    cursor: 'pointer', transition: 'all 0.14s',
                    background: featured ? 'linear-gradient(135deg,rgba(201,168,76,0.11),rgba(43,138,110,0.07))' : 'transparent',
                    border: featured ? '1px solid rgba(201,168,76,0.28)' : '1px solid transparent',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = featured ? 'linear-gradient(135deg,rgba(201,168,76,0.2),rgba(43,138,110,0.13))' : 'rgba(10,15,46,0.05)';
                    el.style.borderColor = featured ? 'rgba(201,168,76,0.5)' : 'transparent';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = featured ? 'linear-gradient(135deg,rgba(201,168,76,0.11),rgba(43,138,110,0.07))' : 'transparent';
                    el.style.borderColor = featured ? 'rgba(201,168,76,0.28)' : 'transparent';
                  }}
                >
                  <div style={{ width: 34, height: 34, background: featured ? GOLD : 'rgba(43,138,110,0.1)', borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} style={{ color: featured ? NAVY : TEAL }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: NAVY, margin: '0 0 2px', lineHeight: 1.3 }}>{label}</p>
                    <p style={{ fontSize: 10.5, color: '#6B7280', margin: 0, lineHeight: 1.45 }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right column: deeper experiences */}
            <div style={{ padding: '18px 18px 18px 14px', background: 'rgba(248,247,244,0.55)' }}>
              <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 12px 2px' }}>Go Deeper</p>
              {deeperDemos.map(({ path, icon: Icon, label, sub }) => (
                <div
                  key={path}
                  onClick={() => navigateTo(path)}
                  style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 10px', marginBottom: 4, borderRadius: 0, cursor: 'pointer', transition: 'background 0.12s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(10,15,46,0.06)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <div style={{ width: 28, height: 28, background: 'rgba(10,15,46,0.07)', borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={13} style={{ color: NAVY }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: NAVY, margin: '0 0 1px', lineHeight: 1.3 }}>{label}</p>
                    <p style={{ fontSize: 10, color: '#6B7280', margin: 0, lineHeight: 1.4 }}>{sub}</p>
                  </div>
                </div>
              ))}
              {/* Bottom CTA */}
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(10,15,46,0.08)' }}>
                <div
                  onClick={() => navigateTo('/request-access')}
                  style={{ background: NAVY, borderRadius: 0, padding: '11px 14px', cursor: 'pointer', transition: 'background 0.12s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#141B45'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = NAVY; }}
                >
                  <p style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 3px' }}>Ready to Run It Inside Your Org?</p>
                  <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.4 }}>Deploy Readiness OS for your team in 30 days →</p>
                </div>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: '#ffffff',
        borderBottom: `1px solid rgba(201,168,76,0.2)`,
        boxShadow: '0 1px 16px rgba(10,15,46,0.06)',
      }}
    >
      {/* Gold accent line at very top */}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${GOLD} 0%, ${TEAL} 50%, ${GOLD} 100%)`, opacity: 0.7 }} />

      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between" style={{ height: navLogoHeight }}>

          {/* Left: Logo */}
          <div className="flex items-center">
            <div
              className="flex items-center cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => navigateTo('/')}
              data-testid="nav-logo"
            >
              <ExecuteIQLogo height={navLogoHeight} variant="full" color="navy" />
            </div>
          </div>

          {/* Center: Nav Links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {renderPlatformDropdown()}
            {renderExperienceDropdown()}
            {renderEvidenceDropdown()}
            {renderInvestorsDropdown()}
            <button
              onClick={() => navigateTo('/onboarding-guide')}
              className="px-3 py-2 text-sm font-semibold transition-all duration-150 flex items-center gap-1.5"
              style={{ color: GOLD, background: 'transparent', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.10)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Guide
            </button>
          </div>

          {/* Right: CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Back button — only on inner pages, right-side so logo stays anchored */}
            {!isHomePage && (
              <button
                onClick={handleBack}
                className="h-9 w-9 flex items-center justify-center transition-all"
                style={{ color: NAVY, background: 'transparent', border: '1px solid rgba(10,15,46,0.12)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(10,15,46,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                data-testid="nav-back-button"
                title="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            {/* Global Search Button */}
            <button
              onClick={() => { setSearchOpen(o => !o); setSearchQuery(''); }}
              className="h-9 w-9 flex items-center justify-center border transition-all"
              style={{ border: '1px solid rgba(10,15,46,0.12)', color: NAVY, background: searchOpen ? 'rgba(10,15,46,0.04)' : 'transparent' }}
              title="Search platform (⌘K)"
            >
              <Search className="h-4 w-4" />
            </button>
            {isLoading ? (
              <div className="h-9 w-48 bg-gray-100 animate-pulse" />
            ) : isAuthenticated && user ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigateTo("/request-access")}
                  className="h-9 px-3 text-sm font-semibold"
                  style={{ border: `1px solid rgba(10,15,46,0.2)`, color: NAVY }}
                  data-testid="nav-try-demo"
                >
                  Request Access
                </Button>
                <Button
                  onClick={() => navigateTo("/request-access")}
                  className="h-9 px-3 text-sm font-bold"
                  style={{ background: GOLD, color: NAVY, border: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#DFC178'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = GOLD; }}
                  data-testid="nav-request-pilot"
                >
                  Request a Pilot
                </Button>
                <Button
                  onClick={() => navigateTo("/command-center")}
                  className="h-9 px-4 text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${TEAL}, #3BAF8A)`, border: 'none' }}
                  data-testid="nav-open-platform"
                >
                  <Compass className="h-4 w-4 mr-1.5" />
                  Open Platform
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-3 py-1.5 h-9"
                      style={{ color: NAVY }}
                      data-testid="nav-user-menu"
                    >
                      <User className="h-4 w-4" style={{ color: TEAL }} />
                      <span className="hidden xl:inline text-sm font-medium">{user.firstName || user.email?.split('@')[0]}</span>
                      <ChevronDown className="h-3 w-3 opacity-40" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48" style={{ border: `1px solid rgba(10,15,46,0.1)` }}>
                    <DropdownMenuLabel className="text-xs font-normal" style={{ color: '#6B7280' }}>{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigateTo("/onboarding-guide")} className="cursor-pointer" style={{ color: NAVY }}>
                      <BookOpen className="h-4 w-4 mr-2 opacity-50" />
                      Onboarding Guide
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigateTo("/settings-hub")} className="cursor-pointer" style={{ color: NAVY }}>
                      <Settings className="h-4 w-4 mr-2 opacity-50" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateTo("/organization-setup")} className="cursor-pointer" style={{ color: NAVY }}>
                      <Building className="h-4 w-4 mr-2 opacity-50" />
                      Organization Setup
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateTo("/admin/customer-health")} className="cursor-pointer" style={{ color: NAVY }}>
                      <BarChart3 className="h-4 w-4 mr-2 opacity-50" />
                      Customer Health
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateTo("/peer-review-report")} className="cursor-pointer" style={{ color: NAVY }}>
                      <BarChart3 className="h-4 w-4 mr-2 opacity-50" />
                      Peer Review Report
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer" style={{ color: '#DC2626' }} data-testid="nav-logout">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigateTo("/request-access")}
                  className="h-9 px-4 text-sm font-semibold"
                  style={{ border: `1px solid rgba(10,15,46,0.2)`, color: NAVY }}
                  data-testid="nav-request-access"
                >
                  Request Access
                </Button>
                <Button
                  onClick={() => navigateTo("/request-access")}
                  className="h-9 px-4 text-sm font-bold"
                  style={{ background: GOLD, color: NAVY, border: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#DFC178'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = GOLD; }}
                  data-testid="nav-request-pilot"
                >
                  Request a Pilot
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigateTo('/request-access')}
                  className="h-9 px-3 text-sm font-medium"
                  style={{ color: NAVY }}
                  data-testid="nav-login"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="ml-0.5">Sign In</span>
                  </span>
                </Button>
              </>
            )}
          </div>

          {/* Mobile: open platform + hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            {isAuthenticated && user && (
              <Button
                onClick={() => navigateTo("/command-center")}
                size="sm"
                className="text-white"
                style={{ background: `linear-gradient(135deg, ${TEAL}, #3BAF8A)`, border: 'none' }}
                data-testid="nav-mobile-open-platform"
              >
                <Compass className="h-4 w-4" />
              </Button>
            )}
            <button
              className="p-2 transition-colors"
              style={{ color: NAVY }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(10,15,46,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="nav-mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden py-4 animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto"
            style={{ borderTop: `1px solid rgba(201,168,76,0.15)` }}
          >
            <div className="flex flex-col gap-1">
              {isAuthenticated && user ? (
                <div className="flex flex-col gap-2 px-1">
                  <Button
                    onClick={() => navigateTo("/command-center")}
                    className="w-full justify-center h-12 text-base font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${TEAL}, #3BAF8A)` }}
                    data-testid="nav-mobile-open-platform"
                  >
                    <Compass className="h-5 w-5 mr-2" />
                    Open Platform
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigateTo("/request-access")}
                      variant="outline"
                      className="flex-1 justify-center h-10 text-sm font-semibold"
                      style={{ border: `1px solid rgba(10,15,46,0.2)`, color: NAVY }}
                      data-testid="nav-mobile-try-demo"
                    >
                      Request Access
                    </Button>
                    <Button
                      onClick={() => navigateTo("/request-access")}
                      className="flex-1 justify-center h-10 text-sm font-bold"
                      style={{ background: GOLD, color: NAVY }}
                      data-testid="nav-mobile-request-pilot"
                    >
                      Request a Pilot
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-1">
                  <Button
                    onClick={() => navigateTo("/request-access")}
                    variant="outline"
                    className="w-full justify-center h-11 text-sm font-semibold"
                    style={{ border: `1px solid rgba(10,15,46,0.2)`, color: NAVY }}
                    data-testid="nav-mobile-try-demo"
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Request Access
                  </Button>
                  <Button
                    onClick={() => navigateTo("/request-access")}
                    className="w-full justify-center h-11 text-sm font-bold"
                    style={{ background: GOLD, color: NAVY }}
                    data-testid="nav-mobile-request-pilot"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Request a Pilot
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigateTo('/request-access')}
                    className="w-full justify-center h-9 text-sm"
                    style={{ color: NAVY }}
                    data-testid="nav-mobile-login"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="ml-0.5">Sign In</span>
                    </span>
                  </Button>
                </div>
              )}

              <div style={{ borderTop: `1px solid rgba(201,168,76,0.1)`, margin: '12px 0' }} />

              {platformSections.map((section) => (
                <div key={section.heading}>
                  <p className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: GOLD }}>{section.heading}</p>
                  {section.links.map((link) => (
                    <button
                      key={link.path + link.label}
                      onClick={() => navigateTo(link.path)}
                      className="w-full text-left py-2.5 px-4 transition-colors flex items-center gap-3"
                      style={{
                        color: isActivePath(link.path) ? NAVY : '#374151',
                        fontWeight: isActivePath(link.path) ? 600 : 500,
                        background: isActivePath(link.path) ? 'rgba(10,15,46,0.05)' : 'transparent',
                      }}
                    >
                      <link.icon className="h-4 w-4" style={{ color: TEAL }} />
                      {link.label}
                    </button>
                  ))}
                </div>
              ))}

              <div style={{ borderTop: `1px solid rgba(201,168,76,0.1)`, margin: '8px 0' }} />

              {experienceSections.map((section, sIdx) => (
                <div key={section.heading}>
                  <p className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: GOLD }}>{sIdx === 0 ? 'See It Work' : section.heading}</p>
                  {section.links.map((link) => (
                    <button
                      key={link.path + link.label}
                      onClick={() => navigateTo(link.path)}
                      className="w-full text-left py-2.5 px-4 transition-colors flex items-center gap-3"
                      style={{ color: '#374151', fontWeight: 500 }}
                    >
                      <link.icon className="h-4 w-4" style={{ color: GOLD }} />
                      {link.label}
                    </button>
                  ))}
                </div>
              ))}

              <div style={{ borderTop: `1px solid rgba(201,168,76,0.1)`, margin: '8px 0' }} />

              <p className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: TEAL }}>The Proof</p>
              {evidenceLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className="w-full text-left py-2.5 px-4 transition-colors flex items-center gap-3"
                  style={{ color: '#374151', fontWeight: 500 }}
                >
                  <link.icon className="h-4 w-4" style={{ color: TEAL }} />
                  {link.label}
                </button>
              ))}

              <div style={{ borderTop: `1px solid rgba(201,168,76,0.1)`, margin: '8px 0' }} />

              <p className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: GOLD }}>Investors</p>
              {investorsLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className="w-full text-left py-2.5 px-4 transition-colors flex items-center gap-3"
                  style={{ color: '#374151', fontWeight: 500 }}
                >
                  <link.icon className="h-4 w-4" style={{ color: GOLD }} />
                  {link.label}
                </button>
              ))}

              {isAuthenticated && user && (
                <>
                  <div style={{ borderTop: `1px solid rgba(201,168,76,0.1)`, margin: '8px 0' }} />
                  <button
                    onClick={logout}
                    className="w-full text-left py-2.5 px-4 flex items-center gap-3 text-sm font-medium"
                    style={{ color: '#DC2626' }}
                    data-testid="nav-mobile-logout"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Authenticated monitoring status bar */}
      {isAuthenticated && user && (
        <div style={{ background: '#0A0F2E', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
          <div className="max-w-7xl mx-auto px-8">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 30 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 5, height: 5, background: '#3BAF8A', borderRadius: 0, display: 'inline-block' }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#3BAF8A' }}>Monitoring Active</span>
                </div>
                <span style={{ fontSize: 9, color: 'rgba(240,237,228,0.35)', letterSpacing: '0.08em' }}>248+ Data Points</span>
                <span style={{ fontSize: 9, color: 'rgba(240,237,228,0.35)', letterSpacing: '0.08em' }}>221 Triggers Active</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Radio style={{ width: 8, height: 8, color: 'rgba(201,168,76,0.45)' }} />
                <span style={{ fontSize: 9, color: 'rgba(240,237,228,0.3)', letterSpacing: '0.08em' }}>Scanning every 15 min</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Command Search Overlay */}
      {searchOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(10,15,46,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 640, padding: '0 16px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ background: '#fff', border: '1px solid rgba(10,15,46,0.12)', boxShadow: '0 24px 60px rgba(10,15,46,0.25)', overflow: 'hidden' }}>
              {/* Search input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid #E8E4DC' }}>
                <Search style={{ width: 16, height: 16, color: '#9CA3AF', flexShrink: 0 }} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search pages, playbooks, actions…"
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#0A0F2E', fontWeight: 500, background: 'transparent' }}
                />
                <kbd style={{ fontSize: 10, color: '#9CA3AF', border: '1px solid #E8E4DC', padding: '2px 6px', fontFamily: 'monospace' }}>ESC</kbd>
              </div>
              {/* Results */}
              <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                {(() => {
                  const q = searchQuery.toLowerCase().trim();
                  const filtered = q
                    ? SEARCH_ITEMS.filter(item => item.label.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
                    : SEARCH_ITEMS.slice(0, 10);
                  const groups = filtered.reduce((acc: Record<string, typeof SEARCH_ITEMS>, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                  }, {});
                  if (filtered.length === 0) return (
                    <div style={{ padding: '32px 18px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>No results for "{searchQuery}"</div>
                  );
                  return Object.entries(groups).map(([cat, items]) => (
                    <div key={cat}>
                      <div style={{ padding: '10px 18px 4px', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C' }}>{cat}</div>
                      {items.map(item => (
                        <button
                          key={item.path}
                          onClick={() => { navigateTo(item.path); setSearchOpen(false); setSearchQuery(''); }}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F8F7F4'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                          <div style={{ width: 28, height: 28, background: '#F0EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <item.icon style={{ width: 13, height: 13, color: '#0A0F2E' }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 500, color: '#0A0F2E' }}>{item.label}</span>
                          <span style={{ marginLeft: 'auto', fontSize: 10, color: '#C9A84C', fontWeight: 700, letterSpacing: '0.08em' }}>→</span>
                        </button>
                      ))}
                    </div>
                  ));
                })()}
              </div>
              <div style={{ padding: '8px 18px', borderTop: '1px solid #E8E4DC', display: 'flex', gap: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: '#9CA3AF' }}><kbd style={{ fontFamily: 'monospace', fontSize: 10, background: '#F8F7F4', border: '1px solid #E8E4DC', padding: '1px 5px' }}>⌘K</kbd> to toggle</span>
                <span style={{ fontSize: 10, color: '#9CA3AF' }}><kbd style={{ fontFamily: 'monospace', fontSize: 10, background: '#F8F7F4', border: '1px solid #E8E4DC', padding: '1px 5px' }}>↵</kbd> to navigate</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
