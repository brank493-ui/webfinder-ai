import { NextRequest, NextResponse } from 'next/server';
import { db, successResponse, errorResponse, getAuthUser } from '@/lib/backend-utils';

// ==========================================
// GET /api/workspaces/[id] - Get single workspace
// ==========================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const workspace = await db.workspace.findUnique({
      where: { id }
    });

    if (!workspace) {
      return errorResponse('Workspace not found', 404);
    }

    // Check access permissions for clients
    if ((user.role === 'client' || user.role === 'user') && workspace.clientId !== user.id) {
      return errorResponse('Access denied', 403);
    }

    return successResponse(workspace);
  } catch (error) {
    console.error('Get workspace error:', error);
    return errorResponse('Failed to get workspace', 500);
  }
}

// ==========================================
// PATCH /api/workspaces/[id] - Update workspace
// ==========================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const workspace = await db.workspace.findUnique({
      where: { id }
    });

    if (!workspace) {
      return errorResponse('Workspace not found', 404);
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    const allowedFields = [
      'name', 'status', 'progress', 'brief', 'services', 'features', 'pages',
      'designStyle', 'primaryColor', 'secondaryColor', 'domain', 'websiteUrl',
      'paymentStatus', 'amount', 'notes', 'startDate', 'dueDate'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (['brief', 'services', 'features', 'pages'].includes(field)) {
          updateData[field] = JSON.stringify(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    if (body.status === 'completed') {
      updateData.completedAt = new Date();
    }

    const updatedWorkspace = await db.workspace.update({
      where: { id },
      data: updateData
    });

    return successResponse(updatedWorkspace);
  } catch (error) {
    console.error('Update workspace error:', error);
    return errorResponse('Failed to update workspace', 500);
  }
}

// ==========================================
// DELETE /api/workspaces/[id] - Delete workspace
// ==========================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'owner') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await db.workspace.update({
      where: { id },
      data: { status: 'cancelled' }
    });

    return successResponse({ message: 'Workspace deleted successfully' });
  } catch (error) {
    console.error('Delete workspace error:', error);
    return errorResponse('Failed to delete workspace', 500);
  }
}
