// ==========================================
// WEBFINDER AI - JOB PROCESSORS
// ==========================================

import { Worker, Job } from 'bullmq';
import { redisConnection, emailQueue, discoverQueue, deploymentQueue, notificationQueue, reportQueue, webhookQueue, cleanupQueue } from './index';
import { db } from '../backend-utils';
import { emitNotification, emitDeploymentStatus, emitToWorkspace } from '../websocket/server';

// ==========================================
// EMAIL WORKER
// ==========================================

export const emailWorker = new Worker(
  'email',
  async (job: Job) => {
    const { to, subject, template, body, variables } = job.data;

    console.log(`[Email Worker] Processing job ${job.id}: Sending to ${to}`);

    try {
      // In production, integrate with actual email service:
      // - SendGrid
      // - AWS SES
      // - Mailgun
      // - Nodemailer

      // Mock email sending for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Email Worker] DEV MODE - Would send email:`);
        console.log(`  To: ${to}`);
        console.log(`  Subject: ${subject}`);
        console.log(`  Template: ${template || 'custom'}`);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));

        return { success: true, messageId: `mock-${Date.now()}` };
      }

      // Production email sending
      // Example with a hypothetical email service:
      // const result = await emailService.send({
      //   to,
      //   subject,
      //   template,
      //   body,
      //   variables,
      // });

      return { success: true, sentAt: new Date().toISOString() };
    } catch (error) {
      console.error(`[Email Worker] Failed to send email to ${to}:`, error);
      throw error; // This will trigger retry
    }
  },
  {
    connection: redisConnection,
    concurrency: 5, // Process 5 emails at a time
  }
);

emailWorker.on('completed', (job) => {
  console.log(`[Email Worker] Job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`[Email Worker] Job ${job?.id} failed:`, err.message);
});

// ==========================================
// DISCOVER WORKER
// ==========================================

export const discoverWorker = new Worker(
  'discover',
  async (job: Job) => {
    const { location, radius, category, userId } = job.data;

    console.log(`[Discover Worker] Processing search for: ${location}`);

    try {
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      
      if (!apiKey) {
        throw new Error('Google Places API key not configured');
      }

      // Build search query
      const searchQuery = category ? `${category} in ${location}` : location;
      const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`;

      // Update job progress
      await job.updateProgress(10);

      // Make API request
      const response = await fetch(textSearchUrl);
      const data = await response.json();

      await job.updateProgress(50);

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      const results = data.results || [];
      let businessesCreated = 0;
      let leadsCreated = 0;

      // Process results
      for (const place of results) {
        // Check if exists
        let business = await db.business.findUnique({
          where: { placeId: place.place_id }
        });

        if (!business) {
          const hasWebsite = !!place.website;

          // Create business
          business = await db.business.create({
            data: {
              placeId: place.place_id,
              name: place.name,
              address: place.formatted_address,
              rating: place.rating || null,
              reviewCount: place.user_ratings_total || null,
              latitude: place.geometry?.location?.lat,
              longitude: place.geometry?.location?.lng,
              category: place.types?.[0] || category || 'unknown',
              website: place.website || null,
              hasWebsite,
              websiteStatus: hasWebsite ? 'active' : 'no_website',
            }
          });

          businessesCreated++;

          // Create lead if no website
          if (!hasWebsite) {
            await db.lead.create({
              data: {
                businessId: business.id,
                businessName: business.name,
                businessAddress: business.address,
                businessCategory: business.category,
                source: 'discover',
                status: 'new',
                priority: business.rating && business.rating >= 4 ? 'high' : 'medium',
              }
            });

            leadsCreated++;
          }
        }
      }

      await job.updateProgress(100);

      // Emit notification to user
      emitNotification(userId, {
        type: 'search_complete',
        title: 'Search Complete',
        description: `Found ${results.length} businesses, ${leadsCreated} new leads`,
        metadata: { location, businessesCreated, leadsCreated }
      });

      return {
        success: true,
        totalResults: results.length,
        businessesCreated,
        leadsCreated,
      };
    } catch (error) {
      console.error(`[Discover Worker] Search failed:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 2, // Limit concurrent API calls
  }
);

discoverWorker.on('completed', (job) => {
  console.log(`[Discover Worker] Job ${job.id} completed`);
});

discoverWorker.on('failed', (job, err) => {
  console.error(`[Discover Worker] Job ${job?.id} failed:`, err.message);
});

// ==========================================
// DEPLOYMENT WORKER
// ==========================================

export const deploymentWorker = new Worker(
  'deployment',
  async (job: Job) => {
    const { workspaceId, projectId, domain, framework } = job.data;

    console.log(`[Deployment Worker] Starting deployment for: ${domain}`);

    try {
      // Update deployment status
      await job.updateProgress(5);

      // Simulate deployment stages
      const stages = [
        { name: 'Initializing', progress: 10 },
        { name: 'Cloning repository', progress: 20 },
        { name: 'Installing dependencies', progress: 40 },
        { name: 'Building application', progress: 60 },
        { name: 'Running tests', progress: 70 },
        { name: 'Deploying to CDN', progress: 85 },
        { name: 'Configuring SSL', progress: 95 },
        { name: 'Live', progress: 100 },
      ];

      for (const stage of stages) {
        await job.updateProgress(stage.progress);
        await job.log(`${stage.name}...`);

        // Emit status update
        emitDeploymentStatus(workspaceId, {
          id: job.id!,
          status: stage.name.toLowerCase().replace(' ', '_'),
          domain,
        });

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Update database
      await db.deployment.updateMany({
        where: { projectId },
        data: {
          status: 'live',
          lastDeployed: new Date(),
          sslEnabled: true,
          cdnEnabled: true,
        }
      });

      // Update workspace
      await db.workspace.update({
        where: { id: workspaceId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          websiteUrl: `https://${domain}`,
        }
      });

      // Emit final status
      emitDeploymentStatus(workspaceId, {
        id: job.id!,
        status: 'live',
        domain,
      });

      return {
        success: true,
        url: `https://${domain}`,
        deployedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`[Deployment Worker] Deployment failed:`, error);

      // Update status to failed
      emitDeploymentStatus(workspaceId, {
        id: job.id!,
        status: 'failed',
        domain,
      });

      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 1, // One deployment at a time
  }
);

deploymentWorker.on('completed', (job) => {
  console.log(`[Deployment Worker] Job ${job.id} completed`);
});

deploymentWorker.on('failed', (job, err) => {
  console.error(`[Deployment Worker] Job ${job?.id} failed:`, err.message);
});

// ==========================================
// NOTIFICATION WORKER
// ==========================================

export const notificationWorker = new Worker(
  'notification',
  async (job: Job) => {
    const { userId, type, title, description, actionUrl, actionLabel, metadata } = job.data;

    console.log(`[Notification Worker] Sending notification to user: ${userId}`);

    try {
      // Save notification to database
      const notification = await db.notification.create({
        data: {
          userId,
          type,
          title,
          description,
          actionUrl,
          actionLabel,
          metadata: metadata ? JSON.stringify(metadata) : null,
        }
      });

      // Emit real-time notification via WebSocket
      emitNotification(userId, {
        type,
        title,
        description,
        actionUrl,
        actionLabel,
        metadata,
      });

      return { success: true, notificationId: notification.id };
    } catch (error) {
      console.error(`[Notification Worker] Failed:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 10,
  }
);

notificationWorker.on('completed', (job) => {
  console.log(`[Notification Worker] Job ${job.id} completed`);
});

notificationWorker.on('failed', (job, err) => {
  console.error(`[Notification Worker] Job ${job?.id} failed:`, err.message);
});

// ==========================================
// REPORT WORKER
// ==========================================

export const reportWorker = new Worker(
  'report',
  async (job: Job) => {
    const { type, userId, dateRange } = job.data;

    console.log(`[Report Worker] Generating ${type} report for user: ${userId}`);

    try {
      const startDate = dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = dateRange?.end || new Date();

      // Gather data
      const [projects, leads, revenue, analytics] = await Promise.all([
        db.workspace.findMany({
          where: {
            createdAt: { gte: startDate, lte: endDate },
          },
        }),
        db.lead.findMany({
          where: {
            createdAt: { gte: startDate, lte: endDate },
          },
        }),
        db.revenue.findMany({
          where: {
            createdAt: { gte: startDate, lte: endDate },
          },
        }),
        db.analyticsEvent.findMany({
          where: {
            createdAt: { gte: startDate, lte: endDate },
          },
        }),
      ]);

      // Generate report
      const report = {
        type,
        period: { start: startDate, end: endDate },
        summary: {
          totalProjects: projects.length,
          completedProjects: projects.filter(p => p.status === 'completed').length,
          totalLeads: leads.length,
          convertedLeads: leads.filter(l => l.status === 'converted').length,
          totalRevenue: revenue.reduce((sum, r) => sum + r.amount, 0),
          totalPageViews: analytics.filter(a => a.eventType === 'page_view').length,
        },
        generatedAt: new Date().toISOString(),
      };

      // Emit notification
      emitNotification(userId, {
        type: 'report_ready',
        title: 'Report Ready',
        description: `Your ${type} report is ready to view`,
        metadata: report,
      });

      return { success: true, report };
    } catch (error) {
      console.error(`[Report Worker] Failed:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 2,
  }
);

reportWorker.on('completed', (job) => {
  console.log(`[Report Worker] Job ${job.id} completed`);
});

reportWorker.on('failed', (job, err) => {
  console.error(`[Report Worker] Job ${job?.id} failed:`, err.message);
});

// ==========================================
// WEBHOOK WORKER
// ==========================================

export const webhookWorker = new Worker(
  'webhook',
  async (job: Job) => {
    const { source, event, payload } = job.data;

    console.log(`[Webhook Worker] Processing ${source} webhook: ${event}`);

    try {
      // Process different webhook sources
      switch (source) {
        case 'stripe':
          await processStripeWebhook(event, payload);
          break;
        case 'github':
          await processGitHubWebhook(event, payload);
          break;
        case 'vercel':
          await processVercelWebhook(event, payload);
          break;
        default:
          console.log(`[Webhook Worker] Unknown source: ${source}`);
      }

      return { success: true, processedAt: new Date().toISOString() };
    } catch (error) {
      console.error(`[Webhook Worker] Failed:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

async function processStripeWebhook(event: string, payload: Record<string, unknown>): Promise<void> {
  console.log(`[Webhook] Processing Stripe event: ${event}`);

  // Handle Stripe events
  if (event === 'payment_intent.succeeded') {
    const paymentIntent = payload.data as Record<string, unknown>;
    const metadata = paymentIntent?.metadata as Record<string, string> | undefined;

    if (metadata?.workspaceId) {
      // Update payment status
      await db.workspace.update({
        where: { id: metadata.workspaceId },
        data: { paymentStatus: 'paid' }
      });

      // Create revenue record
      await db.revenue.create({
        data: {
          amount: paymentIntent?.amount as number / 100,
          currency: (paymentIntent?.currency as string) || 'usd',
          source: 'project',
          workspaceId: metadata.workspaceId,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        }
      });
    }
  }
}

async function processGitHubWebhook(event: string, payload: Record<string, unknown>): Promise<void> {
  console.log(`[Webhook] Processing GitHub event: ${event}`);
  // Handle GitHub events (push, PR, etc.)
}

async function processVercelWebhook(event: string, payload: Record<string, unknown>): Promise<void> {
  console.log(`[Webhook] Processing Vercel event: ${event}`);
  // Handle Vercel deployment events
}

webhookWorker.on('completed', (job) => {
  console.log(`[Webhook Worker] Job ${job.id} completed`);
});

webhookWorker.on('failed', (job, err) => {
  console.error(`[Webhook Worker] Job ${job?.id} failed:`, err.message);
});

// ==========================================
// CLEANUP WORKER
// ==========================================

export const cleanupWorker = new Worker(
  'cleanup',
  async (job: Job) => {
    const { type, olderThan } = job.data;

    console.log(`[Cleanup Worker] Running cleanup: ${type}`);

    try {
      let deleted = 0;

      switch (type) {
        case 'sessions':
          const expiredSessions = await db.session.deleteMany({
            where: { expiresAt: { lt: olderThan } }
          });
          deleted = expiredSessions.count;
          break;

        case 'tokens':
          const expiredTokens = await db.refreshToken.deleteMany({
            where: { 
              expiresAt: { lt: olderThan },
              revoked: true,
            }
          });
          deleted = expiredTokens.count;
          break;

        case 'logs':
          const oldLogs = await db.activityLog.deleteMany({
            where: { createdAt: { lt: olderThan } }
          });
          deleted = oldLogs.count;
          break;

        default:
          console.log(`[Cleanup Worker] Unknown type: ${type}`);
      }

      return { success: true, deleted };
    } catch (error) {
      console.error(`[Cleanup Worker] Failed:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 1,
  }
);

cleanupWorker.on('completed', (job) => {
  console.log(`[Cleanup Worker] Job ${job.id} completed`);
});

cleanupWorker.on('failed', (job, err) => {
  console.error(`[Cleanup Worker] Job ${job?.id} failed:`, err.message);
});

// ==========================================
// START ALL WORKERS
// ==========================================

export function startAllWorkers(): void {
  console.log('[Workers] Starting all workers...');
  console.log('[Workers] Email worker started');
  console.log('[Workers] Discover worker started');
  console.log('[Workers] Deployment worker started');
  console.log('[Workers] Notification worker started');
  console.log('[Workers] Report worker started');
  console.log('[Workers] Webhook worker started');
  console.log('[Workers] Cleanup worker started');
  console.log('[Workers] All workers started successfully');
}

export function stopAllWorkers(): void {
  console.log('[Workers] Stopping all workers...');
  emailWorker.close();
  discoverWorker.close();
  deploymentWorker.close();
  notificationWorker.close();
  reportWorker.close();
  webhookWorker.close();
  cleanupWorker.close();
  console.log('[Workers] All workers stopped');
}

export default {
  emailWorker,
  discoverWorker,
  deploymentWorker,
  notificationWorker,
  reportWorker,
  webhookWorker,
  cleanupWorker,
  startAllWorkers,
  stopAllWorkers,
};
