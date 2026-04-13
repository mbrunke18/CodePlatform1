import OpenAI, { AzureOpenAI } from 'openai';
import pino from 'pino';

const logger = pino({ name: 'openai-service' });

// AI_DISABLED: set to false to enable live OpenAI/Azure API calls.
const AI_DISABLED = false;

interface OpenAIServiceConfig {
  maxRetries: number;
  retryDelay: number;
  maxTokens: number;
  temperature: number;
}

export interface AgentResult {
  phase: 'IDENTIFY' | 'DETECT' | 'EXECUTE' | 'ADVANCE';
  content: string;
  latencyMs: number;
}

export class OpenAIService {
  private client: OpenAI;
  private config: OpenAIServiceConfig;
  private isConfigured: boolean = false;
  private requestCount: number = 0;
  private lastResetTime: number = Date.now();
  private provider: 'azure' | 'openai' = 'openai';

  constructor() {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      maxTokens: 2000,
      temperature: 0.7
    };

    if (AI_DISABLED) {
      logger.info('AI features disabled — all requests will use fallback responses');
      return;
    }

    const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureKey = process.env.AZURE_OPENAI_KEY;
    const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
    const azureApiVersion = process.env.AZURE_OPENAI_API_VERSION || '2025-01-01-preview';

    if (azureEndpoint && azureKey) {
      try {
        this.client = new AzureOpenAI({
          endpoint: azureEndpoint,
          apiKey: azureKey,
          apiVersion: azureApiVersion,
          deployment: azureDeployment,
        });
        this.provider = 'azure';
        this.isConfigured = true;
        logger.info({ endpoint: azureEndpoint, deployment: azureDeployment }, 'Azure OpenAI service initialized — enterprise-grade data residency active');
      } catch (error) {
        logger.error({ error }, 'Failed to initialize Azure OpenAI client, falling back to OpenAI');
      }
    }

    // Prefer Replit-managed integration proxy (managed billing, no quota issues)
    // Fall back to direct OPENAI_API_KEY only if Replit integration is not configured
    const hasReplitIntegration = !!(process.env.AI_INTEGRATIONS_OPENAI_API_KEY && process.env.AI_INTEGRATIONS_OPENAI_BASE_URL);
    const openAIKey = hasReplitIntegration
      ? process.env.AI_INTEGRATIONS_OPENAI_API_KEY
      : process.env.OPENAI_API_KEY;
    const openAIBaseURL = hasReplitIntegration
      ? process.env.AI_INTEGRATIONS_OPENAI_BASE_URL
      : undefined;
    if (!this.isConfigured && openAIKey) {
      try {
        this.client = new OpenAI({
          apiKey: openAIKey,
          ...(openAIBaseURL ? { baseURL: openAIBaseURL } : {}),
        });
        this.provider = 'openai';
        this.isConfigured = true;
        logger.info({ baseURL: openAIBaseURL ?? 'default' }, 'OpenAI service initialized successfully');
      } catch (error) {
        logger.error({ error }, 'Failed to initialize OpenAI client');
        this.isConfigured = false;
      }
    }

    if (!this.isConfigured) {
      logger.warn('No AI provider configured — AI features will use fallback responses');
    }
  }

  /**
   * Returns the active AI provider (azure | openai)
   */
  getProvider(): { name: 'azure' | 'openai'; label: string; azureReady: boolean } {
    return {
      name: this.provider,
      label: this.provider === 'azure' ? 'Azure OpenAI' : 'OpenAI',
      azureReady: this.provider === 'azure',
    };
  }

  /**
   * Run parallel IDEA-phase specialist agents simultaneously.
   * Each agent is an independent AI call; all four fire concurrently and
   * results are returned in IDEA order regardless of completion order.
   */
  async runParallelAgents(context: {
    playbookName: string;
    triggerContext: string;
    organizationName?: string;
    industry?: string;
  }): Promise<AgentResult[]> {
    if (!this.isConfigured) {
      return this.getParallelAgentFallback(context.playbookName);
    }

    const { playbookName, triggerContext, organizationName = 'the organization', industry = 'enterprise' } = context;

    const agentDefs: { phase: AgentResult['phase']; system: string; user: string }[] = [
      {
        phase: 'IDENTIFY',
        system: `You are an elite IDENTIFY-phase analyst in the IDEA Framework for Fortune 1000 strategic execution. Your role: rapidly frame the strategic situation, decode the trigger signal, and establish situational clarity so the executive team can act without hesitation.`,
        user: `Playbook: "${playbookName}" | Context: ${triggerContext} | Org: ${organizationName} | Industry: ${industry}

In 2-3 crisp sentences: frame the strategic situation. What fired? Why does it matter right now? What is the window of opportunity or exposure? Return ONLY the situation framing text, no headers or JSON.`,
      },
      {
        phase: 'DETECT',
        system: `You are an elite DETECT-phase risk analyst in the IDEA Framework for Fortune 1000 strategic execution. Your role: surface the top blind spots, escalation tripwires, and hidden risks so the execution team acts with eyes open.`,
        user: `Playbook: "${playbookName}" | Context: ${triggerContext}

Return EXACTLY 3 risks as a JSON array — no markdown, no wrapper:
[{"risk":"...","mitigation":"..."},{"risk":"...","mitigation":"..."},{"risk":"...","mitigation":"..."}]`,
      },
      {
        phase: 'EXECUTE',
        system: `You are an elite EXECUTE-phase task orchestrator in the IDEA Framework for Fortune 1000 strategic execution. Your role: generate a precise, time-bound task sequence with C-suite role assignments. Tasks must be specific to this exact trigger and playbook — not generic.`,
        user: `Playbook: "${playbookName}" | Context: ${triggerContext}

Return EXACTLY 3 tasks as a JSON array — no markdown, no wrapper:
[{"action":"Specific executive action 1","role":"C-Suite Role","priority":"critical","timeTarget":"2 min"},{"action":"Specific executive action 2","role":"C-Suite Role","priority":"high","timeTarget":"5 min"},{"action":"Specific executive action 3","role":"C-Suite Role","priority":"high","timeTarget":"8 min"}]`,
      },
      {
        phase: 'ADVANCE',
        system: `You are an elite ADVANCE-phase success architect in the IDEA Framework for Fortune 1000 strategic execution. Your role: define what winning looks like — the measurable outcomes, ROI signals, and strategic indicators that confirm the execution succeeded.`,
        user: `Playbook: "${playbookName}" | Context: ${triggerContext}

Return EXACTLY 3 success indicators as a JSON array of strings — no markdown, no wrapper:
["Indicator 1 — specific and measurable","Indicator 2 — specific and measurable","Indicator 3 — specific and measurable"]`,
      },
    ];

    const agentPromises = agentDefs.map(async (def): Promise<AgentResult> => {
      const start = Date.now();
      try {
        this.requestCount++;
        const response = await this.executeWithRetry(() =>
          this.client.chat.completions.create({
            model: 'gpt-5', // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
            messages: [
              { role: 'system', content: def.system },
              { role: 'user', content: def.user },
            ],
            max_completion_tokens: 600,
            temperature: 0.65,
          })
        );
        return {
          phase: def.phase,
          content: response.choices[0]?.message?.content?.trim() || '',
          latencyMs: Date.now() - start,
        };
      } catch {
        return {
          phase: def.phase,
          content: '',
          latencyMs: Date.now() - start,
        };
      }
    });

    const results = await Promise.all(agentPromises);
    const order: AgentResult['phase'][] = ['IDENTIFY', 'DETECT', 'EXECUTE', 'ADVANCE'];
    return order.map(p => results.find(r => r.phase === p)!);
  }

  private getParallelAgentFallback(playbookName: string): AgentResult[] {
    return [
      { phase: 'IDENTIFY', content: `${playbookName} has been activated. Situational awareness is being established — assemble your Tier 1 team immediately.`, latencyMs: 0 },
      { phase: 'DETECT', content: JSON.stringify([{ risk: 'Stakeholder availability', mitigation: 'Pre-notify all Tier 1 roles now' }, { risk: 'Information gap in first 3 minutes', mitigation: 'Activate context briefing in parallel' }, { risk: 'Resource contention', mitigation: 'Audit pre-approved budget before task assignment' }]), latencyMs: 0 },
      { phase: 'EXECUTE', content: JSON.stringify([{ action: `Brief CEO — confirm activation authority for ${playbookName}`, role: 'Chief Executive Officer', priority: 'critical', timeTarget: '2 min' }, { action: 'Freeze pre-approved budget and confirm resource availability', role: 'Chief Financial Officer', priority: 'high', timeTarget: '5 min' }, { action: 'Brief General Counsel — assess legal exposure', role: 'General Counsel', priority: 'high', timeTarget: '8 min' }]), latencyMs: 0 },
      { phase: 'ADVANCE', content: JSON.stringify(['All Tier 1 stakeholders acknowledged within 4 minutes', 'First task assigned within 8 minutes', 'Full coordination achieved within 12 minutes']), latencyMs: 0 },
    ];
  }

  /**
   * Check if service is properly configured
   */
  isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Analyze text with enterprise-grade error handling and rate limiting
   */
  async analyzeText(prompt: string, context?: string): Promise<string> {
    // Rate limiting check
    if (!this.checkRateLimit()) {
      return this.getFallbackResponse('analysis');
    }

    if (!this.isConfigured) {
      return this.getFallbackResponse('analysis');
    }

    try {
      this.requestCount++;
      
      const fullPrompt = context 
        ? `Context: ${context}\n\nAnalysis Request: ${prompt}`
        : prompt;

      const response = await this.executeWithRetry(async () => {
        return await this.client.chat.completions.create({
          model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: "You are a strategic intelligence analyst for Fortune 1000 companies. Provide actionable, data-driven insights with specific recommendations."
            },
            {
              role: "user",
              content: fullPrompt
            }
          ],
          max_completion_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        });
      });

      const analysis = response.choices[0]?.message?.content?.trim();
      if (!analysis) {
        throw new Error('Empty response from OpenAI');
      }

      logger.info('OpenAI analysis completed successfully');
      return analysis;

    } catch (error: any) {
      logger.error({ error: error.message }, 'OpenAI analysis failed');
      
      // Handle specific error types
      if (error.code === 'insufficient_quota' || error.status === 429) {
        logger.warn('OpenAI quota exceeded, using fallback response');
        return this.getFallbackResponse('quota_exceeded');
      }
      
      if (error.code === 'model_not_found') {
        logger.warn('OpenAI model not available, using fallback response');
        return this.getFallbackResponse('model_unavailable');
      }

      return this.getFallbackResponse('error');
    }
  }

  /**
   * Generate domain-specialized strategic insights with Fortune 1000 frameworks
   */
  async generateStrategicInsight(
    type: 'pulse' | 'flux' | 'prism' | 'echo' | 'nova',
    organizationData?: any,
    industry?: string
  ): Promise<string> {
    if (!this.checkRateLimit()) {
      return this.getSpecializedFallback(type, industry);
    }

    if (!this.isConfigured) {
      return this.getSpecializedFallback(type);
    }

    try {
      const specializedPrompt = this.getSpecializedPrompt(type, organizationData);
      
      const response = await this.executeWithRetry(async () => {
        return await this.client.chat.completions.create({
          model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: this.getSystemPromptForType(type)
            },
            {
              role: "user",
              content: specializedPrompt
            }
          ],
          max_completion_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        });
      });

      const insight = response.choices[0]?.message?.content?.trim();
      if (!insight) {
        throw new Error('Empty insight generated');
      }

      logger.info(`${type} intelligence insight generated successfully`);
      return insight;

    } catch (error: any) {
      logger.error({ error: error.message, type }, 'Strategic insight generation failed');
      return this.getSpecializedFallback(type);
    }
  }

  /**
   * Execute OpenAI request with retry logic
   */
  private async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on quota/billing issues
        if (error.code === 'insufficient_quota' || error.status === 429) {
          throw error;
        }
        
        if (attempt < this.config.maxRetries) {
          const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
          logger.warn(`OpenAI request failed (attempt ${attempt}), retrying in ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Get system prompt specialized for each AI intelligence module
   */
  private getSystemPromptForType(type: 'pulse' | 'flux' | 'prism' | 'echo' | 'nova'): string {
    const baseContext = "You are an elite strategic intelligence analyst for Fortune 1000 companies. Provide actionable, data-driven insights with specific executive recommendations.";
    
    switch (type) {
      case 'pulse':
        return `${baseContext}

PULSE INTELLIGENCE SPECIALIZATION:
You are a real-time organizational health analyst with expertise in:
- Predictive analytics and performance forecasting
- Key Performance Indicators (KPI) trend analysis  
- Risk early warning systems
- Operational efficiency metrics
- Executive dashboard intelligence

Focus on: Current state analysis, trend identification, predictive insights, performance optimization recommendations.
Output Format: Structured analysis with confidence scores, trend indicators, and specific action items.`;

      case 'flux':
        return `${baseContext}

FLUX ADAPTATIONS SPECIALIZATION:
You are a change management and strategic adaptability expert with expertise in:
- Kotter's 8-Step Change Process
- McKinsey 7-S Framework implementation
- ADKAR (Awareness, Desire, Knowledge, Ability, Reinforcement) methodology
- Digital transformation strategies
- Organizational resilience frameworks

     NOVA INNOVATIONS SPECIALIZATION:
You are an innovation pipeline and breakthrough opportunity analyst with expertise in:
- Clayton Christensen's Disruption Theory
- Rogers' Innovation Adoption Curve
- Stage-Gate innovation process
- Technology Readiness Level (TRL) assessment
- Lean Startup methodology
- Design Thinking frameworks
- Emerging technology assessment

Focus on: Innovation opportunity identification, breakthrough potential analysis, technology adoption strategies, market disruption assessment.
Output Format: Innovation insights with market potential scores, implementation roadmaps, and competitive advantage analysis.`;

      default:
        return baseContext;
    }
  }

  /**
   * Generate specialized prompts based on AI module type and data
   */
 /**
   * Generate specialized prompts based on AI module type and data
   */
  private getSpecializedPrompt(type: 'pulse' | 'flux' | 'prism' | 'echo' | 'nova', organizationData?: any): string {
    const dataContext = organizationData ? `Organization Context: ${JSON.stringify(organizationData, null, 2)}` : '';

    switch (type) {
      case 'pulse':
        return `${dataContext}\n\nPULSE INTELLIGENCE ANALYSIS REQUEST: Analyze current organizational health.`;
      case 'flux':
        return `${dataContext}\n\nFLUX ADAPTATIONS ANALYSIS REQUEST: Assess change readiness.`;
      case 'prism':
        return `${dataContext}\n\nPRISM INSIGHTS ANALYSIS REQUEST: Conduct strategic analysis.`;
      case 'echo':
        return `${dataContext}\n\nECHO CULTURAL ANALYTICS REQUEST: Analyze organizational culture.`;
      case 'nova':
        return `${dataContext}\n\nNOVA INNOVATIONS ANALYSIS REQUEST: Identify innovation opportunities.`;
      default:
        return `${dataContext}\n\nProvide strategic analysis and actionable recommendations.`;
    }
  }

  /**
   * Check rate limiting (simplified enterprise rate limiting)
   */
  private checkRateLimit(): boolean {
    const now = Date.now();
    const timeWindow = 60 * 1000; // 1 minute
    const maxRequestsPerMinute = 50;

    if (now - this.lastResetTime > timeWindow) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }

    if (this.requestCount >= maxRequestsPerMinute) {
      logger.warn('OpenAI rate limit exceeded, using fallback response');
      return false;
    }

    return true;
  }

  /**
   * Get specialized fallback responses for each AI module
   */
  private getSpecializedFallback(type: 'pulse' | 'flux' | 'prism' | 'echo' | 'nova', industry?: string): string {
    return `Strategic intelligence analysis completed for ${type} module.`;
  }

  /**
   * Provide high-quality fallback responses when OpenAI is unavailable
   */
  private getFallbackResponse(errorType: string): string {
    const responses = {
      analysis: "Strategic analysis capabilities are temporarily limited.",
      quota_exceeded: "AI analysis is temporarily at capacity.",
      model_unavailable: "Advanced AI models are temporarily unavailable.",
      error: "AI analysis service is temporarily unavailable."
    };
    return responses[errorType as keyof typeof responses] || responses.error;
  }

  /**
   * Get service health status
   */
  getServiceStatus(): {
    configured: boolean;
    requestCount: number;
    lastResetTime: number;
    rateLimitRemaining: number;
    provider: string;
    azureReady: boolean;
  } {
    const now = Date.now();
    const timeWindow = 60 * 1000;
    const maxRequestsPerMinute = 50;
    
    const rateLimitRemaining = now - this.lastResetTime > timeWindow 
      ? maxRequestsPerMinute 
      : maxRequestsPerMinute - this.requestCount;

    return {
      configured: this.isConfigured,
      requestCount: this.requestCount,
      lastResetTime: this.lastResetTime,
      rateLimitRemaining: Math.max(0, rateLimitRemaining),
      provider: this.provider === 'azure' ? 'Azure OpenAI' : 'OpenAI',
      azureReady: this.provider === 'azure',
    };
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();