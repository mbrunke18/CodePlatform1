import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Menu, X, LogIn, LogOut, User, ChevronDown, Brain, Target, Lightbulb, BarChart3, Layers, TrendingUp, Briefcase, Zap, BookOpen, GraduationCap } from "lucide-react";
import poiseLogoPath from "@assets/poise-logo-official.png";
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
  };

  const navLinks = [
    { label: "Why POISE", path: "/why-poise" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Playbooks", path: "/playbooks" },
    { label: "POISE One™", path: "/mission-control", featured: true },
    { label: "Pricing", path: "/pricing" },
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-poise-navy/80 to-poise-dark-gray/60 border border-poise-gold/30">
              <img 
                src={poiseLogoPath} 
                alt="POISE - Composure in every decision" 
                className="h-9 sm:h-10 md:h-11 w-auto object-contain brightness-110 contrast-105"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
              />
            </div>
          </div>

          {/* Desktop Navigation Links - Simplified Journey */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigateTo(link.path)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
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
            
            {/* More Dropdown for secondary items */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 text-slate-400 hover:text-white hover:bg-slate-800/50"
                  data-testid="nav-more-dropdown"
                >
                  More
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {/* Executive Intelligence - HIGH VALUE */}
                <DropdownMenuLabel className="flex items-center gap-2 text-poise-gold">
                  <BarChart3 className="h-3 w-3" />
                  Executive Intelligence
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigateTo("/executive-dashboard")} data-testid="nav-executive-dashboard">
                  <Briefcase className="h-4 w-4 mr-2 text-poise-gold" />
                  Executive Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/operating-model")} data-testid="nav-operating-model">
                  <Layers className="h-4 w-4 mr-2 text-indigo-400" />
                  Operating Model Alignment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/roi-calculator")} data-testid="nav-roi-calculator">
                  <TrendingUp className="h-4 w-4 mr-2 text-emerald-400" />
                  ROI Calculator
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/board-export")} data-testid="nav-board-export">
                  <Briefcase className="h-4 w-4 mr-2 text-purple-400" />
                  Board-Ready Export
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {/* Predictive Tools */}
                <DropdownMenuLabel className="flex items-center gap-2 text-blue-400">
                  <Brain className="h-3 w-3" />
                  Predictive Tools
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigateTo("/triggers-management")} data-testid="nav-trigger-forecasting">
                  <Target className="h-4 w-4 mr-2 text-purple-400" />
                  Trigger Forecasting
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/what-if-analyzer")} data-testid="nav-what-if-analyzer">
                  <Lightbulb className="h-4 w-4 mr-2 text-amber-400" />
                  What-If Analyzer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {/* Interactive Demos */}
                <DropdownMenuLabel className="flex items-center gap-2 text-poise-teal">
                  <Zap className="h-3 w-3" />
                  Interactive Demos
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigateTo("/executive-simulation")} data-testid="nav-executive-simulation">
                  <Play className="h-4 w-4 mr-2 text-poise-teal" />
                  Executive Simulation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/sandbox-demo")} data-testid="nav-sandbox-demo">
                  <Zap className="h-4 w-4 mr-2 text-pink-400" />
                  Interactive Sandbox
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/live-demo")} data-testid="nav-live-demo">
                  <Play className="h-4 w-4 mr-2 text-blue-400" />
                  One-Click Live Demo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {/* Learn & About */}
                <DropdownMenuLabel className="flex items-center gap-2 text-slate-400">
                  <GraduationCap className="h-3 w-3" />
                  Learn & About
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigateTo("/how-it-works")} data-testid="nav-how-it-works">
                  <BookOpen className="h-4 w-4 mr-2 text-slate-400" />
                  How It Works
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/competitive-positioning")} data-testid="nav-competitive-positioning">
                  Why POISE Wins
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/research")} data-testid="nav-research">
                  Research
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/our-story")} data-testid="nav-our-story">
                  Our Story
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
              onClick={() => navigateTo("/pilot-demo")}
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
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-300">{user.firstName || user.email?.split('@')[0]}</span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="text-slate-400 hover:text-white hover:bg-slate-800 h-9 px-3"
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
                className="text-slate-400 hover:text-white hover:bg-slate-800 h-9 px-3"
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
              onClick={() => navigateTo("/pilot-demo")}
              size="sm"
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white"
              data-testid="nav-mobile-try-demo"
            >
              <Play className="h-4 w-4" />
            </Button>
            <button
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="nav-mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Simplified to match desktop journey */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              {/* Main Links - Guided Journey */}
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className={`text-left py-3 px-4 rounded-lg transition-colors ${
                    (link as any).featured
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium'
                      : isActivePath(link.path)
                        ? 'text-white bg-slate-800'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  data-testid={`nav-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </button>
              ))}
              
              {/* Divider */}
              <div className="border-t border-slate-800 my-2" />
              
              {/* Primary CTAs */}
              <Button 
                onClick={() => navigateTo("/pilot-demo")}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white w-full justify-center h-11"
                data-testid="nav-mobile-try-demo"
              >
                <Play className="h-4 w-4 mr-2" />
                Try Demo
              </Button>
              
              <Button 
                onClick={() => navigateTo("/pilot-program")}
                variant="outline"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-950 w-full justify-center h-11 mt-2"
                data-testid="nav-mobile-start-pilot"
              >
                Start Pilot
              </Button>
              
              {/* Divider */}
              <div className="border-t border-slate-800 my-2" />
              
              {/* Executive Intelligence - HIGH VALUE */}
              <p className="px-4 py-2 text-xs text-poise-gold uppercase tracking-wide flex items-center gap-2">
                <BarChart3 className="h-3 w-3" />
                Executive Intelligence
              </p>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => navigateTo("/executive-dashboard")}
                  className="text-left py-2 px-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  data-testid="nav-mobile-executive-dashboard"
                >
                  <Briefcase className="h-4 w-4 text-poise-gold" />
                  Executive Dashboard
                </button>
                <button
                  onClick={() => navigateTo("/operating-model")}
                  className="text-left py-2 px-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  data-testid="nav-mobile-operating-model"
                >
                  <Layers className="h-4 w-4 text-indigo-400" />
                  Operating Model
                </button>
                <button
                  onClick={() => navigateTo("/roi-calculator")}
                  className="text-left py-2 px-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  data-testid="nav-mobile-roi-calculator"
                >
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  ROI Calculator
                </button>
                <button
                  onClick={() => navigateTo("/board-export")}
                  className="text-left py-2 px-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  data-testid="nav-mobile-board-export"
                >
                  <Briefcase className="h-4 w-4 text-purple-400" />
                  Board Export
                </button>
              </div>
              
              {/* Divider */}
              <div className="border-t border-slate-800 my-2" />
              
              {/* Predictive Tools */}
              <p className="px-4 py-2 text-xs text-blue-400 uppercase tracking-wide flex items-center gap-2">
                <Brain className="h-3 w-3" />
                Predictive Tools
              </p>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => navigateTo("/triggers-management")}
                  className="text-left py-2 px-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  data-testid="nav-mobile-trigger-forecasting"
                >
                  <Target className="h-4 w-4 text-purple-400" />
                  Trigger Forecasting
                </button>
                <button
                  onClick={() => navigateTo("/what-if-analyzer")}
                  className="text-left py-2 px-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  data-testid="nav-mobile-what-if-analyzer"
                >
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  What-If Analyzer
                </button>
              </div>
              
              {/* Divider */}
              <div className="border-t border-slate-800 my-2" />
              
              {/* Interactive Demos */}
              <p className="px-4 py-2 text-xs text-poise-teal uppercase tracking-wide flex items-center gap-2">
                <Zap className="h-3 w-3" />
                Interactive Demos
              </p>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => navigateTo("/executive-simulation")}
                  className="text-left py-2 px-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  data-testid="nav-mobile-exec-simulation"
                >
                  <Play className="h-4 w-4 text-poise-teal" />
                  Executive Simulation
                </button>
                <button
                  onClick={() => navigateTo("/sandbox-demo")}
                  className="text-left py-2 px-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  data-testid="nav-mobile-sandbox"
                >
                  <Zap className="h-4 w-4 text-pink-400" />
                  Sandbox Demo
                </button>
              </div>
              
              {/* Divider */}
              <div className="border-t border-slate-800 my-2" />
              
              {/* Learn & About */}
              <p className="px-4 py-2 text-xs text-slate-500 uppercase tracking-wide flex items-center gap-2">
                <GraduationCap className="h-3 w-3" />
                Learn & About
              </p>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => navigateTo("/how-it-works")}
                  className="text-left py-2 px-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  data-testid="nav-mobile-how-it-works"
                >
                  How It Works
                </button>
                <button
                  onClick={() => navigateTo("/competitive-positioning")}
                  className="text-left py-2 px-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  data-testid="nav-mobile-competitive-positioning"
                >
                  Why POISE Wins
                </button>
                <button
                  onClick={() => navigateTo("/research")}
                  className="text-left py-2 px-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  data-testid="nav-mobile-research"
                >
                  Research
                </button>
                <button
                  onClick={() => navigateTo("/our-story")}
                  className="text-left py-2 px-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  data-testid="nav-mobile-our-story"
                >
                  Our Story
                </button>
                <button
                  onClick={() => navigateTo("/contact")}
                  className="text-left py-2 px-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg col-span-2"
                  data-testid="nav-mobile-contact"
                >
                  Contact
                </button>
              </div>
              
              {/* Management Links (for logged-in users) */}
              {isAuthenticated && (
                <>
                  <div className="border-t border-slate-800 my-2" />
                  <p className="px-3 py-1 text-xs text-slate-500 uppercase tracking-wider">Management</p>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => navigateTo("/playbook-management")}
                      className="text-left py-2 px-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                      data-testid="nav-mobile-playbook-mgmt"
                    >
                      Playbooks
                    </button>
                    <button
                      onClick={() => navigateTo("/task-management")}
                      className="text-left py-2 px-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                      data-testid="nav-mobile-task-mgmt"
                    >
                      Tasks
                    </button>
                    <button
                      onClick={() => navigateTo("/stakeholder-management")}
                      className="text-left py-2 px-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                      data-testid="nav-mobile-stakeholder-mgmt"
                    >
                      Stakeholders
                    </button>
                    <button
                      onClick={() => navigateTo("/triggers-management")}
                      className="text-left py-2 px-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                      data-testid="nav-mobile-triggers-mgmt"
                    >
                      Triggers
                    </button>
                  </div>
                </>
              )}
              
              {/* Auth */}
              <div className="border-t border-slate-800 my-2" />
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-300">{user.firstName || user.email}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={logout}
                    className="text-slate-400 hover:text-white"
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
