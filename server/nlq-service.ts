import OpenAI from 'openai';
import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';
import pino from 'pino';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

const logger = pino({ name: 'nlq-service' });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Database pool for vector operations
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export interface NLQRequest {
  query: string;
  conversationId?: string;
  organizationId?: string;
  userId: string;
}

export interface NLQResponse {
  response: string;
  conversationId: string;
  sources: Array<{
    id: string;
    title: string;
    content: string;
    relevanceScore: number;
    sourceType: string;
  }>;
  metadata: {
    tokensUsed: number;
    processingTime: number;
    confidence: number;
  };
}

export interface KnowledgeDocument {
  id: string;
  content: string;
  title?: string;
  sourceType: string;
  sourceId?: string;
  metadata?: Record<string, any>;
}

export class NaturalLanguageQueryService {
  private static instance: NaturalLanguageQueryService;

  public static getInstance(): NaturalLanguageQueryService {
    if (!NaturalLanguageQueryService.instance) {
      NaturalLanguageQueryService.instance = new NaturalLanguageQueryService();
    }
    return NaturalLanguageQueryService.instance;
  }

  /**
   * Main entry point for natural language queries
   */
  async processQuery(request: NLQRequest): Promise<NLQResponse> {
    const startTime = Date.now();
    
    try {
      logger.info({ query: request.query, userId: request.userId }, 'Processing NLQ request');

      // Step 1: Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(request.query);

      // Step 2: Find relevant context using vector similarity search
      const relevantContext = await this.findRelevantContext(queryEmbedding, request.organizationId);

      // Step 3: Generate AI response using RAG
      const aiResponse = await this.generateRAGResponse(request.query, relevantContext);

      // Step 4: Save conversation
      const conversationId = await this.saveConversation(request, aiResponse, relevantContext);

      const processingTime = Date.now() - startTime;

      return {
        response: aiResponse.content,
        conversationId,
        sources: relevantContext.map(doc => ({
          id: doc.id,
          title: doc.title || 'Untitled',
          content: doc.content.slice(0, 200) + '...',
          relevanceScore: doc.similarity || 0,
          sourceType: doc.sourceType
        })),
        metadata: {
          tokensUsed: aiResponse.usage?.total_tokens || 0,
          processingTime,
          confidence: this.calculateConfidence(relevantContext)
        }
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error: errorMessage, userId: request.userId }, 'Error processing NLQ request');
      throw new Error(`Failed to process natural language query: ${errorMessage}`);
    }
  }

  /**
   * Generate embedding for text using OpenAI
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text.trim(),
      });

      return response.data[0].embedding;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error: errorMessage }, 'Error generating embedding');
      throw new Error('Failed to generate text embedding');
    }
  }

  /**
   * Find relevant documents using vector similarity search
   */
  async findRelevantContext(queryEmbedding: number[], organizationId?: string): Promise<Array<KnowledgeDocument & { similarity: number }>> {
    const client = await pool.connect();
    
    try {
      // Convert embedding to pgvector format
      const embeddingStr = '[' + queryEmbedding.join(',') + ']';
      
      let query = `
        SELECT 
          id, content, title, source_type, source_id, metadata,
          1 - (embedding <=> $1::vector) as similarity
        FROM knowledge_base
        WHERE 1 - (embedding <=> $1::vector) > 0.7
      `;
      
      const params: any[] = [embeddingStr];
      
      // Filter by organization if provided
      if (organizationId) {
        query += ` AND (metadata->>'organizationId' = $2 OR metadata->>'organizationId' IS NULL)`;
        params.push(organizationId);
      }
      
      query += ` ORDER BY similarity DESC LIMIT 5`;
      
      const result = await client.query(query, params);
      
      return result.rows.map(row => ({
        id: row.id,
        content: row.content,
        title: row.title,
        sourceType: row.source_type,
        sourceId: row.source_id,
        metadata: row.metadata || {},
        similarity: parseFloat(row.similarity)
      }));

    } finally {
      client.release();
    }
  }

  /**
   * Generate AI response using Retrieval Augmented Generation (RAG)
   */
  async generateRAGResponse(query: string, context: Array<KnowledgeDocument & { similarity: number }>): Promise<{
    content: string;
    usage?: { total_tokens: number; prompt_tokens: number; completion_tokens: number };
  }> {
    try {
      // Build context from retrieved documents
      const contextText = context.map((doc, index) => 
        `[Source ${index + 1}] ${doc.title || doc.sourceType}: ${doc.content}`
      ).join('\n\n');

      const systemPrompt = `You are an expert AI assistant for M, an Strategic Execution Operating System. You help executives and decision-makers by analyzing organizational data and providing strategic insights.

Your role is to:
1. Answer questions based on the provided organizational context
2. Provide actionable insights and recommendations
3. Reference specific sources when making claims
4. Acknowledge when you don't have sufficient information

Guidelines:
- Be concise but comprehensive in your responses
- Focus on business impact and strategic implications
- Use executive-level language appropriate for C-suite audiences
- Always cite your sources using [Source X] notation
- If the context doesn't contain relevant information, clearly state this

Context from your organization's knowledge base:
${contextText}`;

      const userPrompt = `Based on the organizational context provided above, please answer this question: ${query}

Please provide a strategic, data-driven response that references the relevant sources.`;

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: 'gpt-5',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response generated from AI model');
      }

      return {
        content,
        usage: completion.usage || undefined
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error: errorMessage }, 'Error generating RAG response');
      throw new Error('Failed to generate AI response');
    }
  }

  /**
   * Save conversation to database
   */
  async saveConversation(
    request: NLQRequest, 
    response: { content: string }, 
    context: Array<KnowledgeDocument>
  ): Promise<string> {
    const client = await pool.connect();
    
    try {
      let conversationId = request.conversationId;
      
      // Create new conversation if none exists
      if (!conversationId) {
        const conversationResult = await client.query(`
          INSERT INTO nlq_conversations (user_id, organization_id, title)
          VALUES ($1, $2, $3)
          RETURNING id
        `, [
          request.userId,
          request.organizationId || null,
          this.generateConversationTitle(request.query)
        ]);
        
        conversationId = conversationResult.rows[0].id;
      }
      
      // Save user message
      await client.query(`
        INSERT INTO nlq_messages (conversation_id, role, content)
        VALUES ($1, 'user', $2)
      `, [conversationId, request.query]);
      
      // Save assistant response with context metadata
      await client.query(`
        INSERT INTO nlq_messages (conversation_id, role, content, context_used)
        VALUES ($1, 'assistant', $2, $3)
      `, [
        conversationId, 
        response.content, 
        JSON.stringify(context.map(doc => ({ id: doc.id, title: doc.title, sourceType: doc.sourceType })))
      ]);
      
      return conversationId!;

    } finally {
      client.release();
    }
  }

  /**
   * Index a document for semantic search
   */
  async indexDocument(document: KnowledgeDocument): Promise<void> {
    try {
      logger.info({ docId: document.id, sourceType: document.sourceType }, 'Indexing document');

      // Generate embedding for the document content
      const embedding = await this.generateEmbedding(document.content);
      
      const client = await pool.connect();
      
      try {
        const embeddingStr = '[' + embedding.join(',') + ']';
        
        await client.query(`
          INSERT INTO knowledge_base (id, content, title, source_type, source_id, embedding, metadata)
          VALUES ($1, $2, $3, $4, $5, $6::vector, $7)
          ON CONFLICT (id) DO UPDATE SET
            content = EXCLUDED.content,
            title = EXCLUDED.title,
            embedding = EXCLUDED.embedding,
            metadata = EXCLUDED.metadata,
            updated_at = NOW()
        `, [
          document.id,
          document.content,
          document.title || null,
          document.sourceType,
          document.sourceId || null,
          embeddingStr,
          JSON.stringify(document.metadata || {})
        ]);
        
        logger.info({ docId: document.id }, 'Document indexed successfully');

      } finally {
        client.release();
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error: errorMessage, docId: document.id }, 'Error indexing document');
      throw new Error(`Failed to index document: ${errorMessage}`);
    }
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId: string, userId: string): Promise<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    contextUsed?: Array<{ id: string; title: string; sourceType: string }>;
  }>> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(`
        SELECT m.id, m.role, m.content, m.context_used, m.created_at
        FROM nlq_messages m
        JOIN nlq_conversations c ON m.conversation_id = c.id
        WHERE c.id = $1 AND c.user_id = $2
        ORDER BY m.created_at ASC
      `, [conversationId, userId]);

      return result.rows.map(row => ({
        id: row.id,
        role: row.role,
        content: row.content,
        timestamp: row.created_at,
        contextUsed: row.context_used || undefined
      }));

    } finally {
      client.release();
    }
  }

  /**
   * Helper methods
   */
  private generateConversationTitle(query: string): string {
    // Simple title generation - could be enhanced with AI
    return query.length > 50 ? query.slice(0, 50) + '...' : query;
  }

  private calculateConfidence(context: Array<{ similarity: number }>): number {
    if (context.length === 0) return 0;
    const avgSimilarity = context.reduce((sum, doc) => sum + doc.similarity, 0) / context.length;
    return Math.round(avgSimilarity * 100) / 100;
  }
}

export const nlqService = NaturalLanguageQueryService.getInstance();