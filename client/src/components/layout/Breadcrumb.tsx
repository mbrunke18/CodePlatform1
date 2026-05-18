import { ChevronRight, Home } from 'lucide-react';
import { useLocation } from 'wouter';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  inverted?: boolean;
}

const NAVY = '#0A0F2E';

export default function Breadcrumb({ items, className, inverted = false }: BreadcrumbProps) {
  const [, setLocation] = useLocation();

  const mutedColor = inverted ? 'rgba(255,255,255,0.45)' : '#9CA3AF';
  const activeColor = inverted ? 'rgba(255,255,255,0.88)' : NAVY;

  return (
    <nav
      aria-label="Breadcrumb"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '8px 0 12px',
        flexWrap: 'wrap',
      }}
    >
      <button
        onClick={() => setLocation('/')}
        title="Home"
        style={{
          display: 'flex', alignItems: 'center',
          color: mutedColor, background: 'none', border: 'none',
          cursor: 'pointer', padding: '2px 4px',
          transition: 'color 0.12s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = activeColor; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = mutedColor; }}
      >
        <Home size={11} />
      </button>

      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronRight
              size={10}
              style={{ color: inverted ? 'rgba(255,255,255,0.25)' : '#D1D5DB', flexShrink: 0 }}
            />
            {item.href && !isLast ? (
              <button
                onClick={() => setLocation(item.href!)}
                style={{
                  color: mutedColor,
                  fontSize: 11,
                  fontWeight: 600,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  letterSpacing: '0.04em',
                  transition: 'color 0.12s',
                  fontFamily: "'Barlow', sans-serif",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = activeColor; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = mutedColor; }}
              >
                {item.label}
              </button>
            ) : (
              <span
                style={{
                  color: isLast ? activeColor : mutedColor,
                  fontSize: 11,
                  fontWeight: isLast ? 700 : 600,
                  padding: '2px 4px',
                  letterSpacing: '0.04em',
                  fontFamily: "'Barlow', sans-serif",
                }}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
