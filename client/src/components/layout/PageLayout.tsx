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
    <div className={`min-h-screen flex flex-col page-background ${className}`}>
      <StandardNav />
      
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
