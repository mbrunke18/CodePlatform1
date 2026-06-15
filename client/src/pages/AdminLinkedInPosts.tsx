import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, Copy, Check, RefreshCw, Zap } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

interface LinkedInPost {
  id: number;
  triggerName: string;
  triggerDomain: string;
  signalDescription: string;
  confidenceScore: number;
  recommendedPlaybook: string | null;
  detectedAt: string;
  postText: string;
}

const DOMAIN_COLORS: Record<string, { bg: string; text: string }> = {
  default: { bg: "#EEF2FF", text: "#3730A3" },
  cyber: { bg: "#FEF2F2", text: "#991B1B" },
  regulat: { bg: "#FFFBEB", text: "#92400E" },
  compliance: { bg: "#FFFBEB", text: "#92400E" },
  supply: { bg: "#F0FDF4", text: "#14532D" },
  geopol: { bg: "#F0FDF4", text: "#14532D" },
  financial: { bg: "#EFF6FF", text: "#1E3A8A" },
  activist: { bg: "#EFF6FF", text: "#1E3A8A" },
  market: { bg: "#F5F3FF", text: "#4C1D95" },
  competit: { bg: "#F5F3FF", text: "#4C1D95" },
};

function getDomainStyle(domain: string) {
  const d = domain.toLowerCase();
  for (const [key, style] of Object.entries(DOMAIN_COLORS)) {
    if (key !== "default" && d.includes(key)) return style;
  }
  return DOMAIN_COLORS.default;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return "Just now";
}

function PostCard({ post }: { post: LinkedInPost }) {
  const [copied, setCopied] = useState(false);
  const [posted, setPosted] = useState(false);
  const domainStyle = getDomainStyle(post.triggerDomain);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(post.postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: posted ? "#F9FAFB" : "#ffffff",
        border: `1px solid ${posted ? "#E5E7EB" : "#E8E4DC"}`,
        borderTop: `3px solid ${posted ? "#D1D5DB" : GOLD}`,
        opacity: posted ? 0.65 : 1,
        transition: "all 0.2s ease",
      }}
    >
      {/* Card header */}
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  background: domainStyle.bg,
                  color: domainStyle.text,
                  borderRadius: 2,
                }}
              >
                {post.triggerDomain}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: post.confidenceScore >= 90 ? "#B91C1C" : post.confidenceScore >= 80 ? "#92400E" : "#3730A3",
                  background: post.confidenceScore >= 90 ? "#FEF2F2" : post.confidenceScore >= 80 ? "#FFFBEB" : "#EEF2FF",
                  padding: "2px 8px",
                  borderRadius: 2,
                }}
              >
                {post.confidenceScore}% confidence
              </span>
              <span style={{ fontSize: 10, color: "#9CA3AF", letterSpacing: "0.08em" }}>
                {timeAgo(post.detectedAt)}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: NAVY, lineHeight: 1.4 }}>
              {post.signalDescription || post.triggerName}
            </p>
            {post.recommendedPlaybook && (
              <p style={{ margin: "4px 0 0", fontSize: 11, color: TEAL, fontWeight: 500 }}>
                Protocol: {post.recommendedPlaybook}
              </p>
            )}
          </div>
          {posted && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#6B7280",
                background: "#F3F4F6",
                padding: "3px 8px",
                borderRadius: 2,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Posted
            </span>
          )}
        </div>
      </div>

      {/* Post text */}
      <div style={{ padding: "14px 20px" }}>
        <pre
          style={{
            margin: 0,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: 12,
            color: "#374151",
            lineHeight: 1.75,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            background: "#FAFAFA",
            border: "1px solid #F3F4F6",
            padding: "14px 16px",
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          {post.postText}
        </pre>
      </div>

      {/* Actions */}
      <div
        style={{
          padding: "10px 20px 14px",
          display: "flex",
          gap: 8,
          alignItems: "center",
          borderTop: "1px solid #F3F4F6",
        }}
      >
        <button
          onClick={handleCopy}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            background: copied ? TEAL : NAVY,
            color: "#ffffff",
            border: "none",
            cursor: "pointer",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            transition: "background 0.2s ease",
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied!" : "Copy Post"}
        </button>

        <a
          href="https://www.linkedin.com/feed/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            background: "#0A66C2",
            color: "#ffffff",
            textDecoration: "none",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <Linkedin size={13} />
          Open LinkedIn
        </a>

        {!posted && (
          <button
            onClick={() => setPosted(true)}
            style={{
              marginLeft: "auto",
              padding: "8px 14px",
              background: "transparent",
              color: "#6B7280",
              border: "1px solid #E5E7EB",
              cursor: "pointer",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Mark as Posted
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminLinkedInPosts() {
  const [domainFilter, setDomainFilter] = useState<string>("all");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/linkedin-posts"],
    retry: false,
  });

  const posts: LinkedInPost[] = Array.isArray(data) ? data : [];
  const isUnauthorized = data === null && !isLoading;

  const domains = ["all", ...Array.from(new Set(posts.map(p => p.triggerDomain))).sort()];

  const filtered = domainFilter === "all"
    ? posts
    : posts.filter(p => p.triggerDomain === domainFilter);

  return (
    <PageLayout>
      <div style={{ minHeight: "100vh", background: "#F5F4F0" }}>
        {/* Header */}
        <div style={{ background: NAVY, padding: "32px 40px 28px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    color: GOLD,
                    marginBottom: 10,
                  }}
                >
                  Admin · Signal Content
                </div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#ffffff",
                    fontFamily: "Georgia, serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  LinkedIn Post Generator
                </h1>
                <p style={{ margin: "8px 0 0", fontSize: 13, color: "rgba(240,237,228,0.55)", lineHeight: 1.5 }}>
                  Ready-to-post LinkedIn content — auto-generated from live signal detections.
                  Each post demonstrates the contrast between prepared and traditional responses.
                </p>
              </div>
              <button
                onClick={() => refetch()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 18px",
                  background: "rgba(201,168,76,0.12)",
                  border: `1px solid ${GOLD}`,
                  color: GOLD,
                  cursor: "pointer",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                <RefreshCw size={13} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* How to use strip */}
        <div
          style={{
            background: "#FFF8E8",
            borderBottom: `2px solid ${GOLD}`,
            padding: "12px 40px",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
            <Zap size={14} style={{ color: GOLD, flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>
              <strong style={{ color: NAVY }}>How to use:</strong> When a real signal fires, copy the post and paste it directly into LinkedIn.
              No editing needed — each post is ready. Click <strong style={{ color: "#0A66C2" }}>Open LinkedIn</strong> to go straight to the post composer.
              Mark as Posted to track what's been published.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 40px 60px" }}>

          {/* Domain filters */}
          {domains.length > 1 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {domains.map(d => (
                <button
                  key={d}
                  onClick={() => setDomainFilter(d)}
                  style={{
                    padding: "5px 14px",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    border: `1px solid ${domainFilter === d ? NAVY : "#D1D5DB"}`,
                    background: domainFilter === d ? NAVY : "#ffffff",
                    color: domainFilter === d ? "#ffffff" : "#6B7280",
                    transition: "all 0.15s ease",
                  }}
                >
                  {d === "all" ? `All Signals (${posts.length})` : d}
                </button>
              ))}
            </div>
          )}

          {/* Unauthorized state */}
          {isUnauthorized && (
            <div style={{ textAlign: "center", padding: "80px 40px", background: "#ffffff", border: "1px solid #E8E4DC" }}>
              <p style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: NAVY }}>Platform admin access required</p>
              <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>Sign in as the platform administrator to view LinkedIn post drafts.</p>
            </div>
          )}

          {/* Loading state */}
          {!isUnauthorized && isLoading && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ width: 32, height: 32, border: `3px solid ${GOLD}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>Loading signal posts…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Empty state */}
          {!isUnauthorized && !isLoading && filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "80px 40px",
                background: "#ffffff",
                border: "1px solid #E8E4DC",
              }}
            >
              <Linkedin size={40} style={{ color: "#D1D5DB", marginBottom: 16 }} />
              <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: NAVY }}>
                No high-confidence signals in the last 30 days
              </h3>
              <p style={{ margin: "0 0 24px", fontSize: 13, color: "#6B7280", lineHeight: 1.7, maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
                Posts are generated automatically when signals hit 75%+ confidence.
                The next detection cycle runs every 15 minutes.
              </p>
              <button
                onClick={() => refetch()}
                style={{
                  padding: "10px 24px",
                  background: NAVY,
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Check Again
              </button>
            </div>
          )}

          {/* Post grid */}
          {!isUnauthorized && !isLoading && filtered.length > 0 && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>
                  {filtered.length} post{filtered.length !== 1 ? "s" : ""} ready to publish
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>
                  Sorted by signal detection time · Last 30 days
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(520px, 1fr))", gap: 20 }}>
                {filtered.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
