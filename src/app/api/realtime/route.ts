import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse, getAuthUser } from '@/lib/backend-utils';
import { queueNotification } from '@/lib/queue';
import { isUserOnline, emitNotification } from '@/lib/websocket/server';

// ==========================================
// GET /api/realtime/status - Get user online status
// ==========================================
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userIds = searchParams.get('userIds');

    if (userIds) {
      const ids = userIds.split(',');
      const statuses: Record<string, boolean> = {};
      
      for (const id of ids) {
        statuses[id] = isUserOnline(id);
      }

      return successResponse({
        statuses,
        onlineCount: Object.values(statuses).filter(Boolean).length,
      });
    }

    return successResponse({
      userId: user.id,
      isOnline: true,
      connectedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get realtime status error:', error);
    return errorResponse('Failed to get status', 500);
  }
}

// ==========================================
// POST /api/realtime/notify - Send real-time notification
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      userId: targetUserId, 
      type, 
      title, 
      description, 
      actionUrl, 
      actionLabel, 
      metadata,
      immediate = false 
    } = body;

    if (!targetUserId || !type || !title) {
      return errorResponse('userId, type, and title are required', 400);
    }

    if (targetUserId !== user.id && user.role !== 'owner') {
      return errorResponse('Forbidden', 403);
    }

    if (immediate) {
      emitNotification(targetUserId, {
        type,
        title,
        description,
        actionUrl,
        actionLabel,
        metadata,
      });

      await queueNotification({
        userId: targetUserId,
        type,
        title,
        description,
        actionUrl,
        actionLabel,
        metadata,
      });

      return successResponse({
        message: 'Notification sent',
        delivered: isUserOnline(targetUserId),
      });
    }

    const job = await queueNotification({
      userId: targetUserId,
      type,
      title,
      description,
      actionUrl,
      actionLabel,
      metadata,
    });

    return successResponse({
      message: 'Notification queued',
      jobId: job.id,
    });
  } catch (error) {
    console.error('Send notification error:', error);
    return errorResponse('Failed to send notification', 500);
  }
}
