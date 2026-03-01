import { NextRequest, NextResponse } from 'next/server';
import { db, successResponse, errorResponse, getAuthUser, generateAccessCode } from '@/lib/backend-utils';

// ==========================================
// POST /api/onboarding/create-client - Create client with access code
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'owner') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      clientName, 
      clientEmail, 
      clientPhone,
      package: pkg = 'standard',
      projectName,
      brief 
    } = body;

    if (!clientName || !clientEmail) {
      return errorResponse('Client name and email are required', 400);
    }

    // Check if user exists
    let client = await db.user.findUnique({
      where: { email: clientEmail }
    });

    if (!client) {
      // Create user
      client = await db.user.create({
        data: {
          email: clientEmail,
          name: clientName,
          phone: clientPhone,
          role: 'client',
          provider: 'credential',
          hasCompletedOnboarding: false
        }
      });
    }

    // Generate access code
    const accessCode = generateAccessCode(8);

    // Create workspace
    const workspace = await db.workspace.create({
      data: {
        name: projectName || `${clientName}'s Project`,
        slug: `${clientName.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`,
        clientId: client.id,
        clientName,
        clientEmail,
        clientPhone,
        package: pkg,
        brief: brief ? JSON.stringify(brief) : null,
        status: 'pending',
        paymentStatus: 'pending'
      }
    });

    // Save access code
    await db.clientAccessCode.create({
      data: {
        code: accessCode,
        email: clientEmail,
        workspaceId: workspace.id,
        package: pkg,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: client.id,
        type: 'onboarding',
        title: 'Welcome to WebFinder!',
        description: `Your project has been created. Use access code ${accessCode} to get started.`,
        actionUrl: '/onboarding',
        actionLabel: 'Start Onboarding'
      }
    });

    return successResponse({
      client,
      workspace,
      accessCode,
      message: 'Client created successfully'
    }, 201);
  } catch (error) {
    console.error('Create client error:', error);
    return errorResponse('Failed to create client', 500);
  }
}

// ==========================================
// POST /api/onboarding/generate-access-code - Generate new access code
// ==========================================
export async function POST_accessCode(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'owner') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, package: pkg, workspaceId } = body;

    const accessCode = generateAccessCode(8);

    await db.clientAccessCode.create({
      data: {
        code: accessCode,
        email,
        workspaceId,
        package: pkg,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    return successResponse({ accessCode, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
  } catch (error) {
    console.error('Generate access code error:', error);
    return errorResponse('Failed to generate access code', 500);
  }
}

// ==========================================
// GET /api/onboarding - Get onboarding data
// ==========================================
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (code) {
      // Verify access code
      const accessCode = await db.clientAccessCode.findUnique({
        where: { code }
      });

      if (!accessCode) {
        return errorResponse('Invalid access code', 400);
      }

      if (accessCode.used) {
        return errorResponse('Access code already used', 400);
      }

      if (accessCode.expiresAt < new Date()) {
        return errorResponse('Access code expired', 400);
      }

      return successResponse({
        valid: true,
        email: accessCode.email,
        package: accessCode.package,
        workspaceId: accessCode.workspaceId
      });
    }

    // Get user's onboarding status
    const userWithProject = await db.user.findUnique({
      where: { id: user.id },
      include: {
        projects: true
      }
    });

    return successResponse({
      hasCompletedOnboarding: userWithProject?.hasCompletedOnboarding,
      projects: userWithProject?.projects
    });
  } catch (error) {
    console.error('Get onboarding error:', error);
    return errorResponse('Failed to get onboarding data', 500);
  }
}
