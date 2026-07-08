import type { QuantitativeSignal } from './types.js';

const FEMA_API = 'https://www.fema.gov/api/open/v2/disasterDeclarationsSummaries';
const NOAA_ALERTS = 'https://api.weather.gov/alerts/active?status=actual&message_type=alert&severity=Extreme,Severe&urgency=Immediate,Expected&limit=50';
const LOOKBACK_DAYS = 14;

interface FEMADeclaration {
  disasterNumber: number;
  declarationDate: string;
  declarationType: string;
  state: string;
  declarationTitle: string;
  incidentType: string;
  incidentBeginDate: string;
  incidentEndDate?: string;
  tribalRequest?: boolean;
  ihProgramDeclared?: boolean;
  iaProgramDeclared?: boolean;
  paProgramDeclared?: boolean;
  hmProgramDeclared?: boolean;
}

interface FEMAResponse {
  DisasterDeclarationsSummaries?: FEMADeclaration[];
  metadata?: { count: number };
}

interface NOAAAlert {
  properties: {
    id: string;
    areaDesc: string;
    severity: string;
    certainty: string;
    urgency: string;
    event: string;
    headline?: string;
    description?: string;
    effective: string;
    expires: string;
    senderName?: string;
  };
}

interface NOAAResponse {
  features?: NOAAAlert[];
}

const HIGH_IMPACT_INCIDENTS = ['Hurricane', 'Flood', 'Tornado', 'Earthquake', 'Wildfire', 'Winter Storm', 'Tsunami', 'Severe Storm', 'Drought', 'Extreme Cold'];
const OPERATIONAL_HUBS = ['CA', 'TX', 'NY', 'FL', 'IL', 'OH', 'PA', 'GA', 'NC', 'WA', 'OR', 'NJ', 'VA', 'MA'];

function incidentToImpact(incidentType: string, state: string, programsActive: number): 'critical' | 'high' | 'medium' | 'low' {
  const isHigh = HIGH_IMPACT_INCIDENTS.some(i => incidentType.toLowerCase().includes(i.toLowerCase()));
  const isMajorHub = OPERATIONAL_HUBS.includes(state);
  if (isHigh && isMajorHub && programsActive >= 3) return 'critical';
  if (isHigh && (isMajorHub || programsActive >= 2)) return 'high';
  if (isHigh || programsActive >= 2) return 'medium';
  return 'low';
}

async function fetchFEMADeclarations(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];
  const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 86400000);
  const dateStr = cutoff.toISOString();

  try {
    const url = `${FEMA_API}?$filter=declarationDate ge '${dateStr}'&$orderby=declarationDate desc&$top=20&$format=json`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ReadinessOS/1.0 signal-intelligence' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`FEMA API ${res.status}`);

    const data = await res.json() as FEMAResponse;
    const declarations = data.DisasterDeclarationsSummaries || [];

    let added = 0;
    for (const dec of declarations.slice(0, 10)) {
      const programsActive = [dec.ihProgramDeclared, dec.iaProgramDeclared, dec.paProgramDeclared, dec.hmProgramDeclared].filter(Boolean).length;
      const impact = incidentToImpact(dec.incidentType, dec.state, programsActive);
      if (impact === 'low') continue;

      const confidence = impact === 'critical' ? 87 : impact === 'high' ? 80 : 72;
      const activePrograms = [
        dec.ihProgramDeclared && 'Individual Assistance',
        dec.iaProgramDeclared && 'Individual & Households',
        dec.paProgramDeclared && 'Public Assistance',
        dec.hmProgramDeclared && 'Hazard Mitigation',
      ].filter(Boolean).join(', ');

      signals.push({
        signalType: 'supply_chain',
        description: `FEMA Disaster Declaration #${dec.disasterNumber}: ${dec.declarationTitle} — ${dec.incidentType} in ${dec.state}. ${dec.declarationType} declaration. Active programs: ${activePrograms || 'Basic assistance'}. Operational continuity and supply chain resilience protocols warranted for operations in or through ${dec.state}.`,
        confidence,
        impact,
        timeline: '1-7 days',
        source: 'FEMA — Federal Emergency Management Agency',
        sourceUrl: `https://www.fema.gov/disaster/${dec.disasterNumber}`,
        category: 'supply_chain',
        jurisdiction: `US-${dec.state}`,
        confidenceTier: 1,
        enforcementActionType: null,
        regulatorAgency: 'FEMA',
        penaltyAmountRange: null,
        namedSector: null,
        threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: null,
        economicIndicatorType: null, indicatorDirection: null, indicatorMagnitude: null, centralBank: null,
        tradeActionType: null, effectiveTimeline: dec.incidentBeginDate, tradePartner: null, affectedHsCodes: null,
        recallClass: null,
        affectedProductType: 'Operations / Infrastructure',
        recallScope: `${dec.state} — ${dec.declarationType} declaration`,
        signalEventType: 'disaster_declaration',
        metricName: 'Programs Activated',
        metricValue: programsActive,
        metricThreshold: 2,
        metricUnit: 'federal programs',
      });
      added++;
    }

    console.log(`[FEMA] ${added} significant disaster declaration(s) in last ${LOOKBACK_DAYS} days`);
    return signals;
  } catch (err) {
    console.warn(`[FEMA] Fetch failed:`, err instanceof Error ? err.message : err);
    return [];
  }
}

async function fetchNOAASevereWeather(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];

  try {
    const res = await fetch(NOAA_ALERTS, {
      headers: { 'User-Agent': 'ReadinessOS/1.0 signal-intelligence (contact: readiness-os@example.com)', Accept: 'application/geo+json' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];

    const data = await res.json() as NOAAResponse;
    const alerts = (data.features || []).filter(f => {
      const sev = f.properties.severity;
      return sev === 'Extreme' || sev === 'Severe';
    });

    if (alerts.length === 0) return [];

    const extremeAlerts = alerts.filter(a => a.properties.severity === 'Extreme');
    const affectedAreas = Array.from(new Set(alerts.map(a => a.properties.areaDesc.split(';')[0].trim()))).slice(0, 5);
    const eventTypes = Array.from(new Set(alerts.map(a => a.properties.event))).slice(0, 4);

    const confidence = extremeAlerts.length > 0 ? 83 : 73;
    const impact = extremeAlerts.length >= 3 ? 'critical' : extremeAlerts.length >= 1 ? 'high' : 'medium';

    signals.push({
      signalType: 'supply_chain',
      description: `NOAA Weather Alert: ${alerts.length} active severe/extreme weather alert(s). ${extremeAlerts.length > 0 ? `${extremeAlerts.length} EXTREME severity.` : ''} Event types: ${eventTypes.join(', ')}. Affected areas: ${affectedAreas.join('; ')}. Operational continuity and logistics readiness review recommended.`,
      confidence,
      impact,
      timeline: 'immediate',
      source: 'NOAA — National Weather Service',
      sourceUrl: 'https://www.weather.gov/alerts',
      category: 'supply_chain',
      jurisdiction: 'US',
      confidenceTier: 1,
      enforcementActionType: null,
      regulatorAgency: 'NOAA',
      penaltyAmountRange: null,
      namedSector: 'Logistics / Operations',
      threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: 'Operations',
      economicIndicatorType: null, indicatorDirection: null, indicatorMagnitude: null, centralBank: null,
      tradeActionType: null, effectiveTimeline: null, tradePartner: null, affectedHsCodes: null,
      recallClass: null, affectedProductType: 'Logistics / Facilities', recallScope: affectedAreas.join('; '),
      signalEventType: 'severe_weather',
      metricName: 'Active Severe/Extreme Alerts',
      metricValue: alerts.length,
      metricThreshold: 3,
      metricUnit: 'alerts',
    });

    console.log(`[NOAA] ${alerts.length} active severe/extreme weather alert(s)`);
    return signals;
  } catch (err) {
    console.warn(`[NOAA] Fetch failed:`, err instanceof Error ? err.message : err);
    return [];
  }
}

export async function fetchNOAAFEMASignals(): Promise<QuantitativeSignal[]> {
  const [fema, noaa] = await Promise.allSettled([fetchFEMADeclarations(), fetchNOAASevereWeather()]);
  return [
    ...(fema.status === 'fulfilled' ? fema.value : []),
    ...(noaa.status === 'fulfilled' ? noaa.value : []),
  ];
}
