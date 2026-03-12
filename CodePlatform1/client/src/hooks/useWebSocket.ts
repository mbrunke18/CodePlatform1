import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface UseWebSocketOptions {
  userId?: string;
  organizationId?: string;
  autoConnect?: boolean;
}

interface WebSocketMessage {
  type: string;
  payload?: any;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { userId, organizationId, autoConnect = true } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  useEffect(() => {
    if (!autoConnect) return;

    const socket = io(window.location.origin, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
      console.log('✓ WebSocket connected:', socket.id);
      setIsConnected(true);

      if (userId) {
        socket.emit('identify', { userId, organizationId });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
      setIsConnected(false);
    });

    socket.onAny((event, data) => {
      const message = { type: event, payload: data };
      setLastMessage(message);
      
      const handlers = handlersRef.current.get(event);
      if (handlers) {
        handlers.forEach(handler => handler(data));
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [userId, organizationId, autoConnect]);

  const sendMessage = useCallback((event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('WebSocket not connected, message not sent:', event);
    }
  }, []);

  const subscribe = useCallback((event: string, handler: (data: any) => void) => {
    if (!handlersRef.current.has(event)) {
      handlersRef.current.set(event, new Set());
    }
    handlersRef.current.get(event)!.add(handler);

    return () => {
      handlersRef.current.get(event)?.delete(handler);
    };
  }, []);

  const joinRoom = useCallback((roomId: string, user: { id: string; username: string; role?: string }) => {
    sendMessage('collab:join_room', { 
      roomId, 
      user: { 
        ...user, 
        role: user.role || 'participant',
        joinedAt: new Date()
      } 
    });
  }, [sendMessage]);

  const leaveRoom = useCallback((roomId: string, userId: string) => {
    sendMessage('collab:leave_room', { roomId, userId });
  }, [sendMessage]);

  const createDecision = useCallback((roomId: string, decision: { title: string; description?: string; options: any[]; status: string; priority: string }) => {
    sendMessage('collab:create_decision', { roomId, decision });
  }, [sendMessage]);

  const castVote = useCallback((roomId: string, decisionId: string, vote: { userId: string; optionId: string; confidence: number; comment?: string }) => {
    sendMessage('collab:cast_vote', { roomId, decisionId, vote });
  }, [sendMessage]);

  const sendChatMessage = useCallback((roomId: string, userId: string, message: string) => {
    sendMessage('collab:chat_message', { roomId, userId, message });
  }, [sendMessage]);

  const joinExecution = useCallback((executionInstanceId: string) => {
    sendMessage('join-execution', executionInstanceId);
  }, [sendMessage]);

  const leaveExecution = useCallback((executionInstanceId: string) => {
    sendMessage('leave-execution', executionInstanceId);
  }, [sendMessage]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    subscribe,
    joinRoom,
    leaveRoom,
    createDecision,
    castVote,
    sendChatMessage,
    joinExecution,
    leaveExecution,
    socket: socketRef.current,
  };
}
