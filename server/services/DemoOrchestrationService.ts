import { wsService } from './WebSocketService.js';

/**
 * Demo Orchestration Service
 * Simulates playbook activation with accelerated timing for live customer demos
 * Does NOT create real database records - purely for demonstration
 */

interface DemoStakeholder {
  id: string;
  name: string;
  role: string;
  responseTime: number; // seconds after start
}

interface DemoActivation {
  executionId: string;
  startTime: Date;
  stakeholders: DemoStakeholder[];
  totalStakeholders: number;
  acknowledgedCount: number;
  isRunning: boolean;
  timeoutIds: NodeJS.Timeout[];
}

class DemoOrchestrationService {
  private activeDemo: DemoActivation | null = null;

  // Pre-defined demo stakeholders with realistic names and roles
  private readonly DEMO_STAKEHOLDERS: Omit<DemoStakeholder, 'id' | 'responseTime'>[] = [
    { name: 'Sarah Chen', role: 'Chief Financial Officer' },
    { name: 'Marcus Johnson', role: 'Chief Technology Officer' },
    { name: 'Elena Rodriguez', role: 'Chief Operating Officer' },
    { name: 'David Kim', role: 'Chief Information Security Officer' },
    { name: 'Jennifer Taylor', role: 'Chief Legal Officer' },
    { name: 'Michael Brown', role: 'Chief Marketing Officer' },
    { name: 'Lisa Wang', role: 'Chief Human Resources Officer' },
    { name: 'James Wilson', role: 'VP of Engineering' },
    { name: 'Amanda Garcia', role: 'VP of Sales' },
    { name: 'Robert Martinez', role: 'VP of Product' },
    { name: 'Emily Anderson', role: 'VP of Customer Success' },
    { name: 'Christopher Lee', role: 'VP of Finance' },
    { name: 'Jessica Thompson', role: 'VP of Operations' },
    { name: 'Daniel White', role: 'VP of Security' },
    { name: 'Michelle Harris', role: 'VP of Compliance' },
    { name: 'Kevin Clark', role: 'Director of IT' },
    { name: 'Ashley Lewis', role: 'Director of Risk Management' },
    { name: 'Brian Walker', role: 'Director of Communications' },
    { name: 'Nicole Hall', role: 'Director of Legal Affairs' },
    { name: 'Ryan Allen', role: 'Director of Business Development' },
    { name: 'Sophia Young', role: 'Director of Analytics' },
    { name: 'Justin King', role: 'Director of Infrastructure' },
    { name: 'Rachel Wright', role: 'Director of Strategy' },
    { name: 'Brandon Scott', role: 'Director of Supply Chain' },
    { name: 'Victoria Green', role: 'Director of Customer Experience' },
    { name: 'Gregory Adams', role: 'Director of Data Science' },
    { name: 'Samantha Baker', role: 'Director of Enterprise Systems' },
    { name: 'Patrick Nelson', role: 'Director of Security Operations' },
    { name: 'Laura Carter', role: 'Director of Quality Assurance' },
    { name: 'Timothy Mitchell', role: 'Director of Program Management' },
  ];

  /**
   * Start a demo activation with simulated stakeholder acknowledgments
   */
  async startDemoActivation(config: {
    stakeholderCount?: number;
    accelerated?: boolean;
    targetDuration?: number; // minutes
    stakeholderRoster?: Array<{ name: string; role: string }>; // Actual scenario stakeholders
  }): Promise<{ executionId: string; startTime: Date }> {
    // Stop any existing demo
    this.stopDemo();

    const executionId = `demo-${Date.now()}`;
    
    // Use provided stakeholder roster or fall back to demo stakeholders
    const stakeholderSource = config.stakeholderRoster || this.DEMO_STAKEHOLDERS;
    const stakeholderCount = Math.min(
      config.stakeholderCount || 30,
      stakeholderSource.length
    );

    // Calculate response times
    const targetDuration = config.targetDuration || 12; // 12 minutes default
    const maxResponseTime = targetDuration * 60; // Convert to seconds
    
    // Generate staggered response times
    // Goal: 80% threshold (24/30 stakeholders) reached around minute 11-12
    const stakeholders: DemoStakeholder[] = [];
    const targetCompletionTime = maxResponseTime * 0.95; // 95% of target duration
    const eightyPercentIndex = Math.floor(stakeholderCount * 0.80); // 24 for 30 stakeholders
    
    for (let i = 0; i < stakeholderCount; i++) {
      const baseStakeholder = stakeholderSource[i];
      
      let responseTime: number;
      
      if (i === 0) {
        // First acknowledgment: 30-60 seconds
        responseTime = 30 + Math.random() * 30;
      } else if (i < eightyPercentIndex) {
        // Acknowledgments 1-23: Cluster progressively toward completion time
        // Use quadratic distribution to cluster more near the end
        const progress = i / eightyPercentIndex;
        const curvedProgress = Math.pow(progress, 1.5); // Curve to cluster at end
        responseTime = 60 + (curvedProgress * (targetCompletionTime - 60)) + (Math.random() * 30);
      } else {
        // Remaining 20% after completion (will be cancelled but adds realism)
        responseTime = targetCompletionTime + (i - eightyPercentIndex) * 10;
      }

      stakeholders.push({
        id: `demo-stakeholder-${i + 1}`,
        name: baseStakeholder.name,
        role: baseStakeholder.role,
        responseTime: Math.floor(responseTime),
      });
    }

    // Sort by response time
    stakeholders.sort((a, b) => a.responseTime - b.responseTime);

    const startTime = new Date();

    this.activeDemo = {
      executionId,
      startTime,
      stakeholders,
      totalStakeholders: stakeholderCount,
      acknowledgedCount: 0,
      isRunning: true,
      timeoutIds: [],
    };

    // Schedule all acknowledgments
    this.scheduleAcknowledgments();

    console.log(`🎬 Demo activation started: ${executionId}`);
    console.log(`   Stakeholders: ${stakeholderCount}`);
    console.log(`   Target duration: ${targetDuration} minutes`);
    console.log(`   First acknowledgment in: ${stakeholders[0].responseTime}s`);

    return { executionId, startTime };
  }

  /**
   * Schedule simulated stakeholder acknowledgments
   */
  private scheduleAcknowledgments() {
    if (!this.activeDemo) return;

    const { executionId, stakeholders, startTime } = this.activeDemo;

    stakeholders.forEach((stakeholder, index) => {
      const timeoutId = setTimeout(() => {
        this.simulateAcknowledgment(stakeholder, index);
      }, stakeholder.responseTime * 1000);

      this.activeDemo!.timeoutIds.push(timeoutId);
    });
  }

  /**
   * Simulate a single stakeholder acknowledgment
   */
  private simulateAcknowledgment(stakeholder: DemoStakeholder, index: number) {
    if (!this.activeDemo || !this.activeDemo.isRunning) return;

    this.activeDemo.acknowledgedCount++;
    const acknowledgedCount = this.activeDemo.acknowledgedCount;
    const totalStakeholders = this.activeDemo.totalStakeholders;
    const coordinationProgress = acknowledgedCount / totalStakeholders;

    // Emit acknowledgment event with full data for demo dashboard
    if (wsService.isInitialized()) {
      const extendedData = {
        executionId: this.activeDemo.executionId,
        stakeholderId: stakeholder.id,
        stakeholderName: stakeholder.name,
        stakeholderRole: stakeholder.role,
        acknowledgedAt: new Date().toISOString(),
        responseTime: stakeholder.responseTime,
        coordinationProgress,
        totalStakeholders,
        acknowledgedCount,
      };
      // Emit to room with extended data
      const io = (wsService as any).io;
      if (io) {
        io.to(`execution-${this.activeDemo.executionId}`).emit('stakeholder-acknowledged', extendedData);
      }
    }

    console.log(`✅ [Demo] ${stakeholder.name} acknowledged (${acknowledgedCount}/${totalStakeholders})`);

    // Check if coordination is complete (80% threshold)
    if (coordinationProgress >= 0.80 && this.activeDemo.isRunning) {
      this.completeDemo();
    }
  }

  /**
   * Complete the demo coordination
   */
  private completeDemo() {
    if (!this.activeDemo) return;

    const { executionId, acknowledgedCount, totalStakeholders, startTime } = this.activeDemo;
    const completedAt = new Date();
    const duration = Math.floor((completedAt.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    const completionMetrics = {
      coordinationTimeMinutes: duration / 60,
      acknowledgedCount,
      totalStakeholders,
      acknowledgmentRate: acknowledgedCount / totalStakeholders,
    };

    // Broadcast completion
    wsService.broadcastCoordinationComplete(
      executionId,
      completionMetrics
    );

    // Also emit extended data for demo dashboard
    if (wsService.isInitialized()) {
      const extendedData = {
        executionId,
        completedAt: completedAt.toISOString(),
        coordinationProgress: acknowledgedCount / totalStakeholders,
        totalStakeholders,
        acknowledgedCount,
        duration,
        message: `Coordination threshold reached (80%)`,
      };
      const io = (wsService as any).io;
      if (io) {
        io.to(`execution-${executionId}`).emit('coordination-complete', extendedData);
      }
    }

    console.log(`🎉 [Demo] Coordination complete!`);
    console.log(`   Duration: ${minutes}:${seconds.toString().padStart(2, '0')}`);
    console.log(`   Acknowledged: ${acknowledgedCount}/${totalStakeholders} (${(completionMetrics.acknowledgmentRate * 100).toFixed(1)}%)`);

    this.activeDemo.isRunning = false;
  }

  /**
   * Stop the current demo and clean up
   */
  stopDemo() {
    if (!this.activeDemo) return;

    // Clear all scheduled timeouts
    this.activeDemo.timeoutIds.forEach(id => clearTimeout(id));
    this.activeDemo.isRunning = false;
    
    console.log(`🛑 Demo stopped: ${this.activeDemo.executionId}`);
    this.activeDemo = null;
  }

  /**
   * Get current demo status
   */
  getDemoStatus(): DemoActivation | null {
    return this.activeDemo;
  }

  /**
   * Check if a demo is currently running
   */
  isDemoRunning(): boolean {
    return this.activeDemo?.isRunning || false;
  }
}

export const demoOrchestrationService = new DemoOrchestrationService();
