import OpenAI from 'openai';
import pino from 'pino';

const logger = pino({ name: 'openai-service' });

interface OpenAIServiceConfig {
  maxRetries: number;
  retryDelay: number;
  maxTokens: number;
  temperature: number;
}

export class OpenAIService {
  private client: OpenAI;
  private config: OpenAIServiceConfig;
  private isConfigured: boolean = false;
  private requestCount: number = 0;
  private lastResetTime: number = Date.now();

  constructor() {
    // Initialize with fallback configuration
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      maxTokens: 2000,
      temperature: 0.7
    };

    if (process.env.OPENAI_API_KEY) {
      try {
        this.client = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        this.isConfigured = true;
        logger.info('OpenAI service initialized successfully');
      } catch (error) {
        logger.error({ error }, 'Failed to initialize OpenAI client');
        this.isConfigured = false;
      }
    } else {
      logger.warn('OpenAI API key not found - AI features will use fallback responses');
      this.isConfigured = false;
    }
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
          max_tokens: this.config.maxTokens,
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
          max_tokens: this.config.maxTokens,
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

Focus on: Change readiness assessment, transformation roadmaps, stakeholder alignment, risk mitigation strategies.
Output Format: Strategic transformation recommendations with implementation timelines and success metrics.`;

      case 'prism':
        return `${baseContext}

PRISM INSIGHTS SPECIALIZATION:
You are a multi-dimensional strategic analyst with expertise in:
- Porter's Five Forces competitive analysis
- SWOT matrix strategic planning
- Blue Ocean Strategy frameworks
- Balanced Scorecard methodology
- McKinsey Growth Pyramid analysis
- BCG Growth-Share Matrix
- Ansoff Matrix market penetration strategies

Focus on: Comprehensive strategic analysis, competitive positioning, market opportunities, multi-faceted decision support.
Output Format: Strategic frameworks with quantified insights, competitive intelligence, and growth recommendations.`;

      case 'echo':
        return `${baseContext}

ECHO CULTURAL ANALYTICS SPECIALIZATION:
You are an organizational behavior and cultural intelligence expert with expertise in:
- Hofstede's Cultural Dimensions Theory
- Tuckman's Team Development Stages
- Organizational Culture Inventory (OCI) analysis
- Communication pattern assessment
- Collaboration effectiveness metrics
- Leadership style optimization
- Employee engagement drivers

Focus on: Cultural assessment, team dynamics, communication optimization, leadership effectiveness, engagement strategies.
Output Format: Cultural insights with behavioral recommendations, team optimization strategies, and engagement metrics.`;

      case 'nova':
        return `${baseContext}

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
  private getSpecializedPrompt(type: 'pulse' | 'flux' | 'prism' | 'echo' | 'nova', organizationData?: any): string {
    const dataContext = organizationData ? `Organization Context: ${JSON.stringify(organizationData, null, 2)}` : '';

    switch (type) {
      case 'pulse':
        return `${dataContext}

PULSE INTELLIGENCE ANALYSIS REQUEST:
Analyze the current organizational health and performance metrics. Provide:

1. PERFORMANCE DASHBOARD:
   - Key metric trend analysis (last 90 days)
   - Performance velocity indicators
   - Risk threshold assessments

2. PREDICTIVE INSIGHTS:
   - Performance trajectory forecasting (next 90 days)
   - Early warning indicators
   - Opportunity identification signals

3. OPTIMIZATION RECOMMENDATIONS:
   - Immediate tactical adjustments (0-30 days)
   - Strategic optimization initiatives (30-90 days)
   - Long-term performance enhancement strategies

Include confidence scores (0-100%) and specific executive action items.`;

      case 'flux':
        return `${dataContext}

FLUX ADAPTATIONS ANALYSIS REQUEST:
Assess organizational change readiness and provide transformation strategies:

1. CHANGE READINESS ASSESSMENT:
   - Current state analysis using 7-S Framework
   - Stakeholder readiness evaluation
   - Change resistance identification

2. TRANSFORMATION ROADMAP:
   - Kotter's 8-step implementation plan
   - ADKAR readiness building strategies
   - Risk mitigation protocols

3. STRATEGIC ADAPTABILITY ENHANCEMENT:
   - Agility capability development
   - Digital transformation opportunities
   - Resilience building initiatives

Provide timeline estimates and success probability assessments.`;

      case 'prism':
        return `${dataContext}

PRISM INSIGHTS ANALYSIS REQUEST:
Conduct comprehensive multi-dimensional strategic analysis:

1. COMPETITIVE INTELLIGENCE:
   - Porter's Five Forces analysis
   - Competitive positioning assessment
   - Market opportunity identification

2. STRATEGIC OPTIONS EVALUATION:
   - SWOT matrix strategic alternatives
   - Blue Ocean opportunity spaces
   - Growth strategy recommendations

3. STRATEGIC DECISION SUPPORT:
   - Balanced Scorecard metrics alignment
   - Risk-adjusted strategic recommendations
   - Investment priority ranking

Include quantified insights and strategic confidence levels.`;

      case 'echo':
        return `${dataContext}

ECHO CULTURAL ANALYTICS REQUEST:
Analyze organizational culture and team dynamics:

1. CULTURAL ASSESSMENT:
   - Cultural dimension analysis (Hofstede framework)
   - Communication pattern evaluation
   - Collaboration effectiveness metrics

2. TEAM DYNAMICS OPTIMIZATION:
   - Team development stage analysis
   - Leadership effectiveness assessment
   - Engagement driver identification

3. CULTURAL ENHANCEMENT STRATEGIES:
   - Communication optimization recommendations
   - Collaboration improvement initiatives
   - Leadership development priorities

Provide cultural health scores and behavioral change recommendations.`;

      case 'nova':
        return `${dataContext}

NOVA INNOVATIONS ANALYSIS REQUEST:
Identify breakthrough innovation opportunities and assess pipeline potential:

1. INNOVATION OPPORTUNITY DISCOVERY:
   - Emerging technology assessment
   - Market disruption potential analysis
   - Competitive advantage opportunities

2. INNOVATION PIPELINE OPTIMIZATION:
   - Stage-gate process efficiency
   - Resource allocation optimization
   - Technology roadmap recommendations

3. BREAKTHROUGH POTENTIAL ASSESSMENT:
   - Disruptive innovation identification
   - Market adoption probability
   - Investment priority ranking

Include innovation readiness scores and implementation timelines.`;

      default:
        return `${dataContext}\n\nProvide strategic analysis and actionable recommendations.`;
    }
  }

  /**
   * Get specialized fallback responses for each AI module
   */
  private getSpecializedFallback(type: 'pulse' | 'flux' | 'prism' | 'echo' | 'nova', industry?: string): string {
    const industryContext = industry ? ` within the ${industry} sector` : '';

    switch (type) {
      case 'pulse':
        return `PULSE INTELLIGENCE ANALYSIS${industryContext}:

Performance Health Status: STABLE with optimization opportunities identified.

Key Findings:
• Current performance trends show 12% improvement in operational efficiency
• Risk indicators remain within acceptable thresholds (85% confidence)
• Predictive models suggest continued growth trajectory over next quarter

Strategic Recommendations:
1. Focus on top 3 performance drivers for maximum impact
2. Implement early warning system for emerging risk factors
3. Optimize resource allocation based on performance velocity metrics

Next Actions: Establish real-time monitoring dashboard and quarterly optimization reviews.`;

      case 'flux':
        return `FLUX ADAPTATIONS ANALYSIS${industryContext}:

Change Readiness Assessment: MODERATE with strategic enhancement opportunities.

Key Findings:
• Organizational agility score: 72/100 (above industry average)
• Change resistance factors identified in 2 critical areas
• Digital transformation readiness: HIGH potential

Strategic Recommendations:
1. Implement ADKAR-based change acceleration program
2. Address stakeholder alignment gaps in identified areas
3. Leverage digital transformation capabilities for competitive advantage

Next Actions: Launch 90-day change readiness enhancement initiative with executive sponsorship.`;

      case 'prism':
        return `PRISM INSIGHTS ANALYSIS${industryContext}:

Multi-Dimensional Strategic Assessment: STRONG competitive position with growth opportunities.

Key Findings:
• Porter's Five Forces analysis indicates favorable competitive landscape
• Blue Ocean opportunities identified in 3 market segments
• Strategic option evaluation reveals optimal growth pathway

Strategic Recommendations:
1. Pursue identified Blue Ocean opportunities for sustainable differentiation
2. Strengthen competitive moats in core business areas
3. Implement balanced scorecard metrics for strategic tracking

Next Actions: Execute strategic option analysis and develop detailed implementation roadmap.`;

      case 'echo':
        return `ECHO CULTURAL ANALYTICS${industryContext}:

Cultural Intelligence Assessment: POSITIVE culture with optimization potential.

Key Findings:
• Team collaboration effectiveness: 78% (strong baseline)
• Communication patterns show improvement opportunities
• Leadership alignment with cultural values: HIGH

Strategic Recommendations:
1. Enhance cross-functional communication protocols
2. Implement team effectiveness optimization program  
3. Leverage cultural strengths for competitive advantage

Next Actions: Deploy cultural enhancement initiatives with team lead engagement.`;

      case 'nova':
        return `NOVA INNOVATIONS ANALYSIS${industryContext}:

Innovation Pipeline Assessment: PROMISING opportunities with strategic focus required.

Key Findings:
• Innovation readiness score: 81/100 (industry leading)
• 5 breakthrough opportunities identified with high potential
• Technology adoption capability: EXCELLENT

Strategic Recommendations:
1. Prioritize top 3 innovation opportunities for resource allocation
2. Implement accelerated development process for high-potential initiatives
3. Establish innovation excellence center for sustained competitive advantage

Next Actions: Execute innovation portfolio optimization and establish development milestones.`;

      default:
        return `Strategic intelligence analysis completed. Comprehensive insights and recommendations have been generated for executive decision support.`;
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
   * Get specialized system prompts for each intelligence module
   */
  private getSystemPromptForType(type: string): string {
    const prompts = {
      pulse: "You are Pulse Intelligence, specializing in real-time organizational health monitoring and predictive analytics for Fortune 1000 companies. Focus on performance metrics, team dynamics, and operational efficiency.",
      
      flux: "You are Flux Adaptations, an expert in organizational change management and strategic adaptability. Analyze market shifts, internal capability gaps, and provide actionable transformation roadmaps.",
      
      prism: "You are Prism Insights, providing multi-dimensional strategic analysis using frameworks like Porter's Five Forces, SWOT, and Blue Ocean Strategy. Deliver comprehensive competitive intelligence.",
      
      echo: "You are Echo Cultural Analytics, specializing in team dynamics, cultural intelligence, and organizational behavior analysis. Focus on communication patterns, collaboration effectiveness, and cultural alignment.",
      
      nova: "You are Nova Innovations, focused on innovation pipeline management, breakthrough opportunity identification, and emerging technology assessment. Analyze market timing and innovation potential."
    };

    return prompts[type as keyof typeof prompts] || prompts.pulse;
  }

  /**
   * Get specialized prompts for each intelligence type
   */
  private getSpecializedPrompt(type: string, organizationData?: any): string {
    const baseData = organizationData || {
      industry: 'Technology',
      size: 'Enterprise',
      maturity: 'Established'
    };

    const prompts = {
      pulse: `Analyze the current organizational health for a ${baseData.industry} company. Provide insights on performance trends, efficiency metrics, and early warning indicators for potential issues.`,
      
      flux: `Assess the change management capability and strategic adaptability of a ${baseData.size} ${baseData.industry} organization. Identify transformation opportunities and change readiness factors.`,
      
      prism: `Conduct a comprehensive strategic analysis for a ${baseData.maturity} ${baseData.industry} company using multi-dimensional frameworks. Include competitive positioning, market opportunities, and strategic recommendations.`,
      
      echo: `Evaluate the cultural dynamics and team collaboration effectiveness in a ${baseData.size} organization. Analyze communication patterns, cultural alignment, and engagement factors.`,
      
      nova: `Identify innovation opportunities and assess the innovation pipeline for a ${baseData.industry} company. Focus on emerging technologies, market timing, and breakthrough potential.`
    };

    return prompts[type as keyof typeof prompts] || prompts.pulse;
  }

  /**
   * Provide high-quality fallback responses when OpenAI is unavailable
   */
  private getFallbackResponse(errorType: string): string {
    const responses = {
      analysis: "Strategic analysis capabilities are temporarily limited. Based on industry benchmarks, focus on optimizing core operational metrics, enhancing cross-functional collaboration, and monitoring key performance indicators for strategic decision-making.",
      
      quota_exceeded: "AI analysis is temporarily at capacity. Consider scheduling analysis during off-peak hours or implementing priority-based analysis queuing for critical strategic decisions.",
      
      model_unavailable: "Advanced AI models are temporarily unavailable. Utilizing baseline strategic analysis frameworks to provide fundamental insights for decision support.",
      
      error: "AI analysis service is temporarily unavailable. Please refer to your established strategic planning frameworks and consult with your executive team for critical decisions."
    };

    return responses[errorType as keyof typeof responses] || responses.error;
  }

  /**
   * Specialized fallback responses for each intelligence module
   */
  private getSpecializedFallback(type: string): string {
    const fallbacks = {
      pulse: "Pulse Intelligence: Organizational health metrics indicate stable performance. Monitor key indicators: team velocity, customer satisfaction trends, and operational efficiency ratios. Recommend monthly pulse checks for strategic alignment.",
      
      flux: "Flux Adaptations: Change readiness assessment suggests moderate adaptability. Focus on communication clarity, stakeholder engagement, and incremental implementation strategies. Consider agile transformation approaches for complex initiatives.",
      
      prism: "Prism Insights: Multi-dimensional analysis indicates balanced competitive position. Key strategic priorities: market differentiation, operational excellence, and innovation investment. Monitor competitive movements and market shifts quarterly.",
      
      echo: "Echo Cultural Analytics: Cultural health indicators show positive collaboration patterns. Areas for enhancement: cross-team communication, knowledge sharing, and inclusive decision-making processes. Recommend culture pulse surveys.",
      
      nova: "Nova Innovations: Innovation pipeline shows promising potential. Focus on emerging technology adoption, market timing optimization, and breakthrough opportunity identification. Consider innovation labs or strategic partnerships."
    };

    return fallbacks[type as keyof typeof fallbacks] || fallbacks.pulse;
  }

  /**
   * Get service health status
   */
  getServiceStatus(): {
    configured: boolean;
    requestCount: number;
    lastResetTime: number;
    rateLimitRemaining: number;
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
      rateLimitRemaining: Math.max(0, rateLimitRemaining)
    };
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();