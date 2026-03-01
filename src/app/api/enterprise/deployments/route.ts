import { NextRequest, NextResponse } from 'next/server';
import { db, successResponse, errorResponse, getAuthUser } from '@/lib/backend-utils';

// ==========================================
// GET /api/enterprise/deployments - List deployments
// ==========================================
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const deployments = await db.deployment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return successResponse(deployments);
  } catch (error) {
    console.error('Get deployments error:', error);
    return errorResponse('Failed to get deployments', 500);
  }
}

// ==========================================
// POST /api/enterprise/deployments - Create deployment
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'owner') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, projectName, domain, framework = 'nextjs', region = 'us-east' } = body;

    if (!projectId || !projectName || !domain) {
      return errorResponse('Missing required fields', 400);
    }

    const deployment = await db.deployment.create({
      data: {
        projectId,
        projectName,
        domain,
        framework,
        region,
        status: 'pending'
      }
    });

    // TODO: Trigger actual deployment

    return successResponse(deployment, 201);
  } catch (error) {
    console.error('Create deployment error:', error);
    return errorResponse('Failed to create deployment', 500);
  }
}
