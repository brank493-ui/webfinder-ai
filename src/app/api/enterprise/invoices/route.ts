import { NextRequest, NextResponse } from 'next/server';
import { db, successResponse, errorResponse, getPaginationParams, getAuthUser } from '@/lib/backend-utils';

// ==========================================
// GET /api/enterprise/invoices - List invoices
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

    const [invoices, total] = await Promise.all([
      db.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.invoice.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: invoices,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    return errorResponse('Failed to get invoices', 500);
  }
}

// ==========================================
// POST /api/enterprise/invoices - Create invoice
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'owner') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { clientName, clientEmail, projectName, amount, items, dueDate, projectId, notes } = body;

    if (!clientName || !clientEmail || !projectName || !amount) {
      return errorResponse('Missing required fields', 400);
    }

    // Generate invoice number
    const count = await db.invoice.count();
    const number = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    const invoice = await db.invoice.create({
      data: {
        number,
        projectId,
        clientName,
        clientEmail,
        projectName,
        amount: parseFloat(amount),
        items: JSON.stringify(items || []),
        dueDate: new Date(dueDate || Date.now() + 30 * 24 * 60 * 60 * 1000),
        notes,
        status: 'draft'
      }
    });

    return successResponse(invoice, 201);
  } catch (error) {
    console.error('Create invoice error:', error);
    return errorResponse('Failed to create invoice', 500);
  }
}
