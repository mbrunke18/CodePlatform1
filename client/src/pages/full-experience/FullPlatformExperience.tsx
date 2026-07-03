import { useState, useEffect, useLayoutEffect } from "react";
import { useParams, useLocation } from "wouter";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { getScenarioForIndustry, DEFAULT_SCENARIO_ID } from "./industryMap";
import { NAVY, NAVY_BG, GOLD, W, W50, W25, BD, BC, TOTAL_CHAPTERS, ChapterRail } from "./shared";

import Ch0Welcome from "./chapters/Ch0Welcome";
import Ch1BeforeTrigger from "./chapters/Ch1BeforeTrigger";
import Ch2Trigger from "./chapters/Ch2Trigger";
import Ch3Detection from "./chapters/Ch3Detection";
import Ch4Authorization from "./chapters/Ch4Authorization";
import Ch5WarRoom from "./chapters/Ch5WarRoom";
import Ch6Timeline from "./chapters/Ch6Timeline";
import Ch7Debrief from "./chapters/Ch7Debrief";
import Ch8Advance from "./chapters/Ch8Advance";
import Ch85Organization from "./chapters/Ch85Organization";
import Ch9Recap from "./chapters/Ch9Recap";

export default function FullPlatformExperience() {
  const params = useParams<{ scenarioId?: string }>();
  const [, setLocation] = useLocation();
  const initialScenario = params.scenarioId ? getScenarioForIndustry(params.scenarioId) : undefined;

  const [industryId, setIndustryId] = useState<string | undefined>(params.scenarioId && initialScenario ? params.scenarioId : undefined);
  const [chapter, setChapter] = useState(initialScenario ? 1 : 0);
  const [furthestUnlocked, setFurthestUnlocked] = useState(initialScenario ? 1 : 0);

  const sc = getScenarioForIndustry(industryId ?? "") ?? getScenarioForIndustry(DEFAULT_SCENARIO_ID)!;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [chapter]);

  const selectIndustry = (id: string) => {
    setIndustryId(id);
    setLocation(`/full-experience/${id}`, { replace: true });
    setChapter(1);
    setFurthestUnlocked(f => Math.max(f, 1));
  };

  const next = () => {
    setChapter(c => {
      const n = Math.min(c + 1, TOTAL_CHAPTERS - 1);
      setFurthestUnlocked(f => Math.max(f, n));
      return n;
    });
  };
  const back = () => setChapter(c => Math.max(c - 1, industryId ? 1 : 0));
  const jump = (i: number) => { if (i <= furthestUnlocked) setChapter(i); };
  const restart = () => {
    setIndustryId(undefined);
    setChapter(0);
    setFurthestUnlocked(0);
    setLocation("/full-experience", { replace: true });
  };

  return (
    <div style={{ background: NAVY_BG, minHeight: "100vh", color: W }}>
      <div style={{ background: NAVY_BG, borderBottom: `1px solid ${BD}`, padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <VaughnMartinLogo color="light" height={36} variant="full" />
          <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.12)" }}/>
          <div>
            <div style={{ ...BC, fontSize: 8, fontWeight: 600, letterSpacing: "0.25em", color: W50, textTransform: "uppercase", lineHeight: 1 }}>Full Platform Experience</div>
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: W, lineHeight: 1, marginTop: 3 }}>
              {industryId ? `${sc.name} · ${sc.company}` : "Choose Your Situation to Begin"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/demo-hub" data-testid="link-all-scenarios" style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: W50, textDecoration: "none", padding: "6px 14px", border: `1px solid ${W25}` }}>← Focused Scenarios</a>
          <a href="/founding-partner-program" data-testid="link-founding-partner-header" style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: NAVY, background: GOLD, textDecoration: "none", padding: "6px 14px" }}>Apply for Founding Partner Access</a>
        </div>
      </div>

      <ChapterRail chapter={chapter} furthestUnlocked={furthestUnlocked} onJump={jump} />

      {chapter === 0 && <Ch0Welcome onSelect={selectIndustry} />}
      {chapter === 1 && industryId && <Ch1BeforeTrigger sc={sc} chapter={chapter} onNext={next} onBack={back} />}
      {chapter === 2 && industryId && <Ch2Trigger sc={sc} chapter={chapter} onNext={next} onBack={back} />}
      {chapter === 3 && industryId && <Ch3Detection sc={sc} chapter={chapter} onNext={next} onBack={back} />}
      {chapter === 4 && industryId && <Ch4Authorization sc={sc} chapter={chapter} onNext={next} onBack={back} />}
      {chapter === 5 && industryId && <Ch5WarRoom sc={sc} chapter={chapter} onNext={next} onBack={back} />}
      {chapter === 6 && industryId && <Ch6Timeline sc={sc} chapter={chapter} onNext={next} onBack={back} />}
      {chapter === 7 && industryId && <Ch7Debrief sc={sc} chapter={chapter} onNext={next} onBack={back} />}
      {chapter === 8 && industryId && <Ch8Advance sc={sc} chapter={chapter} onNext={next} onBack={back} />}
      {chapter === 9 && industryId && <Ch85Organization sc={sc} chapter={chapter} onNext={next} onBack={back} />}
      {chapter === 10 && industryId && <Ch9Recap sc={sc} onRestart={restart} />}
    </div>
  );
}
