import { NextRequest, NextResponse } from 'next/server';
import { db, successResponse, errorResponse, getPaginationParams, getAuthUser } from '@/lib/backend-utils';

// ==========================================
// GET /api/notifications - List user notifications
// ==========================================
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { page, limit, skip } = getPaginationParams(request);
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    const type = searchParams.get('type');

    const where: Record<string, unknown> = { userId: user.id };
    if (unreadOnly) where.read = false;
    if (type) where.type = type;

    const [notifications, total, unreadCount] = await Promise.all([
      db.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.notification.count({ where }),
      db.notification.count({ where: { userId: user.id, read: false } })
    ]);

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return errorResponse('Failed to get notifications', 500);
  }
}

// ==========================================
// PATCH /api/notifications - Mark as read
// ==========================================
export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, markAllRead } = body;

    if (markAllRead) {
      await db.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true }
      });

      return successResponse({ message: 'All notifications marked as read' });
    }

    if (!id) {
      return errorResponse('Notification ID is required', 400);
    }

    const notification = await db.notification.update({
      where: { id, userId: user.id },
      data: { read: true }
    });

    return successResponse(notification);
  } catch (error) {
    console.error('Update notification error:', error);
    return errorResponse('Failed to update notification', 500);
  }
}

// ==========================================
// DELETE /api/notifications - Delete notification
// ==========================================
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const clearAll = searchParams.get('clearAll') === 'true';

    if (clearAll) {
      await db.notification.deleteMany({
        where: { userId: user.id }
      });

      return successResponse({ message: 'All notifications cleared' });
    }

    if (!id) {
      return errorResponse('Notification ID is required', 400);
    }

    await db.notification.delete({
      where: { id, userId: user.id }
    });

    return successResponse({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    return errorResponse('Failed to delete notification', 500);
  }
}
