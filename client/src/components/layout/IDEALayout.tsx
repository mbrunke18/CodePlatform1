import { ReactNode } from 'react';
import IDEASidebar from './IDEASidebar';
import { cn } from '@/lib/utils';
import { BackButton } from '@/components/ui/back-button';

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
  return (
    <div className="flex min-h-screen bg-background">
      <IDEASidebar />
      <main className={cn('flex-1 lg:ml-0 overflow-auto', className)}>
        {showBackButton && (
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 px-4 py-2">
            <BackButton label={backLabel} />
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
