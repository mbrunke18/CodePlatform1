import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import IDEASidebar from './IDEASidebar';
import StandardNav from './StandardNav';
import Footer from './Footer';
import { cn } from '@/lib/utils';
import { BackButton } from '@/components/ui/back-button';
import { GuestPreviewBanner } from '@/components/GuestPreviewBanner';
import { useAuth } from '@/hooks/useAuth';
import { useTrial } from '@/hooks/useTrial';
import { Lock, LogIn, ArrowRight } from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

function AccessGate() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{
        maxWidth: 480, width: '100%',
        background: '#fff', border: '1px solid #E8E4DC',
        borderTop: `4px solid ${GOLD}`, borderRadius: 0,
        padding: '40px 36px', textAlign: 'center',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 0,
          background: `rgba(201,168,76,0.1)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <Lock size={22} color={GOLD} />
        </div>
        <div style={{ color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', marginBottom: 10 }}>
          READINESS OS — AUTHENTICATED ACCESS
        </div>
        <h2 style={{ color: NAVY, fontWeight: 700, fontSize: '1.4rem', margin: '0 0 12px' }}>
          Access Required
        </h2>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 28px' }}>
          This section of the platform is available to approved participants. Request access or start a 48-hour trial to explore the full Readiness OS.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => setLocation('/request-access')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: NAVY, color: '#fff', border: 'none',
              borderRadius: 0, padding: '12px 24px',
              fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            <LogIn size={15} /> Request Access
          </button>
          <button
            onClick={() => setLocation('/trial-access')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: GOLD, color: NAVY, border: 'none',
              borderRadius: 0, padding: '12px 24px',
              fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Get 48-Hour Trial Access <ArrowRight size={14} />
          </button>
          <button
            onClick={() => setLocation('/request-access')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'transparent', color: TEAL,
              border: `1px solid ${TEAL}`,
              borderRadius: 0, padding: '11px 24px',
              fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Apply for Full Pilot Program
          </button>
        </div>
        <p style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: 20 }}>
          Already have trial access? Activate your link from the email we sent.
        </p>
      </div>
    </div>
  );
}

interface IDEALayoutProps {
  children: ReactNode;
  className?: string;
  showBackButton?: boolean;
  backLabel?: string;
}

export default function IDEALayout({ 
  children, 
  className,
  showBackButton = true,
  backLabel = "Back"
}: IDEALayoutProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isTrial, isLoading: trialLoading } = useTrial();

  const isLoading = authLoading || trialLoading;
  const hasAccess = isAuthenticated || isTrial;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StandardNav />
      <GuestPreviewBanner />
      <div className="flex flex-1">
        <IDEASidebar />
        <main data-scroll-main="true" className={cn('flex-1 lg:ml-0 overflow-auto', className)}>
          {showBackButton && (
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 px-4 py-2">
              <BackButton label={backLabel} />
            </div>
          )}
          {!isLoading && !hasAccess ? (
            <AccessGate />
          ) : (
            children
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
