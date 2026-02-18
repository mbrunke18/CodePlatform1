import { ReactNode } from 'react';
import StandardNav from './StandardNav';
import Footer from './Footer';
import { BackButton } from '@/components/ui/back-button';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  showBackButton?: boolean;
  backButtonLabel?: string;
  embedded?: boolean;
}

/**
 * Unified Platform Layout - Single top navigation, full-width content
 * Replaces the old sidebar-based layout with a cleaner horizontal navigation
 */
export default function PageLayout({ 
  children, 
  className = "",
  showBackButton = false,
  backButtonLabel = "Back",
  embedded = false
}: PageLayoutProps) {
  if (embedded) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <StandardNav />
      
      {showBackButton && (
        <div className="bg-poise-navy/50 border-b border-slate-800/50">
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
