import { NextRequest, NextResponse } from 'next/server';

// Email notification types
interface EmailNotification {
  to: string;
  subject: string;
  template: 'welcome' | 'payment_confirm' | 'project_update' | 'website_ready';
  data: Record<string, unknown>;
}

// Generate email HTML
function generateEmailHTML(template: string, data: Record<string, unknown>): string {
  const baseStyles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
      .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
      .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    </style>
  `;

  const templates: Record<string, string> = {
    welcome: `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <h1>Welcome to WebFinder!</h1>
        </div>
        <div class="content">
          <h2>Hello ${(data.businessName as string) || 'there'}!</h2>
          <p>Thank you for choosing WebFinder for your website development needs. We're excited to help you establish your online presence.</p>
          <p>Here's what happens next:</p>
          <ul>
            <li>Our team will review your requirements</li>
            <li>We'll create a custom website design</li>
            <li>You'll receive a preview link to review</li>
            <li>After your approval, we'll launch your website</li>
          </ul>
          <a href="${data.dashboardUrl || '#'}" class="button">View Your Project</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} WebFinder. All rights reserved.</p>
        </div>
      </div>
    `,
    payment_confirm: `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <h1>Payment Confirmed! ✓</h1>
        </div>
        <div class="content">
          <h2>Thank you, ${(data.businessName as string) || 'Valued Customer'}!</h2>
          <p>Your payment of <strong>$${data.amount || '0'}</strong> for the <strong>${data.package || 'Standard'}</strong> package has been received.</p>
          <p><strong>Transaction ID:</strong> ${data.transactionId || 'N/A'}</p>
          <p>We'll start working on your website right away. You can track progress at any time.</p>
          <a href="${data.dashboardUrl || '#'}" class="button">Track Your Project</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} WebFinder. All rights reserved.</p>
        </div>
      </div>
    `,
    project_update: `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <h1>Project Update</h1>
        </div>
        <div class="content">
          <h2>Hello ${(data.businessName as string) || 'there'}!</h2>
          <p>Your website project has been updated:</p>
          <p><strong>Status:</strong> ${data.status || 'In Progress'}</p>
          <p><strong>Update:</strong> ${data.message || 'Your project is progressing well.'}</p>
          <a href="${data.dashboardUrl || '#'}" class="button">View Details</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} WebFinder. All rights reserved.</p>
        </div>
      </div>
    `,
    website_ready: `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <h1>🎉 Your Website is Ready!</h1>
        </div>
        <div class="content">
          <h2>Congratulations, ${(data.businessName as string) || 'Valued Customer'}!</h2>
          <p>Your professional website is now complete and ready for your review!</p>
          <p><strong>Preview URL:</strong> <a href="${data.previewUrl || '#'}">${data.previewUrl || 'Click to preview'}</a></p>
          <p>Please review your website and let us know if you'd like any changes. Once approved, we'll make it live!</p>
          <a href="${data.previewUrl || '#'}" class="button">Preview Website</a>
          <a href="${data.approveUrl || '#'}" class="button" style="background: #10b981; margin-left: 10px;">Approve & Go Live</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} WebFinder. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return templates[template] || templates.welcome;
}

// Send email notification (mock implementation)
export async function POST(request: NextRequest) {
  try {
    const body: EmailNotification = await request.json();
    const { to, subject, template, data } = body;

    if (!to || !subject || !template) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: to, subject, template' },
        { status: 400 }
      );
    }

    // Generate email HTML
    const html = generateEmailHTML(template, data);

    // In production, this would send via SendGrid, Resend, etc.
    // For now, we'll simulate the send
    console.log('📧 Email Notification:');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Template: ${template}`);

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return success with preview
    return NextResponse.json({
      success: true,
      message: 'Email notification sent successfully',
      preview: {
        to,
        subject,
        template,
        html: html.slice(0, 500) + '...', // Truncated preview
      },
    });
  } catch (error) {
    console.error('Email notification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email notification' },
      { status: 500 }
    );
  }
}

// Get email preview
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const template = searchParams.get('template') || 'welcome';
    const businessName = searchParams.get('businessName') || 'Your Business';

    const html = generateEmailHTML(template, { businessName });

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}
