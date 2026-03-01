// ==========================================
// WEBFINDER AI - WEBSOCKET CONFIGURATION
// ==========================================

import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyAccessToken, JWTPayload } from '../backend-utils';

// Extend Socket interface to include user data
interface AuthenticatedSocket extends Socket {
  data: {
    user: JWTPayload;
    userId: string;
  };
}

// Global Socket.IO server instance
let io: SocketIOServer | null = null;

// User connection mapping (userId -> Set of socketIds)
const userConnections = new Map<string, Set<string>>();

// Room-based connections (for workspaces, projects, etc.)
const roomMembers = new Map<string, Set<string>>();

/**
 * Initialize Socket.IO server
 */
export function initializeWebSocketServer(httpServer: HttpServer): SocketIOServer {
  if (io) {
    return io;
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/api/socket',
    transports: ['websocket', 'polling'],
  });

  // Authentication middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('Authentication required'));
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return next(new Error('Invalid or expired token'));
    }

    // Attach user data to socket
    (socket as AuthenticatedSocket).data = {
      user: payload,
      userId: payload.userId,
    };

    next();
  });

  // Connection handler
  io.on('connection', (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    const userId = authSocket.data.userId;

    console.log(`[WebSocket] User connected: ${userId} (Socket: ${socket.id})`);

    // Track user connections
    if (!userConnections.has(userId)) {
      userConnections.set(userId, new Set());
    }
    userConnections.get(userId)!.add(socket.id);

    // Auto-join user's personal room
    socket.join(`user:${userId}`);

    // Handle joining specific rooms (workspaces, projects)
    socket.on('join:workspace', (workspaceId: string) => {
      socket.join(`workspace:${workspaceId}`);
      console.log(`[WebSocket] User ${userId} joined workspace: ${workspaceId}`);
    });

    socket.on('join:project', (projectId: string) => {
      socket.join(`project:${projectId}`);
      console.log(`[WebSocket] User ${userId} joined project: ${projectId}`);
    });

    // Handle leaving rooms
    socket.on('leave:workspace', (workspaceId: string) => {
      socket.leave(`workspace:${workspaceId}`);
    });

    socket.on('leave:project', (projectId: string) => {
      socket.leave(`project:${projectId}`);
    });

    // Handle typing indicators
    socket.on('typing:start', (data: { workspaceId: string; userName: string }) => {
      socket.to(`workspace:${data.workspaceId}`).emit('typing', {
        userId,
        userName: data.userName,
        workspaceId: data.workspaceId,
      });
    });

    socket.on('typing:stop', (data: { workspaceId: string }) => {
      socket.to(`workspace:${data.workspaceId}`).emit('stopped_typing', {
        userId,
        workspaceId: data.workspaceId,
      });
    });

    // Handle read receipts
    socket.on('message:read', (data: { messageId: string; workspaceId: string }) => {
      socket.to(`workspace:${data.workspaceId}`).emit('message_read', {
        messageId: data.messageId,
        readBy: userId,
        readAt: new Date().toISOString(),
      });
    });

    // Handle presence updates
    socket.on('presence:update', (status: 'online' | 'away' | 'busy') => {
      broadcastPresence(userId, status);
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`[WebSocket] User disconnected: ${userId} (Reason: ${reason})`);

      // Remove from user connections
      const userSockets = userConnections.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          userConnections.delete(userId);
          // Broadcast offline status
          broadcastPresence(userId, 'offline');
        }
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`[WebSocket] Error for user ${userId}:`, error);
    });
  });

  return io;
}

/**
 * Get Socket.IO server instance
 */
export function getIO(): SocketIOServer | null {
  return io;
}

/**
 * Check if user is online
 */
export function isUserOnline(userId: string): boolean {
  const sockets = userConnections.get(userId);
  return sockets !== undefined && sockets.size > 0;
}

/**
 * Get all online users
 */
export function getOnlineUsers(): string[] {
  return Array.from(userConnections.keys());
}

/**
 * Broadcast presence update to relevant users
 */
function broadcastPresence(userId: string, status: string): void {
  if (!io) return;

  io.emit('presence:update', {
    userId,
    status,
    timestamp: new Date().toISOString(),
  });
}

// ==========================================
// NOTIFICATION EMITTERS
// ==========================================

/**
 * Emit notification to specific user
 */
export function emitNotification(
  userId: string,
  notification: {
    type: string;
    title: string;
    description: string;
    actionUrl?: string;
    actionLabel?: string;
    metadata?: Record<string, unknown>;
  }
): void {
  if (!io) {
    console.warn('[WebSocket] IO not initialized, cannot emit notification');
    return;
  }

  io.to(`user:${userId}`).emit('notification', {
    ...notification,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Emit to workspace members
 */
export function emitToWorkspace(
  workspaceId: string,
  event: string,
  data: unknown
): void {
  if (!io) return;
  io.to(`workspace:${workspaceId}`).emit(event, data);
}

/**
 * Emit to project members
 */
export function emitToProject(
  projectId: string,
  event: string,
  data: unknown
): void {
  if (!io) return;
  io.to(`project:${projectId}`).emit(event, data);
}

/**
 * Emit new message to workspace
 */
export function emitNewMessage(
  workspaceId: string,
  message: {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
    attachments?: string[];
    createdAt: Date;
  }
): void {
  emitToWorkspace(workspaceId, 'message:new', message);
}

/**
 * Emit project status update
 */
export function emitProjectUpdate(
  workspaceId: string,
  update: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
    updatedBy: string;
  }
): void {
  emitToWorkspace(workspaceId, 'project:update', update);
}

/**
 * Emit payment notification
 */
export function emitPaymentNotification(
  userId: string,
  payment: {
    workspaceId: string;
    amount: number;
    currency: string;
    status: string;
  }
): void {
  emitNotification(userId, {
    type: 'payment',
    title: 'Payment Update',
    description: `Payment of ${payment.currency} ${payment.amount} is ${payment.status}`,
    actionUrl: `/workspace/${payment.workspaceId}`,
    actionLabel: 'View Details',
    metadata: payment,
  });
}

/**
 * Emit deployment status
 */
export function emitDeploymentStatus(
  workspaceId: string,
  deployment: {
    id: string;
    status: string;
    domain?: string;
    buildLogs?: string[];
  }
): void {
  emitToWorkspace(workspaceId, 'deployment:status', deployment);
}

/**
 * Broadcast admin notification to all admin/owner users
 */
export function broadcastAdminNotification(
  notification: {
    type: string;
    title: string;
    description: string;
    actionUrl?: string;
    actionLabel?: string;
  }
): void {
  if (!io) return;

  // Emit to admin room (would need to set up admin room joining)
  io.emit('admin:notification', {
    ...notification,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Emit activity update
 */
export function emitActivityUpdate(
  workspaceId: string,
  activity: {
    type: string;
    message: string;
    userId: string;
    userName: string;
  }
): void {
  emitToWorkspace(workspaceId, 'activity:new', {
    ...activity,
    timestamp: new Date().toISOString(),
  });
}

export default {
  initializeWebSocketServer,
  getIO,
  isUserOnline,
  getOnlineUsers,
  emitNotification,
  emitToWorkspace,
  emitToProject,
  emitNewMessage,
  emitProjectUpdate,
  emitPaymentNotification,
  emitDeploymentStatus,
  broadcastAdminNotification,
  emitActivityUpdate,
};
