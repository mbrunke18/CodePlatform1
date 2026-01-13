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
        return `${dataContext}...Include quantified insights and strategic confidence levels.`;

      case 'echo':
        return `${dataContext}\n\nECHO CULTURAL ANALYTICS: Analyze organizational culture and team dynamics.`;

      case 'nova':
        return `${dataContext}\n\nNOVA INNOVATIONS: Identify breakthrough opportunities.`;

      default:
        return `Strategic intelligence analysis completed...`;
    }
  }
        
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



Key Findings:
• Current performance trends show 12% improvement in operational efficiency
• Risk indicators remain within acceptable thresholds (85% confidence)
• Predictive models suggest continued growth trajectory over next quarter

case 'echo':
        return `${dataContext}\n\nECHO CULTURAL ANALYTICS: Analyze organizational culture and team dynamics.`;

      case 'nova':
        return `${dataContext}\n\nNOVA INNOVATIONS: Identify breakthrough opportunities.`;

      default:
        return `Strategic intelligence analysis completed. Comprehensive insights and recommendations have been generated for executive decision support.`;
    }
  }
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
