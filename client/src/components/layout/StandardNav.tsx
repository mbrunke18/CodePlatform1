import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Menu, X, LogIn, LogOut, User, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
    { label: "Why M", path: "/why-m" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Decision Velocity", path: "/decisions" },
    { label: "Pilot Program", path: "/pilot-program" },
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
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => navigateTo('/')}
            data-testid="nav-logo"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-white text-lg">M</span>
              <span className="text-slate-500 text-xs ml-1.5 hidden lg:inline">Strategic Execution OS</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navigateTo("/why-m")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActivePath("/why-m") 
                  ? 'text-white bg-slate-800' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              data-testid="nav-why-m"
            >
              Why M
            </button>
            <button
              onClick={() => navigateTo("/how-it-works")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActivePath("/how-it-works") 
                  ? 'text-white bg-slate-800' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              data-testid="nav-how-it-works"
            >
              How It Works
            </button>
            
            {/* Playbooks Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
                    isActivePath("/playbook") 
                      ? 'text-white bg-slate-800' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                  data-testid="nav-playbooks-dropdown"
                >
                  Playbooks
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => navigateTo("/playbooks")} data-testid="nav-playbooks-library">
                  Library (166 Templates)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/playbook-management")} data-testid="nav-playbooks-manage">
                  Manage Playbooks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/task-management")} data-testid="nav-task-manage">
                  Task Management
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo("/stakeholder-management")} data-testid="nav-stakeholder-manage">
                  Stakeholder Directory
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => navigateTo("/decisions")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActivePath("/decisions") 
                  ? 'text-white bg-slate-800' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              data-testid="nav-decision-velocity"
            >
              Decision Velocity
            </button>
            <button
              onClick={() => navigateTo("/pilot-program")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActivePath("/pilot-program") 
                  ? 'text-white bg-slate-800' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              data-testid="nav-pilot-program"
            >
              Pilot Program
            </button>
            <button
              onClick={() => navigateTo("/pricing")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActivePath("/pricing") 
                  ? 'text-white bg-slate-800' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              data-testid="nav-pricing"
            >
              Pricing
            </button>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              onClick={() => navigateTo("/sandbox-demo")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold h-9 px-4"
              data-testid="nav-try-it"
            >
              <Play className="h-4 w-4 mr-1.5" />
              Try It
            </Button>
            <Button 
              onClick={() => navigateTo("/demo")}
              variant="outline"
              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-950 hover:text-emerald-300 h-9 px-4"
              data-testid="nav-see-demo"
            >
              Watch Demo
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigateTo("/investor-demo")}
              className="border-purple-500/50 text-purple-300 hover:bg-purple-950 hover:text-purple-200 h-9 px-4"
              data-testid="nav-investors"
            >
              Investors
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
              onClick={() => navigateTo("/sandbox-demo")}
              size="sm"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
              data-testid="nav-mobile-try-it"
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              {/* Main Links */}
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
              
              {/* Divider */}
              <div className="border-t border-slate-800 my-2" />
              
              {/* CTAs */}
              <Button 
                onClick={() => navigateTo("/sandbox-demo")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-full justify-center h-11"
                data-testid="nav-mobile-try-it-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Try It Yourself
              </Button>
              
              <Button 
                onClick={() => navigateTo("/demo")}
                variant="outline"
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-950 w-full justify-center h-11 mt-2"
                data-testid="nav-mobile-see-demo-full"
              >
                Watch Demo
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigateTo("/investor-demo")}
                className="border-purple-500/50 text-purple-300 hover:bg-purple-950 w-full justify-center h-11 mt-2"
                data-testid="nav-mobile-investors"
              >
                Investors
              </Button>
              
              {/* Divider */}
              <div className="border-t border-slate-800 my-2" />
              
              {/* Secondary Links */}
              <div className="grid grid-cols-2 gap-1">
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
                <button
                  onClick={() => navigateTo("/executive-dashboard")}
                  className="text-left py-2 px-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  data-testid="nav-mobile-dashboard"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigateTo("/roadshow-resources")}
                  className="text-left py-2 px-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  data-testid="nav-mobile-resources"
                >
                  Resources
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
