import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Menu, X, LogIn, LogOut, User, ChevronDown, Brain, Target, Lightbulb, BarChart3, Layers, TrendingUp, Briefcase, Zap, BookOpen, GraduationCap, ClipboardList, Radar, Compass, Building } from "lucide-react";
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
    setLocation(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const navLinks = [
    { label: "How It Works", path: "/how-it-works" },
    { label: "Playbooks", path: "/playbooks" },
    { label: "For Investors", path: "/investors" },
    { label: "Pricing", path: "/pricing" },
  ];

  const workspaceLinks = [
    { label: "Playbook Factory", path: "/workspaces/identify", phase: "IDENTIFY", module: "Playbook™", icon: ClipboardList, color: "text-poise-gold" },
    { label: "Signal Ops", path: "/workspaces/detect", phase: "DETECT", module: "Signal™", icon: Radar, color: "text-poise-teal" },
    { label: "Compass Command", path: "/workspaces/execute", phase: "EXECUTE", module: "Compass™", icon: Compass, color: "text-poise-teal" },
    { label: "Retrospect Lab", path: "/workspaces/advance", phase: "ADVANCE", module: "Retrospect™", icon: TrendingUp, color: "text-poise-gold" },
  ];

  const dashboardLinks = [
    { label: "ExecuteIQ One™ Overview", path: "/mission-control", icon: Compass, color: "text-poise-gold", featured: true },
    { label: "Signal Intelligence", path: "/signal-intelligence", icon: Radar, color: "text-poise-teal" },
    { label: "Strategy Execution", path: "/strategy-execution", icon: TrendingUp, color: "text-poise-teal" },
    { label: "Executive Dashboard", path: "/executive-dashboard", icon: BarChart3, color: "text-poise-gold" },
  ];

  const isActivePath = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

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

          {/* Desktop Navigation Links - Simplified Journey */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigateTo(link.path)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  (link as any).featured
                    ? 'bg-gradient-to-r from-poise-gold to-amber-500 text-poise-navy font-semibold hover:from-amber-500 hover:to-poise-gold shadow-lg shadow-poise-gold/20'
                    : isActivePath(link.path) 
                      ? 'text-white bg-poise-teal/20 border border-poise-teal/40' 
                      : 'text-slate-300 hover:text-white hover:bg-poise-teal/10'
                }`}
                data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </button>
            ))}
            
            {/* Workspaces Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 text-slate-300 hover:text-white hover:bg-poise-teal/10 border border-poise-teal/30"
                  data-testid="nav-workspaces-dropdown"
                >
                  <Compass className="h-4 w-4 text-poise-teal" />
                  Workspaces
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel className="text-slate-400">IDEA Framework Workspaces</DropdownMenuLabel>
                {workspaceLinks.map((ws) => (
                  <DropdownMenuItem key={ws.path} onClick={() => navigateTo(ws.path)} className="flex items-center gap-3">
                    <ws.icon className={`h-4 w-4 ${ws.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{ws.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{ws.phase} • {ws.module}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dashboards Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 text-poise-gold hover:text-amber-300 hover:bg-poise-gold/10 border border-poise-gold/30"
                  data-testid="nav-dashboards-dropdown"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboards
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-poise-gold">Executive Dashboards</DropdownMenuLabel>
                {dashboardLinks.map((db) => (
                  <DropdownMenuItem key={db.path} onClick={() => navigateTo(db.path)} className="flex items-center gap-3">
                    <db.icon className={`h-4 w-4 ${db.color}`} />
                    <span>{db.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* More Dropdown for secondary items */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800/50"
                  data-testid="nav-more-dropdown"
                >
                  More
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                {/* IDENTIFY - ExecuteIQ Playbook™ */}
                <DropdownMenuLabel className="flex items-center gap-2 text-poise-gold">
                  <ClipboardList className="h-3 w-3" />
                  IDENTIFY
                  <span className="text-xs text-poise-gold/70 ml-1">Playbook™</span>
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigateTo("/playbooks")} data-testid="nav-playbooks">
                  Playbook Library (166)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/strategic")} data-testid="nav-strategic">
                  Scenario Planning Hub
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/what-if-analyzer")} data-testid="nav-what-if-analyzer">
                  What-If Analyzer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/board-briefings")} data-testid="nav-board-briefings">
                  Board Briefings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {/* DETECT - ExecuteIQ Signal™ */}
                <DropdownMenuLabel className="flex items-center gap-2 text-poise-teal">
                  <Radar className="h-3 w-3" />
                  DETECT
                  <span className="text-xs text-poise-teal/70 ml-1">Signal™</span>
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigateTo("/signal-intelligence")} data-testid="nav-signal-intelligence">
                  Signal Intelligence Hub
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/triggers-management")} data-testid="nav-triggers">
                  AI Trigger Monitoring
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/ai-radar")} data-testid="nav-ai-radar">
                  AI Radar Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/pulse-intelligence")} data-testid="nav-pulse">
                  Weak Signal Detection
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {/* EXECUTE - ExecuteIQ Compass™ */}
                <DropdownMenuLabel className="flex items-center gap-2 text-poise-teal">
                  <Compass className="h-3 w-3" />
                  EXECUTE
                  <span className="text-xs text-poise-teal/70 ml-1">Compass™</span>
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigateTo("/command-center")} data-testid="nav-command-center">
                  Command Center
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/crisis")} data-testid="nav-crisis">
                  Crisis Response
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/war-room")} data-testid="nav-war-room">
                  Situation Room
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/collaboration")} data-testid="nav-collaboration">
                  Team Collaboration
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {/* ADVANCE - ExecuteIQ Retrospect™ */}
                <DropdownMenuLabel className="flex items-center gap-2 text-poise-gold">
                  <TrendingUp className="h-3 w-3" />
                  ADVANCE
                  <span className="text-xs text-poise-gold/70 ml-1">Retrospect™</span>
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigateTo("/institutional-memory")} data-testid="nav-institutional-memory">
                  Institutional Memory
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/decision-velocity")} data-testid="nav-decision-velocity">
                  Decision Velocity
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/executive-dashboard")} data-testid="nav-executive-dashboard">
                  Executive Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/analytics")} data-testid="nav-analytics">
                  Executive Analytics
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {/* Demos */}
                <DropdownMenuLabel className="flex items-center gap-2 text-pink-400">
                  <Play className="h-3 w-3" />
                  Demos
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigateTo("/executive-simulation")} data-testid="nav-executive-simulation">
                  Executive Simulation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/sandbox-demo")} data-testid="nav-sandbox-demo">
                  Interactive Sandbox
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/investor-demo")} data-testid="nav-investor-demo">
                  Investor Demo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/platform-overview")} data-testid="nav-platform-overview">
                  Platform Overview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/product-tour")} data-testid="nav-product-tour">
                  Product Tour
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { window.location.href = '/ultimate-demo'; }} data-testid="nav-ultimate-demo">
                  Ultimate Demo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {/* Company */}
                <DropdownMenuLabel className="flex items-center gap-2 text-slate-400">
                  <Building className="h-3 w-3" />
                  Company
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigateTo("/how-it-works")} data-testid="nav-how-it-works">
                  How It Works
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/our-story")} data-testid="nav-our-story">
                  Our Story
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/founder-story")} data-testid="nav-founder-story">
                  Founder's Story (Video)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/why-executeiq")} data-testid="nav-why-executeiq">
                  Why ExecuteIQ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/integrations")} data-testid="nav-integrations">
                  Integrations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/contact")} data-testid="nav-contact">
                  Contact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop CTAs - Simplified */}
          <div className="hidden md:flex items-center gap-3">
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
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
                  <User className="h-4 w-4 text-slate-300" />
                  <span className="text-sm text-slate-300">{user.firstName || user.email?.split('@')[0]}</span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="text-slate-300 hover:text-white hover:bg-slate-800 h-9 px-3"
                  data-testid="nav-logout"
                >
                  <LogOut className="h-4 w-4 lg:mr-1.5" />
                  <span className="hidden lg:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                onClick={login}
                className="text-slate-300 hover:text-white hover:bg-slate-800 h-9 px-3"
                data-testid="nav-login"
              >
                <LogIn className="h-4 w-4 lg:mr-1.5" />
                <span className="hidden lg:inline">Sign In</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button 
              onClick={() => navigateTo("/try-demo")}
              size="sm"
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white"
              data-testid="nav-mobile-try-demo"
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

        {/* Mobile Menu - Simplified primary journey */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 animate-in slide-in-from-top-2 duration-200 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {/* Primary CTAs - Most prominent */}
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
              
              <div className="border-t border-slate-800 my-3" />
              
              {/* Main Navigation Links */}
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className={`text-left py-3 px-4 rounded-lg transition-colors ${
                    isActivePath(link.path)
                      ? 'text-white bg-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  data-testid={`nav-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </button>
              ))}
              
              <div className="border-t border-slate-800 my-3" />
              
              {/* Quick Access - Most used features */}
              <p className="px-4 py-2 text-xs text-white/50 uppercase tracking-wide">Quick Access</p>
              <div className="grid grid-cols-2 gap-2 px-2">
                <button
                  onClick={() => navigateTo("/mission-control")}
                  className="flex items-center gap-2 py-3 px-3 text-sm text-poise-gold hover:bg-poise-gold/10 rounded-lg border border-poise-gold/30"
                  data-testid="nav-mobile-mission-control"
                >
                  <Compass className="h-4 w-4" />
                  ExecuteIQ One™
                </button>
                <button
                  onClick={() => navigateTo("/playbooks")}
                  className="flex items-center gap-2 py-3 px-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700"
                  data-testid="nav-mobile-playbooks"
                >
                  <ClipboardList className="h-4 w-4" />
                  166 Playbooks
                </button>
                <button
                  onClick={() => navigateTo("/signal-intelligence")}
                  className="flex items-center gap-2 py-3 px-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700"
                  data-testid="nav-mobile-signal-intel"
                >
                  <Radar className="h-4 w-4" />
                  Signal Hub
                </button>
                <button
                  onClick={() => navigateTo("/executive-dashboard")}
                  className="flex items-center gap-2 py-3 px-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700"
                  data-testid="nav-mobile-exec-dashboard"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => { window.location.href = '/ultimate-demo'; }}
                  className="flex items-center gap-2 py-3 px-3 text-sm text-pink-400 hover:bg-pink-500/10 rounded-lg border border-pink-500/30 col-span-2"
                  data-testid="nav-mobile-ultimate-demo"
                >
                  <Zap className="h-4 w-4" />
                  Ultimate Demo — 72hrs → 12min
                </button>
              </div>
              
              <div className="border-t border-slate-800 my-3" />
              
              {/* Company Links */}
              <div className="flex flex-wrap gap-2 px-4">
                <button
                  onClick={() => navigateTo("/contact")}
                  className="text-sm text-slate-300 hover:text-white"
                >
                  Contact
                </button>
                <span className="text-slate-600">•</span>
                <button
                  onClick={() => navigateTo("/our-story")}
                  className="text-sm text-slate-300 hover:text-white"
                >
                  Our Story
                </button>
                <span className="text-slate-600">•</span>
                <button
                  onClick={() => navigateTo("/integrations")}
                  className="text-sm text-slate-300 hover:text-white"
                >
                  Integrations
                </button>
              </div>
              
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
