import { ReactNode } from "react";
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  eyebrow?: string;
  actions?: ReactNode;
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export function PageHero({ title, subtitle, badge, eyebrow, actions, size = "md", children }: PageHeroProps) {
  const py = size === "sm" ? "48px 0 40px" : size === "lg" ? "96px 0 80px" : "64px 0 56px";
  const titleSize = size === "sm" ? "clamp(28px, 4vw, 42px)" : size === "lg" ? "clamp(48px, 6vw, 72px)" : "clamp(36px, 5vw, 56px)";

  return (
    <section style={{
      background: `linear-gradient(135deg, ${NAVY} 0%, #111740 60%, #0e1535 100%)`,
      padding: py,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Gold grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)`,
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />
      {/* Teal orb top-right */}
      <div style={{ position: "absolute", top: -80, right: -60, width: 500, height: 500, background: `radial-gradient(ellipse,rgba(43,138,110,0.13) 0%,transparent 65%)`, pointerEvents: "none" }} />
      {/* Gold orb bottom-left */}
      <div style={{ position: "absolute", bottom: -60, left: "25%", width: 400, height: 400, background: `radial-gradient(ellipse,rgba(201,168,76,0.08) 0%,transparent 65%)`, pointerEvents: "none" }} />
      {/* Gold accent line at top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${GOLD}, ${TEAL}, ${GOLD})`, opacity: 0.5 }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Logo */}
        <div style={{ marginBottom: 24 }}>
          <ExecuteIQLogo height={64} variant="full" color="white" />
        </div>

        {/* Eyebrow / Badge */}
        {eyebrow && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.22)", borderRadius: 0, padding: "4px 14px", marginBottom: 16 }}>
            <span style={{ width: 5, height: 5, background: GOLD, borderRadius: "50%", display: "inline-block" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD }}>{eyebrow}</span>
          </div>
        )}
        {badge && !eyebrow && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(43,138,110,0.12)", border: "1px solid rgba(43,138,110,0.25)", borderRadius: 0, padding: "4px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: TEAL }}>{badge}</span>
          </div>
        )}

        {/* Title */}
        <h1 style={{ ...CG, fontWeight: 600, fontSize: titleSize, lineHeight: 1.1, color: "#fff", marginBottom: subtitle ? 16 : actions ? 24 : 0, maxWidth: 800 }}>
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p style={{ fontSize: 16, fontWeight: 400, color: "rgba(240,237,228,0.72)", lineHeight: 1.6, maxWidth: 640, marginBottom: actions ? 28 : 0 }}>
            {subtitle}
          </p>
        )}

        {/* Actions */}
        {actions && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" as const }}>
            {actions}
          </div>
        )}

        {children && (
          <div style={{ marginTop: 24 }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export default PageHero;
