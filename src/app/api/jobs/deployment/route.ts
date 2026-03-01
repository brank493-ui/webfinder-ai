import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse, getAuthUser } from '@/lib/backend-utils';
import { queueDeployment } from '@/lib/queue';

// ==========================================
// POST /api/jobs/deployment - Queue deployment job
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'owner') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { workspaceId, projectId, domain, framework = 'nextjs' } = body;

    if (!workspaceId || !domain) {
      return errorResponse('Workspace ID and domain are required', 400);
    }

    const job = await queueDeployment({
      workspaceId,
      projectId,
      domain,
      framework,
    });

    return successResponse({
      message: 'Deployment job queued successfully',
      jobId: job.id,
    });
  } catch (error) {
    console.error('Queue deployment error:', error);
    return errorResponse('Failed to queue deployment', 500);
  }
}
