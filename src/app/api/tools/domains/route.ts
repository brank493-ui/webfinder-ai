import { NextRequest, NextResponse } from 'next/server';
import { db, successResponse, errorResponse, getPaginationParams, getAuthUser } from '@/lib/backend-utils';

// ==========================================
// GET /api/tools/domains - List domains
// ==========================================
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const domains = await db.domain.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return successResponse(domains);
  } catch (error) {
    console.error('Get domains error:', error);
    return errorResponse('Failed to get domains', 500);
  }
}

// ==========================================
// POST /api/tools/domains - Add/Check domain
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, projectId, action = 'add' } = body;

    if (!name) {
      return errorResponse('Domain name is required', 400);
    }

    const normalizedName = name.toLowerCase().trim();

    // Check domain availability (mock - integrate with real domain API)
    if (action === 'check') {
      const existing = await db.domain.findUnique({
        where: { name: normalizedName }
      });

      return successResponse({
        domain: normalizedName,
        available: !existing,
        status: existing ? 'taken' : 'available',
        price: 12.99 // Default price
      });
    }

    // Add domain
    const domain = await db.domain.create({
      data: {
        name: normalizedName,
        projectId,
        status: 'pending',
        price: 12.99,
        currency: 'USD',
      }
    });

    return successResponse(domain, 201);
  } catch (error) {
    console.error('Add domain error:', error);
    return errorResponse('Failed to add domain', 500);
  }
}
