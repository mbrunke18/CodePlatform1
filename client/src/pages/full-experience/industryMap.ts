import { SCENARIOS, SCENARIO_GROUPS, type DemoScenario } from "@/pages/demos/scenarioData";

export interface IndustryOption {
  id: string;
  label: string;
  icon: string;
  tagline: string;
  pillar: "growth" | "resilience" | "transformation" | "roles";
  pillarLabel: string;
  protocolNumber: string;
  protocolName: string;
  category: string;
}

const PILLAR_LABEL: Record<keyof typeof SCENARIO_GROUPS, string> = {
  growth: "GROWTH & POSITIONING",
  resilience: "RISK & RESILIENCE",
  transformation: "TRANSFORMATION",
  roles: "BY EXECUTIVE ROLE",
};

function buildOptions(): IndustryOption[] {
  const pillars = Object.keys(SCENARIO_GROUPS) as Array<keyof typeof SCENARIO_GROUPS>;
  const seen = new Set<string>();
  const options: IndustryOption[] = [];
  for (const pillar of pillars) {
    for (const entry of SCENARIO_GROUPS[pillar]) {
      if (seen.has(entry.id)) continue;
      const sc = SCENARIOS[entry.id];
      if (!sc) continue;
      seen.add(entry.id);
      options.push({
        id: entry.id,
        label: entry.label,
        icon: entry.icon,
        tagline: entry.tagline,
        pillar,
        pillarLabel: PILLAR_LABEL[pillar],
        protocolNumber: sc.protocolNumber,
        protocolName: sc.protocolName,
        category: sc.category,
      });
    }
  }
  return options;
}

export const INDUSTRY_OPTIONS: IndustryOption[] = buildOptions();

export function getScenarioForIndustry(id: string): DemoScenario | undefined {
  return SCENARIOS[id];
}

export const DEFAULT_SCENARIO_ID = "ransomware";

export function resolveScenario(scenarioId: string | undefined): DemoScenario {
  if (scenarioId && SCENARIOS[scenarioId]) return SCENARIOS[scenarioId];
  return SCENARIOS[DEFAULT_SCENARIO_ID];
}
