import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

interface BrandStampProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'logo' | 'dual' | 'watermark';
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function BrandStamp({
  size = 'md',
  variant = 'logo',
  className = '',
  align = 'center',
}: BrandStampProps) {
  const logoHeights = { sm: 28, md: 38, lg: 50, xl: 64 };
  const iconSizes   = { sm: 22, md: 30, lg: 40, xl: 52 };
  const vmHeights   = { sm: 20, md: 26, lg: 34, xl: 44 };

  const h  = logoHeights[size];
  const ic = iconSizes[size];
  const vm = vmHeights[size];

  const alignClass = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';

  if (variant === 'icon') {
    return (
      <div className={`flex ${alignClass} ${className}`}>
        <ExecuteIQLogo variant="icon-only" width={ic} color="navy" />
      </div>
    );
  }

  if (variant === 'logo') {
    return (
      <div className={`flex ${alignClass} ${className}`}>
        <ExecuteIQLogo variant="full" height={h} color="navy" />
      </div>
    );
  }

  if (variant === 'dual') {
    return (
      <div className={`flex flex-col items-${align === 'center' ? 'center' : align === 'right' ? 'end' : 'start'} gap-2 ${className}`}>
        <ExecuteIQLogo variant="full" height={h} color="navy" />
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-[#C9A84C]/30" style={{ width: '40px' }} />
          <span style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: `${Math.round(h * 0.18)}px`,
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#8B8BA0',
          }}>by VaughnMartin</span>
          <div className="h-px flex-1 bg-[#C9A84C]/30" style={{ width: '40px' }} />
        </div>
      </div>
    );
  }

  if (variant === 'watermark') {
    return (
      <div className={`flex ${alignClass} opacity-12 pointer-events-none select-none ${className}`}>
        <ExecuteIQLogo variant="full" height={h} color="navy" />
      </div>
    );
  }

  return null;
}

export default BrandStamp;
