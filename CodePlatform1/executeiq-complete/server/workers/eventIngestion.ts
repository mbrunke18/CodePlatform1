import { triggerIntelligence } from '../services/TriggerIntelligenceService';
import { db } from '../db';
import { executiveTriggers } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface NewsArticle {
  source: { name: string };
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  url: string;
}

/**
 * Poll news feeds and create alerts based on trigger matches
 */
export async function pollNewsFeeds() {
  try {
    const newsApiKey = process.env.NEWS_API_KEY;

    if (!newsApiKey) {
      console.log('NEWS_API_KEY not configured - skipping news polling');
      return;
    }

    // Fetch business news from NewsAPI
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=business OR technology OR market&language=en&sortBy=publishedAt&pageSize=20&apiKey=${newsApiKey}`
    );

    if (!response.ok) {
      console.error('NewsAPI request failed:', response.statusText);
      return;
    }

    const data = await response.json();
    const articles: NewsArticle[] = data.articles || [];

    console.log(`Fetched ${articles.length} news articles for analysis`);

    // Get all organizations with active triggers
    const organizations = await db.selectDistinct({ 
      organizationId: executiveTriggers.organizationId 
    })
    .from(executiveTriggers)
    .where(eq(executiveTriggers.isActive, true));

    // Process each article
    for (const article of articles.slice(0, 10)) { // Limit to 10 to avoid rate limits
      try {
        // Analyze with AI
        const analysis = await triggerIntelligence.analyzeEvent({
          source: article.source.name,
          title: article.title,
          content: article.description || article.content || article.title,
          timestamp: new Date(article.publishedAt)
        });

        // Check against each organization's triggers
        for (const org of organizations) {
          const matches = await triggerIntelligence.matchTriggers(
            org.organizationId,
            analysis,
            {
              article,
              source: 'news_api',
              timestamp: new Date()
            }
          );

          // Create alerts for matches
          for (const match of matches) {
            await triggerIntelligence.createAlert(
              org.organizationId,
              match,
              {
                article: {
                  title: article.title,
                  url: article.url,
                  source: article.source.name,
                  publishedAt: article.publishedAt
                },
                analysis
              }
            );

            console.log(`Created alert for org ${org.organizationId}: ${match.analysis.summary.substring(0, 50)}...`);
          }
        }
      } catch (error) {
        console.error(`Error processing article "${article.title}":`, error);
      }
    }

    console.log('News polling completed successfully');
  } catch (error) {
    console.error('Error in news polling:', error);
  }
}

/**
 * Poll custom data sources (webhooks, RSS, etc.)
 */
export async function pollCustomSources(organizationId: string) {
  // This would poll organization-specific data sources
  // - RSS feeds they've configured
  // - Webhook endpoints
  // - Connected APIs (Slack, Jira, etc.)
  
  console.log(`Polling custom sources for org ${organizationId}`);
  
  // TODO: Implement custom source polling
  // For now, this is a placeholder for future functionality
}

/**
 * Start background workers
 */
export function startEventIngestion() {
  // Poll news every 15 minutes
  const newsInterval = 15 * 60 * 1000;
  
  // Initial poll
  pollNewsFeeds();
  
  // Set up recurring polls
  setInterval(() => {
    pollNewsFeeds();
  }, newsInterval);

  console.log(`Event ingestion workers started (polling every ${newsInterval / 1000 / 60} minutes)`);
}
