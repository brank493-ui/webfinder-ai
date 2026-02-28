import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Get admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Get counts
    const [
      totalBusinesses,
      businessesWithoutWebsite,
      totalProjects,
      pendingPayments,
      completedProjects,
      inProgressProjects,
    ] = await Promise.all([
      db.business.count(),
      db.business.count({ where: { hasWebsite: false } }),
      db.project.count(),
      db.project.count({ where: { paymentStatus: 'pending' } }),
      db.project.count({ where: { status: 'completed' } }),
      db.project.count({ where: { status: 'in_progress' } }),
    ]);

    // Calculate total revenue
    const paidProjects = await db.project.findMany({
      where: { paymentStatus: 'paid' },
      select: { amount: true },
    });
    const totalRevenue = paidProjects.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Get recent projects
    const recentProjects = await db.project.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            category: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Get package distribution
    const allProjects = await db.project.findMany({
      select: { package: true, amount: true },
    });

    const packageDistribution = allProjects.reduce((acc, p) => {
      const pkg = p.package || 'standard';
      if (!acc[pkg]) {
        acc[pkg] = { count: 0, revenue: 0 };
      }
      acc[pkg].count++;
      acc[pkg].revenue += p.amount || 0;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    // Get recent businesses
    const recentBusinesses = await db.business.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalBusinesses,
        businessesWithoutWebsite,
        totalProjects,
        pendingPayments,
        completedProjects,
        inProgressProjects,
        totalRevenue,
      },
      recentProjects,
      recentBusinesses,
      packageDistribution: Object.entries(packageDistribution).map(([pkg, data]) => ({
        package: pkg,
        count: data.count,
        revenue: data.revenue,
      })),
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
