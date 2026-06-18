import React from "react";

const CHROME_BG = "#0d1326";
const SECTION_BG = "#060D1F";
const DM = { fontFamily: "'DM Mono', 'Courier New', monospace" };
const CG = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const BC = { fontFamily: "'Barlow Condensed', sans-serif" };

export interface ShowcaseFeature {
  color: string;
  label: string;
  description: string;
}

export interface ProductShowcaseProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  image: string;
  imageAlt?: string;
  urlPath: string;
  urlTag?: string;
  tagColor?: string;
  features: ShowcaseFeature[];
  topBorder?: boolean;
}

export default function ProductShowcase({
  eyebrow,
  headline,
  subheadline,
  image,
  imageAlt,
  urlPath,
  urlTag,
  tagColor = "#C9A84C",
  features,
  topBorder = true,
}: ProductShowcaseProps) {
  return (
    <div
      style={{
        background: SECTION_BG,
        borderTop: topBorder ? "1px solid rgba(201,168,76,0.15)" : undefined,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 48px 0" }}>

        {/* ── Header ─────────────────────────────────────────────────── */}
        {(eyebrow || headline) && (
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            {eyebrow && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 1,
                    background: "rgba(201,168,76,0.4)",
                  }}
                />
                <span
                  style={{
                    ...BC,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase" as const,
                    color: "#C9A84C",
                  }}
                >
                  {eyebrow}
                </span>
                <div
                  style={{
                    width: 36,
                    height: 1,
                    background: "rgba(201,168,76,0.4)",
                  }}
                />
              </div>
            )}
            <h2
              style={{
                ...CG,
                fontSize: "clamp(28px, 3.5vw, 46px)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.08,
                margin: "0 auto 8px",
                maxWidth: 700,
              }}
            >
              {headline}
            </h2>
            {subheadline && (
              <p
                style={{
                  ...CG,
                  fontSize: "clamp(18px, 2.2vw, 26px)",
                  fontWeight: 600,
                  color: "#C9A84C",
                  fontStyle: "italic",
                  margin: "10px auto 0",
                  lineHeight: 1.3,
                }}
              >
                {subheadline}
              </p>
            )}
          </div>
        )}

        {/* ── Browser Chrome + Screenshot ─────────────────────────────── */}
        <div
          style={{
            borderRadius: "6px 6px 0 0",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Chrome bar */}
          <div
            style={{
              background: CHROME_BG,
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Traffic lights */}
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <div
                  key={c}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: c,
                    opacity: 0.75,
                  }}
                />
              ))}
            </div>

            {/* URL bar */}
            <div
              style={{ flex: 1, display: "flex", justifyContent: "center" }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 4,
                  padding: "4px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  maxWidth: 420,
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "rgba(43,138,110,0.7)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    ...DM,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.38)",
                    letterSpacing: "0.04em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  readiness.vaughnmartin.com{urlPath}
                </span>
              </div>
            </div>

            {/* Badge tag */}
            {urlTag && (
              <div
                style={{
                  ...DM,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: tagColor,
                  padding: "3px 10px",
                  border: `1px solid ${tagColor}44`,
                  background: `${tagColor}11`,
                  flexShrink: 0,
                }}
              >
                {urlTag}
              </div>
            )}
          </div>

          {/* Screenshot */}
          <div style={{ position: "relative", lineHeight: 0 }}>
            <img
              src={image}
              alt={imageAlt ?? "Readiness OS Platform"}
              style={{ width: "100%", display: "block" }}
              loading="lazy"
            />
            {/* Bottom fade so screenshot blends into feature bar */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, transparent 55%, rgba(6,13,31,0.88) 100%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* ── Feature callout bar ──────────────────────────────────────── */}
        {features.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${features.length}, 1fr)`,
              border: "1px solid rgba(255,255,255,0.08)",
              borderTop: "none",
            }}
          >
            {features.map((f, i) => (
              <div
                key={f.label}
                style={{
                  padding: "24px 28px",
                  borderRight:
                    i < features.length - 1
                      ? "1px solid rgba(255,255,255,0.07)"
                      : undefined,
                  borderTop: `3px solid ${f.color}`,
                  background: "rgba(255,255,255,0.018)",
                }}
              >
                <div
                  style={{
                    ...BC,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase" as const,
                    color: f.color,
                    marginBottom: 8,
                  }}
                >
                  {f.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.65,
                    fontWeight: 400,
                  }}
                >
                  {f.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
