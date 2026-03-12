import OpenAI from 'openai';
import pino from 'pino';
import { storage } from './storage';
import { nlqService } from './nlq-service';

const logger = pino({ name: 'proactive-ai-radar' });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface DataStreamSource {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'market' | 'social' | 'regulatory';
  endpoint?: string;
  frequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  lastScanned?: Date;
  isActive: boolean;
}

export interface AlertTrigger {
  id: string;
  name: string;
  description: string;
  pattern: string; // Natural language description of what to watch for
  confidence_threshold: number; // 0.0 to 1.0
  organizationId: string;
  isActive: boolean;
}

export interface ProactiveAlert {
  id: string;
  type: 'opportunity' | 'risk' | 'competitive_threat' | 'market_shift' | 'regulatory_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  aiConfidence: number;
  dataSourcesUsed: string[];
  suggestedActions: string[];
  recommendedScenario?: string;
  targetAudience: string[]; // C-suite roles
}

/**
 * The Proactive AI Radar - Core of Veridius Strategic Intelligence
 * 
 * This system continuously scans data streams and generates intelligent alerts
 * that transform executives from reactive to proactively intelligent.
 * 
 * Key Features:
 * - Continuous monitoring of internal and external data sources
 * - AI-powered pattern recognition for opportunities and risks
 * - Proactive alert generation with actionable recommendations
 * - Integration with scenario planning and decision frameworks
 */
export class ProactiveAIRadar {
  private static instance: ProactiveAIRadar;
  private dataStreams: Map<string, DataStreamSource> = new Map();
  private alertTriggers: Map<string, AlertTrigger> = new Map();
  private isScanning: boolean = false;
  private scanInterval?: NodeJS.Timeout;

  public static getInstance(): ProactiveAIRadar {
    if (!ProactiveAIRadar.instance) {
      ProactiveAIRadar.instance = new ProactiveAIRadar();
    }
    return ProactiveAIRadar.instance;
  }

  /**
   * Initialize the AI Radar system with default monitoring capabilities
   */
  async initialize(): Promise<void> {
    try {
      await this.setupDefaultDataStreams();
      await this.setupDefaultAlertTriggers();
      await this.startContinuousScanning();
      
      logger.info('Proactive AI Radar initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error: errorMessage }, 'Failed to initialize AI Radar');
      throw error;
    }
  }

  /**
   * Setup default data streams for monitoring
   */
  private async setupDefaultDataStreams(): Promise<void> {
    const defaultStreams: DataStreamSource[] = [
      {
        id: 'internal-metrics',
        name: 'Internal Performance Metrics',
        type: 'internal',
        frequency: 'hourly',
        isActive: true,
      },
      {
        id: 'market-news',
        name: 'Market Intelligence Feed',
        type: 'market',
        frequency: 'real-time',
        isActive: true,
      },
      {
        id: 'competitive-intelligence',
        name: 'Competitive Intelligence',
        type: 'external',
        frequency: 'daily',
        isActive: true,
      },
      {
        id: 'regulatory-monitoring',
        name: 'Regulatory Change Detection',
        type: 'regulatory',
        frequency: 'daily',
        isActive: true,
      },
      {
        id: 'customer-sentiment',
        name: 'Customer Sentiment Analysis',
        type: 'social',
        frequency: 'hourly',
        isActive: true,
      },
    ];

    defaultStreams.forEach(stream => {
      this.dataStreams.set(stream.id, stream);
    });

    logger.info({ streamCount: defaultStreams.length }, 'Default data streams configured');
  }

  /**
   * Setup default alert triggers for proactive monitoring
   */
  private async setupDefaultAlertTriggers(): Promise<void> {
    const defaultTriggers: AlertTrigger[] = [
      {
        id: 'competitor-patent-filing',
        name: 'Competitor Patent Activity',
        description: 'Monitor competitor patent filings that could indicate market entry strategies',
        pattern: 'competitor filing patents in technology areas that match our known patterns of market entry',
        confidence_threshold: 0.75,
        organizationId: 'default',
        isActive: true,
      },
      {
        id: 'customer-demand-spike',
        name: 'Customer Demand Pattern Changes',
        description: 'Detect unusual spikes in customer requests for specific features or services',
        pattern: 'customer sentiment data shows significant increases in requests for features or capabilities',
        confidence_threshold: 0.70,
        organizationId: 'default',
        isActive: true,
      },
      {
        id: 'supply-chain-disruption',
        name: 'Supply Chain Risk Detection',
        description: 'Early warning system for potential supply chain disruptions',
        pattern: 'indicators suggesting supply chain disruption, vendor issues, or material availability problems',
        confidence_threshold: 0.80,
        organizationId: 'default',
        isActive: true,
      },
      {
        id: 'market-shift-indicators',
        name: 'Market Transformation Signals',
        description: 'Detect early signals of major market shifts or disruptions',
        pattern: 'market data, news, and trends indicating significant shifts in industry dynamics or customer behavior',
        confidence_threshold: 0.65,
        organizationId: 'default',
        isActive: true,
      },
      {
        id: 'talent-competition',
        name: 'Talent Market Competition',
        description: 'Monitor competitive hiring patterns that could signal strategic moves',
        pattern: 'competitors hiring in specific roles or geographies that might indicate strategic initiatives',
        confidence_threshold: 0.70,
        organizationId: 'default',
        isActive: true,
      },
    ];

    defaultTriggers.forEach(trigger => {
      this.alertTriggers.set(trigger.id, trigger);
    });

    logger.info({ triggerCount: defaultTriggers.length }, 'Default alert triggers configured');
  }

  /**
   * Start continuous scanning of data streams
   */
  private async startContinuousScanning(): Promise<void> {
    if (this.isScanning) {
      logger.warn('AI Radar is already scanning');
      return;
    }

    this.isScanning = true;
    
    // Run initial scan
    await this.performScanCycle();

    // Schedule continuous scanning every 30 minutes
    this.scanInterval = setInterval(async () => {
      await this.performScanCycle();
    }, 30 * 60 * 1000); // 30 minutes

    logger.info('Continuous scanning started');
  }

  /**
   * Perform a complete scan cycle across all active data streams
   */
  async performScanCycle(): Promise<void> {
    const startTime = Date.now();
    let alertsGenerated = 0;

    try {
      logger.info('Starting AI Radar scan cycle');

      for (const [streamId, stream] of Array.from(this.dataStreams.entries())) {
        if (!stream.isActive) continue;

        try {
          const streamData = await this.collectStreamData(stream);
          const alerts = await this.analyzeDataForAlerts(streamData, stream);
          
          for (const alert of alerts) {
            await this.generateProactiveAlert(alert);
            alertsGenerated++;
          }

          // Update last scanned timestamp
          stream.lastScanned = new Date();
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          logger.error({ streamId, error: errorMessage }, 'Error scanning data stream');
        }
      }

      const scanDuration = Date.now() - startTime;
      logger.info({ 
        scanDuration, 
        alertsGenerated,
        streamsScanned: Array.from(this.dataStreams.values()).filter(s => s.isActive).length 
      }, 'AI Radar scan cycle completed');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error: errorMessage }, 'Error during scan cycle');
    }
  }

  /**
   * Collect data from a specific stream
   */
  private async collectStreamData(stream: DataStreamSource): Promise<any> {
    // Simulate data collection - in production, this would connect to real data sources
    const mockData = await this.generateMockStreamData(stream);
    
    logger.debug({ streamId: stream.id, dataPoints: mockData.length }, 'Data collected from stream');
    return mockData;
  }

  /**
   * Generate realistic mock data for demonstration
   */
  private async generateMockStreamData(stream: DataStreamSource): Promise<any[]> {
    const scenarios = {
      'internal-metrics': [
        'Customer acquisition cost increased 15% month-over-month',
        'Employee satisfaction scores showing downward trend in engineering',
        'Product feature adoption rates exceeding projections by 40%',
        'Support ticket volume spiking for mobile application issues',
      ],
      'market-news': [
        'Industry leader announces major pivot to AI-first strategy',
        'New regulatory framework proposed for data privacy compliance',
        'Major competitor raises $500M Series D funding round',
        'Supply chain costs increasing across manufacturing sector',
      ],
      'competitive-intelligence': [
        'Competitor hiring 50+ engineers in ML/AI space over past quarter',
        'Patent filing activity suggests new product category development',
        'Leadership changes at two major industry competitors',
        'Price changes in competitive products indicate margin pressure',
      ],
      'customer-sentiment': [
        'Social media mentions of integration capabilities up 200%',
        'Support forum requests for mobile features increasing significantly',
        'Customer survey data shows desire for faster onboarding',
        'Feature request patterns suggest demand for automation tools',
      ],
    };

    const streamScenarios = scenarios[stream.id as keyof typeof scenarios] || [
      'Generic data point indicating potential strategic significance',
    ];

    // Return 1-3 random scenarios for this stream
    const count = Math.floor(Math.random() * 3) + 1;
    return streamScenarios.slice(0, count).map((scenario, index) => ({
      id: `${stream.id}-${Date.now()}-${index}`,
      timestamp: new Date(),
      content: scenario,
      source: stream.name,
      confidence: 0.7 + Math.random() * 0.3, // 0.7 to 1.0
    }));
  }

  /**
   * Analyze collected data against alert triggers using AI
   */
  private async analyzeDataForAlerts(data: any[], stream: DataStreamSource): Promise<ProactiveAlert[]> {
    const alerts: ProactiveAlert[] = [];

    for (const dataPoint of data) {
      for (const [triggerId, trigger] of Array.from(this.alertTriggers.entries())) {
        if (!trigger.isActive) continue;

        try {
          const alert = await this.evaluateDataAgainstTrigger(dataPoint, trigger, stream);
          if (alert && alert.aiConfidence >= trigger.confidence_threshold) {
            alerts.push(alert);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          logger.error({ triggerId, error: errorMessage }, 'Error evaluating trigger');
        }
      }
    }

    return alerts;
  }

  /**
   * Use AI to evaluate if a data point matches an alert trigger
   */
  private async evaluateDataAgainstTrigger(
    dataPoint: any,
    trigger: AlertTrigger,
    stream: DataStreamSource
  ): Promise<ProactiveAlert | null> {
    try {
      const prompt = `
You are the AI component of Veridius's Proactive Strategic Radar. Analyze the following data point against the specified trigger pattern.

DATA POINT:
Source: ${stream.name}
Content: ${dataPoint.content}
Timestamp: ${dataPoint.timestamp}

TRIGGER PATTERN:
Name: ${trigger.name}
Description: ${trigger.description}
Pattern to Match: ${trigger.pattern}

Evaluate if this data point matches the trigger pattern and could represent a strategic opportunity or risk.

Respond with JSON in this format:
{
  "matches": boolean,
  "confidence": number (0.0 to 1.0),
  "alertType": "opportunity" | "risk" | "competitive_threat" | "market_shift" | "regulatory_change",
  "severity": "low" | "medium" | "high" | "critical",
  "title": "Brief descriptive title for the alert",
  "description": "Detailed explanation of the strategic significance",
  "suggestedActions": ["action1", "action2", "action3"],
  "recommendedScenario": "suggested scenario name to run",
  "targetAudience": ["CEO", "CTO", "CFO", "etc"],
  "reasoning": "Why this is strategically significant"
}
`;

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: 'gpt-5',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.3,
      });

      const analysis = JSON.parse(response.choices[0]?.message?.content || '{"matches": false}');

      if (!analysis.matches) {
        return null;
      }

      return {
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: analysis.alertType,
        severity: analysis.severity,
        title: analysis.title,
        description: analysis.description,
        aiConfidence: analysis.confidence,
        dataSourcesUsed: [stream.name],
        suggestedActions: analysis.suggestedActions || [],
        recommendedScenario: analysis.recommendedScenario,
        targetAudience: analysis.targetAudience || ['CEO'],
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error: errorMessage }, 'Error in AI analysis');
      return null;
    }
  }

  /**
   * Generate and store a proactive alert
   */
  private async generateProactiveAlert(alert: ProactiveAlert): Promise<void> {
    try {
      // Store alert in database (using mock for now since storage interface needs updating)
      logger.info({ 
        alertId: alert.id,
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        confidence: alert.aiConfidence 
      }, 'Proactive alert generated');

      // In production, this would:
      // 1. Store in strategicAlerts table
      // 2. Send real-time notifications to WebSocket clients
      // 3. Trigger action hooks if configured
      // 4. Update executive dashboard

      // For now, log the alert details
      console.log('🚨 PROACTIVE ALERT GENERATED:');
      console.log(`📊 Type: ${alert.type.toUpperCase()}`);
      console.log(`⚠️  Severity: ${alert.severity.toUpperCase()}`);
      console.log(`📝 Title: ${alert.title}`);
      console.log(`🎯 Confidence: ${(alert.aiConfidence * 100).toFixed(1)}%`);
      console.log(`👥 Target: ${alert.targetAudience.join(', ')}`);
      console.log(`💡 Actions: ${alert.suggestedActions.join(', ')}`);
      if (alert.recommendedScenario) {
        console.log(`🎬 Recommended Scenario: ${alert.recommendedScenario}`);
      }
      console.log('---');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ alertId: alert.id, error: errorMessage }, 'Error storing proactive alert');
    }
  }

  /**
   * Generate Synthetic Future Scenarios based on current data patterns
   */
  async generateSyntheticScenarios(organizationId: string, query: string): Promise<any[]> {
    try {
      const prompt = `
You are the Synthetic Futures Engine of Veridius, tasked with generating novel strategic scenarios beyond historical templates.

EXECUTIVE QUERY: "${query}"
ORGANIZATION CONTEXT: ${organizationId}

Generate 3 data-driven strategic scenarios that go beyond typical historical patterns. Each scenario should be:
1. Novel and forward-looking (not just variations of past events)
2. Based on emerging patterns and weak signals
3. Actionable with clear decision frameworks
4. Tailored to C-suite strategic planning

For each scenario, provide:
- Innovative scenario name
- Likelihood assessment (0.0-1.0)
- Potential impact level
- Time horizon (6m, 12m, 18m, 24m+)
- Early warning indicators to watch for
- Recommended strategic response framework
- Key stakeholders who should be involved

Respond with JSON array of scenario objects.
`;

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: 'gpt-5',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 2000,
        temperature: 0.8, // Higher creativity for novel scenario generation
      });

      const scenarios = JSON.parse(response.choices[0]?.message?.content || '{"scenarios": []}');
      
      logger.info({ 
        organizationId, 
        query, 
        scenarioCount: scenarios.scenarios?.length || 0 
      }, 'Synthetic scenarios generated');

      return scenarios.scenarios || [];

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error: errorMessage }, 'Error generating synthetic scenarios');
      return [];
    }
  }

  /**
   * Validate executive intuition with AI analysis
   */
  async validateExecutiveIntuition(intuitionRecord: {
    title: string;
    description: string;
    timeframe: string;
    relatedDomain: string;
    confidenceLevel: string;
  }): Promise<any> {
    try {
      const prompt = `
You are Veridius's Intuition Validation AI. An executive has recorded a strategic hunch that needs validation.

EXECUTIVE INTUITION:
Title: ${intuitionRecord.title}
Description: ${intuitionRecord.description}
Expected Timeframe: ${intuitionRecord.timeframe}
Domain: ${intuitionRecord.relatedDomain}
Executive Confidence: ${intuitionRecord.confidenceLevel}

Your task is to find data that either supports or challenges this intuition. Provide:
1. Validation assessment (supporting/challenging/mixed)
2. Supporting data points and evidence
3. Contradicting data points and evidence  
4. Overall validation score (0.0-1.0)
5. Recommended follow-up actions
6. Data sources to monitor

Be objective and thorough - executive intuition can be wrong, and that's valuable feedback too.

Respond with JSON object containing your analysis.
`;

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: 'gpt-5',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 1500,
        temperature: 0.2, // Lower temperature for analytical validation
      });

      const validation = JSON.parse(response.choices[0]?.message?.content || '{}');
      
      logger.info({ 
        intuitionTitle: intuitionRecord.title,
        validationScore: validation.validationScore 
      }, 'Executive intuition validated');

      return validation;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error: errorMessage }, 'Error validating executive intuition');
      return null;
    }
  }

  /**
   * Stop the AI Radar scanning
   */
  stop(): void {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = undefined;
    }
    this.isScanning = false;
    logger.info('Proactive AI Radar stopped');
  }

  /**
   * Get current radar status and statistics
   */
  getStatus(): any {
    return {
      isScanning: this.isScanning,
      activeDataStreams: Array.from(this.dataStreams.values()).filter(s => s.isActive).length,
      totalDataStreams: this.dataStreams.size,
      activeAlertTriggers: Array.from(this.alertTriggers.values()).filter(t => t.isActive).length,
      totalAlertTriggers: this.alertTriggers.size,
      lastScanTime: Array.from(this.dataStreams.values())
        .map(s => s.lastScanned)
        .filter(Boolean)
        .sort()
        .pop(),
    };
  }
}

// Create singleton instance
export const proactiveAIRadar = ProactiveAIRadar.getInstance();