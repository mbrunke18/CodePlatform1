import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, User, ChevronDown, BarChart3, TrendingUp, Zap, ClipboardList, Radar, Compass, Globe, Users, Calculator, Shield, Layers, ArrowLeft, Brain, Target, Lightbulb, BookOpen, FileText, Settings, Building, Presentation, Video, Eye, Rocket, AlertCircle, AlertTriangle, ClipboardCheck, FlaskConical, Radio, Play, Search, Activity, Scale, MessageSquare, DollarSign, LayoutGrid, Calendar, Grid3X3, CheckCircle } from "lucide-react";
import { SiGoogle, SiGithub, SiApple } from "react-icons/si";

const MicrosoftIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
    <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
  </svg>
);
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
  { label: 'Getting Started — Go-Live Checklist', path: '/getting-started', category: 'Setup', icon: Rocket },
  { label: 'Quarterly Readiness Planning — Stage Both Planned and Unplanned Work', path: '/quarterly-planning', category: 'Setup', icon: BarChart3 },
  { label: 'Readiness Architecture Studio — Configure Your Response Architecture', path: '/preparation-diagnostic', category: 'Setup', icon: Target },
  { label: 'Preparation Architect Guide — Readiness Architecture Setup', path: '/pmo-onboarding', category: 'Setup', icon: Layers },
  { label: 'Mission Control', path: '/mission-control', category: 'Platform', icon: Compass },
  { label: 'Command Tower', path: '/command-tower', category: 'Platform', icon: Radio },
  { label: 'Execution Workspace', path: '/workspace', category: 'Platform', icon: Layers },
  { label: 'Intelligence Control Center', path: '/intelligence-hub', category: 'Platform', icon: Brain },
  { label: 'Intelligence Hub', path: '/ai-intelligence', category: 'Platform', icon: Brain },
  { label: 'Settings Hub', path: '/settings-hub', category: 'Platform', icon: Settings },
  { label: 'Organization Setup', path: '/organization-setup', category: 'Platform', icon: Building },
  { label: 'Readiness Protocol Library', path: '/protocols', category: 'Identify', icon: BookOpen },
  { label: 'Strategic Planning Hub', path: '/strategic', category: 'Identify', icon: Target },
  { label: 'What-If Analyzer', path: '/what-if-analyzer', category: 'Identify', icon: Lightbulb },
  { label: 'Response Customization', path: '/playbook-customization', category: 'Identify', icon: ClipboardCheck },
  { label: 'Preparedness Report', path: '/preparedness-report', category: 'Identify', icon: Shield },
  { label: 'Signal Radar Dashboard', path: '/ai-radar', category: 'Detect', icon: Radar },
  { label: 'Foresight Radar', path: '/foresight-radar', category: 'Detect', icon: Eye },
  { label: 'Signal Intelligence', path: '/signal-intelligence', category: 'Detect', icon: Radio },
  { label: 'Incident Analyzer', path: '/incident-analyzer', category: 'Detect', icon: AlertCircle },
  { label: 'Live Activation Center', path: '/live-activation-center', category: 'Execute', icon: Zap },
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
  { label: 'Regulatory Calendar', path: '/regulatory-calendar', category: 'Identify', icon: Calendar },
  { label: 'Product Roadmap', path: '/roadmap', category: 'Platform', icon: TrendingUp },
  { label: 'Command Tower', path: '/command-tower', category: 'Execute', icon: Radio },
  { label: 'Live Signal Activity Feed', path: '/command-tower', category: 'Execute', icon: Activity },
  { label: 'Execution Clock', path: '/mission-control', category: 'Execute', icon: Activity },
  { label: 'Full Platform Demo — Complete 9-Step Walkthrough', path: '/demo-experience', category: 'Demo', icon: Play },
  { label: 'Full Scenario Experience Center — 8 Demos', path: '/demo-hub', category: 'Demo', icon: LayoutGrid },
  { label: 'Master Demo — Activist Investor (CEO)', path: '/master-demo', category: 'Demo', icon: Play },
  { label: 'Demo — Financial Services Ransomware (CISO)', path: '/demo/ransomware', category: 'Demo', icon: Zap },
  { label: 'Demo — Pharma FDA Recall', path: '/demo/pharma', category: 'Demo', icon: AlertCircle },
  { label: 'Demo — Manufacturing Supply Chain', path: '/demo/supply-chain', category: 'Demo', icon: Globe },
  { label: 'Demo — Energy Grid Failure', path: '/demo/energy', category: 'Demo', icon: Zap },
  { label: 'Demo — Retail Food Safety Crisis', path: '/demo/food-safety', category: 'Demo', icon: AlertCircle },
  { label: 'Demo — Technology Data Breach', path: '/demo/data-breach', category: 'Demo', icon: Target },
  { label: 'Demo — General Counsel DOJ Investigation', path: '/demo/regulatory', category: 'Demo', icon: Scale },
  { label: '12-Minute Test Drive', path: '/12-minute-experience', category: 'Demo', icon: Play },
  { label: 'Protocol Builder', path: '/protocol-builder', category: 'Demo', icon: ClipboardList },
  { label: 'Industry Scenarios', path: '/industry-demos', category: 'Demo', icon: Globe },
  { label: 'Industry Demo Library — 19 Blueprints', path: '/industry-demo-library', category: 'Demo', icon: Globe },
  { label: 'Founding Partner Program', path: '/founding-partner', category: 'Action', icon: Target },
  { label: 'Founding Partner Brief — What You Get in 90 Days', path: '/founding-partner-brief', category: 'Action', icon: FileText },
  { label: 'Readiness Operating Rhythm — Monthly Cadence', path: '/readiness-rhythm', category: 'Learn', icon: Activity },
  { label: 'New Here? Start Here — First-Time Visitor Entry', path: '/entry', category: 'Learn', icon: Rocket },
  { label: 'How It Works', path: '/how-it-works', category: 'Learn', icon: Play },
  { label: 'Research & Validation', path: '/research', category: 'Learn', icon: FileText },
  { label: 'Onboarding Guide', path: '/onboarding-guide', category: 'Learn', icon: BookOpen },
  { label: 'Request Founding Partner Access', path: '/founding-partner', category: 'Action', icon: Target },
  { label: 'Executive Brief', path: '/executive-brief', category: 'Action', icon: FileText },
  { label: 'The Mobilization Tax — Cost-by-Trigger One-Pager', path: '/mobilization-tax', category: 'Action', icon: DollarSign },
  { label: 'Cost of Delay — Real-Time Mobilization Cost Counter', path: '/cost-of-delay', category: 'Action', icon: DollarSign },
  { label: 'Sector Threat Briefing — Live Signals for Your Industry', path: '/sector-briefing', category: 'Action', icon: AlertTriangle },
  { label: 'Why Readiness OS?', path: '/the-proof', category: 'Learn', icon: Scale },
  { label: 'Investor Resources', path: '/investor-resources', category: 'Investors', icon: Building },
  { label: 'Investor Presentation', path: '/investor-presentation', category: 'Investors', icon: Presentation },
];

export default function StandardNav() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, isLoading, login, loginWithMicrosoft, logout } = useAuth();
  const navRef = useRef<HTMLElement>(null);
  const [navHeight, setNavHeight] = useState(95);
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setNavHeight(entry.contentRect.height));
    ro.observe(el);
    setNavHeight(el.getBoundingClientRect().height);
    return () => ro.disconnect();
  }, []);

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
        { label: "How It Executes", path: "/how-it-executes", icon: Zap, description: "Watch the signal → protocol → execution chain in real time", featured: true },
        { label: "Strategic Foresight Engine", path: "/readiness-oracle", icon: Brain, description: "Digital Twin simulation, autonomous war gaming, predictive foresight — the future of readiness", featured: true },
        { label: "Platform Overview", path: "/platform-overview", icon: Eye, description: "Every capability connected — from signal detection to authorized execution, protecting profitability at every stage." },
        { label: "IDEA Framework", path: "/idea-framework", icon: Layers, description: "Map · Monitor · Decide · Execute · Learn — the full advantage lifecycle" },
        { label: "Why Readiness OS", path: "/the-proof", icon: Shield, description: "The 30-day mobilization gap — and how we close it" },
      ],
    },
    {
      heading: "Core Capabilities",
      links: [
        { label: "Readiness Protocol Library", path: "/playbooks", icon: ClipboardList, description: "180 Readiness Protocols pre-staged — every strategic situation mapped, budgeted, and authorized. Zero mobilization cost when the trigger fires." },
        { label: "Industry Demo Library — 19 Blueprints", path: "/industry-demo-library", icon: Target, description: "See exactly what 12-minute execution looks like in your sector — every signal, authorization step, and task. Then ask what 30 days would have cost.", featured: true },
        { label: "Industry Protocol Packs", path: "/industry", icon: Globe, description: "Financial Services · Technology · Manufacturing · Energy · Retail · Healthcare — purpose-built stacks that eliminate sector-specific mobilization gaps.", featured: true },
        { label: "Trigger Monitoring", path: "/triggers-management", icon: Zap, description: "248+ data points monitored continuously — every threat and opportunity surfaced before the 30-day mobilization gap opens and costs compound." },
        { label: "Signal Intelligence", path: "/signal-intelligence", icon: Radar, description: "231 detection thresholds monitored every 15 minutes — every unprepared situation costs 30 days of overhead. Every prepared one costs 12 minutes." },
        { label: "Enterprise Ecosystems", path: "/ecosystems", icon: Globe, description: "Microsoft · Google · Salesforce · AWS · SAP · ServiceNow · Workday", featured: true },
        { label: "Universal Connector", path: "/universal-connector", icon: Globe, description: "Any stack. 55+ pre-built connectors. Live in 15 minutes.", featured: true },
        { label: "Integration Setup Plan", path: "/technical-onboarding", icon: Rocket, description: "Phased technical guide for connecting Readiness OS into your tech environment", featured: true },
      ],
    },
    {
      heading: "Inside the Platform",
      links: [
        { label: "Getting Started", path: "/getting-started", icon: Rocket, description: "Your go-live checklist — complete all 4 phases and track your setup progress in real time", featured: true },
        { label: "Quarterly Readiness Planning", path: "/quarterly-planning", icon: BarChart3, description: "Stage both planned initiatives and unplanned scenarios before the quarter starts — one system, the complete preparation picture", featured: true },
        { label: "Readiness Architecture Studio", path: "/preparation-diagnostic", icon: Target, description: "Configure your full readiness architecture — select protocols by domain, assign authorization chains, and build coverage across all 3 strategic areas", featured: true },
        { label: "Preparation Architect Guide", path: "/pmo-onboarding", icon: Layers, description: "Preparation architecture ownership — your role, your 4-phase go-live path, your governance rhythm", featured: true },
        { label: "30-Day Preparation Arc", path: "/preparation-arc", icon: Target, description: "Week-by-week preparation journey — Install, Build, Drill, Go-Live. The 30 days that make 12-minute execution possible.", featured: true },
        { label: "Mission Control", path: "/mission-control", icon: Compass, description: "Your interactive operations center — configure your OS, review detections, activate Readiness Protocols", featured: true },
        { label: "Command Tower", path: "/command-tower", icon: Radio, description: "Executive wall display — auto-refreshing live feed designed for conference rooms & NOC screens", featured: true },
        { label: "9-Domain Coverage Board", path: "/situations-hub", icon: Shield, description: "Exposure & readiness across all 9 strategic domains — M&A, Competitive, Regulatory, Supply Chain & more" },
        { label: "Coordination Intelligence", path: "/coordination-intelligence", icon: Activity, description: "Your real coordination speed vs. the 12-minute benchmark — the gap is what preparation eliminates and what every unprepared competitor pays for." },
      ],
    },
    {
      heading: "Intelligence Engine",
      links: [
        { label: "Predictive Signal Intelligence", path: "/predictive-intelligence", icon: Target, description: "Pattern-matched clusters — pre-stage protocols before the trigger fires", featured: true },
        { label: "Organizational Tendency Intelligence", path: "/tendency-intelligence", icon: BarChart3, description: "Your organization measured against itself — bottlenecks, stakeholder profiles, execution patterns", featured: true },
        { label: "Sector Intelligence Library", path: "/sector-intelligence", icon: Globe, description: "How 203 organizations in your sector have responded — anonymized, aggregated, actionable", featured: true },
      ],
    },
    {
      heading: "Execute Phase Tools",
      links: [
        { label: "Strategic Monitoring", path: "/strategic-monitoring", icon: AlertCircle, description: "Active trigger monitoring — 15+ pre-staged response protocols, real-time coordination", featured: true },
        { label: "Concurrent Situation Board", path: "/concurrent-situations", icon: LayoutGrid, description: "Command view when multiple triggers compete for C-suite bandwidth", featured: true },
        { label: "Crisis Communications", path: "/crisis-communications", icon: MessageSquare, description: "5 audience communications in 18 seconds — reputational and regulatory costs contained before stakeholder escalation compounds the damage." },
        { label: "Financial Exposure Estimator", path: "/financial-exposure", icon: DollarSign, description: "Instant dollar exposure at trigger point — the CFO's first question answered before the first committee call is even scheduled." },
      ],
    },
  ];

  // EXPERIENCE — self-serve paths for first-time visitors
  const experienceSections: NavSection[] = [
    {
      heading: "Try It Now",
      links: [
        { label: "Protocol Coverage Browser — 210 Situations", path: "/protocol-browser", icon: BookOpen, description: "Search 210 pre-staged protocols. Type any situation — ransomware, activist investor, supply chain collapse. It's already in here.", featured: true },
        { label: "Industry Demo Library — 19 Blueprints", path: "/industry-demo-library", icon: Globe, description: "19 industries. One response time: 12 minutes. See the exact execution sequence for your sector — signals, authorization, tasks.", featured: true },
        { label: "Full Scenario Experience Center", path: "/demo-hub", icon: LayoutGrid, description: "12 complete simulations across all 3 strategic domains — Growth · Resilience · Transformation. Pick your situation.", featured: true },
        { label: "Master Demo — Activist Investor", path: "/master-demo", icon: Play, description: "Elliott Management files 13D at 2:47 AM. The definitive 7-phase walkthrough. Every platform capability in one scenario.", featured: true },
        { label: "The 12-Minute Experience", path: "/12-minute-experience", icon: Rocket, description: "Watch a full Readiness Protocol activate from trigger detection to task assignment — in 12 minutes. No login required.", featured: true },
        { label: "Tier Comparison — Core · Foresight · Enterprise", path: "/tier-comparison", icon: LayoutGrid, description: "Same trigger. Three tiers. See exactly what changes at each level — advance warning, Digital Twin, institutional memory.", featured: true },
      ],
    },
    {
      heading: "Growth & Positioning",
      links: [
        { label: "Competitor Displacement Sprint", path: "/demo/market-entry", icon: TrendingUp, description: "Competitor files Chapter 11. 1,400 accounts in-play. 72-hour window before Salesforce moves.", featured: true },
        { label: "M&A Rapid Response", path: "/demo/acquisition", icon: Target, description: "Acquisition target surfaces. LOI required in 48 hours. Three buyers already in conversations." },
      ],
    },
    {
      heading: "Risk & Resilience",
      links: [
        { label: "Financial Services — Ransomware", path: "/demo/ransomware", icon: Zap, description: "Trading systems encrypted at 4:23 AM. SWIFT offline. Market open in 4 hours." },
        { label: "Pharmaceutical — FDA Recall", path: "/demo/pharma", icon: AlertCircle, description: "Class I recall. 340,000 units in distribution. 72-hour regulatory window." },
        { label: "Manufacturing — Supplier Failure", path: "/demo/supply-chain", icon: Globe, description: "Primary supplier files Chapter 11. 60% of Q3 production at risk." },
        { label: "Industrial HVACR — Supplier Force Majeure", path: "/manufacturing-supplier-demo", icon: Globe, description: "Primary compressor supplier declares force majeure. 14 facilities exposed. CFO + COO authorization in 12 minutes." },
        { label: "Technology — Data Breach", path: "/demo/data-breach", icon: Target, description: "2.3M records on dark web. GDPR 72-hour clock started." },
      ],
    },
    {
      heading: "Transformation",
      links: [
        { label: "Go-to-Market Acceleration", path: "/demo/product-launch", icon: Rocket, description: "Competitor announces launch in 30 days. Board authorizes 6-week pull-forward. GTM mobilizes in 12 minutes.", featured: true },
        { label: "Workforce Transformation Protocol", path: "/demo/workforce", icon: Users, description: "Board approves system-staged realignment — 6,720 roles, 12 countries. WARN Act. 48 hours to execute." },
        { label: "Protocol Builder", path: "/protocol-builder", icon: ClipboardList, description: "Pre-stage your own Readiness Protocol for any situation in 6 guided steps." },
        { label: "Situation Matrix Builder", path: "/situation-matrix-builder", icon: Grid3X3, description: "Build a Role × Situation call sheet — every role, every scenario variant, every responsibility defined before the trigger fires.", featured: true },
        { label: "My Protocols", path: "/my-protocols", icon: Radio, description: "Live signal readiness status for every protocol you've built." },
      ],
    },
  ];

  // EVIDENCE — research, proof, and ROI validation
  const evidenceLinks: NavLink[] = [
    { label: "What to Expect", path: "/what-to-expect", icon: CheckCircle, description: "Purpose, value delivered, and what success requires from your team — the three questions every serious buyer asks.", featured: true },
    { label: "The Case — The Argument You Can't Argue Out Of", path: "/the-case", icon: Scale, description: "Problem cost → proof → moat → ROI → comparison → decision. The complete buying argument in one page.", featured: true },
    { label: "How It Works", path: "/how-it-executes", icon: FileText, description: "From trigger detection to full coordination in 12 minutes — the complete execution sequence", featured: true },
    { label: "Why Readiness OS?", path: "/the-proof", icon: Scale, description: "Why not Copilot, ServiceNow, Palantir, or Everbridge — the honest answer", featured: true },
    { label: "Executive Brief", path: "/executive-brief", icon: FileText, description: "Board-ready one-pager — thesis, 3,600× metric, ROI case", featured: true },
    { label: "What One Trigger Costs", path: "/mobilization-cost", icon: DollarSign, description: "Ransomware: $4.5M. Activist investor: $3.2M. Regulatory: $5.8M. The cost isn't the event — it's the mobilization.", featured: true },
    { label: "Readiness Benchmark — Free", path: "/readiness-benchmark", icon: ClipboardCheck, description: "3-minute score. Typical enterprise: 22. Founding Partners: 87. See where you stand.", featured: true },
    { label: "Research & Validation", path: "/research", icon: FileText, description: "McKinsey, Gartner, IBM, PwC — the evidence behind Readiness OS" },
    { label: "ROI Calculator", path: "/roi-calculator", icon: Calculator, description: "See the competitive window you're leaving open", featured: true },
    { label: "Cost of Delay", path: "/cost-of-delay", icon: DollarSign, description: "Real-time counter: what your current mobilization model costs while you evaluate", featured: true },
    { label: "Sector Threat Briefing", path: "/sector-briefing", icon: AlertTriangle, description: "Live signal scan for your sector — detection thresholds active today, protocols already staged", featured: true },
    { label: "Proof Story", path: "/proof-story", icon: Scale, description: "Same trigger — entirely different outcome. The numbers side by side." },
    { label: "Pricing & Plans", path: "/pricing", icon: TrendingUp, description: "Core · Foresight · Enterprise — three layers of readiness, transparent value-based pricing", featured: true },
    { label: "Customer Journey", path: "/customer-journey", icon: Users, description: "See how enterprise teams onboard & scale" },
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
    { label: "Product Roadmap", path: "/roadmap", icon: TrendingUp, description: "Live features, what's in development, and what's planned — with rationale for each", featured: true },
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
        color: highlighted ? GOLD : 'rgba(255,255,255,0.82)',
        background: 'transparent',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = highlighted ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.07)';
        if (!highlighted) el.style.color = '#fff';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'transparent';
        el.style.color = highlighted ? GOLD : 'rgba(255,255,255,0.82)';
      }}
      data-testid={`nav-${label.toLowerCase().replace(/\s+/g, '-')}-dropdown`}
    >
      {label}
      <ChevronDown className="h-3 w-3 opacity-50" />
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
    <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: light ? 'rgba(255,255,255,0.68)' : GOLD, margin: '0 0 6px 2px' }}>
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
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', margin: '0 0 2px' }}>Old Operating Model</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#f87171', margin: 0, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>Committees. Alignment. Delay.</p>
            </div>
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.68)', padding: '0 4px' }}>→</div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', margin: '0 0 2px' }}>Readiness OS</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: GOLD, margin: 0, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>180 Readiness Protocols. 12 minutes.</p>
            </div>
          </div>
          <div style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 0, padding: '5px 12px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: GOLD, margin: 0, lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>9 Domains</p>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(201,168,76,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '2px 0 0' }}>248+ Data Points</p>
          </div>
        </div>

        {/* Two-column body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          {/* Left: The Model + Core Capabilities */}
          <div style={{ padding: '12px 12px 12px 16px', borderRight: '1px solid rgba(10,15,46,0.07)' }}>
            {megaColHeading("The Operating Model")}
            {[
              { path: '/how-it-works', icon: Play, label: 'How It Works', sub: 'From trigger to full execution — the 12-minute sequence', featured: true },
              { path: '/how-it-executes', icon: Zap, label: 'How It Executes', sub: 'Watch the signal → protocol → execution chain in real time', featured: true },
              { path: '/readiness-rhythm', icon: Activity, label: 'Readiness Operating Rhythm', sub: 'The monthly cadence that sustains preparation — continuous, not one-time', featured: true },
              { path: '/platform-overview', icon: Eye, label: 'Platform Overview', sub: 'Every capability, connected in one view' },
              { path: '/idea-framework', icon: Layers, label: 'IDEA Framework', sub: 'Map · Monitor · Decide · Execute · Learn' },
              { path: '/the-proof', icon: Shield, label: 'Why Readiness OS', sub: 'The 30-day mobilization gap — and how we close it' },
            ].map(l => megaItem(l))}
            <div style={{ margin: '6px 0 5px', height: 1, background: 'rgba(10,15,46,0.07)' }} />
            {megaColHeading("Core Capabilities")}
            {[
              { path: '/playbooks', icon: ClipboardList, label: 'Readiness Protocol Library', sub: '180 pre-staged Readiness Protocols across 9 strategic domains', featured: true },
              { path: '/triggers-management', icon: Zap, label: 'Trigger Monitoring', sub: 'Automated detection across 248+ data points' },
              { path: '/signal-intelligence', icon: Radar, label: 'Signal Intelligence', sub: '231 detection thresholds — monitored every 15 minutes' },
              { path: '/ecosystems', icon: Globe, label: 'Enterprise Ecosystems', sub: 'Microsoft · Salesforce · AWS · SAP · Workday' },
            ].map(l => megaItem(l))}
            <div style={{ margin: '6px 0 5px', height: 1, background: 'rgba(10,15,46,0.07)' }} />
            {megaColHeading("Technical Architecture")}
            {[
              { path: '/execution-data-fabric', icon: Layers, label: 'Execution Data Fabric', sub: 'How signals become staged responses — the AI and data architecture', featured: true },
              { path: '/institutional-memory-engine', icon: Brain, label: 'Institutional Memory Engine', sub: 'The compounding dataset that improves with every activation', featured: true },
              { path: '/universal-connector', icon: Globe, label: 'Universal Connector', sub: 'Any stack. 55+ pre-built connectors. Live in 15 minutes.', featured: true },
              { path: '/technical-onboarding', icon: Rocket, label: 'Integration Setup Plan', sub: 'Phased technical guide — identity, signals, execution, Microsoft stack', featured: true },
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
            {megaColHeading("Intelligence Engine")}
            {[
              { path: '/predictive-intelligence', icon: Target, label: 'Predictive Signal Intelligence', sub: 'Pattern clusters — pre-stage protocols before the trigger fires', featured: true },
              { path: '/tendency-intelligence', icon: BarChart3, label: 'Organizational Tendency Intelligence', sub: 'Your organization measured against itself', featured: true },
              { path: '/sector-intelligence', icon: Globe, label: 'Sector Intelligence Library', sub: 'How 203 organizations in your sector have responded', featured: true },
            ].map(l => megaItem(l))}
            <div style={{ margin: '6px 0 5px', height: 1, background: 'rgba(10,15,46,0.09)' }} />
            {megaColHeading("Execute Phase Tools")}
            {[
              { path: '/command-tower', icon: Radio, label: 'Command Tower', sub: 'Executive wall display — auto-refreshing live feed for conference rooms', featured: true },
              { path: '/concurrent-situations', icon: LayoutGrid, label: 'Concurrent Situation Board', sub: 'Command view — multiple situations at once' },
              { path: '/crisis-communications', icon: MessageSquare, label: 'Crisis Communications', sub: '5 audience-specific messages in 18 seconds' },
              { path: '/financial-exposure', icon: DollarSign, label: 'Financial Exposure Estimator', sub: 'Instant dollar-range exposure when a situation presents itself' },
            ].map(l => megaItem(l))}
            <div style={{ margin: '6px 0 5px', height: 1, background: 'rgba(10,15,46,0.09)' }} />
            {megaColHeading("Grow With VaughnMartin")}
            {[
              { path: '/founding-partner-tour', icon: Play, label: 'Founding Partner Tour — Start Here', sub: '5-chapter guided journey — what it feels like, what you get, and how to apply', featured: true },
              { path: '/channel-partners', icon: Users, label: 'Channel Partner Program', sub: 'Consulting firms, SIs & advisory practices — deliver 12-minute execution to your enterprise clients', featured: true },
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
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', margin: '0 0 3px' }}>Research-Backed · Independently Validated</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>McKinsey · Gartner · IBM · PwC · Forrester</p>
          </div>
          <div style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 0, padding: '5px 12px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: GOLD, margin: 0, lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>3,600×</p>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(201,168,76,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '2px 0 0' }}>Execution Head Start</p>
          </div>
        </div>

        {/* Two columns — Tools first (what a prospect acts on), Case second (validation) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ padding: '16px 14px 16px 18px', borderRight: '1px solid rgba(10,15,46,0.07)' }}>
            {megaColHeading("Tools & Calculators")}
            {[
              { path: '/the-gap', icon: Grid3X3, label: 'The Gap — Live Cost + 12-Gap Matrix', sub: 'Real-time mobilization cost counter + full competitor gap matrix in one view', featured: true },
              { path: '/the-cost-of-waiting', icon: DollarSign, label: 'The Cost of Waiting', sub: 'Live dual counter + 6-situation timelines — see exactly what not being ready is costing', featured: true },
              { path: '/cost-of-delay', icon: DollarSign, label: 'Cost of Delay', sub: 'Real-time counter — what your mobilization gap costs while you evaluate', featured: true },
              { path: '/sector-briefing', icon: AlertTriangle, label: 'Sector Threat Briefing', sub: 'Live signals in your sector right now. Protocols already staged.', featured: true },
              { path: '/roi-calculator', icon: Calculator, label: 'ROI Calculator', sub: 'See the competitive window you\'re leaving open', featured: true },
              { path: '/readiness-assessment', icon: ClipboardCheck, label: 'Readiness Score', sub: 'Score your org\'s execution readiness across all 9 domains' },
              { path: '/growth', icon: TrendingUp, label: 'Pricing & Plans', sub: 'Core · Foresight · Enterprise — transparent value-based pricing', featured: true },
              { path: '/customer-journey', icon: Users, label: 'Customer Journey', sub: 'See how enterprise teams onboard & scale' },
            ].map(l => megaItem(l))}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(10,15,46,0.08)' }}>
              <div
                onClick={() => navigateTo('/12-minute-experience')}
                style={{ background: NAVY, borderRadius: 0, padding: '10px 14px', cursor: 'pointer', transition: 'background 0.12s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#141B45'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = NAVY; }}
              >
                <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 2px' }}>See It In Action</p>
                <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.4 }}>Run the 12-Minute Test Drive — no login required →</p>
              </div>
            </div>
          </div>
          <div style={{ padding: '16px 18px 16px 14px', background: 'rgba(248,247,244,0.55)' }}>
            {megaColHeading("The Case for Readiness OS")}
            {[
              { path: '/mobilization-gap', icon: Grid3X3, label: 'The 12-Gap Matrix', sub: '9 competitor categories. 12 mobilization gaps. Zero alternatives that close all 12.', featured: true },
              { path: '/the-case', icon: Scale, label: 'The Case', sub: 'The complete buying argument — problem cost → proof → moat → ROI → decision', featured: true },
              { path: '/the-proof', icon: Scale, label: 'Why Readiness OS?', sub: 'vs. Copilot, ServiceNow, Palantir, Everbridge — the honest answer', featured: true },
              { path: '/executive-brief', icon: FileText, label: 'Executive Brief', sub: 'Board-ready one-pager — thesis, 3,600× metric, ROI case', featured: true },
              { path: '/founding-partner-brief', icon: FileText, label: 'Founding Partner Brief', sub: 'What you get in 90 days — milestones, deliverables, proof points', featured: true },
              { path: '/research', icon: FileText, label: 'Research & Validation', sub: 'McKinsey, Gartner, IBM, PwC — the evidence behind Readiness OS' },
              { path: '/mobilization-cost', icon: DollarSign, label: 'What One Trigger Costs', sub: 'Ransomware $4.5M · Activist $3.2M · Regulatory $5.8M — before any platform conversation', featured: true },
              { path: '/proof-story', icon: Scale, label: 'Proof Story', sub: 'Same trigger. Two organizations. The only variable: whether the response was pre-staged.', featured: true },
              { path: '/competitive-positioning', icon: BarChart3, label: 'Competitive Landscape', sub: 'Category of one — the coordination layer every alternative assumes already exists.' },
              { path: '/security-compliance', icon: Shield, label: 'Security & Compliance', sub: 'Procurement-ready — auth, data governance, compliance readiness, AI safety controls' },
              { path: '/vs-consulting', icon: Scale, label: 'Why Not Consulting?', sub: 'McKinsey charges $300K–$500K for PDFs. We deliver execution.' },
              { path: '/vs-bcp', icon: Scale, label: 'Readiness OS vs. BCP', sub: 'Your BCP covers catastrophe. We cover the triggers that happen every year.' },
            ].map(l => megaItem(l))}
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
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', margin: '0 0 3px' }}>Pre-Seed · Category-Defining Infrastructure</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: GOLD, margin: 0, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>The Readiness Infrastructure Enterprises Are Missing</p>
          </div>
        </div>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ padding: '16px 14px 16px 18px', borderRight: '1px solid rgba(10,15,46,0.07)' }}>
            {megaColHeading("Investor Materials")}
            {[
              { path: '/investor-tour', icon: Play, label: 'Investor Tour — Start Here', sub: 'The complete investment thesis in 5 guided chapters — problem, platform, proof, opportunity, ask', featured: true },
              { path: '/investor-resources', icon: FileText, label: 'Investor Resources', sub: 'Full materials — frameworks, thesis & deck', featured: true },
              { path: '/capabilities', icon: Layers, label: 'Platform Capabilities', sub: 'Every capability across the full decision lifecycle — product depth for buyers & investors' },
              { path: '/investors', icon: TrendingUp, label: 'Investment Thesis', sub: 'Market opportunity, research validation & ROI case' },
              { path: '/pitch-deck', icon: Presentation, label: 'Pitch Deck', sub: 'Pre-seed investor presentation' },
            ].map(l => megaItem(l))}
          </div>
          <div style={{ padding: '16px 18px 16px 14px', background: 'rgba(248,247,244,0.55)' }}>
            {megaColHeading("Company")}
            {[
              { path: '/about', icon: Users, label: 'About the Founder', sub: 'Martin Brunke — background, credentials & origin story', featured: true },
              { path: '/team', icon: Users, label: 'Team', sub: 'Founder, research partners, open roles' },
              { path: '/founder-story', icon: Video, label: "Founder's Story", sub: 'The vision behind Readiness OS' },
              { path: '/board-briefings', icon: FileText, label: 'Board Briefings', sub: 'Executive-ready board reporting' },
            ].map(l => megaItem(l))}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(10,15,46,0.08)' }}>
              <div
                onClick={() => navigateTo('/founding-partner')}
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
                <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 2px' }}>Request Founding Partner Access</p>
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
        path: '/demo-experience',
        icon: Play,
        label: 'Full Platform Demo — Complete Walkthrough',
        sub: 'The full journey: cold open → PREPARATION → RESPONSE (with live contrast vs. 30-day traditional) → ADVANCE. 9 steps. No login required.',
        featured: true,
      },
      {
        path: '/entry',
        icon: Rocket,
        label: 'New Here? Start Here',
        sub: 'First visit? Get oriented in 60 seconds — pick your path: Enterprise Executive or Investor.',
        featured: true,
      },
      {
        path: '/demo-hub',
        icon: LayoutGrid,
        label: 'Full Scenario Experience Center',
        sub: '12 complete simulations — pick your industry or role. Ransomware · FDA Recall · Activist Investor · DOJ Investigation · Data Breach · Grid Failure · and more.',
        featured: true,
      },
      {
        path: '/master-demo',
        icon: Play,
        label: 'Master Demo — Activist Investor',
        sub: 'Elliott Management files 13D at 2:47 AM. The definitive 7-step walkthrough: signals → protocol → war room → CEO authorizes → 12 minutes complete.',
        featured: true,
      },
      {
        path: '/12-minute-experience',
        icon: Rocket,
        label: '12-Minute Test Drive',
        sub: 'A situation presents itself. Your C-suite mobilizes in 12 minutes — watch every role, every task, live. No login required.',
        featured: true,
      },
    ];
    const deeperDemos = [
      { path: '/demo/market-entry', icon: TrendingUp, label: 'Growth — Competitor Displacement Sprint', sub: 'LegacyPoint files Chapter 11. 1,400 enterprise accounts in-play. Salesforce deploys overnight. 72-hour window.', domain: 'GROWTH' },
      { path: '/demo/acquisition', icon: Target, label: 'Growth — M&A Rapid Response', sub: 'Waypoint Analytics authorizes a sale. Three buyers in conversations. LOI required in 48 hours.', domain: 'GROWTH' },
      { path: '/demo/product-launch', icon: Rocket, label: 'Transformation — Go-to-Market Acceleration', sub: 'Cascade announces June 30 launch. Board authorizes 6-week pull-forward. GTM mobilizes in 12 minutes.', domain: 'TRANSFORMATION' },
      { path: '/demo/workforce', icon: Users, label: 'Transformation — Workforce Realignment', sub: 'Board approves system-staged realignment — 6,720 roles, 12 countries. WARN Act. Must begin in 48 hours.', domain: 'TRANSFORMATION' },
      { path: '/demo/ransomware', icon: Zap, label: 'Risk — Financial Services Ransomware', sub: 'Trading systems encrypted at 4:23 AM. SWIFT offline. Market open in 4 hours.', domain: 'RISK' },
      { path: '/demo/pharma', icon: AlertCircle, label: 'Risk — Pharma FDA Class I Recall', sub: 'Contaminated batch. 340,000 units distributed. 72-hour regulatory window.', domain: 'RISK' },
      { path: '/demo/supply-chain', icon: Globe, label: 'Risk — Manufacturing Supplier Failure', sub: 'Primary supplier files Chapter 11. 60% of Q3 production at risk overnight.', domain: 'RISK' },
      { path: '/manufacturing-supplier-demo', icon: Globe, label: 'Industrial HVACR — Supplier Force Majeure', sub: 'Primary compressor supplier declares force majeure. 14 facilities exposed at peak season. CFO + COO authorization in 12 minutes.', domain: 'RISK' },
      { path: '/demo/energy', icon: Zap, label: 'Risk — Energy Grid Failure', sub: 'Substation offline. 280K customers. NERC CIP clock started at 3:15 AM.', domain: 'RISK' },
      { path: '/demo/food-safety', icon: AlertCircle, label: 'Risk — Retail Food Safety Crisis', sub: 'E.coli outbreak. 3 hospitalized. CNN has 45 minutes.', domain: 'RISK' },
      { path: '/demo/data-breach', icon: Target, label: 'Risk — Technology Data Breach', sub: '2.3M customer records on dark web. GDPR 72-hour notification clock running.', domain: 'RISK' },
      { path: '/demo/regulatory', icon: Scale, label: 'Risk — General Counsel DOJ Investigation', sub: 'Civil Investigative Demand received. Litigation hold must issue today.', domain: 'RISK' },
    ];
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="px-3 py-2 text-sm font-bold transition-all duration-150 flex items-center gap-1.5"
            style={{
              color: GOLD,
              background: 'rgba(201,168,76,0.10)',
              border: '1px solid rgba(201,168,76,0.28)',
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
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', margin: '0 0 2px' }}>Traditional Enterprise</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#f87171', margin: 0, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>30 days to mobilize</p>
              </div>
              <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.68)', padding: '0 4px' }}>→</div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', margin: '0 0 2px' }}>Readiness OS</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: 0, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>12 minutes to execution</p>
              </div>
            </div>
            <div style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 0, padding: '5px 12px', textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: GOLD, margin: 0, lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>3,600×</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(201,168,76,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '2px 0 0' }}>Execution Head Start</p>
            </div>
          </div>

          {/* Two-column content area */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {/* Left column: primary demo paths */}
            <div style={{ padding: '18px 14px 18px 18px', borderRight: '1px solid rgba(10,15,46,0.07)' }}>
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, margin: '0 0 12px 2px' }}>Live Demos — No Login Required</p>
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
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 12px 2px' }}>Go Deeper</p>
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
                  onClick={() => navigateTo('/founding-partner')}
                  style={{ background: NAVY, borderRadius: 0, padding: '11px 14px', cursor: 'pointer', transition: 'background 0.12s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#141B45'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = NAVY; }}
                >
                  <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 3px' }}>Ready to Run It Inside Your Org?</p>
                  <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.4 }}>Apply for Founding Partner Access →</p>
                </div>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // ── PRODUCT NAV (authenticated users only) ──────────────────────────────────
  const renderProductNavCenter = () => {
    const navBtn = (label: string, path: string, matchPaths?: string[]): React.ReactElement => {
      const active = matchPaths
        ? matchPaths.some(p => location.startsWith(p))
        : location.startsWith(path);
      return (
        <button
          key={path}
          onClick={() => navigateTo(path)}
          style={{
            padding: '7px 12px',
            fontSize: 13,
            fontWeight: 700,
            color: active ? TEAL : NAVY,
            background: active ? 'rgba(43,138,110,0.07)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap' as const,
            transition: 'background 0.12s, color 0.12s',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(10,15,46,0.05)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = active ? 'rgba(43,138,110,0.07)' : 'transparent'; }}
        >
          {label}
        </button>
      );
    };

    const workspaceLinks = [
      { path: '/workspace', icon: Target, label: 'Identify', sub: 'Situation intents, protocols, risk mapping' },
      { path: '/signal-intelligence', icon: Radar, label: 'Detect', sub: 'Signal monitoring across 231 detection thresholds' },
      { path: '/live-activation-center', icon: Zap, label: 'Execute', sub: 'Activate, coordinate, authorize' },
      { path: '/advanced-analytics', icon: BarChart3, label: 'Advance', sub: 'Analytics, outcomes, board reporting' },
    ];
    const workspaceActive = ['/workspace', '/identify', '/signal-intelligence', '/live-activation', '/advanced-analytics', '/execution-history'].some(p => location.startsWith(p));

    return (
      <>
        {navBtn('Mission Control', '/mission-control')}

        {/* Workspace dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              style={{
                padding: '7px 12px',
                fontSize: 13,
                fontWeight: 700,
                color: workspaceActive ? TEAL : NAVY,
                background: workspaceActive ? 'rgba(43,138,110,0.07)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap' as const,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(10,15,46,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = workspaceActive ? 'rgba(43,138,110,0.07)' : 'transparent'; }}
            >
              Workspace <ChevronDown style={{ width: 12, height: 12, opacity: 0.5 }} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" style={{ width: 280, border: `1px solid rgba(10,15,46,0.1)`, borderRadius: 0, padding: '8px 0' }}>
            <DropdownMenuLabel style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9CA3AF', padding: '2px 14px 8px' }}>IDEA Framework</DropdownMenuLabel>
            {workspaceLinks.map(({ path, icon: Icon, label, sub }) => (
              <DropdownMenuItem
                key={path}
                onClick={() => navigateTo(path)}
                className="cursor-pointer"
                style={{ padding: '8px 14px', gap: 10, display: 'flex', alignItems: 'flex-start' }}
              >
                <div style={{ width: 28, height: 28, background: 'rgba(43,138,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={13} style={{ color: TEAL }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{label}</div>
                  <div style={{ fontSize: 10, color: '#6B7280', marginTop: 1 }}>{sub}</div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {navBtn('Protocols', '/playbooks', ['/playbooks', '/identify/playbooks'])}
        {navBtn('Signals', '/triggers-management', ['/triggers-management', '/signal-intelligence'])}
        {navBtn('Execute', '/live-activation-center', ['/live-activation-center', '/strategic-monitoring', '/war-room'])}
        {navBtn('Reports', '/advanced-analytics', ['/advanced-analytics', '/execution-history', '/board-readiness'])}

        {/* Get Started — highlighted gold */}
        <button
          onClick={() => navigateTo('/getting-started')}
          style={{
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 700,
            color: GOLD,
            background: location.startsWith('/getting-started') ? 'rgba(201,168,76,0.1)' : 'transparent',
            border: `1px solid rgba(201,168,76,0.35)`,
            cursor: 'pointer',
            whiteSpace: 'nowrap' as const,
            marginLeft: 6,
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.12)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = location.startsWith('/getting-started') ? 'rgba(201,168,76,0.1)' : 'transparent'; }}
        >
          <Rocket size={11} />
          Get Started
        </button>
      </>
    );
  };

  const tickerItems = [
    { text: "THE RESPONSE IS READY BEFORE THE TRIGGER FIRES", color: GOLD },
    { text: "180 READINESS PROTOCOLS · STAGED AND READY", color: "rgba(255,255,255,0.55)" },
    { text: "3,600× EXECUTION HEAD START · 30 DAYS COMPRESSED TO 12 MINUTES", color: GOLD },
    { text: "231 detection thresholds MONITORED · CONTINUOUSLY", color: "rgba(255,255,255,0.55)" },
    { text: "FOUNDING PARTNER PROGRAM · 90-DAY VALIDATION PARTNERSHIP", color: TEAL },
    { text: "WE REDESIGN HOW WORK FLOWS IN THE AGE OF AI", color: GOLD },
    { text: "AI MONITORS · EXECUTIVES AUTHORIZE · EXECUTION PRE-STAGED", color: "rgba(255,255,255,0.55)" },
  ];

  return (
    <>
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 w-full"
      style={{
        zIndex: 9999,
        background: NAVY,
        borderBottom: `2px solid ${GOLD}`,
        boxShadow: '0 4px 32px rgba(0,0,0,0.55)',
        color: 'white',
      }}
    >
      {/* Gold-to-teal accent line — 3px */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${GOLD} 0%, ${TEAL} 45%, ${NAVY} 55%, ${TEAL} 65%, ${GOLD} 100%)` }} />

      {/* ── GTM Proof-Point Ticker Strip ── */}
      <div
        className="vm-ticker-track hidden lg:block"
        style={{
          background: 'rgba(0,0,0,0.38)',
          borderBottom: '1px solid rgba(201,168,76,0.10)',
          height: 28,
          cursor: 'default',
        }}
      >
        <div className="vm-ticker-inner" style={{ height: 28 }}>
          {/* Doubled for seamless loop */}
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', height: 28 }}>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: item.color,
                  padding: '0 28px',
                }}
              >
                {item.text}
              </span>
              <span style={{ color: GOLD, opacity: 0.4, fontSize: 8, flexShrink: 0 }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between" style={{ height: navLogoHeight }}>

          {/* Left: Logo + Live System indicator */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => navigateTo('/')}
              data-testid="nav-logo"
            >
              <ExecuteIQLogo height={navLogoHeight} variant="full" color="white" animated={true} />
            </div>
            {/* Live system badge */}
            <div
              className="hidden xl:flex items-center gap-1.5"
              style={{
                background: 'rgba(43,138,110,0.12)',
                border: '1px solid rgba(43,138,110,0.25)',
                borderRadius: '0.15rem',
                padding: '2px 7px',
              }}
            >
              <span
                className="live-dot-beat"
                style={{ width: 6, height: 6, borderRadius: '50%', background: TEAL, display: 'block', flexShrink: 0 }}
              />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: TEAL, fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase' }}>
                System Active
              </span>
            </div>
          </div>

          {/* Center: Nav Links — split by auth state */}
          <div className="hidden lg:flex items-center gap-0.5">
            {isAuthenticated && user ? renderProductNavCenter() : (
              <>
                {/* Clean hub links — flat buttons except "The Proof" which uses the mega-menu */}
                {[
                  { label: 'How It Works', path: '/how-it-works' },
                  { label: 'Situations', path: '/situations-hub' },
                  { label: 'See It Work', path: '/demo-hub' },
                ].map(item => (
                  <button
                    key={item.path}
                    onClick={() => navigateTo(item.path)}
                    className="px-3 py-2 text-sm font-semibold transition-all duration-150"
                    style={{ color: 'rgba(255,255,255,0.82)', background: 'transparent', whiteSpace: 'nowrap', border: 'none' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.07)'; el.style.color = '#fff'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'rgba(255,255,255,0.82)'; }}
                  >
                    {item.label}
                  </button>
                ))}
                {/* "The Proof" — mega-menu with 12-Gap Matrix, Cost of Delay, ROI Calculator, etc. */}
                {renderEvidenceDropdown()}
                {[
                  { label: 'Partners', path: '/channel-partners' },
                  { label: 'Pricing', path: '/pricing' },
                ].map(item => (
                  <button
                    key={item.path}
                    onClick={() => navigateTo(item.path)}
                    className="px-3 py-2 text-sm font-semibold transition-all duration-150"
                    style={{ color: 'rgba(255,255,255,0.82)', background: 'transparent', whiteSpace: 'nowrap', border: 'none' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.07)'; el.style.color = '#fff'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'rgba(255,255,255,0.82)'; }}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Right: CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Back button — only on inner pages, right-side so logo stays anchored */}
            {!isHomePage && (
              <button
                onClick={handleBack}
                className="h-9 w-9 flex items-center justify-center transition-all"
                style={{ color: 'rgba(255,255,255,0.55)', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.07)'; el.style.color = '#fff'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'rgba(255,255,255,0.55)'; }}
                data-testid="nav-back-button"
                title="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            {/* Global Search Button */}
            <button
              onClick={() => { setSearchOpen(o => !o); setSearchQuery(''); }}
              className="h-9 w-9 flex items-center justify-center transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.55)', background: searchOpen ? 'rgba(255,255,255,0.07)' : 'transparent' }}
              title="Search platform (⌘K)"
            >
              <Search className="h-4 w-4" />
            </button>
            {isLoading ? (
              <div className="h-9 w-48 bg-gray-100 animate-pulse" />
            ) : isAuthenticated && user ? (
              <>
                {/* Uncharted Trigger — Protocol #0 manual launch */}
                <button
                  onClick={() => navigateTo("/protocol-zero-launch")}
                  className="h-9 px-3 text-sm font-bold flex items-center gap-1.5"
                  style={{ background: 'rgba(43,138,110,0.12)', border: '1px solid rgba(43,138,110,0.32)', color: TEAL, borderRadius: '0.15rem', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(43,138,110,0.22)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(43,138,110,0.12)'; }}
                  title="Manually activate Protocol #0 — Universal Response for any unknown situation"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span className="hidden 2xl:inline">Uncharted Trigger</span>
                </button>
                <Button
                  onClick={() => navigateTo("/mission-control")}
                  className="h-9 px-3 xl:px-4 text-sm font-bold text-white flex items-center gap-1.5"
                  style={{ background: `linear-gradient(135deg, ${TEAL}, #3BAF8A)`, border: 'none' }}
                  data-testid="nav-open-platform"
                  title="Open Platform"
                >
                  <Compass className="h-4 w-4" />
                  <span className="hidden xl:inline">Open Platform</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-3 py-1.5 h-9"
                      style={{ color: 'rgba(255,255,255,0.75)' }}
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
                    <DropdownMenuItem onClick={() => navigateTo("/getting-started")} className="cursor-pointer" style={{ color: GOLD, fontWeight: 700 }}>
                      <Rocket className="h-4 w-4 mr-2" style={{ color: GOLD }} />
                      Get Started
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateTo("/user-guide")} className="cursor-pointer" style={{ color: NAVY }}>
                      <BookOpen className="h-4 w-4 mr-2 opacity-50" />
                      User Guide
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
                    {(user.isPlatformAdmin || user.role === 'admin') && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs font-normal" style={{ color: '#9CA3AF', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Platform Admin</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigateTo("/admin/users")} className="cursor-pointer" style={{ color: NAVY }}>
                          <Shield className="h-4 w-4 mr-2 opacity-50" />
                          User Management
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigateTo("/admin/customer-health")} className="cursor-pointer" style={{ color: NAVY }}>
                          <BarChart3 className="h-4 w-4 mr-2 opacity-50" />
                          Platform Health
                        </DropdownMenuItem>
                      </>
                    )}
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
                {/* Benchmark — gold accent link */}
                <button
                  onClick={() => navigateTo('/readiness-benchmark')}
                  className="h-9 px-3 text-sm font-semibold flex items-center gap-1.5 transition-all"
                  style={{ color: GOLD, background: 'rgba(201,168,76,0.10)', border: '1px solid rgba(201,168,76,0.28)', borderRadius: '0.15rem', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(201,168,76,0.18)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(201,168,76,0.10)'; }}
                >
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  Benchmark
                </button>
                <Button
                  onClick={() => navigateTo("/founding-partner")}
                  className="gold-cta-pulse h-9 px-4 text-sm font-bold"
                  style={{ background: GOLD, color: NAVY, border: "none", borderRadius: '0.15rem' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#DFC178'; el.style.animationPlayState = 'paused'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = GOLD; el.style.animationPlayState = 'running'; }}
                  data-testid="nav-request-access"
                >
                  <span className="hidden 2xl:inline">Apply for </span>Founding Partner Access
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => loginWithMicrosoft()}
                  className="h-9 px-3 text-sm font-medium flex items-center gap-1.5"
                  style={{ color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.2)' }}
                  data-testid="nav-login-microsoft"
                >
                  <MicrosoftIcon size={14} />
                  <span>Sign in with Microsoft</span>
                </Button>
              </>
            )}
          </div>

          {/* Mobile: open platform + hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            {isAuthenticated && user && (
              <Button
                onClick={() => navigateTo("/mission-control")}
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
              style={{ color: 'white' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
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
                    onClick={() => navigateTo("/mission-control")}
                    className="w-full justify-center h-12 text-base font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${TEAL}, #3BAF8A)` }}
                    data-testid="nav-mobile-open-platform"
                  >
                    <Compass className="h-5 w-5 mr-2" />
                    Open Platform
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigateTo("/12-minute-experience")}
                      variant="outline"
                      className="flex-1 justify-center h-10 text-sm font-semibold"
                      style={{ border: `1px solid rgba(10,15,46,0.2)`, color: NAVY }}
                      data-testid="nav-mobile-try-demo"
                    >
                      12-Minute Test Drive
                    </Button>
                    <Button
                      onClick={() => navigateTo("/request-access")}
                      className="flex-1 justify-center h-10 text-sm font-bold"
                      style={{ background: GOLD, color: NAVY }}
                      data-testid="nav-mobile-request-pilot"
                    >
                      Apply for Founding Partner Access
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-1">
                  <Button
                    onClick={() => navigateTo("/demo-experience")}
                    className="w-full justify-center h-12 text-sm font-bold"
                    style={{ background: 'rgba(201,168,76,0.12)', border: `1px solid rgba(201,168,76,0.4)`, color: GOLD }}
                    data-testid="nav-mobile-full-demo"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Watch the Full Platform Demo
                  </Button>
                  <Button
                    onClick={() => navigateTo("/request-access")}
                    variant="outline"
                    className="w-full justify-center h-11 text-sm font-semibold"
                    style={{ border: `1px solid rgba(10,15,46,0.2)`, color: NAVY }}
                    data-testid="nav-mobile-try-demo"
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Apply for Founding Partner Access
                  </Button>
                  <Button
                    onClick={() => navigateTo("/founding-partner")}
                    className="w-full justify-center h-11 text-sm font-bold"
                    style={{ background: GOLD, color: NAVY }}
                    data-testid="nav-mobile-request-pilot"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Request Founding Partner Access
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => loginWithMicrosoft()}
                    className="w-full justify-center h-9 text-sm flex items-center gap-1.5"
                    style={{ color: NAVY }}
                    data-testid="nav-mobile-login-microsoft"
                  >
                    <MicrosoftIcon size={14} />
                    <span>Sign in with Microsoft</span>
                  </Button>
                </div>
              )}

              <div style={{ borderTop: `1px solid rgba(201,168,76,0.1)`, margin: '12px 0' }} />

              {isAuthenticated && user ? (
                /* ── Authenticated: full platform sections ── */
                <>
                  {platformSections.map((section) => (
                    <div key={section.heading}>
                      <p className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: GOLD }}>{section.heading}</p>
                      {section.links.map((link) => (
                        <button
                          key={link.path + link.label}
                          onClick={() => { navigateTo(link.path); setMobileMenuOpen(false); }}
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
                          onClick={() => { navigateTo(link.path); setMobileMenuOpen(false); }}
                          className="w-full text-left py-2.5 px-4 transition-colors flex items-center gap-3"
                          style={{ color: '#374151', fontWeight: 500 }}
                        >
                          <link.icon className="h-4 w-4" style={{ color: GOLD }} />
                          {link.label}
                        </button>
                      ))}
                    </div>
                  ))}
                </>
              ) : (
                /* ── Guest: same 6 sections as the desktop nav ── */
                <>
                  {/* HOW IT WORKS */}
                  <p className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: GOLD }}>How It Works</p>
                  {[
                    { path: '/how-it-works', label: 'How It Works', icon: Play },
                    { path: '/how-it-executes', label: 'How It Executes', icon: Zap },
                  ].map(link => (
                    <button key={link.path} onClick={() => { navigateTo(link.path); setMobileMenuOpen(false); }}
                      className="w-full text-left py-2.5 px-4 flex items-center gap-3" style={{ color: '#374151', fontWeight: 500 }}>
                      <link.icon className="h-4 w-4" style={{ color: TEAL }} />{link.label}
                    </button>
                  ))}

                  <div style={{ borderTop: `1px solid rgba(201,168,76,0.1)`, margin: '8px 0' }} />

                  {/* SITUATIONS */}
                  <p className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: GOLD }}>Situations</p>
                  {[
                    { path: '/situations-hub', label: '9-Domain Coverage Board', icon: Shield },
                    { path: '/12-minute-experience', label: '12-Minute Test Drive', icon: Rocket },
                  ].map(link => (
                    <button key={link.path} onClick={() => { navigateTo(link.path); setMobileMenuOpen(false); }}
                      className="w-full text-left py-2.5 px-4 flex items-center gap-3" style={{ color: '#374151', fontWeight: 500 }}>
                      <link.icon className="h-4 w-4" style={{ color: TEAL }} />{link.label}
                    </button>
                  ))}

                  <div style={{ borderTop: `1px solid rgba(201,168,76,0.1)`, margin: '8px 0' }} />

                  {/* SEE IT WORK */}
                  <p className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: GOLD }}>See It Work</p>
                  {[
                    { path: '/demo-hub', label: 'Full Scenario Center', icon: LayoutGrid },
                    { path: '/master-demo', label: 'Master Demo — Activist Investor', icon: Play },
                    { path: '/industry-demo-library', label: 'Industry Demo Library', icon: Globe },
                  ].map(link => (
                    <button key={link.path} onClick={() => { navigateTo(link.path); setMobileMenuOpen(false); }}
                      className="w-full text-left py-2.5 px-4 flex items-center gap-3" style={{ color: '#374151', fontWeight: 500 }}>
                      <link.icon className="h-4 w-4" style={{ color: GOLD }} />{link.label}
                    </button>
                  ))}

                  <div style={{ borderTop: `1px solid rgba(201,168,76,0.1)`, margin: '8px 0' }} />

                  {/* THE PROOF — same items as the desktop mega-menu */}
                  <p className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: TEAL }}>The Proof</p>
                  <p className="px-4 pb-1 text-[10px] uppercase tracking-widest font-bold" style={{ color: 'rgba(10,15,46,0.35)', letterSpacing: '0.12em' }}>Tools & Calculators</p>
                  {[
                    { path: '/the-gap', label: 'The Gap — Live Cost + 12-Gap Matrix', icon: Grid3X3 },
                    { path: '/the-cost-of-waiting', label: 'The Cost of Waiting', icon: DollarSign },
                    { path: '/cost-of-delay', label: 'Cost of Delay', icon: DollarSign },
                    { path: '/sector-briefing', label: 'Sector Threat Briefing', icon: AlertTriangle },
                    { path: '/roi-calculator', label: 'ROI Calculator', icon: Calculator },
                    { path: '/readiness-assessment', label: 'Readiness Score', icon: ClipboardCheck },
                    { path: '/pricing', label: 'Pricing & Plans', icon: TrendingUp },
                    { path: '/customer-journey', label: 'Customer Journey', icon: Users },
                  ].map(link => (
                    <button key={link.path} onClick={() => { navigateTo(link.path); setMobileMenuOpen(false); }}
                      className="w-full text-left py-2.5 px-4 flex items-center gap-3" style={{ color: '#374151', fontWeight: 500 }}>
                      <link.icon className="h-4 w-4" style={{ color: TEAL }} />{link.label}
                    </button>
                  ))}
                  <p className="px-4 pt-2 pb-1 text-[10px] uppercase tracking-widest font-bold" style={{ color: 'rgba(10,15,46,0.35)', letterSpacing: '0.12em' }}>The Case for Readiness OS</p>
                  {[
                    { path: '/mobilization-gap', label: 'The 12-Gap Matrix', icon: Grid3X3 },
                    { path: '/the-case', label: 'The Case', icon: Scale },
                    { path: '/the-proof', label: 'Why Readiness OS?', icon: Shield },
                    { path: '/executive-brief', label: 'Executive Brief', icon: FileText },
                    { path: '/founding-partner-brief', label: 'Founding Partner Brief', icon: FileText },
                    { path: '/research', label: 'Research & Validation', icon: FileText },
                    { path: '/mobilization-cost', label: 'What One Trigger Costs', icon: DollarSign },
                    { path: '/proof-story', label: 'Proof Story', icon: Scale },
                    { path: '/competitive-positioning', label: 'Competitive Landscape', icon: BarChart3 },
                    { path: '/security-compliance', label: 'Security & Compliance', icon: Shield },
                    { path: '/vs-consulting', label: 'Why Not Consulting?', icon: Scale },
                    { path: '/vs-bcp', label: 'Readiness OS vs. BCP', icon: Scale },
                  ].map(link => (
                    <button key={link.path} onClick={() => { navigateTo(link.path); setMobileMenuOpen(false); }}
                      className="w-full text-left py-2.5 px-4 flex items-center gap-3" style={{ color: '#374151', fontWeight: 500 }}>
                      <link.icon className="h-4 w-4" style={{ color: TEAL }} />{link.label}
                    </button>
                  ))}

                  <div style={{ borderTop: `1px solid rgba(201,168,76,0.1)`, margin: '8px 0' }} />

                  {/* PARTNERS */}
                  <p className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: GOLD }}>Partners</p>
                  {[
                    { path: '/channel-partners', label: 'Channel Partners', icon: Users },
                    { path: '/investors', label: 'Investor Resources', icon: TrendingUp },
                  ].map(link => (
                    <button key={link.path} onClick={() => { navigateTo(link.path); setMobileMenuOpen(false); }}
                      className="w-full text-left py-2.5 px-4 flex items-center gap-3" style={{ color: '#374151', fontWeight: 500 }}>
                      <link.icon className="h-4 w-4" style={{ color: GOLD }} />{link.label}
                    </button>
                  ))}

                  <div style={{ borderTop: `1px solid rgba(201,168,76,0.1)`, margin: '8px 0' }} />

                  {/* PRICING */}
                  <p className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: GOLD }}>Pricing</p>
                  {[
                    { path: '/pricing', label: 'Pricing & Plans', icon: TrendingUp },
                    { path: '/growth', label: 'Core · Foresight · Enterprise', icon: BarChart3 },
                  ].map(link => (
                    <button key={link.path} onClick={() => { navigateTo(link.path); setMobileMenuOpen(false); }}
                      className="w-full text-left py-2.5 px-4 flex items-center gap-3" style={{ color: '#374151', fontWeight: 500 }}>
                      <link.icon className="h-4 w-4" style={{ color: GOLD }} />{link.label}
                    </button>
                  ))}
                </>
              )}

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
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#3BAF8A' }}>Monitoring Active</span>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(240,237,228,0.35)', letterSpacing: '0.08em' }}>248+ Data Points</span>
                <span style={{ fontSize: 11, color: 'rgba(240,237,228,0.35)', letterSpacing: '0.08em' }}>231 detection thresholds Active</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Radio style={{ width: 8, height: 8, color: 'rgba(201,168,76,0.45)' }} />
                <span style={{ fontSize: 11, color: 'rgba(240,237,228,0.3)', letterSpacing: '0.08em' }}>Scanning every 15 min</span>
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
                  placeholder="Search pages, Readiness Protocols, actions…"
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
                      <div style={{ padding: '10px 18px 4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C' }}>{cat}</div>
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
    <div aria-hidden="true" style={{ height: navHeight, flexShrink: 0 }} />
    </>
  );
}
