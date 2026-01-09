import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Menu, X, LogIn, LogOut, User, ChevronDown, Brain, Target, Lightbulb } from "lucide-react";
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
    <nav className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => navigateTo('/')}
            data-testid="nav-logo"
          >
            <img 
              src={poiseLogoPath} 
              alt="POISE - Composure in every decision" 
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation Links - Simplified Journey */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigateTo(link.path)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  (link as any).featured
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    : isActivePath(link.path) 
                      ? 'text-white bg-slate-800' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
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
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2 text-blue-400">
                  <Brain className="h-3 w-3" />
                  Predictive Intelligence
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
                <DropdownMenuItem onClick={() => navigateTo("/competitive-positioning")} data-testid="nav-competitive-positioning">
                  Why POISE Wins (vs. Competitors)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/pilot-program")} data-testid="nav-pilot-program">
                  Pilot Program
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
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold h-9 px-4"
              data-testid="nav-try-demo"
            >
              <Play className="h-4 w-4 mr-1.5" />
              Try Demo
            </Button>
            <Button 
              onClick={() => navigateTo("/pilot-program")}
              variant="outline"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-950 hover:text-blue-300 h-9 px-4"
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
              
              {/* Predictive Intelligence Links */}
              <p className="px-4 py-2 text-xs text-blue-400 uppercase tracking-wide flex items-center gap-2">
                <Brain className="h-3 w-3" />
                Predictive Intelligence
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
              
              {/* More Links - Collapsed section */}
              <p className="px-4 py-2 text-xs text-slate-500 uppercase tracking-wide">More</p>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => navigateTo("/competitive-positioning")}
                  className="text-left py-2 px-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg col-span-2"
                  data-testid="nav-mobile-competitive-positioning"
                >
                  Why POISE Wins (vs. Competitors)
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
                  className="text-left py-2 px-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
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
