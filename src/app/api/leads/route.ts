import { NextRequest, NextResponse } from 'next/server';
import { db, successResponse, errorResponse, getPaginationParams, getAuthUser } from '@/lib/backend-utils';

// ==========================================
// GET /api/leads - List leads
// ==========================================
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { page, limit, skip } = getPaginationParams(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const source = searchParams.get('source');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (source) where.source = source;

    const [leads, total] = await Promise.all([
      db.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.lead.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: leads,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get leads error:', error);
    return errorResponse('Failed to get leads', 500);
  }
}

// ==========================================
// POST /api/leads - Create lead manually
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      businessName,
      businessEmail,
      businessPhone,
      businessAddress,
      businessCategory,
      website,
      budget,
      timeline,
      servicesNeeded,
      notes,
      priority = 'medium'
    } = body;

    if (!businessName) {
      return errorResponse('Business name is required', 400);
    }

    const lead = await db.lead.create({
      data: {
        businessName,
        businessEmail,
        businessPhone,
        businessAddress,
        businessCategory,
        website,
        budget,
        timeline,
        servicesNeeded: servicesNeeded ? JSON.stringify(servicesNeeded) : null,
        notes,
        priority,
        source: 'manual',
        status: 'new'
      }
    });

    return successResponse(lead, 201);
  } catch (error) {
    console.error('Create lead error:', error);
    return errorResponse('Failed to create lead', 500);
  }
}

// ==========================================
// PATCH /api/leads - Update lead status
// ==========================================
export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, priority, notes } = body;

    if (!id) {
      return errorResponse('Lead ID is required', 400);
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (notes) updateData.notes = notes;

    if (status === 'contacted') {
      updateData.lastContactAt = new Date();
      updateData.contactAttempts = { increment: 1 };
    }

    if (status === 'converted') {
      updateData.convertedAt = new Date();
    }

    const lead = await db.lead.update({
      where: { id },
      data: updateData
    });

    return successResponse(lead);
  } catch (error) {
    console.error('Update lead error:', error);
    return errorResponse('Failed to update lead', 500);
  }
}
