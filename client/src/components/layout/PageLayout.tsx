import { ReactNode, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import StandardNav from './StandardNav';
import Footer from './Footer';
import { BackButton } from '@/components/ui/back-button';
import { useAuth } from '@/hooks/useAuth';
import { ChevronRight } from 'lucide-react';
import { GuestPreviewBanner } from '@/components/GuestPreviewBanner';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  showBackButton?: boolean;
  backButtonLabel?: string;
  embedded?: boolean;
}

const ROUTE_MAP: Record<string, { label: string; section: string }> = {
  '/mission-control':          { label: 'Mission Control', section: 'Platform' },
  '/workspace':                { label: 'Execution Workspace', section: 'Platform' },
  '/intelligence-hub':         { label: 'Intelligence Control Center', section: 'Platform' },
  '/ai-intelligence':          { label: 'Intelligence Hub', section: 'Platform' },
  '/settings-hub':             { label: 'Settings Hub', section: 'Platform' },
  '/organization-setup':       { label: 'Organization Setup', section: 'Platform' },
  '/task-management':          { label: 'Task Library', section: 'Execute' },
  '/stakeholder-management':   { label: 'Stakeholder Management', section: 'Platform' },
  '/playbooks':                { label: 'Prepared Response Library', section: 'Identify' },
  '/strategic':                { label: 'Strategic Planning Hub', section: 'Identify' },
  '/what-if-analyzer':         { label: 'What-If Analyzer', section: 'Identify' },
  '/playbook-customization':   { label: 'Response Customization', section: 'Identify' },
  '/preparedness-report':      { label: 'Preparedness Report', section: 'Identify' },
  '/playbook-command':         { label: 'Response Command', section: 'Identify' },
  '/board-briefings':          { label: 'Board Briefings', section: 'Identify' },
  '/ai-radar':                 { label: 'Signal Radar Dashboard', section: 'Detect' },
  '/foresight-radar':          { label: 'Foresight Radar', section: 'Detect' },
  '/signal-intelligence':      { label: 'Signal Intelligence', section: 'Detect' },
  '/incident-analyzer':        { label: 'Incident Analyzer', section: 'Detect' },
  '/live-activation':          { label: 'Live Activation Center', section: 'Execute' },
  '/crisis':                   { label: 'Crisis Response', section: 'Execute' },
  '/execution-coordination':   { label: 'Execution Coordination', section: 'Execute' },
  '/decision-velocity':        { label: 'Decision Velocity', section: 'Execute' },
  '/war-room':                 { label: 'War Room', section: 'Execute' },
  '/decision-tree':            { label: 'Decision Tree Builder', section: 'Execute' },
  '/integration-hub':          { label: 'Integration Hub', section: 'Execute' },
  '/advanced-analytics':       { label: 'Advanced Analytics', section: 'Advance' },
  '/execution-history':        { label: 'Execution History', section: 'Advance' },
  '/enterprise-metrics':       { label: 'Enterprise Metrics', section: 'Advance' },
  '/audit-logging':            { label: 'Audit Logging', section: 'Advance' },
  '/prism-insights':           { label: 'Prism Insights', section: 'Advance' },
  '/dashboard':                { label: 'Executive Dashboard', section: 'Platform' },
  '/readiness-assessment':     { label: 'Readiness Assessment', section: 'Identify' },
  '/simulation-studio':        { label: 'Shadow Strategy Simulator', section: 'Experience' },
  '/practice-drills':          { label: 'Practice Drills', section: 'Experience' },
  '/onboarding':               { label: 'Onboarding', section: 'Platform' },
  '/ecosystem':                { label: 'Microsoft Ecosystem', section: 'Platform' },
};

const SECTION_COLORS: Record<string, string> = {
  Platform: '#0A0F2E',
  Identify: '#2B8A6E',
  Detect:   '#C9A84C',
  Execute:  '#0A0F2E',
  Advance:  '#2B8A6E',
  Experience: '#C9A84C',
};

function Breadcrumb({ location }: { location: string }) {
  const base = '/' + location.split('/').filter(Boolean)[0];
  const route = ROUTE_MAP[base] || ROUTE_MAP[location];
  if (!route) return null;

  const sectionColor = SECTION_COLORS[route.section] || '#0A0F2E';

  return (
    <div style={{ background: '#FAFAF8', borderBottom: '1px solid rgba(201,168,76,0.1)', padding: '0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34 }}>
          <Link href="/mission-control">
            <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', cursor: 'pointer', letterSpacing: '0.02em' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0A0F2E'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9CA3AF'; }}>
              Platform
            </span>
          </Link>
          <ChevronRight style={{ width: 12, height: 12, color: '#D1D5DB' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: sectionColor, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>{route.section}</span>
          <ChevronRight style={{ width: 12, height: 12, color: '#D1D5DB' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#1F2937', letterSpacing: '0.02em' }}>{route.label}</span>
        </div>
      </div>
    </div>
  );
}

export default function PageLayout({ 
  children, 
  className = "",
  showBackButton = false,
  backButtonLabel = "Back",
  embedded = false
}: PageLayoutProps) {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

  // Scroll lock cleanup on location change
  useEffect(() => {
    try {
      [document.body, document.documentElement].forEach((el) => {
        if (!el) return;
        el.removeAttribute('data-scroll-locked');
        el.style.overflow = '';
        el.style.paddingRight = '';
      });
    } catch (_) {}
  }, [location]);

  // Scroll to top on mount — this fires after the page component has rendered,
  // catching cases where the global ScrollToTop timer fires before lazy-load completes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  if (embedded) {
    return <div className={className}>{children}</div>;
  }

  const showBreadcrumb = isAuthenticated && !!ROUTE_MAP['/' + location.split('/').filter(Boolean)[0]];

  return (
    <div className={`min-h-screen flex flex-col page-background ${className}`}>
      <StandardNav />
      <GuestPreviewBanner />

      {showBreadcrumb && <Breadcrumb location={location} />}
      
      {showBackButton && (
        <div style={{ background: '#fff', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
            <BackButton label={backButtonLabel} />
          </div>
        </div>
      )}
      
      <main className="flex-1 w-full">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
