import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PRICING_PACKAGES } from '@/lib/pricing';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, packageId, conversationId } = body;

    if (!businessId || !packageId) {
      return NextResponse.json(
        { success: false, error: 'Business ID and package ID are required' },
        { status: 400 }
      );
    }

    // Validate package
    const selectedPackage = PRICING_PACKAGES.find((p) => p.id === packageId);
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

    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      // Mock payment flow for testing
      console.log('Stripe not configured, creating mock payment');

      // Create project with pending payment
      const project = await db.project.create({
        data: {
          businessId: business.id,
          package: packageId,
          status: 'pending',
          paymentStatus: 'pending',
          amount: selectedPackage.price,
        },
      });

      // Return mock checkout URL
      return NextResponse.json({
        success: true,
        checkoutUrl: `/payment/mock?projectId=${project.id}&amount=${selectedPackage.price}`,
        sessionId: `mock_session_${project.id}`,
        message: 'Mock payment mode - Stripe not configured',
      });
    }

    // Real Stripe integration
    try {
      // Dynamic import for Stripe
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2026-02-25.clover',
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `WebFinder - ${selectedPackage.name} Package`,
                description: selectedPackage.description,
              },
              unit_amount: selectedPackage.price * 100, // Convert to cents
            },
            quantity: 1,
          },
        ],
        metadata: {
          businessId,
          packageId,
          conversationId: conversationId || '',
        },
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?payment=success&project={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?payment=cancelled`,
      });

      // Create project with pending payment
      await db.project.create({
        data: {
          businessId: business.id,
          package: packageId,
          status: 'pending',
          paymentStatus: 'pending',
          stripePaymentId: session.id,
          amount: selectedPackage.price,
        },
      });

      return NextResponse.json({
        success: true,
        checkoutUrl: session.url,
        sessionId: session.id,
      });
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      return NextResponse.json(
        { success: false, error: 'Failed to create payment session' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Payment session error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment session' },
      { status: 500 }
    );
  }
}
