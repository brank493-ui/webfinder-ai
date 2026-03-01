import { NextRequest, NextResponse } from 'next/server';
import { db, successResponse, errorResponse, getPaginationParams, getAuthUser, generateAccessCode, generateSlug } from '@/lib/backend-utils';

// ==========================================
// GET /api/workspaces - List all workspaces
// ==========================================
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);
    const status = searchParams.get('status');
    const package_ = searchParams.get('package');

    const where: Record<string, unknown> = {};

    // Clients can only see their own workspaces
    if (user.role === 'client' || user.role === 'user') {
      where.clientId = user.id;
    }

    if (status) where.status = status;
    if (package_) where.package = package_;

    const [workspaces, total] = await Promise.all([
      db.workspace.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.workspace.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: workspaces,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Get workspaces error:', error);
    return errorResponse('Failed to get workspaces', 500);
  }
}

// ==========================================
// POST /api/workspaces - Create new workspace
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      clientName,
      clientEmail,
      clientPhone,
      package: pkg = 'standard',
      brief,
      services,
      features,
      pages,
      designStyle,
      primaryColor,
      secondaryColor,
      domain,
      amount,
      currency = 'USD'
    } = body;

    if (!name || !clientName || !clientEmail) {
      return errorResponse('Name, client name, and client email are required', 400);
    }

    // Generate unique slug
    const slug = generateSlug(name);

    // Create workspace
    const workspace = await db.workspace.create({
      data: {
        name,
        slug,
        clientName,
        clientEmail,
        clientPhone,
        package: pkg,
        brief: brief ? JSON.stringify(brief) : null,
        services: services ? JSON.stringify(services) : null,
        features: features ? JSON.stringify(features) : null,
        pages: pages ? JSON.stringify(pages) : null,
        designStyle,
        primaryColor,
        secondaryColor,
        domain,
        amount,
        currency,
        status: 'pending',
        paymentStatus: 'pending',
      }
    });

    // Generate access code for client
    const accessCode = generateAccessCode(8);
    await db.clientAccessCode.create({
      data: {
        code: accessCode,
        email: clientEmail,
        workspaceId: workspace.id,
        package: pkg,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      }
    });

    // Create client brief
    await db.clientBrief.create({
      data: {
        workspaceId: workspace.id,
        businessName: name,
        businessDescription: brief?.description,
        contactName: clientName,
        contactEmail: clientEmail,
        contactPhone: clientPhone,
        designStyle,
        primaryColor,
        secondaryColor,
        pagesNeeded: pages ? JSON.stringify(pages) : null,
        featuresNeeded: features ? JSON.stringify(features) : null,
        status: 'draft',
      }
    });

    return successResponse({
      workspace,
      accessCode,
      message: 'Workspace created successfully'
    }, 201);
  } catch (error) {
    console.error('Create workspace error:', error);
    return errorResponse('Failed to create workspace', 500);
  }
}
