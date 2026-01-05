import { db } from '../db.js';
import { kpis, users, organizations, businessUnits, initiatives } from '@shared/schema';
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';
import { databaseNotificationService } from './DatabaseNotificationService.js';

export interface KPIDataPoint {
  value: number;
  timestamp: Date;
  period: string; // 'daily', 'weekly', 'monthly', 'quarterly'
  metadata?: Record<string, any>;
}

export interface KPITrend {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
  significance: 'low' | 'medium' | 'high';
  period: string;
}

export interface KPIForecast {
  predictedValue: number;
  confidence: number; // 0-1
  upperBound: number;
  lowerBound: number;
  forecastDate: Date;
  factors: string[];
}

export interface KPIAnomaly {
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: Date;
  expectedRange: { min: number; max: number };
  actualValue: number;
  confidence: number;
}

export interface KPIInsight {
  type: 'trend' | 'anomaly' | 'forecast' | 'benchmark';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  actionable: boolean;
  recommendations: string[];
}

export class KPIService {
  
  /**
   * Create a new KPI with validation
   */
  async createKPI(kpiData: {
    organizationId: string;
    businessUnitId?: string;
    initiativeId?: string;
    name: string;
    description?: string;
    category: string;
    unit?: string;
    target: number;
    threshold: number;
    owner?: string;
    dataSource?: string;
    frequency: string;
    metadata?: Record<string, any>;
  }) {
    try {
      const [kpi] = await db.insert(kpis).values({
        ...kpiData,
        currentValue: 0,
        isActive: true,
        tags: kpiData.metadata?.tags || [],
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      console.log(`📊 KPI created: ${kpi.name} (${kpi.id})`);
      return kpi;

    } catch (error) {
      console.error('❌ Failed to create KPI:', error);
      throw error;
    }
  }

  /**
   * Update KPI value and trigger analysis
   */
  async updateKPIValue(
    kpiId: string, 
    newValue: number, 
    timestamp: Date = new Date(),
    metadata?: Record<string, any>
  ) {
    try {
      // Get current KPI
      const [currentKPI] = await db
        .select()
        .from(kpis)
        .where(eq(kpis.id, kpiId));

      if (!currentKPI) {
        throw new Error(`KPI ${kpiId} not found`);
      }

      // Update KPI value
      const [updatedKPI] = await db
        .update(kpis)
        .set({ 
          currentValue: newValue, 
          updatedAt: timestamp,
          metadata: {
            ...currentKPI.metadata,
            ...metadata,
            lastUpdate: timestamp.toISOString()
          }
        })
        .where(eq(kpis.id, kpiId))
        .returning();

      // Store historical data point
      await this.storeDataPoint(kpiId, {
        value: newValue,
        timestamp,
        period: this.determinePeriod(currentKPI.frequency),
        metadata
      });

      // Perform analysis
      const analysis = await this.analyzeKPI(kpiId);
      
      // Check for anomalies and alerts
      await this.checkForAnomalies(updatedKPI, analysis);

      return {
        kpi: updatedKPI,
        analysis
      };

    } catch (error) {
      console.error(`❌ Failed to update KPI ${kpiId}:`, error);
      throw error;
    }
  }

  /**
   * Analyze KPI trends, forecasts, and insights
   */
  async analyzeKPI(kpiId: string): Promise<{
    trend: KPITrend;
    forecast: KPIForecast;
    anomalies: KPIAnomaly[];
    insights: KPIInsight[];
  }> {
    try {
      const [kpi] = await db
        .select()
        .from(kpis)
        .where(eq(kpis.id, kpiId));

      if (!kpi) {
        throw new Error(`KPI ${kpiId} not found`);
      }

      // Get historical data for analysis
      const historicalData = await this.getHistoricalData(kpiId, 90); // 90 days

      // Calculate trend
      const trend = this.calculateTrend(historicalData);
      
      // Generate forecast
      const forecast = this.generateForecast(historicalData, kpi);
      
      // Detect anomalies
      const anomalies = this.detectAnomalies(historicalData, kpi);
      
      // Generate insights
      const insights = this.generateInsights(kpi, trend, forecast, anomalies);

      return {
        trend,
        forecast,
        anomalies,
        insights
      };

    } catch (error) {
      console.error(`❌ Failed to analyze KPI ${kpiId}:`, error);
      throw error;
    }
  }

  /**
   * Get KPI dashboard data for organization
   */
  async getOrganizationKPIs(organizationId: string) {
    try {
      const organizationKPIs = await db
        .select({
          kpi: kpis,
          owner: users,
          businessUnit: businessUnits,
          initiative: initiatives
        })
        .from(kpis)
        .leftJoin(users, eq(kpis.owner, users.id))
        .leftJoin(businessUnits, eq(kpis.businessUnitId, businessUnits.id))
        .leftJoin(initiatives, eq(kpis.initiativeId, initiatives.id))
        .where(
          and(
            eq(kpis.organizationId, organizationId),
            eq(kpis.isActive, true)
          )
        )
        .orderBy(desc(kpis.updatedAt));

      // Get analysis for each KPI
      const kpiAnalyses = await Promise.all(
        organizationKPIs.map(async (item) => ({
          ...item,
          analysis: await this.analyzeKPI(item.kpi.id)
        }))
      );

      return {
        kpis: kpiAnalyses,
        summary: this.generateOrganizationSummary(kpiAnalyses)
      };

    } catch (error) {
      console.error(`❌ Failed to get organization KPIs:`, error);
      throw error;
    }
  }

  /**
   * Store historical data point
   */
  private async storeDataPoint(kpiId: string, dataPoint: KPIDataPoint) {
    try {
      // In a real implementation, this would store to a time-series database
      // For now, we'll store in metadata
      const [kpi] = await db
        .select()
        .from(kpis)
        .where(eq(kpis.id, kpiId));

      if (kpi) {
        const history = kpi.metadata?.history || [];
        history.push(dataPoint);
        
        // Keep only last 1000 data points
        if (history.length > 1000) {
          history.splice(0, history.length - 1000);
        }

        await db
          .update(kpis)
          .set({
            metadata: {
              ...kpi.metadata,
              history
            }
          })
          .where(eq(kpis.id, kpiId));
      }
    } catch (error) {
      console.error('❌ Failed to store data point:', error);
    }
  }

  /**
   * Get historical data for analysis
   */
  private async getHistoricalData(kpiId: string, days: number): Promise<KPIDataPoint[]> {
    try {
      const [kpi] = await db
        .select()
        .from(kpis)
        .where(eq(kpis.id, kpiId));

      if (!kpi?.metadata?.history) {
        return [];
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      return kpi.metadata.history.filter((point: KPIDataPoint) => 
        new Date(point.timestamp) >= cutoffDate
      );

    } catch (error) {
      console.error('❌ Failed to get historical data:', error);
      return [];
    }
  }

  /**
   * Calculate trend analysis
   */
  private calculateTrend(data: KPIDataPoint[]): KPITrend {
    if (data.length < 2) {
      return {
        direction: 'stable',
        percentage: 0,
        significance: 'low',
        period: '30d'
      };
    }

    const sortedData = data.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const recent = sortedData.slice(-7); // Last 7 data points
    const previous = sortedData.slice(-14, -7); // Previous 7 data points

    if (recent.length === 0 || previous.length === 0) {
      return {
        direction: 'stable',
        percentage: 0,
        significance: 'low',
        period: '7d'
      };
    }

    const recentAvg = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
    const previousAvg = previous.reduce((sum, d) => sum + d.value, 0) / previous.length;

    const percentage = ((recentAvg - previousAvg) / previousAvg) * 100;
    const absPercentage = Math.abs(percentage);

    return {
      direction: percentage > 2 ? 'up' : percentage < -2 ? 'down' : 'stable',
      percentage: Math.round(percentage * 100) / 100,
      significance: absPercentage > 10 ? 'high' : absPercentage > 5 ? 'medium' : 'low',
      period: '7d'
    };
  }

  /**
   * Generate forecast using simple linear regression
   */
  private generateForecast(data: KPIDataPoint[], kpi: any): KPIForecast {
    if (data.length < 3) {
      return {
        predictedValue: kpi.currentValue,
        confidence: 0.1,
        upperBound: kpi.currentValue * 1.2,
        lowerBound: kpi.currentValue * 0.8,
        forecastDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        factors: ['insufficient_data']
      };
    }

    // Simple linear regression for trend
    const sortedData = data.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const n = sortedData.length;
    const sumX = sortedData.reduce((sum, _, i) => sum + i, 0);
    const sumY = sortedData.reduce((sum, d) => sum + d.value, 0);
    const sumXY = sortedData.reduce((sum, d, i) => sum + i * d.value, 0);
    const sumXX = sortedData.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Forecast for next period
    const nextX = n;
    const predictedValue = slope * nextX + intercept;

    // Calculate confidence based on data consistency
    const variance = sortedData.reduce((sum, d, i) => {
      const predicted = slope * i + intercept;
      return sum + Math.pow(d.value - predicted, 2);
    }, 0) / n;

    const confidence = Math.max(0.1, 1 - (Math.sqrt(variance) / Math.abs(predictedValue)));

    return {
      predictedValue: Math.round(predictedValue * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      upperBound: predictedValue * (1 + (1 - confidence)),
      lowerBound: predictedValue * (1 - (1 - confidence)),
      forecastDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      factors: ['historical_trend', 'linear_regression']
    };
  }

  /**
   * Detect anomalies in KPI data
   */
  private detectAnomalies(data: KPIDataPoint[], kpi: any): KPIAnomaly[] {
    if (data.length < 5) return [];

    const anomalies: KPIAnomaly[] = [];
    const values = data.map(d => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
    );

    // Check current value against statistical thresholds
    const currentValue = kpi.currentValue;
    const zScore = Math.abs((currentValue - mean) / stdDev);

    if (zScore > 3) { // 3 sigma rule
      anomalies.push({
        severity: 'critical',
        description: `Current value (${currentValue}) is ${zScore.toFixed(1)} standard deviations from mean`,
        detectedAt: new Date(),
        expectedRange: { 
          min: mean - 2 * stdDev, 
          max: mean + 2 * stdDev 
        },
        actualValue: currentValue,
        confidence: Math.min(0.99, zScore / 5)
      });
    } else if (zScore > 2) {
      anomalies.push({
        severity: 'high',
        description: `Current value shows significant deviation from historical norm`,
        detectedAt: new Date(),
        expectedRange: { 
          min: mean - 2 * stdDev, 
          max: mean + 2 * stdDev 
        },
        actualValue: currentValue,
        confidence: Math.min(0.8, zScore / 3)
      });
    }

    // Check against target and threshold
    if (currentValue < kpi.threshold) {
      anomalies.push({
        severity: currentValue < kpi.threshold * 0.8 ? 'critical' : 'high',
        description: `KPI value below threshold (${kpi.threshold})`,
        detectedAt: new Date(),
        expectedRange: { 
          min: kpi.threshold, 
          max: kpi.target 
        },
        actualValue: currentValue,
        confidence: 0.95
      });
    }

    return anomalies;
  }

  /**
   * Generate actionable insights
   */
  private generateInsights(
    kpi: any, 
    trend: KPITrend, 
    forecast: KPIForecast, 
    anomalies: KPIAnomaly[]
  ): KPIInsight[] {
    const insights: KPIInsight[] = [];

    // Trend insights
    if (trend.significance === 'high') {
      insights.push({
        type: 'trend',
        title: `Strong ${trend.direction}ward trend detected`,
        description: `${kpi.name} has shown a ${Math.abs(trend.percentage)}% ${trend.direction}ward trend over the last ${trend.period}`,
        impact: trend.direction === 'up' ? 'positive' : 'negative',
        actionable: true,
        recommendations: trend.direction === 'down' 
          ? ['Investigate root causes', 'Implement corrective actions', 'Increase monitoring frequency']
          : ['Identify success factors', 'Scale successful practices', 'Maintain momentum']
      });
    }

    // Forecast insights
    if (forecast.confidence > 0.7) {
      const targetGap = ((forecast.predictedValue - kpi.target) / kpi.target) * 100;
      
      if (Math.abs(targetGap) > 10) {
        insights.push({
          type: 'forecast',
          title: `Target ${targetGap > 0 ? 'exceeded' : 'shortfall'} predicted`,
          description: `Based on current trends, ${kpi.name} is forecasted to be ${Math.abs(targetGap).toFixed(1)}% ${targetGap > 0 ? 'above' : 'below'} target`,
          impact: targetGap > 0 ? 'positive' : 'negative',
          actionable: true,
          recommendations: targetGap < 0 
            ? ['Review strategy', 'Accelerate initiatives', 'Allocate additional resources']
            : ['Set stretch targets', 'Capture lessons learned', 'Plan for scaling']
        });
      }
    }

    // Anomaly insights
    anomalies.forEach(anomaly => {
      insights.push({
        type: 'anomaly',
        title: `${anomaly.severity.charAt(0).toUpperCase() + anomaly.severity.slice(1)} anomaly detected`,
        description: anomaly.description,
        impact: 'negative',
        actionable: true,
        recommendations: [
          'Investigate data quality',
          'Check for external factors',
          'Validate measurement process',
          'Consider corrective actions'
        ]
      });
    });

    return insights;
  }

  /**
   * Generate organization-level KPI summary
   */
  private generateOrganizationSummary(kpiAnalyses: any[]) {
    const totalKPIs = kpiAnalyses.length;
    const onTarget = kpiAnalyses.filter(k => k.kpi.currentValue >= k.kpi.threshold).length;
    const critical = kpiAnalyses.filter(k => 
      k.analysis.anomalies.some((a: KPIAnomaly) => a.severity === 'critical')
    ).length;
    
    const avgPerformance = kpiAnalyses.reduce((sum, k) => 
      sum + ((k.kpi.currentValue / k.kpi.target) * 100), 0
    ) / totalKPIs;

    return {
      totalKPIs,
      onTarget,
      belowThreshold: totalKPIs - onTarget,
      criticalIssues: critical,
      avgPerformance: Math.round(avgPerformance * 100) / 100,
      healthScore: Math.round(((onTarget / totalKPIs) * 0.7 + ((totalKPIs - critical) / totalKPIs) * 0.3) * 100)
    };
  }

  /**
   * Check for anomalies and trigger alerts
   */
  private async checkForAnomalies(kpi: any, analysis: any): Promise<void> {
    try {
      const criticalAnomalies = analysis.anomalies.filter((a: KPIAnomaly) => 
        a.severity === 'critical' || a.severity === 'high'
      );

      if (criticalAnomalies.length > 0) {
        // Send alert to KPI owner and organization executives
        const alertTitle = `KPI Alert: ${kpi.name}`;
        const alertMessage = criticalAnomalies.map((a: KPIAnomaly) => a.description).join('\n');

        await databaseNotificationService.createStrategicAlert(
          kpi.organizationId,
          {
            title: alertTitle,
            description: `${alertMessage}\n\nCurrent Value: ${kpi.currentValue}\nTarget: ${kpi.target}\nThreshold: ${kpi.threshold}`,
            severity: criticalAnomalies[0].severity === 'critical' ? 'critical' : 'high',
            aiConfidence: criticalAnomalies[0].confidence,
            suggestedActions: analysis.insights
              .filter((i: KPIInsight) => i.actionable)
              .flatMap((i: KPIInsight) => i.recommendations)
              .slice(0, 3),
            targetAudience: ['KPI Owner', 'Business Unit Lead', 'Executive Team']
          }
        );

        console.log(`🚨 KPI alert sent for ${kpi.name}: ${criticalAnomalies.length} critical issues`);
      }

    } catch (error) {
      console.error('❌ Failed to check for anomalies:', error);
    }
  }

  /**
   * Determine period based on frequency
   */
  private determinePeriod(frequency: string): string {
    const freqMap: Record<string, string> = {
      'daily': 'daily',
      'weekly': 'weekly', 
      'monthly': 'monthly',
      'quarterly': 'quarterly'
    };
    return freqMap[frequency] || 'daily';
  }

  /**
   * Bulk update KPIs from external data source
   */
  async bulkUpdateKPIs(updates: Array<{
    kpiId: string;
    value: number;
    timestamp?: Date;
    metadata?: Record<string, any>;
  }>) {
    const results = [];
    
    for (const update of updates) {
      try {
        const result = await this.updateKPIValue(
          update.kpiId, 
          update.value, 
          update.timestamp, 
          update.metadata
        );
        results.push({ success: true, kpiId: update.kpiId, result });
      } catch (error) {
        results.push({ success: false, kpiId: update.kpiId, error });
      }
    }

    return results;
  }

  /**
   * Get KPI benchmark data
   */
  async getBenchmarkData(kpiId: string) {
    try {
      const [kpi] = await db
        .select()
        .from(kpis)
        .where(eq(kpis.id, kpiId));

      if (!kpi) {
        throw new Error('KPI not found');
      }

      // Get similar KPIs for benchmarking
      const similarKPIs = await db
        .select()
        .from(kpis)
        .where(
          and(
            eq(kpis.category, kpi.category),
            eq(kpis.isActive, true)
          )
        );

      const benchmarkStats = {
        industryAvg: similarKPIs.reduce((sum, k) => sum + (k.currentValue || 0), 0) / similarKPIs.length,
        topQuartile: this.calculatePercentile(similarKPIs.map(k => k.currentValue || 0), 75),
        median: this.calculatePercentile(similarKPIs.map(k => k.currentValue || 0), 50),
        bottomQuartile: this.calculatePercentile(similarKPIs.map(k => k.currentValue || 0), 25),
        sampleSize: similarKPIs.length
      };

      return benchmarkStats;

    } catch (error) {
      console.error('❌ Failed to get benchmark data:', error);
      throw error;
    }
  }

  /**
   * Calculate percentile
   */
  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = values.filter(v => v !== null).sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    
    if (Math.floor(index) === index) {
      return sorted[index];
    } else {
      const lower = sorted[Math.floor(index)];
      const upper = sorted[Math.ceil(index)];
      return lower + (upper - lower) * (index - Math.floor(index));
    }
  }
}

// Export singleton instance
export const kpiService = new KPIService();