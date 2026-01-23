import { ReactNode } from 'react';
import IDEASidebar from './IDEASidebar';
import { cn } from '@/lib/utils';

interface IDEALayoutProps {
  children: ReactNode;
  className?: string;
}

export default function IDEALayout({ children, className }: IDEALayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <IDEASidebar />
      <main className={cn('flex-1 lg:ml-0 overflow-auto', className)}>
        {children}
      </main>
    </div>
  );
}
