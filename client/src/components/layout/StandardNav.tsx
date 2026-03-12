import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, User, ChevronDown, BarChart3, TrendingUp, Zap, ClipboardList, Radar, Compass, Globe, Users, Calculator, Shield, Layers, ArrowLeft, Brain, Target, Lightbulb, BookOpen, FileText, Settings, Building, Presentation, Video, Eye, Rocket, AlertCircle, ClipboardCheck, FlaskConical, Radio } from "lucide-react";
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
        { label: "IDEA Framework", path: "/idea-framework", icon: Layers, description: "I·D·E·A — the execution operating model" },
        { label: "Why Execution OS", path: "/why-executeiq", icon: Shield, description: "The execution gap enterprises face" },
        { label: "Platform Overview", path: "/platform-overview", icon: Eye, description: "Every capability, connected" },
      ],
    },
    {
      heading: "Capabilities",
      links: [
        { label: "Playbook Library", path: "/playbooks", icon: ClipboardList, description: "170 playbooks across 9 strategic domains" },
        { label: "AI Trigger Monitoring", path: "/triggers-management", icon: Zap, description: "Automated detection across 248+ signals" },
        { label: "Signal Intelligence", path: "/signal-intelligence", icon: Radar, description: "Real-time monitoring across 20 categories" },
        { label: "Signal Configuration", path: "/signal-configuration", icon: Radio, description: "Configure your live data points" },
        { label: "Integrations", path: "/integrations", icon: Globe, description: "24 enterprise system connections" },
      ],
    },
    {
      heading: "Explore",
      links: [
        { label: "By Role", path: "/role-selector", icon: Users, description: "Playbooks filtered for your C-suite role" },
        { label: "ROI Calculator", path: "/roi-calculator", icon: Calculator, description: "Estimate impact & cost savings" },
        { label: "Competitive Positioning", path: "/competitive-positioning", icon: Shield, description: "Market landscape & differentiation" },
      ],
    },
  ];

  const experienceSections: NavSection[] = [
    {
      heading: "AI Tools",
      links: [
        { label: "Strategic Analyzer", path: "/incident-analyzer", icon: AlertCircle, description: "Analyze any strategic situation with AI" },
        { label: "Shadow Simulator", path: "/simulation-studio", icon: FlaskConical, description: "Dry-run any scenario — Survive vs. Thrive scoring" },
        { label: "Strategic Recorder", path: "/strategic-recorder", icon: Zap, description: "Turn strategic notes into custom playbooks" },
        { label: "Readiness Assessment", path: "/readiness-assessment", icon: ClipboardCheck, description: "Score execution readiness across 9 domains" },
        { label: "Executive Summary", path: "/executive-summary", icon: FileText, description: "One-click AI-generated executive reports" },
      ],
    },
    {
      heading: "Get Started",
      links: [
        { label: "Try Demo", path: "/try-demo", icon: Rocket, description: "Live simulation — no login required" },
        { label: "Sample Playbooks", path: "/playbook-library", icon: BookOpen, description: "3 enriched playbooks — no sign-in needed" },
        { label: "Request Pilot", path: "/pilot-program", icon: Target, description: "Guided 12-week enterprise deployment" },
        { label: "Customer Journey", path: "/customer-journey", icon: Users, description: "See how enterprises onboard & scale" },
      ],
    },
  ];

  const platformLinks: NavLink[] = [
    { label: "Mission Control", path: "/mission-control", icon: Compass, description: "Strategic operations hub + War Room Pulse Map" },
    { label: "Workspace", path: "/workspace", icon: Layers, description: "IDEA Framework — Identify · Detect · Execute · Advance" },
    { label: "Executive Hub", path: "/executive-hub", icon: BarChart3, description: "Intelligence, velocity, readiness & analytics" },
    { label: "Intelligence Hub", path: "/intelligence-hub", icon: Brain, description: "AI radar, signals & compound threat synthesis" },
    { label: "Situations Hub", path: "/situations-hub", icon: Shield, description: "All 9 domains — readiness, drills & coordination" },
    { label: "ROI Dashboard", path: "/roi-dashboard", icon: Calculator, description: "Live value metrics — board-ready ROI reporting" },
    { label: "Settings", path: "/settings-hub", icon: Settings, description: "Organization, stakeholders & integrations" },
  ];

  const investorsLinks: NavLink[] = [
    { label: "For Investors", path: "/investors", icon: TrendingUp, description: "Investment thesis" },
    { label: "Pitch Deck", path: "/pitch-deck", icon: Presentation, description: "Pre-seed investor deck" },
    { label: "Investor Resources", path: "/investor-resources", icon: FileText, description: "Materials & deck" },
    { label: "Board Briefings", path: "/board-briefings", icon: FileText, description: "Executive reporting" },
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
          ? 'text-poise-gold hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
          : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
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
      className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 focus:bg-gray-50 dark:focus:bg-gray-800"
      data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <link.icon className="h-4 w-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
      <div className="flex-1">
        <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{link.label}</div>
        <span className="text-xs text-gray-600 dark:text-gray-400">{link.description}</span>
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
        className="w-72 max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-1"
      >
        {sections.map((section, sIdx) => (
          <div key={section.heading}>
            {sIdx > 0 && <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-700" />}
            <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold px-3 pt-2 pb-1">
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
        className="w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-1"
      >
        {links.map(renderNavItem)}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">

          <div className="flex items-center gap-2">
            {!isHomePage && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 px-2 py-1.5 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm"
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
                height={58}
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

          <div className="hidden lg:flex items-center gap-2">
            {isLoading ? (
              <div className="h-9 w-48 bg-gray-100 animate-pulse rounded-lg" />
            ) : isAuthenticated && user ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigateTo("/try-demo")}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 h-9 px-3 font-medium text-sm"
                  data-testid="nav-try-demo"
                >
                  Try Demo
                </Button>
                <Button
                  onClick={() => navigateTo("/pilot-program")}
                  className="bg-[#C9A84C] hover:bg-[#DFC178] !text-[#0A0F2E] h-9 px-3 font-semibold text-sm"
                  data-testid="nav-request-pilot"
                >
                  Request Pilot
                </Button>
                <Button
                  onClick={() => navigateTo("/mission-control")}
                  className="bg-gradient-to-r from-poise-teal to-[#3BAF8A] hover:from-[#2B8A6E] hover:to-poise-teal !text-white font-semibold h-9 px-4 shadow-md shadow-poise-teal/20"
                  data-testid="nav-open-platform"
                >
                  <Compass className="h-4 w-4 mr-1.5" />
                  Open Platform
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-3 py-1.5 h-9 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      data-testid="nav-user-menu"
                    >
                      <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="hidden xl:inline text-sm">{user.firstName || user.email?.split('@')[0]}</span>
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="text-xs text-gray-500 font-normal">{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigateTo("/settings")} className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2 opacity-60" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateTo("/organization-setup")} className="cursor-pointer">
                      <Building className="h-4 w-4 mr-2 opacity-60" />
                      Organization Setup
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateTo("/admin/customer-health")} className="cursor-pointer">
                      <BarChart3 className="h-4 w-4 mr-2 opacity-60" />
                      Customer Health
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 dark:text-red-400" data-testid="nav-logout">
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
                  onClick={() => navigateTo("/try-demo")}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 h-9 px-4 font-medium text-sm"
                  data-testid="nav-try-demo"
                >
                  Try Demo
                </Button>
                <Button
                  onClick={() => navigateTo("/pilot-program")}
                  className="bg-[#C9A84C] hover:bg-[#DFC178] !text-[#0A0F2E] h-9 px-4 font-semibold text-sm"
                  data-testid="nav-request-pilot"
                >
                  Request Pilot
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => login()}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 h-9 px-3 text-sm"
                  data-testid="nav-login"
                >
                  <span className="flex items-center gap-1.5">
                    <SiGoogle className="h-3 w-3 opacity-70" />
                    <SiGithub className="h-3.5 w-3.5 opacity-70" />
                    <SiApple className="h-3.5 w-3.5 opacity-70" />
                    <span className="ml-0.5">Sign In</span>
                  </span>
                </Button>
              </>
            )}
          </div>

          <div className="flex lg:hidden items-center gap-2">
            {isAuthenticated && user && (
              <Button
                onClick={() => navigateTo("/mission-control")}
                size="sm"
                className="bg-gradient-to-r from-poise-teal to-[#3BAF8A] !text-white"
                data-testid="nav-mobile-open-platform"
              >
                <Compass className="h-4 w-4" />
              </Button>
            )}
            <button
              className="p-2 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="nav-mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900">
            <div className="flex flex-col gap-1">
              {isAuthenticated && user ? (
                <div className="flex flex-col gap-2 px-1">
                  <Button
                    onClick={() => navigateTo("/mission-control")}
                    className="bg-gradient-to-r from-poise-teal to-[#3BAF8A] !text-white w-full justify-center h-12 text-base font-semibold"
                    data-testid="nav-mobile-open-platform"
                  >
                    <Compass className="h-5 w-5 mr-2" />
                    Open Platform
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigateTo("/try-demo")}
                      variant="outline"
                      className="flex-1 justify-center h-10 text-sm font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      data-testid="nav-mobile-try-demo"
                    >
                      Try Demo
                    </Button>
                    <Button
                      onClick={() => navigateTo("/pilot-program")}
                      className="flex-1 justify-center h-10 text-sm font-semibold bg-[#C9A84C] hover:bg-[#DFC178] !text-[#0A0F2E]"
                      data-testid="nav-mobile-request-pilot"
                    >
                      Request Pilot
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-1">
                  <Button
                    onClick={() => navigateTo("/try-demo")}
                    variant="outline"
                    className="w-full justify-center h-11 text-sm font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                    data-testid="nav-mobile-try-demo"
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Try Demo
                  </Button>
                  <Button
                    onClick={() => navigateTo("/pilot-program")}
                    className="w-full justify-center h-11 text-sm font-semibold bg-[#C9A84C] hover:bg-[#DFC178] !text-[#0A0F2E]"
                    data-testid="nav-mobile-request-pilot"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Request Pilot
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => login()}
                    className="w-full justify-center h-9 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    data-testid="nav-mobile-login"
                  >
                    <span className="flex items-center gap-1.5">
                      <SiGoogle className="h-3 w-3 opacity-70" />
                      <SiGithub className="h-3.5 w-3.5 opacity-70" />
                      <SiApple className="h-3.5 w-3.5 opacity-70" />
                      <span className="ml-0.5">Sign In</span>
                    </span>
                  </Button>
                </div>
              )}

              <div className="border-t border-gray-100 dark:border-gray-700 my-3" />

              {productSections.map((section) => (
                <div key={section.heading}>
                  <p className="px-4 py-2 text-xs text-poise-teal uppercase tracking-wide font-semibold">{section.heading}</p>
                  {section.links.map((link) => (
                    <button
                      key={link.path + link.label}
                      onClick={() => navigateTo(link.path)}
                      className={`w-full text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 ${
                        isActivePath(link.path)
                          ? 'text-poise-navy dark:text-white bg-gray-100 dark:bg-gray-800 font-medium'
                          : 'text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <link.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      {link.label}
                    </button>
                  ))}
                </div>
              ))}

              <div className="border-t border-gray-100 dark:border-gray-700 my-3" />

              {experienceSections.map((section) => (
                <div key={section.heading}>
                  <p className="px-4 py-2 text-xs text-poise-gold uppercase tracking-wide font-semibold">{section.heading}</p>
                  {section.links.map((link) => (
                    <button
                      key={link.path + link.label}
                      onClick={() => navigateTo(link.path)}
                      className="w-full text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <link.icon className="h-4 w-4 text-poise-gold" />
                      {link.label}
                    </button>
                  ))}
                </div>
              ))}

              <div className="border-t border-gray-100 dark:border-gray-700 my-3" />

              <p className="px-4 py-2 text-xs text-poise-teal uppercase tracking-wide font-semibold">Platform</p>
              {platformLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className="w-full text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <link.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  {link.label}
                </button>
              ))}

              <div className="border-t border-gray-100 dark:border-gray-700 my-3" />

              <p className="px-4 py-2 text-xs text-poise-gold uppercase tracking-wide font-semibold">Investors</p>
              {investorsLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className="w-full text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <link.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  {link.label}
                </button>
              ))}

              <div className="border-t border-gray-100 dark:border-gray-700 my-3" />

              {isAuthenticated && user ? (
                <div className="flex flex-col gap-1 px-1">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">{user.firstName || user.email}</span>
                  </div>
                  <button
                    onClick={() => navigateTo("/settings")}
                    className="w-full text-left py-2.5 px-4 rounded-lg flex items-center gap-3 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                    data-testid="nav-mobile-settings"
                  >
                    <Settings className="h-4 w-4 opacity-60" />
                    Settings
                  </button>
                  <button
                    onClick={() => navigateTo("/organization-setup")}
                    className="w-full text-left py-2.5 px-4 rounded-lg flex items-center gap-3 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Building className="h-4 w-4 opacity-60" />
                    Organization Setup
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-10 px-4 gap-3"
                    data-testid="nav-mobile-signout"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => login()}
                  className="text-gray-800 hover:text-gray-900 hover:bg-gray-100 w-full justify-center h-10"
                  data-testid="nav-mobile-signin"
                >
                  <span className="flex items-center gap-1.5">
                    <SiGoogle className="h-3 w-3 opacity-70" />
                    <SiGithub className="h-3.5 w-3.5 opacity-70" />
                    <SiApple className="h-3.5 w-3.5 opacity-70" />
                    <span className="ml-0.5">Sign In</span>
                  </span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
