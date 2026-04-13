import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { Link } from "wouter";

const NAVY  = "#0A0F2E";
const GOLD  = "#C9A84C";
const TEAL  = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const DM: React.CSSProperties = { fontFamily: "'Inter', 'Helvetica Neue', sans-serif" };

interface Stat {
  num: string;
  label: string;
}

interface Breadcrumb {
  label: string;
  href?: string;
}

interface EditorialPageHeaderProps {
  label?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  body?: string;
  stats?: Stat[];
  breadcrumb?: Breadcrumb[];
  dark?: boolean;
  showLogo?: boolean;
  accentColor?: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export default function EditorialPageHeader({
  label,
  title,
  titleAccent,
  subtitle,
  body,
  stats,
  breadcrumb,
  dark = true,
  showLogo = false,
  accentColor = GOLD,
  action,
  compact = false,
}: EditorialPageHeaderProps) {
  const bg        = dark ? NAVY : "#fff";
  const textColor = dark ? "#fff" : NAVY;
  const mutedColor= dark ? "rgba(255,255,255,0.45)" : "rgba(10,15,46,0.45)";
  const borderColor = dark ? "rgba(255,255,255,0.08)" : "rgba(10,15,46,0.08)";
  const gridColor   = dark ? "rgba(201,168,76,0.04)" : "rgba(10,15,46,0.03)";

  const paddingV = compact ? "48px 40px" : "80px 48px";

  return (
    <div style={{
      background: bg,
      padding: paddingV,
      position: "relative",
      overflow: "hidden",
      borderBottom: `1px solid ${borderColor}`,
    }}>
      {/* Subtle gold grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(${gridColor} 1px,transparent 1px),linear-gradient(90deg,${gridColor} 1px,transparent 1px)`,
        backgroundSize: "44px 44px",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {showLogo && (
          <div style={{ marginBottom: 32 }}>
            <VaughnMartinLogo variant="full" height={36} color={dark ? "light" : "dark"} />
          </div>
        )}

        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            {breadcrumb.map((crumb, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {i > 0 && <span style={{ ...DM, fontSize: 11, color: mutedColor }}>›</span>}
                {crumb.href ? (
                  <Link href={crumb.href} style={{ ...DM, fontSize: 11, fontWeight: 600, color: mutedColor, textDecoration: "none", letterSpacing: "0.04em" }}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ ...DM, fontSize: 11, fontWeight: 600, color: mutedColor, letterSpacing: "0.04em" }}>{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Gold rule + overline label */}
        {label && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 28, height: 1, background: accentColor, opacity: 0.6 }} />
            <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: accentColor }}>
              {label}
            </span>
          </div>
        )}

        {/* Main heading */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h1 style={{
              ...CG,
              fontSize: compact ? "clamp(24px,3vw,36px)" : "clamp(30px,4vw,48px)",
              fontWeight: 700,
              color: textColor,
              lineHeight: 1.15,
              marginBottom: titleAccent || subtitle ? 8 : 0,
              margin: 0,
            }}>
              {title}
              {titleAccent && (
                <>
                  {" "}
                  <em style={{ fontStyle: "italic", color: accentColor }}>{titleAccent}</em>
                </>
              )}
            </h1>

            {/* Italic serif subtitle */}
            {subtitle && (
              <p style={{ ...CG, fontSize: compact ? 16 : 20, fontStyle: "italic", color: accentColor, marginTop: 8, lineHeight: 1.4 }}>
                {subtitle}
              </p>
            )}

            {/* Body text */}
            {body && (
              <p style={{ ...DM, fontSize: 15, color: mutedColor, marginTop: 16, lineHeight: 1.7, maxWidth: 640 }}>
                {body}
              </p>
            )}
          </div>

          {/* Action slot */}
          {action && (
            <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
              {action}
            </div>
          )}
        </div>

        {/* Stat strip */}
        {stats && stats.length > 0 && (
          <div style={{
            display: "flex", gap: 0, marginTop: 40, paddingTop: 32,
            borderTop: `1px solid ${borderColor}`, flexWrap: "wrap",
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                paddingRight: 32, paddingLeft: i > 0 ? 32 : 0,
                borderRight: i < stats.length - 1 ? `1px solid ${borderColor}` : "none",
              }}>
                <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: accentColor, lineHeight: 1 }}>{s.num}</div>
                <div style={{ ...DM, fontSize: 11, fontWeight: 600, color: mutedColor, marginTop: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
