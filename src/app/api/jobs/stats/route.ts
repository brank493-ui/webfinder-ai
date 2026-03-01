import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse, getAuthUser } from '@/lib/backend-utils';
import { getAllQueuesStats } from '@/lib/queue';

// ==========================================
// GET /api/jobs/stats - Get queue statistics
// ==========================================
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'owner') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await getAllQueuesStats();

    return successResponse({
      queues: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get queue stats error:', error);
    return errorResponse('Failed to get queue stats', 500);
  }
}
