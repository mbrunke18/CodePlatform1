import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PATTERN_DESCRIPTIONS: { name: string; desc: string }[] = [
  { name: 'M&A Activity Detected', desc: 'Merger acquisition takeover buyout consolidation deal announcement hostile bid leveraged buyout corporate combination strategic partnership' },
  { name: 'Supply Chain Disruption', desc: 'Supply chain disruption shortage logistics failure inventory gap supplier bankruptcy port closure shipping delay procurement risk raw material scarcity' },
  { name: 'Geopolitical Risk Signal', desc: 'Geopolitical conflict war sanctions trade restrictions export controls tariff political instability regime change diplomatic crisis international tension' },
  { name: 'Regulatory Enforcement Action', desc: 'SEC enforcement FTC investigation DOJ prosecution regulatory fine penalty consent order compliance violation enforcement action lawsuit investigation subpoena' },
  { name: 'Cybersecurity Incident', desc: 'Ransomware cyberattack data breach cybersecurity incident malware vulnerability exploit CISA advisory CVE critical infrastructure attack intrusion compromised' },
  { name: 'Economic Disruption Signal', desc: 'Recession interest rate inflation Federal Reserve monetary policy GDP unemployment economic downturn financial crisis market crash stagflation economic contraction' },
  { name: 'Workforce Crisis Signal', desc: 'Mass layoffs workforce reduction labor dispute strike union contract workers compensation employment discrimination NLRB wrongful termination class action employees' },
  { name: 'Executive Leadership Change', desc: 'CEO resignation CFO departure board director removal executive transition leadership change management shakeup sudden departure unexpected announcement' },
  { name: 'Product Recall or Safety Crisis', desc: 'Product recall FDA recall safety warning consumer product hazard CPSC recall Class I Class II medical device pharmaceutical contamination injury death' },
  { name: 'Financial Crisis or Bankruptcy', desc: 'Bankruptcy Chapter 11 insolvency financial distress debt restructuring liquidity crisis credit downgrade material weakness earnings miss going concern' },
  { name: 'Activist Investor Signal', desc: 'Activist investor shareholder engagement proxy fight board seat demand public letter campaign hedge fund stake acquisition 13D filing Schedule 13' },
  { name: 'Climate and ESG Regulatory Signal', desc: 'Climate regulation ESG disclosure carbon emissions environmental compliance OSHA EPA sustainability reporting greenhouse gas net zero mandate penalty' },
  { name: 'Healthcare Regulatory Signal', desc: 'FDA approval rejection clinical trial drug safety pharmaceutical regulation healthcare compliance CMS Medicare Medicaid HHS enforcement warning letter' },
  { name: 'Trade Policy and Tariff Signal', desc: 'Tariff trade policy trade war import export restriction customs CBP executive order trade agreement WTO dispute countervailing duties Section 232 301' },
  { name: 'AI Disruption Signal', desc: 'Artificial intelligence AI disruption technology displacement automation competitive threat generative AI large language model workforce transformation productivity' },
  { name: 'Energy and Infrastructure Signal', desc: 'Energy grid power outage infrastructure failure blackout natural disaster hurricane earthquake flood critical infrastructure disruption utility' },
];

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}

let patternEmbeddingsCache: { name: string; embedding: number[] }[] | null = null;
let cachePopulatingPromise: Promise<void> | null = null;

async function getPatternEmbeddings(): Promise<{ name: string; embedding: number[] }[]> {
  if (patternEmbeddingsCache) return patternEmbeddingsCache;
  if (!cachePopulatingPromise) {
    cachePopulatingPromise = (async () => {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: PATTERN_DESCRIPTIONS.map(p => p.desc),
      });
      patternEmbeddingsCache = PATTERN_DESCRIPTIONS.map((p, i) => ({
        name: p.name,
        embedding: response.data[i].embedding,
      }));
    })();
  }
  await cachePopulatingPromise;
  return patternEmbeddingsCache!;
}

export interface SemanticScoreResult {
  topPattern: string;
  score: number;
  topMatches: { name: string; score: number }[];
}

export async function scoreSignalSemantically(signalText: string): Promise<SemanticScoreResult | null> {
  try {
    const input = signalText.slice(0, 2000);
    const [signalResponse, patterns] = await Promise.all([
      openai.embeddings.create({ model: 'text-embedding-3-small', input }),
      getPatternEmbeddings(),
    ]);
    const sig = signalResponse.data[0].embedding;
    const scored = patterns
      .map(p => ({ name: p.name, score: cosineSimilarity(sig, p.embedding) }))
      .sort((a, b) => b.score - a.score);
    return {
      topPattern: scored[0].name,
      score: Math.round(scored[0].score * 1000) / 1000,
      topMatches: scored.slice(0, 3).map(m => ({ name: m.name, score: Math.round(m.score * 1000) / 1000 })),
    };
  } catch {
    return null;
  }
}

export function clearEmbeddingCache(): void {
  patternEmbeddingsCache = null;
  cachePopulatingPromise = null;
}
