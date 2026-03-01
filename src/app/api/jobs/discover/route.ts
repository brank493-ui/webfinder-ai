import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse, getAuthUser } from '@/lib/backend-utils';
import { queueDiscoverSearch } from '@/lib/queue';

// ==========================================
// POST /api/jobs/discover - Queue discover search job
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { location, radius = 5000, category } = body;

    if (!location) {
      return errorResponse('Location is required', 400);
    }

    const job = await queueDiscoverSearch({
      location,
      radius,
      category,
      userId: user.id,
    });

    return successResponse({
      message: 'Search job queued successfully',
      jobId: job.id,
    });
  } catch (error) {
    console.error('Queue discover error:', error);
    return errorResponse('Failed to queue search', 500);
  }
}
