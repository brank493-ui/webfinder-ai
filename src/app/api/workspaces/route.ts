import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Get all workspaces (projects)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build filter
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const [projects, total] = await Promise.all([
      db.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          business: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              category: true,
              address: true,
            },
          },
        },
      }),
      db.project.count({ where }),
    ]);

    // Transform projects into workspace format
    const workspaces = projects.map((project) => ({
      id: project.id,
      status: project.status,
      paymentStatus: project.paymentStatus,
      package: project.package,
      amount: project.amount,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      business: project.business,
      brief: project.brief ? JSON.parse(project.brief) : null,
    }));

    return NextResponse.json({
      success: true,
      workspaces,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch workspaces' },
      { status: 500 }
    );
  }
}

// Update workspace (project)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, status, brief } = body;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (brief) updateData.brief = JSON.stringify(brief);

    const project = await db.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        business: true,
      },
    });

    return NextResponse.json({
      success: true,
      workspace: {
        ...project,
        brief: project.brief ? JSON.parse(project.brief) : null,
      },
    });
  } catch (error) {
    console.error('Error updating workspace:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update workspace' },
      { status: 500 }
    );
  }
}
