import { VaughnMartinLogo as SealLogo } from '@/components/ExecuteIQLogo';
import type { FC } from 'react';
import { Link } from 'wouter';

interface VaughnMartinLogoProps {
  width?: number;
  height?: number;
  size?: number | string;
  theme?: string;
  variant?: 'full' | 'icon-only';
  className?: string;
  color?: 'dark' | 'light';
  noLink?: boolean;
  animated?: boolean;
}

const SIZE_MAP: Record<string, number> = { xs: 24, sm: 28, md: 36, lg: 48, xl: 64 };

export const VaughnMartinLogo: FC<VaughnMartinLogoProps> = ({
  width: widthProp,
  height: heightProp,
  size,
  theme,
  variant = 'full',
  className = '',
  color: colorProp = 'dark',
  noLink = false,
  animated = false,
}) => {
  const resolvedSize = typeof size === 'string' ? (SIZE_MAP[size] ?? 36) : size;
  const width = widthProp ?? resolvedSize;
  const height = heightProp ?? resolvedSize ?? 48;
  const color = (theme === 'light' || theme === 'white') ? 'light' : colorProp;

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
