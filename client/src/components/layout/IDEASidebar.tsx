import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigationConfig } from '@/navigation/config';
import { NavigationPhase } from '@/navigation/types';
import { Button } from '@/components/ui/button';

interface IDEASidebarProps {
  className?: string;
}

export default function IDEASidebar({ className }: IDEASidebarProps) {
  const [location] = useLocation();
  const [expandedPhases, setExpandedPhases] = useState<string[]>(['identify']);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
              <div className="text-[10px] text-muted-foreground opacity-70">
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
              <Link key={item.id} href={item.path}>
                <a
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150',
                    'hover:bg-white/10 dark:hover:bg-white/5',
                    isItemActive(item.path)
                      ? 'bg-white/15 dark:bg-white/10 font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </a>
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
        <Link href="/mission-control">
          <a className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-poise-gold to-poise-teal flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-white/90" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight group-hover:text-poise-gold transition-colors">
                ExecuteIQ One™
              </h1>
              <p className="text-[10px] text-muted-foreground">
                Strategic Execution OS
              </p>
            </div>
          </a>
        </Link>
        <div className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground">
          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">Identify</span>
          <span>→</span>
          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">Detect</span>
          <span>→</span>
          <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400">Execute</span>
          <span>→</span>
          <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">Advance</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navigationConfig.phases.slice(0, 4).map(renderPhase)}
        
        <div className="my-3 border-t border-border/30" />
        
        {navigationConfig.phases.slice(4).map(renderPhase)}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="text-[10px] text-muted-foreground text-center">
          💡 Following IDEA framework for strategic execution
        </div>
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
