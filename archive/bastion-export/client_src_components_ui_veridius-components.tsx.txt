import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VeridiusCardProps {
  children: ReactNode;
  className?: string;
  glowEffect?: boolean;
}

export function VeridiusCard({ children, className = "", glowEffect = false }: VeridiusCardProps) {
  return (
    <Card className={cn(
      "bg-gray-900/50 border-gray-700/50 backdrop-blur-sm",
      glowEffect && "shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-500",
      className
    )}>
      {children}
    </Card>
  );
}

interface VeridiusButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  glowEffect?: boolean;
}

export function VeridiusButton({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'default', 
  className = "",
  glowEffect = false 
}: VeridiusButtonProps) {
  return (
    <Button 
      onClick={onClick}
      variant={variant}
      size={size}
      className={cn(
        "font-medium transition-all duration-300",
        glowEffect && "hover:shadow-lg hover:shadow-primary/25",
        className
      )}
    >
      {children}
    </Button>
  );
}

interface VeridiusBadgeProps {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export function VeridiusBadge({ children, variant = 'default', className = "" }: VeridiusBadgeProps) {
  return (
    <Badge 
      variant={variant}
      className={cn(
        "font-semibold tracking-wide",
        variant === 'default' && "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
        className
      )}
    >
      {children}
    </Badge>
  );
}