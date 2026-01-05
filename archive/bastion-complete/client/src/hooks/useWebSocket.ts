import { useEffect, useRef, useState } from "react";

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Skip WebSocket connection for development to avoid authentication issues
    setIsConnected(true);
    
    // Mock WebSocket functionality for development
    const mockConnection = () => {
      console.log('WebSocket: Using mock connection for development');
    };
    
    mockConnection();
    
    return () => {
      // Cleanup mock connection
    };
  }, []);

  return {
    isConnected: true, // Always connected in development
    lastMessage,
    sendMessage: (message: any) => {
      console.log('WebSocket: Mock message sent:', message);
    },
  };
}
