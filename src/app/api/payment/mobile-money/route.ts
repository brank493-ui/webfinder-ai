import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  initiateMobileMoneyPayment,
  checkMobileMoneyStatus,
  type MobileMoneyPaymentRequest,
} from '@/lib/mobile-money';

// Initiate mobile money payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, packageId, provider, phoneNumber, conversationId } = body;

    // Validate required fields
    if (!businessId || !packageId || !provider || !phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: businessId, packageId, provider, phoneNumber',
        },
        { status: 400 }
      );
    }

    // Package pricing
    const packages: Record<string, { price: number; name: string }> = {
      standard: { price: 149, name: 'Standard' },
      pro: { price: 399, name: 'Pro' },
      premium: { price: 999, name: 'Premium' },
    };

    const selectedPackage = packages[packageId];
    if (!selectedPackage) {
      return NextResponse.json(
        { success: false, error: 'Invalid package selected' },
        { status: 400 }
      );
    }

    // Get business
    const business = await db.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      );
    }

    // Create project record
    const project = await db.project.create({
      data: {
        businessId: business.id,
        package: packageId,
        status: 'pending',
        paymentStatus: 'pending',
        amount: selectedPackage.price,
      },
    });

    // Initiate mobile money payment
    const paymentRequest: MobileMoneyPaymentRequest = {
      provider,
      phoneNumber,
      amount: selectedPackage.price,
      currency: 'USD',
      reference: project.id,
      description: `WebFinder - ${selectedPackage.name} Package`,
    };

    const paymentResponse = await initiateMobileMoneyPayment(paymentRequest);

    if (!paymentResponse.success) {
      return NextResponse.json({
        success: false,
        error: paymentResponse.message || 'Payment initiation failed',
      });
    }

    // Update project with payment reference
    await db.project.update({
      where: { id: project.id },
      data: {
        stripePaymentId: paymentResponse.transactionId,
      },
    });

    return NextResponse.json({
      success: true,
      projectId: project.id,
      transactionId: paymentResponse.transactionId,
      status: paymentResponse.status,
      message: paymentResponse.message,
      ussdCode: paymentResponse.ussdCode,
    });
  } catch (error) {
    console.error('Mobile money payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

// Check payment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');
    const projectId = searchParams.get('projectId');

    if (!transactionId && !projectId) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID or Project ID required' },
        { status: 400 }
      );
    }

    // Check from database first
    if (projectId) {
      const project = await db.project.findUnique({
        where: { id: projectId },
      });

      if (project) {
        return NextResponse.json({
          success: true,
          status: project.paymentStatus,
          projectStatus: project.status,
          amount: project.amount,
          package: project.package,
        });
      }
    }

    // Check mobile money status
    if (transactionId) {
      const statusResponse = await checkMobileMoneyStatus(transactionId);

      // If completed, update project
      if (statusResponse.status === 'completed') {
        await db.project.updateMany({
          where: { stripePaymentId: transactionId },
          data: {
            paymentStatus: 'paid',
            status: 'in_progress',
          },
        });
      }

      return NextResponse.json({
        success: true,
        ...statusResponse,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Payment not found',
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
