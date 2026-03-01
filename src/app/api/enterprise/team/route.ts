import { NextRequest, NextResponse } from 'next/server';
import { db, successResponse, errorResponse, getPaginationParams, getAuthUser } from '@/lib/backend-utils';

// ==========================================
// GET /api/enterprise/team - List team members
// ==========================================
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'owner') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const members = await db.teamMember.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(members);
  } catch (error) {
    console.error('Get team error:', error);
    return errorResponse('Failed to get team members', 500);
  }
}

// ==========================================
// POST /api/enterprise/team - Invite team member
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'owner') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, role = 'viewer' } = body;

    if (!name || !email) {
      return errorResponse('Name and email are required', 400);
    }

    const member = await db.teamMember.create({
      data: {
        name,
        email,
        role,
        userId: crypto.randomUUID(), // Temporary until user registers
        teamId: 'default-team',
        status: 'pending'
      }
    });

    // TODO: Send invitation email

    return successResponse(member, 201);
  } catch (error) {
    console.error('Invite team member error:', error);
    return errorResponse('Failed to invite team member', 500);
  }
}
