import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST - Create a payment record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      projectId,
      userId,
      provider,
      amount,
      currency,
      phoneNumber,
      transactionId,
      status,
      metadata,
    } = body;

    if (!projectId || !provider || !amount) {
      return NextResponse.json(
        { success: false, error: 'Project ID, provider, and amount are required' },
        { status: 400 }
      );
    }

    // Get project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { business: true },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Create payment transaction
    const transaction = await prisma.paymentTransaction.create({
      data: {
        projectId,
        provider,
        amount: parseFloat(amount.toString()),
        currency: currency || 'USD',
        phoneNumber: phoneNumber || null,
        transactionId: transactionId || `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: status || 'pending',
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    // Update project payment status if payment is completed
    if (status === 'completed') {
      await prisma.project.update({
        where: { id: projectId },
        data: {
          paymentStatus: 'paid',
          paymentMethod: provider,
          status: 'in_progress',
          amount: parseFloat(amount.toString()),
        },
      });

      // Create deployment record for paid projects
      const existingDeployment = await prisma.deployment.findFirst({
        where: { projectId },
      });

      if (!existingDeployment) {
        await prisma.deployment.create({
          data: {
            projectId,
            projectName: project.business?.name || 'New Project',
            domain: `${project.business?.name?.toLowerCase().replace(/\s+/g, '-') || 'project'}.webfinder.ai`,
            status: 'pending',
          },
        });
      }

      // Send notification to user
      if (userId) {
        await prisma.notification.create({
          data: {
            userId,
            type: 'payment',
            title: 'Payment Confirmed',
            description: `Your payment of ${currency || 'USD'} ${amount} has been confirmed. Your project is now in progress.`,
            actionUrl: '/dashboard',
            actionLabel: 'View Project',
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        transactionId: transaction.transactionId,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        createdAt: transaction.createdAt,
      },
    });
  } catch (error) {
    console.error('Payment create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

// GET - List payments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');

    let whereClause: Record<string, unknown> = {};

    if (projectId) {
      whereClause.projectId = projectId;
    } else if (userId) {
      // Get user's project first
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { projectId: true },
      });

      if (user?.projectId) {
        whereClause.projectId = user.projectId;
      }
    }

    const transactions = await prisma.paymentTransaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      transactions: transactions.map(t => ({
        id: t.id,
        transactionId: t.transactionId,
        provider: t.provider,
        amount: t.amount,
        currency: t.currency,
        status: t.status,
        phoneNumber: t.phoneNumber,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get payments' },
      { status: 500 }
    );
  }
}
