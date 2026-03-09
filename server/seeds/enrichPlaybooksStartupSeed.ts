import { db } from '../db';
import { playbookLibrary } from '@shared/schema';
import { eq, isNull } from 'drizzle-orm';
import enrichedPlaybooksData from './data/enrichedPlaybooksData.json';

interface EnrichedEntry {
  playbookNumber: number;
  whyItMatters: string | null;
  signalSources: string[] | null;
  enrichedPhases: object[] | null;
  communicationAssets: object[] | null;
  riskIndicators: object | null;
  outcomeFraming: object | null;
}

export async function seedEnrichedPlaybooks(): Promise<void> {
  try {
    const unenriched = await db
      .select({ id: playbookLibrary.id, playbookNumber: playbookLibrary.playbookNumber })
      .from(playbookLibrary)
      .where(isNull(playbookLibrary.enrichedPhases));

    if (unenriched.length === 0) {
      console.log('✅ All playbooks already have enriched content');
      return;
    }

    console.log(`🔧 Seeding enriched content for ${unenriched.length} playbooks...`);

    const data = enrichedPlaybooksData as EnrichedEntry[];
    const byNumber = new Map<number, EnrichedEntry>();
    data.forEach(e => byNumber.set(e.playbookNumber, e));

    let updated = 0;
    for (const row of unenriched) {
      const entry = byNumber.get(row.playbookNumber);
      if (!entry || (!entry.enrichedPhases && !entry.whyItMatters)) continue;

      await db
        .update(playbookLibrary)
        .set({
          whyItMatters: entry.whyItMatters,
          signalSources: entry.signalSources as any,
          enrichedPhases: entry.enrichedPhases as any,
          communicationAssets: entry.communicationAssets as any,
          riskIndicators: entry.riskIndicators as any,
          outcomeFraming: entry.outcomeFraming as any,
        })
        .where(eq(playbookLibrary.id, row.id));

      updated++;
    }

    console.log(`✅ Enriched content seeded for ${updated} playbooks`);
  } catch (error) {
    console.error('⚠️ Enriched playbook seed failed (non-fatal):', error);
  }
}
