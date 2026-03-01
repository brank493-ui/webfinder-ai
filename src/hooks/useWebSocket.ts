// ==========================================
// WEBFINDER AI - WEBSOCKET CLIENT HOOK
// ==========================================

'use client';

import React, { useEffect, useRef, useCallback, useState, createContext, useContext, type ReactNode, type Context } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketOptions {
  token: string;
  onNotification?: (notification: Notification) => void;
  onMessage?: (message: Message) => void;
  onProjectUpdate?: (update: ProjectUpdate) => void;
  onPresenceUpdate?: (presence: PresenceUpdate) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

interface Message {
  id: string;
  workspaceId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  attachments?: string[];
  createdAt: Date;
}

interface ProjectUpdate {
  workspaceId: string;
  field: string;
  oldValue: unknown;
  newValue: unknown;
  updatedBy: string;
}

interface PresenceUpdate {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  timestamp: string;
}

export function useWebSocket({
  token,
  onNotification,
  onMessage,
  onProjectUpdate,
  onPresenceUpdate,
  onConnect,
  onDisconnect,
  onError,
}: UseWebSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');

  // Initialize socket connection
  useEffect(() => {
    if (!token) return;

    const socket = io({
      path: '/api/socket',
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      onConnect?.();
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      onDisconnect?.();
    });

    socket.on('connect_error', (error) => {
      setConnectionStatus('error');
      onError?.(error);
    });

    // Notification events
    socket.on('notification', (notification: Notification) => {
      onNotification?.(notification);
    });

    // Message events
    socket.on('message:new', (message: Message) => {
      onMessage?.(message);
    });

    // Project events
    socket.on('project:update', (update: ProjectUpdate) => {
      onProjectUpdate?.(update);
    });

    // Presence events
    socket.on('presence:update', (presence: PresenceUpdate) => {
      onPresenceUpdate?.(presence);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, onNotification, onMessage, onProjectUpdate, onPresenceUpdate, onConnect, onDisconnect, onError]);

  // Join workspace room
  const joinWorkspace = useCallback((workspaceId: string) => {
    socketRef.current?.emit('join:workspace', workspaceId);
  }, []);

  // Leave workspace room
  const leaveWorkspace = useCallback((workspaceId: string) => {
    socketRef.current?.emit('leave:workspace', workspaceId);
  }, []);

  // Join project room
  const joinProject = useCallback((projectId: string) => {
    socketRef.current?.emit('join:project', projectId);
  }, []);

  // Leave project room
  const leaveProject = useCallback((projectId: string) => {
    socketRef.current?.emit('leave:project', projectId);
  }, []);

  // Send typing indicator
  const sendTypingStart = useCallback((workspaceId: string, userName: string) => {
    socketRef.current?.emit('typing:start', { workspaceId, userName });
  }, []);

  const sendTypingStop = useCallback((workspaceId: string) => {
    socketRef.current?.emit('typing:stop', { workspaceId });
  }, []);

  // Mark message as read
  const markMessageRead = useCallback((messageId: string, workspaceId: string) => {
    socketRef.current?.emit('message:read', { messageId, workspaceId });
  }, []);

  // Update presence
  const updatePresence = useCallback((status: 'online' | 'away' | 'busy') => {
    socketRef.current?.emit('presence:update', status);
  }, []);

  return {
    isConnected,
    connectionStatus,
    joinWorkspace,
    leaveWorkspace,
    joinProject,
    leaveProject,
    sendTypingStart,
    sendTypingStop,
    markMessageRead,
    updatePresence,
  };
}

// ==========================================
// NOTIFICATION PROVIDER
// ==========================================

interface WebSocketContextType {
  isConnected: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  joinWorkspace: (workspaceId: string) => void;
  leaveWorkspace: (workspaceId: string) => void;
  sendTypingStart: (workspaceId: string, userName: string) => void;
  sendTypingStop: (workspaceId: string) => void;
  updatePresence: (status: 'online' | 'away' | 'busy') => void;
}

const WebSocketContext: Context<WebSocketContextType | null> = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({
  children,
  token,
}: {
  children: ReactNode;
  token: string;
}) {
  const websocket = useWebSocket({ token });

  const contextValue: WebSocketContextType = {
    isConnected: websocket.isConnected,
    connectionStatus: websocket.connectionStatus,
    joinWorkspace: websocket.joinWorkspace,
    leaveWorkspace: websocket.leaveWorkspace,
    sendTypingStart: websocket.sendTypingStart,
    sendTypingStop: websocket.sendTypingStop,
    updatePresence: websocket.updatePresence,
  };

  return React.createElement(
    WebSocketContext.Provider,
    { value: contextValue },
    children
  );
}

export function useWebSocketContext(): WebSocketContextType {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
}

export default useWebSocket;
