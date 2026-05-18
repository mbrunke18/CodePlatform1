import { useState } from 'react';
import { ChevronDown, AlertTriangle, Lightbulb } from 'lucide-react';

interface MicroHelpProps {
  trigger?: string;
  items: string[];
  variant?: 'warning' | 'tip';
}

export default function MicroHelp({
  trigger = 'Common mistakes to avoid',
  items,
  variant = 'warning',
}: MicroHelpProps) {
  const [open, setOpen] = useState(false);
  const isTip   = variant === 'tip';
  const color   = isTip ? '#2B8A6E' : '#D97706';
  const Icon    = isTip ? Lightbulb : AlertTriangle;

  return (
    <div style={{
      marginTop: 12,
      border: `1px solid ${isTip ? 'rgba(43,138,110,0.2)' : 'rgba(217,119,6,0.25)'}`,
      background: isTip ? 'rgba(43,138,110,0.04)' : 'rgba(255,251,235,1)',
      borderRadius: 2,
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 12px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <Icon size={12} color={color} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 11, fontWeight: 700, color, letterSpacing: '0.06em' }}>{trigger}</span>
        <ChevronDown
          size={12}
          color={color}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
        />
      </button>
      {open && (
        <ul style={{ padding: '0 12px 10px 32px', margin: 0, listStyle: 'none' }}>
          {items.map((item, i) => (
            <li key={i} style={{ fontSize: 11, color: '#6B7280', padding: '3px 0', display: 'flex', gap: 7, alignItems: 'flex-start' }}>
              <span style={{ color, fontWeight: 700, flexShrink: 0, lineHeight: 1.6 }}>–</span>
              <span style={{ lineHeight: 1.6 }}>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
