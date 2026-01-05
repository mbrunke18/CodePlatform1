import { ReactNode } from 'react';
import StandardNav from './StandardNav';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Unified Platform Layout - Single top navigation, full-width content
 * Replaces the old sidebar-based layout with a cleaner horizontal navigation
 */
export default function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {/* Unified Navigation - Same header everywhere */}
      <StandardNav />
      
      {/* Full-Width Content Area */}
      <main className="flex-1 w-full overflow-auto">
        {children}
      </main>
    </div>
  );
}
