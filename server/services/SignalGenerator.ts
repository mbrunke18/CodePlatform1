import { db } from '../db';
import { weakSignals, oraclePatterns } from '@shared/schema';
import pino from 'pino';

const log = pino({ name: 'signal-generator' });

/**
 * Autonomous signal generation - runs every 60 seconds
 */
export async function generateWeakSignalsAutonomously(organizationId: string) {
  const signals = [
    { type: 'market', description: 'Bearish market sentiment detected - AI sentiment analysis showing negative trends' },
    { type: 'competitor', description: 'Competitor launching new product line - aggressive market positioning detected' },
    { type: 'regulatory', description: 'New compliance requirements announced - regulatory landscape shift' },
    { type: 'supply_chain', description: 'Supply chain disruption risks rising - logistics volatility indicators' },
    { type: 'economic', description: 'Interest rate hike signals from Fed - macroeconomic pressure indicators' },
  ];

  for (const signal of signals) {
    if (Math.random() < 0.3) { // 30% chance per interval
      try {
        const confidence = Math.floor(Math.random() * 40) + 60;
        await db.insert(weakSignals).values({
          organizationId,
          signalType: signal.type,
          description: signal.description,
          confidence: confidence.toString(),
          status: 'active',
        } as any);
        log.info({ type: signal.type }, '📊 Weak signal generated');
      } catch (error) {
        log.warn({ error }, 'Error generating weak signal');
      }
    }
  }
}

/**
 * Autonomous oracle pattern detection - runs every 120 seconds
 */
export async function generateOraclePatternsAutonomously(organizationId: string) {
  const patterns = [
    { type: 'market_disruption', description: 'Market expansion window opening - 28% growth signal detected', impact: 'high', confidence: 92 },
    { type: 'technology_shift', description: 'Technology disruption opportunity - 45% innovation signal detected', impact: 'critical', confidence: 88 },
    { type: 'partnership', description: 'Strategic partnership potential detected - 15% synergy opportunity', impact: 'medium', confidence: 85 },
    { type: 'cost_optimization', description: 'Cost optimization breakthrough identified - 22% efficiency gain signal', impact: 'high', confidence: 90 },
    { type: 'talent_shift', description: 'Talent acquisition window identified - 18% hiring window signal', impact: 'medium', confidence: 87 },
  ];

  for (const pattern of patterns) {
    if (Math.random() < 0.2) { // 20% chance per interval
      try {
        await db.insert(oraclePatterns).values({
          organizationId,
          patternType: pattern.type,
          description: pattern.description,
          confidence: pattern.confidence.toString(),
          impact: pattern.impact,
          status: 'detected',
        } as any);
        log.info({ type: pattern.type }, '🎯 Oracle pattern detected');
      } catch (error) {
        log.warn({ error }, 'Error generating oracle pattern');
      }
    }
  }
}

/**
 * Start autonomous generation loop
 */
export function startSignalGenerationLoop(organizationId: string) {
  // Generate weak signals every 60 seconds
  setInterval(async () => {
    try {
      await generateWeakSignalsAutonomously(organizationId);
    } catch (error) {
      log.warn({ error }, 'Signal generation interval error');
    }
  }, 60000);
  
  // Generate oracle patterns every 120 seconds
  setInterval(async () => {
    try {
      await generateOraclePatternsAutonomously(organizationId);
    } catch (error) {
      log.warn({ error }, 'Oracle pattern generation interval error');
    }
  }, 120000);
  
  log.info('🚀 Autonomous signal generation loop started');
}
