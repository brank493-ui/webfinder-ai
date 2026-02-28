import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    // Check if Stripe webhook secret is configured
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret || !signature) {
      // Mock webhook handling for testing
      console.log('Stripe webhook not configured, parsing mock data');

      try {
        const data = JSON.parse(body);
        const { projectId, status } = data;

        if (projectId && status === 'paid') {
          // Update project payment status
          await db.project.updateMany({
            where: { id: projectId },
            data: {
              paymentStatus: 'paid',
              status: 'in_progress',
            },
          });

          return NextResponse.json({
            success: true,
            message: 'Mock payment processed successfully',
          });
        }
      } catch {
        // Ignore parse errors in mock mode
      }

      return NextResponse.json({
        success: true,
        message: 'Webhook received in mock mode',
      });
    }

    // Real Stripe webhook handling
    try {
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
        apiVersion: '2024-11-20.acacia',
      });

      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as {
            id: string;
            metadata?: {
              businessId?: string;
              packageId?: string;
            };
            payment_status?: string;
          };

          // Update project payment status
          await db.project.updateMany({
            where: { stripePaymentId: session.id },
            data: {
              paymentStatus: 'paid',
              status: 'in_progress',
            },
          });

          console.log(`Payment completed for session: ${session.id}`);
          break;
        }

        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as { id: string };
          console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
          break;
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as { id: string };
          console.log(`PaymentIntent failed: ${paymentIntent.id}`);
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return NextResponse.json({ success: true });
    } catch (stripeError) {
      console.error('Stripe webhook error:', stripeError);
      return NextResponse.json(
        { success: false, error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
