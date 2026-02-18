import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, User, ChevronDown, BarChart3, TrendingUp, Zap, ClipboardList, Radar, Compass, Globe, Users, Calculator, Shield, Layers, ArrowLeft, Brain, Target, Lightbulb, BookOpen, FileText, Settings, Building, Presentation, Video, Eye, Rocket, AlertCircle, ClipboardCheck, FlaskConical } from "lucide-react";
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

export default function StandardNav() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  const navigateTo = (path: string) => {
    setLocation(path);
    setMobileMenuOpen(false);
    scrollToTop();
  };

  const isActivePath = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  type NavLink = { label: string; path: string; icon: any; description: string };
  type NavSection = { heading: string; links: NavLink[] };

  const productSections: NavSection[] = [
    {
      heading: "Understand",
      links: [
        { label: "How It Works", path: "/how-it-works", icon: Layers, description: "The IDEA Framework" },
        { label: "Why ExecuteIQ", path: "/why-executeiq", icon: Target, description: "The execution gap" },
        { label: "Platform Overview", path: "/platform-overview", icon: Eye, description: "Full capabilities" },
      ],
    },
    {
      heading: "Capabilities",
      links: [
        { label: "Playbook Library", path: "/playbooks", icon: ClipboardList, description: "166 playbooks across 9 domains" },
        { label: "Signal Intelligence", path: "/signal-intelligence", icon: Radar, description: "Real-time signal monitoring" },
        { label: "AI Trigger Monitoring", path: "/triggers-management", icon: Zap, description: "Automated trigger detection" },
        { label: "AI Radar", path: "/ai-radar", icon: Brain, description: "Predictive pattern matching" },
        { label: "Integrations", path: "/integrations", icon: Globe, description: "24 enterprise connections" },
      ],
    },
    {
      heading: "Explore",
      links: [
        { label: "By Role", path: "/role-selector", icon: Users, description: "Playbooks for your C-suite role" },
        { label: "Competitive Positioning", path: "/competitive-positioning", icon: Shield, description: "Market landscape" },
        { label: "ROI Calculator", path: "/roi-calculator", icon: Calculator, description: "Impact & savings analysis" },
        { label: "Decision Velocity", path: "/decision-velocity", icon: Zap, description: "Accelerate decision-making" },
      ],
    },
  ];

  const experienceSections: NavSection[] = [
    {
      heading: "AI Tools",
      links: [
        { label: "Strategic Analyzer", path: "/incident-analyzer", icon: AlertCircle, description: "Analyze any strategic situation with AI" },
        { label: "Readiness Assessment", path: "/readiness-assessment", icon: ClipboardCheck, description: "Assess execution readiness by domain" },
        { label: "What-If Analyzer", path: "/what-if-analyzer", icon: FlaskConical, description: "Scenario modeling & simulation" },
      ],
    },
    {
      heading: "Live Demos",
      links: [
        { label: "Try Demo", path: "/try-demo", icon: Rocket, description: "Full trigger-to-execution experience" },
      ],
    },
  ];

  const platformLinks: NavLink[] = [
    { label: "ExecuteIQ One™", path: "/mission-control", icon: Compass, description: "Strategic operations hub" },
    { label: "Command Center", path: "/command-center", icon: Target, description: "Live execution coordination" },
    { label: "Executive Dashboard", path: "/executive-dashboard", icon: BarChart3, description: "Performance metrics & KPIs" },
    { label: "Strategy Execution", path: "/strategy-execution", icon: TrendingUp, description: "Transformation progress tracking" },
    { label: "Playbook Factory", path: "/workspaces/identify", icon: Layers, description: "Build & customize playbooks" },
    { label: "Signal Ops Center", path: "/workspaces/detect", icon: Radar, description: "Configure signal sources" },
    { label: "Pulse Intelligence", path: "/pulse-intelligence", icon: Radar, description: "Weak signal analysis" },
    { label: "Institutional Memory", path: "/institutional-memory", icon: BookOpen, description: "Organizational learning" },
  ];

  const investorsLinks: NavLink[] = [
    { label: "For Investors", path: "/investors", icon: TrendingUp, description: "Investment thesis" },
    { label: "Pitch Deck", path: "/pitch-deck", icon: Presentation, description: "Pre-seed investor deck" },
    { label: "Investor Resources", path: "/investor-resources", icon: FileText, description: "Materials & deck" },
    { label: "Board Briefings", path: "/board-briefings", icon: FileText, description: "Executive reporting" },
    { label: "Our Story", path: "/our-story", icon: BookOpen, description: "The ExecuteIQ journey" },
    { label: "Founder's Story", path: "/founder-story", icon: Video, description: "Vision behind ExecuteIQ" },
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
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
        highlighted
          ? 'text-poise-gold hover:text-amber-300 hover:bg-poise-gold/10'
          : 'text-slate-300 hover:text-white hover:bg-white/5'
      }`}
      data-testid={`nav-${label.toLowerCase().replace(/\s+/g, '-')}-dropdown`}
    >
      {label}
      <ChevronDown className="h-3 w-3" />
    </button>
  );

  const renderNavItem = (link: NavLink) => (
    <DropdownMenuItem
      key={link.path + link.label}
      onClick={() => navigateTo(link.path)}
      className="flex items-center gap-3 py-2"
      data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <link.icon className="h-4 w-4 text-slate-400" />
      <div className="flex-1">
        <div className="font-medium text-sm">{link.label}</div>
        <span className="text-xs text-muted-foreground">{link.description}</span>
      </div>
    </DropdownMenuItem>
  );

  const renderSectionedDropdown = (label: string, sections: NavSection[], highlighted?: boolean) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {renderDropdownButton(label, highlighted)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 max-h-[80vh] overflow-y-auto">
        {sections.map((section, sIdx) => (
          <div key={section.heading}>
            {sIdx > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{section.heading}</DropdownMenuLabel>
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
      <DropdownMenuContent align="start" className="w-72">
        {links.map(renderNavItem)}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="border-b border-poise-navy/50 bg-poise-navy sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-2">
            {!isHomePage && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 px-2 py-1.5 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm"
                data-testid="nav-back-button"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            <div 
              className="flex items-center cursor-pointer hover:opacity-90 transition-opacity" 
              onClick={() => navigateTo('/')}
              data-testid="nav-logo"
            >
              <div className="flex items-center gap-2">
                <ExecuteIQLogo 
                  width={32} 
                  height={32}
                  variant="icon-only"
                  color="white"
                />
                <span className="text-xl sm:text-2xl font-bold tracking-tight executeiq-heading" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <span className="text-white">Execute</span>
                  <span className="text-executeiq-gold">IQ</span>
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-0.5">
            {renderSectionedDropdown("Product", productSections)}
            {renderSectionedDropdown("Experience", experienceSections, true)}
            {renderFlatDropdown("Platform", platformLinks)}
            {renderFlatDropdown("Investors", investorsLinks, true)}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Button 
              onClick={() => navigateTo("/mission-control")}
              className="bg-gradient-to-r from-poise-teal to-cyan-600 hover:from-cyan-600 hover:to-poise-teal text-white font-semibold h-9 px-4 shadow-lg shadow-poise-teal/20"
              data-testid="nav-open-platform"
            >
              <Compass className="h-4 w-4 mr-1.5" />
              Open Platform
            </Button>

            {isLoading ? (
              <div className="h-9 w-20 bg-slate-800 animate-pulse rounded-lg" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
                  <User className="h-4 w-4 text-slate-300" />
                  <span className="text-sm text-slate-300">{user.firstName || user.email?.split('@')[0]}</span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="text-slate-300 hover:text-white hover:bg-slate-800 h-9 px-3"
                  data-testid="nav-logout"
                >
                  <LogOut className="h-4 w-4 xl:mr-1.5" />
                  <span className="hidden xl:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                onClick={login}
                className="text-slate-300 hover:text-white hover:bg-slate-800 h-9 px-3"
                data-testid="nav-login"
              >
                <LogIn className="h-4 w-4 xl:mr-1.5" />
                <span className="hidden xl:inline">Sign In</span>
              </Button>
            )}
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <Button 
              onClick={() => navigateTo("/mission-control")}
              size="sm"
              className="bg-gradient-to-r from-poise-teal to-cyan-600 text-white"
              data-testid="nav-mobile-open-platform"
            >
              <Compass className="h-4 w-4" />
            </Button>
            <button
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="nav-mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              <Button 
                onClick={() => navigateTo("/mission-control")}
                className="bg-gradient-to-r from-poise-teal to-cyan-600 text-white w-full justify-center h-12 text-base font-semibold"
                data-testid="nav-mobile-open-platform"
              >
                <Compass className="h-5 w-5 mr-2" />
                Open Platform
              </Button>
              
              <div className="border-t border-slate-800 my-3" />

              {productSections.map((section) => (
                <div key={section.heading}>
                  <p className="px-4 py-2 text-xs text-poise-teal uppercase tracking-wide font-semibold">{section.heading}</p>
                  {section.links.map((link) => (
                    <button
                      key={link.path + link.label}
                      onClick={() => navigateTo(link.path)}
                      className={`text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 ${
                        isActivePath(link.path) ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <link.icon className="h-4 w-4 text-slate-200" />
                      {link.label}
                    </button>
                  ))}
                </div>
              ))}
              
              <div className="border-t border-slate-800 my-3" />
              
              {experienceSections.map((section) => (
                <div key={section.heading}>
                  <p className="px-4 py-2 text-xs text-poise-gold uppercase tracking-wide font-semibold">{section.heading}</p>
                  {section.links.map((link) => (
                    <button
                      key={link.path + link.label}
                      onClick={() => navigateTo(link.path)}
                      className="text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      <link.icon className="h-4 w-4 text-poise-gold" />
                      {link.label}
                    </button>
                  ))}
                </div>
              ))}

              <div className="border-t border-slate-800 my-3" />

              <p className="px-4 py-2 text-xs text-poise-teal uppercase tracking-wide font-semibold">Platform</p>
              {platformLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className="text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <link.icon className="h-4 w-4 text-slate-200" />
                  {link.label}
                </button>
              ))}
              
              <div className="border-t border-slate-800 my-3" />
              
              <p className="px-4 py-2 text-xs text-poise-gold uppercase tracking-wide font-semibold">Investors</p>
              {investorsLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className="text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <link.icon className="h-4 w-4 text-slate-200" />
                  {link.label}
                </button>
              ))}
              
              <div className="border-t border-slate-800 my-3" />
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-300" />
                    <span className="text-sm text-slate-300">{user.firstName || user.email}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={logout}
                    className="text-slate-300 hover:text-white"
                    data-testid="nav-mobile-signout"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={login}
                  className="text-slate-300 hover:text-white hover:bg-slate-800 w-full justify-center h-10"
                  data-testid="nav-mobile-signin"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
