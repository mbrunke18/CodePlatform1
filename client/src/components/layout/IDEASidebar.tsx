import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { ChevronDown, ChevronRight, Menu, X, LogOut, User, Home, Moon, Sun, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigationConfig } from '@/navigation/config';
import { NavigationPhase } from '@/navigation/types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface IDEASidebarProps {
  className?: string;
}

export default function IDEASidebar({ className }: IDEASidebarProps) {
  const [location] = useLocation();
  const [expandedPhases, setExpandedPhases] = useState<string[]>([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user, isAuthenticated, logout, login } = useAuth();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    const activePhase = navigationConfig.phases.find(phase =>
      phase.items.some(item => location.startsWith(item.path.split('?')[0]))
    );
    if (activePhase && !expandedPhases.includes(activePhase.id)) {
      setExpandedPhases(prev => {
        if (prev.includes(activePhase.id)) return prev;
        return [activePhase.id];
      });
    }
  }, [location]);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newDark = !html.classList.contains('dark');
    html.classList.toggle('dark');
    localStorage.setItem('m-theme', newDark ? 'dark' : 'light');
    setIsDark(newDark);
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev =>
      prev.includes(phaseId)
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const isPhaseExpanded = (phaseId: string) => expandedPhases.includes(phaseId);

  const isItemActive = (path: string) => location === path;

  const isPhaseActive = (phase: NavigationPhase) =>
    phase.items.some(item => location.startsWith(item.path.split('/').slice(0, 2).join('/')));

  const renderPhase = (phase: NavigationPhase) => {
    const expanded = isPhaseExpanded(phase.id);
    const active = isPhaseActive(phase);

    return (
      <div key={phase.id} className="mb-1">
        <button
          onClick={() => togglePhase(phase.id)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200',
            'hover:bg-white/10 dark:hover:bg-white/5',
            active && 'bg-white/10 dark:bg-white/5'
          )}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{phase.icon}</span>
            <div className="text-left">
              <div className={cn(
                'font-semibold text-sm bg-gradient-to-r bg-clip-text text-transparent',
                phase.color
              )}>
                {phase.label}
              </div>
              <div className="text-xs text-gray-600 dark:text-slate-400 font-medium">
                {phase.tagline}
              </div>
            </div>
          </div>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {expanded && (
          <div className="ml-4 mt-1 space-y-0.5 border-l border-border/50 pl-3">
            {phase.items.map(item => (
              <Link 
                key={item.id} 
                href={item.path}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150',
                  'hover:bg-white/10 dark:hover:bg-white/5',
                  isItemActive(item.path)
                    ? 'bg-white/15 dark:bg-white/10 font-medium text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white'
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <span className="text-base">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <Link href="/mission-control" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-poise-gold to-poise-teal flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-white/90" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight group-hover:text-poise-gold transition-colors">
              Execution OS One™
            </h1>
            <p className="text-xs text-gray-600 dark:text-slate-400 font-medium">
              Strategic Execution OS
            </p>
          </div>
        </Link>
        <div className="mt-3 flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
          <span className="px-1.5 py-0.5 rounded bg-[#F8F7F4] dark:bg-[#0A0F2E]/20 text-[#0A0F2E] dark:text-[#C9A84C] font-medium">Identify</span>
          <span>→</span>
          <span className="px-1.5 py-0.5 rounded bg-[#0A0F2E] dark:bg-[#C9A84C]/20 text-[#C9A84C] dark:text-[#C9A84C] font-medium">Detect</span>
          <span>→</span>
          <span className="px-1.5 py-0.5 rounded bg-[#C9A84C]/10 dark:bg-[#C9A84C]/20 text-[#C9A84C] dark:text-[#DFC178] font-medium">Execute</span>
          <span>→</span>
          <span className="px-1.5 py-0.5 rounded bg-[#2B8A6E]/10 dark:bg-[#2B8A6E]/20 text-[#2B8A6E] dark:text-[#3BAF8A] font-medium">Advance</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navigationConfig.phases.slice(0, 4).map(renderPhase)}
        
        <div className="my-3 border-t border-border/30" />
        
        {navigationConfig.phases.slice(4).map(renderPhase)}
      </nav>

      <div className="p-3 border-t border-border/50 space-y-2">
        <div className="flex items-center gap-2">
          <Link 
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link
            href="/onboarding-guide"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 transition-colors"
            title="Onboarding Guide"
          >
            <BookOpen className="h-4 w-4" />
            <span>Guide</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
        
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-poise-gold to-poise-teal flex items-center justify-center text-white text-sm font-medium">
              {user.initials || user.firstName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.firstName || user.email}</div>
              <div className="text-xs text-muted-foreground">Signed in</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-8 w-8 text-muted-foreground hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => login()}
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <User className="h-4 w-4" />
            Sign In
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-72 bg-background border-r border-border',
          'transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:static',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
