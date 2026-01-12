import type { FC } from 'react';

interface ExecuteIQLogoProps {
  width?: number;
  height?: number;
  showTagline?: boolean;
  variant?: 'full' | 'icon-only' | 'text-only';
  className?: string;
  darkMode?: boolean;
}

export const ExecuteIQLogo: FC<ExecuteIQLogoProps> = ({
  width = 400,
  height = 150,
  showTagline = true,
  variant = 'full',
  className = '',
  darkMode = true,
}) => {
  const aspectRatio = 800 / 200;
  const computedHeight = width ? width / aspectRatio : height;
  
  const textColor = darkMode ? '#FFFFFF' : '#1A2B3D';
  const bgOpacity = darkMode ? 0.3 : 0.2;

  if (variant === 'icon-only') {
    return (
      <svg
        viewBox="0 0 80 80"
        width={width}
        height={width}
        xmlns="http://www.w3.org/2000/svg"
        className={`poise-logo ${className}`}
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        <g transform="translate(40, 40)">
          <circle
            cx="0"
            cy="0"
            r="35"
            fill="none"
            stroke="#00A8A8"
            strokeWidth="2"
            opacity={bgOpacity + 0.2}
          />
          <polygon
            points="0,-28 8,-8 -8,-8"
            fill="#D4AF37"
            opacity="0.95"
          />
          <polygon
            points="0,28 8,8 -8,8"
            fill="#1A2B3D"
            opacity="0.6"
          />
          <circle cx="0" cy="0" r="5" fill="#D4AF37" />
        </g>
      </svg>
    );
  }

  const showCompass = variant === 'full';
  const showWaves = variant === 'full';

  return (
    <svg
      viewBox="0 0 800 200"
      width={width}
      height={computedHeight}
      xmlns="http://www.w3.org/2000/svg"
      className={`poise-logo ${className}`}
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#F4CF67" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>

      <text 
        x="50" 
        y="120" 
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '110px',
          fontWeight: 700,
          fill: textColor,
          letterSpacing: '8px',
        }}
      >
        PO
      </text>

      {showCompass && (
        <g transform="translate(268, 70)">
          <circle
            cx="0"
            cy="0"
            r="32"
            fill="none"
            stroke="#00A8A8"
            strokeWidth="1.5"
            opacity={bgOpacity}
          />
          <polygon
            points="0,-26 7,-6 -7,-6"
            fill="url(#goldGradient)"
            opacity="0.95"
          />
          <polygon
            points="0,26 7,6 -7,6"
            fill="#1A2B3D"
            opacity="0.5"
          />
          <circle cx="0" cy="0" r="4" fill="#D4AF37" />
        </g>
      )}

      <text 
        x={showCompass ? "310" : "240"} 
        y="120" 
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '110px',
          fontWeight: 700,
          fill: textColor,
          letterSpacing: '8px',
        }}
      >
        {showCompass ? "SE" : "ISE"}
      </text>

      {showWaves && (
        <g transform="translate(50, 145)">
          <path
            d="M 0 0 Q 20 -6, 40 0 T 80 0 T 120 0 T 160 0 T 200 0"
            stroke="#00A8A8"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 0 8 Q 20 2, 40 8 T 80 8 T 120 8 T 160 8 T 200 8"
            stroke="#00A8A8"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path
            d="M 0 14 Q 20 8, 40 14 T 80 14 T 120 14 T 160 14 T 200 14"
            stroke="#00A8A8"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            opacity="0.25"
          />
        </g>
      )}

      {showTagline && (
        <text 
          x="50" 
          y="190" 
          style={{
            fontFamily: "Georgia, serif",
            fontSize: '16px',
            fill: '#D4AF37',
            letterSpacing: '1.5px',
            fontStyle: 'italic',
          }}
        >
          Composure in every decision.
        </text>
      )}
    </svg>
  );
};

export default ExecuteIQLogo;
