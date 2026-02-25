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
        { label: "Why Execution OS", path: "/why-executeiq", icon: Target, description: "The execution gap" },
        { label: "Platform Overview", path: "/platform-overview", icon: Eye, description: "Full capabilities" },
      ],
    },
    {
      heading: "Capabilities",
      links: [
        { label: "Playbook Library", path: "/playbooks", icon: ClipboardList, description: "170 playbooks across 9 domains" },
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
        { label: "Executive Summary", path: "/executive-summary", icon: FileText, description: "One-click executive reports" },
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
    { label: "Execution OS Hub", path: "/mission-control", icon: Compass, description: "Strategic operations hub" },
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
    { label: "Our Story", path: "/our-story", icon: BookOpen, description: "The Execution OS journey" },
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
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
        highlighted
          ? 'text-poise-gold hover:text-amber-600 hover:bg-amber-50'
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
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
      className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
      data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <link.icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
      <div className="flex-1">
        <div className="font-medium text-sm text-gray-900">{link.label}</div>
        <span className="text-xs text-gray-500">{link.description}</span>
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
        className="w-72 max-h-[80vh] overflow-y-auto bg-white border border-gray-200 shadow-lg rounded-xl p-1"
      >
        {sections.map((section, sIdx) => (
          <div key={section.heading}>
            {sIdx > 0 && <DropdownMenuSeparator className="bg-gray-100" />}
            <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold px-3 pt-2 pb-1">
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
        className="w-72 bg-white border border-gray-200 shadow-lg rounded-xl p-1"
      >
        {links.map(renderNavItem)}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-2">
            {!isHomePage && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 px-2 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                data-testid="nav-back-button"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            <div
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigateTo('/')}
              data-testid="nav-logo"
            >
              <ExecuteIQLogo
                height={40}
                variant="full"
                color="navy"
              />
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
              className="bg-gradient-to-r from-poise-teal to-cyan-600 hover:from-cyan-600 hover:to-poise-teal text-gray-900 font-semibold h-9 px-4 shadow-md shadow-poise-teal/20"
              data-testid="nav-open-platform"
            >
              <Compass className="h-4 w-4 mr-1.5" />
              Open Platform
            </Button>

            {isLoading ? (
              <div className="h-9 w-20 bg-gray-100 animate-pulse rounded-lg" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{user.firstName || user.email?.split('@')[0]}</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-9 px-3"
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
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-9 px-3"
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
              className="bg-gradient-to-r from-poise-teal to-cyan-600 text-gray-900"
              data-testid="nav-mobile-open-platform"
            >
              <Compass className="h-4 w-4" />
            </Button>
            <button
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="nav-mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto bg-white">
            <div className="flex flex-col gap-1">
              <Button
                onClick={() => navigateTo("/mission-control")}
                className="bg-gradient-to-r from-poise-teal to-cyan-600 text-gray-900 w-full justify-center h-12 text-base font-semibold"
                data-testid="nav-mobile-open-platform"
              >
                <Compass className="h-5 w-5 mr-2" />
                Open Platform
              </Button>

              <div className="border-t border-gray-100 my-3" />

              {productSections.map((section) => (
                <div key={section.heading}>
                  <p className="px-4 py-2 text-xs text-poise-teal uppercase tracking-wide font-semibold">{section.heading}</p>
                  {section.links.map((link) => (
                    <button
                      key={link.path + link.label}
                      onClick={() => navigateTo(link.path)}
                      className={`w-full text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 ${
                        isActivePath(link.path)
                          ? 'text-poise-navy bg-gray-100 font-medium'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <link.icon className="h-4 w-4 text-gray-500" />
                      {link.label}
                    </button>
                  ))}
                </div>
              ))}

              <div className="border-t border-gray-100 my-3" />

              {experienceSections.map((section) => (
                <div key={section.heading}>
                  <p className="px-4 py-2 text-xs text-poise-gold uppercase tracking-wide font-semibold">{section.heading}</p>
                  {section.links.map((link) => (
                    <button
                      key={link.path + link.label}
                      onClick={() => navigateTo(link.path)}
                      className="w-full text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <link.icon className="h-4 w-4 text-poise-gold" />
                      {link.label}
                    </button>
                  ))}
                </div>
              ))}

              <div className="border-t border-gray-100 my-3" />

              <p className="px-4 py-2 text-xs text-poise-teal uppercase tracking-wide font-semibold">Platform</p>
              {platformLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className="w-full text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <link.icon className="h-4 w-4 text-gray-500" />
                  {link.label}
                </button>
              ))}

              <div className="border-t border-gray-100 my-3" />

              <p className="px-4 py-2 text-xs text-poise-gold uppercase tracking-wide font-semibold">Investors</p>
              {investorsLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className="w-full text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <link.icon className="h-4 w-4 text-gray-500" />
                  {link.label}
                </button>
              ))}

              <div className="border-t border-gray-100 my-3" />

              {isAuthenticated && user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{user.firstName || user.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-900"
                    data-testid="nav-mobile-signout"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={login}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 w-full justify-center h-10"
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
