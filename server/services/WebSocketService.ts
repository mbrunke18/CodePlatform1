import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { collaborationService } from '../collaboration-service';

interface AcknowledgmentData {
  stakeholderId: string;
  stakeholderName: string;
  acknowledgedAt: Date;
  responseTimeMinutes: number;
}

interface CoordinationCompleteMetrics {
  coordinationTimeMinutes: number;
  acknowledgedCount: number;
  totalStakeholders: number;
  acknowledgmentRate: number;
}

interface TaskUpdateData {
  taskId: string;
  status: string;
  completedAt?: Date;
}

interface UserConnection {
  socket: Socket;
  userId?: string;
  organizationId?: string;
}

class WebSocketService {
  private io: SocketIOServer | null = null;
  private userConnections: Map<string, UserConnection> = new Map();

  initialize(httpServer: HTTPServer): void {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      path: '/socket.io/',
    });

    this.io.on('connection', (socket) => {
      console.log(`✓ WebSocket client connected: ${socket.id}`);
      this.userConnections.set(socket.id, { socket });

      socket.on('join-execution', (executionInstanceId: string) => {
        socket.join(`execution-${executionInstanceId}`);
        console.log(`Client ${socket.id} joined execution-${executionInstanceId}`);
        socket.emit('execution-joined', { executionInstanceId });
      });

      socket.on('leave-execution', (executionInstanceId: string) => {
        socket.leave(`execution-${executionInstanceId}`);
        console.log(`Client ${socket.id} left execution-${executionInstanceId}`);
      });

      socket.on('identify', (data: { userId: string; organizationId?: string }) => {
        const conn = this.userConnections.get(socket.id);
        if (conn) {
          conn.userId = data.userId;
          conn.organizationId = data.organizationId;
          if (data.organizationId) {
            socket.join(`org-${data.organizationId}`);
          }
          socket.join(`user-${data.userId}`);
          console.log(`Client ${socket.id} identified as user ${data.userId}`);
        }
      });

      socket.on('disconnect', () => {
        this.userConnections.delete(socket.id);
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    collaborationService.setupSocketIOHandlers(this.io);

    console.log('✓ Unified WebSocket server initialized (Socket.IO)');
  }

  getIO(): SocketIOServer | null {
    return this.io;
  }

  /**
   * Broadcast stakeholder acknowledgment to all clients watching this execution
   */
  broadcastAcknowledgment(
    executionInstanceId: string,
    data: AcknowledgmentData
  ): void {
    if (!this.io) {
      console.warn('WebSocket not initialized, cannot broadcast acknowledgment');
      return;
    }

    const room = `execution-${executionInstanceId}`;
    this.io.to(room).emit('stakeholder-acknowledged', {
      ...data,
      timestamp: new Date().toISOString(),
    });

    console.log(`📡 Broadcast acknowledgment to ${room}:`, data.stakeholderName);
  }

  /**
   * Broadcast coordination completion to all clients watching this execution
   */
  broadcastCoordinationComplete(
    executionInstanceId: string,
    metrics: CoordinationCompleteMetrics
  ): void {
    if (!this.io) {
      console.warn('WebSocket not initialized, cannot broadcast completion');
      return;
    }

    const room = `execution-${executionInstanceId}`;
    this.io.to(room).emit('coordination-complete', {
      ...metrics,
      timestamp: new Date().toISOString(),
      executionInstanceId,
    });

    console.log(`🎉 Broadcast coordination complete to ${room}`);
  }

  /**
   * Broadcast task update to all clients watching this execution
   */
  broadcastTaskUpdate(executionInstanceId: string, task: TaskUpdateData): void {
    if (!this.io) {
      console.warn('WebSocket not initialized, cannot broadcast task update');
      return;
    }

    const room = `execution-${executionInstanceId}`;
    this.io.to(room).emit('task-updated', {
      ...task,
      timestamp: new Date().toISOString(),
    });

    console.log(`📋 Broadcast task update to ${room}:`, task.taskId);
  }

  /**
   * Broadcast notification sent event
   */
  broadcastNotificationSent(
    executionInstanceId: string,
    notification: { id: string; recipientId: string; sentAt: Date }
  ): void {
    if (!this.io) {
      console.warn('WebSocket not initialized, cannot broadcast notification');
      return;
    }

    const room = `execution-${executionInstanceId}`;
    this.io.to(room).emit('notification-sent', {
      ...notification,
      timestamp: new Date().toISOString(),
    });

    console.log(`📬 Broadcast notification sent to ${room}`);
  }

  /**
   * Get connection status
   */
  isInitialized(): boolean {
    return this.io !== null;
  }

  /**
   * Send message to a specific user
   */
  sendToUser(userId: string, event: string, data: any): void {
    if (!this.io) return;
    this.io.to(`user-${userId}`).emit(event, data);
  }

  /**
   * Send message to all users in an organization
   */
  sendToOrganization(organizationId: string, event: string, data: any): void {
    if (!this.io) return;
    this.io.to(`org-${organizationId}`).emit(event, data);
  }

  /**
   * Broadcast message to all connected clients
   */
  broadcast(event: string, data: any): void {
    if (!this.io) return;
    this.io.emit(event, data);
  }

  /**
   * Get connected client count
   */
  getConnectedCount(): number {
    return this.userConnections.size;
  }

  /**
   * Broadcast sync status update to clients watching an execution
   */
  broadcastSyncStatus(
    executionInstanceId: string,
    data: {
      syncId: string;
      platform: string;
      status: 'pending' | 'syncing' | 'synced' | 'failed';
      progress?: number;
      tasksSynced?: number;
      totalTasks?: number;
      errorMessage?: string;
    }
  ): void {
    if (!this.io) {
      console.warn('WebSocket not initialized, cannot broadcast sync status');
      return;
    }

    const room = `execution-${executionInstanceId}`;
    this.io.to(room).emit('sync-status-update', {
      ...data,
      executionInstanceId,
      timestamp: new Date().toISOString(),
    });

    console.log(`🔄 Broadcast sync status to ${room}: ${data.platform} - ${data.status}`);
  }

  /**
   * Broadcast sync completion event
   */
  broadcastSyncComplete(
    executionInstanceId: string,
    data: {
      syncId: string;
      platform: string;
      externalProjectId?: string;
      externalProjectUrl?: string;
      tasksSynced: number;
      syncDurationSeconds: number;
    }
  ): void {
    if (!this.io) {
      console.warn('WebSocket not initialized, cannot broadcast sync complete');
      return;
    }

    const room = `execution-${executionInstanceId}`;
    this.io.to(room).emit('sync-complete', {
      ...data,
      executionInstanceId,
      timestamp: new Date().toISOString(),
    });

    console.log(`✅ Broadcast sync complete to ${room}: ${data.platform} (${data.tasksSynced} tasks)`);
  }

  /**
   * Broadcast sync error event
   */
  broadcastSyncError(
    executionInstanceId: string,
    data: {
      syncId: string;
      platform: string;
      errorMessage: string;
      errorCode?: string;
      retryable: boolean;
    }
  ): void {
    if (!this.io) {
      console.warn('WebSocket not initialized, cannot broadcast sync error');
      return;
    }

    const room = `execution-${executionInstanceId}`;
    this.io.to(room).emit('sync-error', {
      ...data,
      executionInstanceId,
      timestamp: new Date().toISOString(),
    });

    console.log(`❌ Broadcast sync error to ${room}: ${data.platform} - ${data.errorMessage}`);
  }

  /**
   * Broadcast document generation status
   */
  broadcastDocumentGenerated(
    executionInstanceId: string,
    data: {
      documentId: string;
      documentType: string;
      documentName: string;
    }
  ): void {
    if (!this.io) {
      console.warn('WebSocket not initialized, cannot broadcast document event');
      return;
    }

    const room = `execution-${executionInstanceId}`;
    this.io.to(room).emit('document-generated', {
      ...data,
      executionInstanceId,
      timestamp: new Date().toISOString(),
    });

    console.log(`📄 Broadcast document generated to ${room}: ${data.documentName}`);
  }

  /**
   * Broadcast resource activation event
   */
  broadcastResourceActivated(
    organizationId: string,
    data: {
      resourceId: string;
      resourceType: string;
      resourceName: string;
      allocatedAmount: number;
    }
  ): void {
    if (!this.io) {
      console.warn('WebSocket not initialized, cannot broadcast resource activation');
      return;
    }

    this.io.to(`org-${organizationId}`).emit('resource-activated', {
      ...data,
      organizationId,
      timestamp: new Date().toISOString(),
    });

    console.log(`⚡ Broadcast resource activated to org-${organizationId}: ${data.resourceName}`);
  }
}

export const wsService = new WebSocketService();
