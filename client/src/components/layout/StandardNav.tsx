import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Menu, X, LogIn, LogOut, User, ChevronDown, BarChart3, TrendingUp, Briefcase, Zap, ClipboardList, Radar, Compass, Building, Globe, Users, Calculator, Presentation, FileText, BookOpen, Video, Award, Shield, Layers } from "lucide-react";
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
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
    if (path === '/ultimate-demo') {
      window.location.href = '/ultimate-demo';
      return;
    }
    setLocation(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const isActivePath = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  const productLinks = [
    { label: "How It Works", path: "/how-it-works", icon: Layers, description: "See the IDEA Framework in action" },
    { label: "Playbook Library", path: "/playbooks", icon: ClipboardList, description: "166 pre-built strategic playbooks" },
    { label: "Pricing", path: "/pricing", icon: Calculator, description: "Plans and pricing" },
    { label: "Integrations", path: "/integrations", icon: Globe, description: "Connect your enterprise tools" },
  ];

  const solutionsLinks = [
    { label: "By Role", path: "/role-selector", icon: Users, description: "CEO, CFO, COO, CTO, CMO, CRO" },
    { label: "By Industry", path: "/industry-demos", icon: Building, description: "Financial, Healthcare, Manufacturing" },
    { label: "Competitive Positioning", path: "/competitive-positioning", icon: Shield, description: "How ExecuteIQ compares" },
    { label: "ROI Calculator", path: "/roi-calculator", icon: Calculator, description: "Calculate your savings" },
  ];

  const demosLinks = [
    { label: "Ultimate Demo", path: "/ultimate-demo", icon: Zap, description: "Interactive 72hrs → 12min experience", featured: true },
    { label: "Customer Demo", path: "/customer-demo", icon: Play, description: "Full product walkthrough" },
    { label: "Industry Demos", path: "/industry-demos", icon: Building, description: "Luxury, Financial, Pharma & more" },
    { label: "Interactive Sandbox", path: "/sandbox-demo", icon: Layers, description: "Hands-on product exploration" },
    { label: "Executive Simulation", path: "/executive-simulation", icon: Award, description: "Live crisis response simulation" },
  ];

  const investorsLinks = [
    { label: "For Investors", path: "/investors", icon: TrendingUp, description: "Investment thesis & traction" },
    { label: "Investor Resources", path: "/investor-resources", icon: FileText, description: "Downloadable materials" },
    { label: "VC Presentations", path: "/vc-presentations", icon: Presentation, description: "Pitch deck & financials" },
    { label: "Competitive Positioning", path: "/competitive-positioning", icon: Shield, description: "Market landscape" },
  ];

  const companyLinks = [
    { label: "Our Story", path: "/our-story", icon: BookOpen, description: "The ExecuteIQ journey" },
    { label: "Founder's Story", path: "/founder-story", icon: Video, description: "Vision behind ExecuteIQ" },
    { label: "Research", path: "/research", icon: FileText, description: "Academic & industry backing" },
    { label: "Contact", path: "/contact", icon: Globe, description: "Get in touch" },
  ];

  const platformLinks = [
    { label: "ExecuteIQ One™", path: "/mission-control", icon: Compass, color: "text-poise-gold" },
    { label: "Signal Intelligence", path: "/signal-intelligence", icon: Radar, color: "text-poise-teal" },
    { label: "Strategy Execution", path: "/strategy-execution", icon: TrendingUp, color: "text-poise-teal" },
    { label: "Executive Dashboard", path: "/executive-dashboard", icon: BarChart3, color: "text-poise-gold" },
    { label: "Command Center", path: "/command-center", icon: Compass, color: "text-poise-teal" },
    { label: "AI Trigger Monitoring", path: "/triggers-management", icon: Radar, color: "text-poise-teal" },
    { label: "AI Radar", path: "/ai-radar", icon: Radar, color: "text-poise-teal" },
  ];

  const workspaceLinks = [
    { label: "Playbook Factory", path: "/workspaces/identify", phase: "IDENTIFY", icon: ClipboardList, color: "text-poise-gold" },
    { label: "Signal Ops", path: "/workspaces/detect", phase: "DETECT", icon: Radar, color: "text-poise-teal" },
    { label: "Compass Command", path: "/workspaces/execute", phase: "EXECUTE", icon: Compass, color: "text-poise-teal" },
    { label: "Retrospect Lab", path: "/workspaces/advance", phase: "ADVANCE", icon: TrendingUp, color: "text-poise-gold" },
  ];

  const renderDropdown = (label: string, links: typeof productLinks, align: "start" | "end" = "start") => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 text-slate-300 hover:text-white hover:bg-poise-teal/10"
          data-testid={`nav-${label.toLowerCase().replace(/\s+/g, '-')}-dropdown`}
        >
          {label}
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-72">
        {links.map((link) => (
          <DropdownMenuItem
            key={link.path + link.label}
            onClick={() => navigateTo(link.path)}
            className="flex items-center gap-3 py-2.5"
            data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <link.icon className={`h-4 w-4 ${(link as any).featured ? 'text-poise-teal' : 'text-slate-400'}`} />
            <div className="flex-1">
              <div className={`font-medium text-sm ${(link as any).featured ? 'text-poise-teal' : ''}`}>
                {link.label}
              </div>
              {link.description && (
                <span className="text-xs text-muted-foreground">{link.description}</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="border-b border-poise-navy/50 bg-poise-navy sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
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

          {/* Desktop Navigation - Marketing Journey */}
          <div className="hidden lg:flex items-center gap-1">
            {renderDropdown("Product", productLinks)}
            {renderDropdown("Solutions", solutionsLinks)}
            {renderDropdown("Demos", demosLinks)}
            {renderDropdown("Investors", investorsLinks)}
            {renderDropdown("Company", companyLinks)}

            {/* Platform - Only shown when logged in */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 text-poise-gold hover:text-amber-300 hover:bg-poise-gold/10 border border-poise-gold/30"
                    data-testid="nav-platform-dropdown"
                  >
                    <Compass className="h-4 w-4" />
                    Platform
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="text-poise-gold">Dashboards</DropdownMenuLabel>
                  {platformLinks.map((link) => (
                    <DropdownMenuItem key={link.path} onClick={() => navigateTo(link.path)} className="flex items-center gap-3">
                      <link.icon className={`h-4 w-4 ${link.color}`} />
                      <span className="font-medium">{link.label}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-poise-teal">Workspaces</DropdownMenuLabel>
                  {workspaceLinks.map((ws) => (
                    <DropdownMenuItem key={ws.path} onClick={() => navigateTo(ws.path)} className="flex items-center gap-3">
                      <ws.icon className={`h-4 w-4 ${ws.color}`} />
                      <div className="flex-1">
                        <span className="font-medium">{ws.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">{ws.phase}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              onClick={() => navigateTo("/try-demo")}
              className="bg-gradient-to-r from-poise-teal to-cyan-600 hover:from-cyan-600 hover:to-poise-teal text-white font-semibold h-9 px-4 shadow-lg shadow-poise-teal/20"
              data-testid="nav-try-demo"
            >
              <Play className="h-4 w-4 mr-1.5" />
              Try Demo
            </Button>
            <Button 
              onClick={() => navigateTo("/pilot-program")}
              variant="outline"
              className="border-poise-gold/50 text-poise-gold hover:bg-poise-gold/10 hover:text-amber-300 h-9 px-4"
              data-testid="nav-start-pilot"
            >
              Start Pilot
            </Button>

            {/* Auth */}
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

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button 
              onClick={() => navigateTo("/try-demo")}
              size="sm"
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white"
              data-testid="nav-mobile-try-demo-btn"
            >
              <Play className="h-4 w-4" />
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {/* Primary CTAs */}
              <Button 
                onClick={() => navigateTo("/try-demo")}
                className="bg-gradient-to-r from-poise-teal to-cyan-600 text-white w-full justify-center h-12 text-base font-semibold"
                data-testid="nav-mobile-try-demo"
              >
                <Play className="h-5 w-5 mr-2" />
                Try Demo
              </Button>
              
              <Button 
                onClick={() => navigateTo("/pilot-program")}
                variant="outline"
                className="border-poise-gold/50 text-poise-gold hover:bg-poise-gold/10 w-full justify-center h-11 mt-2"
                data-testid="nav-mobile-start-pilot"
              >
                Start Pilot
              </Button>

              {/* Ultimate Demo - Featured */}
              <button
                onClick={() => navigateTo("/ultimate-demo")}
                className="flex items-center gap-3 mt-3 py-3 px-4 text-sm font-semibold text-poise-teal bg-poise-teal/10 hover:bg-poise-teal/20 rounded-lg border border-poise-teal/30"
                data-testid="nav-mobile-ultimate-demo"
              >
                <Zap className="h-5 w-5" />
                Ultimate Demo — 72hrs → 12min
              </button>
              
              <div className="border-t border-slate-800 my-3" />
              
              {/* Product */}
              <p className="px-4 py-2 text-xs text-poise-gold uppercase tracking-wide font-semibold">Product</p>
              {productLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className={`text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 ${
                    isActivePath(link.path) ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <link.icon className="h-4 w-4 text-slate-400" />
                  {link.label}
                </button>
              ))}
              
              <div className="border-t border-slate-800 my-3" />
              
              {/* Solutions */}
              <p className="px-4 py-2 text-xs text-poise-teal uppercase tracking-wide font-semibold">Solutions</p>
              {solutionsLinks.map((link) => (
                <button
                  key={link.path + link.label}
                  onClick={() => navigateTo(link.path)}
                  className="text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <link.icon className="h-4 w-4 text-slate-400" />
                  {link.label}
                </button>
              ))}
              
              <div className="border-t border-slate-800 my-3" />
              
              {/* Demos */}
              <p className="px-4 py-2 text-xs text-pink-400 uppercase tracking-wide font-semibold">Demos</p>
              {demosLinks.filter(l => l.path !== '/ultimate-demo').map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className="text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <link.icon className="h-4 w-4 text-slate-400" />
                  {link.label}
                </button>
              ))}
              
              <div className="border-t border-slate-800 my-3" />
              
              {/* Investors */}
              <p className="px-4 py-2 text-xs text-poise-gold uppercase tracking-wide font-semibold">Investors</p>
              {investorsLinks.map((link) => (
                <button
                  key={link.path + link.label}
                  onClick={() => navigateTo(link.path)}
                  className="text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <link.icon className="h-4 w-4 text-slate-400" />
                  {link.label}
                </button>
              ))}
              
              <div className="border-t border-slate-800 my-3" />
              
              {/* Company */}
              <p className="px-4 py-2 text-xs text-slate-500 uppercase tracking-wide font-semibold">Company</p>
              {companyLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className="text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <link.icon className="h-4 w-4 text-slate-400" />
                  {link.label}
                </button>
              ))}

              {/* Platform - Only when logged in */}
              {isAuthenticated && (
                <>
                  <div className="border-t border-slate-800 my-3" />
                  <p className="px-4 py-2 text-xs text-poise-gold uppercase tracking-wide font-semibold">Platform</p>
                  <div className="grid grid-cols-2 gap-2 px-2">
                    {platformLinks.map((link) => (
                      <button
                        key={link.path}
                        onClick={() => navigateTo(link.path)}
                        className={`flex items-center gap-2 py-3 px-3 text-sm ${link.color} hover:bg-slate-800 rounded-lg border border-slate-700`}
                      >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
              
              {/* Auth */}
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