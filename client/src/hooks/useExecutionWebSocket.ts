import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface AcknowledgmentEvent {
  stakeholderId: string;
  stakeholderName: string;
  acknowledgedAt: Date;
  responseTimeMinutes: number;
  timestamp: string;
}

export interface CoordinationCompleteEvent {
  coordinationTimeMinutes: number;
  acknowledgedCount: number;
  totalStakeholders: number;
  acknowledgmentRate: number;
  timestamp: string;
  executionInstanceId: string;
}

export interface TaskUpdateEvent {
  taskId: string;
  status: string;
  completedAt?: Date;
  timestamp: string;
}

export interface NotificationSentEvent {
  id: string;
  recipientId: string;
  sentAt: Date;
  timestamp: string;
}

export interface UseExecutionWebSocketReturn {
  socket: Socket | null;
  acknowledgments: AcknowledgmentEvent[];
  isComplete: boolean;
  metrics: CoordinationCompleteEvent | null;
  taskUpdates: TaskUpdateEvent[];
  notificationsSent: NotificationSentEvent[];
  isConnected: boolean;
  error: string | null;
}

/**
 * Custom hook for real-time execution tracking via WebSocket
 * Connects to Socket.IO server and listens for execution events
 */
export function useExecutionWebSocket(
  executionInstanceId: string | undefined
): UseExecutionWebSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [acknowledgments, setAcknowledgments] = useState<AcknowledgmentEvent[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [metrics, setMetrics] = useState<CoordinationCompleteEvent | null>(null);
  const [taskUpdates, setTaskUpdates] = useState<TaskUpdateEvent[]>([]);
  const [notificationsSent, setNotificationsSent] = useState<NotificationSentEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!executionInstanceId) {
      return;
    }

    console.log(`🔌 Connecting to WebSocket for execution: ${executionInstanceId}`);

    // Create Socket.IO connection
    const socketInstance = io(window.location.origin, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('✓ WebSocket connected:', socketInstance.id);
      setIsConnected(true);
      setError(null);

      // Join the execution room
      socketInstance.emit('join-execution', executionInstanceId);
    });

    socketInstance.on('execution-joined', (data: { executionInstanceId: string }) => {
      console.log(`✓ Joined execution room: ${data.executionInstanceId}`);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err.message);
      setError(`Connection error: ${err.message}`);
      setIsConnected(false);
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log(`WebSocket reconnected after ${attemptNumber} attempts`);
      setError(null);
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed');
      setError('Failed to reconnect to server');
    });

    // Execution event handlers
    socketInstance.on('stakeholder-acknowledged', (data: AcknowledgmentEvent) => {
      console.log('📬 Stakeholder acknowledged:', data.stakeholderName);
      setAcknowledgments((prev) => [...prev, data]);
    });

    socketInstance.on('coordination-complete', (data: CoordinationCompleteEvent) => {
      console.log('🎉 Coordination complete:', data);
      setIsComplete(true);
      setMetrics(data);
    });

    socketInstance.on('task-updated', (data: TaskUpdateEvent) => {
      console.log('📋 Task updated:', data);
      setTaskUpdates((prev) => [...prev, data]);
    });

    socketInstance.on('notification-sent', (data: NotificationSentEvent) => {
      console.log('📤 Notification sent:', data);
      setNotificationsSent((prev) => [...prev, data]);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      console.log(`🔌 Disconnecting from execution: ${executionInstanceId}`);
      socketInstance.emit('leave-execution', executionInstanceId);
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [executionInstanceId]);

  return {
    socket,
    acknowledgments,
    isComplete,
    metrics,
    taskUpdates,
    notificationsSent,
    isConnected,
    error,
  };
}
