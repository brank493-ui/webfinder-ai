import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hasWebsite = searchParams.get('hasWebsite');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: Record<string, unknown> = {};

    if (hasWebsite === 'true') {
      where.hasWebsite = true;
    } else if (hasWebsite === 'false') {
      where.hasWebsite = false;
    }

    if (category && category !== 'all') {
      where.category = {
        contains: category,
        mode: 'insensitive',
      };
    }

    // Fetch businesses with pagination
    const [businesses, total] = await Promise.all([
      db.business.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.business.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      businesses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Business ID is required' },
        { status: 400 }
      );
    }

    await db.business.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting business:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete business' },
      { status: 500 }
    );
  }
}
