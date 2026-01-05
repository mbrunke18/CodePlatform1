import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';

interface SyncStatusUpdate {
  syncId: string;
  platform: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  progress?: number;
  tasksSynced?: number;
  totalTasks?: number;
  errorMessage?: string;
  executionInstanceId: string;
  timestamp: string;
}

interface SyncComplete {
  syncId: string;
  platform: string;
  externalProjectId?: string;
  externalProjectUrl?: string;
  tasksSynced: number;
  syncDurationSeconds: number;
  executionInstanceId: string;
  timestamp: string;
}

interface SyncError {
  syncId: string;
  platform: string;
  errorMessage: string;
  errorCode?: string;
  retryable: boolean;
  executionInstanceId: string;
  timestamp: string;
}

interface DocumentGenerated {
  documentId: string;
  documentType: string;
  documentName: string;
  executionInstanceId: string;
  timestamp: string;
}

interface ResourceActivated {
  resourceId: string;
  resourceType: string;
  resourceName: string;
  allocatedAmount: number;
  organizationId: string;
  timestamp: string;
}

interface UseSyncWebSocketOptions {
  executionInstanceId?: string;
  organizationId?: string;
  userId?: string;
  showToasts?: boolean;
  onSyncStatus?: (data: SyncStatusUpdate) => void;
  onSyncComplete?: (data: SyncComplete) => void;
  onSyncError?: (data: SyncError) => void;
  onDocumentGenerated?: (data: DocumentGenerated) => void;
  onResourceActivated?: (data: ResourceActivated) => void;
}

interface SyncState {
  isConnected: boolean;
  activeSyncs: Map<string, SyncStatusUpdate>;
  recentEvents: Array<SyncStatusUpdate | SyncComplete | SyncError>;
}

export function useSyncWebSocket(options: UseSyncWebSocketOptions) {
  const { toast } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<SyncState>({
    isConnected: false,
    activeSyncs: new Map(),
    recentEvents: [],
  });
  
  const {
    executionInstanceId,
    organizationId,
    userId,
    showToasts = true,
    onSyncStatus,
    onSyncComplete,
    onSyncError,
    onDocumentGenerated,
    onResourceActivated,
  } = options;
  
  const addEvent = useCallback((event: SyncStatusUpdate | SyncComplete | SyncError) => {
    setState((prev) => ({
      ...prev,
      recentEvents: [event, ...prev.recentEvents.slice(0, 49)],
    }));
  }, []);
  
  useEffect(() => {
    const newSocket = io(window.location.origin, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
    });
    
    newSocket.on('connect', () => {
      console.log('Sync WebSocket connected');
      setState((prev) => ({ ...prev, isConnected: true }));
      
      if (userId) {
        newSocket.emit('identify', { userId, organizationId });
      }
      
      if (executionInstanceId) {
        newSocket.emit('join-execution', executionInstanceId);
      }
    });
    
    newSocket.on('disconnect', () => {
      console.log('Sync WebSocket disconnected');
      setState((prev) => ({ ...prev, isConnected: false }));
    });
    
    newSocket.on('sync-status-update', (data: SyncStatusUpdate) => {
      console.log('Sync status update:', data);
      
      setState((prev) => {
        const newActiveSyncs = new Map(prev.activeSyncs);
        if (data.status === 'syncing' || data.status === 'pending') {
          newActiveSyncs.set(data.syncId, data);
        } else {
          newActiveSyncs.delete(data.syncId);
        }
        return { ...prev, activeSyncs: newActiveSyncs };
      });
      
      addEvent(data);
      onSyncStatus?.(data);
      
      if (showToasts && data.status === 'syncing' && data.progress === 0) {
        toast({
          title: 'Sync Started',
          description: `Syncing to ${data.platform}...`,
        });
      }
    });
    
    newSocket.on('sync-complete', (data: SyncComplete) => {
      console.log('Sync complete:', data);
      
      setState((prev) => {
        const newActiveSyncs = new Map(prev.activeSyncs);
        newActiveSyncs.delete(data.syncId);
        return { ...prev, activeSyncs: newActiveSyncs };
      });
      
      addEvent({ ...data, status: 'synced' } as any);
      onSyncComplete?.(data);
      
      if (showToasts) {
        toast({
          title: 'Sync Complete',
          description: `Successfully synced ${data.tasksSynced} tasks to ${data.platform} in ${data.syncDurationSeconds}s`,
        });
      }
    });
    
    newSocket.on('sync-error', (data: SyncError) => {
      console.log('Sync error:', data);
      
      setState((prev) => {
        const newActiveSyncs = new Map(prev.activeSyncs);
        newActiveSyncs.delete(data.syncId);
        return { ...prev, activeSyncs: newActiveSyncs };
      });
      
      addEvent({ ...data, status: 'failed' } as any);
      onSyncError?.(data);
      
      if (showToasts) {
        toast({
          title: 'Sync Failed',
          description: data.errorMessage,
          variant: 'destructive',
        });
      }
    });
    
    newSocket.on('document-generated', (data: DocumentGenerated) => {
      console.log('Document generated:', data);
      onDocumentGenerated?.(data);
      
      if (showToasts) {
        toast({
          title: 'Document Generated',
          description: `${data.documentName} is ready`,
        });
      }
    });
    
    newSocket.on('resource-activated', (data: ResourceActivated) => {
      console.log('Resource activated:', data);
      onResourceActivated?.(data);
      
      if (showToasts) {
        toast({
          title: 'Resource Activated',
          description: `${data.resourceName} is now available`,
        });
      }
    });
    
    setSocket(newSocket);
    
    return () => {
      if (executionInstanceId) {
        newSocket.emit('leave-execution', executionInstanceId);
      }
      newSocket.disconnect();
    };
  }, [executionInstanceId, organizationId, userId]);
  
  const joinExecution = useCallback((id: string) => {
    socket?.emit('join-execution', id);
  }, [socket]);
  
  const leaveExecution = useCallback((id: string) => {
    socket?.emit('leave-execution', id);
  }, [socket]);
  
  return {
    isConnected: state.isConnected,
    activeSyncs: Array.from(state.activeSyncs.values()),
    recentEvents: state.recentEvents,
    joinExecution,
    leaveExecution,
  };
}

export function useSyncStatus(executionInstanceId?: string) {
  const [syncs, setSyncs] = useState<SyncStatusUpdate[]>([]);
  
  const { activeSyncs, recentEvents, isConnected } = useSyncWebSocket({
    executionInstanceId,
    onSyncStatus: (data) => {
      setSyncs((prev) => {
        const existing = prev.findIndex((s) => s.syncId === data.syncId);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = data;
          return updated;
        }
        return [...prev, data];
      });
    },
    onSyncComplete: (data) => {
      setSyncs((prev) => prev.filter((s) => s.syncId !== data.syncId));
    },
    onSyncError: (data) => {
      setSyncs((prev) => prev.filter((s) => s.syncId !== data.syncId));
    },
  });
  
  return {
    isConnected,
    activeSyncs,
    syncHistory: recentEvents,
  };
}
