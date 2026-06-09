import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import {
  Shield, Award, Clock, CheckCircle2, XCircle, Minus,
  ArrowLeft, TrendingUp, Users, Target, BookOpen
} from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const RED = "#DC2626";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const OFF = "#F8F7F4";

interface PrecedentRecord {
  id: string;
  activationId: string;
  playbookId: string;
  protocolName: string | null;
  protocolNumber: number | null;
  outcomeClassification: string | null;
  targetMet: boolean | null;
  actualMinutes: number | null;
  whatHeld: string | null;
  wouldAuthorizeAgain: boolean | null;
  wouldAuthorizeNote: string | null;
  createdAt: string;
  authorizerFirstName: string | null;
  authorizerLastName: string | null;
  authorizerEmail: string | null;
  activatedAt: string | null;
  activationReason: string | null;
}

function authorizerName(r: PrecedentRecord): string {
  if (r.authorizerFirstName || r.authorizerLastName) {
    return [r.authorizerFirstName, r.authorizerLastName].filter(Boolean).join(" ");
  }
  if (r.authorizerEmail) return r.authorizerEmail.split("@")[0];
  return "Executive";
}

function classificationLabel(c: string | null): { label: string; color: string } {
  switch (c) {
    case "contained": return { label: "Contained", color: TEAL };
    case "board_notified": return { label: "Board Notified", color: GOLD };
    case "regulatory_filing": return { label: "Regulatory Filing", color: "#7B5EA7" };
    case "escalated": return { label: "Escalated", color: RED };
    default: return { label: "Not Classified", color: MUTED };
  }
}

function WouldAuthorizeTag({ val }: { val: boolean | null }) {
  if (val === null || val === undefined) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, background: "#F3F4F6", padding: "2px 8px" }}>
        <Minus style={{ width: 10, height: 10 }} /> Not recorded
      </span>
    );
  }
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
      color: val ? TEAL : RED,
      background: val ? `${TEAL}12` : `${RED}10`,
      border: `1px solid ${val ? TEAL : RED}30`,
      padding: "2px 8px",
    }}>
      {val ? <CheckCircle2 style={{ width: 10, height: 10 }} /> : <XCircle style={{ width: 10, height: 10 }} />}
      {val ? "Would authorize again" : "Would not authorize again"}
    </span>
  );
}

export default function AuthorizationPrecedentRegistry() {
  const [, setLocation] = useLocation();

  const { data: records = [], isLoading } = useQuery<PrecedentRecord[]>({
    queryKey: ["/api/organization/authorization-precedents"],
  });

  const wouldYes = records.filter(r => r.wouldAuthorizeAgain === true).length;
  const wouldNo = records.filter(r => r.wouldAuthorizeAgain === false).length;
  const notRecorded = records.filter(r => r.wouldAuthorizeAgain === null || r.wouldAuthorizeAgain === undefined).length;
  const targetMetCount = records.filter(r => r.targetMet === true).length;
  const confidenceRate = records.length > 0 ? Math.round((wouldYes / records.length) * 100) : 0;

  // Group by protocol
  const byProtocol = records.reduce<Record<string, PrecedentRecord[]>>((acc, r) => {
    const key = r.protocolName || r.playbookId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <PageLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <button
            onClick={() => setLocation("/advance-intelligence")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: MUTED, fontSize: 12, fontWeight: 600, marginBottom: 20, padding: 0 }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} /> ADVANCE Intelligence
          </button>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>
                ADVANCE 2.0 · Authorization Precedent Registry
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 700, color: NAVY, margin: "0 0 10px", lineHeight: 1.2 }}>
                Named Authorization History
              </h1>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: MUTED, lineHeight: 1.65, maxWidth: 540, margin: 0 }}>
                Every close-out gate that recorded an authorization verdict. The next executive sees this record before deciding whether to trust the prepared response. Accountability is named — not aggregated.
              </p>
            </div>
            <Shield style={{ width: 48, height: 48, color: GOLD, opacity: 0.6, flexShrink: 0, marginTop: 4 }} />
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: BORDER, border: `1px solid ${BORDER}`, marginBottom: 36 }}>
          {[
            { icon: Award, value: records.length, label: "Total Authorizations", sub: "close-outs with full records", color: NAVY },
            { icon: CheckCircle2, value: `${confidenceRate}%`, label: "Re-Authorization Rate", sub: `${wouldYes} of ${records.length} executives would authorize again`, color: TEAL },
            { icon: Target, value: `${records.length > 0 ? Math.round((targetMetCount / records.length) * 100) : 0}%`, label: "12-Min Target Met", sub: `${targetMetCount} activations hit the benchmark`, color: GOLD },
            { icon: Users, value: Object.keys(byProtocol).length, label: "Protocols With History", sub: `${notRecorded} records pending authorization verdict`, color: NAVY },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "#fff", padding: "20px 18px" }}>
              <stat.icon style={{ width: 16, height: 16, color: stat.color, marginBottom: 8 }} />
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, color: NAVY, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: stat.color, margin: "4px 0 3px" }}>{stat.label}</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: MUTED, lineHeight: 1.5 }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Design logic note */}
        <div style={{ background: `${NAVY}05`, border: `1px solid ${NAVY}12`, borderLeft: `3px solid ${GOLD}`, padding: "14px 18px", marginBottom: 36 }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12.5, color: "rgba(10,15,46,0.75)", lineHeight: 1.65 }}>
            <strong style={{ color: NAVY }}>Why named, not aggregated:</strong> The default response feels safer because it has a known owner and a known story, even when it fails. The prepared response requires the next executive to take on personal exposure that reverting does not. This registry is the structural answer — someone before them owned this path and survived being right or wrong in public. That is what makes the new path feel ownable.
          </div>
        </div>

        {/* Records — grouped by protocol */}
        {isLoading ? (
          <div style={{ padding: "60px 0", textAlign: "center", color: MUTED, fontFamily: "'Barlow', sans-serif", fontSize: 13 }}>
            Loading precedent records…
          </div>
        ) : records.length === 0 ? (
          <div style={{ padding: "60px 0", textAlign: "center", border: `1px dashed ${BORDER}`, background: "#fff" }}>
            <Shield style={{ width: 36, height: 36, color: BORDER, margin: "0 auto 12px" }} />
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 8 }}>
              No precedent records yet
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12.5, color: MUTED, maxWidth: 360, margin: "0 auto", lineHeight: 1.6 }}>
              Authorization precedents are recorded at the Close-Out Gate when an executive answers "Would you authorize this protocol again?" Complete an activation and close out to create the first record.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {Object.entries(byProtocol).map(([protocolKey, recs]) => {
              const sample = recs[0];
              const wouldYesCount = recs.filter(r => r.wouldAuthorizeAgain === true).length;
              const wouldNoCount = recs.filter(r => r.wouldAuthorizeAgain === false).length;
              return (
                <div key={protocolKey} style={{ border: `1px solid ${BORDER}`, background: "#fff" }}>
                  {/* Protocol header */}
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, background: `${NAVY}03`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <BookOpen style={{ width: 15, height: 15, color: GOLD, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>
                          {sample.protocolNumber ? `Protocol #${sample.protocolNumber}` : "Protocol"}
                        </div>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: NAVY }}>
                          {sample.protocolName || "Unknown Protocol"}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, color: TEAL }}>{wouldYesCount}</div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: MUTED }}>would authorize again</div>
                      </div>
                      {wouldNoCount > 0 && (
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, color: RED }}>{wouldNoCount}</div>
                          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: MUTED }}>would not</div>
                        </div>
                      )}
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, color: NAVY }}>{recs.length}</div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: MUTED }}>total activations</div>
                      </div>
                    </div>
                  </div>

                  {/* Individual records */}
                  {recs.map((r, idx) => {
                    const cls = classificationLabel(r.outcomeClassification);
                    return (
                      <div
                        key={r.id}
                        style={{
                          padding: "16px 20px",
                          borderBottom: idx < recs.length - 1 ? `1px solid ${BORDER}` : "none",
                          display: "grid",
                          gridTemplateColumns: "1fr auto",
                          gap: 16,
                          alignItems: "start",
                        }}
                      >
                        <div>
                          {/* Authorizer + date */}
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: "50%",
                              background: NAVY, color: "#fff",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontFamily: "'Barlow Condensed', sans-serif",
                              fontSize: 11, fontWeight: 800, flexShrink: 0,
                            }}>
                              {authorizerName(r).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: NAVY }}>
                                {authorizerName(r)}
                              </div>
                              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: MUTED }}>
                                {r.activatedAt
                                  ? new Date(r.activatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                  : new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </div>
                            </div>
                          </div>

                          {/* What held */}
                          {r.whatHeld && (
                            <div style={{ marginBottom: 8 }}>
                              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED, marginBottom: 3 }}>What held under pressure</div>
                              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12.5, color: "rgba(10,15,46,0.75)", lineHeight: 1.6, fontStyle: "italic" }}>
                                "{r.whatHeld}"
                              </div>
                            </div>
                          )}

                          {/* Authorization verdict */}
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
                            <WouldAuthorizeTag val={r.wouldAuthorizeAgain} />
                            {r.wouldAuthorizeNote && (
                              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11.5, color: MUTED, fontStyle: "italic" }}>
                                "{r.wouldAuthorizeNote}"
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right column — stats */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", minWidth: 120 }}>
                          <span style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                            color: cls.color,
                            background: `${cls.color}12`,
                            border: `1px solid ${cls.color}30`,
                            padding: "2px 8px",
                          }}>
                            {cls.label}
                          </span>
                          {r.targetMet !== null && r.targetMet !== undefined && (
                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Barlow', sans-serif", fontSize: 11, color: r.targetMet ? TEAL : RED }}>
                              <Clock style={{ width: 11, height: 11 }} />
                              {r.targetMet ? "12-min target met" : r.actualMinutes ? `${r.actualMinutes} min` : "Target missed"}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer CTA */}
        {records.length > 0 && (
          <div style={{ marginTop: 48, padding: "24px", background: NAVY, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 6 }}>
                The Compounding Moat
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(240,237,228,0.75)", lineHeight: 1.6 }}>
                Every authorization verdict that enters this registry makes the next activation faster. The accountability path becomes familiar before the next executive has personally owned it.
              </div>
            </div>
            <button
              onClick={() => setLocation("/advance-intelligence")}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                background: GOLD, color: NAVY, border: "none",
                padding: "10px 24px", cursor: "pointer", whiteSpace: "nowrap" as const,
                borderRadius: "0.15rem",
              }}
            >
              ADVANCE Intelligence →
            </button>
          </div>
        )}

      </div>
    </PageLayout>
  );
}
