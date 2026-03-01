import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse, getAuthUser } from '@/lib/backend-utils';
import { queueEmail, queueBulkEmails } from '@/lib/queue';

// ==========================================
// POST /api/jobs/email - Queue email job
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'owner') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { to, subject, template, body: emailBody, variables, bulk } = body;

    if (bulk && Array.isArray(to)) {
      const emails = to.map((recipient: { email?: string; variables?: Record<string, unknown> } | string) => ({
        to: typeof recipient === 'string' ? recipient : recipient.email || '',
        subject,
        template,
        body: emailBody,
        variables: typeof recipient === 'object' ? recipient.variables : undefined,
      }));

      const jobs = await queueBulkEmails(emails);
      return successResponse({
        message: `Queued ${jobs.length} emails`,
        jobId: jobs[0]?.id,
      });
    }

    if (!to || !subject) {
      return errorResponse('Recipient and subject are required', 400);
    }

    const job = await queueEmail({
      to,
      subject,
      template,
      body: emailBody,
      variables,
    });

    return successResponse({
      message: 'Email queued successfully',
      jobId: job.id,
    });
  } catch (error) {
    console.error('Queue email error:', error);
    return errorResponse('Failed to queue email', 500);
  }
}
