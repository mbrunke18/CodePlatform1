import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, User, ChevronDown, BarChart3, TrendingUp, Zap, ClipboardList, Radar, Compass, Globe, Users, Calculator, Shield, Layers, ArrowLeft, Brain, Target, Lightbulb, BookOpen, FileText, Settings, Building, Presentation, Video, Eye, Rocket, AlertCircle, ClipboardCheck, FlaskConical, Radio, Play, Search, Activity, Scale } from "lucide-react";
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
  const [h, setH] = useState(130);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setH(w >= 1920 ? 180 : w >= 1440 ? 160 : 130);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return h;
}

const SEARCH_ITEMS = [
  { label: 'Command Center', path: '/command-center', category: 'Platform', icon: Compass },
  { label: 'Execution Workspace', path: '/workspace', category: 'Platform', icon: Layers },
  { label: 'Intelligence Control Center', path: '/intelligence-hub', category: 'Platform', icon: Brain },
  { label: 'AI Intelligence Hub', path: '/ai-intelligence', category: 'Platform', icon: Brain },
  { label: 'Settings Hub', path: '/settings-hub', category: 'Platform', icon: Settings },
  { label: 'Organization Setup', path: '/organization-setup', category: 'Platform', icon: Building },
  { label: 'Playbook Library', path: '/playbooks', category: 'Identify', icon: BookOpen },
  { label: 'Strategic Planning Hub', path: '/strategic', category: 'Identify', icon: Target },
  { label: 'What-If Analyzer', path: '/what-if-analyzer', category: 'Identify', icon: Lightbulb },
  { label: 'Playbook Customization', path: '/playbook-customization', category: 'Identify', icon: ClipboardCheck },
  { label: 'Preparedness Report', path: '/preparedness-report', category: 'Identify', icon: Shield },
  { label: 'AI Radar Dashboard', path: '/ai-radar', category: 'Detect', icon: Radar },
  { label: 'Foresight Radar', path: '/foresight-radar', category: 'Detect', icon: Eye },
  { label: 'Signal Intelligence', path: '/signal-intelligence', category: 'Detect', icon: Radio },
  { label: 'Incident Analyzer', path: '/incident-analyzer', category: 'Detect', icon: AlertCircle },
  { label: 'Live Activation Center', path: '/live-activation', category: 'Execute', icon: Zap },
  { label: 'Crisis Response', path: '/crisis', category: 'Execute', icon: AlertCircle },
  { label: 'Execution Coordination', path: '/execution-coordination', category: 'Execute', icon: Users },
  { label: 'Decision Velocity', path: '/decision-velocity', category: 'Execute', icon: TrendingUp },
  { label: 'War Room', path: '/war-room', category: 'Execute', icon: Globe },
  { label: 'Advanced Analytics', path: '/advanced-analytics', category: 'Advance', icon: BarChart3 },
  { label: 'Execution History', path: '/execution-history', category: 'Advance', icon: BarChart3 },
  { label: 'Enterprise Metrics', path: '/enterprise-metrics', category: 'Advance', icon: TrendingUp },
  { label: 'Stakeholder Management', path: '/stakeholder-management', category: 'Advance', icon: Users },
  { label: '12-Minute Test Drive', path: '/12-minute-experience', category: 'Demo', icon: Play },
  { label: 'Pilot Demo', path: '/pilot-demo', category: 'Demo', icon: Rocket },
  { label: 'Shadow Strategy Simulator', path: '/simulation-studio', category: 'Demo', icon: FlaskConical },
  { label: 'How It Works', path: '/how-it-works', category: 'Learn', icon: Play },
  { label: 'Research & Validation', path: '/research', category: 'Learn', icon: FileText },
  { label: 'Request a Pilot', path: '/pilot-program', category: 'Action', icon: Target },
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
        { label: "Why Execution OS", path: "/why-execution-os", icon: Shield, description: "The 30-day mobilization gap — and how we close it" },
      ],
    },
    {
      heading: "Core Capabilities",
      links: [
        { label: "Playbook Library", path: "/playbooks", icon: ClipboardList, description: "170 pre-staged playbooks across 9 strategic domains" },
        { label: "AI Trigger Monitoring", path: "/triggers-management", icon: Zap, description: "Automated detection across 248+ data points" },
        { label: "Signal Intelligence", path: "/signal-intelligence", icon: Radar, description: "16 signal categories — monitored every 15 minutes" },
        { label: "Enterprise Ecosystems", path: "/ecosystems", icon: Globe, description: "Microsoft · Google · Salesforce · AWS · SAP · ServiceNow · Workday", featured: true },
      ],
    },
    {
      heading: "Inside the Platform",
      links: [
        { label: "Command Center", path: "/command-center", icon: Compass, description: "Strategic operations hub — your primary entry point", featured: true },
        { label: "Workspace", path: "/workspace", icon: Layers, description: "Execute across all 4 IDEA phases" },
        { label: "Situations Hub", path: "/situations-hub", icon: Shield, description: "All 9 domains — readiness, drills & live coordination" },
        { label: "Coordination Intelligence", path: "/coordination-intelligence", icon: Activity, description: "Your real coordination speed vs. the 12-minute benchmark", featured: true },
        { label: "Intelligence Hub", path: "/intelligence-hub", icon: Brain, description: "AI radar, signals & compound threat synthesis" },
      ],
    },
  ];

  // TRY IT — self-serve experience paths
  const experienceSections: NavSection[] = [
    {
      heading: "Experience It Now",
      links: [
        { label: "Live Demo", path: "/try-demo", icon: Rocket, description: "Full execution simulation — no login required", featured: true },
        { label: "12-Minute Test Drive", path: "/12-minute-experience", icon: Play, description: "Guided 4-step sequence — feel a trigger to execution live", featured: true },
        { label: "Shadow Simulator", path: "/simulation-studio", icon: FlaskConical, description: "Dry-run any scenario — AI scores Survive vs. Thrive" },
        { label: "By Your Role", path: "/role-selector", icon: Users, description: "Playbooks filtered for your C-suite function" },
        { label: "Strategic Analyzer", path: "/incident-analyzer", icon: AlertCircle, description: "Analyze any strategic situation with AI" },
      ],
    },
  ];

  // EVIDENCE — research, proof, and ROI validation
  const evidenceLinks: NavLink[] = [
    { label: "Research & Validation", path: "/research", icon: FileText, description: "McKinsey, Gartner, IBM, PwC — the evidence behind Execution OS", featured: true },
    { label: "ROI Calculator", path: "/roi-calculator", icon: Calculator, description: "See the competitive window you're leaving open" },
    { label: "Readiness Score", path: "/readiness-assessment", icon: ClipboardCheck, description: "Score your org's execution readiness across all 9 domains" },
    { label: "Customer Journey", path: "/customer-journey", icon: Users, description: "See how Fortune 1000 teams onboard & scale" },
    { label: "Pricing & Plans", path: "/growth", icon: TrendingUp, description: "Accessible entry — full platform, grow as you scale", featured: true },
    { label: "Why Not Consulting?", path: "/vs-consulting", icon: Scale, description: "McKinsey charges $300K–$500K for PDFs. We deliver infrastructure that executes." },
  ];

  const investorsLinks: NavLink[] = [
    { label: "Investor Resources", path: "/investor-resources", icon: FileText, description: "Full materials — frameworks, thesis & deck", featured: true },
    { label: "Investment Thesis", path: "/investors", icon: TrendingUp, description: "Market opportunity, research validation & ROI case" },
    { label: "Pitch Deck", path: "/pitch-deck", icon: Presentation, description: "Pre-seed investor presentation" },
    { label: "Board Briefings", path: "/board-briefings", icon: FileText, description: "Executive-ready board reporting" },
    { label: "Founder's Story", path: "/founder-story", icon: Video, description: "The vision behind Execution OS" },
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
      className="px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-150 flex items-center gap-1.5"
      style={{
        color: highlighted ? GOLD : NAVY,
        background: 'transparent',
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

  const renderNavItem = (link: NavLink) => link.featured ? (
    <DropdownMenuItem
      key={link.path + link.label}
      onClick={() => navigateTo(link.path)}
      className="flex items-center gap-3 py-3 cursor-pointer rounded-xl mx-1 mb-1.5 focus:outline-none group"
      style={{
        background: "linear-gradient(135deg,rgba(201,168,76,0.10),rgba(43,138,110,0.06))",
        border: "1px solid rgba(201,168,76,0.30)",
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg,rgba(201,168,76,0.18),rgba(43,138,110,0.12))";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.55)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg,rgba(201,168,76,0.10),rgba(43,138,110,0.06))";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.30)";
      }}
      data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(201,168,76,0.15)" }}>
        <link.icon className="h-4 w-4" style={{ color: GOLD }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm leading-tight" style={{ color: NAVY }}>{link.label}</div>
        <span className="text-xs leading-snug block mt-0.5" style={{ color: "#4B5563" }}>{link.description}</span>
      </div>
      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ml-1" style={{ background: GOLD }}>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" style={{ color: NAVY }}>
          <path d="M2.5 6h7m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </DropdownMenuItem>
  ) : (
    <DropdownMenuItem
      key={link.path + link.label}
      onClick={() => navigateTo(link.path)}
      className="flex items-center gap-3 py-2.5 cursor-pointer rounded-lg mx-1 focus:outline-none"
      style={{ transition: 'background 0.12s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(10,15,46,0.06)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
      data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'rgba(43,138,110,0.08)' }}>
        <link.icon className="h-3.5 w-3.5" style={{ color: TEAL }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm leading-tight" style={{ color: NAVY }}>{link.label}</div>
        <span className="text-xs leading-snug block mt-0.5" style={{ color: "#6B7280" }}>{link.description}</span>
      </div>
    </DropdownMenuItem>
  );

  const renderSectionedDropdown = (label: string, sections: NavSection[], highlighted?: boolean) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {renderDropdownButton(label, highlighted)}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[340px] max-h-[80vh] overflow-y-auto shadow-xl rounded-xl p-2"
        style={{
          background: '#fff',
          border: `1px solid rgba(10,15,46,0.12)`,
          boxShadow: '0 12px 40px rgba(10,15,46,0.15), 0 2px 8px rgba(10,15,46,0.08)',
        }}
      >
        {sections.map((section, sIdx) => (
          <div key={section.heading}>
            {sIdx > 0 && <DropdownMenuSeparator style={{ background: 'rgba(10,15,46,0.08)', margin: '6px 0' }} />}
            <DropdownMenuLabel
              className="text-[11px] uppercase tracking-widest font-bold px-3 pt-3 pb-1.5"
              style={{ color: GOLD }}
            >
              {section.heading}
            </DropdownMenuLabel>
            {section.links.map(renderNavItem)}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderFlatDropdown = (label: string, links: NavLink[], highlighted?: boolean) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {renderDropdownButton(label, highlighted)}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[340px] shadow-xl rounded-xl p-2"
        style={{
          background: '#fff',
          border: `1px solid rgba(10,15,46,0.12)`,
          boxShadow: '0 12px 40px rgba(10,15,46,0.15), 0 2px 8px rgba(10,15,46,0.08)',
        }}
      >
        {links.map(renderNavItem)}
      </DropdownMenuContent>
    </DropdownMenu>
  );

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
            {renderSectionedDropdown("The Platform", platformSections)}
            {renderFlatDropdown("Evidence", evidenceLinks)}
            {renderFlatDropdown("Investors", investorsLinks, true)}
          </div>

          {/* Right: CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Back button — only on inner pages, right-side so logo stays anchored */}
            {!isHomePage && (
              <button
                onClick={handleBack}
                className="h-9 w-9 flex items-center justify-center rounded-lg transition-all"
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
              className="h-9 w-9 flex items-center justify-center rounded-lg border transition-all"
              style={{ border: '1px solid rgba(10,15,46,0.12)', color: NAVY, background: searchOpen ? 'rgba(10,15,46,0.04)' : 'transparent' }}
              title="Search platform (⌘K)"
            >
              <Search className="h-4 w-4" />
            </button>
            {isLoading ? (
              <div className="h-9 w-48 bg-gray-100 animate-pulse rounded-lg" />
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
                  onClick={() => navigateTo("/pilot-program")}
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
                  className="h-9 px-4 text-sm font-bold text-white shadow-md"
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
                  onClick={() => navigateTo("/pilot-program")}
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
                  onClick={() => login()}
                  className="h-9 px-3 text-sm font-medium"
                  style={{ color: NAVY }}
                  data-testid="nav-login"
                >
                  <span className="flex items-center gap-1.5">
                    <SiGoogle className="h-3 w-3 opacity-60" />
                    <SiGithub className="h-3.5 w-3.5 opacity-60" />
                    <SiApple className="h-3.5 w-3.5 opacity-60" />
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
              className="p-2 rounded-lg transition-colors"
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
                      onClick={() => navigateTo("/pilot-program")}
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
                    onClick={() => navigateTo("/pilot-program")}
                    className="w-full justify-center h-11 text-sm font-bold"
                    style={{ background: GOLD, color: NAVY }}
                    data-testid="nav-mobile-request-pilot"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Request a Pilot
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => login()}
                    className="w-full justify-center h-9 text-sm"
                    style={{ color: NAVY }}
                    data-testid="nav-mobile-login"
                  >
                    <span className="flex items-center gap-1.5">
                      <SiGoogle className="h-3 w-3 opacity-60" />
                      <SiGithub className="h-3.5 w-3.5 opacity-60" />
                      <SiApple className="h-3.5 w-3.5 opacity-60" />
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
                      className="w-full text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3"
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

              {experienceSections.map((section) => (
                <div key={section.heading}>
                  <p className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: GOLD }}>{section.heading}</p>
                  {section.links.map((link) => (
                    <button
                      key={link.path + link.label}
                      onClick={() => navigateTo(link.path)}
                      className="w-full text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3"
                      style={{ color: '#374151', fontWeight: 500 }}
                    >
                      <link.icon className="h-4 w-4" style={{ color: GOLD }} />
                      {link.label}
                    </button>
                  ))}
                </div>
              ))}

              <div style={{ borderTop: `1px solid rgba(201,168,76,0.1)`, margin: '8px 0' }} />

              <p className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: TEAL }}>Evidence</p>
              {evidenceLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className="w-full text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3"
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
                  className="w-full text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3"
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
                    className="w-full text-left py-2.5 px-4 rounded-lg flex items-center gap-3 text-sm font-medium"
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
                  <span style={{ width: 5, height: 5, background: '#3BAF8A', borderRadius: '50%', display: 'inline-block' }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#3BAF8A' }}>Monitoring Active</span>
                </div>
                <span style={{ fontSize: 9, color: 'rgba(240,237,228,0.35)', letterSpacing: '0.08em' }}>248+ Data Points</span>
                <span style={{ fontSize: 9, color: 'rgba(240,237,228,0.35)', letterSpacing: '0.08em' }}>221 Triggers Armed</span>
                <span style={{ fontSize: 9, color: 'rgba(240,237,228,0.35)', letterSpacing: '0.08em' }}>16 Signal Categories</span>
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
