import { VaughnMartinLogo as SealLogo } from '@/components/ExecuteIQLogo';
import type { FC } from 'react';

interface VaughnMartinLogoProps {
  width?: number;
  height?: number;
  variant?: 'full' | 'icon-only';
  className?: string;
  color?: 'dark' | 'light';
}

export const VaughnMartinLogo: FC<VaughnMartinLogoProps> = ({
  width,
  height = 48,
  variant = 'full',
  className = '',
  color = 'dark',
}) => {
  const sealColor = color === 'light' ? 'white' : 'navy';
  const sealVariant = variant === 'icon-only' ? 'icon-only' : 'full';

  return (
    <SealLogo
      width={width}
      height={height}
      variant={sealVariant}
      color={sealColor}
      className={className}
    />
  );
};

export default VaughnMartinLogo;
