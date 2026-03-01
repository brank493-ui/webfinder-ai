import { NextRequest, NextResponse } from 'next/server';
import { db, successResponse, errorResponse, getAuthUser } from '@/lib/backend-utils';

// ==========================================
// GET /api/admin/stats - Get admin dashboard stats
// ==========================================
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'owner') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Parallel queries for stats
    const [
      totalBusinesses,
      businessesWithoutWebsites,
      totalLeads,
      newLeadsThisMonth,
      convertedLeads,
      activeProjects,
      completedProjects,
      completedThisMonth,
      monthlyRevenue,
      lastMonthRevenue,
      totalUsers,
      newUsersThisMonth
    ] = await Promise.all([
      // Total businesses
      db.business.count(),
      // Businesses without websites
      db.business.count({ where: { hasWebsite: false } }),
      // Total leads
      db.lead.count(),
      // New leads this month
      db.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
      // Converted leads
      db.lead.count({ where: { status: 'converted' } }),
      // Active projects
      db.workspace.count({ where: { status: 'in_progress' } }),
      // Completed projects
      db.workspace.count({ where: { status: 'completed' } }),
      // Completed this month
      db.workspace.count({ where: { status: 'completed', completedAt: { gte: startOfMonth } } }),
      // Monthly revenue
      db.revenue.aggregate({
        where: { createdAt: { gte: startOfMonth } },
        _sum: { amount: true }
      }),
      // Last month revenue
      db.revenue.aggregate({
        where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
        _sum: { amount: true }
      }),
      // Total users
      db.user.count(),
      // New users this month
      db.user.count({ where: { createdAt: { gte: startOfMonth } } })
    ]);

    // Calculate conversion rate
    const conversionRate = totalLeads > 0 
      ? ((convertedLeads / totalLeads) * 100).toFixed(1) 
      : '0';

    // Calculate revenue change
    const currentRevenue = monthlyRevenue._sum.amount || 0;
    const previousRevenue = lastMonthRevenue._sum.amount || 0;
    const revenueChange = previousRevenue > 0 
      ? (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)
      : '0';

    return successResponse({
      businesses: {
        total: totalBusinesses,
        withoutWebsites: businessesWithoutWebsites,
        withWebsites: totalBusinesses - businessesWithoutWebsites
      },
      leads: {
        total: totalLeads,
        newThisMonth: newLeadsThisMonth,
        converted: convertedLeads,
        conversionRate: `${conversionRate}%`
      },
      projects: {
        active: activeProjects,
        completed: completedProjects,
        completedThisMonth
      },
      revenue: {
        thisMonth: currentRevenue,
        lastMonth: previousRevenue,
        change: `${revenueChange}%`
      },
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return errorResponse('Failed to get stats', 500);
  }
}
