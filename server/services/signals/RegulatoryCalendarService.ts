import type { QuantitativeSignal } from './types.js';

interface CalendarEvent {
  date: string;
  name: string;
  description: string;
  domain: string;
  triggerProtocols: string[];
  impact: 'critical' | 'high' | 'medium';
  warningDays: number;
  actionDays: number;
}

// ── Known 2026 regulatory calendar ─────────────────────────────────────────────
const CALENDAR_EVENTS: CalendarEvent[] = [
  // FOMC meetings 2026 (Federal Reserve)
  { date: '2026-01-29', name: 'FOMC Rate Decision', description: 'Federal Reserve Federal Open Market Committee rate decision. Markets and executive teams must be prepared for unexpected rate moves affecting debt service, capital access, and acquisition financing.', domain: 'Financial', triggerProtocols: ['Financial Crisis Response', 'Investor Communications Protocol'], impact: 'high', warningDays: 7, actionDays: 2 },
  { date: '2026-03-19', name: 'FOMC Rate Decision', description: 'Federal Reserve FOMC rate decision with updated Summary of Economic Projections (SEP). Rate surprises at this meeting can trigger broad market volatility.', domain: 'Financial', triggerProtocols: ['Financial Crisis Response', 'Investor Communications Protocol'], impact: 'high', warningDays: 7, actionDays: 2 },
  { date: '2026-05-07', name: 'FOMC Rate Decision', description: 'Federal Reserve FOMC rate decision. Mid-year policy decisions often reflect accumulated data surprises.', domain: 'Financial', triggerProtocols: ['Financial Crisis Response'], impact: 'high', warningDays: 7, actionDays: 2 },
  { date: '2026-06-18', name: 'FOMC Rate Decision + SEP', description: 'Federal Reserve FOMC rate decision with Summary of Economic Projections — highest-impact Fed meeting of the year for market reaction.', domain: 'Financial', triggerProtocols: ['Financial Crisis Response', 'Investor Communications Protocol'], impact: 'critical', warningDays: 10, actionDays: 3 },
  { date: '2026-07-30', name: 'FOMC Rate Decision', description: 'Federal Reserve FOMC rate decision. Summer meeting often coincides with Q2 earnings season, compounding market sensitivity.', domain: 'Financial', triggerProtocols: ['Financial Crisis Response'], impact: 'high', warningDays: 7, actionDays: 2 },
  { date: '2026-09-17', name: 'FOMC Rate Decision + SEP', description: 'Federal Reserve FOMC rate decision with SEP. September meetings are historically the most market-sensitive — this is the meeting investors watch for rate cycle pivots.', domain: 'Financial', triggerProtocols: ['Financial Crisis Response', 'Investor Communications Protocol'], impact: 'critical', warningDays: 10, actionDays: 3 },
  { date: '2026-11-05', name: 'FOMC Rate Decision', description: 'Federal Reserve FOMC rate decision. Post-election meeting — policy may be influenced by new fiscal outlook.', domain: 'Financial', triggerProtocols: ['Financial Crisis Response', 'Geopolitical Risk Response'], impact: 'high', warningDays: 7, actionDays: 2 },
  { date: '2026-12-17', name: 'FOMC Rate Decision + SEP', description: 'Federal Reserve year-end FOMC decision with SEP. Year-end policy signals set expectations for the following year — critical for strategic planning and investor relations.', domain: 'Financial', triggerProtocols: ['Financial Crisis Response', 'Investor Communications Protocol'], impact: 'critical', warningDays: 10, actionDays: 3 },

  // Earnings seasons (Q1-Q4)
  { date: '2026-01-12', name: 'Q4 Earnings Season Opens', description: 'Major corporate Q4 earnings reporting begins. Earnings misses, guidance cuts, and unexpected charges trigger rapid investor and media response. Activist investor activity historically spikes in weeks following earnings disappointments.', domain: 'Financial', triggerProtocols: ['Investor Communications Protocol', 'M&A Response Prepared response'], impact: 'medium', warningDays: 5, actionDays: 1 },
  { date: '2026-04-13', name: 'Q1 Earnings Season Opens', description: 'Q1 corporate earnings season. First quarter results reveal how companies absorbed year-start conditions. Supply chain, consumer demand, and cost signals emerge here first.', domain: 'Financial', triggerProtocols: ['Investor Communications Protocol', 'Supply Chain Disruption Protocol'], impact: 'medium', warningDays: 5, actionDays: 1 },
  { date: '2026-07-13', name: 'Q2 Earnings Season Opens', description: 'Q2 corporate earnings season — mid-year check. Companies may revise full-year guidance, triggering volatility. M&A activity tends to peak in the weeks following earnings season.', domain: 'Financial', triggerProtocols: ['Investor Communications Protocol', 'M&A Response Prepared response'], impact: 'medium', warningDays: 5, actionDays: 1 },
  { date: '2026-10-12', name: 'Q3 Earnings Season Opens', description: 'Q3 corporate earnings season. Fall earnings reflect back-to-school and pre-holiday conditions. Retail, consumer, and tech sectors show highest sensitivity. This season frequently precedes significant strategic announcements.', domain: 'Financial', triggerProtocols: ['Investor Communications Protocol', 'Competitive Threat Response'], impact: 'medium', warningDays: 5, actionDays: 1 },

  // Annual compliance deadlines
  { date: '2026-03-31', name: 'Q4 SEC Annual Report Deadline (10-K)', description: 'SEC 10-K annual report deadline for calendar-year-end public companies. Material weaknesses disclosed in 10-K filings trigger significant investor and regulatory scrutiny. Restatement risks are highest in the weeks surrounding this deadline.', domain: 'Regulatory & Compliance', triggerProtocols: ['Regulatory Disclosure Protocol', 'Regulatory Compliance Sprint'], impact: 'high', warningDays: 14, actionDays: 5 },
  { date: '2026-05-15', name: 'Proxy Season Peak (Shareholder Votes)', description: 'Annual shareholder meeting season peaks. Activist investor proposals, executive compensation votes, and ESG resolutions reach maximum investor attention. Proxy advisors (ISS, Glass Lewis) publish final recommendations 6 weeks prior.', domain: 'Brand & Reputation', triggerProtocols: ['Investor Communications Protocol', 'ESG Crisis Response'], impact: 'high', warningDays: 21, actionDays: 7 },

  // GDPR anniversary / enforcement cycle
  { date: '2026-05-25', name: 'GDPR Enforcement Anniversary', description: 'Annual peak in EU GDPR enforcement actions. European Data Protection Authorities historically issue major fines in the May-June window. Organizations with EU data operations should review data governance protocols.', domain: 'Regulatory & Compliance', triggerProtocols: ['Regulatory Compliance Sprint', 'Regulatory Disclosure Protocol'], impact: 'medium', warningDays: 14, actionDays: 3 },

  // US election / political transition
  { date: '2026-11-03', name: 'US Midterm Election Day', description: 'US midterm elections. Congressional composition changes affect regulatory agency priorities, enforcement budgets, and legislative agendas across healthcare, energy, finance, and technology sectors. Strategic scenario planning for regulatory shifts is recommended.', domain: 'Regulatory & Compliance', triggerProtocols: ['Geopolitical Risk Response', 'Regulatory Compliance Sprint'], impact: 'high', warningDays: 21, actionDays: 3 },
];

function daysUntil(dateStr: string): number {
  const eventDate = new Date(dateStr + 'T12:00:00Z');
  return Math.ceil((eventDate.getTime() - Date.now()) / 86400000);
}

export async function fetchRegulatoryCalendarSignals(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];
  const today = new Date();

  for (const event of CALENDAR_EVENTS) {
    const days = daysUntil(event.date);

    // Only fire if within the warning window and still in the future
    if (days < 0 || days > event.warningDays) continue;

    const isAction = days <= event.actionDays;
    const confidence = isAction ? 96 : (days <= 5 ? 89 : 82);
    const impact = isAction ? event.impact : (event.impact === 'critical' ? 'high' : 'medium');
    const urgencyPrefix = days === 0 ? 'TODAY:' : days === 1 ? 'TOMORROW:' : `${days} DAYS:`;

    signals.push({
      signalType: 'regulatory',
      description: `REGULATORY CALENDAR — ${urgencyPrefix} ${event.name} (${event.date}). ${event.description} Recommended Readiness Protocols: ${event.triggerProtocols.join(', ')}.`,
      confidence,
      impact,
      timeline: days <= 2 ? 'immediate' : days <= 7 ? 'near-term' : '14 days',
      source: 'Readiness OS — Regulatory Calendar',
      sourceUrl: '/getting-started',
      category: 'regulatory',
      jurisdiction: 'US',
      confidenceTier: 1,
      enforcementActionType: 'advisory',
      regulatorAgency: event.name.includes('FOMC') ? 'Federal Reserve' : event.name.includes('SEC') ? 'SEC' : event.name.includes('GDPR') ? 'EU DPA' : null,
      penaltyAmountRange: null,
      namedSector: null,
      threatSeverity: null,
      exploitStatus: null,
      affectedVendor: null,
      cveId: null,
      affectedSector: null,
      economicIndicatorType: event.name.includes('FOMC') ? 'interest_rate' : null,
      indicatorDirection: null,
      indicatorMagnitude: null,
      centralBank: event.name.includes('FOMC') ? 'Federal Reserve' : null,
      tradeActionType: null,
      effectiveTimeline: `${days} days`,
      tradePartner: null,
      affectedHsCodes: null,
      recallClass: null,
      affectedProductType: null,
      recallScope: null,
      signalEventType: null,
      metricName: `Days until ${event.name}`,
      metricValue: days,
      metricThreshold: event.actionDays,
      metricUnit: 'days',
    });
  }

  if (signals.length > 0) {
    console.log(`[Regulatory Calendar] ${signals.length} upcoming event(s) within warning window`);
  }

  return signals;
}
