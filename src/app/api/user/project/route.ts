import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get user's project data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const accessCode = searchParams.get('accessCode');

    // Find user by various criteria
    let user: Awaited<ReturnType<typeof prisma.user.findUnique>> = null;

    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } else if (accessCode) {
      // Find user by access code
      const accessCodeRecord = await prisma.accessCode.findUnique({
        where: { code: accessCode },
      });
      if (accessCodeRecord?.usedBy) {
        user = await prisma.user.findUnique({
          where: { id: accessCodeRecord.usedBy },
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // If user has no project yet
    if (!user.projectId) {
      return NextResponse.json({
        success: true,
        project: null,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
        },
      });
    }

    // Get project with all related data
    const project = await prisma.project.findUnique({
      where: { id: user.projectId },
      include: {
        business: true,
      },
    });

    if (!project) {
      return NextResponse.json({
        success: true,
        project: null,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
        },
      });
    }

    // Get payment transactions
    const transactions = await prisma.paymentTransaction.findMany({
      where: { projectId: project.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Get deployment info
    const deployment = await prisma.deployment.findFirst({
      where: { projectId: project.id },
    });

    // Get messages
    const messages = await prisma.message.findMany({
      where: { projectId: project.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Calculate progress based on status
    const progressMap: Record<string, number> = {
      pending: 10,
      in_progress: 50,
      review: 85,
      completed: 100,
      cancelled: 0,
    };

    const progress = progressMap[project.status] || 10;

    // Parse brief JSON
    const brief = project.brief ? JSON.parse(project.brief) : null;

    // Generate timeline based on project status
    const timeline = generateTimeline(project.status, project.createdAt, project.updatedAt);

    // Generate updates from messages and milestones
    const updates = generateUpdates(project, messages);

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        businessName: project.business?.name || user.name,
        package: project.package,
        status: project.status,
        progress,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        websiteUrl: project.websiteUrl,
        estimatedDelivery: getEstimatedDelivery(project.createdAt, project.package),
        brief,
        transactions: transactions.map(t => ({
          id: t.id,
          transactionId: t.transactionId,
          provider: t.provider,
          amount: t.amount,
          currency: t.currency,
          status: t.status,
          createdAt: t.createdAt,
        })),
        deployment: deployment ? {
          id: deployment.id,
          domain: deployment.domain,
          status: deployment.status,
          sslEnabled: deployment.sslEnabled,
          lastDeployed: deployment.lastDeployed,
        } : null,
        timeline,
        updates,
        messages: messages.map(m => ({
          id: m.id,
          senderId: m.senderId,
          senderName: m.senderName,
          content: m.content,
          isFromAdmin: m.isFromAdmin,
          read: m.read,
          createdAt: m.createdAt,
        })),
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        avatar: user.avatar,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error('Error fetching user project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project data' },
      { status: 500 }
    );
  }
}

// Generate a realistic timeline based on project status
function generateTimeline(status: string, createdAt: Date, updatedAt: Date) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const stages = [
    { stage: 'Project Initiated', status: 'completed', date: formatDate(createdAt), description: 'Your project was created and assigned to our team' },
    { stage: 'Requirements Gathered', status: 'completed', date: formatDate(new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000)), description: 'We collected all your requirements and preferences' },
    { stage: 'Design Phase', status: 'completed', date: formatDate(new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)), description: 'Initial design concepts were created and approved' },
    { stage: 'Development', status: 'current', date: 'In Progress', description: 'Your website is being built with your specifications' },
    { stage: 'Review & Testing', status: 'upcoming', description: 'Quality assurance and your review' },
    { stage: 'Launch', status: 'upcoming', description: 'Your website goes live!' },
  ];

  // Adjust timeline based on status
  if (status === 'review') {
    stages[3].status = 'completed';
    stages[4].status = 'current';
  } else if (status === 'completed') {
    stages[3].status = 'completed';
    stages[4].status = 'completed';
    stages[5].status = 'completed';
    stages[5].date = formatDate(updatedAt);
  } else if (status === 'pending') {
    stages[1].status = 'upcoming';
    stages[2].status = 'upcoming';
    stages[3].status = 'upcoming';
  }

  return stages;
}

// Generate updates from messages and milestones
function generateUpdates(project: { id: string; status: string; createdAt: Date; updatedAt: Date; business?: { name: string | null } | null }, messages: { id: string; createdAt: Date; content: string; isFromAdmin: boolean }[]) {
  const updates: { id: string; date: string; title: string; description: string; type: string }[] = [];

  // Add project creation milestone
  updates.push({
    id: 'milestone_1',
    date: project.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    title: 'Project Created',
    description: 'Your website project has been initiated. Our team will begin work shortly.',
    type: 'milestone',
  });

  // Add status-based updates
  if (project.status === 'in_progress' || project.status === 'review' || project.status === 'completed') {
    updates.push({
      id: 'milestone_2',
      date: new Date(project.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: 'Requirements Confirmed',
      description: 'Your project requirements have been reviewed and confirmed by our team.',
      type: 'milestone',
    });
  }

  if (project.status === 'in_progress' || project.status === 'review' || project.status === 'completed') {
    updates.push({
      id: 'milestone_3',
      date: new Date(project.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: 'Development Started',
      description: 'Development has begun on your website. We\'re building your vision!',
      type: 'update',
    });
  }

  // Add recent messages as updates
  for (const msg of messages.slice(0, 3)) {
    if (!msg.isFromAdmin) continue; // Only show admin messages as updates
    updates.push({
      id: msg.id,
      date: msg.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: 'Message from Team',
      description: msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : ''),
      type: 'message',
    });
  }

  return updates.slice(0, 5);
}

// Calculate estimated delivery date
function getEstimatedDelivery(createdAt: Date, pkg: string): string {
  const daysMap: Record<string, number> = {
    standard: 21,
    pro: 14,
    premium: 30,
  };

  const days = daysMap[pkg] || 21;
  const deliveryDate = new Date(createdAt.getTime() + days * 24 * 60 * 60 * 1000);
  
  return deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
