import { db } from '../db.js';
import { 
  insights, 
  evidence, 
  recommendations, 
  scenarios, 
  kpis, 
  initiatives, 
  organizations 
} from '@shared/schema';
import { eq, and, desc, like, sql, inArray } from 'drizzle-orm';
import OpenAI from 'openai';
import { databaseNotificationService } from './DatabaseNotificationService.js';

// Initialize OpenAI client with proper error handling
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

export interface RAGContext {
  query: string;
  organizationId: string;
  domain?: 'strategic' | 'operational' | 'financial' | 'risk' | 'innovation';
  timeframe?: 'current' | 'historical' | 'future';
  businessUnitId?: string;
  initiativeId?: string;
  confidenceThreshold?: number;
}

export interface RAGResponse {
  answer: string;
  confidence: number;
  sources: Array<{
    type: 'insight' | 'evidence' | 'kpi' | 'scenario' | 'recommendation';
    id: string;
    title: string;
    relevance: number;
    content: string;
    metadata?: Record<string, any>;
  }>;
  relatedQuestions: string[];
  actionableItems: Array<{
    type: 'recommendation' | 'investigation' | 'decision';
    priority: 'low' | 'medium' | 'high';
    description: string;
    owner?: string;
  }>;
}

export interface EnhancedInsight {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  evidenceLinks: string[];
  recommendations: string[];
  aiGenerated: boolean;
  vectorEmbedding?: number[];
  semanticTags: string[];
}

export class RAGIntelligenceService {

  /**
   * Enhanced query processing with RAG capabilities
   */
  async processIntelligentQuery(context: RAGContext): Promise<RAGResponse> {
    try {
      if (!openai) {
        return this.createFallbackResponse(context);
      }

      // Step 1: Retrieve relevant context from knowledge base
      const retrievedContext = await this.retrieveRelevantContext(context);
      
      // Step 2: Generate embeddings for semantic search (simplified)
      const queryEmbedding = await this.generateQueryEmbedding(context.query);
      
      // Step 3: Rank and filter sources by relevance
      const rankedSources = await this.rankSourcesByRelevance(retrievedContext, queryEmbedding);
      
      // Step 4: Generate response using LLM with context
      const response = await this.generateContextualResponse(context, rankedSources);
      
      // Step 5: Extract actionable items and related questions
      const actionableItems = await this.extractActionableItems(response, context);
      const relatedQuestions = await this.generateRelatedQuestions(context, rankedSources);

      return {
        answer: response.answer,
        confidence: response.confidence,
        sources: rankedSources.slice(0, 5), // Top 5 most relevant
        relatedQuestions,
        actionableItems
      };

    } catch (error) {
      console.error('❌ RAG Intelligence query failed:', error);
      return this.createFallbackResponse(context);
    }
  }

  /**
   * Retrieve relevant context from organizational knowledge base
   */
  private async retrieveRelevantContext(context: RAGContext) {
    const sources = [];

    try {
      // Get insights
      const relevantInsights = await db
        .select()
        .from(insights)
        .where(
          and(
            eq(insights.organizationId, context.organizationId),
            context.domain ? eq(insights.category, context.domain) : sql`1=1`,
            context.businessUnitId ? eq(insights.businessUnitId, context.businessUnitId) : sql`1=1`
          )
        )
        .orderBy(desc(insights.createdAt))
        .limit(20);

      sources.push(...relevantInsights.map(insight => ({
        type: 'insight' as const,
        id: insight.id,
        title: insight.title,
        content: `${insight.title}: ${insight.description}`,
        relevance: 0.8, // Base relevance
        metadata: {
          category: insight.category,
          confidence: insight.confidence,
          impact: insight.impact
        }
      })));

      // Get evidence
      const relevantEvidence = await db
        .select()
        .from(evidence)
        .where(
          and(
            eq(evidence.organizationId, context.organizationId),
            context.domain ? eq(evidence.category, context.domain) : sql`1=1`
          )
        )
        .orderBy(desc(evidence.createdAt))
        .limit(15);

      sources.push(...relevantEvidence.map(ev => ({
        type: 'evidence' as const,
        id: ev.id,
        title: ev.title,
        content: `Evidence: ${ev.description}\nSource: ${ev.source}`,
        relevance: 0.7,
        metadata: {
          category: ev.category,
          confidence: ev.confidence,
          source: ev.source
        }
      })));

      // Get KPI context
      const relevantKPIs = await db
        .select()
        .from(kpis)
        .where(
          and(
            eq(kpis.organizationId, context.organizationId),
            eq(kpis.isActive, true),
            context.businessUnitId ? eq(kpis.businessUnitId, context.businessUnitId) : sql`1=1`
          )
        )
        .orderBy(desc(kpis.updatedAt))
        .limit(10);

      sources.push(...relevantKPIs.map(kpi => ({
        type: 'kpi' as const,
        id: kpi.id,
        title: kpi.name,
        content: `KPI: ${kpi.name} - Current: ${kpi.currentValue}, Target: ${kpi.target}, Category: ${kpi.category}`,
        relevance: 0.6,
        metadata: {
          category: kpi.category,
          currentValue: kpi.currentValue,
          target: kpi.target,
          unit: kpi.unit
        }
      })));

      // Get scenarios
      const relevantScenarios = await db
        .select()
        .from(scenarios)
        .where(
          and(
            eq(scenarios.organizationId, context.organizationId),
            inArray(scenarios.status, ['active', 'completed'])
          )
        )
        .orderBy(desc(scenarios.updatedAt))
        .limit(10);

      sources.push(...relevantScenarios.map(scenario => ({
        type: 'scenario' as const,
        id: scenario.id,
        title: scenario.name,
        content: `Scenario: ${scenario.name} - ${scenario.description}`,
        relevance: 0.5,
        metadata: {
          status: scenario.status,
          priority: scenario.priority,
          category: scenario.category
        }
      })));

      return sources;

    } catch (error) {
      console.error('❌ Failed to retrieve context:', error);
      return [];
    }
  }

  /**
   * Generate query embedding (simplified implementation)
   */
  private async generateQueryEmbedding(query: string): Promise<number[]> {
    try {
      if (!openai) {
        // Fallback: simple keyword-based embedding
        return this.createSimpleEmbedding(query);
      }

      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: query
      });

      return response.data[0].embedding;

    } catch (error) {
      console.error('❌ Failed to generate embedding:', error);
      return this.createSimpleEmbedding(query);
    }
  }

  /**
   * Create simple keyword-based embedding as fallback
   */
  private createSimpleEmbedding(text: string): number[] {
    const keywords = text.toLowerCase().split(/\s+/);
    const embedding = new Array(100).fill(0);
    
    keywords.forEach((keyword, index) => {
      const hash = this.simpleHash(keyword);
      embedding[hash % 100] += 1;
    });

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? embedding.map(val => val / magnitude) : embedding;
  }

  /**
   * Simple hash function for keyword embedding
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Rank sources by relevance using embedding similarity and metadata
   */
  private async rankSourcesByRelevance(sources: any[], queryEmbedding: number[]) {
    return sources
      .map(source => {
        // Calculate semantic similarity
        const contentEmbedding = this.createSimpleEmbedding(source.content);
        const similarity = this.cosineSimilarity(queryEmbedding, contentEmbedding);
        
        // Apply relevance boosts
        let relevanceScore = source.relevance * 0.5 + similarity * 0.5;
        
        // Boost recent content
        if (source.metadata?.createdAt) {
          const daysSince = (Date.now() - new Date(source.metadata.createdAt).getTime()) / (1000 * 60 * 60 * 24);
          relevanceScore *= Math.exp(-daysSince / 30); // Decay over 30 days
        }
        
        // Boost high confidence content
        if (source.metadata?.confidence) {
          relevanceScore *= (0.5 + 0.5 * source.metadata.confidence);
        }

        return {
          ...source,
          relevance: relevanceScore
        };
      })
      .sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    const minLength = Math.min(a.length, b.length);
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < minLength; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Generate contextual response using LLM
   */
  private async generateContextualResponse(context: RAGContext, sources: any[]): Promise<{
    answer: string;
    confidence: number;
  }> {
    try {
      if (!openai) {
        return this.generateFallbackResponse(context, sources);
      }

      const contextSummary = sources
        .slice(0, 10)
        .map(source => `[${source.type.toUpperCase()}] ${source.content}`)
        .join('\n');

      const prompt = `You are M, a strategic intelligence AI assistant. Based on the following organizational context and data, provide a comprehensive answer to the user's question.

ORGANIZATIONAL CONTEXT:
${contextSummary}

USER QUESTION: ${context.query}

Please provide:
1. A direct, actionable answer based on the available data
2. Key insights derived from the context
3. Any data gaps or limitations in your analysis
4. Strategic implications or considerations

Response should be professional, data-driven, and actionable for C-suite executives.`;

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are M, an elite strategic intelligence assistant for C-suite executives. Provide insights that are data-driven, actionable, and strategically valuable."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.1
      });

      const answer = response.choices[0].message.content || 'Unable to generate response.';
      
      // Calculate confidence based on source quality and response coherence
      const confidence = this.calculateResponseConfidence(sources, answer);

      return { answer, confidence };

    } catch (error) {
      console.error('❌ Failed to generate LLM response:', error);
      return this.generateFallbackResponse(context, sources);
    }
  }

  /**
   * Generate fallback response when AI is unavailable
   */
  private generateFallbackResponse(context: RAGContext, sources: any[] = []): {
    answer: string;
    confidence: number;
  } {
    const relevantSources = sources.slice(0, 3);
    
    let answer = `Based on available organizational data, here's what I found regarding: "${context.query}"\n\n`;
    
    if (relevantSources.length > 0) {
      answer += "Key findings from your organizational knowledge base:\n\n";
      relevantSources.forEach((source, index) => {
        answer += `${index + 1}. ${source.content}\n`;
      });
      answer += "\nThis analysis is based on your organization's data. For deeper insights, please ensure AI services are properly configured.";
    } else {
      answer += "No directly relevant data found in the current knowledge base. Consider:\n";
      answer += "- Expanding data collection in relevant areas\n";
      answer += "- Reviewing data categorization and tagging\n";
      answer += "- Ensuring all relevant systems are integrated\n";
    }

    return {
      answer,
      confidence: sources.length > 0 ? 0.4 : 0.1
    };
  }

  /**
   * Calculate response confidence based on sources and content quality
   */
  private calculateResponseConfidence(sources: any[], answer: string): number {
    let confidence = 0.3; // Base confidence

    // Source quality factor
    if (sources.length > 0) {
      const avgSourceRelevance = sources.slice(0, 5).reduce((sum, s) => sum + s.relevance, 0) / Math.min(sources.length, 5);
      confidence += avgSourceRelevance * 0.4;
    }

    // Response length and structure factor
    const answerLength = answer.length;
    const structureScore = answer.includes('\n') && answer.length > 200 ? 0.2 : 0.1;
    confidence += Math.min(0.3, answerLength / 1000) + structureScore;

    return Math.min(0.95, Math.max(0.1, confidence));
  }

  /**
   * Extract actionable items from response
   */
  private async extractActionableItems(response: { answer: string }, context: RAGContext) {
    const actionables = [];

    // Simple pattern matching for actionable content
    const actionPatterns = [
      { pattern: /recommend|suggest|should/gi, type: 'recommendation', priority: 'medium' },
      { pattern: /investigate|analyze|review/gi, type: 'investigation', priority: 'medium' },
      { pattern: /decide|determine|choose/gi, type: 'decision', priority: 'high' },
      { pattern: /urgent|critical|immediate/gi, type: 'recommendation', priority: 'high' }
    ];

    const sentences = response.answer.split(/[.!?]+/).filter(s => s.trim().length > 0);

    sentences.forEach(sentence => {
      actionPatterns.forEach(({ pattern, type, priority }) => {
        if (pattern.test(sentence) && sentence.trim().length > 20) {
          actionables.push({
            type: type as 'recommendation' | 'investigation' | 'decision',
            priority: priority as 'low' | 'medium' | 'high',
            description: sentence.trim().substring(0, 200) + (sentence.length > 200 ? '...' : '')
          });
        }
      });
    });

    return actionables.slice(0, 5); // Limit to 5 most important
  }

  /**
   * Generate related questions based on context
   */
  private async generateRelatedQuestions(context: RAGContext, sources: any[]): Promise<string[]> {
    const questions = [];

    // Base questions by domain
    const domainQuestions: Record<string, string[]> = {
      strategic: [
        "What are the key strategic risks facing our organization?",
        "Which initiatives are showing the strongest performance?",
        "How do our KPIs compare to industry benchmarks?"
      ],
      financial: [
        "What are the main drivers of our financial performance?",
        "Which areas present the highest ROI opportunities?",
        "What financial risks should we monitor closely?"
      ],
      operational: [
        "Where are our operational bottlenecks?",
        "Which processes need immediate optimization?",
        "What operational metrics are trending negatively?"
      ],
      risk: [
        "What are our highest probability risks?",
        "Which risk mitigation strategies are most effective?",
        "How has our risk profile changed recently?"
      ]
    };

    if (context.domain && domainQuestions[context.domain]) {
      questions.push(...domainQuestions[context.domain]);
    }

    // Generate questions based on available sources
    const sourceTypes = [...new Set(sources.map(s => s.type))];
    sourceTypes.forEach(type => {
      switch (type) {
        case 'kpi':
          questions.push("Which KPIs are underperforming and need attention?");
          break;
        case 'scenario':
          questions.push("What scenarios should we prioritize for planning?");
          break;
        case 'insight':
          questions.push("What insights require immediate action?");
          break;
      }
    });

    return [...new Set(questions)].slice(0, 5);
  }

  /**
   * Create fallback response when context is insufficient
   */
  private createFallbackResponse(context: RAGContext): RAGResponse {
    return {
      answer: `I understand you're asking about: "${context.query}". While I have limited context available, I recommend:\n\n1. Ensuring your data sources are properly integrated\n2. Reviewing relevant KPIs and scenarios in your dashboard\n3. Consulting with domain experts for specific insights\n\nFor more comprehensive analysis, please verify that AI services are properly configured and your knowledge base is up to date.`,
      confidence: 0.2,
      sources: [],
      relatedQuestions: [
        "How can I improve data integration for better insights?",
        "What KPIs should I be monitoring in this area?",
        "How do I expand my organizational knowledge base?"
      ],
      actionableItems: [
        {
          type: 'investigation',
          priority: 'medium',
          description: 'Review data integration and knowledge base completeness'
        }
      ]
    };
  }

  /**
   * Create enhanced insight with AI analysis
   */
  async createEnhancedInsight(data: {
    organizationId: string;
    title: string;
    description: string;
    category: string;
    sourceData: Record<string, any>;
    businessUnitId?: string;
    initiativeId?: string;
  }): Promise<EnhancedInsight> {
    try {
      // Generate AI enhancement if available
      let aiAnalysis = null;
      if (openai) {
        try {
          const analysisPrompt = `Analyze this organizational insight and provide:
1. Impact assessment (positive/negative/neutral) 
2. Confidence score (0-1)
3. Recommended evidence to collect
4. Semantic tags for categorization
5. Related strategic recommendations

Insight: ${data.title} - ${data.description}
Source Data: ${JSON.stringify(data.sourceData, null, 2)}

Respond in JSON format: { "impact": "positive/negative/neutral", "confidence": 0.8, "evidenceRecommendations": ["item1", "item2"], "semanticTags": ["tag1", "tag2"], "recommendations": ["rec1", "rec2"] }`;

          // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
          const response = await openai.chat.completions.create({
            model: "gpt-5",
            messages: [{ role: "user", content: analysisPrompt }],
            response_format: { type: "json_object" }
          });

          aiAnalysis = JSON.parse(response.choices[0].message.content || '{}');
        } catch (aiError) {
          console.error('❌ AI analysis failed:', aiError);
        }
      }

      // Create enhanced insight record
      const [insight] = await db.insert(insights).values({
        organizationId: data.organizationId,
        businessUnitId: data.businessUnitId,
        initiativeId: data.initiativeId,
        title: data.title,
        description: data.description,
        category: data.category,
        impact: aiAnalysis?.impact || 'neutral',
        confidence: aiAnalysis?.confidence || 0.5,
        aiGenerated: !!aiAnalysis,
        metadata: {
          sourceData: data.sourceData,
          aiAnalysis,
          semanticTags: aiAnalysis?.semanticTags || [],
          evidenceRecommendations: aiAnalysis?.evidenceRecommendations || []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      // Create related recommendations if AI provided them
      if (aiAnalysis?.recommendations) {
        for (const rec of aiAnalysis.recommendations) {
          await db.insert(recommendations).values({
            organizationId: data.organizationId,
            insightId: insight.id,
            title: `AI Recommendation: ${rec.substring(0, 100)}`,
            description: rec,
            priority: 'medium',
            status: 'pending',
            aiGenerated: true,
            metadata: { source: 'rag_intelligence' },
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }

      return {
        id: insight.id,
        title: insight.title,
        description: insight.description,
        category: insight.category,
        impact: insight.impact as 'positive' | 'negative' | 'neutral',
        confidence: insight.confidence,
        evidenceLinks: [],
        recommendations: aiAnalysis?.recommendations || [],
        aiGenerated: insight.aiGenerated,
        semanticTags: aiAnalysis?.semanticTags || []
      };

    } catch (error) {
      console.error('❌ Failed to create enhanced insight:', error);
      throw error;
    }
  }

  /**
   * Link evidence to insights for enhanced context
   */
  async linkEvidenceToInsight(insightId: string, evidenceData: {
    title: string;
    description: string;
    source: string;
    category: string;
    confidence: number;
    metadata?: Record<string, any>;
  }) {
    try {
      // Get insight details
      const [insight] = await db
        .select()
        .from(insights)
        .where(eq(insights.id, insightId));

      if (!insight) {
        throw new Error('Insight not found');
      }

      // Create evidence record
      const [evidenceRecord] = await db.insert(evidence).values({
        organizationId: insight.organizationId,
        businessUnitId: insight.businessUnitId,
        title: evidenceData.title,
        description: evidenceData.description,
        source: evidenceData.source,
        category: evidenceData.category,
        confidence: evidenceData.confidence,
        metadata: {
          ...evidenceData.metadata,
          linkedInsightId: insightId,
          linkType: 'supporting_evidence'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      // Update insight with evidence link
      await db
        .update(insights)
        .set({
          metadata: {
            ...insight.metadata,
            evidenceLinks: [...(insight.metadata?.evidenceLinks || []), evidenceRecord.id]
          },
          updatedAt: new Date()
        })
        .where(eq(insights.id, insightId));

      console.log(`🔗 Evidence linked to insight: ${evidenceRecord.id} -> ${insightId}`);
      return evidenceRecord;

    } catch (error) {
      console.error('❌ Failed to link evidence to insight:', error);
      throw error;
    }
  }

  /**
   * Perform intelligent analysis of organizational data
   */
  async performIntelligentAnalysis(organizationId: string, analysisType: 'health_check' | 'risk_assessment' | 'opportunity_analysis' | 'performance_review') {
    try {
      const context: RAGContext = {
        query: `Perform ${analysisType.replace('_', ' ')} analysis for the organization`,
        organizationId,
        domain: analysisType.includes('risk') ? 'risk' : 'strategic',
        confidenceThreshold: 0.6
      };

      // Get comprehensive organizational data
      const analysis = await this.processIntelligentQuery(context);

      // Create insight from analysis
      const insight = await this.createEnhancedInsight({
        organizationId,
        title: `${analysisType.replace('_', ' ').toUpperCase()} Analysis - ${new Date().toLocaleDateString()}`,
        description: analysis.answer,
        category: context.domain || 'strategic',
        sourceData: {
          analysisType,
          sources: analysis.sources,
          confidence: analysis.confidence,
          generatedAt: new Date().toISOString()
        }
      });

      // Send notification for critical findings
      if (analysis.confidence > 0.7 && analysis.actionableItems.some(item => item.priority === 'high')) {
        await databaseNotificationService.createStrategicAlert(
          organizationId,
          {
            title: `High-Priority ${analysisType.replace('_', ' ')} Findings`,
            description: `AI analysis has identified critical items requiring attention:\n\n${analysis.actionableItems
              .filter(item => item.priority === 'high')
              .map(item => `• ${item.description}`)
              .join('\n')}`,
            severity: 'high',
            aiConfidence: analysis.confidence,
            suggestedActions: analysis.actionableItems.map(item => item.description).slice(0, 3)
          }
        );
      }

      return {
        insight,
        analysis,
        recommendedActions: analysis.actionableItems
      };

    } catch (error) {
      console.error(`❌ Failed to perform ${analysisType} analysis:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const ragIntelligenceService = new RAGIntelligenceService();