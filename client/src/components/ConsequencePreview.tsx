import { useState } from "react";
import { Zap, Volume2, Settings, XCircle, Clock, Users, FileText, CheckCircle, ChevronRight } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";

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
    description: "Shows the delta between the pre-staged protocol and current organizational state — personnel changes, resource availability, stakeholder updates. You approve the adjusted version before activation.",
  },
  {
    id: "customize",
    label: "Customize",
    sublabel: "Modify the three highest-leverage points",
    icon: Settings,
    color: "#6B8CFF",
    description: "Opens the three highest-impact customization points in this protocol — typically: primary owner, first communication template, and escalation threshold. All other tasks run as pre-staged.",
  },
  {
    id: "stand_down",
    label: "Stand Down",
    sublabel: "Decline activation — record the decision",
    icon: XCircle,
    color: "#C05050",
    description: "No tasks are activated. The trigger detection is logged with a governance record of the stand-down decision, the reason, and the executive who made the call. Audit trail preserved.",
  },
];

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

function AudiblePreview({ stakeholders }: { stakeholders: Stakeholder[] }) {
  const changes = [
    { field: "Primary Owner", from: "Sarah Chen, CLO", to: "Marcus Webb, Deputy CLO (Sarah Chen on leave)", impact: "High" },
    { field: "External Counsel", from: "Gibson Dunn (pre-staged)", to: "Confirm availability before activating", impact: "Medium" },
    { field: "Board Notification", from: "Immediate (pre-staged)", to: "Board chair traveling — confirm channel", impact: "Medium" },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-sm p-4" style={{ backgroundColor: "#0A1228", border: `1px solid ${GOLD}40` }}>
        <p className="text-xs font-mono tracking-wider mb-3" style={{ color: GOLD }}>DELTA FROM PRE-STAGED PROTOCOL</p>
        <p className="text-xs mb-4" style={{ color: IVORY, opacity: 0.6 }}>These items differ from the protocol design based on current organizational state:</p>
        <div className="space-y-3">
          {changes.map((c, i) => (
            <div key={i} className="border-l-2 pl-3" style={{ borderColor: GOLD }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold" style={{ color: GOLD }}>{c.field}</span>
                <span className="text-xs font-mono px-1.5 py-0.5 rounded-sm"
                  style={{ backgroundColor: c.impact === "High" ? "#C0505020" : `${GOLD}18`, color: c.impact === "High" ? "#C05050" : GOLD }}>
                  {c.impact.toUpperCase()} IMPACT
                </span>
              </div>
              <p className="text-xs mb-0.5" style={{ color: IVORY, opacity: 0.5 }}>Was: {c.from}</p>
              <p className="text-xs font-semibold" style={{ color: "white" }}>Now: {c.to}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs" style={{ color: IVORY, opacity: 0.55 }}>
        Review and confirm these adjustments. All other protocol elements execute as pre-staged.
      </p>
    </div>
  );
}

function CustomizePreview({ taskCount }: { taskCount: number }) {
  const leveragePoints = [
    { rank: 1, label: "Primary Protocol Owner", current: "Chief Legal Officer", why: "Highest impact on execution velocity — wrong owner adds 4–6 minutes" },
    { rank: 2, label: "First External Communication", current: "Template: Regulatory Disclosure v3", why: "Sets the narrative frame — changes here cascade to all subsequent communications" },
    { rank: 3, label: "Escalation Threshold", current: "Board notification at T+30min", why: "Too late for most material events — adjusting this changes the entire authorization chain" },
  ];
  return (
    <div className="space-y-3">
      <div className="rounded-sm p-4" style={{ backgroundColor: "#0A1228", border: "1px solid #1E2D5A" }}>
        <p className="text-xs font-mono tracking-wider mb-3" style={{ color: "#6B8CFF" }}>3 HIGHEST-LEVERAGE CUSTOMIZATION POINTS</p>
        <p className="text-xs mb-4" style={{ color: IVORY, opacity: 0.6 }}>All other {taskCount} tasks execute as pre-staged. Only these three points are open for modification.</p>
        <div className="space-y-4">
          {leveragePoints.map((lp, i) => (
            <div key={i} className="flex gap-3">
              <div className="text-2xl font-bold shrink-0" style={{ color: "#6B8CFF", fontFamily: "'Courier New', monospace", opacity: 0.4 }}>
                {String(lp.rank).padStart(2, "0")}
              </div>
              <div>
                <p className="text-sm font-bold mb-0.5" style={{ color: "white" }}>{lp.label}</p>
                <p className="text-xs mb-1" style={{ color: GOLD }}>Current: {lp.current}</p>
                <p className="text-xs" style={{ color: IVORY, opacity: 0.6 }}>{lp.why}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StandDownPreview({ triggerName }: { triggerName: string }) {
  return (
    <div className="space-y-4">
      <div className="rounded-sm p-4" style={{ backgroundColor: "#0A1228", border: "1px solid #C0505030" }}>
        <p className="text-xs font-mono tracking-wider mb-3" style={{ color: "#C05050" }}>WHAT GETS RECORDED</p>
        <div className="space-y-3">
          {[
            { icon: FileText, label: "Trigger detection log preserved", detail: `"${triggerName}" — detected, reviewed, declined` },
            { icon: Users, label: "Executive decision authority recorded", detail: "Name, role, timestamp of the stand-down authorization" },
            { icon: Clock, label: "Reason field required", detail: "Brief rationale is captured for governance and future calibration" },
            { icon: CheckCircle, label: "No tasks activated", detail: "Protocol remains staged and ready for next detection" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <item.icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#C05050" }} />
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
        {/* Choice instruction */}
        <p className="text-sm mb-5 font-semibold" style={{ color: IVORY }}>
          Select your response. Each choice shows exactly what happens in the next 60 seconds.
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

        {/* Preview panel — shows what happens for the selected choice */}
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
              <RunAsBuiltPreview stakeholders={stakeholders} taskCount={taskCount} triggerName={triggerName} />
            )}
            {selected === "audible" && <AudiblePreview stakeholders={stakeholders} />}
            {selected === "customize" && <CustomizePreview taskCount={taskCount} />}
            {selected === "stand_down" && <StandDownPreview triggerName={triggerName} />}

            {/* Confirm button */}
            {selected !== "stand_down" && (
              <button
                onClick={() => onConfirm?.(selected!)}
                className="mt-5 w-full py-3 font-mono font-bold tracking-wider text-sm flex items-center justify-center gap-2"
                style={{ backgroundColor: selectedChoice.color, color: selected === "audible" ? NAVY : "white", borderRadius: "0.15rem" }}>
                Confirm — {selectedChoice.label}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {selected === "stand_down" && (
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
                  className="w-full py-3 font-mono font-bold tracking-wider text-sm"
                  style={{
                    backgroundColor: standDownReason.trim() ? "#C05050" : "#3A2020",
                    color: "white",
                    borderRadius: "0.15rem",
                    cursor: standDownReason.trim() ? "pointer" : "not-allowed",
                    opacity: standDownReason.trim() ? 1 : 0.5,
                  }}>
                  Confirm Stand Down — Record Decision
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
