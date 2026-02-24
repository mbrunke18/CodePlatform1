import type { FC } from 'react';

interface ExecuteIQLogoProps {
  width?: number;
  height?: number;
  variant?: 'full' | 'icon-only' | 'text-only';
  showTagline?: boolean;
  className?: string;
  color?: 'navy' | 'gold' | 'teal' | 'white';
  animate?: boolean;
}

export const ExecuteIQLogo: FC<ExecuteIQLogoProps> = ({
  width = 240,
  height = 72,
  variant = 'full',
  showTagline = true,
  className = '',
  color = 'navy',
  animate = false,
}) => {
  const colors = {
    navy: '#0A0F2E',
    gold: '#C9A84C',
    teal: '#2B8A6E',
    white: '#F0EDE4',
  };

  const iconColor = color === 'white' ? '#F0EDE4' : colors.navy;
  const accentColor = colors.gold;
  const accentTeal = colors.teal;

  const iconStyles = animate ? {
    filter: 'drop-shadow(0 2px 8px rgba(201, 168, 76, 0.2))',
  } : {
    filter: 'drop-shadow(0 2px 4px rgba(201, 168, 76, 0.15))',
  };

  const ringAnimation = animate ? `
    @keyframes ring-pulse {
      0%, 100% { opacity: 0.3; stroke-width: 1.5; }
      50% { opacity: 0.6; stroke-width: 1.8; }
    }
    .ring-outer { animation: ring-pulse 3s ease-in-out infinite; }
    .ring-2 { animation: ring-pulse 3s ease-in-out 0.3s infinite; }
    .ring-3 { animation: ring-pulse 3s ease-in-out 0.6s infinite; }
    .ring-4 { animation: ring-pulse 3s ease-in-out 0.9s infinite; }
    .ring-core { animation: ring-pulse 3s ease-in-out 1.2s infinite; }
  ` : '';

  if (variant === 'icon-only') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={iconStyles}
      >
        {animate && <defs><style>{ringAnimation}</style></defs>}

        <circle cx="60" cy="60" r="54" fill="none" stroke={accentTeal} strokeWidth="1.5" opacity="0.25" className={animate ? 'ring-outer' : ''} />
        <circle cx="60" cy="60" r="42" fill="none" stroke={accentTeal} strokeWidth="1.5" opacity="0.35" className={animate ? 'ring-2' : ''} />
        <circle cx="60" cy="60" r="30" fill="none" stroke={iconColor} strokeWidth="1.5" opacity="0.45" className={animate ? 'ring-3' : ''} />
        <circle cx="60" cy="60" r="18" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.7" className={animate ? 'ring-4' : ''} />
        <circle cx="60" cy="60" r="8" fill="none" stroke={accentColor} strokeWidth="2.5" className={animate ? 'ring-core' : ''} />
        <circle cx="60" cy="60" r="4" fill={accentColor} />
      </svg>
    );
  }

  if (variant === 'text-only') {
    return (
      <div className={className}>
        <h1
          style={{
            fontSize: `${height * 0.55}px`,
            fontWeight: 800,
            fontFamily: "'Barlow Condensed', 'Montserrat', sans-serif",
            margin: 0,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: color === 'white' ? '#F0EDE4' : colors.navy,
          }}
        >
          Execution OS
        </h1>
        {showTagline && (
          <p
            style={{
              fontSize: `${height * 0.15}px`,
              fontWeight: 600,
              fontFamily: "'Barlow Condensed', 'Montserrat', sans-serif",
              margin: '4px 0 0 0',
              color: colors.gold,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            Prepared to Respond.
          </p>
        )}
      </div>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 420 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <style>{`
          .exos-text-main {
            font-family: 'Barlow Condensed', 'Montserrat', sans-serif;
            font-size: 44px;
            font-weight: 800;
            letter-spacing: 3px;
            text-transform: uppercase;
            fill: ${color === 'white' ? '#F0EDE4' : colors.navy};
          }
          .exos-text-sub {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 10px;
            font-weight: 600;
            fill: ${colors.gold};
            letter-spacing: 3px;
            text-transform: uppercase;
          }
          ${ringAnimation}
        `}</style>
      </defs>

      {/* Concentric rings icon */}
      <g style={iconStyles} transform="translate(15, 20)">
        <circle cx="30" cy="30" r="28" fill="none" stroke={accentTeal} strokeWidth="1" opacity="0.25" className={animate ? 'ring-outer' : ''} />
        <circle cx="30" cy="30" r="22" fill="none" stroke={accentTeal} strokeWidth="1" opacity="0.35" className={animate ? 'ring-2' : ''} />
        <circle cx="30" cy="30" r="16" fill="none" stroke={iconColor} strokeWidth="1" opacity="0.45" className={animate ? 'ring-3' : ''} />
        <circle cx="30" cy="30" r="10" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.7" className={animate ? 'ring-4' : ''} />
        <circle cx="30" cy="30" r="5" fill="none" stroke={accentColor} strokeWidth="1.5" className={animate ? 'ring-core' : ''} />
        <circle cx="30" cy="30" r="2" fill={accentColor} />
      </g>

      {/* Wordmark */}
      <text x="88" y="62" className="exos-text-main">Execution OS</text>

      {/* Tagline */}
      {showTagline && (
        <text x="88" y="80" className="exos-text-sub">Prepared to Respond.</text>
      )}
    </svg>
  );
};

export default ExecuteIQLogo;
