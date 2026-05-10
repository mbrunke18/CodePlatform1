import { VaughnMartinLogo as SealLogo } from '@/components/ExecuteIQLogo';
import type { FC } from 'react';
import { Link } from 'wouter';

interface VaughnMartinLogoProps {
  width?: number;
  height?: number;
  variant?: 'full' | 'icon-only';
  className?: string;
  color?: 'dark' | 'light';
  noLink?: boolean;
  animated?: boolean;
}

export const VaughnMartinLogo: FC<VaughnMartinLogoProps> = ({
  width,
  height = 48,
  variant = 'full',
  className = '',
  color = 'dark',
  noLink = false,
  animated = false,
}) => {
  const sealColor = color === 'light' ? 'white' : 'navy';
  const sealVariant = variant === 'icon-only' ? 'icon-only' : 'full';

  const logo = (
    <SealLogo
      width={width}
      height={height}
      variant={sealVariant}
      color={sealColor}
      className={className}
      animated={animated}
    />
  );

  if (noLink) return logo;

  return (
    <Link
      href="/"
      style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', cursor: 'pointer', opacity: 1, transition: 'opacity 0.15s ease' }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {logo}
    </Link>
  );
};

export default VaughnMartinLogo;
