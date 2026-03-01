import { NextRequest, NextResponse } from 'next/server';
import { db, successResponse, errorResponse, getAuthUser } from '@/lib/backend-utils';

// ==========================================
// GET /api/tools/analytics - Get analytics data
// ==========================================
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const type = searchParams.get('type') || 'overview';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    if (type === 'revenue') {
      const revenues = await db.revenue.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: 'asc' }
      });

      // Group by month
      const monthlyRevenue: Record<string, number> = {};
      revenues.forEach(r => {
        const key = `${r.year}-${String(r.month).padStart(2, '0')}`;
        monthlyRevenue[key] = (monthlyRevenue[key] || 0) + r.amount;
      });

      return successResponse({
        period,
        total: revenues.reduce((sum, r) => sum + r.amount, 0),
        monthly: monthlyRevenue,
        data: revenues
      });
    }

    if (type === 'conversion') {
      const [leads, convertedLeads] = await Promise.all([
        db.lead.count({ where: { createdAt: { gte: startDate } } }),
        db.lead.count({ where: { createdAt: { gte: startDate }, status: 'converted' } })
      ]);

      const conversionRate = leads > 0 ? (convertedLeads / leads) * 100 : 0;

      return successResponse({
        period,
        leads,
        converted: convertedLeads,
        conversionRate: conversionRate.toFixed(2)
      });
    }

    // Overview stats
    const [totalBusinesses, leads, activeProjects, completedProjects, totalRevenue] = await Promise.all([
      db.business.count(),
      db.lead.count(),
      db.workspace.count({ where: { status: 'in_progress' } }),
      db.workspace.count({ where: { status: 'completed', completedAt: { gte: startDate } } }),
      db.revenue.aggregate({
        where: { createdAt: { gte: startDate } },
        _sum: { amount: true }
      })
    ]);

    return successResponse({
      period,
      overview: {
        totalBusinesses,
        totalLeads: leads,
        activeProjects,
        completedProjects,
        totalRevenue: totalRevenue._sum.amount || 0
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return errorResponse('Failed to get analytics', 500);
  }
}
