import { useState } from "react";
import { Zap, Volume2, Settings, XCircle, Clock, Users, FileText, CheckCircle, ChevronRight, RotateCcw, Check } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const BLUE = "#6B8CFF";
const RED = "#C05050";

export type ConsequenceChoice = "run_as_built" | "audible" | "customize" | "stand_down";

interface Stakeholder {
  name: string;
  role: string;
  notifyInSeconds: number;
}

interface ConsequencePreviewProps {
  triggerName: string;
  playbookName: string;
  stakeholders?: Stakeholder[];
  taskCount?: number;
  onChoiceSelected?: (choice: ConsequenceChoice) => void;
  onConfirm?: (choice: ConsequenceChoice, standDownReason?: string) => void;
  compact?: boolean;
}

const DEFAULT_STAKEHOLDERS: Stakeholder[] = [
  { name: "Chief Executive Officer", role: "Executive Sponsor", notifyInSeconds: 45 },
  { name: "Chief Legal Officer", role: "Legal Authorization", notifyInSeconds: 60 },
  { name: "Chief Communications Officer", role: "External Communications", notifyInSeconds: 75 },
  { name: "Chief Operating Officer", role: "Execution Lead", notifyInSeconds: 90 },
];

const CHOICES: { id: ConsequenceChoice; label: string; sublabel: string; icon: typeof Zap; color: string; description: string }[] = [
  {
    id: "run_as_built",
    label: "Run as Built",
    sublabel: "Execute the pre-staged protocol exactly as designed",
    icon: Zap,
    color: TEAL,
    description: "Activates all pre-staged tasks, notifies all pre-assigned stakeholders, and starts the 12-minute execution clock. No changes from the protocol design.",
  },
  {
    id: "audible",
    label: "Audible",
    sublabel: "Review and adjust before execution",
    icon: Volume2,
    color: GOLD,
    description: "Shows the delta between the pre-staged protocol and current organizational state — personnel changes, resource availability, stakeholder updates. Review each item and accept or revert before the adjusted protocol activates.",
  },
  {
    id: "customize",
    label: "Customize",
    sublabel: "Modify the three highest-leverage points",
    icon: Settings,
    color: BLUE,
    description: "Opens the three highest-impact customization points in this protocol — primary owner, first communication template, and escalation threshold. Edit any or all. All other tasks run exactly as pre-staged.",
  },
  {
    id: "stand_down",
    label: "Stand Down",
    sublabel: "Decline activation — record the decision",
    icon: XCircle,
    color: RED,
    description: "No tasks are activated. The trigger detection is logged with a governance record of the stand-down decision, the reason, and the executive who made the call. Audit trail preserved.",
  },
];

/* ─── Run as Built Preview ───────────────────────────────────────────────── */
function RunAsBuiltPreview({ stakeholders, taskCount, triggerName }: { stakeholders: Stakeholder[]; taskCount: number; triggerName: string }) {
  return (
    <div className="space-y-4">
      <div className="rounded-sm p-4" style={{ backgroundColor: "#0A1228", border: `1px solid ${TEAL}40` }}>
        <p className="text-xs font-mono tracking-wider mb-3" style={{ color: TEAL }}>WHAT HAPPENS IN THE NEXT 60 SECONDS</p>
        <div className="space-y-3">
          {[
            { t: 0, label: `Trigger "${triggerName}" confirmed — protocol activated` },
            ...stakeholders.slice(0, 4).map(s => ({ t: s.notifyInSeconds, label: `${s.name} (${s.role}) notified` })),
            { t: taskCount * 8, label: `${taskCount} pre-staged tasks deployed to execution console` },
          ].sort((a, b) => a.t - b.t).map((event, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-mono w-12 shrink-0 text-right" style={{ color: GOLD }}>T+{event.t}s</span>
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: TEAL }} />
              <span className="text-sm" style={{ color: IVORY, opacity: 0.85 }}>{event.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 rounded-sm p-3 text-center" style={{ backgroundColor: "#0A1228", border: "1px solid #1E2D5A" }}>
          <div className="text-2xl font-bold" style={{ color: TEAL, fontFamily: "Georgia, serif" }}>{stakeholders.length}</div>
          <div className="text-xs font-mono mt-0.5" style={{ color: IVORY, opacity: 0.55 }}>STAKEHOLDERS NOTIFIED</div>
        </div>
        <div className="flex-1 rounded-sm p-3 text-center" style={{ backgroundColor: "#0A1228", border: "1px solid #1E2D5A" }}>
          <div className="text-2xl font-bold" style={{ color: GOLD, fontFamily: "Georgia, serif" }}>{taskCount}</div>
          <div className="text-xs font-mono mt-0.5" style={{ color: IVORY, opacity: 0.55 }}>TASKS ACTIVATED</div>
        </div>
        <div className="flex-1 rounded-sm p-3 text-center" style={{ backgroundColor: "#0A1228", border: "1px solid #1E2D5A" }}>
          <div className="text-2xl font-bold" style={{ color: "white", fontFamily: "Georgia, serif" }}>12</div>
          <div className="text-xs font-mono mt-0.5" style={{ color: IVORY, opacity: 0.55 }}>MIN EXECUTION</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Audible Preview (Interactive) ─────────────────────────────────────── */
type DeltaDecision = "accepted" | "reverted" | null;

function AudiblePreview({ stakeholders, onConfirm }: { stakeholders: Stakeholder[]; onConfirm?: () => void }) {
  const primaryOwner = stakeholders[0];
  const legalOwner = stakeholders.find(s => s.role.toLowerCase().includes("legal")) ?? stakeholders[1];

  const deltaItems = [
    {
      field: "Primary Protocol Owner",
      impact: "HIGH" as const,
      prestaged: primaryOwner?.name ?? "Chief Executive Officer",
      current: `Deputy ${primaryOwner?.role ?? "Executive"} (${primaryOwner?.name ?? "Primary lead"} has competing engagement)`,
      consequence: "Delays first decision gate by up to 4 minutes if not resolved before activation",
    },
    {
      field: "External Counsel Availability",
      impact: "MEDIUM" as const,
      prestaged: "Gibson Dunn — pre-authorized, on retainer",
      current: "Lead partner traveling internationally — confirm deputy availability",
      consequence: "Legal sign-off on external disclosures may require re-routing",
    },
    {
      field: `${legalOwner?.name ?? "Board"} Notification Channel`,
      impact: "MEDIUM" as const,
      prestaged: "Immediate — primary mobile (pre-staged)",
      current: "Board chair confirmed traveling — use secure backup channel",
      consequence: "Authorization chain intact; channel change logged in governance record",
    },
  ];

  const [decisions, setDecisions] = useState<DeltaDecision[]>([null, null, null]);

  const decide = (index: number, value: DeltaDecision) => {
    setDecisions(prev => {
      const next = [...prev];
      next[index] = next[index] === value ? null : value;
      return next;
    });
  };

  const reviewed = decisions.filter(d => d !== null).length;
  const allReviewed = reviewed === deltaItems.length;
  const acceptedCount = decisions.filter(d => d === "accepted").length;
  const revertedCount = decisions.filter(d => d === "reverted").length;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-mono tracking-wider" style={{ color: GOLD }}>DELTA FROM PRE-STAGED PROTOCOL</p>
        <span className="text-xs font-mono" style={{ color: reviewed === deltaItems.length ? TEAL : IVORY, opacity: reviewed === deltaItems.length ? 1 : 0.5 }}>
          {reviewed}/{deltaItems.length} REVIEWED
        </span>
      </div>
      <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: "#1E2D5A" }}>
        <div className="h-full transition-all duration-300" style={{ width: `${(reviewed / deltaItems.length) * 100}%`, backgroundColor: allReviewed ? TEAL : GOLD }} />
      </div>

      {/* Delta items */}
      <div className="space-y-3">
        {deltaItems.map((item, i) => {
          const decision = decisions[i];
          const borderColor = decision === "accepted" ? TEAL : decision === "reverted" ? GOLD : "#1E2D5A";
          const bg = decision === "accepted" ? `${TEAL}0D` : decision === "reverted" ? `${GOLD}0D` : "#0A1228";
          return (
            <div key={i} className="rounded-sm p-4 transition-all duration-200" style={{ backgroundColor: bg, border: `1px solid ${borderColor}` }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono font-bold" style={{ color: GOLD }}>{item.field}</span>
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded-sm"
                      style={{ backgroundColor: item.impact === "HIGH" ? `${RED}20` : `${GOLD}18`, color: item.impact === "HIGH" ? RED : GOLD }}>
                      {item.impact}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: IVORY, opacity: 0.45 }}>Pre-staged: {item.prestaged}</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: "white" }}>Current state: {item.current}</p>
                  <p className="text-xs mt-1.5 italic" style={{ color: IVORY, opacity: 0.5 }}>↳ {item.consequence}</p>
                </div>
              </div>
              {/* Decision buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => decide(i, "accepted")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold tracking-wide rounded-sm transition-all duration-150"
                  style={{
                    backgroundColor: decision === "accepted" ? TEAL : "transparent",
                    border: `1px solid ${decision === "accepted" ? TEAL : "#2B8A6E50"}`,
                    color: decision === "accepted" ? NAVY : TEAL,
                  }}>
                  <Check className="w-3 h-3" />
                  Accept Change
                </button>
                <button
                  onClick={() => decide(i, "reverted")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold tracking-wide rounded-sm transition-all duration-150"
                  style={{
                    backgroundColor: decision === "reverted" ? GOLD : "transparent",
                    border: `1px solid ${decision === "reverted" ? GOLD : `${GOLD}50`}`,
                    color: decision === "reverted" ? NAVY : GOLD,
                  }}>
                  <RotateCcw className="w-3 h-3" />
                  Keep Pre-Staged
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary + confirm */}
      {allReviewed && (
        <div className="space-y-3">
          <div className="rounded-sm p-3 flex gap-4" style={{ backgroundColor: "#0A1228", border: `1px solid ${TEAL}40` }}>
            <div className="text-center flex-1">
              <div className="text-xl font-bold" style={{ color: TEAL, fontFamily: "Georgia, serif" }}>{acceptedCount}</div>
              <div className="text-xs font-mono mt-0.5" style={{ color: IVORY, opacity: 0.5 }}>CHANGES ACCEPTED</div>
            </div>
            <div className="w-px" style={{ backgroundColor: "#1E2D5A" }} />
            <div className="text-center flex-1">
              <div className="text-xl font-bold" style={{ color: GOLD, fontFamily: "Georgia, serif" }}>{revertedCount}</div>
              <div className="text-xs font-mono mt-0.5" style={{ color: IVORY, opacity: 0.5 }}>REVERTED TO PRE-STAGED</div>
            </div>
          </div>
          <button
            onClick={onConfirm}
            className="w-full py-3 font-mono font-bold tracking-wider text-sm flex items-center justify-center gap-2 rounded-sm"
            style={{ backgroundColor: GOLD, color: NAVY }}>
            Confirm — Activate Adjusted Protocol
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
      {!allReviewed && (
        <p className="text-xs text-center font-mono" style={{ color: IVORY, opacity: 0.35 }}>
          Review all {deltaItems.length} items above to confirm
        </p>
      )}
    </div>
  );
}

/* ─── Customize Preview (Interactive) ───────────────────────────────────── */
interface LeveragePoint {
  rank: number;
  label: string;
  defaultValue: string;
  why: string;
  placeholder: string;
}

function CustomizePreview({ taskCount, onConfirm }: { taskCount: number; onConfirm?: () => void }) {
  const leveragePoints: LeveragePoint[] = [
    {
      rank: 1,
      label: "Primary Protocol Owner",
      defaultValue: "Chief Legal Officer",
      why: "Highest impact on execution velocity — wrong owner adds 4–6 minutes",
      placeholder: "Name or role of the primary owner",
    },
    {
      rank: 2,
      label: "First External Communication",
      defaultValue: "Template: Regulatory Disclosure v3",
      why: "Sets the narrative frame — changes here cascade to all subsequent communications",
      placeholder: "Template name or custom message",
    },
    {
      rank: 3,
      label: "Escalation Threshold",
      defaultValue: "Board notification at T+30min",
      why: "Too late for most material events — adjusting this changes the entire authorization chain",
      placeholder: "e.g. Board notification at T+15min",
    },
  ];

  const [values, setValues] = useState<string[]>(leveragePoints.map(lp => lp.defaultValue));

  const changedCount = values.filter((v, i) => v.trim() !== leveragePoints[i].defaultValue).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono tracking-wider" style={{ color: BLUE }}>3 HIGHEST-LEVERAGE CUSTOMIZATION POINTS</p>
        {changedCount > 0 && (
          <span className="text-xs font-mono px-2 py-0.5 rounded-sm" style={{ backgroundColor: `${BLUE}20`, color: BLUE }}>
            {changedCount} MODIFIED
          </span>
        )}
      </div>
      <p className="text-xs" style={{ color: IVORY, opacity: 0.55 }}>
        Edit any field. All other {taskCount} tasks execute exactly as pre-staged.
      </p>

      <div className="space-y-4">
        {leveragePoints.map((lp, i) => {
          const isChanged = values[i].trim() !== lp.defaultValue;
          return (
            <div key={i} className="rounded-sm p-4 transition-all duration-200"
              style={{ backgroundColor: "#0A1228", border: `1px solid ${isChanged ? BLUE : "#1E2D5A"}` }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-xl font-bold shrink-0 w-7 text-right" style={{ color: BLUE, fontFamily: "'Courier New', monospace", opacity: 0.5 }}>
                  {String(lp.rank).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold" style={{ color: "white" }}>{lp.label}</p>
                    {isChanged && (
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: `${BLUE}20`, color: BLUE }}>MODIFIED</span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: IVORY, opacity: 0.5 }}>{lp.why}</p>
                </div>
              </div>
              <input
                type="text"
                value={values[i]}
                onChange={e => setValues(prev => { const next = [...prev]; next[i] = e.target.value; return next; })}
                placeholder={lp.placeholder}
                className="w-full px-3 py-2 text-sm rounded-sm transition-all duration-150"
                style={{
                  backgroundColor: "#060D1E",
                  border: `1px solid ${isChanged ? BLUE : "#1E2D5A"}`,
                  color: isChanged ? "white" : IVORY,
                  outline: "none",
                }}
              />
              {isChanged && (
                <button
                  onClick={() => setValues(prev => { const next = [...prev]; next[i] = lp.defaultValue; return next; })}
                  className="mt-1.5 text-xs flex items-center gap-1 font-mono"
                  style={{ color: IVORY, opacity: 0.4 }}>
                  <RotateCcw className="w-3 h-3" /> Revert to pre-staged
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onConfirm}
        className="w-full py-3 font-mono font-bold tracking-wider text-sm flex items-center justify-center gap-2 rounded-sm mt-2"
        style={{ backgroundColor: BLUE, color: "white" }}>
        {changedCount > 0
          ? `Confirm — Activate with ${changedCount} Modification${changedCount > 1 ? "s" : ""}`
          : "Confirm — Activate as Pre-Staged"}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─── Stand Down Preview ─────────────────────────────────────────────────── */
function StandDownPreview({ triggerName }: { triggerName: string }) {
  return (
    <div className="space-y-4">
      <div className="rounded-sm p-4" style={{ backgroundColor: "#0A1228", border: "1px solid #C0505030" }}>
        <p className="text-xs font-mono tracking-wider mb-3" style={{ color: RED }}>WHAT GETS RECORDED</p>
        <div className="space-y-3">
          {[
            { icon: FileText, label: "Trigger detection log preserved", detail: `"${triggerName}" — detected, reviewed, declined` },
            { icon: Users, label: "Executive decision authority recorded", detail: "Name, role, timestamp of the stand-down authorization" },
            { icon: Clock, label: "Reason field required", detail: "Brief rationale is captured for governance and future calibration" },
            { icon: CheckCircle, label: "No tasks activated", detail: "Protocol remains staged and ready for next detection" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <item.icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: RED }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "white" }}>{item.label}</p>
                <p className="text-xs" style={{ color: IVORY, opacity: 0.6 }}>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs" style={{ color: IVORY, opacity: 0.55 }}>
        The governance record of this stand-down is used to refine future trigger sensitivity. Every decision — activation or stand-down — compounds the intelligence of the system.
      </p>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function ConsequencePreview({
  triggerName,
  playbookName,
  stakeholders = DEFAULT_STAKEHOLDERS,
  taskCount = 12,
  onChoiceSelected,
  onConfirm,
  compact = false,
}: ConsequencePreviewProps) {
  const [selected, setSelected] = useState<ConsequenceChoice | null>(null);
  const [standDownReason, setStandDownReason] = useState("");

  const handleSelect = (choice: ConsequenceChoice) => {
    setSelected(choice);
    setStandDownReason("");
    onChoiceSelected?.(choice);
  };

  const selectedChoice = CHOICES.find(c => c.id === selected);

  return (
    <div className="rounded-sm border" style={{ borderColor: "#1E2D5A", backgroundColor: NAVY }}>
      {/* Header */}
      <div className="border-b px-6 py-4" style={{ borderColor: "#1E2D5A" }}>
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4" style={{ color: GOLD }} />
          <span className="text-xs font-mono tracking-widest" style={{ color: GOLD }}>EXECUTIVE AUTHORIZATION REQUIRED</span>
        </div>
        <h3 className="font-bold text-lg" style={{ color: "white", fontFamily: "Georgia, serif" }}>
          "{triggerName}" — Trigger Detected
        </h3>
        <p className="text-sm" style={{ color: IVORY, opacity: 0.65 }}>
          Pre-staged: <span style={{ color: GOLD }}>{playbookName}</span> · {taskCount} tasks ready · {stakeholders.length} stakeholders pre-assigned
        </p>
      </div>

      <div className="p-6">
        <p className="text-sm mb-5 font-semibold" style={{ color: IVORY }}>
          Select your response. Each choice shows exactly what happens next.
        </p>

        {/* 4 choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {CHOICES.map(choice => {
            const Icon = choice.icon;
            const isSelected = selected === choice.id;
            return (
              <button
                key={choice.id}
                onClick={() => handleSelect(choice.id)}
                className="text-left rounded-sm border p-4 transition-all duration-150"
                style={{
                  borderColor: isSelected ? choice.color : "#1E2D5A",
                  backgroundColor: isSelected ? `${choice.color}12` : "#0A1228",
                  outline: isSelected ? `2px solid ${choice.color}` : "none",
                  outlineOffset: "-1px",
                }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: choice.color }} />
                  <span className="font-bold text-sm" style={{ color: isSelected ? choice.color : "white" }}>
                    {choice.label}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: IVORY, opacity: 0.7 }}>
                  {choice.sublabel}
                </p>
              </button>
            );
          })}
        </div>

        {/* Consequence panel */}
        {selected && selectedChoice && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ backgroundColor: "#1E2D5A" }} />
              <span className="text-xs font-mono tracking-widest" style={{ color: selectedChoice.color }}>
                CONSEQUENCE PREVIEW — {selectedChoice.label.toUpperCase()}
              </span>
              <div className="h-px flex-1" style={{ backgroundColor: "#1E2D5A" }} />
            </div>

            <p className="text-sm mb-4 leading-relaxed" style={{ color: IVORY, opacity: 0.8 }}>
              {selectedChoice.description}
            </p>

            {selected === "run_as_built" && (
              <>
                <RunAsBuiltPreview stakeholders={stakeholders} taskCount={taskCount} triggerName={triggerName} />
                <button
                  onClick={() => onConfirm?.("run_as_built")}
                  className="mt-5 w-full py-3 font-mono font-bold tracking-wider text-sm flex items-center justify-center gap-2 rounded-sm"
                  style={{ backgroundColor: TEAL, color: NAVY }}>
                  Confirm — Run as Built
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {selected === "audible" && (
              <AudiblePreview
                stakeholders={stakeholders}
                onConfirm={() => onConfirm?.("audible")}
              />
            )}

            {selected === "customize" && (
              <CustomizePreview
                taskCount={taskCount}
                onConfirm={() => onConfirm?.("customize")}
              />
            )}

            {selected === "stand_down" && (
              <>
                <StandDownPreview triggerName={triggerName} />
                <div className="mt-5 space-y-3">
                  <textarea
                    value={standDownReason}
                    onChange={e => setStandDownReason(e.target.value)}
                    className="w-full p-3 text-sm rounded-sm resize-none"
                    rows={2}
                    placeholder="Brief reason for stand-down (required for governance record)..."
                    style={{ backgroundColor: "#0A1228", border: "1px solid #C0505060", color: IVORY, outline: "none" }}
                  />
                  <button
                    onClick={() => standDownReason.trim() && onConfirm?.("stand_down", standDownReason)}
                    disabled={!standDownReason.trim()}
                    className="w-full py-3 font-mono font-bold tracking-wider text-sm rounded-sm"
                    style={{
                      backgroundColor: standDownReason.trim() ? RED : "#3A2020",
                      color: "white",
                      cursor: standDownReason.trim() ? "pointer" : "not-allowed",
                      opacity: standDownReason.trim() ? 1 : 0.5,
                    }}>
                    Confirm Stand Down — Record Decision
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
