import { NextRequest, NextResponse } from 'next/server';
import { db, successResponse, errorResponse, getPaginationParams, getAuthUser } from '@/lib/backend-utils';

// ==========================================
// GET /api/tools/email - List email campaigns
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

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [campaigns, total] = await Promise.all([
      db.emailCampaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.emailCampaign.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: campaigns,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get email campaigns error:', error);
    return errorResponse('Failed to get campaigns', 500);
  }
}

// ==========================================
// POST /api/tools/email - Create email campaign
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, subject, content, templateId, scheduledAt, recipientFilter } = body;

    if (!name || !subject || !content) {
      return errorResponse('Name, subject, and content are required', 400);
    }

    // Get recipients based on filter
    let recipients: { id: string; email: string }[] = [];
    
    if (recipientFilter === 'leads_without_website') {
      const leads = await db.lead.findMany({
        where: { status: 'new' },
        select: { id: true, businessEmail: true }
      });
      recipients = leads.filter(l => l.businessEmail).map(l => ({ id: l.id, email: l.businessEmail! }));
    } else if (recipientFilter === 'all_leads') {
      const leads = await db.lead.findMany({
        select: { id: true, businessEmail: true }
      });
      recipients = leads.filter(l => l.businessEmail).map(l => ({ id: l.id, email: l.businessEmail! }));
    }

    const campaign = await db.emailCampaign.create({
      data: {
        name,
        subject,
        content,
        templateId,
        status: scheduledAt ? 'scheduled' : 'draft',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        recipientCount: recipients.length,
        metadata: JSON.stringify({ recipientFilter, recipientIds: recipients.map(r => r.id) })
      }
    });

    return successResponse(campaign, 201);
  } catch (error) {
    console.error('Create email campaign error:', error);
    return errorResponse('Failed to create campaign', 500);
  }
}
