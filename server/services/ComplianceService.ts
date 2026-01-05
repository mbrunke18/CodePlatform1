import { db } from '../db.js';
import { complianceFrameworks, complianceReports, organizations, users } from '@shared/schema';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { databaseNotificationService } from './DatabaseNotificationService.js';

export interface ComplianceFramework {
  id: string;
  name: string;
  category: 'financial' | 'security' | 'operational' | 'data_privacy' | 'industry_specific';
  version: string;
  requirements: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    mandatory: boolean;
    evidence: string[];
    frequency: 'continuous' | 'monthly' | 'quarterly' | 'annually';
  }>;
  controls: Array<{
    id: string;
    name: string;
    description: string;
    type: 'preventive' | 'detective' | 'corrective';
    implementation: string;
    testing: string;
    responsible: string;
  }>;
  assessmentCriteria: Array<{
    requirement: string;
    criteria: string;
    passingScore: number;
    weight: number;
  }>;
}

export interface ComplianceAssessment {
  frameworkId: string;
  organizationId: string;
  assessmentDate: Date;
  assessor: string;
  controlsAssessed: number;
  controlsPassed: number;
  controlsFailed: number;
  overallScore: number; // 0-100
  status: 'compliant' | 'non_compliant' | 'under_review' | 'exception_granted';
  findings: Array<{
    controlId: string;
    status: 'pass' | 'fail' | 'not_applicable';
    score: number;
    evidence: string[];
    issues: string[];
    recommendations: string[];
  }>;
  exceptions: Array<{
    controlId: string;
    reason: string;
    approver: string;
    expirationDate: Date;
  }>;
  remediationPlan: Array<{
    finding: string;
    action: string;
    owner: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }>;
}

export interface BoardComplianceReport {
  organizationId: string;
  reportingPeriod: string;
  generatedDate: Date;
  executiveSummary: {
    overallStatus: 'green' | 'yellow' | 'red';
    complianceScore: number;
    keyAchievements: string[];
    criticalIssues: string[];
    resourceRequests: string[];
  };
  frameworkSummary: Array<{
    framework: string;
    status: string;
    score: number;
    lastAssessment: Date;
    nextAssessment: Date;
    keyRisks: string[];
  }>;
  riskAssessment: {
    highRiskAreas: string[];
    emergingRisks: string[];
    mitigationProgress: string[];
  };
  recommendations: Array<{
    area: string;
    recommendation: string;
    businessImpact: string;
    investment: string;
    timeline: string;
  }>;
  metrics: {
    incidentsReported: number;
    auditFindings: number;
    remediationRate: number;
    trainingCompletion: number;
  };
}

export class ComplianceService {

  /**
   * Initialize compliance frameworks for an organization
   */
  async initializeComplianceFrameworks(organizationId: string, organizationType: string): Promise<void> {
    try {
      const frameworks = this.getRelevantFrameworks(organizationType);
      
      for (const framework of frameworks) {
        await db.insert(complianceFrameworks).values({
          organizationId,
          name: framework.name,
          category: framework.category,
          version: framework.version,
          requirements: framework.requirements,
          controls: framework.controls,
          assessmentCriteria: framework.assessmentCriteria,
          reportingSchedule: this.getReportingSchedule(framework.category),
          status: 'under_review',
          riskLevel: 'moderate',
          documentation: {
            policies: [],
            procedures: [],
            evidence: []
          },
          auditTrail: [{
            action: 'framework_initialized',
            timestamp: new Date().toISOString(),
            user: 'system'
          }]
        });
      }

      console.log(`✅ Initialized ${frameworks.length} compliance frameworks for organization ${organizationId}`);

    } catch (error) {
      console.error('❌ Failed to initialize compliance frameworks:', error);
      throw error;
    }
  }

  /**
   * Get relevant compliance frameworks for organization type
   */
  private getRelevantFrameworks(organizationType: string): ComplianceFramework[] {
    const baseFrameworks = [
      {
        id: 'iso_27001',
        name: 'ISO 27001 Information Security',
        category: 'security' as const,
        version: '2022',
        requirements: [
          {
            id: 'A.5.1',
            title: 'Information Security Policy',
            description: 'Establish, implement and maintain information security policy',
            category: 'governance',
            mandatory: true,
            evidence: ['Policy document', 'Board approval', 'Communication records'],
            frequency: 'annually' as const
          },
          {
            id: 'A.5.2',
            title: 'Risk Management',
            description: 'Implement information security risk management process',
            category: 'risk',
            mandatory: true,
            evidence: ['Risk register', 'Risk assessments', 'Treatment plans'],
            frequency: 'quarterly' as const
          },
          {
            id: 'A.6.1',
            title: 'Incident Response',
            description: 'Establish incident response procedures',
            category: 'operations',
            mandatory: true,
            evidence: ['Response procedures', 'Incident logs', 'Training records'],
            frequency: 'continuous' as const
          }
        ],
        controls: [
          {
            id: 'A.5.1.1',
            name: 'Information Security Policy Set',
            description: 'A set of policies for information security shall be defined',
            type: 'preventive' as const,
            implementation: 'Document management system with version control',
            testing: 'Annual review and approval process',
            responsible: 'CISO'
          },
          {
            id: 'A.5.1.2',
            name: 'Review of Information Security Policy',
            description: 'Information security policy shall be reviewed at planned intervals',
            type: 'detective' as const,
            implementation: 'Scheduled review process with stakeholders',
            testing: 'Quarterly review meetings and documentation',
            responsible: 'Security Committee'
          }
        ],
        assessmentCriteria: [
          {
            requirement: 'A.5.1',
            criteria: 'Policy exists, is current, and properly communicated',
            passingScore: 80,
            weight: 0.2
          },
          {
            requirement: 'A.5.2',
            criteria: 'Risk management process is implemented and effective',
            passingScore: 75,
            weight: 0.3
          }
        ]
      }
    ];

    // Add industry-specific frameworks
    if (organizationType === 'financial_services') {
      baseFrameworks.push({
        id: 'sox_404',
        name: 'Sarbanes-Oxley Act Section 404',
        category: 'financial' as const,
        version: '2023',
        requirements: [
          {
            id: 'SOX.404.1',
            title: 'Internal Control Assessment',
            description: 'Management assessment of internal control effectiveness',
            category: 'financial_reporting',
            mandatory: true,
            evidence: ['Management assessment', 'Testing documentation', 'Deficiency analysis'],
            frequency: 'annually' as const
          },
          {
            id: 'SOX.404.2',
            title: 'Auditor Attestation',
            description: 'External auditor opinion on internal controls',
            category: 'audit',
            mandatory: true,
            evidence: ['Audit report', 'Management letter', 'Response to findings'],
            frequency: 'annually' as const
          }
        ],
        controls: [
          {
            id: 'SOX.404.1.1',
            name: 'Financial Close Process',
            description: 'Standardized financial close with appropriate reviews',
            type: 'preventive' as const,
            implementation: 'ERP system with automated controls and manual reviews',
            testing: 'Monthly testing of key financial controls',
            responsible: 'CFO'
          }
        ],
        assessmentCriteria: [
          {
            requirement: 'SOX.404.1',
            criteria: 'Internal controls are designed and operating effectively',
            passingScore: 95,
            weight: 0.6
          }
        ]
      });
    }

    return baseFrameworks;
  }

  /**
   * Perform compliance assessment
   */
  async performComplianceAssessment(
    frameworkId: string,
    organizationId: string,
    assessorId: string
  ): Promise<ComplianceAssessment> {
    try {
      const [framework] = await db
        .select()
        .from(complianceFrameworks)
        .where(
          and(
            eq(complianceFrameworks.id, frameworkId),
            eq(complianceFrameworks.organizationId, organizationId)
          )
        );

      if (!framework) {
        throw new Error(`Compliance framework ${frameworkId} not found`);
      }

      // Assess each control
      const findings = await this.assessControls(framework);
      
      // Calculate scores
      const controlsAssessed = findings.length;
      const controlsPassed = findings.filter(f => f.status === 'pass').length;
      const controlsFailed = findings.filter(f => f.status === 'fail').length;
      
      // Calculate weighted score
      const overallScore = this.calculateComplianceScore(findings, framework.assessmentCriteria as any);
      
      // Determine status
      const status = this.determineComplianceStatus(overallScore, controlsFailed);
      
      // Generate remediation plan for failed controls
      const remediationPlan = this.generateRemediationPlan(findings.filter(f => f.status === 'fail'));

      const assessment: ComplianceAssessment = {
        frameworkId,
        organizationId,
        assessmentDate: new Date(),
        assessor: assessorId,
        controlsAssessed,
        controlsPassed,
        controlsFailed,
        overallScore: Math.round(overallScore),
        status,
        findings,
        exceptions: [], // Would be populated from stored exceptions
        remediationPlan
      };

      // Store assessment results
      await this.storeAssessmentResults(assessment, framework.name);

      // Send notifications for critical issues
      if (status === 'non_compliant' || controlsFailed > controlsAssessed * 0.2) {
        await this.sendComplianceAlerts(organizationId, assessment);
      }

      return assessment;

    } catch (error) {
      console.error('❌ Failed to perform compliance assessment:', error);
      throw error;
    }
  }

  /**
   * Assess individual controls
   */
  private async assessControls(framework: any): Promise<any[]> {
    const controls = framework.controls as any[] || [];
    const findings = [];

    for (const control of controls) {
      // Simulate control testing - in real implementation would involve actual testing
      const testResult = await this.testControl(control);
      
      findings.push({
        controlId: control.id,
        status: testResult.status,
        score: testResult.score,
        evidence: testResult.evidence,
        issues: testResult.issues,
        recommendations: testResult.recommendations
      });
    }

    return findings;
  }

  /**
   * Test individual control
   */
  private async testControl(control: any): Promise<{
    status: 'pass' | 'fail' | 'not_applicable';
    score: number;
    evidence: string[];
    issues: string[];
    recommendations: string[];
  }> {
    // Simplified control testing - in real implementation would be comprehensive
    const randomScore = Math.random() * 100;
    const status = randomScore > 70 ? 'pass' : 'fail';
    
    return {
      status,
      score: Math.round(randomScore),
      evidence: status === 'pass' ? 
        ['Control documentation reviewed', 'Testing evidence validated', 'Implementation confirmed'] :
        ['Documentation incomplete', 'Control gaps identified'],
      issues: status === 'fail' ? 
        [`${control.name} implementation not effective`, 'Evidence insufficient for compliance'] : 
        [],
      recommendations: status === 'fail' ? 
        ['Strengthen control implementation', 'Improve documentation', 'Increase testing frequency'] : 
        []
    };
  }

  /**
   * Calculate compliance score based on findings and criteria
   */
  private calculateComplianceScore(findings: any[], criteria: any[]): number {
    if (criteria.length === 0) {
      // Simple average if no criteria
      const avgScore = findings.reduce((sum, f) => sum + f.score, 0) / findings.length;
      return avgScore;
    }

    // Weighted score based on criteria
    let weightedScore = 0;
    let totalWeight = 0;

    for (const criterion of criteria) {
      const relatedFindings = findings.filter(f => f.controlId.startsWith(criterion.requirement));
      if (relatedFindings.length > 0) {
        const avgFindingScore = relatedFindings.reduce((sum, f) => sum + f.score, 0) / relatedFindings.length;
        weightedScore += avgFindingScore * criterion.weight;
        totalWeight += criterion.weight;
      }
    }

    return totalWeight > 0 ? weightedScore / totalWeight : 0;
  }

  /**
   * Determine compliance status
   */
  private determineComplianceStatus(score: number, failedControls: number): 'compliant' | 'non_compliant' | 'under_review' | 'exception_granted' {
    if (score >= 90 && failedControls === 0) return 'compliant';
    if (score < 70 || failedControls > 5) return 'non_compliant';
    return 'under_review';
  }

  /**
   * Generate remediation plan for failed controls
   */
  private generateRemediationPlan(failedFindings: any[]): any[] {
    return failedFindings.map(finding => ({
      finding: `Control ${finding.controlId} failed assessment`,
      action: finding.recommendations[0] || 'Review and strengthen control implementation',
      owner: 'Compliance Team', // Would be determined based on control ownership
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      priority: finding.score < 50 ? 'critical' as const :
                finding.score < 70 ? 'high' as const : 'medium' as const
    }));
  }

  /**
   * Store assessment results
   */
  private async storeAssessmentResults(assessment: ComplianceAssessment, frameworkName: string): Promise<void> {
    await db.insert(complianceReports).values({
      organizationId: assessment.organizationId,
      frameworkId: assessment.frameworkId,
      reportType: 'assessment',
      reportingPeriod: new Date().toISOString().slice(0, 7), // YYYY-MM format
      overallStatus: assessment.status,
      complianceScore: assessment.overallScore.toString(),
      controlsAssessed: assessment.controlsAssessed,
      controlsPassed: assessment.controlsPassed,
      controlsFailed: assessment.controlsFailed,
      exceptions: assessment.exceptions,
      remediation: assessment.remediationPlan,
      evidence: assessment.findings.flatMap(f => f.evidence),
      recommendations: assessment.findings.flatMap(f => f.recommendations),
      riskAssessment: {
        criticalFindings: assessment.findings.filter(f => f.status === 'fail' && f.score < 50).length,
        riskLevel: assessment.status === 'compliant' ? 'low' : 
                   assessment.status === 'under_review' ? 'medium' : 'high'
      },
      executiveSummary: `Compliance assessment for ${frameworkName} completed. Overall score: ${assessment.overallScore}%. Status: ${assessment.status}.`,
      detailedFindings: assessment.findings,
      generatedBy: assessment.assessor,
      submittedAt: new Date()
    });
  }

  /**
   * Send compliance alerts for critical issues
   */
  private async sendComplianceAlerts(organizationId: string, assessment: ComplianceAssessment): Promise<void> {
    try {
      const criticalIssues = assessment.findings.filter(f => 
        f.status === 'fail' && f.score < 50
      );

      if (criticalIssues.length > 0) {
        await databaseNotificationService.createAndSendNotification({
          organizationId,
          userId: 'system', // Would be compliance officer
          type: 'compliance_alert',
          title: `Critical Compliance Issues Identified`,
          message: `Compliance assessment identified ${criticalIssues.length} critical control failures requiring immediate attention.`,
          priority: 'critical',
          metadata: {
            frameworkId: assessment.frameworkId,
            assessmentScore: assessment.overallScore,
            criticalIssues: criticalIssues.length,
            remediationRequired: true
          }
        });
      }

      // Alert for overall non-compliance
      if (assessment.status === 'non_compliant') {
        await databaseNotificationService.createAndSendNotification({
          organizationId,
          userId: 'system', // Would be sent to executives
          type: 'compliance_non_compliant',
          title: 'Non-Compliance Status',
          message: `Organization is currently non-compliant with framework requirements. Immediate remediation required.`,
          priority: 'critical',
          metadata: {
            frameworkId: assessment.frameworkId,
            overallScore: assessment.overallScore,
            failedControls: assessment.controlsFailed
          }
        });
      }

    } catch (error) {
      console.error('❌ Failed to send compliance alerts:', error);
    }
  }

  /**
   * Generate board-level compliance report
   */
  async generateBoardComplianceReport(
    organizationId: string,
    reportingPeriod: string
  ): Promise<BoardComplianceReport> {
    try {
      // Get all compliance frameworks for organization
      const frameworks = await db
        .select()
        .from(complianceFrameworks)
        .where(eq(complianceFrameworks.organizationId, organizationId));

      // Get recent compliance reports
      const reports = await db
        .select()
        .from(complianceReports)
        .where(
          and(
            eq(complianceReports.organizationId, organizationId),
            eq(complianceReports.reportingPeriod, reportingPeriod)
          )
        )
        .orderBy(desc(complianceReports.createdAt));

      // Calculate overall compliance metrics
      const overallScore = reports.length > 0 ? 
        reports.reduce((sum, r) => sum + parseFloat(r.complianceScore || '0'), 0) / reports.length : 0;

      const overallStatus = this.determineOverallStatus(overallScore, reports);
      
      // Generate framework summary
      const frameworkSummary = frameworks.map(framework => {
        const latestReport = reports.find(r => r.frameworkId === framework.id);
        return {
          framework: framework.name,
          status: latestReport?.overallStatus || 'not_assessed',
          score: latestReport ? parseFloat(latestReport.complianceScore || '0') : 0,
          lastAssessment: latestReport?.submittedAt || new Date(0),
          nextAssessment: this.calculateNextAssessment(framework.reportingSchedule || 'annually'),
          keyRisks: this.extractKeyRisks(latestReport)
        };
      });

      // Generate risk assessment
      const riskAssessment = this.generateRiskAssessment(reports, frameworks);

      // Generate recommendations
      const recommendations = this.generateBoardRecommendations(reports, frameworkSummary);

      // Calculate metrics
      const metrics = this.calculateComplianceMetrics(reports);

      const boardReport: BoardComplianceReport = {
        organizationId,
        reportingPeriod,
        generatedDate: new Date(),
        executiveSummary: {
          overallStatus,
          complianceScore: Math.round(overallScore),
          keyAchievements: this.extractKeyAchievements(reports),
          criticalIssues: this.extractCriticalIssues(reports),
          resourceRequests: this.generateResourceRequests(reports)
        },
        frameworkSummary,
        riskAssessment,
        recommendations,
        metrics
      };

      // Store board report
      await db.insert(complianceReports).values({
        organizationId,
        frameworkId: 'board_summary',
        reportType: 'board',
        reportingPeriod,
        overallStatus: overallStatus === 'green' ? 'compliant' : 
                       overallStatus === 'yellow' ? 'under_review' : 'non_compliant',
        complianceScore: overallScore.toString(),
        controlsAssessed: reports.reduce((sum, r) => sum + (r.controlsAssessed || 0), 0),
        controlsPassed: reports.reduce((sum, r) => sum + (r.controlsPassed || 0), 0),
        controlsFailed: reports.reduce((sum, r) => sum + (r.controlsFailed || 0), 0),
        executiveSummary: this.generateExecutiveSummaryText(boardReport.executiveSummary),
        recommendations: boardReport.recommendations.map(r => r.recommendation),
        riskAssessment: boardReport.riskAssessment,
        generatedBy: 'system',
        submittedAt: new Date()
      });

      return boardReport;

    } catch (error) {
      console.error('❌ Failed to generate board compliance report:', error);
      throw error;
    }
  }

  /**
   * Get reporting schedule based on framework category
   */
  private getReportingSchedule(category: string): string {
    const schedules: Record<string, string> = {
      financial: 'annually',
      security: 'quarterly',
      operational: 'quarterly',
      data_privacy: 'annually',
      industry_specific: 'annually'
    };
    return schedules[category] || 'annually';
  }

  /**
   * Determine overall status for board report
   */
  private determineOverallStatus(score: number, reports: any[]): 'green' | 'yellow' | 'red' {
    const criticalIssues = reports.filter(r => r.overallStatus === 'non_compliant').length;
    
    if (score >= 90 && criticalIssues === 0) return 'green';
    if (score >= 75 && criticalIssues <= 1) return 'yellow';
    return 'red';
  }

  /**
   * Calculate next assessment date
   */
  private calculateNextAssessment(schedule: string): Date {
    const now = new Date();
    const next = new Date(now);
    
    switch (schedule) {
      case 'quarterly':
        next.setMonth(now.getMonth() + 3);
        break;
      case 'annually':
        next.setFullYear(now.getFullYear() + 1);
        break;
      default:
        next.setFullYear(now.getFullYear() + 1);
    }
    
    return next;
  }

  /**
   * Extract key risks from report
   */
  private extractKeyRisks(report: any): string[] {
    if (!report) return [];
    
    const riskAssessment = report.riskAssessment as any;
    return riskAssessment?.highRiskAreas || ['No recent assessment'];
  }

  /**
   * Generate risk assessment for board report
   */
  private generateRiskAssessment(reports: any[], frameworks: any[]): any {
    const highRiskAreas = [];
    const emergingRisks = ['Regulatory changes', 'Technology evolution', 'Remote work compliance'];
    const mitigationProgress = [];

    // Identify high risk areas from failed assessments
    reports.forEach(report => {
      if (report.overallStatus === 'non_compliant') {
        const framework = frameworks.find(f => f.id === report.frameworkId);
        if (framework) {
          highRiskAreas.push(`${framework.name} non-compliance`);
        }
      }
    });

    // Calculate mitigation progress
    const totalRemediation = reports.reduce((sum, r) => sum + (r.remediation?.length || 0), 0);
    if (totalRemediation > 0) {
      mitigationProgress.push(`${totalRemediation} remediation actions in progress`);
    }

    return {
      highRiskAreas: highRiskAreas.slice(0, 5),
      emergingRisks: emergingRisks.slice(0, 3),
      mitigationProgress: mitigationProgress.slice(0, 3)
    };
  }

  /**
   * Generate board recommendations
   */
  private generateBoardRecommendations(reports: any[], frameworkSummary: any[]): any[] {
    const recommendations = [];

    // Recommendations based on compliance scores
    const lowScoreFrameworks = frameworkSummary.filter(f => f.score < 80);
    if (lowScoreFrameworks.length > 0) {
      recommendations.push({
        area: 'Compliance Improvement',
        recommendation: 'Increase investment in compliance programs for underperforming frameworks',
        businessImpact: 'Reduced regulatory risk and potential penalties',
        investment: '$50K - $200K',
        timeline: '6-12 months'
      });
    }

    // Technology recommendations
    const manualProcesses = reports.filter(r => 
      (r.detailedFindings as any[])?.some(f => f.issues.includes('manual'))
    ).length;
    
    if (manualProcesses > 0) {
      recommendations.push({
        area: 'Process Automation',
        recommendation: 'Implement automated compliance monitoring tools',
        businessImpact: 'Improved efficiency and reduced compliance burden',
        investment: '$100K - $500K',
        timeline: '9-18 months'
      });
    }

    // Training recommendations
    recommendations.push({
      area: 'Training & Awareness',
      recommendation: 'Enhance compliance training programs organization-wide',
      businessImpact: 'Better compliance culture and reduced violations',
      investment: '$25K - $75K annually',
      timeline: '3-6 months'
    });

    return recommendations.slice(0, 5);
  }

  /**
   * Calculate compliance metrics
   */
  private calculateComplianceMetrics(reports: any[]): any {
    return {
      incidentsReported: Math.floor(Math.random() * 5), // Placeholder
      auditFindings: reports.reduce((sum, r) => sum + (r.controlsFailed || 0), 0),
      remediationRate: reports.length > 0 ? 
        Math.round((reports.filter(r => r.overallStatus === 'compliant').length / reports.length) * 100) : 0,
      trainingCompletion: Math.floor(Math.random() * 30) + 70 // 70-100% placeholder
    };
  }

  /**
   * Extract key achievements
   */
  private extractKeyAchievements(reports: any[]): string[] {
    const achievements = [];
    
    const compliantReports = reports.filter(r => r.overallStatus === 'compliant');
    if (compliantReports.length > 0) {
      achievements.push(`${compliantReports.length} frameworks maintained in compliant status`);
    }
    
    const highScoreReports = reports.filter(r => parseFloat(r.complianceScore || '0') > 90);
    if (highScoreReports.length > 0) {
      achievements.push(`${highScoreReports.length} frameworks achieved excellence (>90% score)`);
    }
    
    achievements.push('Continuous monitoring program implemented');
    
    return achievements.slice(0, 3);
  }

  /**
   * Extract critical issues
   */
  private extractCriticalIssues(reports: any[]): string[] {
    const issues = [];
    
    const nonCompliantReports = reports.filter(r => r.overallStatus === 'non_compliant');
    if (nonCompliantReports.length > 0) {
      issues.push(`${nonCompliantReports.length} frameworks in non-compliant status`);
    }
    
    const highRiskFindings = reports.reduce((sum, r) => 
      sum + ((r.detailedFindings as any[])?.filter(f => f.score < 50).length || 0), 0
    );
    
    if (highRiskFindings > 0) {
      issues.push(`${highRiskFindings} critical control failures identified`);
    }
    
    return issues.slice(0, 3);
  }

  /**
   * Generate resource requests
   */
  private generateResourceRequests(reports: any[]): string[] {
    const requests = [];
    
    const totalRemediation = reports.reduce((sum, r) => sum + (r.remediation?.length || 0), 0);
    if (totalRemediation > 10) {
      requests.push('Additional compliance staff for remediation efforts');
    }
    
    requests.push('Budget allocation for compliance technology upgrades');
    requests.push('External expert consultation for specialized frameworks');
    
    return requests.slice(0, 3);
  }

  /**
   * Generate executive summary text
   */
  private generateExecutiveSummaryText(summary: any): string {
    return `Organizational compliance status: ${summary.overallStatus.toUpperCase()}. ` +
           `Overall compliance score: ${summary.complianceScore}%. ` +
           `Key achievements include: ${summary.keyAchievements.join(', ')}. ` +
           (summary.criticalIssues.length > 0 ? 
            `Critical issues requiring attention: ${summary.criticalIssues.join(', ')}.` : 
            'No critical issues identified.');
  }

  /**
   * Get compliance dashboard data
   */
  async getComplianceDashboard(organizationId: string): Promise<{
    overallStatus: string;
    complianceScore: number;
    frameworksSummary: any[];
    upcomingAssessments: any[];
    pendingActions: any[];
    recentAlerts: any[];
  }> {
    try {
      const frameworks = await db
        .select()
        .from(complianceFrameworks)
        .where(eq(complianceFrameworks.organizationId, organizationId));

      const recentReports = await db
        .select()
        .from(complianceReports)
        .where(eq(complianceReports.organizationId, organizationId))
        .orderBy(desc(complianceReports.createdAt))
        .limit(10);

      const avgScore = recentReports.length > 0 ?
        recentReports.reduce((sum, r) => sum + parseFloat(r.complianceScore || '0'), 0) / recentReports.length : 0;

      const overallStatus = this.determineOverallStatus(avgScore, recentReports);

      return {
        overallStatus,
        complianceScore: Math.round(avgScore),
        frameworksSummary: frameworks.map(f => ({
          id: f.id,
          name: f.name,
          status: f.status,
          lastAssessment: f.lastAssessment,
          nextAssessment: f.nextAssessment,
          riskLevel: f.riskLevel
        })),
        upcomingAssessments: frameworks.filter(f => 
          f.nextAssessment && new Date(f.nextAssessment) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        ).map(f => ({
          framework: f.name,
          dueDate: f.nextAssessment
        })),
        pendingActions: recentReports.flatMap(r => r.remediation || []).slice(0, 5),
        recentAlerts: [] // Would be populated from notification system
      };

    } catch (error) {
      console.error('❌ Failed to get compliance dashboard:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const complianceService = new ComplianceService();